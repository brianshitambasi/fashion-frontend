import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-2 py-lg-3 sticky-top">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand fw-bold fs-4 fs-lg-3 text-uppercase" to="/">
          <span className="text-pink">Beauty</span>Hub
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0"
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
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link px-2 px-lg-3 ${isActive ? "active" : ""}`
                }
              >
                <i className="bi bi-house d-lg-none me-2"></i>
                Home
              </NavLink>
            </li>

            {/* Show these only when logged in */}
            {user && (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/shops"
                    className={({ isActive }) =>
                      `nav-link px-2 px-lg-3 ${isActive ? "active" : ""}`
                    }
                  >
                    <i className="bi bi-shop d-lg-none me-2"></i>
                    Salons
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/hairstyles"
                    className={({ isActive }) =>
                      `nav-link px-2 px-lg-3 ${isActive ? "active" : ""}`
                    }
                  >
                    <i className="bi bi-scissors d-lg-none me-2"></i>
                    Hairstyles
                  </NavLink>
                </li>
              </>
            )}

            <li className="nav-item">
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `nav-link px-2 px-lg-3 ${isActive ? "active" : ""}`
                }
              >
                <i className="bi bi-info-circle d-lg-none me-2"></i>
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `nav-link px-2 px-lg-3 ${isActive ? "active" : ""}`
                }
              >
                <i className="bi bi-telephone d-lg-none me-2"></i>
                Contact
              </NavLink>
            </li>
          </ul>

          {/* Right Buttons */}
          <div className="d-flex flex-column flex-lg-row gap-2 gap-lg-3 mt-3 mt-lg-0">
            {/* If user is logged in, show logout + username */}
            {user ? (
              <>
                <div className="d-flex align-items-center justify-content-between justify-content-lg-start mb-2 mb-lg-0">
                  <span className="navbar-text me-0 me-lg-3 text-center text-lg-start">
                    <small className="text-muted d-block d-lg-none">Welcome back</small>
                    <strong>{user.name}</strong>
                    <small className="text-muted d-block d-lg-none">({user.role})</small>
                  </span>
                </div>
                <div className="d-flex gap-2">
                  <Link
                    to={user?.role === "customer" ? "/customer/dashboard" : "/shopowner/dashboard"}
                    className="btn btn-outline-primary btn-sm flex-fill"
                  >
                    <i className="bi bi-speedometer2 me-1"></i>
                    <span className="d-none d-lg-inline">Dashboard</span>
                  </Link>
                  <button onClick={logout} className="btn btn-outline-dark btn-sm flex-fill">
                    <i className="bi bi-box-arrow-right me-1"></i>
                    <span className="d-none d-lg-inline">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="d-flex gap-2 w-100">
                <Link to="/login" className="btn btn-outline-dark btn-sm flex-fill">
                  <i className="bi bi-box-arrow-in-right me-1"></i>
                  Login
                </Link>
                <Link to="/register" className="btn btn-pink btn-sm flex-fill">
                  <i className="bi bi-person-plus me-1"></i>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bootstrap Icons */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css"
        rel="stylesheet"
      />

      {/* Custom Styles */}
      <style jsx>{`
        .text-pink {
          color: #e83e8c !important;
        }
        .btn-pink {
          background-color: #e83e8c;
          border-color: #e83e8c;
          color: white;
        }
        .btn-pink:hover {
          background-color: #d81b60;
          border-color: #d81b60;
          color: white;
        }
        .nav-link {
          font-weight: 500;
          transition: all 0.3s ease;
          border-radius: 0.375rem;
          margin: 0.125rem 0;
        }
        .nav-link:hover {
          background-color: #f8f9fa;
          transform: translateY(-1px);
        }
        .nav-link.active {
          background-color: #e83e8c;
          color: white !important;
          font-weight: 600;
        }
        .navbar-toggler:focus {
          box-shadow: 0 0 0 0.1rem rgba(232, 62, 140, 0.25);
        }
        @media (max-width: 991.98px) {
          .navbar-collapse {
            background: white;
            border-radius: 0.5rem;
            box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
            padding: 1rem;
            margin-top: 0.5rem;
          }
          .navbar-nav {
            text-align: center;
          }
          .nav-link {
            padding: 0.75rem 1rem;
            margin: 0.25rem 0;
          }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
