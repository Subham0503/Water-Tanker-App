import React, { useState } from "react";
import { Check, ChevronDown, Map, MapPin, Search, X } from "lucide-react";
import "./LocationPicker.css";

const locations = [
  "Vijay Nagar, Indore",
  "Palasia, Indore",
  "Rau, Indore",
  "Bhawarkua, Indore",
  "Scheme No. 54, Indore"
];

export default function LocationPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [search, setSearch] = useState("");
  const filtered = locations.filter(item => item.toLowerCase().includes(search.toLowerCase()));

  const choose = (location) => {
    onChange(location);
    setSearch("");
    setOpen(false);
    setMapOpen(false);
  };

  return (
    <div className="location-picker">
      <div className="location-field">
        <MapPin size={18} fill="#2563eb" color="#2563eb" />
        <div className="location-field-main">
          <small>Delivery location</small>
          <input value={value} onChange={e => onChange(e.target.value)} placeholder="Enter delivery location" aria-label="Delivery location" />
        </div>
        <button className="location-toggle" onClick={() => setOpen(v => !v)} aria-label="Choose delivery location">
          <ChevronDown size={16} className={open ? "rotate" : ""} />
        </button>
      </div>

      {open && (
        <div className="location-menu">
          <div className="location-search"><Search size={14}/><input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Search location" /></div>
          <div className="location-options">
            {filtered.map(item => <button key={item} onClick={() => choose(item)}><MapPin size={13}/><span>{item}</span>{value === item && <Check size={13}/>}</button>)}
          </div>
          <button className="map-option" onClick={() => setMapOpen(true)}><Map size={15}/><span>Select from map</span><ChevronDown size={13} className="map-arrow"/></button>
        </div>
      )}

      {mapOpen && (
        <div className="map-overlay" onClick={() => setMapOpen(false)}>
          <div className="map-modal" onClick={e => e.stopPropagation()}>
            <div className="map-modal-head"><strong>Select from map</strong><button onClick={() => setMapOpen(false)}><X size={17}/></button></div>
            <div className="fake-map">
              <span className="road road-a"/><span className="road road-b"/><span className="road road-c"/>
              {locations.map((item, i) => <button key={item} className={`map-pin pin-${i+1}`} onClick={() => choose(item)} title={item}><MapPin size={25} fill="#2563eb" color="#fff" /></button>)}
              <div className="map-label label-1">Vijay Nagar</div><div className="map-label label-2">Palasia</div><div className="map-label label-3">Rau</div><div className="map-label label-4">Bhawarkua</div><div className="map-label label-5">Scheme 54</div>
            </div>
            <p>Tap a location pin to set the delivery location.</p>
          </div>
        </div>
      )}
    </div>
  );
}
