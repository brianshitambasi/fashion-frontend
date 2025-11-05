// components/customer/CustomerDashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalSpent: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch bookings
      const bookingsResponse = await axios.get(
        'https://hair-salon-app-1.onrender.com/bookings',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const bookings = bookingsResponse.data;
      const totalBookings = bookings.length;
      const pendingBookings = bookings.filter(b => b.status === 'pending').length;
      const completedBookings = bookings.filter(b => b.status === 'completed').length;
      const totalSpent = bookings
        .filter(b => b.status === 'completed' && b.service)
        .reduce((sum, booking) => sum + (booking.service.price || 0), 0);

      setStats({
        totalBookings,
        pendingBookings,
        completedBookings,
        totalSpent
      });

      setRecentBookings(bookings.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <h1 className="fw-bold">Customer Dashboard</h1>
          <p className="text-muted">Welcome back, {user?.name}! Manage your salon bookings and services.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="fw-bold">{stats.totalBookings}</h4>
                  <p className="mb-0">Total Bookings</p>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-calendar-check display-6"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="fw-bold">{stats.pendingBookings}</h4>
                  <p className="mb-0">Pending</p>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-clock display-6"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="fw-bold">{stats.completedBookings}</h4>
                  <p className="mb-0">Completed</p>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-check-circle display-6"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="fw-bold">KSh {stats.totalSpent}</h4>
                  <p className="mb-0">Total Spent</p>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-wallet display-6"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-light">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <Link to="/shops" className="btn btn-outline-primary w-100 h-100 py-3">
                    <i className="bi bi-shop display-6 d-block mb-2"></i>
                    Browse Salons
                  </Link>
                </div>
                <div className="col-md-4">
                  <Link to="/customer/bookings" className="btn btn-outline-success w-100 h-100 py-3">
                    <i className="bi bi-calendar-check display-6 d-block mb-2"></i>
                    My Bookings
                  </Link>
                </div>
                <div className="col-md-4">
                  <Link to="/customer/cart" className="btn btn-outline-warning w-100 h-100 py-3">
                    <i className="bi bi-cart display-6 d-block mb-2"></i>
                    My Cart
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Bookings</h5>
              <Link to="/customer/bookings" className="btn btn-sm btn-primary">
                View All
              </Link>
            </div>
            <div className="card-body">
              {recentBookings.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-calendar-x display-1 text-muted"></i>
                  <p className="text-muted mt-3">No bookings yet</p>
                  <Link to="/shops" className="btn btn-primary">
                    Book Your First Service
                  </Link>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {recentBookings.map(booking => (
                    <div key={booking._id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">{booking.service?.serviceName}</h6>
                          <p className="mb-1 text-muted small">
                            <i className="bi bi-shop me-1"></i>
                            {booking.shop?.name}
                          </p>
                          <small className="text-muted">
                            {new Date(booking.dateTime).toLocaleDateString()} • 
                            <span className={`badge ms-2 ${
                              booking.status === 'completed' ? 'bg-success' :
                              booking.status === 'confirmed' ? 'bg-primary' :
                              booking.status === 'pending' ? 'bg-warning' : 'bg-danger'
                            }`}>
                              {booking.status}
                            </span>
                          </small>
                        </div>
                        <div className="text-end">
                          <strong>KSh {booking.service?.price}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header bg-light">
              <h5 className="mb-0">Tips & Support</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <h6><i className="bi bi-lightbulb text-warning me-2"></i>Quick Tips</h6>
                <ul className="small text-muted">
                  <li>Browse salons by location and services</li>
                  <li>Add multiple services to cart</li>
                  <li>Pay securely with M-Pesa</li>
                  <li>Rate your experience after service</li>
                </ul>
              </div>
              <div>
                <h6><i className="bi bi-headset text-primary me-2"></i>Need Help?</h6>
                <p className="small text-muted mb-2">Contact our support team for assistance</p>
                <Link to="/contact" className="btn btn-sm btn-outline-primary">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;