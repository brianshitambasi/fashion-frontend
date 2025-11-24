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
        'https://hair-salon-app-1.onrender.com/booking',
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
      <div className="container-fluid py-4 bg-light min-vh-100">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
          <div className="text-center">
            <div className="spinner-border text-pink" style={{width: '3rem', height: '3rem'}} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading your beauty dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      {/* Welcome Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm bg-gradient-beauty text-white overflow-hidden">
            <div className="card-body p-4 p-md-5">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h1 className="h2 fw-bold mb-2">
                    <i className="bi bi-flower1 me-3"></i>
                    Welcome to Your Beauty Space, {user?.name}!
                  </h1>
                  <p className="mb-0 opacity-75 fs-5">
                    Discover, book, and manage your salon experiences with ease
                  </p>
                </div>
                <div className="col-md-4 text-md-end">
                  <div className="bg-white bg-opacity-20 rounded-pill px-4 py-2 d-inline-block">
                    <small className="fw-semibold">
                      <i className="bi bi-gem me-2"></i>
                      Premium Beauty Member
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - Beauty Themed */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100 beauty-card-primary">
            <div className="card-body p-4">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h3 className="fw-bold text-white mb-1">{stats.totalBookings}</h3>
                  <p className="text-white-50 mb-0">Total Appointments</p>
                </div>
                <div className="flex-shrink-0">
                  <div className="bg-white bg-opacity-20 rounded-circle p-3">
                    <i className="bi bi-calendar2-heart fs-2 text-white"></i>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <small className="text-white-75">
                  <i className="bi bi-arrow-up-short me-1"></i>
                  Your beauty journey
                </small>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100 beauty-card-warning">
            <div className="card-body p-4">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h3 className="fw-bold text-white mb-1">{stats.pendingBookings}</h3>
                  <p className="text-white-50 mb-0">Upcoming</p>
                </div>
                <div className="flex-shrink-0">
                  <div className="bg-white bg-opacity-20 rounded-circle p-3">
                    <i className="bi bi-clock-history fs-2 text-white"></i>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <small className="text-white-75">
                  <i className="bi bi-hourglass-split me-1"></i>
                  Awaiting your glam
                </small>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100 beauty-card-success">
            <div className="card-body p-4">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h3 className="fw-bold text-white mb-1">{stats.completedBookings}</h3>
                  <p className="text-white-50 mb-0">Completed</p>
                </div>
                <div className="flex-shrink-0">
                  <div className="bg-white bg-opacity-20 rounded-circle p-3">
                    <i className="bi bi-stars fs-2 text-white"></i>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <small className="text-white-75">
                  <i className="bi bi-check-circle me-1"></i>
                  Successful transformations
                </small>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100 beauty-card-info">
            <div className="card-body p-4">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h3 className="fw-bold text-white mb-1">KSh {stats.totalSpent.toLocaleString()}</h3>
                  <p className="text-white-50 mb-0">Total Invested</p>
                </div>
                <div className="flex-shrink-0">
                  <div className="bg-white bg-opacity-20 rounded-circle p-3">
                    <i className="bi bi-gem fs-2 text-white"></i>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <small className="text-white-75">
                  <i className="bi bi-currency-exchange me-1"></i>
                  In your beauty
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 py-3">
              <h3 className="h5 fw-bold text-dark mb-0">
                <i className="bi bi-lightning-charge-fill me-2 text-warning"></i>
                Quick Beauty Actions
              </h3>
            </div>
            <div className="card-body p-4">
              <div className="row g-4">
                <div className="col-lg-3 col-md-6">
                  <Link to="/shops" className="card action-card border-0 text-decoration-none h-100 hover-lift">
                    <div className="card-body text-center p-4">
                      <div className="icon-wrapper bg-primary bg-opacity-10 rounded-circle p-3 mb-3 mx-auto">
                        <i className="bi bi-shop fs-2 text-primary"></i>
                      </div>
                      <h5 className="fw-bold text-dark mb-2">Explore Salons</h5>
                      <p className="text-muted small mb-0">
                        Discover top beauty salons near you
                      </p>
                    </div>
                  </Link>
                </div>
                
                <div className="col-lg-3 col-md-6">
                  <Link to="/customer/bookings" className="card action-card border-0 text-decoration-none h-100 hover-lift">
                    <div className="card-body text-center p-4">
                      <div className="icon-wrapper bg-success bg-opacity-10 rounded-circle p-3 mb-3 mx-auto">
                        <i className="bi bi-calendar2-check fs-2 text-success"></i>
                      </div>
                      <h5 className="fw-bold text-dark mb-2">My Appointments</h5>
                      <p className="text-muted small mb-0">
                        Manage your upcoming bookings
                      </p>
                    </div>
                  </Link>
                </div>
                
                <div className="col-lg-3 col-md-6">
                  <Link to="/customer/cart" className="card action-card border-0 text-decoration-none h-100 hover-lift">
                    <div className="card-body text-center p-4">
                      <div className="icon-wrapper bg-warning bg-opacity-10 rounded-circle p-3 mb-3 mx-auto">
                        <i className="bi bi-bag-heart fs-2 text-warning"></i>
                      </div>
                      <h5 className="fw-bold text-dark mb-2">Beauty Cart</h5>
                      <p className="text-muted small mb-0">
                        Your selected services
                      </p>
                    </div>
                  </Link>
                </div>
                
                <div className="col-lg-3 col-md-6">
                  <Link to="/customer/favorites" className="card action-card border-0 text-decoration-none h-100 hover-lift">
                    <div className="card-body text-center p-4">
                      <div className="icon-wrapper bg-pink bg-opacity-10 rounded-circle p-3 mb-3 mx-auto">
                        <i className="bi bi-heart fs-2 text-pink"></i>
                      </div>
                      <h5 className="fw-bold text-dark mb-2">Favorites</h5>
                      <p className="text-muted small mb-0">
                        Your preferred salons & services
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Recent Bookings */}
        <div className="col-lg-8 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
              <h3 className="h5 fw-bold text-dark mb-0">
                <i className="bi bi-clock-history me-2 text-primary"></i>
                Recent Beauty Appointments
              </h3>
              <Link to="/customer/bookings" className="btn btn-primary btn-sm">
                View All <i className="bi bi-arrow-right ms-1"></i>
              </Link>
            </div>
            <div className="card-body p-0">
              {recentBookings.length === 0 ? (
                <div className="text-center py-5">
                  <div className="mb-4">
                    <i className="bi bi-calendar2-x display-1 text-muted"></i>
                  </div>
                  <h5 className="text-muted mb-3">No Appointments Yet</h5>
                  <p className="text-muted mb-4">Start your beauty journey by booking your first service</p>
                  <Link to="/shops" className="btn btn-primary">
                    <i className="bi bi-scissors me-2"></i>
                    Book Your First Service
                  </Link>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {recentBookings.map(booking => (
                    <div key={booking._id} className="list-group-item border-0 py-3">
                      <div className="row align-items-center">
                        <div className="col-md-6 mb-2 mb-md-0">
                          <div className="d-flex align-items-center">
                            <div className={`status-indicator me-3 ${
                              booking.status === 'completed' ? 'bg-success' :
                              booking.status === 'confirmed' ? 'bg-primary' :
                              booking.status === 'pending' ? 'bg-warning' : 'bg-danger'
                            }`}></div>
                            <div>
                              <h6 className="fw-bold text-dark mb-1">
                                {booking.service?.serviceName || 'Beauty Service'}
                              </h6>
                              <p className="text-muted small mb-0">
                                <i className="bi bi-shop me-1"></i>
                                {booking.shop?.name || 'Salon'}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3 mb-2 mb-md-0">
                          <small className="text-muted">
                            <i className="bi bi-calendar3 me-1"></i>
                            {new Date(booking.dateTime).toLocaleDateString()}
                          </small>
                          <br />
                          <small className="text-muted">
                            <i className="bi bi-clock me-1"></i>
                            {new Date(booking.dateTime).toLocaleTimeString()}
                          </small>
                        </div>
                        <div className="col-md-3 text-md-end">
                          <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-md-end gap-2">
                            <span className={`badge ${
                              booking.status === 'completed' ? 'bg-success' :
                              booking.status === 'confirmed' ? 'bg-primary' :
                              booking.status === 'pending' ? 'bg-warning' : 'bg-danger'
                            }`}>
                              {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                            </span>
                            <strong className="text-dark">KSh {booking.service?.price || '0'}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Beauty Tips & Support */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3">
              <h3 className="h5 fw-bold text-dark mb-0">
                <i className="bi bi-sparkles me-2 text-warning"></i>
                Beauty Guide & Support
              </h3>
            </div>
            <div className="card-body">
              {/* Quick Tips */}
              <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-warning bg-opacity-10 rounded-circle p-2 me-3">
                    <i className="bi bi-lightbulb text-warning"></i>
                  </div>
                  <h6 className="fw-bold text-dark mb-0">Beauty Pro Tips</h6>
                </div>
                <ul className="list-unstyled small text-muted">
                  <li className="mb-2 d-flex align-items-start">
                    <i className="bi bi-check-circle text-success me-2 mt-1"></i>
                    Book in advance for premium time slots
                  </li>
                  <li className="mb-2 d-flex align-items-start">
                    <i className="bi bi-check-circle text-success me-2 mt-1"></i>
                    Combine services for better deals
                  </li>
                  <li className="mb-2 d-flex align-items-start">
                    <i className="bi bi-check-circle text-success me-2 mt-1"></i>
                    Read reviews before choosing a stylist
                  </li>
                  <li className="d-flex align-items-start">
                    <i className="bi bi-check-circle text-success me-2 mt-1"></i>
                    Arrive 10 minutes early for consultation
                  </li>
                </ul>
              </div>

              {/* Support Section */}
              <div className="border-top pt-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                    <i className="bi bi-headset text-primary"></i>
                  </div>
                  <h6 className="fw-bold text-dark mb-0">Need Assistance?</h6>
                </div>
                <p className="small text-muted mb-3">
                  Our beauty concierge team is here to help you with any questions about services, bookings, or recommendations.
                </p>
                <div className="d-grid gap-2">
                  <Link to="/contact" className="btn btn-outline-primary btn-sm">
                    <i className="bi bi-chat-dots me-2"></i>
                    Chat with Support
                  </Link>
                  <Link to="/help" className="btn btn-outline-secondary btn-sm">
                    <i className="bi bi-question-circle me-2"></i>
                    Help Center
                  </Link>
                </div>
              </div>

              {/* Special Offers */}
              <div className="border-top pt-4 mt-4">
                <div className="d-flex align-items-center mb-2">
                  <div className="bg-pink bg-opacity-10 rounded-circle p-2 me-3">
                    <i className="bi bi-gift text-pink"></i>
                  </div>
                  <h6 className="fw-bold text-dark mb-0">Special Offers</h6>
                </div>
                <div className="alert alert-pink alert-dismissible fade show mb-0" role="alert">
                  <small>
                    <strong>✨ New Customer Bonus!</strong> Get 15% off your first booking with code: BEAUTY15
                  </small>
                  <button type="button" className="btn-close btn-close-sm" data-bs-dismiss="alert"></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bootstrap Icons */}
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" 
        rel="stylesheet" 
      />

      {/* Custom Beauty Styles */}
      <style jsx>{`
        .bg-gradient-beauty {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .beauty-card-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .beauty-card-warning {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        .beauty-card-success {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
        .beauty-card-info {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }
        .text-pink {
          color: #e83e8c !important;
        }
        .bg-pink {
          background-color: #e83e8c !important;
        }
        .alert-pink {
          background-color: #fce4ec;
          border-color: #f8bbd9;
          color: #880e4f;
        }
        .action-card {
          transition: all 0.3s ease;
          border: 1px solid #e9ecef !important;
        }
        .action-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
        .hover-lift:hover {
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }
        .icon-wrapper {
          transition: all 0.3s ease;
          width: 60px;
          height: 60px;
        }
        .action-card:hover .icon-wrapper {
          transform: scale(1.1);
        }
        .status-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          display: inline-block;
        }
        .spinner-border.text-pink {
          color: #e83e8c !important;
        }
        .min-vh-100 {
          min-height: 100vh;
        }
      `}</style>
    </div>
  );
};

export default CustomerDashboard;