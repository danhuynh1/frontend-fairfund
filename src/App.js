import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import GroupDetail from './pages/GroupDetail';

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-4 text-center">
        <div className="text-4xl mb-4 animate-spin">⏳</div>
        <h2 className="text-2xl font-bold mb-2">Loading your profile...</h2>
      </div>
    );
  }

  return (
    <Router>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/groups/:id" element={<PrivateRoute><GroupDetail /></PrivateRoute>} />
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
