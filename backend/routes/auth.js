import express from 'express';
import { check } from 'express-validator';
import { validateRequest } from '../middleware/validate.js';
import { loginLimiter, forgotPasswordLimiter } from '../middleware/rateLimiter.js';
import { protect } from '../middleware/auth.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

const registerValidation = [
  check('firstName', 'First name is required').not().isEmpty(),
  check('lastName', 'Last name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 8 or more characters').isLength({ min: 8 }),
  check('password', 'Password must contain at least one uppercase, one lowercase, one number and one special character')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
  validateRequest
];

const loginValidation = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
  validateRequest
];

const passwordResetValidation = [
  check('password', 'Please enter a password with 8 or more characters').isLength({ min: 8 }),
  check('password', 'Password must contain at least one uppercase, one lowercase, one number and one special character')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
  validateRequest
];

router.post('/register', registerValidation, authController.register);
router.post('/login', loginLimiter, loginValidation, authController.login);
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);
router.post('/google-login', authController.googleLogin);

router.post('/forgot-password', forgotPasswordLimiter, [
  check('email', 'Please include a valid email').isEmail(),
  validateRequest
], authController.forgotPassword);

router.patch('/reset-password/:token', passwordResetValidation, authController.resetPassword);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/resend-verification', [
  check('email', 'Please include a valid email').isEmail(),
  validateRequest
], authController.resendVerification);

// Protected routes
router.use(protect);
router.get('/me', authController.getMe);

export default router;
