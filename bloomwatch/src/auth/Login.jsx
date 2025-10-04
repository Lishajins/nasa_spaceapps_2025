import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setErr("");
    try {
      const resp = await api.login({ email, password });
      // stores token in localStorage
      localStorage.setItem("bw_token", resp.token);
      nav("/");
    } catch (error) {
      setErr(error.message || "Login failed");
    }
  }

  return (
    <div style={{display:"flex",height:"100vh",alignItems:"center",justifyContent:"center"}}>
      <form onSubmit={submit} style={{width:360,background:"rgba(0,0,0,0.4)",padding:24,borderRadius:12}}>
        <h2 style={{color:"var(--accent)"}}>BloomWatch</h2>
        <p style={{color:"var(--muted)"}}>Sign in to continue</p>
        <label style={{display:"block",marginTop:12,color:"var(--muted)"}}>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} required style={{width:"100%",padding:8,marginTop:6,borderRadius:8,border:0,background:"rgba(255,255,255,0.02)",color:"inherit"}}/>
        <label style={{display:"block",marginTop:12,color:"var(--muted)"}}>Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required style={{width:"100%",padding:8,marginTop:6,borderRadius:8,border:0,background:"rgba(255,255,255,0.02)",color:"inherit"}}/>
        {err && <div style={{color:"tomato",marginTop:10}}>{err}</div>}
        <button type="submit" style={{marginTop:16,width:"100%",padding:10,borderRadius:8,background:"var(--accent)",border:0,color:"#fff"}}>Sign in</button>
      </form>
    </div>
  );
}
