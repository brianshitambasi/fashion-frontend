// components/public/ShopDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const ShopDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [shop, setShop] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [hairstyles, setHairstyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [activeTab, setActiveTab] = useState('services');

  useEffect(() => {
    fetchShopDetails();
  }, [id]);

  const fetchShopDetails = async () => {
    try {
      setLoading(true);
      const [shopRes, reviewsRes, hairstylesRes] = await Promise.all([
        axios.get(`https://hair-salon-app-1.onrender.com/shops/${id}`),
        axios.get(`https://hair-salon-app-1.onrender.com/reviews/shop/${id}`).catch(err => ({ data: [] })),
        axios.get(`https://hair-salon-app-1.onrender.com/hairstyles/shop/${id}`).catch(err => ({ data: [] }))
      ]);

      setShop(shopRes.data);
      setReviews(reviewsRes.data || []);
      setHairstyles(hairstylesRes.data || []);
    } catch (error) {
      console.error('Error fetching shop details:', error);
      if (error.response?.status === 404) {
        setShop(null);
      } else {
        alert('Failed to load shop details. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (service) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/shops/${id}` } });
      return;
    }

    if (user.role !== 'customer') {
      alert('Only customers can book services');
      return;
    }

    setAddingToCart(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://hair-salon-app-1.onrender.com/cart', {
        shop: id,
        serviceName: service.serviceName,
        price: service.price
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Service added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add service to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBookNow = (service) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/shops/${id}` } });
      return;
    }

    if (user.role !== 'customer') {
      alert('Only customers can book services');
      return;
    }

    setSelectedService(service);
    setShowBookingModal(true);
    
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingDate(tomorrow.toISOString().split('T')[0]);
    
    // Set default time to 10:00 AM
    setBookingTime('10:00');
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('https://hair-salon-app-1.onrender.com/bookings', {
        shop: id,
        service: {
          serviceName: selectedService.serviceName,
          price: selectedService.price
        },
        date: bookingDate,
        time: bookingTime
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const booking = response.data.booking;
      alert('Booking created successfully! You can now make payment.');
      setShowBookingModal(false);
      
      // Automatically initiate M-Pesa payment
      await handleMpesaPayment(booking._id, selectedService.price);
      
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
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
      
      // Redirect to bookings page
      navigate('/customer/bookings');
      
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Payment initiation failed. You can pay later from your bookings page.');
      navigate('/customer/bookings');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated || user?.role !== 'customer') {
      alert('Only customers can submit reviews');
      return;
    }

    setSubmittingReview(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://hair-salon-app-1.onrender.com/reviews', {
        shop: id,
        rating: reviewRating,
        comment: reviewComment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Review submitted successfully!');
      setShowReviewModal(false);
      setReviewRating(5);
      setReviewComment('');
      fetchShopDetails(); // Refresh reviews
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading salon details...</p>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <i className="bi bi-exclamation-triangle display-1 text-muted"></i>
          <h3 className="mt-3">Salon not found</h3>
          <p className="text-muted">The salon you're looking for doesn't exist.</p>
          <Link to="/shops" className="btn btn-primary">
            Browse All Salons
          </Link>
        </div>
      </div>
    );
  }

  const ratingDistribution = getRatingDistribution();
  const averageRating = calculateAverageRating();

  return (
    <div className="container py-5">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/shops" className="text-decoration-none">Salons</Link></li>
          <li className="breadcrumb-item active">{shop.name}</li>
        </ol>
      </nav>

      {/* Shop Header */}
      <div className="row mb-5">
        <div className="col-md-4">
          {shop.image ? (
            <img 
              src={`https://hair-salon-app-1.onrender.com${shop.image}`} 
              className="img-fluid rounded-3 shadow" 
              alt={shop.name}
              style={{height: '300px', width: '100%', objectFit: 'cover'}}
            />
          ) : (
            <div className="bg-light rounded-3 shadow d-flex align-items-center justify-content-center" style={{height: '300px'}}>
              <i className="bi bi-shop display-1 text-muted"></i>
            </div>
          )}
        </div>
        
        <div className="col-md-8">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h1 className="fw-bold mb-2">{shop.name}</h1>
              <p className="text-muted mb-3">
                <i className="bi bi-geo-alt me-2"></i>
                {shop.location}
              </p>
            </div>
            <div className="text-end">
              <div className="bg-warning text-dark rounded-pill px-3 py-2 mb-2">
                <span className="fw-bold h5 mb-0">{averageRating}</span>
                <i className="bi bi-star-fill ms-1"></i>
              </div>
              <small className="text-muted">{reviews.length} reviews</small>
            </div>
          </div>

          <p className="lead mb-4">{shop.description}</p>

          <div className="row g-3 mb-4">
            <div className="col-sm-6">
              <div className="d-flex align-items-center">
                <i className="bi bi-person-check text-primary me-2"></i>
                <span>Owner: {shop.owner?.name}</span>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="d-flex align-items-center">
                <i className="bi bi-telephone text-primary me-2"></i>
                <span>Contact: {shop.owner?.phone || 'N/A'}</span>
              </div>
            </div>
          </div>

          {isAuthenticated && user?.role === 'customer' && (
            <div className="d-flex gap-2">
              <button 
                className="btn btn-primary"
                onClick={() => setActiveTab('services')}
              >
                <i className="bi bi-calendar-check me-2"></i>
                Book Appointment
              </button>
              <button className="btn btn-outline-primary">
                <i className="bi bi-heart me-2"></i>
                Save Salon
              </button>
            </div>
          )}

          {!isAuthenticated && (
            <div className="d-flex gap-2">
              <Link to="/login" className="btn btn-primary">
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Login to Book
              </Link>
              <Link to="/register" className="btn btn-outline-primary">
                <i className="bi bi-person-plus me-2"></i>
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="row">
        <div className="col-12">
          <ul className="nav nav-tabs" id="shopTabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'services' ? 'active' : ''}`}
                onClick={() => setActiveTab('services')}
              >
                <i className="bi bi-list-check me-2"></i>
                Services & Pricing
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'gallery' ? 'active' : ''}`}
                onClick={() => setActiveTab('gallery')}
              >
                <i className="bi bi-images me-2"></i>
                Style Gallery
                {hairstyles.length > 0 && (
                  <span className="badge bg-primary ms-2">{hairstyles.length}</span>
                )}
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                <i className="bi bi-star me-2"></i>
                Reviews & Ratings
                <span className="badge bg-primary ms-2">{reviews.length}</span>
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'info' ? 'active' : ''}`}
                onClick={() => setActiveTab('info')}
              >
                <i className="bi bi-info-circle me-2"></i>
                Information
              </button>
            </li>
          </ul>

          <div className="tab-content mt-4">
            {/* Services Tab */}
            {activeTab === 'services' && (
              <div className="tab-pane fade show active">
                <div className="card shadow-sm">
                  <div className="card-header bg-white">
                    <h4 className="mb-0">
                      <i className="bi bi-list-check text-primary me-2"></i>
                      Services & Pricing
                    </h4>
                  </div>
                  <div className="card-body">
                    {shop.services && shop.services.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Service</th>
                              <th>Duration</th>
                              <th>Price</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {shop.services.map((service, index) => (
                              <tr key={index}>
                                <td>
                                  <strong>{service.serviceName}</strong>
                                </td>
                                <td>60 minutes</td>
                                <td className="fw-bold text-primary">
                                  KSh {service.price}
                                </td>
                                <td>
                                  <div className="d-flex gap-2">
                                    <button
                                      className="btn btn-sm btn-outline-primary"
                                      onClick={() => handleBookNow(service)}
                                    >
                                      <i className="bi bi-calendar-plus me-1"></i>
                                      Book Now
                                    </button>
                                    <button
                                      className="btn btn-sm btn-outline-success"
                                      onClick={() => handleAddToCart(service)}
                                      disabled={addingToCart}
                                    >
                                      {addingToCart ? (
                                        <span className="spinner-border spinner-border-sm me-1"></span>
                                      ) : (
                                        <i className="bi bi-cart-plus me-1"></i>
                                      )}
                                      {addingToCart ? 'Adding...' : 'Add to Cart'}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-muted text-center py-3">No services available at the moment.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Gallery Tab */}
            {activeTab === 'gallery' && (
              <div className="tab-pane fade show active">
                {hairstyles.length > 0 ? (
                  <div className="row g-3">
                    {hairstyles.map(style => (
                      <div key={style._id} className="col-sm-6 col-md-4 col-lg-3">
                        <div className="card border-0 shadow-sm">
                          {style.imageUrl ? (
                            <img 
                              src={style.imageUrl} 
                              className="card-img-top rounded" 
                              alt={style.name}
                              style={{height: '200px', objectFit: 'cover'}}
                            />
                          ) : (
                            <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{height: '200px'}}>
                              <i className="bi bi-image text-muted display-6"></i>
                            </div>
                          )}
                          <div className="card-body">
                            <h6 className="card-title mb-1">{style.name}</h6>
                            <small className="text-muted text-capitalize">{style.gender}</small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <i className="bi bi-images display-1 text-muted"></i>
                    <h4 className="text-muted mt-3">No hairstyles available</h4>
                    <p className="text-muted">Check back later for style inspiration from this salon.</p>
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="tab-pane fade show active">
                <div className="row">
                  <div className="col-lg-4 mb-4">
                    <div className="card">
                      <div className="card-body text-center">
                        <div className="display-4 fw-bold text-warning mb-2">
                          {averageRating}
                        </div>
                        <div className="text-warning mb-2">
                          {'★'.repeat(Math.floor(averageRating))}
                          {averageRating % 1 !== 0 && '½'}
                          {'☆'.repeat(5 - Math.ceil(averageRating))}
                        </div>
                        <p className="text-muted">Based on {reviews.length} reviews</p>
                        
                        {/* Rating Distribution */}
                        <div className="mt-4">
                          {[5, 4, 3, 2, 1].map(rating => (
                            <div key={rating} className="row align-items-center mb-2">
                              <div className="col-2">
                                <small className="text-muted">{rating} ★</small>
                              </div>
                              <div className="col-8">
                                <div className="progress" style={{height: '8px'}}>
                                  <div 
                                    className="progress-bar bg-warning" 
                                    style={{
                                      width: `${reviews.length > 0 ? (ratingDistribution[rating] / reviews.length) * 100 : 0}%`
                                    }}
                                  ></div>
                                </div>
                              </div>
                              <div className="col-2">
                                <small className="text-muted">{ratingDistribution[rating]}</small>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {isAuthenticated && user?.role === 'customer' && (
                      <div className="card mt-4">
                        <div className="card-body text-center">
                          <button 
                            className="btn btn-primary w-100"
                            onClick={() => setShowReviewModal(true)}
                          >
                            <i className="bi bi-pencil me-2"></i>
                            Write a Review
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="col-lg-8">
                    <div className="card">
                      <div className="card-header bg-white">
                        <h5 className="mb-0">Customer Reviews</h5>
                      </div>
                      <div className="card-body">
                        {reviews.length > 0 ? (
                          <div className="reviews-list">
                            {reviews.map(review => (
                              <div key={review._id} className="border-bottom pb-3 mb-3">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                  <div>
                                    <strong>{review.customer?.name}</strong>
                                    <div className="text-warning small">
                                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                    </div>
                                  </div>
                                  <small className="text-muted">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                  </small>
                                </div>
                                <p className="mb-0">{review.comment}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <i className="bi bi-star display-1 text-muted"></i>
                            <h5 className="text-muted mt-3">No reviews yet</h5>
                            <p className="text-muted">Be the first to review this salon!</p>
                            {isAuthenticated && user?.role === 'customer' && (
                              <button 
                                className="btn btn-primary"
                                onClick={() => setShowReviewModal(true)}
                              >
                                Write First Review
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Information Tab */}
            {activeTab === 'info' && (
              <div className="tab-pane fade show active">
                <div className="row">
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-header bg-white">
                        <h5 className="mb-0">
                          <i className="bi bi-info-circle text-primary me-2"></i>
                          Contact Information
                        </h5>
                      </div>
                      <div className="card-body">
                        <div className="mb-3">
                          <strong>Salon Name:</strong>
                          <p className="mb-0">{shop.name}</p>
                        </div>
                        <div className="mb-3">
                          <strong>Location:</strong>
                          <p className="mb-0">{shop.location}</p>
                        </div>
                        <div className="mb-3">
                          <strong>Owner:</strong>
                          <p className="mb-0">{shop.owner?.name}</p>
                        </div>
                        <div className="mb-3">
                          <strong>Email:</strong>
                          <p className="mb-0">{shop.owner?.email}</p>
                        </div>
                        {shop.owner?.phone && (
                          <div className="mb-3">
                            <strong>Phone:</strong>
                            <p className="mb-0">{shop.owner.phone}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-header bg-white">
                        <h5 className="mb-0">
                          <i className="bi bi-clock text-primary me-2"></i>
                          Business Hours
                        </h5>
                      </div>
                      <div className="card-body">
                        <div className="mb-2">
                          <strong>Monday - Friday:</strong>
                          <p className="mb-0">8:00 AM - 8:00 PM</p>
                        </div>
                        <div className="mb-2">
                          <strong>Saturday:</strong>
                          <p className="mb-0">9:00 AM - 6:00 PM</p>
                        </div>
                        <div className="mb-2">
                          <strong>Sunday:</strong>
                          <p className="mb-0">10:00 AM - 4:00 PM</p>
                        </div>
                        <div className="mt-3">
                          <small className="text-muted">
                            <i className="bi bi-info-circle me-1"></i>
                            Hours may vary on public holidays
                          </small>
                        </div>
                      </div>
                    </div>

                    <div className="card mt-4">
                      <div className="card-header bg-white">
                        <h5 className="mb-0">
                          <i className="bi bi-credit-card text-primary me-2"></i>
                          Payment Methods
                        </h5>
                      </div>
                      <div className="card-body">
                        <div className="d-flex gap-3 mb-2">
                          <i className="bi bi-phone text-success fs-4"></i>
                          <div>
                            <strong>M-Pesa</strong>
                            <p className="mb-0 small text-muted">Mobile money payments</p>
                          </div>
                        </div>
                        <div className="d-flex gap-3">
                          <i className="bi bi-cash text-success fs-4"></i>
                          <div>
                            <strong>Cash</strong>
                            <p className="mb-0 small text-muted">Pay at the salon</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Book Appointment</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowBookingModal(false)}
                ></button>
              </div>
              <form onSubmit={handleBookingSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Service</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={selectedService?.serviceName} 
                          readOnly 
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Price</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={`KSh ${selectedService?.price}`} 
                          readOnly 
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Date</label>
                        <input 
                          type="date" 
                          className="form-control" 
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          required 
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Time</label>
                        <input 
                          type="time" 
                          className="form-control" 
                          value={bookingTime}
                          onChange={(e) => setBookingTime(e.target.value)}
                          required 
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Payment Method Selection */}
                  <div className="mb-3">
                    <label className="form-label">Payment Method</label>
                    <div className="form-check mb-2">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="paymentMethod" 
                        id="mpesa" 
                        value="mpesa" 
                        defaultChecked 
                      />
                      <label className="form-check-label" htmlFor="mpesa">
                        <i className="bi bi-phone text-success me-2"></i>
                        M-Pesa Mobile Money
                      </label>
                    </div>
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="paymentMethod" 
                        id="cash" 
                        value="cash" 
                      />
                      <label className="form-check-label" htmlFor="cash">
                        <i className="bi bi-cash text-success me-2"></i>
                        Pay at Salon
                      </label>
                    </div>
                  </div>
                  
                  <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    {document.querySelector('input[name="paymentMethod"]:checked')?.value === 'mpesa' 
                      ? 'You will receive an M-Pesa prompt on your phone after booking confirmation.'
                      : 'You can pay for your service when you visit the salon.'
                    }
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowBookingModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={processingPayment}
                  >
                    {processingPayment ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-calendar-check me-2"></i>
                        Confirm Booking
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Write a Review</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowReviewModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmitReview}>
                <div className="modal-body">
                  <div className="mb-4 text-center">
                    <label className="form-label d-block mb-3">How would you rate your experience?</label>
                    <div className="rating-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={`btn btn-link p-0 me-2 ${star <= reviewRating ? 'text-warning' : 'text-muted'}`}
                          onClick={() => setReviewRating(star)}
                          style={{ fontSize: '2rem', border: 'none', background: 'none' }}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <small className="text-muted">
                      {reviewRating === 5 && 'Excellent'}
                      {reviewRating === 4 && 'Very Good'}
                      {reviewRating === 3 && 'Good'}
                      {reviewRating === 2 && 'Fair'}
                      {reviewRating === 1 && 'Poor'}
                    </small>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Your Review</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Share your experience with this salon..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      required
                    ></textarea>
                    <div className="form-text">
                      Your review will help other customers make better decisions.
                    </div>
                  </div>
                  
                  <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    Your review will be publicly visible on the salon's profile.
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowReviewModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={submittingReview}
                  >
                    {submittingReview ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send me-2"></i>
                        Submit Review
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopDetails;