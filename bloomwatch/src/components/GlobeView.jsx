import React, { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";

export default function GlobeView({ hotspots = [] }) {
  const globeRef = useRef();
  const [points, setPoints] = useState([]);

  useEffect(() => {
    // Initialize globe rotation and controls
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = false;
    }
  }, []);

  useEffect(() => {
    // Transform hotspots to points format for react-globe.gl
    const mapped = hotspots.map((h, i) => ({
      id: i,
      lat: h.lat,
      lng: h.lng,
      size: Math.max(0.5, (h.intensity || 50) / 40),
      color: `rgba(0,200,140,${Math.min(1, (h.intensity || 60) / 100)})`,
      label: `${h.species || ""}: ${Math.round(h.intensity || 0)}%`,
    }));
    setPoints(mapped);
  }, [hotspots]);

  return (
    <div style={{ width: "100%", height: "520px" }}>
      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        backgroundColor="rgba(0,0,0,0)"
        pointsData={points}
        pointAltitude={(d) => d.size * 0.03}
        pointColor={(d) => d.color}
        pointRadius={(d) => d.size * 0.5}
        onPointClick={(d) => alert(d.label)}
      />
    </div>
  );
}
