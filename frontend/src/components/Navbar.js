import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    closeMenu();
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1>🥚 MB Farm Fresh Eggs</h1>
        <button className="nav-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
          {isOpen ? '✕' : '☰'}
        </button>
        <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
          <li><Link to="/" className={isActive('/')} onClick={closeMenu}>Dashboard</Link></li>
          <li><Link to="/production" className={isActive('/production')} onClick={closeMenu}>Production</Link></li>
          <li><Link to="/inventory" className={isActive('/inventory')} onClick={closeMenu}>Inventory</Link></li>
          <li><Link to="/pricing" className={isActive('/pricing')} onClick={closeMenu}>Pricing</Link></li>
          <li><Link to="/sales" className={isActive('/sales')} onClick={closeMenu}>Sales</Link></li>
          <li><Link to="/reports" className={isActive('/reports')} onClick={closeMenu}>Reports</Link></li>
          <li><Link to="/users" className={isActive('/users')} onClick={closeMenu}>Users</Link></li>
          <li><Link to="/tutorial" className={isActive('/tutorial')} onClick={closeMenu}>📚 Tutorial</Link></li>
          <li><Link to="/profile" className={isActive('/profile')} onClick={closeMenu}>Profile</Link></li>
          <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
