import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const BACKEND_URL = "https://hair-salon-app-1.onrender.com";

const ShopList = () => {
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [error, setError] = useState("");
  const [selectedShop, setSelectedShop] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const allServices = [
    "Haircut", "Hair Coloring", "Hair Styling", "Braiding", "Weaves", 
    "Hair Treatment", "Makeup", "Facial", "Manicure", "Pedicure",
    "Massage", "Waxing", "Skincare", "Barbering", "Dreadlocks"
  ];

  const locations = [...new Set(shops.map(shop => shop.location).filter(Boolean))].sort();

  useEffect(() => {
    fetchShops();
  }, []);

  useEffect(() => {
    filterAndSortShops();
  }, [shops, searchTerm, selectedLocation, selectedService, sortBy]);

  const fetchShops = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${BACKEND_URL}/shop`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch shops: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Fetched shops:", data);
      setShops(data);
      setFilteredShops(data);
    } catch (error) {
      console.error("Error fetching shops:", error);
      setError("Failed to load shops. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (image) => {
    if (!image) return null;
    
    if (typeof image === 'object' && image.url && image.url.startsWith('http')) {
      return image.url;
    }
    
    if (typeof image === 'object' && image.secure_url && image.secure_url.startsWith('http')) {
      return image.secure_url;
    }
    
    if (typeof image === 'object' && image.public_id && !image.url) {
      return `https://res.cloudinary.com/denczbmin/image/upload/w_800,h_600,c_fill/${image.public_id}`;
    }
    
    if (typeof image === 'string' && image.includes('cloudinary.com')) {
      return image;
    }
    
    if (typeof image === 'string' && image.startsWith('/uploads/')) {
      console.warn("Local file path detected - this won't work:", image);
      return null;
    }
    
    if (typeof image === 'string' && image.startsWith('http')) {
      return image;
    }
    
    if (typeof image === 'object' && Object.keys(image).length === 0) {
      return null;
    }
    
    return null;
  };

  const filterAndSortShops = () => {
    let filtered = [...shops];

    if (searchTerm) {
      filtered = filtered.filter(shop =>
        shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.services?.some(service => 
          service.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (selectedLocation) {
      filtered = filtered.filter(shop =>
        shop.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    if (selectedService) {
      filtered = filtered.filter(shop =>
        shop.services?.some(service =>
          service.serviceName.toLowerCase().includes(selectedService.toLowerCase())
        )
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "location":
          return a.location.localeCompare(b.location);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "services":
          return (b.services?.length || 0) - (a.services?.length || 0);
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    setFilteredShops(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedLocation("");
    setSelectedService("");
    setSortBy("name");
  };

  const getShopStats = (shop) => {
    const serviceCount = shop.services?.length || 0;
    const priceRange = shop.services?.length 
      ? {
          min: Math.min(...shop.services.map(s => s.price)),
          max: Math.max(...shop.services.map(s => s.price))
        }
      : { min: 0, max: 0 };

    return { serviceCount, priceRange };
  };

  const getShopRating = (shop) => {
    if (!shop.rating || shop.rating === 0) return "New";
    return `${shop.rating.toFixed(1)} ★`;
  };

  const handleBookNow = (shop) => {
    if (!isAuthenticated) {
      const confirmLogin = window.confirm(
        "You need to log in to book services. Would you like to login now?"
      );
      if (confirmLogin) {
        navigate("/login", { 
          state: { from: "/booking", shopId: shop._id } 
        });
      }
      return;
    }

    navigate("/booking", { 
      state: { shopId: shop._id } 
    });
  };

  const handleShopSelect = (shop) => {
    setSelectedShop(shop);
  };

  const handleBackToList = () => {
    setSelectedShop(null);
  };

  // Mobile-optimized shop card
  const ShopCard = ({ shop }) => {
    const imageUrl = getImageUrl(shop.image);
    const stats = getShopStats(shop);
    
    return (
      <div 
        className="card h-100 shadow-sm border-0"
        style={{ borderRadius: '12px', overflow: 'hidden' }}
        onClick={() => handleShopSelect(shop)}
      >
        {/* Shop Image - Full width on mobile */}
        <div className="position-relative" style={{ height: '180px', overflow: 'hidden' }}>
          {imageUrl ? (
            <img 
              src={imageUrl}
              alt={shop.name}
              className="w-100 h-100"
              style={{ objectFit: 'cover' }}
              onError={(e) => {
                e.target.style.display = 'none';
                const fallback = e.target.nextElementSibling;
                if (fallback) fallback.classList.remove('d-none');
              }}
            />
          ) : null}
          
          {/* Fallback when no image */}
          <div 
            className={`w-100 h-100 bg-gradient-primary d-flex align-items-center justify-content-center ${
              imageUrl ? 'd-none position-absolute top-0 start-0' : ''
            }`}
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            <div className="text-center text-white">
              <i className="bi bi-shop display-6 mb-2"></i>
              <p className="mb-0 fw-bold">{shop.name}</p>
            </div>
          </div>

          {/* Rating Badge */}
          <div className="position-absolute top-0 end-0 m-2">
            <span className="badge bg-success bg-opacity-90 text-white">
              <i className="bi bi-star-fill me-1"></i>
              {getShopRating(shop)}
            </span>
          </div>
        </div>

        {/* Shop Info */}
        <div className="card-body p-3">
          <h6 className="card-title text-primary mb-1 fw-bold">{shop.name}</h6>
          
          <div className="mb-2">
            <i className="bi bi-geo-alt text-muted me-1"></i>
            <small className="text-muted">{shop.location}</small>
          </div>
          
          {/* Services Count & Price Range */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <small className="text-muted">
              <i className="bi bi-scissors me-1"></i>
              {stats.serviceCount} services
            </small>
            {stats.serviceCount > 0 && (
              <small className="text-success fw-bold">
                KSh {stats.priceRange.min.toLocaleString()}+
              </small>
            )}
          </div>

          {/* Quick Action Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleBookNow(shop);
            }}
            className="btn btn-primary btn-sm w-100"
          >
            <i className="bi bi-calendar-check me-2"></i>
            Book Now
          </button>
        </div>
      </div>
    );
  };

  // Shop Detail View for when a shop is selected
  const ShopDetailView = ({ shop }) => {
    const imageUrl = getImageUrl(shop.image);
    const stats = getShopStats(shop);
    const popularServices = shop.services?.slice(0, 5) || [];

    return (
      <div className="container-fluid p-0 bg-white min-vh-100">
        {/* Back Button */}
        <div className="sticky-top bg-white shadow-sm p-3">
          <button 
            onClick={handleBackToList}
            className="btn btn-outline-secondary btn-sm"
          >
            <i className="bi bi-arrow-left me-2"></i>
            Back to Salons
          </button>
        </div>

        {/* Shop Header with Image */}
        <div className="position-relative">
          <div style={{ height: '250px', overflow: 'hidden' }}>
            {imageUrl ? (
              <img 
                src={imageUrl}
                alt={shop.name}
                className="w-100 h-100"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div 
                className="w-100 h-100 d-flex align-items-center justify-content-center"
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                <div className="text-center text-white">
                  <i className="bi bi-shop display-1 mb-3"></i>
                  <h4 className="fw-bold">{shop.name}</h4>
                </div>
              </div>
            )}
          </div>
          
          {/* Overlay Info */}
          <div className="position-absolute bottom-0 start-0 end-0 p-3 text-white"
            style={{ 
              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))'
            }}
          >
            <h4 className="fw-bold mb-1">{shop.name}</h4>
            <div className="d-flex align-items-center">
              <i className="bi bi-geo-alt me-2"></i>
              <span>{shop.location}</span>
              <span className="badge bg-success ms-3">
                <i className="bi bi-star-fill me-1"></i>
                {getShopRating(shop)}
              </span>
            </div>
          </div>
        </div>

        {/* Shop Details */}
        <div className="p-3">
          {/* Description */}
          {shop.description && (
            <div className="mb-4">
              <h6 className="fw-bold text-primary mb-2">About</h6>
              <p className="text-muted mb-0">{shop.description}</p>
            </div>
          )}

          {/* Services */}
          <div className="mb-4">
            <h6 className="fw-bold text-primary mb-3">
              <i className="bi bi-scissors me-2"></i>
              Services ({stats.serviceCount})
            </h6>
            <div className="space-y-2">
              {popularServices.map((service, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center p-2 border rounded">
                  <span className="text-dark">{service.serviceName}</span>
                  <span className="text-success fw-bold">
                    KSh {service.price.toLocaleString()}
                  </span>
                </div>
              ))}
              {stats.serviceCount > 5 && (
                <small className="text-primary text-center d-block mt-2">
                  +{stats.serviceCount - 5} more services available
                </small>
              )}
            </div>
          </div>

          {/* Price Range */}
          {stats.serviceCount > 0 && (
            <div className="mb-4 p-3 bg-light rounded">
              <h6 className="fw-bold text-primary mb-2">Price Range</h6>
              <p className="mb-0 text-dark">
                KSh {stats.priceRange.min.toLocaleString()} - KSh {stats.priceRange.max.toLocaleString()}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="d-grid gap-2 mt-4">
            <button
              onClick={() => handleBookNow(shop)}
              className="btn btn-primary btn-lg py-3"
            >
              <i className="bi bi-calendar-check me-2"></i>
              Book Appointment
            </button>
            
            <Link
              to={`/shops/${shop._id}`}
              className="btn btn-outline-primary py-3"
            >
              <i className="bi bi-eye me-2"></i>
              View Full Details
            </Link>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container-fluid py-5 bg-light">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Discovering amazing salons...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-5 bg-light">
        <div className="container">
          <div className="text-center py-5">
            <div className="alert alert-danger">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </div>
            <button 
              className="btn btn-primary mt-3"
              onClick={fetchShops}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If a shop is selected, show the detail view
  if (selectedShop) {
    return <ShopDetailView shop={selectedShop} />;
  }

  return (
    <div className="container-fluid p-0 bg-light min-vh-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm p-3 sticky-top">
        <div className="container">
          <h1 className="h4 fw-bold text-primary mb-2">Find Your Perfect Salon</h1>
          <p className="text-muted small mb-0">
            {shops.length} verified salons available
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="container py-3">
        <div className="bg-white rounded-lg shadow-sm p-3 mb-3">
          {/* Search Bar */}
          <div className="input-group mb-3">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search salons, locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Row */}
          <div className="row g-2">
            <div className="col-6">
              <select
                className="form-select form-select-sm"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
            
            <div className="col-6">
              <select
                className="form-select form-select-sm"
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
              >
                <option value="">All Services</option>
                {allServices.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || selectedLocation || selectedService) && (
            <div className="mt-3">
              <div className="d-flex align-items-center flex-wrap gap-1">
                <small className="text-muted">Filters:</small>
                {searchTerm && (
                  <span className="badge bg-primary">
                    {searchTerm}
                    <button 
                      className="btn-close btn-close-white ms-1"
                      style={{fontSize: '0.6rem'}}
                      onClick={() => setSearchTerm("")}
                    ></button>
                  </span>
                )}
                {selectedLocation && (
                  <span className="badge bg-success">
                    {selectedLocation}
                    <button 
                      className="btn-close btn-close-white ms-1"
                      style={{fontSize: '0.6rem'}}
                      onClick={() => setSelectedLocation("")}
                    ></button>
                  </span>
                )}
                {selectedService && (
                  <span className="badge bg-warning text-dark">
                    {selectedService}
                    <button 
                      className="btn-close ms-1"
                      style={{fontSize: '0.6rem'}}
                      onClick={() => setSelectedService("")}
                    ></button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="text-muted mb-0">
            <strong>{filteredShops.length}</strong> {filteredShops.length === 1 ? 'salon' : 'salons'} found
          </h6>
          <div className="text-muted small">
            <i className="bi bi-info-circle me-1"></i>
            Tap to view details
          </div>
        </div>

        {/* Shops Grid - Mobile Optimized */}
        {filteredShops.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-lg shadow-sm">
            <i className="bi bi-search display-1 text-muted mb-3"></i>
            <h5 className="text-muted mb-3">No salons found</h5>
            <p className="text-muted mb-4">
              {searchTerm || selectedLocation || selectedService 
                ? "Try adjusting your search criteria"
                : "No salons available at the moment"
              }
            </p>
            {(searchTerm || selectedLocation || selectedService) && (
              <button 
                className="btn btn-primary"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="row g-3">
            {filteredShops.map((shop) => (
              <div key={shop._id} className="col-12">
                <ShopCard shop={shop} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopList;