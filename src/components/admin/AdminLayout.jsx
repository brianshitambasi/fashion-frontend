// src/components/admin/AdminLayout.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logout logic here
    navigate("/");
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 bg-dark text-white vh-100 p-0">
          <div className="sidebar-sticky pt-3">
            <h4 className="text-center mb-4 border-bottom pb-2">Admin Panel</h4>
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link to="/admin/dashboard" className="nav-link text-white">
                  📊 Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/users" className="nav-link text-white">
                  👥 Users
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/salons" className="nav-link text-white">
                  🏪 Salons
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/products" className="nav-link text-white">
                  💇 Products
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/bookings" className="nav-link text-white">
                  📅 Bookings
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/reports" className="nav-link text-white">
                  📊 Reports
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/settings" className="nav-link text-white">
                  ⚙️ Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9 col-lg-10 p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;