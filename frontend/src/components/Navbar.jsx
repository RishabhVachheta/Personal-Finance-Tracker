import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./css/Navbar.css";
// import "./css/Dashboard.css"

const Navbar = () => {
  const { user, logout } = useContext(AuthContext); 

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-link">Dashboard</Link>
        <Link to="/transactions" className="navbar-link">Transaction</Link>
        <Link to="/goals" className="navbar-link">Goal</Link>

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
    </nav>
  );
};

export default Navbar;
