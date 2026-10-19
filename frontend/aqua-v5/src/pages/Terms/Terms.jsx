import React from "react";
import { FileText, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import BottomNav from "../../components/BottomNav/BottomNav";
import "./Terms.css";

export default function Terms(){
  const navigate = useNavigate();
  return <main className="mobile-page terms-page">
    <Header back title="Terms & Conditions" />
    <section className="terms-detail-content">
      <div className="terms-intro"><FileText size={24}/><div><h2>Terms & Conditions</h2><p>Please review these conditions before placing a tanker booking.</p></div></div>
      <div className="terms-detail-card">
        <section><h3>1. Delivery Location</h3><p>The delivery location must be accessible to the tanker. The customer is responsible for providing a complete and accurate address and valid contact details.</p></section>
        <section><h3>2. Someone Available at Delivery</h3><p>A customer or an authorised person should be available at the delivery location to receive the tanker and guide the driver when necessary.</p></section>
        <section><h3>3. Booking & Scheduling</h3><p>The selected tanker, vendor, date and time slot are shown before confirmation. Express Delivery uses the current time plus one hour as the estimated delivery window and does not require a regular time-slot selection.</p></section>
        <section><h3>4. Cancellation</h3><p>Orders cannot be cancelled once the tanker has gone out for delivery. Any cancellation or refund is subject to the booking conditions shown at the time of confirmation.</p></section>
        <section><h3>5. Water Usage</h3><p>For drinking purposes, proper filtration and treatment is recommended before consumption. AquaConnect does not represent untreated tanker water as ready for drinking.</p></section>
        <section><h3>6. Refund Policy</h3><p>If the required delivery conditions are not fulfilled after the tanker has been dispatched, only 50% of the payment may be refunded according to the booking terms.</p></section>
        <section><h3>7. Pricing</h3><p>The final amount can include the selected tanker price, vendor charges and any applicable Express Delivery charge. The total is displayed before payment.</p></section>
        <section><h3>8. Demo Project Notice</h3><p>This college project currently uses demo data and does not process real payments or provide real-time GPS tracking.</p></section>
      </div>
      <div className="terms-note"><Info size={17}/><span>These terms are presented for the AquaConnect project prototype. Backend rules can be connected later.</span></div>
      <button className="primary-btn terms-close" onClick={()=>navigate(-1)}>Back</button>
    </section>
    <BottomNav/>
  </main>;
}
