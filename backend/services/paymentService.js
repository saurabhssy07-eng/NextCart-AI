import { razorpay, verifyRazorpaySignature } from '../utils/razorpay.js';
import { Order } from '../models/index.js';

class PaymentService {
  async createRazorpayOrder(amount, receipt) {
    const options = {
      amount: Math.round(amount * 100), // amount in paise
      currency: 'INR',
      receipt: receipt.toString(),
    };
    try {
      const order = await razorpay.orders.create(options);
      return order;
    } catch (error) {
      console.error('Razorpay Error:', error);
      throw new Error('Failed to create Razorpay order');
    }
  }

  async verifyPaymentAndUpdateOrder(orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature) {
    const isValid = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
    if (!isValid) {
      throw new Error('Invalid signature');
    }

    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    order.paymentStatus = 'Paid';
    order.orderStatus = 'Confirmed';
    order.payment = {
      provider: 'razorpay',
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      paidAt: new Date(),
    };

    await order.save();
    return order;
  }
}

export default new PaymentService();
