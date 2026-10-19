const express = require("express");
const User = require("../models/userModel");
const Vendor = require("../models/vendorModel");
const Booking = require("../models/bookingModel");
const Withdrawal = require("../models/withdrawalModel");
const { protect, allow } = require("../middleware/auth");
const router = express.Router();
router.use(protect, allow("admin"));

router.get("/summary", async (req, res, next) => {
  try {
    const [users, customers, vendors, pendingVendors, bookings, pendingBookings, deliveredBookings, withdrawals, pendingWithdrawals] = await Promise.all([
      User.countDocuments(), User.countDocuments({ role: "customer" }), Vendor.countDocuments(), Vendor.countDocuments({ verified: false }),
      Booking.countDocuments(), Booking.countDocuments({ bookingStatus: "pending" }), Booking.countDocuments({ bookingStatus: "delivered" }),
      Withdrawal.countDocuments(), Withdrawal.countDocuments({ status: "requested" })
    ]);
    res.json({ success: true, summary: { users, customers, vendors, pendingVendors, bookings, pendingBookings, deliveredBookings, withdrawals, pendingWithdrawals } });
  } catch (e) { next(e); }
});
router.get("/users", async (req, res, next) => {
  try {
    const users = await User.find({}, "name email phone role businessName createdAt").sort({ createdAt: -1 }).limit(500).lean();
    res.json({ success: true, users });
  } catch (e) { next(e); }
});
router.get("/vendors", async (req, res, next) => {
  try {
    const vendors = await Vendor.find().populate("userId", "email createdAt").sort({ createdAt: -1 }).lean();
    res.json({ success: true, vendors });
  } catch (e) { next(e); }
});
router.patch("/vendors/:id/verify", async (req, res, next) => {
  try {
    if (typeof req.body.verified !== "boolean") return res.status(400).json({ success: false, message: "verified must be true or false" });
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, { verified: req.body.verified }, { new: true, runValidators: true });
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });
    res.json({ success: true, vendor });
  } catch (e) { next(e); }
});
router.get("/bookings", async (req, res, next) => {
  try {
    const bookings = await Booking.find().populate("customerId", "name email phone").populate("vendorId", "name businessName phone location").populate("tankerId", "capacity price").sort({ createdAt: -1 }).limit(500).lean();
    res.json({ success: true, bookings });
  } catch (e) { next(e); }
});
router.get("/withdrawals", async (req, res, next) => {
  try {
    const withdrawals = await Withdrawal.find().populate("vendorId", "name businessName phone userId").sort({ createdAt: -1 }).lean();
    res.json({ success: true, withdrawals });
  } catch (e) { next(e); }
});
router.patch("/withdrawals/:id", async (req, res, next) => {
  try {
    const allowed = ["approved", "paid", "rejected"];
    if (!allowed.includes(req.body.status)) return res.status(400).json({ success: false, message: "Status must be approved, paid, or rejected" });
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) return res.status(404).json({ success: false, message: "Withdrawal not found" });
    if (withdrawal.status !== "requested" && withdrawal.status !== "approved") return res.status(409).json({ success: false, message: "This withdrawal has already been finalized" });
    if (withdrawal.status === "requested" && req.body.status === "paid") return res.status(400).json({ success: false, message: "Approve the withdrawal before marking it paid" });
    withdrawal.status = req.body.status;
    await withdrawal.save();
    res.json({ success: true, withdrawal });
  } catch (e) { next(e); }
});
module.exports = router;
