// components/customer/Profile.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const CustomerProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const { user, updateUser } = useAuth();

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
      setLoading(false);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      // In a real app, you'd have an endpoint to update user profile
      // const response = await axios.put('/api/user/profile', profile, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });

      // For now, update locally
      updateUser({ ...user, ...profile });
      setMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/customer/dashboard" className="text-decoration-none">Dashboard</Link></li>
              <li className="breadcrumb-item active">My Profile</li>
            </ol>
          </nav>
          <h1 className="fw-bold">My Profile</h1>
          <p className="text-muted">Manage your personal information and preferences</p>
        </div>
      </div>

      <div className="row">
        {/* Profile Form */}
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-person me-2"></i>
                Personal Information
              </h5>
            </div>
            <div className="card-body">
              {message && (
                <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'}`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={profile.email}
                      onChange={handleInputChange}
                      required
                      disabled
                    />
                    <div className="form-text">Email cannot be changed</div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="phone" className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={profile.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="address" className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      id="address"
                      name="address"
                      value={profile.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-3 mt-4">
                  <Link to="/customer/dashboard" className="btn btn-outline-secondary">
                    Cancel
                  </Link>
                  <button type="submit" className="btn btn-primary" disabled={updating}>
                    {updating ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Updating...
                      </>
                    ) : (
                      'Update Profile'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <i className="bi bi-info-circle me-2"></i>
                Account Information
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <strong>Member Since:</strong>
                <p className="mb-0">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div className="mb-3">
                <strong>Account Type:</strong>
                <p className="mb-0">
                  <span className="badge bg-primary">Customer</span>
                </p>
              </div>
              <div className="mb-3">
                <strong>Account Status:</strong>
                <p className="mb-0">
                  <span className="badge bg-success">Active</span>
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card mt-4">
            <div className="card-header bg-light">
              <h6 className="mb-0">Quick Actions</h6>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <Link to="/customer/bookings" className="btn btn-outline-primary btn-sm">
                  <i className="bi bi-calendar-check me-2"></i>
                  My Bookings
                </Link>
                <Link to="/customer/payments" className="btn btn-outline-success btn-sm">
                  <i className="bi bi-credit-card me-2"></i>
                  Payment History
                </Link>
                <button className="btn btn-outline-warning btn-sm">
                  <i className="bi bi-shield-lock me-2"></i>
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;