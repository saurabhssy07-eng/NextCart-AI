import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Protected routes (Admin only)
router.post('/', protect, restrictTo('ADMIN', 'SUPER_ADMIN'), createCategory);
router.put('/:id', protect, restrictTo('ADMIN', 'SUPER_ADMIN'), updateCategory);
router.delete('/:id', protect, restrictTo('ADMIN', 'SUPER_ADMIN'), deleteCategory);

export default router;
