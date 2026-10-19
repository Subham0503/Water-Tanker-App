import React from "react";
import { MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TankerImage from "../TankerImage";
import "./VendorCard.css";

export default function VendorCard({ vendor, tanker, deliveryLocation }) {
  const navigate = useNavigate();
  const price = tanker.price + vendor.extra;

  return (
    <article className="vendor-card">
      <div className="vendor-truck"><TankerImage /></div>
      <div className="vendor-main">
        <strong>{vendor.name}</strong>
        <span><Star size={9} fill="#facc15" color="#facc15" /> Reviews</span>
        <span><MapPin size={9} /> Location</span>
        <div className="vendor-tags">
          {vendor.verified && <small className="verified">● Verified</small>}
          {vendor.onTime && <small className="ontime">● On-time</small>}
          {vendor.pump && <small className="pump">with water pump</small>}
        </div>
      </div>
      <div className="vendor-action">
        <span className="starting-label">Starting</span>
        <b>₹{price}/-</b>
        <button className="primary-btn small" onClick={() => navigate("/schedule", { state: { vendor: {...vendor, price}, tanker, deliveryLocation } })}>Select</button>
      </div>
    </article>
  );
}
