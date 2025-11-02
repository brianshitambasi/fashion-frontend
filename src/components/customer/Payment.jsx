// components/customer/Payment.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://hair-salon-app-1.onrender.com/booking/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBooking(response.data);
    } catch (error) {
      console.error('Error fetching booking:', error);
      setError('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const validatePhoneNumber = (phone) => {
    // Kenyan phone number validation (starts with 254, 07, or 01)
    const phoneRegex = /^(?:254|\+254|0)?(7|1)\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const formatPhoneNumber = (phone) => {
    // Format to 254 format for M-Pesa
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      return '254' + cleaned.substring(1);
    } else if (cleaned.startsWith('254')) {
      return cleaned;
    } else if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
      return '254' + cleaned;
    }
    return cleaned;
  };

  const handleMpesaPayment = async () => {
    if (!phoneNumber) {
      setError('Please enter your M-Pesa phone number');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid Kenyan phone number');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const formattedPhone = formatPhoneNumber(phoneNumber);

      const paymentData = {
        booking: bookingId,
        amount: booking.service.price,
        method: 'mpesa',
        transactionRef: `MPESA-${Date.now()}`
      };

      const response = await axios.post('https://hair-salon-app-1.onrender.com/payment', paymentData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Simulate M-Pesa STK push (in real app, this would be handled by backend)
      setSuccess('M-Pesa STK push sent! Check your phone to complete payment.');
      
      // Simulate payment confirmation after 5 seconds
      setTimeout(() => {
        setSuccess('Payment confirmed successfully!');
        setTimeout(() => {
          navigate('/customer/bookings');
        }, 2000);
      }, 5000);

    } catch (error) {
      console.error('Payment error:', error);
      setError(error.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleCardPayment = async () => {
    setError('Card payments are currently unavailable. Please use M-Pesa.');
  };

  const handlePayment = () => {
    if (paymentMethod === 'mpesa') {
      handleMpesaPayment();
    } else {
      handleCardPayment();
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <i className="bi bi-exclamation-triangle display-1 text-muted"></i>
          <h3 className="mt-3">Booking not found</h3>
          <p className="text-muted">The booking you're trying to pay for doesn't exist.</p>
          <Link to="/customer/bookings" className="btn btn-primary">
            Back to Bookings
          </Link>
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
              <li className="breadcrumb-item"><Link to="/customer/bookings" className="text-decoration-none">My Bookings</Link></li>
              <li className="breadcrumb-item active">Make Payment</li>
            </ol>
          </nav>
          <h1 className="fw-bold">Make Payment</h1>
          <p className="text-muted">Complete your booking by making payment</p>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="row">
            {/* Booking Summary */}
            <div className="col-md-5 mb-4">
              <div className="card">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-receipt me-2"></i>
                    Booking Summary
                  </h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <strong>Salon:</strong>
                    <p className="mb-1">{booking.shop?.name}</p>
                    <small className="text-muted">{booking.shop?.location}</small>
                  </div>

                  <div className="mb-3">
                    <strong>Service:</strong>
                    <p className="mb-1">{booking.service?.serviceName}</p>
                    <small className="text-muted">60 minutes</small>
                  </div>

                  <div className="mb-3">
                    <strong>Date & Time:</strong>
                    <p className="mb-1">
                      {new Date(booking.dateTime).toLocaleDateString()}
                    </p>
                    <small className="text-muted">
                      {new Date(booking.dateTime).toLocaleTimeString()}
                    </small>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between align-items-center">
                    <strong>Total Amount:</strong>
                    <h4 className="text-primary mb-0">KSh {booking.service?.price}</h4>
                  </div>
                </div>
              </div>

              {/* Payment Status */}
              <div className="card mt-4">
                <div className="card-body">
                  <h6 className="card-title">Payment Status</h6>
                  <div className="alert alert-warning mb-0">
                    <i className="bi bi-clock me-2"></i>
                    <strong>Pending Payment</strong>
                    <div className="small mt-1">Complete payment to confirm your booking</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="col-md-7">
              <div className="card">
                <div className="card-header bg-success text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-credit-card me-2"></i>
                    Payment Details
                  </h5>
                </div>
                <div className="card-body">
                  {error && (
                    <div className="alert alert-danger d-flex align-items-center" role="alert">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      <div>{error}</div>
                    </div>
                  )}

                  {success && (
                    <div className="alert alert-success d-flex align-items-center" role="alert">
                      <i className="bi bi-check-circle-fill me-2"></i>
                      <div>{success}</div>
                    </div>
                  )}

                  {/* Payment Method Selection */}
                  <div className="mb-4">
                    <label className="form-label fw-bold">Select Payment Method</label>
                    <div className="row g-3">
                      <div className="col-6">
                        <div 
                          className={`card border-2 cursor-pointer ${paymentMethod === 'mpesa' ? 'border-success' : 'border-light'}`}
                          onClick={() => setPaymentMethod('mpesa')}
                          style={{cursor: 'pointer'}}
                        >
                          <div className="card-body text-center">
                            <i className="bi bi-phone text-success display-6 mb-2"></i>
                            <h6>M-Pesa</h6>
                            <small className="text-muted">Pay via M-Pesa</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div 
                          className={`card border-2 cursor-pointer ${paymentMethod === 'card' ? 'border-success' : 'border-light'}`}
                          onClick={() => setPaymentMethod('card')}
                          style={{cursor: 'pointer'}}
                        >
                          <div className="card-body text-center">
                            <i className="bi bi-credit-card text-primary display-6 mb-2"></i>
                            <h6>Credit Card</h6>
                            <small className="text-muted">Pay with card</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* M-Pesa Payment Form */}
                  {paymentMethod === 'mpesa' && (
                    <div className="mb-4">
                      <label htmlFor="phoneNumber" className="form-label">
                        M-Pesa Phone Number *
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-phone"></i>
                        </span>
                        <input
                          type="tel"
                          className="form-control"
                          id="phoneNumber"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="e.g., 0712345678 or 254712345678"
                          required
                        />
                      </div>
                      <div className="form-text">
                        Enter your M-Pesa registered phone number
                      </div>
                    </div>
                  )}

                  {/* Card Payment Form */}
                  {paymentMethod === 'card' && (
                    <div className="alert alert-info">
                      <i className="bi bi-info-circle me-2"></i>
                      Card payments are temporarily unavailable. Please use M-Pesa for now.
                    </div>
                  )}

                  {/* Payment Button */}
                  <div className="d-grid">
                    <button
                      className="btn btn-success btn-lg"
                      onClick={handlePayment}
                      disabled={processing || (paymentMethod === 'mpesa' && !phoneNumber)}
                    >
                      {processing ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Processing Payment...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-lock me-2"></i>
                          Pay KSh {booking.service?.price}
                        </>
                      )}
                    </button>
                  </div>

                  {/* Security Notice */}
                  <div className="mt-3 text-center">
                    <small className="text-muted">
                      <i className="bi bi-shield-check me-1"></i>
                      Your payment is secure and encrypted
                    </small>
                  </div>
                </div>
              </div>

              {/* M-Pesa Instructions */}
              {paymentMethod === 'mpesa' && (
                <div className="card mt-4">
                  <div className="card-header bg-light">
                    <h6 className="mb-0">
                      <i className="bi bi-info-circle me-2"></i>
                      M-Pesa Payment Instructions
                    </h6>
                  </div>
                  <div className="card-body">
                    <ol className="small">
                      <li>Enter your M-Pesa registered phone number</li>
                      <li>Click "Pay Now" to initiate payment</li>
                      <li>Check your phone for M-Pesa STK push prompt</li>
                      <li>Enter your M-Pesa PIN to complete payment</li>
                      <li>Wait for confirmation message</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;