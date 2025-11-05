// components/public/ShopList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ShopList = () => {
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    fetchShops();
  }, []);

  useEffect(() => {
    filterShops();
  }, [shops, searchTerm, locationFilter, minRating]);

  const fetchShops = async () => {
    try {
      const response = await axios.get('https://hair-salon-app-1.onrender.com/shops');
      setShops(response.data);
    } catch (error) {
      console.error('Error fetching shops:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterShops = () => {
    let filtered = shops;

    // Search by name or service
    if (searchTerm) {
      filtered = filtered.filter(shop =>
        shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.services?.some(service => 
          service.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by location
    if (locationFilter) {
      filtered = filtered.filter(shop =>
        shop.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Filter by minimum rating
    if (minRating > 0) {
      filtered = filtered.filter(shop => shop.rating >= minRating);
    }

    setFilteredShops(filtered);
  };

  const getUniqueLocations = () => {
    const locations = shops.map(shop => shop.location);
    return [...new Set(locations)];
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
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <h1 className="fw-bold">Find the Perfect Salon</h1>
          <p className="text-muted">Discover top-rated hair salons in Nairobi</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Search Salons & Services</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by salon name or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Location</label>
              <select
                className="form-select"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option value="">All Locations</option>
                {getUniqueLocations().map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Minimum Rating</label>
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
            <div className="col-md-2">
              <label className="form-label">&nbsp;</label>
              <div>
                <span className="badge bg-primary">
                  {filteredShops.length} {filteredShops.length === 1 ? 'Salon' : 'Salons'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shops Grid */}
      {filteredShops.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <i className="bi bi-search display-1 text-muted"></i>
            <h3 className="text-muted mt-3">No Salons Found</h3>
            <p className="text-muted">Try adjusting your search criteria</p>
            <button 
              className="btn btn-primary"
              onClick={() => {
                setSearchTerm('');
                setLocationFilter('');
                setMinRating(0);
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {filteredShops.map(shop => (
            <div key={shop._id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="position-relative">
                  <img
                    src={shop.image || 'https://via.placeholder.com/300x200?text=Salon+Image'}
                    className="card-img-top"
                    alt={shop.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="position-absolute top-0 end-0 m-2">
                    <span className="badge bg-success">
                      <i className="bi bi-star-fill me-1"></i>
                      {shop.rating || 'New'}
                    </span>
                  </div>
                </div>
                
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{shop.name}</h5>
                  <p className="card-text text-muted">
                    <i className="bi bi-geo-alt me-1"></i>
                    {shop.location}
                  </p>
                  
                  <div className="mb-3">
                    <h6 className="small fw-bold">Popular Services:</h6>
                    {shop.services?.slice(0, 3).map((service, index) => (
                      <span key={index} className="badge bg-light text-dark me-1 mb-1">
                        {service.serviceName} - KSh {service.price}
                      </span>
                    ))}
                    {shop.services?.length > 3 && (
                      <span className="badge bg-light text-dark">
                        +{shop.services.length - 3} more
                      </span>
                    )}
                  </div>

                  <p className="card-text small text-muted flex-grow-1">
                    {shop.description?.substring(0, 100)}...
                  </p>
                  
                  <div className="mt-auto">
                    <Link 
                      to={`/shops/${shop._id}`} 
                      className="btn btn-primary w-100"
                    >
                      <i className="bi bi-eye me-2"></i>
                      View Salon & Book
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopList;