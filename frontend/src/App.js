import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Production from './pages/Production';
import Inventory from './pages/Inventory';
import Pricing from './pages/Pricing';
import Sales from './pages/Sales';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Users from './pages/Users';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsAuthenticated(loggedIn);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="App">
        <Navbar onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/production" element={<Production />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/users" element={<Users />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
