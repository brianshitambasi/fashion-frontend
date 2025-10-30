import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const NavbarComponent = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm py-3 sticky-top">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand fw-bold text-success fs-4" to="/">
           LOOKS <span className="text-dark">NAIROBI</span>
        </Link>

        {/* Mobile Toggler */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">

            {/* Show Home/About ONLY if not logged in */}
            {!user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-dark fw-semibold" to="/">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-dark fw-semibold" to="/about">
                    About
                  </Link>
                </li>
              </>
            )}

            {/* If user is logged in */}
            {user ? (
              <>
                {/* SHOP OWNER */}
                {user.role === "shop" && (
                  <li className="nav-item">
                    <Link
                      className="nav-link text-dark fw-semibold"
                      to="/shopowner-dashboard"
                    >
                      Shop Dashboard
                    </Link>
                  </li>
                )}

                {/* ADMIN */}
                {user.role === "admin" && (
                  <li className="nav-item">
                    <Link
                      className="nav-link text-dark fw-semibold"
                      to="/admin/dashboard"
                    >
                      Admin Dashboard
                    </Link>
                  </li>
                )}

                {/* CUSTOMER */}
                {user.role === "customer" && (
                  <li className="nav-item">
                    <Link
                      className="nav-link text-dark fw-semibold"
                      to="/bookings"
                    >
                      My Bookings
                    </Link>
                  </li>
                )}

                {/* User Dropdown */}
                <li className="nav-item dropdown ms-3">
                  <button
                    className="btn btn-outline-success dropdown-toggle fw-semibold"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {user.name || "Account"}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow">
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                {/* Guest Links */}
                <li className="nav-item ms-2">
                  <Link className="btn btn-outline-success px-3" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item ms-2">
                  <Link className="btn btn-success px-3" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavbarComponent;
