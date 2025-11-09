// components/customer/CustomerCart.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CustomerCart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://hair-salon-app-1.onrender.com/cart',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://hair-salon-app-1.onrender.com/cart/${itemId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchCart(); // Refresh cart
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item from cart');
    }
  };

  const clearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(
          'https://hair-salon-app-1.onrender.com/cart',
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setCart(null);
      } catch (error) {
        console.error('Error clearing cart:', error);
        alert('Failed to clear cart');
      }
    }
  };

  const proceedToCheckout = async () => {
    if (!cart || cart.items.length === 0) return;

    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      
      // Create bookings for each cart item
      for (const item of cart.items) {
        const bookingData = {
          shop: item.shop._id,
          service: {
            serviceName: item.serviceName,
            price: item.price
          },
          date: new Date().toISOString().split('T')[0],
          time: '10:00' // Default time, you can make this dynamic
        };

        await axios.post(
          'https://hair-salon-app-1.onrender.com/booking',
          bookingData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      }

      // Clear cart after successful booking
      await axios.delete(
        'https://hair-salon-app-1.onrender.com/cart',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert('Bookings created successfully! Proceeding to payment...');
      navigate('/customer/bookings');
      
    } catch (error) {
      console.error('Error creating bookings:', error);
      alert('Failed to create bookings. Please try again.');
    } finally {
      setProcessing(false);
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

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container py-4">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body text-center py-5">
                <i className="bi bi-cart display-1 text-muted"></i>
                <h3 className="text-muted mt-3">Your Cart is Empty</h3>
                <p className="text-muted mb-4">Add some services from our salons to get started</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/shops')}
                >
                  <i className="bi bi-shop me-2"></i>
                  Browse Salons
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="fw-bold">Shopping Cart</h1>
              <p className="text-muted">{cart.items.length} services in your cart</p>
            </div>
            <button
              className="btn btn-outline-danger"
              onClick={clearCart}
              disabled={processing}
            >
              <i className="bi bi-trash me-2"></i>
              Clear Cart
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Cart Items */}
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-light">
              <h5 className="mb-0">Selected Services</h5>
            </div>
            <div className="card-body p-0">
              {cart.items.map((item, index) => (
                <div key={item._id || index} className="border-bottom p-4">
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <h6 className="mb-1">{item.serviceName}</h6>
                      <p className="text-muted small mb-0">
                        <i className="bi bi-shop me-1"></i>
                        {item.shop?.name}
                      </p>
                      <p className="text-muted small mb-0">
                        <i className="bi bi-geo-alt me-1"></i>
                        {item.shop?.location}
                      </p>
                    </div>
                    <div className="col-md-3 text-center">
                      <strong className="text-primary">KSh {item.price}</strong>
                    </div>
                    <div className="col-md-3 text-end">
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeFromCart(item._id)}
                        disabled={processing}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header bg-light">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>KSh {cart.total}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Service Fee:</span>
                <span>KSh {Math.round(cart.total * 0.05)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong className="text-primary">
                  KSh {cart.total + Math.round(cart.total * 0.05)}
                </strong>
              </div>

              <button
                className="btn btn-success w-100"
                onClick={proceedToCheckout}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="bi bi-lock me-2"></i>
                    Proceed to Checkout
                  </>
                )}
              </button>

              <div className="mt-3 text-center">
                <small className="text-muted">
                  <i className="bi bi-shield-check me-1"></i>
                  Secure payment with M-Pesa
                </small>
              </div>
            </div>
          </div>

          {/* Support Info */}
          <div className="card mt-3">
            <div className="card-body">
              <h6 className="card-title">
                <i className="bi bi-info-circle text-primary me-2"></i>
                Need Help?
              </h6>
              <p className="small text-muted mb-2">
                Our support team is here to help with your booking
              </p>
              <button className="btn btn-outline-primary btn-sm w-100">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerCart;