import nodemailer from 'nodemailer';
import config from '../config/env.js';
import * as templates from './emailTemplates.js';

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.firstName;
    this.url = url;
    this.from = `NextCart AI <noreply@nextcartai.com>`;
  }

  newTransport() {
    if (config.nodeEnv === 'production') {
      // Setup Resend or SendGrid here later
      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: process.env.ETHEREAL_USER || 'hildegard.gulgowski97@ethereal.email',
            pass: process.env.ETHEREAL_PASS || 'd1H1u5TqN8mH9j7wQW'
        }
      });
    }

    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: process.env.ETHEREAL_USER || 'hildegard.gulgowski97@ethereal.email',
        pass: process.env.ETHEREAL_PASS || 'd1H1u5TqN8mH9j7wQW'
      },
    });
  }

  async send(template, subject, text) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: text + `\n\nLink: ${this.url}`,
    };

    console.log(`\n======================================================`);
    console.log(`🔔 DEVELOPMENT MODE: Email sending bypassed/intercepted`);
    console.log(`To: ${this.to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Action Link: ${this.url}`);
    console.log(`======================================================\n`);

    try {
      const transporter = this.newTransport();
      const info = await transporter.sendMail(mailOptions);
      console.log(`✉️ Ethereal Email sent: ${nodemailer.getTestMessageUrl(info)}`);
    } catch (error) {
      console.log(`⚠️ Note: Could not send via Ethereal (Auth failed), but you can use the Action Link above to proceed.`);
    }
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to NextCart AI!', 'We are glad to have you.');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 15 minutes)',
      'Forgot your password? Click the link to reset your password.'
    );
  }

  async sendVerificationEmail() {
    await this.send(
      'verifyEmail',
      'Verify your email address (valid for 24 hours)',
      'Please click the link to verify your email address.'
    );
  }
  async sendHTML(subject, htmlContent) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html: htmlContent,
    };

    console.log(`\n======================================================`);
    console.log(`🔔 DEVELOPMENT MODE: HTML Email intercepted`);
    console.log(`To: ${this.to}`);
    console.log(`Subject: ${subject}`);
    console.log(`======================================================\n`);

    try {
      const transporter = this.newTransport();
      const info = await transporter.sendMail(mailOptions);
      console.log(`✉️ Ethereal Email Preview: ${nodemailer.getTestMessageUrl(info)}`);
    } catch (error) {
      console.log(`⚠️ Note: Could not send via Ethereal (Auth failed).`);
    }
  }

  async sendOrderConfirmation(order, estimatedDelivery) {
    const html = templates.orderConfirmationTemplate(order, this, estimatedDelivery);
    await this.sendHTML(`Order Confirmation - ${order.orderNumber}`, html);
  }

  async sendPaymentSuccess(order, estimatedDelivery) {
    const html = templates.paymentSuccessTemplate(order, this, estimatedDelivery);
    await this.sendHTML(`Payment Successful - ${order.orderNumber}`, html);
  }

  async sendOrderStatusUpdate(order) {
    let html = '';
    let subject = '';
    switch (order.orderStatus) {
      case 'Packed':
        html = templates.packedTemplate(order, this);
        subject = `Order Packed - ${order.orderNumber}`;
        break;
      case 'Shipped':
        html = templates.shippedTemplate(order, this);
        subject = `Order Shipped - ${order.orderNumber}`;
        break;
      case 'Delivered':
        html = templates.deliveredTemplate(order, this);
        subject = `Order Delivered - ${order.orderNumber}`;
        break;
      case 'Cancelled':
        html = templates.cancelledTemplate(order, this);
        subject = `Order Cancelled - ${order.orderNumber}`;
        break;
      case 'Refunded':
        html = templates.refundedTemplate(order, this);
        subject = `Refund Initiated - ${order.orderNumber}`;
        break;
      default:
        return;
    }
    await this.sendHTML(subject, html);
  }
}

export default Email;
