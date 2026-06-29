import express from 'express';
import { verifyPayment, createRazorpayOrderForRetry, razorpayWebhook } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/orders/:id/verify', protect, verifyPayment);
router.post('/orders/:id/retry', protect, createRazorpayOrderForRetry);
router.post('/webhook', express.json({type: 'application/json'}), razorpayWebhook);

export default router;
