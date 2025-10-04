import React, { useState, useEffect } from "react";
import Slider from "rc-slider/es";
import "rc-slider/assets/index.css";
import api from "../services/api";
import { format } from "date-fns";

/*
  TimelinePanel drives timeline scrubbing and calls backend timeline endpoints.
  It shows Monthly / Yearly / Decade modes and dispatches bw:timeline events with current frame.
*/

export default function TimelinePanel({ onClose, mode="plant", q }) {
  const [modeStep, setModeStep] = useState("yearly"); // monthly, yearly, decade
  const [value, setValue] = useState(5); // generic slider value
  const [frames, setFrames] = useState([]);

  useEffect(()=>{
    // build frames array per modeStep
    if (modeStep === "monthly") {
      setFrames(Array.from({length:30}, (_,i)=> `Day ${i+1}`));
      setValue(0);
    } else if (modeStep === "yearly") {
      setFrames(["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]);
      setValue(5);
    } else {
      setFrames(Array.from({length:10}, (_,i)=> `${2015 + i}`));
      setValue(5);
    }
  }, [modeStep]);

  useEffect(()=>{
    // call backend for timeline frame changes
    const frame = frames[value] || frames[0];
    // build date param depending on modeStep
    const payload = { q, mode, modeStep, frame };
    if (!q) return;
    api.timeline({ type: mode, q, modeStep, frame }).then(resp=>{
      // resp.hotspots
      window.dispatchEvent(new CustomEvent("bw:hotspots", { detail: { hotspots: resp.hotspots || [] } }));
    }).catch(console.error);
  }, [value, frames]);

  return (
    <div className="timeline-panel">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <strong>Timeline Explorer</strong>
        <button onClick={onClose} style={{background:"transparent",color:"var(--muted)",border:0}}>Close</button>
      </div>

      <div style={{marginTop:12}}>
        <div style={{fontSize:12,color:"var(--muted)"}}>Mode</div>
        <div className="timeline-mode">
          <button className={modeStep==="monthly" ? "active":""} onClick={()=>setModeStep("monthly")}>Monthly</button>
          <button className={modeStep==="yearly" ? "active":""} onClick={()=>setModeStep("yearly")}>Yearly</button>
          <button className={modeStep==="decade" ? "active":""} onClick={()=>setModeStep("decade")}>Decade</button>
        </div>

        <div style={{marginTop:16}}>
          <div style={{fontSize:12,color:"var(--muted)"}}>Scrub</div>
          <Slider min={0} max={Math.max(0, frames.length-1)} value={value} onChange={v=>setValue(v)} />
          <div style={{marginTop:8,color:"var(--muted)"}}>Current: {frames[value]}</div>
        </div>
      </div>
    </div>
  );
}
