// components/public/NotAuthorized.js
import React from 'react';
import { Link } from 'react-router-dom';

const NotAuthorized = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <i className="bi bi-shield-exclamation display-1 text-warning"></i>
          <h1 className="fw-bold mt-4">Access Denied</h1>
          <p className="text-muted mb-4">
            You don't have permission to access this page. Please contact support if you believe this is an error.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/" className="btn btn-primary">
              <i className="bi bi-house me-2"></i>
              Go Home
            </Link>
            <Link to="/contact" className="btn btn-outline-primary">
              <i className="bi bi-headset me-2"></i>
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotAuthorized;