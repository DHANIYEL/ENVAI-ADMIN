const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const transporter = require("../utils/mailer");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const router = express.Router();

// Temporary in-memory store for OTPs (you can use Redis for a more robust solution)
let otpStore = {};

// Register a new user
router.post("/register", async (req, res) => {
  const { firstName, lastName, phoneNumber, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// Login user and return JWT token
// Backend route to handle login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT token with userId in payload
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET, // Use an environment variable for the JWT secret key
      { expiresIn: "1h" } // Set expiration time
    );

    // Send response with token and userId
    res.status(200).json({
      message: "Login successful",
      token,
      userId: user._id.toString(), // Send userId as part of the response
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to login user" });
  }
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // Generate a 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();

  // Store OTP in memory with a 10-minute expiration time
  otpStore[email] = {
    otp,
    createdAt: new Date(),
  };

  // Send OTP email using nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP for password reset is: ${otp}`,
  };

  try {
    // Send the OTP email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// router.post('/reset-password-request', async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     const otp = crypto.randomBytes(3).toString('hex'); // Generate a 6-digit OTP
//     user.resetOtp = otp;
//     user.resetOtpExpiration = Date.now() + 3600000; // OTP expires in 1 hour
//     await user.save();

//     // Send OTP email
//     await nodemailer.sendMail({
//       from: 'your-email@example.com', // sender address
//       to: email, // list of receivers
//       subject: 'Password Reset OTP',
//       text: `Your OTP for resetting the password is: ${otp}`,
//     });

//     res.status(200).json({ message: 'OTP sent to your email address' });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to send OTP' });
//   }
// });

// Route to verify OTP
router.post("/verify-otp", async (req, res) => {
  const { otp } = req.body;

  // Validate OTP input
  if (!otp) {
    return res.status(400).json({ error: "OTP is required" });
  }

  // Check if OTP exists in the in-memory store
  const otpRecord = Object.values(otpStore).find(
    (record) => record.otp === otp
  );
  if (!otpRecord) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  // Check if OTP has expired (optional)
  const currentTime = new Date();
  if (currentTime - otpRecord.createdAt > 10 * 60 * 1000) {
    // OTP expires after 10 minutes
    return res.status(400).json({ error: "OTP has expired" });
  }

  // OTP is valid
  res.status(200).json({ message: "OTP verified successfully" });
});

// Verify OTP and reset password
router.post("/reset-password", async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  // Validate input
  if (!email || !newPassword || !confirmPassword) {
    return res
      .status(400)
      .json({
        error: "Email, new password, and confirmation password are required",
      });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  try {
    // Update the user's password (hash the password before saving)
    user.password = newPassword; // Hash the password before saving in production
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to reset password" });
  }
});

module.exports = router;
