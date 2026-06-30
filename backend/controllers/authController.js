import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/index.js';
import config from '../config/env.js';
import Email from '../utils/email.js';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signToken = (id, secret, expiresIn, tokenVersion = 0) => {
  return jwt.sign({ id, tokenVersion }, secret, { expiresIn });
};

const createSendToken = (user, statusCode, res, message) => {
  const accessToken = signToken(user._id, config.jwtSecret, '15m', user.tokenVersion);
  const refreshToken = signToken(user._id, config.jwtRefreshSecret, '30d', user.tokenVersion);

  const cookieOptions = {
    expires: new Date(Date.now() + 15 * 60 * 1000), // 15m
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
  };

  const refreshCookieOptions = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30d
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
  };

  res.cookie('accessToken', accessToken, cookieOptions);
  res.cookie('refreshToken', refreshToken, refreshCookieOptions);

  res.status(statusCode).json({
    success: true,
    message,
    user: user.toJSON(),
  });
};

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const newUser = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
    });

    const verifyToken = newUser.createEmailVerificationToken();
    await newUser.save({ validateBeforeSave: false });

    const verifyURL = `${config.frontendUrl}/verify-email/${verifyToken}`;
    try {
      await new Email(newUser, verifyURL).sendVerificationEmail();
    } catch (err) {
      console.log('Error sending verification email', err);
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error registering user', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password +loginAttempts +lockUntil');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (user.isLocked()) {
      return res.status(401).json({ success: false, message: 'Account locked due to too many failed attempts. Try again later.' });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({ success: false, message: 'Please verify your email before logging in.', requiresVerification: true });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      user.loginAttempts += 1;
      if (user.loginAttempts >= 5) {
        user.lockUntil = Date.now() + 15 * 60 * 1000;
      }
      await user.save({ validateBeforeSave: false });
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save({ validateBeforeSave: false });

    // Handle 2FA
    if (user.twoFactorEnabled) {
      console.log(`🔒 2FA Required for: ${user.email}`);
      return res.status(200).json({
        success: true,
        requires2FA: true,
        userId: user._id,
        message: 'Two-factor authentication required',
      });
    }

    console.log(`✅ Login Success: ${user.email}`);
    createSendToken(user, 200, res, 'Login successful');
  } catch (error) {
    console.log(`❌ Login Error:`, error.message);
    res.status(500).json({ success: false, message: 'Error logging in', error: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie('accessToken', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
  });
  res.cookie('refreshToken', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Refresh token is required' });
    }

    const decoded = jwt.verify(token, config.jwtRefreshSecret);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    createSendToken(user, 200, res, 'Token refreshed');
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(400).json({ success: false, message: 'Google Login is currently disabled on the server.' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    
    let user = await User.findOne({ email: payload.email });

    if (!user) {
      user = await User.create({
        firstName: payload.given_name,
        lastName: payload.family_name || ' ',
        email: payload.email,
        googleId: payload.sub,
        isEmailVerified: payload.email_verified,
        avatar: payload.picture,
      });
      console.log(`✅ Google Login (New User): ${user.email}`);
    } else {
      if (!user.googleId) {
        user.googleId = payload.sub;
        await user.save({ validateBeforeSave: false });
      }
      console.log(`✅ Google Login (Existing User): ${user.email}`);
    }

    createSendToken(user, 200, res, 'Google Login successful');
  } catch (error) {
    console.error('Google Login Error:', error.message);
    res.status(401).json({ success: false, message: 'Google authentication failed' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'There is no user with that email address.' });
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${config.frontendUrl}/reset-password/${resetToken}`;

    try {
      await new Email(user, resetURL).sendPasswordReset();
      res.status(200).json({ success: true, message: 'Token sent to email!' });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ success: false, message: 'There was an error sending the email. Try again later!' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error in forgot password' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Token is invalid or has expired' });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    createSendToken(user, 200, res, 'Password reset successful');
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error resetting password' });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Token is invalid or has expired' });
    }

    user.isEmailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error verifying email' });
  }
};

export const resendVerification = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ success: false, message: 'Email is already verified' });
    }

    const verifyToken = user.createEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    const verifyURL = `${config.frontendUrl}/verify-email/${verifyToken}`;
    
    try {
      await new Email(user, verifyURL).sendVerificationEmail();
      res.status(200).json({ success: true, message: 'Verification email resent successfully!' });
    } catch (err) {
      user.verificationToken = undefined;
      user.verificationTokenExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ success: false, message: 'There was an error sending the email. Try again later!' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error resending verification email' });
  }
};

export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const logoutAll = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save({ validateBeforeSave: false });
    
    res.cookie('accessToken', 'loggedout', { expires: new Date(Date.now() + 10 * 1000), httpOnly: true, secure: config.nodeEnv === 'production', sameSite: config.nodeEnv === 'production' ? 'none' : 'lax' });
    res.cookie('refreshToken', 'loggedout', { expires: new Date(Date.now() + 10 * 1000), httpOnly: true, secure: config.nodeEnv === 'production', sameSite: config.nodeEnv === 'production' ? 'none' : 'lax' });
    
    res.status(200).json({ success: true, message: 'Logged out of all devices successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error logging out all devices' });
  }
};

export const generate2FA = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const secret = speakeasy.generateSecret({ length: 20, name: `NextCart AI (${user.email})` });
    
    user.twoFactorSecret = secret.base32;
    await user.save({ validateBeforeSave: false });

    qrcode.toDataURL(secret.otpauth_url, (err, dataUrl) => {
      if (err) return res.status(500).json({ success: false, message: 'Error generating QR code' });
      res.status(200).json({ success: true, qrCodeUrl: dataUrl, secret: secret.base32 });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error setting up 2FA' });
  }
};

export const verify2FA = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user._id).select('+twoFactorSecret');
    
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 1
    });

    if (verified) {
      user.twoFactorEnabled = true;
      await user.save({ validateBeforeSave: false });
      res.status(200).json({ success: true, message: '2FA enabled successfully', user });
    } else {
      res.status(400).json({ success: false, message: 'Invalid 2FA token' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error verifying 2FA' });
  }
};

export const disable2FA = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.twoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, message: '2FA disabled successfully', user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error disabling 2FA' });
  }
};

export const verify2FALogin = async (req, res) => {
  try {
    const { userId, token } = req.body;
    const user = await User.findById(userId).select('+twoFactorSecret');
    
    if (!user || !user.twoFactorEnabled) {
      return res.status(400).json({ success: false, message: '2FA is not enabled for this account' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 1
    });

    if (verified) {
      console.log(`✅ 2FA Login Success: ${user.email}`);
      createSendToken(user, 200, res, 'Login successful');
    } else {
      res.status(401).json({ success: false, message: 'Invalid 2FA code' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error during 2FA login' });
  }
};
