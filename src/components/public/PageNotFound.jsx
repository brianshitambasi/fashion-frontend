// components/public/PageNotFound.js
import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <i className="bi bi-exclamation-triangle display-1 text-muted"></i>
          <h1 className="fw-bold mt-4">404 - Page Not Found</h1>
          <p className="text-muted mb-4">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/" className="btn btn-primary">
              <i className="bi bi-house me-2"></i>
              Go Home
            </Link>
            <Link to="/shops" className="btn btn-outline-primary">
              <i className="bi bi-search me-2"></i>
              Browse Salons
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;