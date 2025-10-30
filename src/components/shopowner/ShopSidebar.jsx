// components/shopowner/ShopSidebar.js
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const ShopSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === "/shopowner" && location.pathname === "/shopowner") {
      return true;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 bg-light border-end shadow-sm"
      style={{ width: "280px", minHeight: "100vh" }}
    >
      {/* Logo / Brand */}
      <Link
        to="/shopowner"
        className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-decoration-none"
      >
        <span className="fs-4 fw-bold text-success">
          <i className="bi bi-scissors me-2"></i>
          LOOKS<span className="text-dark">NAIROBI</span>
        </span>
      </Link>

      <hr />

      {/* Navigation Links */}
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item mb-2">
          <Link
            to="/shopowner"
            className={`nav-link d-flex align-items-center fw-semibold ${
              isActive("/shopowner")
                ? "active bg-success text-white"
                : "text-dark"
            }`}
          >
            <i className="bi bi-speedometer2 me-2"></i>
            Dashboard
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link
            to="/shopowner/shops"
            className={`nav-link d-flex align-items-center fw-semibold ${
              isActive("/shopowner/shops")
                ? "active bg-success text-white"
                : "text-dark"
            }`}
          >
            <i className="bi bi-shop me-2"></i>
            My Shops
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link
            to="/shopowner/create"
            className={`nav-link d-flex align-items-center fw-semibold ${
              isActive("/shopowner/create")
                ? "active bg-success text-white"
                : "text-dark"
            }`}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Create Shop
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link
            to="/shopowner/profile"
            className={`nav-link d-flex align-items-center fw-semibold ${
              isActive("/shopowner/profile")
                ? "active bg-success text-white"
                : "text-dark"
            }`}
          >
            <i className="bi bi-person-circle me-2"></i>
            My Profile
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link
            to="/shopowner/settings"
            className={`nav-link d-flex align-items-center fw-semibold ${
              isActive("/shopowner/settings")
                ? "active bg-success text-white"
                : "text-dark"
            }`}
          >
            <i className="bi bi-gear me-2"></i>
            Settings
          </Link>
        </li>
      </ul>

      <hr />

      {/* Footer / Logout */}
      <div className="dropdown">
        <Link
          to="#"
          className="d-flex align-items-center text-decoration-none dropdown-toggle text-dark"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="User"
            width="32"
            height="32"
            className="rounded-circle me-2"
          />
          <strong>Shop Owner</strong>
        </Link>
        <ul className="dropdown-menu dropdown-menu-end shadow">
          <li>
            <Link className="dropdown-item" to="/shopowner/profile">
              <i className="bi bi-person me-2"></i>My Profile
            </Link>
          </li>
          <li><hr className="dropdown-divider" /></li>
          <li>
            <button className="dropdown-item text-danger" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-2"></i>Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ShopSidebar;