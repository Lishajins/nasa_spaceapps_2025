import React, { useState } from "react"; 
import { Routes, Route, Navigate, useLocation } from "react-router-dom"; 
import Header from "./components/Header"; 
import PlantPage from "./pages/PlantPage"; 
import LocationPage from "./pages/LocationPage"; 
import Login from "./auth/Login"; 

function RequireAuth({ children }) { 
  const token = localStorage.getItem("bw_token"); 
  const location = useLocation(); 

  if (!token) { 
    // Redirect to login if no token 
    return <Navigate to="/login" state={{ from: location }} replace />; 
  } 
  return children; 
} 

export default function App() { 
  const [mode, setMode] = useState("plant"); 
  const [date, setDate] = useState(new Date()); 

  return ( 
    <div className="app-root"> 
      <Routes> 
        {/* Public Route */} 
        <Route path="/login" element={<Login />} /> 

        {/* Protected Routes */} 
        <Route 
          path="/" 
          element={ 
            <RequireAuth> 
              <div> 
                <Header mode={mode} setMode={setMode} date={date} setDate={setDate} /> 
                <main className="main-content"> 
                  {mode === "plant" ? ( 
                    <PlantPage date={date} /> 
                  ) : ( 
                    <LocationPage date={date} /> 
                  )} 
                </main> 
              </div> 
            </RequireAuth> 
          } 
        /> 

        {/* Catch-all */} 
        <Route path="*" element={<Navigate to="/" replace />} /> 
      </Routes> 
    </div> 
  ); 
}
