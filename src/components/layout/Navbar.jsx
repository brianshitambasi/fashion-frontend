import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // ✅ make sure this path is correct
import "bootstrap/dist/css/bootstrap.min.css";

function Navbar() {
  const { user, logout } = useAuth(); // ✅ use user info from AuthContext

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3 sticky-top">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand fw-bold fs-3 text-uppercase" to="/">
          <span className="text-pink">Beauty</span>Hub
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Center Links */}
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Home</NavLink>
            </li>

            {/* ✅ Show these only when logged in */}
            {user && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/shops">Salons</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/hairstyles">Hairstyles</NavLink>
                </li>
              </>
            )}

            <li className="nav-item">
              <NavLink className="nav-link" to="/about">About</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contact">Contact</NavLink>
            </li>
          </ul>

          {/* Right Buttons */}
          <div className="d-flex">
            {/* ✅ If user is logged in, show logout + username */}
            {user ? (
              <>
                <span className="navbar-text me-3">
                  Hello, <strong>{user.name}</strong>
                </span>
                <button onClick={logout} className="btn btn-outline-dark">
                  <i className="bi bi-box-arrow-right me-1"></i> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-dark me-2">
                  <i className="bi bi-box-arrow-in-right me-1"></i> Login
                </Link>
                <Link to="/register" className="btn btn-pink">
                  <i className="bi bi-person-plus me-1"></i> Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
