import React,{useEffect,useState}from"react";
import Header from"../../components/Header/Header";
import BottomNav from"../../components/BottomNav/BottomNav";
import TankerCard from"../../components/TankerCard/TankerCard";
import LocationPicker from"../../components/LocationPicker/LocationPicker";
import {api}from"../../api/client";
import"./Home.css";
export default function Home(){
  const[location,setLocation]=useState(localStorage.getItem("aquaDeliveryLocation")||"Vijay Nagar, Indore");
  const[tankers,setTankers]=useState([]),[error,setError]=useState(""),[loading,setLoading]=useState(true);
  useEffect(()=>{let active=true;localStorage.setItem("aquaDeliveryLocation",location);setLoading(true);setError("");setTankers([]);api.get(`/tankers?location=${encodeURIComponent(location)}`).then(r=>{if(active)setTankers(Array.isArray(r.tankers)?r.tankers:[])}).catch(e=>{if(active)setError(e.message||"Unable to load available tankers.")}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[location]);
  return <main className="mobile-page"><Header notification/><section className="home-content"><LocationPicker value={location} onChange={setLocation}/><h2>Available Tankers</h2><p className="home-listing-note">Listings are loaded from registered, admin-verified vendors serving your selected area.</p>{error&&<p className="home-listing-error">{error}</p>}{loading&&<p>Loading available tankers…</p>}{!loading&&!error&&<div className="stack">{tankers.map(t=><TankerCard key={t.id} tanker={t} deliveryLocation={location}/>)}</div>}{!loading&&!error&&!tankers.length&&<p>No verified vendors have available tankers for {location} yet.</p>}</section><BottomNav/></main>
}
