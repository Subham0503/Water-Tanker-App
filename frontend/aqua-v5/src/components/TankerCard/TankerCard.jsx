import React from "react";
import { useNavigate } from "react-router-dom";
import TankerImage from "../TankerImage";
import "./TankerCard.css";

export default function TankerCard({ tanker, deliveryLocation }) {
  const navigate = useNavigate();

  return (
    <article className="tanker-card">
      <div className="tanker-image"><TankerImage /></div>
      <div className="tanker-info">
        <strong>{tanker.quantity} Tanker</strong>
        <span>Starting from</span>
        <b>₹{tanker.price} /-</b>
      </div>
      <button className="primary-btn small" onClick={() => navigate("/vendors", { state: { tanker, deliveryLocation } })}>Book Now</button>
    </article>
  );
}
