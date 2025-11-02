// components/public/ShopList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ShopList = () => {
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [selectedService, setSelectedService] = useState('');

  useEffect(() => {
    fetchShops();
  }, []);

  useEffect(() => {
    filterShops();
  }, [shops, searchTerm, selectedLocation, minRating, selectedService]);

  const fetchShops = async () => {
    try {
      const response = await axios.get('https://hair-salon-app-1.onrender.com/shop');
      setShops(response.data);
    } catch (error) {
      console.error('Error fetching shops:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterShops = () => {
    let filtered = shops;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(shop =>
        shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Location filter
    if (selectedLocation) {
      filtered = filtered.filter(shop =>
        shop.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter(shop => shop.rating >= minRating);
    }

    // Service filter
    if (selectedService) {
      filtered = filtered.filter(shop =>
        shop.services?.some(service =>
          service.serviceName.toLowerCase().includes(selectedService.toLowerCase())
        )
      );
    }

    setFilteredShops(filtered);
  };

  const getUniqueServices = () => {
    const allServices = shops.flatMap(shop => 
      shop.services?.map(service => service.serviceName) || []
    );
    return [...new Set(allServices)];
  };

  const locations = [...new Set(shops.map(shop => shop.location))];

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading salons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Home</Link></li>
              <li className="breadcrumb-item active">Salons</li>
            </ol>
          </nav>
          <h1 className="fw-bold">Hair Salons in Nairobi</h1>
          <p className="text-muted">Discover the best hair salons near you</p>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">Search Salons</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by name, location, or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="input-group-text">
                      <i className="bi bi-search"></i>
                    </span>
                  </div>
                </div>
                
                <div className="col-md-2">
                  <label className="form-label">Location</label>
                  <select
                    className="form-select"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    <option value="">All Areas</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-md-2">
                  <label className="form-label">Min Rating</label>
                  <select
                    className="form-select"
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                  >
                    <option value={0}>Any Rating</option>
                    <option value={4}>4+ Stars</option>
                    <option value={3}>3+ Stars</option>
                    <option value={2}>2+ Stars</option>
                    <option value={1}>1+ Star</option>
                  </select>
                </div>
                
                <div className="col-md-3">
                  <label className="form-label">Service Type</label>
                  <select
                    className="form-select"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                  >
                    <option value="">All Services</option>
                    {getUniqueServices().map(service => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-md-2 d-flex align-items-end">
                  <button
                    className="btn btn-outline-secondary w-100"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedLocation('');
                      setMinRating(0);
                      setSelectedService('');
                    }}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="row mb-3">
        <div className="col">
          <p className="text-muted">
            Showing {filteredShops.length} of {shops.length} salons
            {selectedLocation && ` in ${selectedLocation}`}
            {minRating > 0 && ` with ${minRating}+ stars`}
            {selectedService && ` offering ${selectedService}`}
          </p>
        </div>
      </div>

      {/* Shops Grid */}
      <div className="row g-4">
        {filteredShops.map(shop => (
          <div key={shop._id} className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm shop-card">
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
                    <h6 className="small fw-bold mb-2">Popular Services:</h6>
                    <div className="d-flex flex-wrap gap-1">
                      {shop.services.slice(0, 3).map((service, index) => (
                        <span key={index} className="badge bg-light text-dark small">
                          {service.serviceName}
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
                  <div className="d-grid">
                    <Link 
                      to={`/shops/${shop._id}`} 
                      className="btn btn-primary"
                    >
                      <i className="bi bi-eye me-2"></i>
                      View Details & Book
                    </Link>
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
                    <div className="fw-bold text-warning">
                      {shop.rating > 0 ? `${shop.rating.toFixed(1)} ★` : 'No ratings'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredShops.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-search display-1 text-muted"></i>
          <h4 className="text-muted mt-3">No salons found</h4>
          <p className="text-muted">Try adjusting your search filters</p>
          <button
            className="btn btn-primary"
            onClick={() => {
              setSearchTerm('');
              setSelectedLocation('');
              setMinRating(0);
              setSelectedService('');
            }}
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ShopList;