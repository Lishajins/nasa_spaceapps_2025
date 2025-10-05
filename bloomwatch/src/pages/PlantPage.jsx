import React, { useEffect, useState } from "react";
import GlobeView from "../components/GlobeView";
import PlantCard from "../components/PlantCard";
import TimelinePanel from "../components/TimelinePanel";
import api from "../services/api";

export default function PlantPage({ date }) {
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [hotspots, setHotspots] = useState([]);
  const [showTimeline, setShowTimeline] = useState(false);
  const [ndvi, setNdvi] = useState(null);

  // --- SEARCH HANDLER ---
  useEffect(() => {
    async function sHandler(e) {
      const q = e.detail.q;
      if (!q) return;

      try {
        const resp = await api.searchPlant({ q });
        setSelectedPlant(resp.plant || { name: q });

        // If no hotspots, generate demo ones
        let newHotspots = resp.hotspots;
        if (!newHotspots || newHotspots.length === 0) {
          newHotspots = Array.from({ length: 15 }, () => ({
            lat: -60 + Math.random() * 120,
            lng: -180 + Math.random() * 360,
            intensity: Math.floor(40 + Math.random() * 60),
            species: q,
          }));
        }

        setHotspots(newHotspots);

        // Broadcast to GlobeView
        window.dispatchEvent(new CustomEvent("bw:hotspots", { detail: { hotspots: newHotspots } }));

        // Fetch NDVI for first hotspot (mock/demo-safe)
        if (newHotspots?.length > 0) {
          const first = newHotspots[0];
          try {
            const ndviResp = await api.fetchNDVI({
              lat: first.lat,
              lon: first.lng,
              start: "2025-09-01",
              end: "2025-09-30",
            });
            console.log("✅ NDVI response:", ndviResp);
            setNdvi(ndviResp.ndvi || (0.4 + Math.random() * 0.3).toFixed(2));
          } catch (err) {
            console.warn("NDVI fetch failed, using demo value");
            setNdvi((0.4 + Math.random() * 0.3).toFixed(2));
          }
        }
      } catch (err) {
        console.error(err);
      }
    }

    function handleToggleTimeline() {
      setShowTimeline((prev) => !prev);
    }

    window.addEventListener("bw:search", sHandler);
    window.addEventListener("bw:toggleTimeline", handleToggleTimeline);

    return () => {
      window.removeEventListener("bw:search", sHandler);
      window.removeEventListener("bw:toggleTimeline", handleToggleTimeline);
    };
  }, []);

  // --- DATE CHANGE HANDLER ---
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("bw:dateChange", { detail: { date } }));

    if (selectedPlant) {
      api.timeline({ type: "plant", q: selectedPlant.name, date })
        .then((resp) => {
          const newHotspots = resp.hotspots?.length
            ? resp.hotspots
            : Array.from({ length: 15 }, () => ({
                lat: -60 + Math.random() * 120,
                lng: -180 + Math.random() * 360,
                intensity: Math.floor(40 + Math.random() * 60),
                species: selectedPlant.name,
              }));
          setHotspots(newHotspots);
          window.dispatchEvent(new CustomEvent("bw:hotspots", { detail: { hotspots: newHotspots } }));
        })
        .catch(console.error);
    }
  }, [date]);

  return (
    <div className="layout">
      {/* 🌍 Globe View Section */}
      <div className="globe-pane" style={{ position: "relative" }}>
        <GlobeView hotspots={hotspots} />

        <button
          className="timeline-btn"
          onClick={() => setShowTimeline(true)}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 5,
            background: "rgba(20,20,20,0.7)",
            color: "white",
            border: "1px solid #555",
            borderRadius: 6,
            padding: "6px 10px",
            cursor: "pointer",
          }}
        >
          Open Timeline
        </button>

        {showTimeline && (
          <div style={{ position: "absolute", bottom: 20, left: 20, zIndex: 10 }}>
            <TimelinePanel
              onClose={() => setShowTimeline(false)}
              mode="plant"
              q={selectedPlant?.name}
            />
          </div>
        )}
      </div>

      {/* 🌿 Sidebar Section */}
      <aside className="side-pane">
        <h3 style={{ margin: 0 }}>Plant Details</h3>
        <div className="card">
          <PlantCard plant={selectedPlant} hotspots={hotspots} ndvi={ndvi} />
        </div>
      </aside>
    </div>
  );
}
