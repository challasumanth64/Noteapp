import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpEmail = async (email: string, otp: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your NoteApp OTP Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #4f46e5;">🔐 One-Time Password (OTP)</h2>
        <p>Hello,</p>
        <p>Your verification code for NoteApp is:</p>
        <h1 style="font-size: 32px; letter-spacing: 8px; color: #4f46e5; text-align: center;">${otp}</h1>
        <p><strong>This code expires in 10 minutes.</strong></p>
        <p>If you didn’t request this, please ignore this email.</p>
        <br>
        <p>Best regards,<br><strong>The NoteApp Team</strong></p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};