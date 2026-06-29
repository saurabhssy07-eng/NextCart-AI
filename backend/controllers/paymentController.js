import paymentService from '../services/paymentService.js';
import { Order } from '../models/index.js';
import crypto from 'crypto';

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    const order = await paymentService.verifyPaymentAndUpdateOrder(
      req.params.id, 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature
    );

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: order
    });
  } catch (error) {
    console.error('❌ Verify payment error:', error.message);
    res.status(400).json({
      success: false,
      message: error.message || 'Payment verification failed'
    });
  }
};

export const createRazorpayOrderForRetry = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    if (order.paymentStatus !== 'Pending' && order.paymentStatus !== 'Failed') {
      return res.status(400).json({ success: false, message: 'Payment already processed' });
    }

    const razorpayOrder = await paymentService.createRazorpayOrder(order.orderSummary.total, order.orderNumber);
    
    res.status(200).json({
      success: true,
      data: {
        orderId: order._id,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency
      }
    });
  } catch (error) {
    console.error('❌ Retry payment error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create retry payment'
    });
  }
};

// TODO: Implement Razorpay Webhook correctly for future production use
export const razorpayWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'nextcart_webhook_secret_123';
    const signature = req.headers['x-razorpay-signature'];
    
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (digest === signature) {
      console.log('✅ Razorpay webhook verified:', req.body.event);
      // Process webhook event here (e.g., payment.captured, payment.failed)
    } else {
      console.log('❌ Razorpay webhook verification failed');
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('❌ Webhook error:', error.message);
    res.status(500).json({ status: 'error' });
  }
};
