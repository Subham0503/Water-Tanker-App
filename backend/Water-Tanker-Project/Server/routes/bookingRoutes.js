const express = require("express");
const Booking = require("../models/bookingModel");
const Payment = require("../models/paymentModel");
const Tanker = require("../models/tankerModel");
const Vendor = require("../models/vendorModel");
const { protect, allow } = require("../middleware/auth");
const router = express.Router();

function populated(q) { return q.populate("vendorId", "name businessName phone location currentLocation latitude longitude locationUpdatedAt isOnDuty").populate("tankerId").populate("customerId", "name phone email"); }

router.post("/", protect, allow("customer"), async (req, res) => {
  try {
    const { tankerId, vendorId, deliveryAddress, deliveryDate, deliveryTime, deliveryType = "standard", paymentMethod, customerNote = "" } = req.body;
    if (!tankerId || !vendorId || !deliveryAddress || !deliveryDate || !deliveryTime || !paymentMethod) return res.status(400).json({ success: false, message: "Missing required booking details" });
    if (!["upi", "cod"].includes(paymentMethod)) return res.status(400).json({ success: false, message: "Invalid payment method" });
    const tanker = await Tanker.findById(tankerId);
    const vendor = await Vendor.findById(vendorId);
    if (!tanker || !vendor || tanker.vendorId.toString() !== vendor._id.toString()) return res.status(400).json({ success: false, message: "Selected tanker/vendor combination is invalid" });
    if (vendor.isOnDuty === false) return res.status(409).json({ success: false, message: "This vendor is currently off duty. Please choose another vendor." });
    if (!tanker.available || tanker.status === "inactive") return res.status(409).json({ success: false, message: "Tanker is not available" });
    const conflict = await Booking.findOne({ tankerId: tanker._id, deliveryDate, deliveryTime, bookingStatus: { $nin: ["cancelled", "delivered"] } });
    if (conflict) return res.status(409).json({ success: false, message: "This tanker is already booked for the selected date and time" });
    const expressCharge = deliveryType === "express" ? Number(vendor.expressCharge || 20) : 0;
    const totalAmount = tanker.price + expressCharge;
    const paymentStatus = paymentMethod === "cod" ? "cod_pending" : "paid";
    const booking = await Booking.create({ customerId: req.user._id, vendorId: vendor._id, tankerId: tanker._id, deliveryAddress, deliveryDate, deliveryTime, deliveryType, tankerPrice: tanker.price, expressCharge, totalAmount, paymentMethod, paymentStatus, bookingStatus: "pending", customerNote });
    const payment = await Payment.create({ bookingId: booking._id, customerId: req.user._id, amount: totalAmount, paymentMethod, paymentStatus, transactionId: paymentMethod === "upi" ? `DEMO-${Date.now()}` : "" });
    const full = await populated(Booking.findById(booking._id));
    res.status(201).json({ success: true, booking: full, payment });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get("/my", protect, allow("customer"), async (req, res) => {
  const bookings = await populated(Booking.find({ customerId: req.user._id }).sort({ createdAt: -1 }));
  res.json({ success: true, bookings });
});

router.get("/vendor", protect, allow("vendor"), async (req, res) => {
  const vendor = await Vendor.findOne({ userId: req.user._id });
  const bookings = vendor ? await populated(Booking.find({ vendorId: vendor._id }).sort({ createdAt: -1 })) : [];
  res.json({ success: true, bookings });
});

router.get("/:id", protect, async (req, res) => {
  const booking = await populated(Booking.findById(req.params.id));
  if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
  const customerOwns = req.user.role === "customer" && booking.customerId?._id?.toString() === req.user._id.toString();
  let vendorOwns = false;
  if (req.user.role === "vendor") { const v = await Vendor.findOne({ userId: req.user._id }); vendorOwns = v && booking.vendorId?._id?.toString() === v._id.toString(); }
  if (req.user.role !== "admin" && !customerOwns && !vendorOwns) return res.status(403).json({ success: false, message: "Not allowed" });
  res.json({ success: true, booking });
});

router.patch("/:id/status", protect, allow("vendor", "admin"), async (req, res) => {
  const allowed = ["pending", "accepted", "filling", "on_the_way", "delivered", "cancelled"];
  if (!allowed.includes(req.body.bookingStatus)) return res.status(400).json({ success: false, message: "Invalid booking status" });
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
  if (req.user.role === "vendor") { const v = await Vendor.findOne({ userId: req.user._id }); if (!v || booking.vendorId.toString() !== v._id.toString()) return res.status(403).json({ success: false, message: "Not your booking" }); }
  booking.bookingStatus = req.body.bookingStatus;
  await booking.save();
  res.json({ success: true, booking });
});

router.patch("/:id/cancel", protect, allow("customer"), async (req, res) => {
  const booking = await Booking.findOne({ _id: req.params.id, customerId: req.user._id });
  if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
  if (["on_the_way", "delivered", "cancelled"].includes(booking.bookingStatus)) return res.status(400).json({ success: false, message: "This booking cannot be cancelled" });
  booking.bookingStatus = "cancelled";
  await booking.save();
  res.json({ success: true, booking });
});

module.exports = router;
