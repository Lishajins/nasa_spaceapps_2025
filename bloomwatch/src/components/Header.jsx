import React, { useState } from "react";
import { format } from "date-fns";

export default function Header({ mode, setMode, date, setDate }) {
  const [q, setQ] = useState("");

  function submitSearch(e){
    e.preventDefault();
    // triggers an event: courtesy basic global "search" event pattern
    window.dispatchEvent(new CustomEvent("bw:search", { detail: { q, mode } }));
  }

  return (
    <header className="header">
      <div className="brand">BloomWatch</div>
      <nav style={{display:"flex",gap:12,alignItems:"center",marginLeft:12}}>
        <div style={{color:"var(--muted)"}}>Agriculture</div>
        <div style={{color:"var(--muted)"}}>Pollen-Disease</div>
      </nav>

      <div className="header-controls">
        <div className="toggle" role="tablist">
          <button className={mode === "plant" ? "active" : ""} onClick={()=>setMode("plant")}>Plant</button>
          <button className={mode === "location" ? "active" : ""} onClick={()=>setMode("location")}>Location</button>
        </div>

        <form onSubmit={submitSearch} className="search" role="search">
          <input placeholder={mode === "plant" ? "Search for a plant..." : "Search for a location..."} value={q} onChange={e=>setQ(e.target.value)} />
          <button type="submit" style={{border:0,background:"transparent",color:"var(--muted)",cursor:"pointer"}}>Search</button>
        </form>

        <div className="date-picker" title="Select date" onClick={()=>{
          const d = prompt("Enter YYYY-MM-DD", format(date,"yyyy-MM-dd"));
          if(d) setDate(new Date(d));
        }}>
          {format(date,"yyyy-MM-dd")}
        </div>

        <button className="timeline-btn" onClick={()=> window.dispatchEvent(new CustomEvent("bw:toggleTimeline"))}>Timeline Explorer</button>
      </div>
    </header>
  );
}
