require("dotenv").config();
const mongoose=require("mongoose"); const bcrypt=require("bcryptjs");
const connectDB=require("../config/db"); const User=require("../models/userModel"); const Vendor=require("../models/vendorModel"); const Tanker=require("../models/tankerModel");
async function run(){await connectDB(); const password=await bcrypt.hash("Password123",12);
let admin=await User.findOne({email:"admin@aquaconnect.test"}); if(!admin) await User.create({name:"AquaConnect Admin",phone:"9999999999",email:"admin@aquaconnect.test",password,role:"admin"});
let vendorUser=await User.findOne({email:"vendor1@aquaconnect.test"}); if(!vendorUser) vendorUser=await User.create({name:"Vendor 1",businessName:"Aqua Water Supply",phone:"9876543210",email:"vendor1@aquaconnect.test",password,role:"vendor"});
let vendor=await Vendor.findOne({userId:vendorUser._id});
if(!vendor) vendor=await Vendor.create({userId:vendorUser._id,name:vendorUser.name,businessName:vendorUser.businessName,phone:vendorUser.phone,location:"Vijay Nagar, Indore",verified:true,isDemo:true,onTime:true,isOnDuty:true});
else await Vendor.updateOne({_id:vendor._id},{$set:{verified:true,isDemo:true,isOnDuty:true,location:vendor.location||"Vijay Nagar, Indore"}});
const data=[[6000,600,"MP09 AB 1234"],[8000,800,"MP09 AB 5678"],[10000,900,"MP09 AB 9012"],[12000,1050,"MP09 AB 3456"],[15000,1250,"MP09 AB 7890"]];
for(const [capacity,price,vehicleNumber] of data) await Tanker.findOneAndUpdate({vendorId:vendor._id,capacity},{vendorId:vendor._id,capacity,price,vehicleNumber,location:"Vijay Nagar, Indore",available:true,status:"available"},{upsert:true,new:true});
console.log("Seed complete. Vendor: vendor1@aquaconnect.test / Password123 | Admin: admin@aquaconnect.test / Password123"); await mongoose.disconnect();}
run().catch(e=>{console.error(e);process.exit(1)});
