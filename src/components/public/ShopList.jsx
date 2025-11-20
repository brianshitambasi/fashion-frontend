// components/public/ShopList.jsx
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

    // FIXED: Navigate to the correct booking route that exists in App.js
    navigate("/booking", { 
      state: { shopId: shop._id } 
    });
  };

  const renderShopImage = (shop) => {
    const imageUrl = getImageUrl(shop.image);
    
    if (imageUrl) {
      return (
        <>
          <img 
            src={imageUrl}
            alt={shop.name}
            className="card-img-top"
            style={{ height: '200px', objectFit: 'cover' }}
            onError={(e) => {
              console.error("Image failed to load:", imageUrl);
              e.target.style.display = 'none';
              const fallback = e.target.nextElementSibling;
              if (fallback) fallback.classList.remove('d-none');
            }}
          />
          <div 
            className="card-img-top bg-gradient-primary d-flex align-items-center justify-content-center d-none"
            style={{ height: '200px', position: 'absolute', top: 0, left: 0, right: 0 }}
          >
            <div className="text-center text-white">
              <i className="bi bi-shop display-4 mb-2"></i>
              <p className="mb-0 small fw-bold">{shop.name}</p>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <div 
          className="card-img-top bg-gradient-primary d-flex align-items-center justify-content-center"
          style={{ height: '200px' }}
        >
          <div className="text-center text-white">
            <i className="bi bi-camera display-4 mb-2"></i>
            <p className="mb-0 small fw-bold">{shop.name}</p>
            <small>Image coming soon</small>
          </div>
        </div>
      );
    }
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

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      <div className="container">
        {/* Header Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h1 className="display-5 fw-bold text-primary mb-2">Find Your Perfect Salon</h1>
                  <p className="lead text-muted mb-0">
                    Discover the best hair and beauty salons in your area
                  </p>
                </div>
                <div className="col-md-4 text-md-end">
                  <div className="text-success">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    <span className="fw-bold">{shops.length}</span> Verified Salons
                  </div>
                </div>
              </div>
              
              {/* Search and Filters */}
              <div className="row g-3 mt-4">
                <div className="col-lg-5">
                  <div className="input-group input-group-lg">
                    <span className="input-group-text bg-white border-end-0">
                      <i className="bi bi-search text-muted"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Search salons, locations, or services..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="col-lg-2">
                  <select
                    className="form-select form-select-lg"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    <option value="">All Locations</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-lg-2">
                  <select
                    className="form-select form-select-lg"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                  >
                    <option value="">All Services</option>
                    {allServices.map(service => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                </div>

                <div className="col-lg-2">
                  <select
                    className="form-select form-select-lg"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="name">Sort by Name</option>
                    <option value="location">Sort by Location</option>
                    <option value="rating">Highest Rated</option>
                    <option value="services">Most Services</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>

                <div className="col-lg-1">
                  <button
                    className="btn btn-outline-secondary btn-lg w-100"
                    onClick={clearFilters}
                    title="Clear all filters"
                  >
                    <i className="bi bi-arrow-clockwise"></i>
                  </button>
                </div>
              </div>

              {/* Active Filters */}
              {(searchTerm || selectedLocation || selectedService) && (
                <div className="mt-3">
                  <div className="d-flex align-items-center flex-wrap gap-2">
                    <small className="text-muted">Active filters:</small>
                    {searchTerm && (
                      <span className="badge bg-primary">
                        Search: {searchTerm}
                        <button 
                          className="btn-close btn-close-white ms-1"
                          style={{fontSize: '0.6rem'}}
                          onClick={() => setSearchTerm("")}
                        ></button>
                      </span>
                    )}
                    {selectedLocation && (
                      <span className="badge bg-success">
                        Location: {selectedLocation}
                        <button 
                          className="btn-close btn-close-white ms-1"
                          style={{fontSize: '0.6rem'}}
                          onClick={() => setSelectedLocation("")}
                        ></button>
                      </span>
                    )}
                    {selectedService && (
                      <span className="badge bg-warning text-dark">
                        Service: {selectedService}
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
          </div>
        </div>

        {/* Results Summary */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="text-muted mb-0">
                <strong>{filteredShops.length}</strong> {filteredShops.length === 1 ? 'salon' : 'salons'} found
                {(searchTerm || selectedLocation || selectedService) && " matching your criteria"}
              </h5>
              <div className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                Click "Book Now" to schedule your appointment
              </div>
            </div>
          </div>
        </div>

        {/* Shops Grid */}
        {filteredShops.length === 0 ? (
          <div className="row">
            <div className="col-12">
              <div className="text-center py-5 bg-white rounded-lg shadow-sm">
                <i className="bi bi-search display-1 text-muted mb-3"></i>
                <h3 className="text-muted mb-3">No salons found</h3>
                <p className="text-muted mb-4">
                  {searchTerm || selectedLocation || selectedService 
                    ? "Try adjusting your search criteria or clear filters to see all salons."
                    : "No salons are currently available. Please check back later."
                  }
                </p>
                {(searchTerm || selectedLocation || selectedService) && (
                  <button 
                    className="btn btn-primary btn-lg"
                    onClick={clearFilters}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Show All Salons
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {filteredShops.map((shop) => {
              const stats = getShopStats(shop);
              const popularServices = shop.services?.slice(0, 3) || [];
              
              return (
                <div key={shop._id} className="col-xl-4 col-lg-6 col-md-6">
                  <div className="card h-100 shadow-sm border-0 hover-shadow transition-all duration-300">
                    {/* Shop Image */}
                    <div className="position-relative">
                      {renderShopImage(shop)}
                      
                      <div className="position-absolute top-0 end-0 m-3">
                        <span className="badge bg-success bg-opacity-90 text-white">
                          <i className="bi bi-star-fill me-1"></i>
                          {getShopRating(shop)}
                        </span>
                      </div>
                    </div>

                    {/* Shop Info */}
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title text-primary mb-2">{shop.name}</h5>
                      
                      <div className="mb-2">
                        <i className="bi bi-geo-alt text-muted me-2"></i>
                        <small className="text-muted">{shop.location}</small>
                      </div>
                      
                      {shop.description && (
                        <p className="card-text text-muted small mb-3 flex-grow-1">
                          {shop.description.length > 100 
                            ? `${shop.description.substring(0, 100)}...` 
                            : shop.description
                          }
                        </p>
                      )}

                      {/* Services Preview */}
                      <div className="mb-3">
                        <h6 className="text-dark mb-2">
                          <i className="bi bi-scissors me-2"></i>
                          Services ({stats.serviceCount})
                        </h6>
                        <div className="space-y-1">
                          {popularServices.map((service, index) => (
                            <div key={index} className="d-flex justify-content-between align-items-center small">
                              <span className="text-dark">{service.serviceName}</span>
                              <span className="text-success fw-bold">
                                KSh {service.price.toLocaleString()}
                              </span>
                            </div>
                          ))}
                          {stats.serviceCount > 3 && (
                            <small className="text-primary">
                              +{stats.serviceCount - 3} more services
                            </small>
                          )}
                        </div>
                      </div>

                      {/* Price Range */}
                      {stats.serviceCount > 0 && (
                        <div className="mb-3">
                          <small className="text-muted">
                            Price range:{" "}
                            <span className="fw-bold text-dark">
                              KSh {stats.priceRange.min.toLocaleString()} - KSh {stats.priceRange.max.toLocaleString()}
                            </span>
                          </small>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="d-grid gap-2 mt-auto">
                        <button
                          onClick={() => handleBookNow(shop)}
                          className="btn btn-primary btn-lg"
                        >
                          <i className="bi bi-calendar-check me-2"></i>
                          Book Now
                        </button>
                        
                        <div className="d-flex gap-2">
                          <Link
                            to={`/shops/${shop._id}`}
                            className="btn btn-outline-secondary flex-fill"
                          >
                            <i className="bi bi-eye me-2"></i>
                            View Details
                          </Link>
                          
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => {
                              alert(`Added ${shop.name} to your favorites!`);
                            }}
                            title="Add to favorites"
                          >
                            <i className="bi bi-heart"></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="card-footer bg-transparent border-top-0 pt-0">
                      <div className="d-flex justify-content-between align-items-center text-muted small">
                        <span>
                          <i className="bi bi-clock me-1"></i>
                          Open Today
                        </span>
                        <span>
                          <i className="bi bi-telephone me-1"></i>
                          Contact Available
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More Section */}
        {filteredShops.length > 0 && (
          <div className="row mt-5">
            <div className="col-12 text-center">
              <div className="bg-white rounded-lg shadow-sm p-5">
                <h5 className="text-primary mb-3">Ready to Book Your Appointment?</h5>
                <p className="text-muted mb-4">
                  Found what you're looking for? Book your preferred salon or continue browsing our collection.
                </p>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    <i className="bi bi-arrow-up me-2"></i>
                    Back to Top
                  </button>
                  <Link to="/contact" className="btn btn-primary">
                    <i className="bi bi-headset me-2"></i>
                    Need Help?
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats Bar */}
      <div className="container-fluid bg-dark text-white mt-5">
        <div className="container py-4">
          <div className="row text-center">
            <div className="col-md-3 col-6 mb-3 mb-md-0">
              <div className="h2 fw-bold text-warning">{shops.length}</div>
              <div className="small">Verified Salons</div>
            </div>
            <div className="col-md-3 col-6 mb-3 mb-md-0">
              <div className="h2 fw-bold text-info">
                {shops.reduce((acc, shop) => acc + (shop.services?.length || 0), 0)}
              </div>
              <div className="small">Services Available</div>
            </div>
            <div className="col-md-3 col-6">
              <div className="h2 fw-bold text-success">24/7</div>
              <div className="small">Booking Support</div>
            </div>
            <div className="col-md-3 col-6">
              <div className="h2 fw-bold text-primary">100%</div>
              <div className="small">Secure Bookings</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopList;