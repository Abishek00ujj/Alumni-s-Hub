const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;

require('./connection/conn');

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const otpStorage = {};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "abishek3834@gmail.com", 
    pass: "fgqvgrnpopdffxhk", 
  },
});

// OTP Routes
app.post("/generate-otp", (req, res) => {
  const { email, Name } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required!" });
  }

  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  otpStorage[email] = otp;

  const mailOptions = {
    from: "your-email@gmail.com",
    to: email,
    subject: "Your OTP for Alumnis-Hub",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="text-align: center; color: #6c24a4;">Welcome to Alumnis-Hub🎉</h2>
        <p>Hello,${Name}</p>
        <p>Your OTP for verification is:</p>
        <div style="text-align: center; margin: 20px 0; font-size: 24px; font-weight: bold; color: #4CAF50;">${otp}</div>
        <p>This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.</p>
        <hr style="border: 0; height: 1px; background: #ddd;">
        <p style="font-size: 12px; color: #666;">If you did not request this, please ignore this email.</p>
        <p style="text-align: center; font-size: 12px; color: #666;">&copy; 2024 Alumnis-Hub. All rights reserved.</p>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ message: "Failed to send OTP email." });
    }
    console.log("OTP sent successfully:", info.response);
    res.status(200).json({ message: "OTP sent successfully!", otp });
  });
});

app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required!" });
  }

  if (otpStorage[email] === otp) {
    delete otpStorage[email];
    return res.status(200).json({ message: "OTP verified successfully!" });
  }

  res.status(400).json({ message: "Invalid OTP. Please try again." });
});

// Import Routes - MAKE SURE THESE ARE CORRECT
const AddUser = require('./Route/AddUser');
const blogRoutes = require('./Route/blogRoutes');

// Debug - Check what's being imported
console.log('AddUser type:', typeof AddUser);
console.log('blogRoutes type:', typeof blogRoutes);

// Register Routes
app.use("/api/v1", AddUser);
app.use("/api/v1/blogs", blogRoutes);  // ← This is line 85

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.method} ${req.originalUrl} not found` 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📝 Blog routes available at http://localhost:${PORT}/api/v1/blogs`);
});
