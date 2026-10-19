import React from "react";
import {ChevronLeft,Bell} from "lucide-react";
import {useNavigate} from "react-router-dom";
import "./Header.css";

export default function Header({back=false,title="AquaConnect",notification=false}) {
  const navigate=useNavigate();
  return <header className="header">
    {back?<button className="icon-button" onClick={()=>navigate(-1)}><ChevronLeft size={21}/></button>:<span/>}
    <div className="brand">{title}</div>
    {notification?<button className="icon-button"><Bell size={18}/></button>:<span/>}
  </header>;
}