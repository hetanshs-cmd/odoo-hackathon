import * as nodemailer from 'nodemailer';
import { env } from '../config/env';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for port 465, false for port 587
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  /**
   * Sends an OTP email to the user.
   */
  async sendOtpEmail(
    toEmail: string,
    userName: string,
    otp: string,
    purpose: 'registration' | 'password_reset' | 'login',
  ) {
    let subject = '';
    let htmlContent = '';

    if (purpose === 'registration') {
      subject = 'Verify your TransitOps Account';
      htmlContent = `
        <h2>Welcome to TransitOps, ${userName}!</h2>
        <p>Please verify your email address to complete your registration.</p>
        <p>Your OTP code is: <strong>${otp}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      `;
    } else if (purpose === 'password_reset') {
      subject = 'TransitOps Password Reset';
      htmlContent = `
        <h2>Hello ${userName},</h2>
        <p>We received a request to reset your password.</p>
        <p>Your password reset OTP code is: <strong>${otp}</strong></p>
        <p>This code will expire in 10 minutes. If you did not request a password reset, please ignore this email.</p>
      `;
    } else if (purpose === 'login') {
      subject = 'TransitOps Login Verification';
      htmlContent = `
        <h2>Hello ${userName},</h2>
        <p>A login attempt was made on your TransitOps account.</p>
        <p>Your login OTP code is: <strong>${otp}</strong></p>
        <p>This code will expire in 10 minutes. If you did not attempt to log in, please change your password immediately.</p>
      `;
    }

    const mailOptions: nodemailer.SendMailOptions = {
      from: `"TransitOps" <${env.SMTP_USER}>`,
      to: toEmail,
      subject,
      html: htmlContent,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      // eslint-disable-next-line no-console
      console.log(`[EmailService] Sent ${purpose} OTP email to ${toEmail}`);
    } catch (error) {
      console.error(`[EmailService] Failed to send email to ${toEmail}:`, error);
      // Depending on requirements, we might want to throw the error to bubble it up,
      // but for now logging it is safer so the API request doesn't completely fail just because of an email error.
    }
  }
}

export const emailService = new EmailService();
