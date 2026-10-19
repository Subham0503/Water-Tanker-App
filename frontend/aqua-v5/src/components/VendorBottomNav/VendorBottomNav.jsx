import React from "react";
import { Home, ClipboardList, IndianRupee, UserRound } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import "./VendorBottomNav.css";

export default function VendorBottomNav(){
  const navigate=useNavigate();
  const location=useLocation();
  const items=[
    {I:Home,p:"/vendor",label:"Home"},
    {I:ClipboardList,p:"/vendor/orders",label:"Orders"},
    {I:IndianRupee,p:"/vendor/earnings",label:"Earnings"},
    {I:UserRound,p:"/vendor/verification",label:"Profile"}
  ];
  return <nav className="bottom-nav vendor-bottom-nav">
    {items.map(({I,p,label})=><button key={p} className={location.pathname===p?"nav-item active":"nav-item"} onClick={()=>navigate(p)}><I size={18}/><span>{label}</span></button>)}
  </nav>;
}
