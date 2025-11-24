// components/customer/CustomerCart.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const BACKEND_URL = 'https://hair-salon-app-1.onrender.com';

const CustomerCart = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchCart();
  }, [isAuthenticated, navigate]);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/cart`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCart(data);
      } else {
        console.error('Failed to fetch cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/cart/remove/${itemId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchCart(); // Refresh cart
      } else {
        alert('Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Error removing item from cart');
    }
  };

  const clearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your beauty cart?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/cart/clear`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setCart({ items: [], total: 0 });
      } else {
        alert('Failed to clear cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Error clearing cart');
    }
  };

  const proceedToBooking = () => {
    if (!cart.items.length) {
      alert('Your beauty cart is empty');
      return;
    }

    // Group items by shop
    const shops = {};
    cart.items.forEach(item => {
      if (!shops[item.shop._id]) {
        shops[item.shop._id] = {
          shop: item.shop,
          services: []
        };
      }
      shops[item.shop._id].services.push(item);
    });

    // If items from multiple shops, let user choose which shop to book
    const shopIds = Object.keys(shops);
    if (shopIds.length === 1) {
      // Navigate to the correct booking route that exists
      navigate('/booking', { 
        state: { 
          shopId: shopIds[0],
          preselectedServices: shops[shopIds[0]].services 
        } 
      });
    } else {
      // Show shop selection modal or navigate to a selection page
      alert('Please book services from one shop at a time. You have items from multiple shops in your cart.');
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
            <p className="mt-3 text-muted">Loading your beauty cart...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container-fluid py-4 bg-light min-vh-100">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card border-0 shadow-sm text-center">
              <div className="card-body py-5">
                <div className="mb-4">
                  <i className="bi bi-bag-heart display-1 text-muted"></i>
                </div>
                <h2 className="h3 fw-bold text-dark mb-3">Your Beauty Cart is Empty</h2>
                <p className="text-muted mb-4">
                  Discover amazing salon services and start your beauty transformation journey!
                </p>
                <div className="d-grid gap-2 d-md-block">
                  <Link 
                    to="/shops"
                    className="btn btn-primary btn-lg px-5"
                  >
                    <i className="bi bi-shop me-2"></i>
                    Explore Salons
                  </Link>
                  <Link 
                    to="/customer/dashboard"
                    className="btn btn-outline-secondary btn-lg ms-md-2 mt-2 mt-md-0"
                  >
                    <i className="bi bi-house me-2"></i>
                    Back to Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm bg-gradient-beauty text-white">
            <div className="card-body p-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h1 className="h2 fw-bold mb-2">
                    <i className="bi bi-bag-heart me-3"></i>
                    My Beauty Cart
                  </h1>
                  <p className="mb-0 opacity-75">
                    Review and manage your selected beauty services
                  </p>
                </div>
                <div className="col-md-4 text-md-end">
                  <div className="bg-white bg-opacity-20 rounded-pill px-3 py-1 d-inline-block">
                    <small className="fw-semibold">
                      <i className="bi bi-gem me-1"></i>
                      {cart.items.length} Service{cart.items.length !== 1 ? 's' : ''} Selected
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Cart Items */}
        <div className="col-lg-8 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3">
              <h3 className="h5 fw-bold text-dark mb-0">
                <i className="bi bi-scissors me-2 text-primary"></i>
                Selected Beauty Services
              </h3>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {cart.items.map((item) => (
                  <div key={item._id} className="list-group-item border-0 py-4">
                    <div className="row align-items-center">
                      <div className="col-md-2 text-center mb-3 mb-md-0">
                        <div className="bg-pink bg-opacity-10 rounded-circle p-3 d-inline-flex align-items-center justify-content-center">
                          <i className="bi bi-scissors fs-4 text-pink"></i>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3 mb-md-0">
                        <h5 className="fw-bold text-dark mb-2">{item.serviceName}</h5>
                        <div className="mb-2">
                          <span className="badge bg-primary bg-opacity-10 text-primary me-2">
                            <i className="bi bi-shop me-1"></i>
                            {item.shop?.name}
                          </span>
                          <span className="badge bg-secondary bg-opacity-10 text-secondary">
                            <i className="bi bi-geo-alt me-1"></i>
                            {item.shop?.location}
                          </span>
                        </div>
                        <p className="text-success fw-bold fs-5 mb-0">
                          KSh {item.price?.toLocaleString()}
                        </p>
                      </div>
                      <div className="col-md-4 text-md-end">
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="btn btn-outline-danger btn-sm"
                        >
                          <i className="bi bi-trash me-1"></i>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm sticky-top" style={{top: '20px'}}>
            <div className="card-header bg-white border-0 py-3">
              <h3 className="h5 fw-bold text-dark mb-0">
                <i className="bi bi-receipt me-2 text-success"></i>
                Beauty Cart Summary
              </h3>
            </div>
            <div className="card-body">
              {/* Order Summary */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted">Services ({cart.items.length})</span>
                  <span className="fw-semibold">KSh {cart.total?.toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted">Service Fee</span>
                  <span className="fw-semibold">KSh 0</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold text-dark">Total Amount</span>
                  <span className="h4 fw-bold text-success mb-0">
                    KSh {cart.total?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-grid gap-3">
                <button
                  onClick={proceedToBooking}
                  className="btn btn-success btn-lg py-3 fw-semibold"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Processing Your Beauty Booking...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-calendar2-check me-2"></i>
                      Book My Beauty Services
                    </>
                  )}
                </button>

                <button
                  onClick={clearCart}
                  className="btn btn-outline-danger py-2"
                  disabled={processing}
                >
                  <i className="bi bi-trash me-2"></i>
                  Clear Beauty Cart
                </button>
              </div>

              {/* Additional Info */}
              <div className="mt-4">
                <div className="alert alert-primary alert-dismissible fade show mb-3" role="alert">
                  <div className="d-flex">
                    <i className="bi bi-info-circle me-2 mt-1"></i>
                    <div>
                      <strong>Secure Payment</strong>
                      <p className="mb-0 small">Payment will be done at the salon for your security</p>
                    </div>
                  </div>
                </div>

                <div className="alert alert-warning alert-dismissible fade show mb-0" role="alert">
                  <div className="d-flex">
                    <i className="bi bi-lightning me-2 mt-1"></i>
                    <div>
                      <strong>Quick Booking</strong>
                      <p className="mb-0 small">Complete your booking in just a few steps</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Shopping Section */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-4">
              <h4 className="fw-bold text-dark mb-3">Want More Beauty Services?</h4>
              <p className="text-muted mb-4">
                Discover more amazing services and complete your beauty transformation
              </p>
              <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
                <Link to="/shops" className="btn btn-outline-primary btn-lg">
                  <i className="bi bi-shop me-2"></i>
                  Explore More Salons
                </Link>
                <Link to="/customer/dashboard" className="btn btn-outline-secondary btn-lg">
                  <i className="bi bi-house me-2"></i>
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Grouping Info */}
      {(() => {
        const shops = {};
        cart.items.forEach(item => {
          if (!shops[item.shop._id]) {
            shops[item.shop._id] = {
              shop: item.shop,
              services: []
            };
          }
          shops[item.shop._id].services.push(item);
        });

        const shopCount = Object.keys(shops).length;
        
        if (shopCount > 1) {
          return (
            <div className="row mt-4">
              <div className="col-12">
                <div className="alert alert-info border-0 shadow-sm">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-info-circle fs-4 me-3"></i>
                    <div>
                      <h6 className="fw-bold mb-1">Multiple Salons Detected</h6>
                      <p className="mb-0 small">
                        You have services from {shopCount} different salons. You'll need to complete separate bookings for each salon.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        return null;
      })()}

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
        .text-pink {
          color: #e83e8c !important;
        }
        .bg-pink {
          background-color: #e83e8c !important;
        }
        .spinner-border.text-pink {
          color: #e83e8c !important;
        }
        .min-vh-100 {
          min-height: 100vh;
        }
        .sticky-top {
          position: sticky;
          z-index: 100;
        }
        .card {
          transition: transform 0.2s ease-in-out;
        }
        .card:hover {
          transform: translateY(-2px);
        }
        .list-group-item:hover {
          background-color: #f8f9fa;
        }
      `}</style>
    </div>
  );
};

export default CustomerCart;
