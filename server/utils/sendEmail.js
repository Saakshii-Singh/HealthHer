import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (toEmail, otp) => {
  await transporter.sendMail({
    from: `"HealthHer 🌸" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Your HealthHer Email Verification Code',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto; padding: 24px; border-radius: 12px; border: 1px solid #f0c0cc;">
        <h2 style="color: #c2185b;">🌸 HealthHer Email Verification</h2>
        <p>Thanks for creating your account! Use the code below to verify your email:</p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #880e4f; margin: 24px 0;">${otp}</div>
        <p style="color: #888;">This code expires in 10 minutes. If you didn't sign up, ignore this email.</p>
      </div>
    `,
  });
};