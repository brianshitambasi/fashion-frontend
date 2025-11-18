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

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await axios.post(
        'https://hair-salon-app-1.onrender.com/user/login',
        formData
      );

      if (response.data.token && response.data.user) {
        login(response.data.user, response.data.token);

        // Redirect based on role
        const userRole = response.data.user.role;
        let redirectPath = '/';
        if (userRole === 'customer') redirectPath = '/customer/dashboard';
       else if (userRole === 'shopowner') redirectPath = '/shopowner/dashboard';
        else if (userRole === 'admin') redirectPath = '/admin/dashboard';

        navigate(redirectPath, { replace: true });
      } else {
        setError('Invalid response from server');
      }

    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message ||
        'Login failed. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg border-0">
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
                    <span className="input-group-text"><i className="bi bi-envelope"></i></span>
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
                    <span className="input-group-text"><i className="bi bi-key"></i></span>
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

                <div className="d-grid mb-4">
                  <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
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
        </div>
      </div>
    </div>
  );
};

export default Login;
