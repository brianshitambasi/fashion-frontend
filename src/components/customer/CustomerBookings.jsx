// components/customer/CustomerBookings.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const CustomerBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://hair-salon-app-1.onrender.com/bookings',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMpesaPayment = async (bookingId, amount) => {
    setProcessingPayment(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('https://hair-salon-app-1.onrender.com/payments', {
        booking: bookingId,
        amount: amount,
        method: 'mpesa',
        transactionRef: `MPESA-${Date.now()}`
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('M-Pesa payment initiated! Please check your phone to complete the transaction.');
      fetchBookings(); // Refresh bookings
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'bg-warning', text: 'Pending' },
      confirmed: { class: 'bg-primary', text: 'Confirmed' },
      completed: { class: 'bg-success', text: 'Completed' },
      cancelled: { class: 'bg-danger', text: 'Cancelled' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`badge ${config.class}`}>{config.text}</span>;
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
      <div className="row mb-4">
        <div className="col">
          <h1 className="fw-bold">My Bookings</h1>
          <p className="text-muted">Manage your salon appointments and payments</p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <i className="bi bi-calendar-x display-1 text-muted"></i>
            <h3 className="text-muted mt-3">No Bookings Yet</h3>
            <p className="text-muted">You haven't made any bookings yet.</p>
            <a href="/shops" className="btn btn-primary">
              Browse Salons
            </a>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header bg-white">
                <h5 className="mb-0">Booking History</h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Service</th>
                        <th>Salon</th>
                        <th>Date & Time</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Payment</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(booking => (
                        <tr key={booking._id}>
                          <td>
                            <strong>{booking.service?.serviceName}</strong>
                          </td>
                          <td>
                            <div>
                              <strong>{booking.shop?.name}</strong>
                              <br />
                              <small className="text-muted">{booking.shop?.location}</small>
                            </div>
                          </td>
                          <td>
                            {new Date(booking.dateTime).toLocaleDateString()}
                            <br />
                            <small className="text-muted">
                              {new Date(booking.dateTime).toLocaleTimeString()}
                            </small>
                          </td>
                          <td className="fw-bold text-primary">
                            KSh {booking.service?.price}
                          </td>
                          <td>
                            {getStatusBadge(booking.status)}
                          </td>
                          <td>
                            {booking.payment ? (
                              <span className={`badge ${
                                booking.payment.status === 'success' ? 'bg-success' :
                                booking.payment.status === 'pending' ? 'bg-warning' : 'bg-danger'
                              }`}>
                                {booking.payment.status}
                              </span>
                            ) : (
                              <span className="badge bg-secondary">Not Paid</span>
                            )}
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              {!booking.payment && booking.status !== 'cancelled' && (
                                <button
                                  className="btn btn-sm btn-success"
                                  onClick={() => handleMpesaPayment(booking._id, booking.service.price)}
                                  disabled={processingPayment}
                                >
                                  {processingPayment ? (
                                    <span className="spinner-border spinner-border-sm"></span>
                                  ) : (
                                    <>
                                      <i className="bi bi-phone me-1"></i>
                                      Pay
                                    </>
                                  )}
                                </button>
                              )}
                              {booking.status === 'pending' && (
                                <button className="btn btn-sm btn-outline-danger">
                                  Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerBookings;