import bcrypt from "bcrypt";
import { PrismaClient } from '@prisma/client';
import { generateToken } from "../utils/generateToken.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import transporter from "../utils/email.js";

const prisma = new PrismaClient();


export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
    res.status(201).json({ message: "Signup request sent for approval." });
  } catch (err) {
    res.status(400).json({ error: "Email already exists or invalid input." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(400).json({ error: "User not found" });
  if (user.status !== 'APPROVED') {
    return res.status(403).json({ error: "Your account is not approved yet" });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: "Invalid credentials" });

  const token = generateToken(user.id, user.role);
  res.json({ token, user: { id: user.id, name: user.name, role: user.role, status: user.status } });



};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Create JWT with OTP and expiration
    const resetToken = jwt.sign(
      { email, otp, exp: Math.floor(otpExpires / 1000) },
      process.env.JWT_SECRET
    );

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is ${otp}. It expires in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent to your email.", resetToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send OTP." });
  }
};

export const verifyOtp = async (req, res) => {
  const { resetToken, otp } = req.body;
  try {
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    if (decoded.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }
    if (Date.now() > decoded.exp * 1000) {
      return res.status(400).json({ error: "OTP has expired" });
    }
    res.status(200).json({ message: "OTP verified successfully.", resetToken });
  } catch (err) {
    res.status(400).json({ error: "Invalid or expired token" });
  }
};

export const resetPassword = async (req, res) => {
  const { resetToken, otp, newPassword } = req.body;
  try {
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    if (decoded.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }
    if (Date.now() > decoded.exp * 1000) {
      return res.status(400).json({ error: "OTP has expired" });
    }

    const user = await prisma.user.findUnique({ where: { email: decoded.email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email: decoded.email },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: "Password reset successfully." });
  } catch (err) {
    res.status(400).json({ error: "Invalid or expired token" });
  }
};
