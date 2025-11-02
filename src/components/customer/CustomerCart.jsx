// components/customer/Cart.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CustomerCart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://hair-salon-app-1.onrender.com/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      // If cart doesn't exist, set empty cart
      if (error.response?.status === 404) {
        setCart({ items: [], total: 0 });
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://hair-salon-app-1.onrender.com/cart/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh cart
      fetchCart();
    } catch (error) {
      console.error('Error removing item from cart:', error);
      alert('Failed to remove item from cart. Please try again.');
    }
  };

  const clearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete('https://hair-salon-app-1.onrender.com/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh cart
      fetchCart();
      alert('Cart cleared successfully');
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Failed to clear cart. Please try again.');
    }
  };

  const proceedToCheckout = async () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      
      // Create bookings for each item in cart
      const bookingPromises = cart.items.map(item => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        return axios.post('https://hair-salon-app-1.onrender.com/booking', {
          shop: item.shop._id,
          service: {
            serviceName: item.serviceName,
            price: item.price
          },
          date: tomorrow.toISOString().split('T')[0],
          time: '10:00'
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      });

      const bookings = await Promise.all(bookingPromises);
      
      // Clear cart after successful bookings
      await axios.delete('https://hair-salon-app-1.onrender.com/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Navigate to bookings page
      alert('Bookings created successfully! You can now make payments for each booking.');
      navigate('/customer/bookings');
      
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Failed to create bookings. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your cart...</p>
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
              <li className="breadcrumb-item active">Shopping Cart</li>
            </ol>
          </nav>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold">Shopping Cart</h1>
              <p className="text-muted">Review your selected services before checkout</p>
            </div>
            <Link to="/shops" className="btn btn-outline-primary">
              <i className="bi bi-plus-circle me-2"></i>
              Add More Services
            </Link>
          </div>
        </div>
      </div>

      {cart && cart.items && cart.items.length > 0 ? (
        <div className="row">
          {/* Cart Items */}
          <div className="col-lg-8">
            <div className="card">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Cart Items ({cart.items.length})</h5>
                <button 
                  className="btn btn-sm btn-outline-danger"
                  onClick={clearCart}
                >
                  <i className="bi bi-trash me-2"></i>
                  Clear Cart
                </button>
              </div>
              <div className="card-body">
                {cart.items.map((item, index) => (
                  <div key={item._id || index} className="border-bottom pb-3 mb-3">
                    <div className="row align-items-center">
                      <div className="col-md-2">
                        {item.shop?.image ? (
                          <img 
                            src={`https://hair-salon-app-1.onrender.com${item.shop.image}`} 
                            alt={item.shop.name}
                            className="img-fluid rounded"
                            style={{width: '80px', height: '80px', objectFit: 'cover'}}
                          />
                        ) : (
                          <div className="bg-light rounded d-flex align-items-center justify-content-center" 
                               style={{width: '80px', height: '80px'}}>
                            <i className="bi bi-shop text-muted"></i>
                          </div>
                        )}
                      </div>
                      <div className="col-md-4">
                        <h6 className="fw-bold mb-1">{item.serviceName}</h6>
                        <p className="text-muted mb-1">
                          <i className="bi bi-shop me-2"></i>
                          {item.shop?.name}
                        </p>
                        <small className="text-muted">
                          <i className="bi bi-geo-alt me-2"></i>
                          {item.shop?.location}
                        </small>
                      </div>
                      <div className="col-md-2 text-center">
                        <span className="fw-bold text-primary">KSh {item.price}</span>
                      </div>
                      <div className="col-md-2 text-center">
                        <span className="badge bg-light text-dark">60 mins</span>
                      </div>
                      <div className="col-md-2 text-end">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeFromCart(item._id)}
                        >
                          <i className="bi bi-trash me-2"></i>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="card">
              <div className="card-header bg-white">
                <h5 className="mb-0">Order Summary</h5>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal ({cart.items.length} items):</span>
                  <span>KSh {cart.total}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Service Fee:</span>
                  <span>KSh 0</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Tax:</span>
                  <span>KSh 0</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <strong>Total:</strong>
                  <strong className="text-primary">KSh {cart.total}</strong>
                </div>

                <button
                  className="btn btn-primary w-100 mb-2"
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
                      <i className="bi bi-credit-card me-2"></i>
                      Proceed to Checkout
                    </>
                  )}
                </button>

                <Link to="/shops" className="btn btn-outline-secondary w-100">
                  <i className="bi bi-arrow-left me-2"></i>
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="card mt-4">
              <div className="card-header bg-white">
                <h6 className="mb-0">Accepted Payment Methods</h6>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-6">
                    <div className="border rounded p-2 mb-2">
                      <i className="bi bi-phone text-success fs-4"></i>
                      <div className="small">M-Pesa</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="border rounded p-2 mb-2">
                      <i className="bi bi-credit-card text-primary fs-4"></i>
                      <div className="small">Card</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Info */}
            <div className="card mt-4">
              <div className="card-body">
                <h6 className="card-title">
                  <i className="bi bi-info-circle text-primary me-2"></i>
                  Need Help?
                </h6>
                <p className="small text-muted mb-2">
                  Your selected services will be booked for tomorrow at 10:00 AM by default.
                </p>
                <p className="small text-muted mb-0">
                  You can adjust the booking details and make payments after checkout.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-5">
          <i className="bi bi-cart display-1 text-muted"></i>
          <h4 className="text-muted mt-3">Your cart is empty</h4>
          <p className="text-muted">Add some hair services to get started!</p>
          <Link to="/shops" className="btn btn-primary btn-lg">
            <i className="bi bi-search me-2"></i>
            Browse Salons
          </Link>
        </div>
      )}
    </div>
  );
};

export default CustomerCart;