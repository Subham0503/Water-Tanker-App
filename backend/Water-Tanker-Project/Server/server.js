require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const tankerRoutes = require("./routes/tankerRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const addressRoutes = require("./routes/addressRoutes");
const profileRoutes = require("./routes/profileRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = Number(process.env.PORT || 5000);
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173").split(",").map(s=>s.trim());

app.use(helmet());
app.use(cors({ origin: allowedOrigins.includes("*") ? true : allowedOrigins, credentials: false }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/", (req,res)=>res.json({success:true,message:"AquaConnect API is running",version:"2.0.0"}));
app.get("/api/health", (req,res)=>res.json({success:true,status:"ok"}));
app.use("/api/auth", authRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/tankers", tankerRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);

app.use((req,res)=>res.status(404).json({success:false,message:"Route not found"}));
app.use((err,req,res,next)=>{console.error(err);res.status(500).json({success:false,message:"Internal server error"});});

connectDB().then(()=>app.listen(PORT,()=>console.log(`AquaConnect API running on http://localhost:${PORT}`))).catch(err=>{console.error("Database connection failed:",err.message);process.exit(1);});
