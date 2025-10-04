import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

const client = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" }
});

// attach token if present
client.interceptors.request.use(cfg => {
  const t = localStorage.getItem("bw_token");
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

export default {
  login: async ({ email, password }) => {
    // POST /auth/login -> returns { token, user }
    const res = await client.post("/auth/login", { email, password });
    return res.data;
  },

  searchPlant: async ({ q }) => {
    // GET /api/plant/search?q=Sunflower
    // backend should query GEE / dataset and return plant metadata + hotspots: { plant: {...}, hotspots: [{lat,lng,intensity,species}] }
    const res = await client.get(`/api/plant/search`, { params: { q } });
    return res.data;
  },

  searchLocation: async ({ q }) => {
    // GET /api/location/search?q=India
    // backend returns { location: { name, bbox, center }, hotspots: [...] }
    const res = await client.get(`/api/location/search`, { params: { q } });
    return res.data;
  },

  timeline: async ({ type, q, date, modeStep, frame }) => {
    // POST /api/timeline
    // body: { type: "plant"|"location", q: "Sunflower" | "India", date: ISO, modeStep:"yearly", frame }
    // backend should query GEE and return hotspots for the specified frame
    const res = await client.post(`/api/timeline`, { type, q, date, modeStep, frame });
    return res.data;
  },

  // Optional: tile fetching endpoint for raster tiles
  // server should serve /tiles/{z}/{x}/{y}.png which are GEE-rendered rasters
};
