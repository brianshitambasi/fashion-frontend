// components/auth/Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    role: 'customer'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Email is invalid');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (!formData.address.trim()) {
      setError('Address is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('https://hair-salon-app-1.onrender.com/user/register', formData);
      
      setSuccess('✅ Registration successful! Redirecting to login...');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error);
      setError(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg border-0">
            {/* Header Section */}
            <div className="card-header bg-primary text-white text-center py-4">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <i className="bi bi-scissors display-6 me-3"></i>
                <div>
                  <h2 className="fw-bold mb-0">Looks Nairobi</h2>
                  <p className="mb-0 opacity-75">Create Your Account</p>
                </div>
              </div>
            </div>

            <div className="card-body p-4 p-md-5">
              {/* Success Message */}
              {success && (
                <div className="alert alert-success d-flex align-items-center" role="alert">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  <div>{success}</div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <div>{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Personal Information */}
                  <div className="col-12">
                    <h5 className="text-primary mb-3">
                      <i className="bi bi-person-badge me-2"></i>
                      Personal Information
                    </h5>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="name" className="form-label">
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-person"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="phone" className="form-label">
                      Phone Number <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-phone"></i>
                      </span>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g., +254712345678"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12 mb-3">
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

                  <div className="col-12 mb-3">
                    <label htmlFor="address" className="form-label">
                      Address <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-geo-alt"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter your address"
                        required
                      />
                    </div>
                  </div>

                  {/* Account Type & Password */}
                  <div className="col-12 mt-4">
                    <h5 className="text-primary mb-3">
                      <i className="bi bi-shield-lock me-2"></i>
                      Account Settings
                    </h5>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="role" className="form-label">
                      Account Type <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-person-rolodex"></i>
                      </span>
                      <select
                        className="form-select"
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                      >
                        <option value="customer">👤 Customer</option>
                        <option value="shopowner">🏪 Shop Owner</option>
                      </select>
                    </div>
                    <div className="form-text">
                      {formData.role === 'customer' 
                        ? 'Book appointments at hair salons'
                        : 'List your salon and manage bookings'
                      }
                    </div>
                  </div>

                  <div className="col-md-6 mb-4">
                    <label htmlFor="password" className="form-label">
                      Password <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-key"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        required
                        minLength="6"
                      />
                    </div>
                    <div className="form-text">
                      Must be at least 6 characters long
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="mb-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="terms"
                      required
                    />
                    <label className="form-check-label small" htmlFor="terms">
                      I agree to the{' '}
                      <a href="#" className="text-decoration-none">Terms of Service</a> and{' '}
                      <a href="#" className="text-decoration-none">Privacy Policy</a>
                    </label>
                  </div>
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
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-plus me-2"></i>
                        Create Account
                      </>
                    )}
                  </button>
                </div>

                {/* Divider */}
                <div className="text-center mb-4">
                  <div className="d-flex align-items-center">
                    <hr className="flex-grow-1" />
                    <span className="mx-3 text-muted">or</span>
                    <hr className="flex-grow-1" />
                  </div>
                </div>

                {/* Login Link */}
                <div className="text-center">
                  <p className="mb-0">
                    Already have an account?{' '}
                    <Link to="/login" className="text-decoration-none fw-semibold">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Additional Info Cards */}
          <div className="row mt-4">
            <div className="col-md-6">
              <div className="card border-0 bg-light">
                <div className="card-body text-center">
                  <i className="bi bi-shop display-6 text-primary mb-3"></i>
                  <h6>For Shop Owners</h6>
                  <p className="small text-muted mb-0">
                    List your salon, manage bookings, and grow your business
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card border-0 bg-light">
                <div className="card-body text-center">
                  <i className="bi bi-scissors display-6 text-success mb-3"></i>
                  <h6>For Customers</h6>
                  <p className="small text-muted mb-0">
                    Book appointments, discover styles, and find the best salons
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;