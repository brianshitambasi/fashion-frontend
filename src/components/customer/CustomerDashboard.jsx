// components/customer/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const CustomerDashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    cartItems: 0,
    totalSpent: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [bookingsRes, cartRes, paymentsRes] = await Promise.all([
        axios.get('https://hair-salon-app-1.onrender.com/booking', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('https://hair-salon-app-1.onrender.com/cart', {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ data: { items: [] } })),
        axios.get('https://hair-salon-app-1.onrender.com/payment', {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ data: [] }))
      ]);

      const bookings = bookingsRes.data;
      const cart = cartRes.data;
      const payments = paymentsRes.data;

      // Calculate total spent from successful payments
      const totalSpent = payments
        .filter(p => p.status === 'success')
        .reduce((sum, payment) => sum + (payment.amount || 0), 0);

      setStats({
        totalBookings: bookings.length,
        pendingBookings: bookings.filter(b => b.status === 'pending').length,
        confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
        completedBookings: bookings.filter(b => b.status === 'completed').length,
        cartItems: cart.items?.length || 0,
        totalSpent
      });

      setRecentBookings(bookings.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'bg-warning text-dark', label: 'Pending' },
      confirmed: { class: 'bg-success', label: 'Confirmed' },
      completed: { class: 'bg-info', label: 'Completed' },
      cancelled: { class: 'bg-danger', label: 'Cancelled' }
    };
    
    const config = statusConfig[status] || { class: 'bg-secondary', label: status };
    return <span className={`badge ${config.class}`}>{config.label}</span>;
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Welcome Section */}
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold">Welcome back, {user?.name}! 👋</h1>
              <p className="text-muted">Here's your booking overview and quick actions</p>
            </div>
            <div className="text-end">
              <p className="text-muted mb-1">Member since</p>
              <p className="fw-bold mb-0">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        <div className="col-xl-2 col-md-4">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="fw-bold">{stats.totalBookings}</h4>
                  <p className="mb-0">Total Bookings</p>
                </div>
                <div className="fs-1">
                  <i className="bi bi-calendar-check"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-2 col-md-4">
          <div className="card bg-warning text-dark">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="fw-bold">{stats.pendingBookings}</h4>
                  <p className="mb-0">Pending</p>
                </div>
                <div className="fs-1">
                  <i className="bi bi-clock"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-2 col-md-4">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="fw-bold">{stats.confirmedBookings}</h4>
                  <p className="mb-0">Confirmed</p>
                </div>
                <div className="fs-1">
                  <i className="bi bi-check-circle"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-2 col-md-4">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="fw-bold">{stats.completedBookings}</h4>
                  <p className="mb-0">Completed</p>
                </div>
                <div className="fs-1">
                  <i className="bi bi-star"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-2 col-md-4">
          <div className="card bg-dark text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="fw-bold">KSh {stats.totalSpent.toLocaleString()}</h4>
                  <p className="mb-0">Total Spent</p>
                </div>
                <div className="fs-1">
                  <i className="bi bi-currency-exchange"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-2 col-md-4">
          <div className="card bg-secondary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="fw-bold">{stats.cartItems}</h4>
                  <p className="mb-0">Cart Items</p>
                </div>
                <div className="fs-1">
                  <i className="bi bi-cart"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mb-5">
        <div className="col">
          <div className="card">
            <div className="card-header bg-white">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-sm-6 col-md-4 col-lg-2">
                  <Link to="/shops" className="card card-hover text-decoration-none">
                    <div className="card-body text-center p-3">
                      <i className="bi bi-search display-6 text-primary mb-2"></i>
                      <h6>Find Salons</h6>
                      <small className="text-muted">Browse top salons</small>
                    </div>
                  </Link>
                </div>
                <div className="col-sm-6 col-md-4 col-lg-2">
                  <Link to="/customer/bookings" className="card card-hover text-decoration-none">
                    <div className="card-body text-center p-3">
                      <i className="bi bi-calendar-check display-6 text-primary mb-2"></i>
                      <h6>My Bookings</h6>
                      <small className="text-muted">{stats.totalBookings} bookings</small>
                    </div>
                  </Link>
                </div>
                <div className="col-sm-6 col-md-4 col-lg-2">
                  <Link to="/customer/cart" className="card card-hover text-decoration-none">
                    <div className="card-body text-center p-3">
                      <i className="bi bi-cart display-6 text-primary mb-2"></i>
                      <h6>Shopping Cart</h6>
                      <small className="text-muted">{stats.cartItems} items</small>
                    </div>
                  </Link>
                </div>
                <div className="col-sm-6 col-md-4 col-lg-2">
                  <Link to="/hairstyles" className="card card-hover text-decoration-none">
                    <div className="card-body text-center p-3">
                      <i className="bi bi-scissors display-6 text-primary mb-2"></i>
                      <h6>Browse Styles</h6>
                      <small className="text-muted">Get inspiration</small>
                    </div>
                  </Link>
                </div>
                <div className="col-sm-6 col-md-4 col-lg-2">
                  <Link to="/customer/profile" className="card card-hover text-decoration-none">
                    <div className="card-body text-center p-3">
                      <i className="bi bi-person display-6 text-primary mb-2"></i>
                      <h6>My Profile</h6>
                      <small className="text-muted">Update details</small>
                    </div>
                  </Link>
                </div>
                <div className="col-sm-6 col-md-4 col-lg-2">
                  <Link to="/customer/payments" className="card card-hover text-decoration-none">
                    <div className="card-body text-center p-3">
                      <i className="bi bi-credit-card display-6 text-primary mb-2"></i>
                      <h6>Payments</h6>
                      <small className="text-muted">View history</small>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Bookings</h5>
              <Link to="/customer/bookings" className="btn btn-sm btn-outline-primary">
                View All Bookings
              </Link>
            </div>
            <div className="card-body">
              {recentBookings.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Salon</th>
                        <th>Service</th>
                        <th>Date & Time</th>
                        <th>Status</th>
                        <th>Amount</th>
                        <th>Payment</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map(booking => (
                        <tr key={booking._id}>
                          <td>
                            <div>
                              <strong>{booking.shop?.name}</strong>
                              <br />
                              <small className="text-muted">{booking.shop?.location}</small>
                            </div>
                          </td>
                          <td>
                            <strong>{booking.service?.serviceName}</strong>
                            <br />
                            <small className="text-muted">60 mins</small>
                          </td>
                          <td>
                            {new Date(booking.dateTime).toLocaleDateString()}
                            <br />
                            <small className="text-muted">
                              {new Date(booking.dateTime).toLocaleTimeString()}
                            </small>
                          </td>
                          <td>
                            {getStatusBadge(booking.status)}
                          </td>
                          <td className="fw-bold text-primary">
                            KSh {booking.service?.price}
                          </td>
                          <td>
                            {booking.payment ? (
                              <span className="badge bg-success">Paid</span>
                            ) : (
                              <span className="badge bg-warning text-dark">Pending</span>
                            )}
                          </td>
                          <td>
                            <div className="dropdown">
                              <button 
                                className="btn btn-sm btn-outline-secondary dropdown-toggle" 
                                type="button" 
                                data-bs-toggle="dropdown"
                              >
                                Actions
                              </button>
                              <ul className="dropdown-menu">
                                <li>
                                  <button className="dropdown-item">
                                    <i className="bi bi-eye me-2"></i>
                                    View Details
                                  </button>
                                </li>
                                {!booking.payment && booking.status === 'pending' && (
                                  <li>
                                    <Link 
                                      to={`/customer/payment/${booking._id}`}
                                      className="dropdown-item text-success"
                                    >
                                      <i className="bi bi-credit-card me-2"></i>
                                      Make Payment
                                    </Link>
                                  </li>
                                )}
                                {booking.status === 'pending' && (
                                  <li>
                                    <button className="dropdown-item text-danger">
                                      <i className="bi bi-x-circle me-2"></i>
                                      Cancel Booking
                                    </button>
                                  </li>
                                )}
                                {booking.status === 'completed' && (
                                  <li>
                                    <button className="dropdown-item text-info">
                                      <i className="bi bi-star me-2"></i>
                                      Write Review
                                    </button>
                                  </li>
                                )}
                              </ul>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="bi bi-calendar-x display-1 text-muted"></i>
                  <h5 className="text-muted mt-3">No bookings yet</h5>
                  <p className="text-muted">Start by exploring our salons and book your first appointment!</p>
                  <Link to="/shops" className="btn btn-primary">
                    <i className="bi bi-search me-2"></i>
                    Explore Salons
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      {recentBookings.filter(b => ['pending', 'confirmed'].includes(b.status)).length > 0 && (
        <div className="row mt-4">
          <div className="col-12">
            <div className="card border-warning">
              <div className="card-header bg-warning text-dark">
                <h5 className="mb-0">
                  <i className="bi bi-clock me-2"></i>
                  Upcoming Appointments
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  {recentBookings
                    .filter(b => ['pending', 'confirmed'].includes(b.status))
                    .slice(0, 3)
                    .map(booking => (
                      <div key={booking._id} className="col-md-4">
                        <div className="card border-warning">
                          <div className="card-body">
                            <h6 className="card-title">{booking.shop?.name}</h6>
                            <p className="card-text mb-1">
                              <strong>{booking.service?.serviceName}</strong>
                            </p>
                            <p className="card-text text-muted small mb-1">
                              {new Date(booking.dateTime).toLocaleDateString()} at {' '}
                              {new Date(booking.dateTime).toLocaleTimeString()}
                            </p>
                            <div className="d-flex justify-content-between align-items-center">
                              {getStatusBadge(booking.status)}
                              {!booking.payment && (
                                <Link 
                                  to={`/customer/payment/${booking._id}`}
                                  className="btn btn-sm btn-success"
                                >
                                  Pay Now
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;