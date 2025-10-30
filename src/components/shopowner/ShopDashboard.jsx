// components/ShopDashboard.js
import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const ShopDashboard = () => {
  return (
    <div className="container py-4">
      <div className="text-center mb-4">
        <h2 className="fw-bold text-primary">Shop Owner Dashboard</h2>
        <p className="text-muted">Welcome back! Manage your salon and services with ease.</p>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 rounded-4 text-center p-4 h-100">
            <div className="text-primary mb-3">
              <i className="bi bi-shop fs-1"></i>
            </div>
            <h5 className="fw-bold">My Shops</h5>
            <p className="text-muted small">View and manage all your registered salons.</p>
            <Link to="/shopowner/shops" className="btn btn-outline-primary">
              View Shops
            </Link>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 rounded-4 text-center p-4 h-100">
            <div className="text-success mb-3">
              <i className="bi bi-plus-circle fs-1"></i>
            </div>
            <h5 className="fw-bold">Create Shop</h5>
            <p className="text-muted small">Add a new salon or branch to your account.</p>
            <Link to="/shopowner/create" className="btn btn-outline-success">
              Create Shop
            </Link>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 rounded-4 text-center p-4 h-100">
            <div className="text-warning mb-3">
              <i className="bi bi-gear fs-1"></i>
            </div>
            <h5 className="fw-bold">Manage Profile</h5>
            <p className="text-muted small">Update your account or business information.</p>
            <Link to="/shopowner/profile" className="btn btn-outline-warning">
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-5 text-center">
        <p className="text-secondary small">
          Need help? Visit our <Link to="/help">support center</Link>.
        </p>
      </div>
    </div>
  );
};

export default ShopDashboard;