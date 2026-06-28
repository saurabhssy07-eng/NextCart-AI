import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please provide a first name'],
      trim: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: [true, 'Please provide a last name'],
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      // Not required for Google Login
      required: function() {
        return !this.googleId;
      },
      minlength: 8,
      select: false,
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    phone: {
      type: String,
      default: null,
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
      default: 'Prefer not to say',
    },
    bio: {
      type: String,
      maxlength: [300, 'Bio cannot exceed 300 characters'],
      default: '',
    },
    avatar: {
      publicId: {
        type: String,
        default: null,
      },
      url: {
        type: String,
        default: 'https://via.placeholder.com/150',
      }
    },
    role: {
      type: String,
      enum: ['SUPER_ADMIN', 'ADMIN', 'VENDOR', 'CUSTOMER'],
      default: 'CUSTOMER',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Email verification
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpires: Date,
    // Password reset
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    // Account lock out and rate limiting
    loginAttempts: {
      type: Number,
      default: 0,
      select: false,
    },
    lockUntil: {
      type: Date,
      select: false,
    },
    // Session tracking prep
    sessions: [
      {
        token: String,
        device: String,
        ip: String,
        browser: String,
        lastActive: { type: Date, default: Date.now },
      }
    ],
    addresses: [
      {
        street: { type: String, required: true },
        locality: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, default: 'India' },
        landmark: String,
        label: { type: String, enum: ['Home', 'Office', 'Other'], default: 'Home' },
        isDefaultBilling: { type: Boolean, default: false },
        isDefaultShipping: { type: Boolean, default: false },
      }
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      }
    ],
    detectedLocation: {
      city: String,
      state: String,
      zipCode: String,
    },
    preferences: {
      theme: {
        type: String,
        enum: ['Light', 'Dark', 'System'],
        default: 'System',
      },
      language: {
        type: String,
        enum: ['English', 'Hindi'],
        default: 'English',
      },
      currency: {
        type: String,
        enum: ['INR', 'USD'],
        default: 'INR',
      },
    },
    notifications: {
      marketing: { type: Boolean, default: true },
      orderUpdates: { type: Boolean, default: true },
      securityAlerts: { type: Boolean, default: true },
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only run this if password was actually modified
  if (!this.isModified('password')) return next();
  if (!this.password) return next();

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcryptjs.compare(enteredPassword, this.password);
};

// Check if account is locked
userSchema.methods.isLocked = function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Generate Reset Password Token
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Token valid for 15 minutes
  this.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
  
  return resetToken;
};

// Generate Email Verification Token
userSchema.methods.createEmailVerificationToken = function() {
  const verificationToken = crypto.randomBytes(32).toString('hex');

  this.verificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  // Token valid for 24 hours
  this.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
  
  return verificationToken;
};

// Method to get user without sensitive data
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.loginAttempts;
  delete obj.lockUntil;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  delete obj.verificationToken;
  delete obj.verificationTokenExpires;
  return obj;
};

export default mongoose.model('User', userSchema);
