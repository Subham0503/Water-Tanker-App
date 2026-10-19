const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/userModel");
const Vendor = require("../models/vendorModel");
const { protect } = require("../middleware/auth");

const router = express.Router();
const safeUser = (u) => ({ id: u._id, name: u.name, email: u.email, phone: u.phone, role: u.role, businessName: u.businessName || "" });
const tokenFor = (u) => jwt.sign({ id: u._id.toString(), role: u.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

router.post("/register", async (req, res) => {
  try {
    const { name, businessName = "", phone, email, password, role = "customer" } = req.body;
    if (!name || !phone || !email || !password) return res.status(400).json({ success: false, message: "Name, phone, email and password are required" });
    if (!["customer", "vendor"].includes(role)) return res.status(400).json({ success: false, message: "Invalid registration role" });
    if (!/^\d{10}$/.test(phone)) return res.status(400).json({ success: false, message: "Phone must contain 10 digits" });
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ success: false, message: "Enter a valid email address" });
    if (password.length < 8) return res.status(400).json({ success: false, message: "Password must contain at least 8 characters" });
    if (role === "vendor" && !businessName.trim()) return res.status(400).json({ success: false, message: "Business name is required for vendors" });
    const exists = await User.findOne({ $or: [{ email: email.toLowerCase() }, { phone }] });
    if (exists) return res.status(409).json({ success: false, message: "An account with this email or phone already exists" });
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name: name.trim(), businessName: businessName.trim(), phone, email: email.toLowerCase(), password: passwordHash, role });
    if (role === "vendor") {
      await Vendor.create({ userId: user._id, name: user.name, businessName: user.businessName, phone: user.phone });
    }
    res.status(201).json({ success: true, message: "Account created successfully", user: safeUser(user) });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

router.post("/login", async (req, res) => {
  try {
    const { identifier, password, role = "customer" } = req.body;
    if (!identifier || !password) return res.status(400).json({ success: false, message: "Identifier and password are required" });
    const normalized = identifier.trim().toLowerCase();
    const user = await User.findOne({ $and: [{ role }, { $or: [{ email: normalized }, { phone: identifier.trim() }] }] });
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ success: false, message: "Invalid login details" });
    res.json({ success: true, token: tokenFor(user), user: safeUser(user) });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});


// Password reset uses a random, short-lived, single-use token delivered by SMTP email.
router.post("/forgot-password", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ success: false, message: "Enter a valid email address" });
    const user = await User.findOne({ email });
    // Do not reveal whether an account exists.
    if (!user) return res.json({ success: true, message: "If an account exists for this email, password reset instructions have been sent." });
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.CLIENT_URL) {
      return res.status(503).json({ success: false, message: "Password reset email is not configured yet. Add SMTP_HOST, SMTP_USER, SMTP_PASS and CLIENT_URL to the backend .env file." });
    }
    const rawToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();
    const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: String(process.env.SMTP_SECURE || "false") === "true", auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
    const resetUrl = `${process.env.CLIENT_URL.replace(/\/$/, "")}/login?token=${rawToken}`;
    await transporter.sendMail({ from: process.env.SMTP_FROM || process.env.SMTP_USER, to: user.email, subject: "AquaConnect password reset", text: `Use this link to reset your AquaConnect password. It expires in 15 minutes: ${resetUrl}\nIf you did not request this, ignore this email.` });
    return res.json({ success: true, message: "If an account exists for this email, password reset instructions have been sent." });
  } catch (error) { return res.status(500).json({ success: false, message: "Unable to send reset email. Check your SMTP configuration." }); }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || typeof password !== "string" || password.length < 8) return res.status(400).json({ success: false, message: "A valid reset token and password of at least 8 characters are required" });
    const hashed = crypto.createHash("sha256").update(String(token)).digest("hex");
    const user = await User.findOne({ resetPasswordToken: hashed, resetPasswordExpires: { $gt: new Date() } });
    if (!user) return res.status(400).json({ success: false, message: "This password reset link is invalid or expired. Request a new one." });
    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    return res.json({ success: true, message: "Password reset successfully. You can now log in." });
  } catch (error) { return res.status(500).json({ success: false, message: "Unable to reset password." }); }
});

router.get("/me", protect, async (req, res) => res.json({ success: true, user: safeUser(req.user) }));

module.exports = router;
