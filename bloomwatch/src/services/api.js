// src/services/api.js
import axios from "axios";

const api = {
  // Simulate a backend plant search
  async searchPlant({ q }) {
    if (!q) return { plant: null, hotspots: [] };

    // --- 1. Fetch description + image from Wikipedia ---
    const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`;
    let description = "No description available.";
    let images = [];

    try {
      const res = await axios.get(wikiUrl);
      description = res.data.extract || description;
      if (res.data.originalimage) images = [res.data.originalimage.source];
    } catch (err) {
      console.warn("Wikipedia fetch failed:", err.message);
    }

    // --- 2. Generate random hotspots (latitude, longitude, intensity) ---
    const hotspots = Array.from({ length: 8 }, (_, i) => ({
      lat: -60 + Math.random() * 120,
      lng: -180 + Math.random() * 360,
      intensity: Math.round(Math.random() * 100),
      species: q,
    }));

    return {
      plant: {
        name: q,
        scientificName: `${q} plant`,
        description,
        images,
      },
      hotspots,
    };
  },

  async timeline({ type, q, modeStep, frame }) {
    // Just randomize hotspots again to simulate time-series
    const hotspots = Array.from({ length: 8 }, (_, i) => ({
      lat: -60 + Math.random() * 120,
      lng: -180 + Math.random() * 360,
      intensity: Math.round(Math.random() * 100),
      species: q,
    }));
    return { hotspots };
  },

  async fetchNDVI({ lat, lon }) {
    // Simulated NDVI: random value between 0.2 and 0.8
    return { ndvi: (Math.random() * 0.6 + 0.2).toFixed(2) };
  },
};

export default api;
