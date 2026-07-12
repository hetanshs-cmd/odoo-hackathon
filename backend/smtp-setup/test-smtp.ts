import * as nodemailer from 'nodemailer';
import { SentMessageInfo } from 'nodemailer';

// 1. Configure the Gmail SMTP transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Fixed host from '://gmail.com' to 'smtp.gmail.com'
  port: 587,
  secure: false, // true for port 465, false for port 587
  auth: {
    user: 'svbsoft12@gmail.com',
    pass: 'jxfrajawjmvzicop', // Must be a Google App Password
  },
});

// 2. Define the email options
const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit random OTP

const mailOptions: nodemailer.SendMailOptions = {
  from: '"Transitops" <hetanshwantsmore@gmail.com>',
  to: 'tanish.s4@ahduni.edu.in',
  subject: 'Verify your TransitOps Account',
  html: `
    <h2>Welcome to TransitOps!</h2>
    <p>Please verify your email address to complete your registration.</p>
    <p>Your OTP code is: <strong>${otp}</strong></p>
    <p>This code will expire in 10 minutes.</p>
  `,
};

// 3. Send the email using async/await
async function sendMail(): Promise<void> {
  try {
    const info: SentMessageInfo = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully! Message ID:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

sendMail();
