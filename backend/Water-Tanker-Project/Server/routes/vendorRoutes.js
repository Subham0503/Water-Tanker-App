const express = require("express");
const Vendor = require("../models/vendorModel");
const Tanker = require("../models/tankerModel");
const Booking = require("../models/bookingModel");
const Withdrawal = require("../models/withdrawalModel");
const VendorVerification = require("../models/vendorVerificationModel");
const { protect, allow } = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const vendors = await Vendor.find({ verified: true }).sort({ businessName: 1 });
    res.json({ success: true, vendors });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get("/me", protect, allow("vendor"), async (req, res) => {
  const vendor = await Vendor.findOne({ userId: req.user._id });
  res.json({ success: true, vendor });
});

router.patch("/me", protect, allow("vendor"), async (req, res) => {
  const allowed = ["name", "businessName", "phone", "location", "onTime", "expressCharge", "isOnDuty", "currentLocation", "latitude", "longitude"];
  const update = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
  if (req.body.latitude !== undefined || req.body.longitude !== undefined || req.body.currentLocation !== undefined) update.locationUpdatedAt = new Date();
  const vendor = await Vendor.findOneAndUpdate({ userId: req.user._id }, update, { new: true, runValidators: true });
  if (!vendor) return res.status(404).json({ success: false, message: "Vendor profile not found" });
  res.json({ success: true, vendor });
});

router.get("/me/orders", protect, allow("vendor"), async (req, res) => {
  const vendor = await Vendor.findOne({ userId: req.user._id });
  if (!vendor) return res.status(404).json({ success: false, message: "Vendor profile not found" });
  const bookings = await Booking.find({ vendorId: vendor._id }).populate("customerId", "name phone").populate("tankerId").sort({ createdAt: -1 });
  res.json({ success: true, bookings });
});

router.get("/me/tankers", protect, allow("vendor"), async (req, res) => {
  const vendor = await Vendor.findOne({ userId: req.user._id });
  const tankers = vendor ? await Tanker.find({ vendorId: vendor._id }).sort({ capacity: 1 }) : [];
  res.json({ success: true, tankers });
});

router.patch("/me/tankers/:id", protect, allow("vendor"), async (req, res) => {
  const vendor = await Vendor.findOne({ userId: req.user._id });
  const tanker = await Tanker.findOne({ _id: req.params.id, vendorId: vendor?._id });
  if (!tanker) return res.status(404).json({ success: false, message: "Tanker not found" });
  const allowed = ["price", "location", "available", "status"];
  for (const key of allowed) if (req.body[key] !== undefined) tanker[key] = req.body[key];
  await tanker.save();
  res.json({ success: true, tanker });
});

router.get("/me/earnings", protect, allow("vendor"), async (req, res) => {
  const vendor = await Vendor.findOne({ userId: req.user._id });
  if (!vendor) return res.status(404).json({ success: false, message: "Vendor profile not found" });
  const completed = await Booking.find({ vendorId: vendor._id, bookingStatus: "delivered" });
  const totalEarnings = completed.reduce((s, b) => s + b.totalAmount, 0);
  const pending = await Booking.find({ vendorId: vendor._id, bookingStatus: { $nin: ["delivered", "cancelled"] } });
  const pendingAmount = pending.reduce((s, b) => s + b.totalAmount, 0);
  const withdrawals = await Withdrawal.find({ vendorId: vendor._id, status: { $in: ["requested", "approved", "paid"] } });
  const withdrawn = withdrawals.reduce((s, w) => s + w.amount, 0);
  const available = Math.max(0, totalEarnings - vendor.securityReserve - pendingAmount - withdrawn);
  res.json({ success: true, totalEarnings, securityReserve: vendor.securityReserve, pendingAmount, withdrawn, available });
});

router.post("/me/withdrawals", protect, allow("vendor"), async (req, res) => {
  const amount = Number(req.body.amount);
  const vendor = await Vendor.findOne({ userId: req.user._id });
  if (!vendor) return res.status(404).json({ success: false, message: "Vendor profile not found" });
  const completed = await Booking.find({ vendorId: vendor._id, bookingStatus: "delivered" });
  const total = completed.reduce((s, b) => s + b.totalAmount, 0);
  const pending = await Booking.find({ vendorId: vendor._id, bookingStatus: { $nin: ["delivered", "cancelled"] } });
  const pendingAmount = pending.reduce((s, b) => s + b.totalAmount, 0);
  const prior = await Withdrawal.find({ vendorId: vendor._id, status: { $in: ["requested", "approved", "paid"] } });
  const withdrawn = prior.reduce((s, w) => s + w.amount, 0);
  const available = Math.max(0, total - vendor.securityReserve - pendingAmount - withdrawn);
  if (!Number.isFinite(amount) || amount <= 0 || amount > available) return res.status(400).json({ success: false, message: `Withdrawal must be between ₹1 and ₹${available}` });
  const withdrawal = await Withdrawal.create({ vendorId: vendor._id, amount });
  res.status(201).json({ success: true, withdrawal });
});

router.get("/me/withdrawals", protect, allow("vendor"), async (req, res) => {
  const vendor = await Vendor.findOne({ userId: req.user._id });
  const withdrawals = vendor ? await Withdrawal.find({ vendorId: vendor._id }).sort({ createdAt: -1 }) : [];
  res.json({ success: true, withdrawals });
});

router.get("/me/verification", protect, allow("vendor"), async (req, res) => {
  const vendor = await Vendor.findOne({ userId: req.user._id });
  let verification = vendor ? await VendorVerification.findOne({ vendorId: vendor._id }) : null;
  if (vendor && !verification) verification = await VendorVerification.create({ vendorId: vendor._id });
  res.json({ success: true, verification });
});

router.put("/me/verification", protect, allow("vendor"), async (req, res) => {
  const vendor = await Vendor.findOne({ userId: req.user._id });
  if (!vendor) return res.status(404).json({ success: false, message: "Vendor profile not found" });
  const update = {};
  for (const key of ["owner", "bank", "tanker", "driver"]) if (req.body[key] !== undefined) update[key] = req.body[key];
  update.status = "submitted";
  const verification = await VendorVerification.findOneAndUpdate({ vendorId: vendor._id }, update, { new: true, upsert: true });
  res.json({ success: true, verification });
});

module.exports = router;
