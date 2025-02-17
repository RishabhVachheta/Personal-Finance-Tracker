import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./css/Navbar.css";
import logo from "../components/Logo/logo.png.png"; // Import the logo image
import ExportCSV from "./ExportButtons";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo Section */}
        <div className="navbar-logo">
          <img src={logo} alt="Finance Tracker Logo" className="logo-image" />
          <span className="logo-text">Finance Tracker</span>
        </div>

        {/* Navigation Links */}
        <div className="navbar-links">
          <Link to="/dashboard" className="navbar-link">Dashboard</Link>
          <Link to="/transactions" className="navbar-link">Transaction</Link>
          <Link to="/goals" className="navbar-link">Goal</Link>
        </div>

        {/* User Authentication Section */}
        <div className="navbar-auth">
          <ExportCSV/>
          {user ? (
            <button className="navbar-link logout-btn" onClick={logout}>
              Logout
            </button>
          ) : (
            <Link to="/login" className="navbar-link login-btn">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
