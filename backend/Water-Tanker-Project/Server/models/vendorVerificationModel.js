const mongoose = require("mongoose");

const vendorVerificationSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true, unique: true },
  owner: { type: Object, default: {} },
  bank: { type: Object, default: {} },
  tanker: { type: Object, default: {} },
  driver: { type: Object, default: {} },
  status: { type: String, enum: ["draft", "submitted", "approved", "rejected"], default: "draft" },
  adminNote: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("VendorVerification", vendorVerificationSchema);
