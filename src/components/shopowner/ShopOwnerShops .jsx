// components/shopowner/MyShops.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ShopOwnerShops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://hair-salon-app-1.onrender.com/shop/getMyShops', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShops(response.data);
    } catch (error) {
      console.error('Error fetching shops:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteShop = async (shopId, shopName) => {
    if (!window.confirm(`Are you sure you want to delete "${shopName}"? This action cannot be undone and will remove all associated bookings.`)) {
      return;
    }

    setDeleteLoading(shopId);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://hair-salon-app-1.onrender.com/shop/${shopId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Remove from local state
      setShops(shops.filter(shop => shop._id !== shopId));
      alert('Shop deleted successfully');
    } catch (error) {
      console.error('Error deleting shop:', error);
      alert('Failed to delete shop. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const getRatingStars = (rating) => {
    if (!rating || rating === 0) return 'No ratings yet';
    
    const fullStars = '★'.repeat(Math.floor(rating));
    const emptyStars = '☆'.repeat(5 - Math.floor(rating));
    return (
      <span className="text-warning">
        {fullStars}{emptyStars} ({rating.toFixed(1)})
      </span>
    );
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your salons...</p>
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
              <li className="breadcrumb-item"><a href="/shopowner/dashboard" className="text-decoration-none">Dashboard</a></li>
              <li className="breadcrumb-item active">My Salons</li>
            </ol>
          </nav>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold">My Salons</h1>
              <p className="text-muted">Manage your hair salons and services</p>
            </div>
            <Link to="/shopowner/shops/create" className="btn btn-primary">
              <i className="bi bi-plus-circle me-2"></i>
              Add New Salon
            </Link>
          </div>
        </div>
      </div>

      {/* Shops Grid */}
      {shops.length > 0 ? (
        <div className="row g-4">
          {shops.map(shop => (
            <div key={shop._id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                {shop.image ? (
                  <img 
                    src={`https://hair-salon-app-1.onrender.com${shop.image}`} 
                    className="card-img-top shop-image" 
                    alt={shop.name}
                    style={{height: '200px', objectFit: 'cover'}}
                  />
                ) : (
                  <div className="card-img-top shop-image-placeholder d-flex align-items-center justify-content-center bg-light" style={{height: '200px'}}>
                    <i className="bi bi-shop display-4 text-muted"></i>
                  </div>
                )}
                
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0">{shop.name}</h5>
                    {shop.rating > 0 && (
                      <span className="badge bg-warning text-dark">
                        <i className="bi bi-star-fill me-1"></i>
                        {shop.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                  
                  <p className="card-text text-muted small mb-2">
                    <i className="bi bi-geo-alt me-1"></i>
                    {shop.location}
                  </p>
                  
                  <p className="card-text flex-grow-1 small">{shop.description}</p>
                  
                  {shop.services && shop.services.length > 0 && (
                    <div className="mb-3">
                      <h6 className="small fw-bold mb-2">Services ({shop.services.length})</h6>
                      <div className="d-flex flex-wrap gap-1">
                        {shop.services.slice(0, 3).map((service, index) => (
                          <span key={index} className="badge bg-light text-dark small">
                            {service.serviceName} - KSh {service.price}
                          </span>
                        ))}
                        {shop.services.length > 3 && (
                          <span className="badge bg-light text-dark small">
                            +{shop.services.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-auto">
                    <div className="d-grid gap-2">
                      <Link 
                        to={`/shopowner/shops/edit/${shop._id}`} 
                        className="btn btn-primary btn-sm"
                      >
                        <i className="bi bi-pencil me-2"></i>
                        Edit Salon
                      </Link>
                      <div className="d-flex gap-2">
                        <Link 
                          to={`/shops/${shop._id}`} 
                          className="btn btn-outline-primary btn-sm flex-fill"
                          target="_blank"
                        >
                          <i className="bi bi-eye me-2"></i>
                          View Public
                        </Link>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => deleteShop(shop._id, shop.name)}
                          disabled={deleteLoading === shop._id}
                        >
                          {deleteLoading === shop._id ? (
                            <span className="spinner-border spinner-border-sm" role="status"></span>
                          ) : (
                            <i className="bi bi-trash"></i>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shop Footer Stats */}
                <div className="card-footer bg-transparent">
                  <div className="row text-center small">
                    <div className="col-4">
                      <div className="fw-bold text-primary">{shop.services?.length || 0}</div>
                      <div className="text-muted">Services</div>
                    </div>
                    <div className="col-4">
                      <div className="fw-bold text-success">{shop.reviews?.length || 0}</div>
                      <div className="text-muted">Reviews</div>
                    </div>
                    <div className="col-4">
                      <div className="fw-bold text-info">
                        {getRatingStars(shop.rating)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <i className="bi bi-shop display-1 text-muted"></i>
          <h4 className="text-muted mt-3">No salons yet</h4>
          <p className="text-muted">Start by adding your first hair salon to get bookings</p>
          <Link to="/shopowner/shops/create" className="btn btn-primary btn-lg">
            <i className="bi bi-plus-circle me-2"></i>
            Add Your First Salon
          </Link>
        </div>
      )}

      {/* Statistics */}
      {shops.length > 0 && (
        <div className="row mt-5">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Salon Statistics</h5>
                <div className="row text-center">
                  <div className="col-md-3">
                    <div className="border-end">
                      <h4 className="text-primary">{shops.length}</h4>
                      <small className="text-muted">Total Salons</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="border-end">
                      <h4 className="text-success">
                        {shops.reduce((total, shop) => total + (shop.services?.length || 0), 0)}
                      </h4>
                      <small className="text-muted">Total Services</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="border-end">
                      <h4 className="text-info">
                        {shops.filter(shop => shop.rating > 0).length}
                      </h4>
                      <small className="text-muted">Rated Salons</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <h4 className="text-warning">
                      {shops.reduce((total, shop) => total + (shop.reviews?.length || 0), 0)}
                    </h4>
                    <small className="text-muted">Total Reviews</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopOwnerShops;