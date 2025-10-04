import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import PlantPage from "./pages/PlantPage";
import LocationPage from "./pages/LocationPage";

export default function App() {
  const [mode, setMode] = useState("plant");
  const [date, setDate] = useState(new Date());

  return (
    <div className="app-root">
      <Header mode={mode} setMode={setMode} date={date} setDate={setDate} />
      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={mode === "plant" ? <PlantPage date={date} /> : <LocationPage date={date} />}
          />
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
