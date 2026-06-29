import config from '../config/env.js';

const generateFooter = () => `
  <div style="margin-top: 40px; border-top: 1px solid #eaeaea; padding-top: 20px; text-align: center; font-size: 12px; color: #666;">
    <p style="margin: 0 0 10px;">Need help? <a href="mailto:support@nextcart.ai" style="color: #2563EB; text-decoration: none;">support@nextcart.ai</a></p>
    <p style="margin: 0 0 10px;">
      <a href="${config.frontendUrl}/privacy" style="color: #666; text-decoration: none;">Privacy Policy</a> | 
      <a href="${config.frontendUrl}/terms" style="color: #666; text-decoration: none;">Terms</a>
    </p>
    <p style="margin: 0;">&copy; ${new Date().getFullYear()} NextCart AI. All rights reserved.</p>
  </div>
`;

const generateOrderSummaryHTML = (order) => {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid #eaeaea;">
        <span style="font-weight: 500;">${item.product?.name || 'Product'}</span><br>
        <span style="font-size: 12px; color: #666;">Qty: ${item.quantity}</span>
      </td>
      <td style="padding: 10px 0; border-bottom: 1px solid #eaeaea; text-align: right; font-weight: 500;">
        ₹${(item.price * item.quantity).toLocaleString('en-IN')}
      </td>
    </tr>
  `).join('');

  return `
    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #111827;">Order Summary</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
        ${itemsHtml}
      </table>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 5px 0; color: #4B5563;">Subtotal</td>
          <td style="padding: 5px 0; text-align: right;">₹${order.orderSummary.subtotal.toLocaleString('en-IN')}</td>
        </tr>
        ${order.orderSummary.discount > 0 ? `
        <tr>
          <td style="padding: 5px 0; color: #059669;">Discount</td>
          <td style="padding: 5px 0; text-align: right; color: #059669;">-₹${order.orderSummary.discount.toLocaleString('en-IN')}</td>
        </tr>` : ''}
        <tr>
          <td style="padding: 5px 0; color: #4B5563;">Shipping</td>
          <td style="padding: 5px 0; text-align: right; color: #059669;">FREE</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #4B5563;">Tax</td>
          <td style="padding: 5px 0; text-align: right;">₹${order.orderSummary.tax.toLocaleString('en-IN')}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: bold; border-top: 1px solid #eaeaea;">Total</td>
          <td style="padding: 10px 0; text-align: right; font-weight: bold;">₹${order.orderSummary.total.toLocaleString('en-IN')}</td>
        </tr>
      </table>
    </div>
  `;
};

const generateCTAs = (orderId) => `
  <div style="margin: 30px 0; text-align: center;">
    <a href="${config.frontendUrl}/orders/${orderId}" style="display: inline-block; background-color: #2563EB; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; margin-right: 10px; margin-bottom: 10px;">Track Order</a>
    <a href="${config.frontendUrl}/api/orders/${orderId}/invoice" style="display: inline-block; background-color: #ffffff; color: #374151; border: 1px solid #d1d5db; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; margin-right: 10px; margin-bottom: 10px;">Download Invoice</a>
    <a href="${config.frontendUrl}/products" style="display: inline-block; background-color: #ffffff; color: #374151; border: 1px solid #d1d5db; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; margin-bottom: 10px;">Continue Shopping</a>
  </div>
`;

export const orderConfirmationTemplate = (order, user, estimatedDelivery) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #111827;">Thank you for shopping with NextCart AI</h2>
      <p>Hi ${user.firstName},</p>
      <p>We have received your order <strong>${order.orderNumber}</strong>. We'll send you another email when it ships.</p>
      
      <div style="margin: 20px 0; padding: 15px; border-left: 4px solid #2563EB; background: #f3f4f6;">
        <strong>Estimated Delivery:</strong> ${estimatedDelivery}
      </div>

      ${generateOrderSummaryHTML(order)}
      ${generateCTAs(order._id)}
      ${generateFooter()}
    </div>
  `;
};

export const paymentSuccessTemplate = (order, user, estimatedDelivery) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #059669;">Payment Successful</h2>
      <p>Hi ${user.firstName},</p>
      <p>We've received your payment for order <strong>${order.orderNumber}</strong>. We're now processing your items.</p>
      
      <div style="margin: 20px 0; padding: 15px; border-left: 4px solid #059669; background: #ecfdf5;">
        <strong>Amount Paid:</strong> ₹${order.orderSummary.total.toLocaleString('en-IN')}<br>
        <strong>Transaction ID:</strong> ${order.payment?.razorpayPaymentId || 'N/A'}
      </div>

      ${generateOrderSummaryHTML(order)}
      ${generateCTAs(order._id)}
      ${generateFooter()}
    </div>
  `;
};

export const packedTemplate = (order, user) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #111827;">Your order is packed! 📦</h2>
      <p>Hi ${user.firstName},</p>
      <p>Good news! Order <strong>${order.orderNumber}</strong> has been packed and is waiting for courier pickup.</p>
      ${generateCTAs(order._id)}
      ${generateFooter()}
    </div>
  `;
};

export const shippedTemplate = (order, user) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #111827;">Your order is on the way! 🚚</h2>
      <p>Hi ${user.firstName},</p>
      <p>Your order <strong>${order.orderNumber}</strong> has been shipped.</p>
      ${order.trackingNumber ? `
        <div style="margin: 20px 0; padding: 15px; border-left: 4px solid #8b5cf6; background: #f5f3ff;">
          <strong>Courier:</strong> ${order.courier || 'Standard Shipping'}<br>
          <strong>Tracking Number:</strong> ${order.trackingNumber}
        </div>
      ` : ''}
      ${generateCTAs(order._id)}
      ${generateFooter()}
    </div>
  `;
};

export const deliveredTemplate = (order, user) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #059669;">Order Delivered! 🎉</h2>
      <p>Hi ${user.firstName},</p>
      <p>Your order <strong>${order.orderNumber}</strong> has been delivered. We hope you love your purchase!</p>
      ${generateCTAs(order._id)}
      ${generateFooter()}
    </div>
  `;
};

export const cancelledTemplate = (order, user) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #dc2626;">Order Cancelled</h2>
      <p>Hi ${user.firstName},</p>
      <p>Your order <strong>${order.orderNumber}</strong> has been cancelled as requested.</p>
      <p>If you have already paid, a refund will be initiated shortly.</p>
      ${generateCTAs(order._id)}
      ${generateFooter()}
    </div>
  `;
};

export const refundedTemplate = (order, user) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #059669;">Refund Initiated</h2>
      <p>Hi ${user.firstName},</p>
      <p>We have successfully processed a refund of ₹${order.orderSummary.total.toLocaleString('en-IN')} for your cancelled order <strong>${order.orderNumber}</strong>.</p>
      <p>It may take 5-7 business days for the amount to reflect in your account.</p>
      ${generateFooter()}
    </div>
  `;
};
