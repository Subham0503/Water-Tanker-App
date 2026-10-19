const mongoose = require("mongoose");

const tankerSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  capacity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  vehicleNumber: { type: String, required: true, trim: true },
  location: { type: String, default: "Vijay Nagar, Indore" },
  available: { type: Boolean, default: true },
  status: { type: String, enum: ["available", "busy", "inactive"], default: "available" }
}, { timestamps: true });

tankerSchema.index({ vendorId: 1, capacity: 1 });
module.exports = mongoose.model("Tanker", tankerSchema);
