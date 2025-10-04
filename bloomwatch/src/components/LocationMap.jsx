import React from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function LocationMap({ location, hotspots }) {
  // Example location: { lat: 20.5937, lng: 78.9629 }  (India)
  const position = location || { lat: 20.5937, lng: 78.9629 };

  return (
    <div style={{ height: "500px", width: "100%" }}>
      <MapContainer center={position} zoom={5} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {hotspots &&
          hotspots.map((spot, i) => (
            <CircleMarker
              key={i}
              center={[spot.lat, spot.lng]}
              radius={8}
              color="green"
              fillColor="yellow"
              fillOpacity={0.6}
            >
              <Popup>
                Bloom Intensity: {spot.intensity}%<br />
                Plant: {spot.plant}
              </Popup>
            </CircleMarker>
          ))}
      </MapContainer>
    </div>
  );
}
