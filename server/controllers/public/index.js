import express from "express";
import bcrypt from "bcrypt";
import userModel from "../../models/User.js";
import sendEmail from "../../utils/sendEmail.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
let URL = process.env.URL;

// @route   POST /api/public/register
// @desc    Register a new user
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    // 1. Validate required fields
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ msg: "All fields are required." });
    }

    // 2. Check email duplication
    const existingEmail = await userModel.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ msg: "Email already in use." });
    }

    // 3. Check phone duplication
    const existingPhone = await userModel.findOne({ phone });
    if (existingPhone) {
      return res.status(409).json({ msg: "Phone number already in use." });
    }

    // 4. Hash the password
    const hashedPassword = await bcrypt.hash(password, 11);

    // 5. Generate email & phone verification tokens
    const emailToken = Math.random().toString(36).substring(2);
    const phoneToken = Math.random().toString(36).substring(2);

    // 6. Create and save user
    const newUser = {
      fullName,
      email,
      phone,
      password: hashedPassword,
      userVerifiedToken: {
        email: emailToken,
        phone: phoneToken,
      },
    };

    await userModel.create(newUser);

    let URL = process.env.URL;

    // 7. Send verification email
    const emailPayload = {
      to: email,
      subject: "Verify your email address",
      html: `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Email Verification</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #111827;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #ffffff;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: #1f2937;
          border: 1px solid #3b82f6;
          padding: 40px 30px;
          border-radius: 10px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          color: #ffffff;
        }
        .message {
          font-size: 16px;
          color: #d1d5db;
          line-height: 1.6;
          text-align: center;
        }
        .highlight {
          color: #f472b6;
          font-weight: 600;
        }
        .button-container {
          text-align: center;
          margin-top: 30px;
        }
        .verify-button {
          background-color: #3b82f6;
          color: #ffffff;
          padding: 14px 28px;
          text-decoration: none;
          font-size: 16px;
          font-weight: 600;
          border-radius: 6px;
          display: inline-block;
        }
        .footer {
          margin-top: 40px;
          font-size: 12px;
          color: #9ca3af;
          text-align: center;
        }
        .fallback-link {
          margin-top: 10px;
          font-size: 13px;
          color: #60a5fa;
          word-break: break-all;
        }

        @media (max-width: 600px) {
          body {
            background-color: #f4f4f4;
            color: #111827;
          }
          .container {
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            color: #111827;
          }
          .header h1 {
            color: #111827;
          }
          .message {
            color: #374151;
          }
          .verify-button {
            background-color: #2563eb;
            color: #ffffff;
          }
          .fallback-link {
            color: #2563eb;
          }
          .footer {
            color: #6b7280;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Verify Your Email</h1>
        </div>
        <div class="message">
          <p>Hello <span class="highlight">${fullName}</span>,</p>
          <p>Thanks for signing up. To complete your registration, please confirm your email address by clicking the button below.</p>
        </div>
        <div class="button-container">
          <a href="${URL}/api/public/emailverify/${emailToken}" class="verify-button">Verify Email</a>
          <p class="fallback-link">
            or open this link:<br />
            ${URL}/api/public/emailverify/${emailToken}
          </p>
        </div>
        <div class="footer">
          <p>If you did not create this account, you can safely ignore this message.</p>
        </div>
      </div>
    </body>
  </html>
  `,
    };

    console.log(emailPayload);

    await sendEmail(emailPayload);

    return res.status(200).json({
      msg: "Registration successful. Verification email sent.",
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ msg: "Server error. Please try again later." });
  }
});
// @route   POST /api/public/login
// @desc    Authenticate user & return JWT
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check for required fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ msg: "Please provide email and password." });
    }

    // 2. Check if user exists
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "Invalid email or password." });
    }

    // 3. Check if email & phone are verified
    // if (!user.userVerifiedToken.email || !user.userVerifiedToken.phone) {
    //   return res
    //     .status(403)
    //     .json({ msg: "Please verify your email and phone." });
    // }

    if (!user.userVerified.email) {
      return res.status(403).json({ msg: "Please verify your email." });
    }

    // 4. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password." });
    }

    // 5. Generate JWT token
    const payload = {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
    };
    const JWT_SECRET = process.env.JWT_SECRET;
    console.log(JWT_SECRET);

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ msg: "Login successful", id: token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: "Server error. Please try again later." });
  }
});

// @route   GET /api/public/emailverify/:token
// @desc    Verify user email using token
// @access  Public
router.get("/emailverify/:token", async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ msg: "Token is missing." });
    }

    // Find user with matching email verification token
    const user = await userModel.findOne({
      "userVerifiedToken.email": token,
    });

    if (!user) {
      return res.status(404).json({ msg: "Invalid or expired token." });
    }

    // Update email verification status
    user.userVerifiedToken.email = null;
    user.userVerified.email = true;

    await user.save();

    res.status(200).json({ msg: "User email verified successfully." });
  } catch (error) {
    console.error("Email Verification Error:", error);
    res.status(500).json({ msg: "Server error. Please try again later." });
  }
});

// @route   POST /api/public/forgetpassword
// @desc    Generate new password and email it to user
// @access  Public

router.post("/forgetpassword", async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Check for email
    if (!email) {
      return res.status(400).json({ msg: "Email is required." });
    }

    // 2. Find user by email
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User with this email not found." });
    }

    // 3. Generate new random password
    const newPassword = Math.random().toString(36).slice(-10); // e.g., "8f9s7d3lqz"

    // 4. Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 11);

    // 5. Update password in DB
    user.password = hashedPassword;
    await user.save();

    // 6. Send email with new password
    const emailPayload = {
      to: email,
      subject: "Your New Password",
      html: `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Your New Password</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #0f172a;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #ffffff;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: #1e293b;
          border: 1px solid #38bdf8;
          padding: 40px 30px;
          border-radius: 10px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .header h1 {
          margin: 0;
          font-size: 22px;
          color: #ffffff;
        }
        .message {
          font-size: 16px;
          color: #ffffff;
          line-height: 1.6;
        }
        .highlight {
          background-color: #0ea5e9;
          color: #ffffff;
          padding: 10px 16px;
          display: inline-block;
          font-weight: bold;
          font-size: 18px;
          border-radius: 6px;
          margin: 20px 0;
        }
        .footer {
          margin-top: 40px;
          font-size: 12px;
          color: #94a3b8;
          text-align: center;
        }

        @media (max-width: 600px) {
          body {
            background-color: #f9fafb;
            color: #111827;
          }
          .container {
            background-color: #ffffff;
            color: #111827;
            border: 1px solid #e5e7eb;
          }
          .header h1 {
            color: #111827;
          }
          .message {
            color: #374151;
          }
          .highlight {
            background-color: #3b82f6;
            color: #ffffff;
          }
          .footer {
            color: #6b7280;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your New Password</h1>
        </div>
        <div class="message">
          <p>Hello <strong>${user.fullName}</strong>,</p>
          <p>Your new password is shown below. Please use it to login and make sure to change it immediately for your security:</p>
          <div class="highlight">${newPassword}</div>
          <p>If you didn’t request this, please contact our support team or reset your password again.</p>
        </div>
        <div class="footer">
          <p>Stay safe and secure. <br />– The Support Team</p>
        </div>
      </div>
    </body>
  </html>
  `,
    };

    await sendEmail(emailPayload);

    return res.status(200).json({ msg: "New password sent to your email." });
  } catch (error) {
    console.error("Forget Password Error:", error);
    res.status(500).json({ msg: "Server error. Please try again later." });
  }
});

export default router;
