import * as nodemailer from 'nodemailer';
import { SentMessageInfo } from 'nodemailer';

// 1. Configure the Gmail SMTP transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Fixed host from '://gmail.com' to 'smtp.gmail.com'
  port: 587,
  secure: false, // true for port 465, false for port 587
  auth: {
    user: 'hetanshwantsmore@gmail.com',
    pass: 'qbu xggi hmtq ousr', // Must be a Google App Password
  },
});

// 2. Define the email options
const mailOptions: nodemailer.SendMailOptions = {
  from: '"Transitops" <hetanshwantsmore@gmail.com>',
  to: 'tanish.s4@ahduni.edu.in',
  subject: 'Test Gmail SMTP from TypeScript',
  text: 'Hello! This email was sent using TypeScript and Nodemailer.',
  html: '<b>Hello!</b> This email was sent using TypeScript and Nodemailer.',
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
