import React,{createContext,useContext,useEffect,useState} from "react";
import {api,getSession,logout,setSession} from "../api/client";
const AuthContext=createContext(null);
export function AuthProvider({children}){const [user,setUser]=useState(getSession); const [loading,setLoading]=useState(Boolean(sessionStorage.getItem("aquaConnectToken")));
 useEffect(()=>{if(!sessionStorage.getItem("aquaConnectToken")){setLoading(false);return;} api.get("/auth/me").then(r=>setUser(r.user)).catch(()=>{logout();setUser(null)}).finally(()=>setLoading(false));},[]);
 const login=async(body)=>{const r=await api.post("/auth/login",body);setSession(r);setUser(r.user);return r.user};
 const register=async(body)=>api.post("/auth/register",body);
 const signOut=()=>{logout();setUser(null)};
 return <AuthContext.Provider value={{user,loading,login,register,signOut,setUser}}>{children}</AuthContext.Provider>}
export const useAuth=()=>useContext(AuthContext);
