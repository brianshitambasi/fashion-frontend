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
            className="card-img-top shop-image"
            onError={(e) => {
              console.error("Image failed to load:", imageUrl);
              e.target.style.display = 'none';
              const fallback = e.target.nextElementSibling;
              if (fallback) fallback.classList.remove('d-none');
            }}
          />
          <div 
            className="card-img-top bg-gradient-beauty d-flex align-items-center justify-content-center d-none"
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
          className="card-img-top bg-gradient-beauty d-flex align-items-center justify-content-center"
        >
          <div className="text-center text-white">
            <i className="bi bi-flower1 display-4 mb-2"></i>
            <p className="mb-0 small fw-bold">{shop.name}</p>
            <small>Discover beauty within</small>
          </div>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-5 bg-light min-vh-100">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border text-pink" style={{width: '3rem', height: '3rem'}}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Discovering amazing beauty salons...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-5 bg-light min-vh-100">
        <div className="container">
          <div className="text-center py-5">
            <div className="alert alert-danger border-0 shadow-sm">
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
        {/* Hero Header */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card border-0 shadow-sm bg-gradient-beauty text-white overflow-hidden">
              <div className="card-body p-5 text-center">
                <h1 className="display-4 fw-bold mb-3">
                  <i className="bi bi-flower1 me-3"></i>
                  Find Your Perfect Beauty Sanctuary
                </h1>
                <p className="lead mb-4 opacity-75">
                  Discover premium hair salons, spas, and beauty experts ready to transform your look
                </p>
                <div className="row justify-content-center">
                  <div className="col-auto">
                    <div className="bg-white bg-opacity-20 rounded-pill px-4 py-2">
                      <i className="bi bi-patch-check-fill me-2"></i>
                      <span className="fw-semibold">{shops.length} Verified Beauty Salons</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="row g-3">
                  {/* Search */}
                  <div className="col-lg-4">
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-white border-end-0">
                        <i className="bi bi-search text-pink"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="Search salons, locations, or beauty services..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  {/* Location Filter */}
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
                  
                  {/* Service Filter */}
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

                  {/* Sort By */}
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

                  {/* Clear Filters */}
                  <div className="col-lg-2">
                    <button
                      className="btn btn-outline-pink btn-lg w-100"
                      onClick={clearFilters}
                      title="Clear all filters"
                    >
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Reset
                    </button>
                  </div>
                </div>

                {/* Active Filters */}
                {(searchTerm || selectedLocation || selectedService) && (
                  <div className="mt-3">
                    <div className="d-flex align-items-center flex-wrap gap-2">
                      <small className="text-muted">Active filters:</small>
                      {searchTerm && (
                        <span className="badge bg-pink">
                          Search: {searchTerm}
                          <button 
                            className="btn-close btn-close-white ms-1"
                            style={{fontSize: '0.6rem'}}
                            onClick={() => setSearchTerm("")}
                          ></button>
                        </span>
                      )}
                      {selectedLocation && (
                        <span className="badge bg-primary">
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
        </div>

        {/* Results Summary */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="text-dark mb-0">
                <strong>{filteredShops.length}</strong> {filteredShops.length === 1 ? 'beauty salon' : 'beauty salons'} found
                {(searchTerm || selectedLocation || selectedService) && " matching your criteria"}
              </h5>
              <div className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                Click "Book Now" to schedule your beauty transformation
              </div>
            </div>
          </div>
        </div>

        {/* Shops Grid */}
        {filteredShops.length === 0 ? (
          <div className="row">
            <div className="col-12">
              <div className="card border-0 shadow-sm text-center">
                <div className="card-body py-5">
                  <i className="bi bi-search display-1 text-muted mb-3"></i>
                  <h3 className="text-dark mb-3">No beauty salons found</h3>
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
                      Show All Beauty Salons
                    </button>
                  )}
                </div>
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
                  <div className="card h-100 border-0 shadow-sm shop-card">
                    {/* Shop Image */}
                    <div className="position-relative overflow-hidden">
                      {renderShopImage(shop)}
                      
                      {/* Rating Badge */}
                      <div className="position-absolute top-0 end-0 m-3">
                        <span className="badge bg-success bg-opacity-90 text-white">
                          <i className="bi bi-star-fill me-1"></i>
                          {getShopRating(shop)}
                        </span>
                      </div>

                      {/* Service Count Badge */}
                      <div className="position-absolute top-0 start-0 m-3">
                        <span className="badge bg-primary bg-opacity-90 text-white">
                          <i className="bi bi-scissors me-1"></i>
                          {stats.serviceCount} services
                        </span>
                      </div>
                    </div>

                    {/* Shop Info */}
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title text-dark mb-2 fw-bold">{shop.name}</h5>
                      
                      <div className="mb-3">
                        <i className="bi bi-geo-alt text-pink me-2"></i>
                        <span className="text-muted">{shop.location}</span>
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
                        <h6 className="text-dark mb-2 fw-semibold">
                          <i className="bi bi-scissors me-2 text-primary"></i>
                          Popular Services
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
                              +{stats.serviceCount - 3} more beauty services
                            </small>
                          )}
                        </div>
                      </div>

                      {/* Price Range */}
                      {stats.serviceCount > 0 && (
                        <div className="mb-3">
                          <small className="text-muted">
                            <i className="bi bi-tags me-1 text-warning"></i>
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
                          className="btn btn-primary btn-lg py-2 fw-semibold"
                        >
                          <i className="bi bi-calendar2-heart me-2"></i>
                          Book Beauty Session
                        </button>
                        
                        <div className="d-flex gap-2">
                          <Link
                            to={`/shops/${shop._id}`}
                            className="btn btn-outline-primary flex-fill"
                          >
                            <i className="bi bi-eye me-2"></i>
                            View Details
                          </Link>
                          
                          <button
                            className="btn btn-outline-pink"
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
                          <i className="bi bi-clock me-1 text-success"></i>
                          Open Today
                        </span>
                        <span>
                          <i className="bi bi-telephone me-1 text-primary"></i>
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

        {/* Call to Action Section */}
        {filteredShops.length > 0 && (
          <div className="row mt-5">
            <div className="col-12">
              <div className="card border-0 shadow-sm bg-gradient-primary text-white">
                <div className="card-body text-center p-5">
                  <h3 className="h2 fw-bold mb-3">Ready for Your Beauty Transformation?</h3>
                  <p className="mb-4 opacity-75 lead">
                    Book your preferred salon today and experience premium beauty services
                  </p>
                  <div className="d-flex justify-content-center gap-3 flex-wrap">
                    <button 
                      className="btn btn-light btn-lg"
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                      <i className="bi bi-arrow-up me-2"></i>
                      Back to Top
                    </button>
                    <Link to="/contact" className="btn btn-outline-light btn-lg">
                      <i className="bi bi-headset me-2"></i>
                      Need Beauty Advice?
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Beauty Stats Bar */}
      <div className="container-fluid bg-dark text-white mt-5">
        <div className="container py-4">
          <div className="row text-center">
            <div className="col-md-3 col-6 mb-3 mb-md-0">
              <div className="h2 fw-bold text-warning">{shops.length}</div>
              <div className="small">Premium Salons</div>
            </div>
            <div className="col-md-3 col-6 mb-3 mb-md-0">
              <div className="h2 fw-bold text-info">
                {shops.reduce((acc, shop) => acc + (shop.services?.length || 0), 0)}
              </div>
              <div className="small">Beauty Services</div>
            </div>
            <div className="col-md-3 col-6">
              <div className="h2 fw-bold text-success">24/7</div>
              <div className="small">Booking Support</div>
            </div>
            <div className="col-md-3 col-6">
              <div className="h2 fw-bold text-pink">100%</div>
              <div className="small">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

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
        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .text-pink {
          color: #e83e8c !important;
        }
        .bg-pink {
          background-color: #e83e8c !important;
        }
        .btn-outline-pink {
          color: #e83e8c;
          border-color: #e83e8c;
        }
        .btn-outline-pink:hover {
          background-color: #e83e8c;
          border-color: #e83e8c;
          color: white;
        }
        .shop-card {
          transition: all 0.3s ease;
        }
        .shop-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
        .shop-image {
          height: 250px;
          object-fit: cover;
        }
        .min-vh-100 {
          min-height: 100vh;
        }
        .spinner-border.text-pink {
          color: #e83e8c !important;
        }
      `}</style>
    </div>
  );
};

export default ShopList;