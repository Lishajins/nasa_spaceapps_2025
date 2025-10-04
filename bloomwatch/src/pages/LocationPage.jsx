import React, { useEffect, useState } from "react";
import GlobeView from "../components/GlobeView";
import LocationMap from "../components/LocationMap";
import TimelinePanel from "../components/TimelinePanel";
import api from "../services/api";

export default function LocationPage({ date }) {
  const [location, setLocation] = useState(null);
  const [hotspots, setHotspots] = useState([]);
  const [showTimeline, setShowTimeline] = useState(false);

  useEffect(()=>{
    const sHandler = e => {
      const q = e.detail.q;
      if (!q) return;
      api.searchLocation({ q })
        .then(resp => {
          setLocation(resp.location || { name: q });
          setHotspots(resp.hotspots || []);
          window.dispatchEvent(new CustomEvent("bw:goto", { detail: { bbox: resp.bbox } }));
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
    window.dispatchEvent(new CustomEvent("bw:dateChange", { detail: { date } }));
    if (location) {
      api.timeline({ type:"location", q: location.name, date })
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
        {showTimeline && <TimelinePanel onClose={()=>setShowTimeline(false)} mode="location" q={location?.name}/>}
      </div>

      <aside className="side-pane">
        <h3 style={{marginTop:0}}>Location</h3>
        <div className="card">
          <LocationMap location={location} hotspots={hotspots} />
        </div>
      </aside>
    </div>
  );
}
