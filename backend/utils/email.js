import nodemailer from 'nodemailer';
import config from '../config/env.js';

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

    const transporter = this.newTransport();
    const info = await transporter.sendMail(mailOptions);
    
    console.log(`✉️ Email sent: ${nodemailer.getTestMessageUrl(info)}`);
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
}

export default Email;
