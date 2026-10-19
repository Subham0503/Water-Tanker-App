const mongoose = require("mongoose");

const withdrawalSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  amount: { type: Number, required: true, min: 1 },
  status: { type: String, enum: ["requested", "approved", "paid", "rejected"], default: "requested" }
}, { timestamps: true });

module.exports = mongoose.model("Withdrawal", withdrawalSchema);
