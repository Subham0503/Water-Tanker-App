const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true, min: 0 },
  paymentMethod: { type: String, enum: ["upi", "cod"], required: true },
  paymentStatus: { type: String, enum: ["paid", "cod_pending", "refunded"], required: true },
  transactionId: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
