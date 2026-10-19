import React from "react";
import {Home,ClipboardList,Phone,UserRound} from "lucide-react";
import {useLocation,useNavigate} from "react-router-dom";
import "./BottomNav.css";

export default function BottomNav(){
  const navigate=useNavigate(), location=useLocation();
  const items=[{I:Home,p:"/home",label:"Home"},{I:ClipboardList,p:"/bookings",label:"Bookings"},{I:Phone,p:"/contact-us",label:"Contact"},{I:UserRound,p:"/profile",label:"Profile"}];
  return <nav className="bottom-nav">{items.map(({I,p,label})=><button key={p} className={location.pathname===p?"nav-item active":"nav-item"} onClick={()=>navigate(p)}><I size={18}/><span>{label}</span></button>)}</nav>;
}
