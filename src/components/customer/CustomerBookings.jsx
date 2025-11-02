// components/customer/Bookings.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CustomerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, selectedStatus]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://hair-salon-app-1.onrender.com/booking', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    if (selectedStatus === 'all') {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter(booking => booking.status === selectedStatus));
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://hair-salon-app-1.onrender.com/booking/${bookingId}`, {
        status: 'cancelled'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Refresh bookings
      fetchBookings();
      alert('Booking cancelled successfully');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Please try again.');
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
          <p className="mt-3">Loading your bookings...</p>
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
              <li className="breadcrumb-item active">My Bookings</li>
            </ol>
          </nav>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold">My Bookings</h1>
              <p className="text-muted">Manage your hair salon appointments and payments</p>
            </div>
            <Link to="/shops" className="btn btn-primary">
              <i className="bi bi-plus-circle me-2"></i>
              New Booking
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h6 className="mb-0">Filter by Status:</h6>
                </div>
                <div className="col-md-6">
                  <select
                    className="form-select"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="all">All Bookings</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-body">
              {filteredBookings.length > 0 ? (
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
                      {filteredBookings.map(booking => (
                        <tr key={booking._id}>
                          <td>
                            <div>
                              <strong>{booking.shop?.name}</strong>
                              <br />
                              <small className="text-muted">
                                <i className="bi bi-geo-alt me-1"></i>
                                {booking.shop?.location}
                              </small>
                            </div>
                          </td>
                          <td>
                            <strong>{booking.service?.serviceName}</strong>
                            <br />
                            <small className="text-muted">60 mins</small>
                          </td>
                          <td>
                            <div>
                              {new Date(booking.dateTime).toLocaleDateString()}
                              <br />
                              <small className="text-muted">
                                {new Date(booking.dateTime).toLocaleTimeString()}
                              </small>
                            </div>
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
                                <i className="bi bi-three-dots"></i>
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
                                    <button 
                                      className="dropdown-item text-danger" 
                                      onClick={() => cancelBooking(booking._id)}
                                    >
                                      <i className="bi bi-x-circle me-2"></i>
                                      Cancel Booking
                                    </button>
                                  </li>
                                )}
                                {booking.status === 'completed' && !booking.review && (
                                  <li>
                                    <button className="dropdown-item text-info">
                                      <i className="bi bi-star me-2"></i>
                                      Write Review
                                    </button>
                                  </li>
                                )}
                                <li>
                                  <button className="dropdown-item">
                                    <i className="bi bi-chat me-2"></i>
                                    Contact Salon
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-calendar-x display-1 text-muted"></i>
                  <h4 className="text-muted mt-3">No bookings found</h4>
                  <p className="text-muted">
                    {selectedStatus === 'all' 
                      ? "You haven't made any bookings yet."
                      : `No ${selectedStatus} bookings found.`
                    }
                  </p>
                  <Link to="/shops" className="btn btn-primary">
                    <i className="bi bi-search me-2"></i>
                    Browse Salons
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="row mt-4">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h6 className="card-title">Booking Summary</h6>
              <div className="row text-center">
                <div className="col">
                  <div className="border-end">
                    <h4 className="text-primary">{bookings.length}</h4>
                    <small className="text-muted">Total Bookings</small>
                  </div>
                </div>
                <div className="col">
                  <div className="border-end">
                    <h4 className="text-warning">{bookings.filter(b => b.status === 'pending').length}</h4>
                    <small className="text-muted">Pending</small>
                  </div>
                </div>
                <div className="col">
                  <div className="border-end">
                    <h4 className="text-success">{bookings.filter(b => b.status === 'confirmed').length}</h4>
                    <small className="text-muted">Confirmed</small>
                  </div>
                </div>
                <div className="col">
                  <div className="border-end">
                    <h4 className="text-info">{bookings.filter(b => b.status === 'completed').length}</h4>
                    <small className="text-muted">Completed</small>
                  </div>
                </div>
                <div className="col">
                  <h4 className="text-danger">{bookings.filter(b => b.status === 'cancelled').length}</h4>
                  <small className="text-muted">Cancelled</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerBookings;