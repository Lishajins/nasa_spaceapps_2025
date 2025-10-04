import React, { useEffect, useState } from "react";
import GlobeView from "../components/GlobeView";
import PlantCard from "../components/PlantCard";
import TimelinePanel from "../components/TimelinePanel";
import api from "../services/api";

export default function PlantPage({ date }) {
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [hotspots, setHotspots] = useState([]);
  const [showTimeline, setShowTimeline] = useState(false);

  useEffect(()=>{
    const sHandler = e => {
      const q = e.detail.q;
      if (!q) return;
      // call backend to get plant metadata (this will be defined in your backend)
      api.searchPlant({ q })
        .then(resp => {
          setSelectedPlant(resp.plant || { name: q });
          setHotspots(resp.hotspots || []);
          // also send to globe
          window.dispatchEvent(new CustomEvent("bw:hotspots", { detail: { hotspots: resp.hotspots || [] } }));
        })
        .catch(err => console.error(err));
    };
    const tHandler = ()=> setShowTimeline(s=>!s);

    window.addEventListener("bw:search", sHandler);
    window.addEventListener("bw:toggleTimeline", tHandler);
    return ()=> {
      window.removeEventListener("bw:search", sHandler);
      window.removeEventListener("bw:toggleTimeline", tHandler);
    }
  },[]);

  useEffect(()=>{
    // whenever date changes, notify globe/timeline to fetch historical data
    window.dispatchEvent(new CustomEvent("bw:dateChange", { detail: { date } }));
    // also call backend timeline for plant on date
    if (selectedPlant) {
      api.timeline({ type:"plant", q: selectedPlant.name, date })
        .then(resp => {
          setHotspots(resp.hotspots || []);
          window.dispatchEvent(new CustomEvent("bw:hotspots", { detail: { hotspots: resp.hotspots || [] } }));
        })
        .catch(console.error);
    }
  }, [date]);

  return (
    <div className="layout">
      <div className="globe-pane">
        <GlobeView hotspots={hotspots} />
        <button className="timeline-btn" onClick={()=> setShowTimeline(true)}>Open Timeline</button>
        {showTimeline && <TimelinePanel onClose={()=>setShowTimeline(false)} mode="plant" q={selectedPlant?.name}/>}
      </div>

      <aside className="side-pane">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <h3 style={{margin:0}}>Plant Details</h3>
          <div style={{color:"var(--muted)"}}>Regions: --</div>
        </div>

        <div className="card">
          <PlantCard plant={selectedPlant} hotspots={hotspots} />
        </div>
      </aside>
    </div>
  );
}
