import React,{useEffect,useState}from"react";
import{Check,ChevronRight,Info,Plus,Truck}from"lucide-react";
import{useNavigate}from"react-router-dom";
import Header from"../../components/Header/Header";
import VendorBottomNav from"../../components/VendorBottomNav/VendorBottomNav";
import{api}from"../../api/client";
import"./VendorPricing.css";

const emptyForm={capacity:"6000",vehicleNumber:"",price:"",location:""};
export default function VendorPricing(){
  const nav=useNavigate();
  const[tankers,setTankers]=useState([]),[form,setForm]=useState(emptyForm),[profile,setProfile]=useState(null);
  const[saved,setSaved]=useState(false),[message,setMessage]=useState(""),[error,setError]=useState(""),[busy,setBusy]=useState(false);
  const load=async()=>{const[t,v]=await Promise.all([api.get("/vendors/me/tankers"),api.get("/vendors/me")]);setTankers(t.tankers||[]);setProfile(v.vendor||null);setForm(f=>({...f,location:f.location||v.vendor?.location||"Vijay Nagar, Indore"}));};
  useEffect(()=>{load().catch(e=>setError(e.message))},[]);
  const update=(id,price)=>setTankers(ts=>ts.map(t=>t._id===id?{...t,price}:t));
  const save=async()=>{setError("");setMessage("");try{for(const t of tankers)await api.patch(`/vendors/me/tankers/${t._id}`,{price:Number(t.price)});setSaved(true);setMessage("Existing tanker prices saved.");setTimeout(()=>setSaved(false),1500)}catch(e){setError(e.message)}};
  const addTanker=async e=>{e.preventDefault();setBusy(true);setError("");setMessage("");try{const result=await api.post("/tankers",{capacity:Number(form.capacity),vehicleNumber:form.vehicleNumber.trim(),price:Number(form.price),location:form.location.trim()||profile?.location||""});setTankers(ts=>[...ts,result.tanker].sort((a,b)=>a.capacity-b.capacity));setForm(f=>({...emptyForm,location:f.location||profile?.location||"Vijay Nagar, Indore"}));setMessage(profile?.verified?"Tanker added to your account. Customers can see it when it is available and you are on duty.":"Tanker added. Customers will see it after an admin verifies your vendor account.")}catch(e){setError(e.message)}finally{setBusy(false)}};
  const toggleAvailability=async t=>{setError("");setMessage("");try{const available=!(t.available&&t.status==="available");const r=await api.patch(`/vendors/me/tankers/${t._id}`,{available,status:available?"available":"inactive"});setTankers(ts=>ts.map(x=>x._id===t._id?r.tanker:x));setMessage(available?"Tanker marked available.":"Tanker marked unavailable.")}catch(e){setError(e.message)}};
  return <div className="mobile-page"><Header back title="Manage Tankers & Pricing"/><main className="pricing-content">
    <div className="info-banner"><Info size={17}/><span>Tankers added here are saved in the database. Only available tankers from verified, on-duty vendors are shown to customers.</span></div>
    <section className="pricing-card"><div className="pricing-head"><div><h2>Your Tankers</h2><p>Update prices or availability</p></div><span>{tankers.length} total</span></div>
      {!tankers.length&&<p className="tanker-empty">You have not added any tankers yet. Add one below to create a customer listing.</p>}
      {tankers.map(t=><div className="price-row" key={t._id}><div><b>{t.capacity} L</b><small>{t.vehicleNumber} · {t.location}</small><small className={t.available&&t.status==="available"?"tanker-available":"tanker-unavailable"}>{t.available&&t.status==="available"?"Available":"Unavailable"}</small></div><label>₹<input type="number" min="0" value={t.price} onChange={e=>update(t._id,e.target.value)}/></label><button type="button" className="tanker-availability" onClick={()=>toggleAvailability(t)}>{t.available&&t.status==="available"?"Pause":"Enable"}</button></div>)}
    </section>
    {tankers.length>0&&<button type="button" className="save-price" onClick={save}>{saved?<><Check size={16}/>Pricing Saved</>:<>Save Pricing</>}</button>}
    <form className="add-tanker-card" onSubmit={addTanker}><div className="add-tanker-title"><Truck size={19}/><div><h2>Add a tanker</h2><p>Create a real listing for customers</p></div></div>
      <label>Capacity<select value={form.capacity} onChange={e=>setForm({...form,capacity:e.target.value})} required><option value="6000">6,000 litres</option><option value="8000">8,000 litres</option><option value="10000">10,000 litres</option><option value="12000">12,000 litres</option><option value="15000">15,000 litres</option><option value="20000">20,000 litres</option><option value="25000">25,000 litres</option></select></label>
      <label>Vehicle number<input value={form.vehicleNumber} onChange={e=>setForm({...form,vehicleNumber:e.target.value})} placeholder="e.g. MP09 AB 1234" required/></label>
      <label>Price per delivery (₹)<input type="number" min="0" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="e.g. 800" required/></label>
      <label>Service area<input value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="e.g. Palasia, Indore" required/></label>
      <button type="submit" className="save-price" disabled={busy}><Plus size={16}/>{busy?"Adding tanker…":"Add Tanker"}</button>
    </form>
    {error&&<p className="pricing-error">{error}</p>}{message&&<p className="pricing-message">{message}</p>}
    <button className="secondary-link" onClick={()=>nav('/vendor')}>Back to Dashboard <ChevronRight size={14}/></button>
  </main><VendorBottomNav/></div>
}
