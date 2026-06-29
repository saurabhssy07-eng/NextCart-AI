import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
  downloadInvoice,
} from '../controllers/orderController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// All order routes require authentication
router.use(protect);

// User routes
router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrderById);
router.get('/:id/invoice', downloadInvoice);
router.put('/:id/cancel', cancelOrder);

// Admin routes
router.get('/admin/all', restrictTo('ADMIN', 'SUPER_ADMIN'), getAllOrders);
router.put('/:id/status', restrictTo('ADMIN', 'SUPER_ADMIN'), updateOrderStatus);

export default router;
