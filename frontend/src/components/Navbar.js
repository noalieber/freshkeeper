// src/components/Navbar.js
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../services/api';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">🥬</span>
        <span className="navbar-name">FreshKeeper</span>
      </div>

      <div className="navbar-links">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Dashboard
        </NavLink>
        <NavLink to="/items" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Pantry
        </NavLink>
        <NavLink to="/recipes" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Recipes
        </NavLink>
        {user?.role === 'admin' && (
          <NavLink to="/users" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Users
          </NavLink>
        )}
        <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Settings
        </NavLink>
      </div>

      <div className="navbar-user">
        <span className="user-info">
          <span className="user-role-badge">{user?.role}</span>
          <span className="user-email">{user?.email}</span>
        </span>
        <button className="btn btn-outline logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
