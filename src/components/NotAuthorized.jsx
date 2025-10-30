
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotAuthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light px-3">
      <div className="text-center p-5 bg-white shadow-sm rounded-4 border mx-auto" style={{ maxWidth: '500px' }}>
       
        {/* Warning Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="mx-auto text-danger"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>

        {/* Title & Message */}
        <h1 className="mt-4 fs-4 fw-bold text-dark">Access Denied</h1>
        <p className="mt-2 text-muted">
          You don't have permission to view this page. Please contact your administrator or go back.
        </p>

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="btn btn-primary mt-4 px-4 py-2 rounded-pill fw-medium"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotAuthorized;
