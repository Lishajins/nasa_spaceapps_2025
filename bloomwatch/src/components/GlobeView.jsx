import React, { useEffect, useRef } from "react";
import Globe from "react-globe.gl";

/*
  This component uses react-globe.gl (Three.js). It's lightweight and works well for hackathon demo.
  For production-level GEE overlays, we recommend rendering raster tiles returned from your backend (GEE)
  as a globe texture layer (or use Cesium with imagery provider).
*/

export default function GlobeView({ hotspots = [] }) {
  const ref = useRef();

  useEffect(()=>{
    // react-globe.gl needs a container size
    ref.current.controls().autoRotate = false;
  },[]);

  useEffect(()=>{
    // transform hotspots to markers for globe
    // hotspots expected: [{lat, lng, intensity, species?}]
    const points = (hotspots || []).map((h, i) => ({
      id: i,
      lat: h.lat,
      lng: h.lng,
      size: Math.max(0.5, (h.intensity || 50) / 30),
      color: `rgba(0,200,140,${Math.min(1, (h.intensity||60)/100)})`,
      label: `${h.species || ""} ${Math.round(h.intensity||0)}%`
    }));
    // store on globe instance - triggers re-render via props changes
    ref.current && ref.current.pointOfView && ref.current.globeImageUrl && (ref.current.pointsData = points);
    // dispatch to any listeners
    window.dispatchEvent(new CustomEvent("bw:globePoints", { detail: { points } }));
  }, [hotspots]);

  // event listeners for goto, hotspots etc
  useEffect(()=>{
    const gotoHandler = e => {
      const { bbox } = e.detail || {};
      // if bbox provided, fly to center
      if (bbox && ref.current) {
        const lat = (bbox[1] + bbox[3]) / 2;
        const lng = (bbox[0] + bbox[2]) / 2;
        ref.current.pointOfView({ lat, lng, altitude: 0.7 }, 1500);
      }
    };
    window.addEventListener("bw:goto", gotoHandler);
    return ()=> window.removeEventListener("bw:goto", gotoHandler);
  },[]);

  return (
    <div style={{width: "100%", height: "520px"}}>
      <Globe
        ref={ref}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        backgroundColor="rgba(0,0,0,0)"
        pointsData={(ref.current && ref.current.pointsData) || []}
        pointAltitude={d => d.size}
        pointColor={d => d.color}
        pointRadius={d => d.size}
        onPointClick={d => alert(d.label)}
      />
    </div>
  );
}
