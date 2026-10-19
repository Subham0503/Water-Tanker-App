const express = require("express");
const Tanker = require("../models/tankerModel");
const Vendor = require("../models/vendorModel");
const { protect, allow } = require("../middleware/auth");

const router = express.Router();

function normalizeLocation(value) {
  return String(value || "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/\b(indore|madhya pradesh|mp|india)\b/g, " ")
    .replace(/\b(no\.?|number)\s*/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function areaPart(value) {
  // Area is the part before the city, e.g. "Vijay Nagar" from
  // "Vijay Nagar, Indore, Madhya Pradesh".
  return normalizeLocation(String(value || "").split(",")[0]);
}

function matchesLocation(tanker, selectedLocation) {
  if (!selectedLocation || !String(selectedLocation).trim()) return true;
  const selected = areaPart(selectedLocation);
  if (!selected) return true;
  const candidates = [areaPart(tanker.location), areaPart(tanker.vendorId?.location)];
  return candidates.some(stored => {
    if (!stored) return false;
    // Match exact areas, and tolerate extra locality detail in either field.
    return stored === selected || stored.startsWith(`${selected} `) ||
      selected.startsWith(`${stored} `) || stored.includes(` ${selected} `) ||
      selected.includes(` ${stored} `);
  });
}

// Legacy tanker documents created before the status field was introduced can
// be missing it in MongoDB. Mongo query predicates do not apply Mongoose
// schema defaults, so include legacy missing fields and evaluate them safely.
function availableTankerQuery() {
  return {
    $and: [
      { $or: [{ available: true }, { available: { $exists: false } }] },
      { $or: [{ status: "available" }, { status: { $exists: false } }] }
    ]
  };
}

function isCustomerVisible(tanker) {
  return Boolean(tanker.vendorId && tanker.vendorId.verified === true &&
    tanker.vendorId.isDemo !== true &&
    tanker.vendorId.userId?.email !== "vendor1@aquaconnect.test" &&
    tanker.vendorId.isOnDuty !== false);
}

async function findPublicTankers(baseQuery, selectedLocation) {
  const tankers = await Tanker.find(baseQuery)
    .populate({ path: "vendorId", select: "name businessName verified isDemo onTime location expressCharge isOnDuty userId", populate: { path: "userId", select: "email" } })
    .sort({ capacity: 1, price: 1 });
  return tankers.filter(t => isCustomerVisible(t) && matchesLocation(t, selectedLocation));
}

router.get("/", async (req, res) => {
  try {
    const clean = (await findPublicTankers(availableTankerQuery(), req.query.location)).map(t => ({
      id: t._id, tankerId: t._id, quantity: `${t.capacity} L`, capacity: t.capacity,
      price: t.price, vehicleNumber: t.vehicleNumber, location: t.location,
      vendorId: t.vendorId._id,
      vendor: { _id: t.vendorId._id, name: t.vendorId.name, businessName: t.vendorId.businessName, verified: t.vendorId.verified, onTime: t.vendorId.onTime, location: t.vendorId.location, expressCharge: t.vendorId.expressCharge, isOnDuty: t.vendorId.isOnDuty }
    }));
    const byCapacity = new Map();
    clean.forEach(t => {
      if (!byCapacity.has(t.capacity) || t.price < byCapacity.get(t.capacity).price) byCapacity.set(t.capacity, t);
    });
    res.json({ success: true, tankers: [...byCapacity.values()] });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get("/vendors/:tankerId", async (req, res) => {
  try {
    const tanker = await Tanker.findById(req.params.tankerId);
    if (!tanker) return res.status(404).json({ success: false, message: "Tanker not found" });
    const tankers = await findPublicTankers({ $and: [{ capacity: tanker.capacity }, ...availableTankerQuery().$and] }, req.query.location);
    const vendors = tankers.map(t => ({
      id: t.vendorId._id, vendorId: t.vendorId._id, tankerId: t._id,
      name: t.vendorId.businessName || t.vendorId.name,
      extra: Math.max(0, t.price - tanker.price), price: t.price,
      verified: t.vendorId.verified, onTime: t.vendorId.onTime, location: t.location,
      pump: false, expressCharge: t.vendorId.expressCharge || 20
    }));
    res.json({ success: true, vendors });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post("/", protect, allow("vendor"), async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor profile not found" });
    const capacity = Number(req.body.capacity);
    const price = Number(req.body.price);
    const vehicleNumber = String(req.body.vehicleNumber || "").trim();
    if (!Number.isFinite(capacity) || capacity <= 0) return res.status(400).json({ success: false, message: "Enter a valid tanker capacity" });
    if (!Number.isFinite(price) || price < 0) return res.status(400).json({ success: false, message: "Enter a valid price" });
    if (!vehicleNumber) return res.status(400).json({ success: false, message: "Vehicle number is required" });
    const available = req.body.available !== false;
    const tanker = await Tanker.create({
      capacity, price, vehicleNumber,
      location: String(req.body.location || vendor.location || "").trim(),
      available, status: available ? "available" : "inactive", vendorId: vendor._id
    });
    res.status(201).json({ success: true, tanker });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
