import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'hetanshwantsmore@gmail.com',
    pass: 'xkjayilutsqnpspp', // App Password from test-smtp.ts
  },
  tls: {
    rejectUnauthorized: false
  }
});

const otp = Math.floor(100000 + Math.random() * 900000).toString();

const mailOptions = {
  from: '"TransitOps" <hetanshwantsmore@gmail.com>',
  to: 'tanish.s4@ahduni.edu.in', // Target email from test-smtp.ts
  subject: 'Verify your TransitOps Account',
  html: `
    <h2>Welcome to TransitOps, Test User!</h2>
    <p>Please verify your email address to complete your registration.</p>
    <p>Your OTP code is: <strong>${otp}</strong></p>
    <p>This code will expire in 10 minutes.</p>
  `,
};

async function sendMail() {
  try {
    console.log('Sending OTP email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('OTP Email sent successfully! Message ID:', info.messageId);
    console.log('OTP Code sent was:', otp);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

sendMail();
