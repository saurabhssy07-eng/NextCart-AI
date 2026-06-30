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
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async send(template, subject, text) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: text + `\n\nLink: ${this.url}`,
    };

    try {
      const transporter = this.newTransport();
      await transporter.sendMail(mailOptions);
      console.log(`✉️ Email sent successfully to ${this.to}`);
    } catch (error) {
      console.error(`⚠️ Error sending email:`, error.message);
      throw error;
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

    try {
      const transporter = this.newTransport();
      await transporter.sendMail(mailOptions);
      console.log(`✉️ HTML Email sent successfully to ${this.to}`);
    } catch (error) {
      console.error(`⚠️ Error sending HTML email:`, error.message);
      throw error;
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
