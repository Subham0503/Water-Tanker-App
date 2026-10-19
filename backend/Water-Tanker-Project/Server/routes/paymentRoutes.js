const express = require("express");
const Payment = require("../models/paymentModel");
const { protect } = require("../middleware/auth");
const router = express.Router();
router.get("/my", protect, async (req, res) => { const payments = await Payment.find({ customerId: req.user._id }).sort({ createdAt: -1 }); res.json({ success: true, payments }); });
router.get("/:id", protect, async (req, res) => { const payment = await Payment.findById(req.params.id); if (!payment) return res.status(404).json({ success:false,message:"Payment not found" }); if (req.user.role !== "admin" && payment.customerId.toString() !== req.user._id.toString()) return res.status(403).json({success:false,message:"Not allowed"}); res.json({success:true,payment}); });
module.exports = router;
