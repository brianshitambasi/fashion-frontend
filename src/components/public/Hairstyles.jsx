// components/public/Hairstyles.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Hairstyles = () => {
  const [hairstyles, setHairstyles] = useState([]);
  const [filteredHairstyles, setFilteredHairstyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedShop, setSelectedShop] = useState('all');
  const [shops, setShops] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterHairstyles();
  }, [hairstyles, selectedGender, selectedShop]);

  const fetchData = async () => {
    try {
      const [hairstylesRes, shopsRes] = await Promise.all([
        axios.get('https://hair-salon-app-1.onrender.com/hairstyle'),
        axios.get('https://hair-salon-app-1.onrender.com/shop')
      ]);

      setHairstyles(hairstylesRes.data);
      setShops(shopsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterHairstyles = () => {
    let filtered = hairstyles;

    if (selectedGender !== 'all') {
      filtered = filtered.filter(style => style.gender === selectedGender);
    }

    if (selectedShop !== 'all') {
      filtered = filtered.filter(style => style.shop?._id === selectedShop);
    }

    setFilteredHairstyles(filtered);
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading hairstyles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Home</Link></li>
              <li className="breadcrumb-item active">Hairstyles Gallery</li>
            </ol>
          </nav>
          <h1 className="fw-bold">Hairstyles Gallery</h1>
          <p className="text-muted">Get inspired by trending hairstyles from our top salons</p>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Filter by Gender</label>
                  <select
                    className="form-select"
                    value={selectedGender}
                    onChange={(e) => setSelectedGender(e.target.value)}
                  >
                    <option value="all">All Styles</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>
                
                <div className="col-md-4">
                  <label className="form-label">Filter by Salon</label>
                  <select
                    className="form-select"
                    value={selectedShop}
                    onChange={(e) => setSelectedShop(e.target.value)}
                  >
                    <option value="all">All Salons</option>
                    {shops.map(shop => (
                      <option key={shop._id} value={shop._id}>{shop.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-md-4 d-flex align-items-end">
                  <button
                    className="btn btn-outline-secondary w-100"
                    onClick={() => {
                      setSelectedGender('all');
                      setSelectedShop('all');
                    }}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Reset Filters
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
            Showing {filteredHairstyles.length} of {hairstyles.length} hairstyles
            {selectedGender !== 'all' && ` for ${selectedGender}`}
            {selectedShop !== 'all' && ` from ${shops.find(s => s._id === selectedShop)?.name}`}
          </p>
        </div>
      </div>

      {/* Hairstyles Grid */}
      <div className="row g-4">
        {filteredHairstyles.map(style => (
          <div key={style._id} className="col-sm-6 col-md-4 col-lg-3">
            <div className="card h-100 shadow-sm">
              {style.imageUrl ? (
                <img 
                  src={style.imageUrl} 
                  className="card-img-top" 
                  alt={style.name}
                  style={{height: '250px', objectFit: 'cover'}}
                />
              ) : (
                <div className="card-img-top bg-light d-flex align-items-center justify-content-center" style={{height: '250px'}}>
                  <i className="bi bi-image text-muted display-4"></i>
                </div>
              )}
              
              <div className="card-body d-flex flex-column">
                <h6 className="card-title mb-1">{style.name}</h6>
                <p className="card-text small text-muted mb-2 text-capitalize">
                  <i className="bi bi-gender-ambiguous me-1"></i>
                  {style.gender}
                </p>
                
                {style.shop && (
                  <div className="mb-3">
                    <p className="small mb-1">
                      <i className="bi bi-shop me-1"></i>
                      {style.shop.name}
                    </p>
                    <small className="text-muted">
                      <i className="bi bi-geo-alt me-1"></i>
                      {style.shop.location}
                    </small>
                  </div>
                )}

                {style.tags && style.tags.length > 0 && (
                  <div className="mb-3">
                    <div className="d-flex flex-wrap gap-1">
                      {style.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="badge bg-light text-dark small">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-auto">
                  {style.shop && (
                    <Link 
                      to={`/shops/${style.shop._id}`}
                      className="btn btn-primary btn-sm w-100"
                    >
                      <i className="bi bi-calendar-check me-2"></i>
                      Book at this Salon
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredHairstyles.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-scissors display-1 text-muted"></i>
          <h4 className="text-muted mt-3">No hairstyles found</h4>
          <p className="text-muted">Try adjusting your filters to see more styles</p>
          <button
            className="btn btn-primary"
            onClick={() => {
              setSelectedGender('all');
              setSelectedShop('all');
            }}
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Inspiration Section */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card bg-light border-0">
            <div className="card-body text-center py-5">
              <i className="bi bi-lightbulb display-1 text-warning mb-3"></i>
              <h3 className="fw-bold">Need Style Inspiration?</h3>
              <p className="text-muted mb-4">
                Browse our salon collection and find the perfect style for any occasion
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Link to="/shops" className="btn btn-primary btn-lg">
                  <i className="bi bi-search me-2"></i>
                  Explore Salons
                </Link>
                <button className="btn btn-outline-primary btn-lg">
                  <i className="bi bi-download me-2"></i>
                  Download Lookbook
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hairstyles;