import { razorpay, verifyRazorpaySignature } from '../utils/razorpay.js';
import { Order } from '../models/index.js';
import Email from '../utils/email.js';

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
    order.timeline.push({
      status: 'Confirmed',
      title: 'Payment Successful',
      description: 'Payment was successfully received via Razorpay.',
      actor: 'System'
    });

    await order.save();
    
    await order.populate('user', 'firstName lastName email');
    const estDeliveryDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    new Email(order.user).sendPaymentSuccess(order, estDeliveryDate).catch(err => console.error('Failed to send payment success email:', err));
    
    return order;
  }
}

export default new PaymentService();
