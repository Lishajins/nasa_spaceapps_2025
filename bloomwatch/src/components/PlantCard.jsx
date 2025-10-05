import React from "react";

export default function PlantCard({ plant, hotspots, ndvi }) {
  if (!plant) {
    return <div style={{ color: "var(--muted)" }}>Search for a plant to see details.</div>;
  }
  return (
    <div>
      <div className="plant-title">{plant.name}</div>
      <div className="plant-sub">{plant.scientificName || ""}</div>
      <p style={{ color: "var(--muted)", marginTop: 12 }}>
        {plant.description || "No description provided."}
      </p>

      <div className="gallery">
        {(plant.images || []).slice(0, 2).map((src, i) => (
          <img key={i} src={src} alt={plant.name + i} />
        ))}
        {!plant.images && <div style={{ color: "var(--muted)" }}>No images available</div>}
      </div>

      <div className="hotspots">
        <div className="hotspot">
          <div style={{ fontWeight: 700 }}>Hotspots</div>
          <div style={{ color: "var(--muted)" }}>{(hotspots && hotspots.length) || 0}</div>
        </div>
        <div className="hotspot">
          <div style={{ fontWeight: 700 }}>Regions</div>
          <div style={{ color: "var(--muted)" }}>--</div>
        </div>
        {ndvi !== null && (
          <div className="hotspot">
            <div style={{ fontWeight: 700 }}>NDVI</div>
            <div style={{ color: "var(--accent)" }}>{ndvi}</div>
          </div>
        )}
      </div>
    </div>
  );
}
