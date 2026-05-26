import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../models/User.js";

function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET || "hh_super_secret_jwt_key_9988", {
    expiresIn: "30d",
  });
}

// Generate 6-digit numeric OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Transporter setup & email dispatcher
async function sendVerificationEmail(email, code) {
  // 1. Try Brevo HTTP API (100% Free, sends to any recipient, requires no custom domain, bypasses port blocks!)
  if (process.env.BREVO_API_KEY) {
    try {
      console.log(`Attempting to send email via Brevo API to: ${email}`);
      const senderEmail = process.env.SMTP_USER || "rajnibala.singh8423@gmail.com";
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sender: { name: "HealthHer Support", email: senderEmail },
          to: [{ email: email }],
          subject: "Verify your HealthHer Account 🌸",
          htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ebdcd9; border-radius: 16px; background-color: #fff9f9;">
              <h2 style="color: #b8586c; text-align: center;">Welcome to HealthHer! 🌸</h2>
              <p>Thank you for joining our community. To complete your account registration, please enter the following 6-digit verification code on the dashboard:</p>
              <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; text-align: center; color: #561d33; background-color: #fff; border: 2px dashed #b8586c; padding: 15px; margin: 20px 0; border-radius: 12px;">
                ${code}
              </div>
              <p style="color: #7c636c; font-size: 13px; text-align: center;">This code is valid for 15 minutes. If you did not request this, you can safely ignore this email.</p>
            </div>
          `,
        }),
      });

      if (res.ok) {
        console.log(`Verification email sent successfully via Brevo to: ${email}`);
        return true;
      } else {
        const errData = await res.json();
        console.error("Brevo API response error:", errData);
      }
    } catch (error) {
      console.error("Error sending email via Brevo API:", error.message);
    }
  }

  // 2. Try Resend Email API (highly reliable, free, and bypasses port blocks!)
  if (process.env.RESEND_API_KEY) {
    try {
      console.log(`Attempting to send email via Resend API to: ${email}`);
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "HealthHer Support <onboarding@resend.dev>",
          to: email,
          subject: "Verify your HealthHer Account 🌸",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ebdcd9; border-radius: 16px; background-color: #fff9f9;">
              <h2 style="color: #b8586c; text-align: center;">Welcome to HealthHer! 🌸</h2>
              <p>Thank you for joining our community. To complete your account registration, please enter the following 6-digit verification code on the dashboard:</p>
              <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; text-align: center; color: #561d33; background-color: #fff; border: 2px dashed #b8586c; padding: 15px; margin: 20px 0; border-radius: 12px;">
                ${code}
              </div>
              <p style="color: #7c636c; font-size: 13px; text-align: center;">This code is valid for 15 minutes. If you did not request this, you can safely ignore this email.</p>
            </div>
          `,
        }),
      });

      if (res.ok) {
        console.log(`Verification email sent successfully via Resend to: ${email}`);
        return true;
      } else {
        const errData = await res.json();
        console.error("Resend API response error:", errData);
      }
    } catch (error) {
      console.error("Error sending email via Resend API:", error.message);
    }
  }

  // 2. Fallback: If SMTP configs exist, use nodemailer
  if (
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  ) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: parseInt(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        connectionTimeout: 5000, // 5 seconds timeout to prevent hanging the HTTP request
        socketTimeout: 5000,
        tls: {
          rejectUnauthorized: false, // Prevents certificate verification blocks
        },
      });

      const mailOptions = {
        from: `"HealthHer Support" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Verify your HealthHer Account 🌸",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ebdcd9; border-radius: 16px; background-color: #fff9f9;">
            <h2 style="color: #b8586c; text-align: center;">Welcome to HealthHer! 🌸</h2>
            <p>Thank you for joining our community. To complete your account registration, please enter the following 6-digit verification code on the dashboard:</p>
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; text-align: center; color: #561d33; background-color: #fff; border: 2px dashed #b8586c; padding: 15px; margin: 20px 0; border-radius: 12px;">
              ${code}
            </div>
            <p style="color: #7c636c; font-size: 13px; text-align: center;">This code is valid for 15 minutes. If you did not request this, you can safely ignore this email.</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Verification email sent successfully to: ${email}`);
      return true;
    } catch (error) {
      console.error(`Error sending email to ${email}:`, error.message);
    }
  }

  // Fallback (or development helper): Log inside terminal with beautiful ANSI border
  console.log(`
┌────────────────────────────────────────────────────────┐
│  🌸 HEALTHHER EMAIL VERIFICATION SERVICE              │
├────────────────────────────────────────────────────────┤
│  Recipient:  \x1b[35m${email.padEnd(41)}\x1b[0m │
│  OTP Code:   \x1b[36m\x1b[1m${code}\x1b[0m (Expires in 15 minutes)     │
├────────────────────────────────────────────────────────┤
│  Copy the OTP above to verify your account in the UI.  │
└────────────────────────────────────────────────────────┘
`);
  return false;
}

// @desc    Register a new user
// @route   POST /api/auth/register
export async function registerUser(req, res) {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please fill in all credentials" });
    }

    // Password strength validation (At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (e.g. @$!%*?&)." 
      });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email has already been registered" });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        const user = await User.create({
      username,
      email,
      password,
      isVerified: true, // Auto-verified: No email verification required!
    });

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isVerified: true,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
export async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide both email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if account is currently locked
    if (user.lockUntil && user.lockUntil > new Date()) {
      const remainingMinutes = Math.ceil((user.lockUntil - new Date()) / (60 * 1000));
      return res.status(403).json({
        message: `This account has been locked temporarily due to excessive login failures. Please try again in ${remainingMinutes} minute(s).`
      });
    }

    if (await user.matchPassword(password)) {
      // Successful login - reset attempts
      user.loginAttempts = 0;
      user.lockUntil = undefined;
      await user.save();

      res.json({
        token: generateToken(user._id),
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          isVerified: user.isVerified,
        },
      });
    } else {
      // Failed login - increment attempts
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      
      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes lockout
        await user.save();
        return res.status(403).json({
          message: "Too many failed login attempts. Your account has been temporarily locked for 5 minutes."
        });
      } else {
        await user.save();
        const attemptsLeft = 5 - user.loginAttempts;
        return res.status(401).json({
          message: `Invalid email or password. You have ${attemptsLeft} login attempt(s) remaining before temporary lockout.`
        });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// @desc    Get user profile
// @route   GET /api/auth/profile
export async function getUserProfile(req, res) {
  try {
    res.json({
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      isVerified: req.user.isVerified,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// @desc    Verify email address using 6-digit OTP
// @route   POST /api/auth/verify-email
export async function verifyEmail(req, res) {
  const { email, code } = req.body;

  try {
    if (!email || !code) {
      return res.status(400).json({ message: "Email and verification code are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    if (user.verificationCodeExpires < new Date()) {
      return res.status(400).json({ message: "Verification code has expired. Please request a new one." });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    res.json({
      message: "Email verified successfully! 🌸",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isVerified: true,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// @desc    Resend verification code OTP
// @route   POST /api/auth/resend-code
export async function resendVerificationCode(req, res) {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.verificationCode = otp;
    user.verificationCodeExpires = otpExpires;
    await user.save();

    const isRealEmailSent = await sendVerificationEmail(user.email, otp);

    res.json({
      message: "Verification code resent successfully! 🌸",
      ...(isRealEmailSent ? {} : { _devVerificationCode: otp }),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
