// src/App.js
import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; //
import { AuthContext } from './context/AuthContext'; //

// Import Components and Pages
import Navbar from './components/Navbar'; //
import PrivateRoute from './components/PrivateRoute'; //
import LoginPage from './pages/LoginPage'; //
import Dashboard from './pages/Dashboard'; //
import GroupDetail from './pages/GroupDetail'; //

function App() {
  const { user, loading } = useContext(AuthContext); //
  
  // New state to track if the Render backend is awake
  const [isServerAwake, setIsServerAwake] = useState(false);
  const [wakeMessage, setWakeMessage] = useState("Waking up the server...");

  useEffect(() => {
    const wakeUpServer = async () => {
      try {
        const response = await fetch("https://fairfund-backend.onrender.com/health");
        if (response.ok) {
          setIsServerAwake(true);
        } else {
          setTimeout(wakeUpServer, 3000);
        }
      } catch (error) {
        setWakeMessage("Almost there! The free server is spinning up...");
        setTimeout(wakeUpServer, 3000);
      }
    };

    wakeUpServer();
  }, []);

  // Block rendering until BOTH the server is awake AND AuthContext is done loading
  if (loading || !isServerAwake) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-4 text-center">
        <div className="text-4xl mb-4 animate-spin">⏳</div>
        <h2 className="text-2xl font-bold mb-2">
          {!isServerAwake ? wakeMessage : "Loading your profile..."}
        </h2>
        {!isServerAwake && (
          <p className="text-gray-500 max-w-md">
            The free backend goes to sleep when inactive. Booting up usually takes <strong>30 to 60 seconds</strong>. Thank you for waiting!
          </p>
        )}
      </div>
    );
  }

  return (
    <Router>
      {user && <Navbar />}
      
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <LoginPage /> : <Navigate to="/" />} 
        />
        
        {/* Protected Routes */}
        <Route 
            path="/" 
            element={
                <PrivateRoute>
                    <Dashboard />
                </PrivateRoute>
            } 
        />
        <Route 
            path="/groups/:id" 
            element={
                <PrivateRoute>
                    <GroupDetail />
                </PrivateRoute>
            } 
        />
        
        {/* A fallback route for any other path */}
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App; //
