const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  bookingNumber: { type: String, unique: true, index: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  tankerId: { type: mongoose.Schema.Types.ObjectId, ref: "Tanker", required: true },
  deliveryAddress: { type: String, required: true, trim: true },
  deliveryDate: { type: String, required: true },
  deliveryTime: { type: String, required: true },
  deliveryType: { type: String, enum: ["standard", "express"], default: "standard" },
  tankerPrice: { type: Number, required: true, min: 0 },
  expressCharge: { type: Number, default: 0, min: 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  paymentMethod: { type: String, enum: ["upi", "cod"], required: true },
  paymentStatus: { type: String, enum: ["pending", "paid", "cod_pending", "refunded"], default: "pending" },
  bookingStatus: { type: String, enum: ["pending", "accepted", "filling", "on_the_way", "delivered", "cancelled"], default: "pending" },
  customerNote: { type: String, default: "" }
}, { timestamps: true });

bookingSchema.pre("validate", function() {
  // Mongoose 9 middleware is promise/sync based; do not call the removed next callback.
  if (!this.bookingNumber) this.bookingNumber = `AC-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
});

module.exports = mongoose.model("Booking", bookingSchema);
