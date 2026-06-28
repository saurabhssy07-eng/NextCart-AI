import express from 'express';
import { check } from 'express-validator';
import { validateRequest } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import * as userController from '../controllers/userController.js';

const router = express.Router();

// All user routes require authentication
router.use(protect);

// ==========================================
// PROFILE ROUTES
// ==========================================

const profileValidation = [
  check('firstName', 'First name is required').notEmpty().trim(),
  check('lastName', 'Last name is required').notEmpty().trim(),
  check('phone')
    .optional({ checkFalsy: true })
    .matches(/^[0-9]{10}$/).withMessage('Phone number must contain exactly 10 digits'),
  check('gender')
    .optional()
    .isIn(['Male', 'Female', 'Other', 'Prefer not to say']).withMessage('Invalid gender selection'),
  check('bio')
    .optional()
    .isLength({ max: 300 }).withMessage('Bio cannot exceed 300 characters'),
  check('dateOfBirth')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Invalid date format for Date of Birth'),
  validateRequest
];

router.put('/profile', profileValidation, userController.updateProfile);

// Avatar uploads
router.post('/profile/avatar', upload.single('avatar'), userController.uploadAvatar);
router.delete('/profile/avatar', userController.deleteAvatar);

// ==========================================
// ADDRESS MANAGEMENT ROUTES
// ==========================================

const addressValidation = [
  check('street', 'Street is required').notEmpty().trim(),
  check('city', 'City is required').notEmpty().trim(),
  check('state', 'State is required').notEmpty().trim(),
  check('zipCode', 'Zip Code is required').notEmpty().trim(),
  check('label')
    .optional()
    .isIn(['Home', 'Office', 'Other']).withMessage('Label must be Home, Office, or Other'),
  validateRequest
];

router.post('/addresses', addressValidation, userController.addAddress);
router.put('/addresses/:id', addressValidation, userController.updateAddress);
router.delete('/addresses/:id', userController.deleteAddress);
router.put('/addresses/:id/default', [
  check('type').isIn(['billing', 'shipping']).withMessage('Type must be billing or shipping'),
  validateRequest
], userController.setDefaultAddress);

// ==========================================
// WISHLIST ROUTES
// ==========================================

router.post('/wishlist', userController.toggleWishlist);
router.get('/wishlist', userController.getWishlist);

export default router;
