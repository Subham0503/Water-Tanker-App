const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  name: { type: String, required: true, trim: true },
  businessName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  location: { type: String, default: "Vijay Nagar, Indore" },
  isOnDuty: { type: Boolean, default: true },
  currentLocation: { type: String, default: "" },
  latitude: { type: Number, default: null },
  longitude: { type: Number, default: null },
  locationUpdatedAt: { type: Date, default: null },
  verified: { type: Boolean, default: false },
  // Seed-only accounts are hidden from customer listings.
  isDemo: { type: Boolean, default: false },
  onTime: { type: Boolean, default: true },
  expressCharge: { type: Number, default: 20, min: 0 },
  securityReserve: { type: Number, default: 10000, min: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Vendor", vendorSchema);
