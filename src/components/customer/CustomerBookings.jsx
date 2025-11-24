// components/customer/CustomerBookings.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const BACKEND_URL = "https://hair-salon-app-1.onrender.com";

const CustomerBookings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { shopId: paramShopId } = useParams();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  // Get shopId from params or location state
  const shopId = paramShopId || location.state?.shopId;
  const preselectedServices = location.state?.preselectedServices || [];
  
  const [shop, setShop] = useState(null);
  const [selectedServices, setSelectedServices] = useState(preselectedServices || []);
  const [dateTime, setDateTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState("");

  // Redirect if no shop selected
  useEffect(() => {
    if (!shopId && !preselectedServices) {
      console.log("No shop selected, redirecting to shops");
      navigate("/shops");
      return;
    }
  }, [shopId, preselectedServices, navigate]);

  // Handle authentication
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      const confirmLogin = window.confirm(
        "Please log in to book services. Would you like to login now?"
      );
      if (confirmLogin) {
        navigate("/login", {
          state: {
            from: location.pathname,
            shopId: shopId,
            preselectedServices: preselectedServices
          }
        });
      } else {
        navigate("/shops");
      }
      return;
    }
  }, [isAuthenticated, authLoading, navigate, location.pathname, shopId, preselectedServices]);

  // Fetch shop details
  useEffect(() => {
    const fetchShop = async () => {
      if (!shopId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const response = await fetch(`${BACKEND_URL}/shop/${shopId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Shop not found");
          }
          throw new Error(`Failed to fetch shop: ${response.status}`);
        }
        
        const data = await response.json();
        setShop(data);
      } catch (error) {
        console.error("Error fetching shop:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (shopId) {
      fetchShop();
    } else {
      setLoading(false);
    }
  }, [shopId]);

  // Fetch user data
  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
      fetchCart();
    }
  }, [isAuthenticated]);

  const fetchBookings = async () => {
    if (!isAuthenticated) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BACKEND_URL}/booking`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BACKEND_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setCartItems(data.items || []);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const toggleService = (service) => {
    setSelectedServices((prev) =>
      prev.some((s) => s._id === service._id)
        ? prev.filter((s) => s._id !== service._id)
        : [...prev, service]
    );
  };

  const totalCost = selectedServices.reduce((sum, service) => sum + service.price, 0);

  const addToCart = async (service) => {
    if (!isAuthenticated || !user) {
      alert("Please log in to add services to cart");
      navigate("/login", { 
        state: { from: location.pathname, shopId: shopId } 
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BACKEND_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shop: shopId,
          serviceName: service.serviceName,
          price: service.price,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCartItems(prev => [...prev, { ...service, shop: shopId }]);
        alert("Service added to cart!");
        fetchCart();
      } else {
        alert(data.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Error adding service to cart");
    }
  };

  const handleBooking = async () => {
    if (!selectedServices.length) {
      alert("Please select at least one service.");
      return;
    }
    
    if (!dateTime) {
      alert("Please select a date and time.");
      return;
    }
    
    if (!isAuthenticated || !user) {
      alert("Please log in to book services.");
      navigate("/login", { 
        state: { from: location.pathname, shopId: shopId } 
      });
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");

      // If we have preselected services (from cart), use checkout
      if (preselectedServices && preselectedServices.length > 0) {
        const checkoutResponse = await fetch(`${BACKEND_URL}/booking/checkout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            dateTime: new Date(dateTime).toISOString(),
          }),
        });

        if (!checkoutResponse.ok) {
          const errorData = await checkoutResponse.json();
          throw new Error(errorData.message || "Checkout failed");
        }

        const checkoutData = await checkoutResponse.json();
        console.log("Cart checkout successful:", checkoutData);
        
      } else {
        // Use the new individual booking route instead of adding to cart first
        const bookingResponse = await fetch(`${BACKEND_URL}/booking`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            shop: shopId,
            services: selectedServices.map(service => ({
              serviceName: service.serviceName,
              price: service.price
            })),
            dateTime: new Date(dateTime).toISOString(),
          }),
        });

        if (!bookingResponse.ok) {
          const errorData = await bookingResponse.json();
          throw new Error(errorData.message || "Failed to create booking");
        }

        const bookingData = await bookingResponse.json();
        console.log("Individual booking successful:", bookingData);
      }

      alert("Booking created successfully! Payment will be done at the shop.");
      setSelectedServices([]);
      setDateTime("");

      // Refresh data
      fetchBookings();
      fetchCart();

      // Navigate to bookings page
      setTimeout(() => {
        navigate("/customer/bookings");
      }, 2000);
      
    } catch (error) {
      console.error("Booking error:", error);
      alert(error.message || "Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BACKEND_URL}/booking/${bookingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setBookings(prev => prev.filter(booking => booking._id !== bookingId));
        alert("Booking deleted successfully!");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to delete booking");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Error deleting booking");
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${BACKEND_URL}/booking/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "cancelled"
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to cancel booking");
      }

      fetchBookings();
      alert("Booking cancelled successfully!");
      
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert(error.message || "Failed to cancel booking");
    }
  };

  if (authLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading user information...</p>
        </div>
      </div>
    );
  }

  if (loading && shopId) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-pink" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading shop details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="alert alert-danger p-4 rounded-3 shadow-sm max-w-md">
            <div className="mb-3">
              <i className="bi bi-exclamation-triangle-fill text-danger fs-1"></i>
            </div>
            <h2 className="h4 fw-bold text-danger mb-3">Error Loading Shop</h2>
            <p className="text-muted mb-4">{error}</p>
            <button
              onClick={() => navigate("/shops")}
              className="btn btn-primary px-4"
            >
              Back to Shops
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 bg-light">
      {/* User Info Header */}
      <div className="row justify-content-center mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm bg-gradient-primary text-white">
            <div className="card-body p-4">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h1 className="h3 fw-bold mb-1">
                    <i className="bi bi-person-circle me-2"></i>
                    Welcome, {user?.name || 'Beautiful Customer'}!
                  </h1>
                  <p className="mb-0 opacity-75">
                    <i className="bi bi-envelope me-1"></i>
                    {user?.email}
                  </p>
                </div>
                <div className="bg-white bg-opacity-20 px-3 py-2 rounded-pill">
                  <small className="fw-semibold">
                    <i className="bi bi-star me-1"></i>
                    {user?.role}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-8">
          {/* Shop Information */}
          {shop && (
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <div className="row align-items-center">
                  {shop.image && (
                    <div className="col-12 col-md-4 mb-3 mb-md-0">
                      <img 
                        src={shop.image} 
                        alt={shop.name}
                        className="img-fluid rounded-3 shadow-sm"
                        style={{height: '200px', width: '100%', objectFit: 'cover'}}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className={shop.image ? "col-12 col-md-8" : "col-12"}>
                    <h1 className="h2 fw-bold text-dark mb-2">{shop.name}</h1>
                    <p className="text-muted mb-3">
                      <i className="bi bi-geo-alt-fill me-2 text-primary"></i>
                      {shop.location}
                    </p>
                    <p className="text-dark mb-0">{shop.description}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Available Services */}
          {shop && shop.services && (
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-0 py-3">
                <h2 className="h4 fw-bold text-dark mb-0">
                  <i className="bi bi-scissors me-2 text-pink"></i>
                  Available Beauty Services
                </h2>
              </div>
              <div className="card-body p-0">
                <div className="list-group list-group-flush">
                  {shop.services.map((service) => (
                    <div
                      key={service._id}
                      className={`list-group-item list-group-item-action border-0 py-3 ${
                        selectedServices.some((s) => s._id === service._id)
                          ? "bg-pink-light border-start-4 border-pink"
                          : "bg-white"
                      }`}
                      onClick={() => toggleService(service)}
                      style={{cursor: 'pointer'}}
                    >
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <div className={`rounded-circle p-2 me-3 ${
                            selectedServices.some((s) => s._id === service._id)
                              ? "bg-pink text-white"
                              : "bg-light text-muted"
                          }`}>
                            <i className="bi bi-check-lg"></i>
                          </div>
                          <div>
                            <h5 className="mb-1 fw-semibold">{service.serviceName}</h5>
                            <p className="text-muted mb-0">
                              KSh {service.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(service);
                            }}
                            className="btn btn-outline-orange btn-sm"
                          >
                            <i className="bi bi-cart-plus me-1"></i>
                            Add to Cart
                          </button>
                          <div className="form-check">
                            <input
                              type="checkbox"
                              checked={selectedServices.some((s) => s._id === service._id)}
                              readOnly
                              className="form-check-input"
                              style={{width: '1.2em', height: '1.2em'}}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Selected Services Summary */}
          {selectedServices.length > 0 && (
            <div className="card border-warning border-2 mb-4">
              <div className="card-header bg-warning bg-opacity-10 border-warning">
                <h3 className="h5 fw-bold text-warning-dark mb-0">
                  <i className="bi bi-clipboard-check me-2"></i>
                  Selected Services for Booking
                </h3>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 col-md-8">
                    <ul className="list-unstyled mb-0">
                      {selectedServices.map(service => (
                        <li key={service._id} className="mb-2 d-flex align-items-center">
                          <i className="bi bi-check-circle-fill text-success me-2"></i>
                          <span className="fw-semibold">{service.serviceName}</span>
                          <span className="text-muted ms-2">
                            - KSh {service.price.toLocaleString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="col-12 col-md-4 text-md-end">
                    <p className="h5 fw-bold text-warning-dark mb-0">
                      Total: KSh {totalCost.toLocaleString()}
                    </p>
                    <small className="text-muted">
                      {selectedServices.length} service(s) selected
                    </small>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Date & Time Selection */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h3 className="h5 fw-bold text-dark mb-3">
                <i className="bi bi-calendar2-event me-2 text-primary"></i>
                Choose Your Preferred Date & Time
              </h3>
              <div className="row">
                <div className="col-12 col-md-6">
                  <input
                    type="datetime-local"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    className="form-control form-control-lg"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Cart Items */}
          {cartItems.length > 0 && (
            <div className="card border-purple border-2 mb-4">
              <div className="card-header bg-purple bg-opacity-10 border-purple">
                <h3 className="h5 fw-bold text-purple mb-0">
                  <i className="bi bi-cart3 me-2"></i>
                  Your Cart Items ({cartItems.length})
                </h3>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 col-md-8">
                    <div className="row">
                      {cartItems.map((item, index) => (
                        <div key={index} className="col-12 col-sm-6 mb-2">
                          <div className="d-flex align-items-center">
                            <i className="bi bi-bag-check text-purple me-2"></i>
                            <span className="fw-semibold">{item.serviceName}</span>
                            <span className="text-muted ms-2">
                              - KSh {item.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-12 col-md-4 text-md-end">
                    <a href="/customer/cart" className="btn btn-purple btn-sm">
                      <i className="bi bi-arrow-right me-1"></i>
                      Manage Cart
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Book Now Button */}
          <div className="card border-success border-2 mb-5">
            <div className="card-body p-4">
              <div className="row align-items-center">
                <div className="col-12 col-md-6 mb-3 mb-md-0">
                  <h3 className="h4 fw-bold text-success mb-1">
                    Total Amount
                  </h3>
                  <p className="h3 fw-bold text-dark mb-0">
                    KSh {totalCost.toLocaleString()}
                  </p>
                  <small className="text-muted">
                    {selectedServices.length} beautiful service(s) selected
                  </small>
                </div>
                <div className="col-12 col-md-6 text-md-end">
                  <button
                    className="btn btn-success btn-lg px-5 py-3 fw-semibold"
                    onClick={handleBooking}
                    disabled={submitting || !selectedServices.length || !dateTime || !isAuthenticated}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Processing Your Beauty Appointment...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-calendar2-check me-2"></i>
                        Book Now & Get Beautiful
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* My Bookings Section */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 py-3">
              <h2 className="h4 fw-bold text-dark mb-0">
                <i className="bi bi-clock-history me-2 text-primary"></i>
                My Beauty Appointments
              </h2>
            </div>
            <div className="card-body">
              {bookings.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-calendar-x text-muted fs-1 mb-3"></i>
                  <p className="text-muted mb-2">No appointments booked yet.</p>
                  <p className="text-muted small">
                    Select services above to schedule your beauty transformation!
                  </p>
                </div>
              ) : (
                <div className="row g-3">
                  {bookings.map((booking) => (
                    <div key={booking._id} className="col-12">
                      <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                          <div className="row align-items-center">
                            <div className="col-12 col-md-8">
                              <h5 className="fw-bold text-dark mb-2">
                                {booking.shop?.name}
                              </h5>
                              <div className="mb-3">
                                {booking.services?.map((service, index) => (
                                  <span key={index} className="badge bg-pink-light text-pink me-2 mb-2">
                                    <i className="bi bi-scissors me-1"></i>
                                    {service.serviceName} - KSh {service.price.toLocaleString()}
                                  </span>
                                ))}
                              </div>
                              <div className="d-flex flex-wrap gap-3 text-muted">
                                <small>
                                  <i className="bi bi-calendar me-1"></i>
                                  {new Date(booking.dateTime).toLocaleDateString()}
                                </small>
                                <small>
                                  <i className="bi bi-clock me-1"></i>
                                  {new Date(booking.dateTime).toLocaleTimeString()}
                                </small>
                                <span className={`badge ${
                                  booking.status === 'confirmed' ? 'bg-success' :
                                  booking.status === 'cancelled' ? 'bg-danger' :
                                  booking.status === 'completed' ? 'bg-primary' :
                                  'bg-warning'
                                }`}>
                                  {booking.status?.toUpperCase()}
                                </span>
                              </div>
                              <p className="h5 fw-bold text-success mt-2 mb-0">
                                Total: KSh {booking.totalPrice?.toLocaleString()}
                              </p>
                            </div>
                            <div className="col-12 col-md-4 text-md-end mt-3 mt-md-0">
                              <div className="d-flex flex-column gap-2">
                                {booking.status === "pending" && (
                                  <>
                                    <button
                                      className="btn btn-outline-danger btn-sm"
                                      onClick={() => handleCancelBooking(booking._id)}
                                    >
                                      <i className="bi bi-x-circle me-1"></i>
                                      Cancel
                                    </button>
                                    <button
                                      className="btn btn-outline-dark btn-sm"
                                      onClick={() => handleDeleteBooking(booking._id)}
                                    >
                                      <i className="bi bi-trash me-1"></i>
                                      Delete
                                    </button>
                                  </>
                                )}
                                {booking.status === "confirmed" && (
                                  <button
                                    className="btn btn-outline-danger"
                                    onClick={() => handleCancelBooking(booking._id)}
                                  >
                                    <i className="bi bi-x-circle me-1"></i>
                                    Cancel Booking
                                  </button>
                                )}
                                {(booking.status === "completed" || booking.status === "cancelled") && (
                                  <button
                                    className="btn btn-outline-dark btn-sm"
                                    onClick={() => handleDeleteBooking(booking._id)}
                                  >
                                    <i className="bi bi-trash me-1"></i>
                                    Delete
                                  </button>
                                )}
                              </div>
                            </div>
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
      </div>

      {/* Add Bootstrap Icons */}
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" 
        rel="stylesheet" 
      />

      {/* Custom Beauty Styles */}
      <style jsx>{`
        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .text-pink {
          color: #e83e8c !important;
        }
        .bg-pink {
          background-color: #e83e8c !important;
        }
        .bg-pink-light {
          background-color: #fce4ec !important;
        }
        .text-warning-dark {
          color: #856404 !important;
        }
        .border-pink {
          border-color: #e83e8c !important;
        }
        .btn-pink {
          background-color: #e83e8c;
          border-color: #e83e8c;
          color: white;
        }
        .btn-pink:hover {
          background-color: #d81b60;
          border-color: #d81b60;
          color: white;
        }
        .btn-outline-orange {
          color: #fd7e14;
          border-color: #fd7e14;
        }
        .btn-outline-orange:hover {
          background-color: #fd7e14;
          border-color: #fd7e14;
          color: white;
        }
        .border-purple {
          border-color: #6f42c1 !important;
        }
        .bg-purple {
          background-color: #6f42c1 !important;
        }
        .text-purple {
          color: #6f42c1 !important;
        }
        .bg-purple-light {
          background-color: #e9ecef !important;
        }
        .btn-purple {
          background-color: #6f42c1;
          border-color: #6f42c1;
          color: white;
        }
        .btn-purple:hover {
          background-color: #5a2d91;
          border-color: #5a2d91;
          color: white;
        }
        .spinner-border.text-pink {
          color: #e83e8c !important;
        }
      `}</style>
    </div>
  );
};

export default CustomerBookings;