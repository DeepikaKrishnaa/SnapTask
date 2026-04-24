import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/mailer.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
        plan: user.plan,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid creds" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid creds" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); 

    user.otp = otp; 
    user.otpExpiry = Date.now() + 10 * 60 * 1000; 
    await user.save(); 

    await transporter.sendMail({ 
      from: process.env.EMAIL_USER, 
      to: user.email, 
      subject: "OTP for SnapTask Login", 
      html: 
      `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111; text-align: center;">

        <p>Hey ${user.name || "there"},</p>
        <p>Your OTP to login to your <strong>SnapTask</strong> account is:</p>

        <p style="
        font-size: 28px;
        font-weight: bold;
        letter-spacing: 6px;
        color: #7c3aed;
        margin: 20px 0;
        ">
          ${otp}
        </p>

        <p>This code is valid for <strong>10 minutes</strong>. Please do not share it with anyone.</p>

        <br/><p style="color: #555;">
        If you didn't request this, you can safely ignore this email.
        </p>

        <p style="margin-top: 30px;">— SnapTask Team</p>

      </div>`, 
    }); 

    res.status(200).json({ 
      message: "OTP sent to your email", userId: user._id, 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
        plan: user.plan,
      },
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};