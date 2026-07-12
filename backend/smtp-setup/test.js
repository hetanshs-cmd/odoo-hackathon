const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // TLS
  auth: {
    user: 'hetanshwantsmore@gmail.com',
    pass: 'xkjayilutsqnpspp', // Using the password you confirmed is correct
  },
  logger: true,
  debug: true,
  tls: {
    rejectUnauthorized: false
  }
});

const otp = Math.floor(100000 + Math.random() * 900000).toString();

const mailOptions = {
  from: '"TransitOps" <hetanshwantsmore@gmail.com>',
  to: 'tanish.s4@ahduni.edu.in',
  subject: 'Verify your TransitOps Account',
  html: `
    <h2>Welcome to TransitOps!</h2>
    <p>Please verify your email address to complete your registration.</p>
    <p>Your OTP code is: <strong>${otp}</strong></p>
    <p>This code will expire in 10 minutes.</p>
  `,
};

console.log('Attempting to connect to SMTP server...');
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('\n--- SEND FAILED ---');
    console.error(error);
  } else {
    console.log('\n--- SEND SUCCESSFUL ---');
    console.log('Message ID: %s', info.messageId);
  }
});
