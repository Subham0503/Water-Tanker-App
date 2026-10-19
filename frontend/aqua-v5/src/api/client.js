const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const token = sessionStorage.getItem("aquaConnectToken");
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  let data = {};
  try { data = await res.json(); } catch {}
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
}
export const api = {
  get:(p)=>request(p),
  post:(p,b)=>request(p,{method:"POST",body:JSON.stringify(b)}),
  put:(p,b)=>request(p,{method:"PUT",body:JSON.stringify(b)}),
  patch:(p,b)=>request(p,{method:"PATCH",body:JSON.stringify(b)}),
  del:(p)=>request(p,{method:"DELETE"}),
};
export function setSession(data){sessionStorage.setItem("aquaConnectToken",data.token);sessionStorage.setItem("aquaConnectSession",JSON.stringify(data.user));}
export function getSession(){try{return JSON.parse(sessionStorage.getItem("aquaConnectSession")||"null")}catch{return null}}
export function logout(){sessionStorage.removeItem("aquaConnectToken");sessionStorage.removeItem("aquaConnectSession");}
