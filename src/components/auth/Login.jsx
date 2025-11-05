// components/auth/Login.js
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Email is invalid');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
// In Login.js, change the axios call to:
const response = await axios.post('https://hair-salon-app-1.onrender.com/user/login', formData);      
      if (response.data.token && response.data.user) {
        // Store token and user data
        login(response.data.user, response.data.token);
        
        // Show success message
        setError(''); // Clear any previous errors
        
        // Redirect based on user role
        const userRole = response.data.user.role;
        
        // Determine redirect path
        let redirectPath = from;
        if (from === '/') {
          switch (userRole) {
            case 'customer':
              redirectPath = '/customer/dashboard';
              break;
            case 'shopowner':
              redirectPath = '/shopowner/dashboard';
              break;
            case 'admin':
              redirectPath = '/admin/dashboard';
              break;
            default:
              redirectPath = '/';
          }
        }

        // Navigate to the determined path
        navigate(redirectPath, { replace: true });
        
      } else {
        setError('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(
        error.response?.data?.message || 
        'Login failed. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    const demoCredentials = {
      customer: { email: 'customer@demo.com', password: 'demo123' },
      shopowner: { email: 'shopowner@demo.com', password: 'demo123' },
      admin: { email: 'admin@demo.com', password: 'demo123' }
    };

    setFormData(demoCredentials[role]);
    setError(`Demo ${role} credentials filled. Click "Sign In" to continue.`);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg border-0">
            {/* Header Section */}
            <div className="card-header bg-primary text-white text-center py-4">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <i className="bi bi-scissors display-6 me-3"></i>
                <div>
                  <h2 className="fw-bold mb-0">Looks Nairobi</h2>
                  <p className="mb-0 opacity-75">Welcome Back</p>
                </div>
              </div>
            </div>

            <div className="card-body p-4 p-md-5">
              {/* Error Message */}
              {error && (
                <div className={`alert ${error.includes('Demo') ? 'alert-info' : 'alert-danger'} d-flex align-items-center`} role="alert">
                  <i className={`bi ${error.includes('Demo') ? 'bi-info-circle' : 'bi-exclamation-triangle'}-fill me-2`}></i>
                  <div>{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="form-label">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    Password <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-key"></i>
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="rememberMe"
                    />
                    <label className="form-check-label small" htmlFor="rememberMe">
                      Remember me
                    </label>
                  </div>
                  <a href="#" className="text-decoration-none small">
                    Forgot password?
                  </a>
                </div>

                {/* Submit Button */}
                <div className="d-grid mb-4">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Signing In...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Sign In
                      </>
                    )}
                  </button>
                </div>

                {/* Demo Accounts
                <div className="mb-4">
                  <div className="text-center mb-3">
                    <small className="text-muted">Quick Demo Access</small>
                  </div>
                  <div className="d-grid gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleDemoLogin('customer')}
                    >
                      <i className="bi bi-person me-2"></i>
                      Demo Customer
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-success btn-sm"
                      onClick={() => handleDemoLogin('shopowner')}
                    >
                      <i className="bi bi-shop me-2"></i>
                      Demo Shop Owner
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDemoLogin('admin')}
                    >
                      <i className="bi bi-shield-check me-2"></i>
                      Demo Admin
                    </button>
                  </div>
                </div> */}

                {/* Divider */}
                <div className="text-center mb-4">
                  <div className="d-flex align-items-center">
                    <hr className="flex-grow-1" />
                    <span className="mx-3 text-muted">or</span>
                    <hr className="flex-grow-1" />
                  </div>
                </div>

                {/* Register Link */}
                <div className="text-center">
                  <p className="mb-2">Don't have an account?</p>
                  <Link to="/register" className="btn btn-outline-primary">
                    <i className="bi bi-person-plus me-2"></i>
                    Create New Account
                  </Link>
                </div>
              </form>
            </div>
          </div>

          {/* Features Card */}
          <div className="card mt-4 border-0 bg-light">
            <div className="card-body">
              <h6 className="card-title text-center mb-3">Why Join Looks Nairobi?</h6>
              <div className="row text-center">
                <div className="col-4">
                  <i className="bi bi-search text-primary d-block mb-2"></i>
                  <small className="text-muted">Find Salons</small>
                </div>
                <div className="col-4">
                  <i className="bi bi-calendar-check text-success d-block mb-2"></i>
                  <small className="text-muted">Easy Booking</small>
                </div>
                <div className="col-4">
                  <i className="bi bi-star text-warning d-block mb-2"></i>
                  <small className="text-muted">Rate & Review</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;