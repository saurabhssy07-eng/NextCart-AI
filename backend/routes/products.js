import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductsByCategory,
} from '../controllers/productController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/category/:categoryId', getProductsByCategory);
router.get('/:id', getProductById);

// Protected routes (Admin only)
router.post('/', protect, restrictTo('ADMIN', 'SUPER_ADMIN'), createProduct);
router.put('/:id', protect, restrictTo('ADMIN', 'SUPER_ADMIN'), updateProduct);
router.delete('/:id', protect, restrictTo('ADMIN', 'SUPER_ADMIN'), deleteProduct);

export default router;
