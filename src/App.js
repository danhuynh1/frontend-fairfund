// src/App.js
// This version ensures all components are imported correctly for routing.
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

// Import Components and Pages
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import GroupDetail from './pages/GroupDetail'; // Ensure this path is correct

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
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

export default App;
