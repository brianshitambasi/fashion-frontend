// components/shopowner/ShopOwnerHairstyles.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ShopOwnerHairstyles = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hairstyles, setHairstyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('list');

  // Fetch hairstyles for the shop owner
  const fetchHairstyles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // First, get the shop owner's shops
      const shopsResponse = await axios.get(
        'https://hair-salon-app-1.onrender.com/shopowner/shops',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (shopsResponse.data.length === 0) {
        setError('You need to create a shop first to manage hairstyles');
        setLoading(false);
        return;
      }

      // Get hairstyles for all shops
      const allHairstyles = [];
      for (const shop of shopsResponse.data) {
        try {
          const hairstylesResponse = await axios.get(
            `https://hair-salon-app-1.onrender.com/hairstyles/shop/${shop._id}`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          allHairstyles.push(...hairstylesResponse.data.map(h => ({ ...h, shopName: shop.name })));
        } catch (error) {
          console.log(`No hairstyles found for shop ${shop.name}`);
        }
      }

      setHairstyles(allHairstyles);
    } catch (error) {
      console.error('Error fetching hairstyles:', error);
      setError('Failed to load hairstyles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHairstyles();
  }, []);

  const handleDeleteHairstyle = async (hairstyleId) => {
    if (window.confirm('Are you sure you want to delete this hairstyle?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(
          `https://hair-salon-app-1.onrender.com/hairstyles/${hairstyleId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        alert('Hairstyle deleted successfully!');
        fetchHairstyles(); // Refresh the list
      } catch (error) {
        alert('Failed to delete hairstyle');
        console.error('Error deleting hairstyle:', error);
      }
    }
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
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/shopowner/dashboard" className="text-decoration-none">Dashboard</a>
              </li>
              <li className="breadcrumb-item active">Hairstyles</li>
            </ol>
          </nav>
          
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold">Manage Hairstyles</h1>
              <p className="text-muted">Showcase your hairstyles to attract more customers</p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/shopowner/shops')}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Add New Hairstyle
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="fw-bold">{hairstyles.length}</h4>
                  <p className="mb-0">Total Hairstyles</p>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-scissors display-6"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="fw-bold">
                    {hairstyles.filter(h => h.gender === 'female').length}
                  </h4>
                  <p className="mb-0">Female Styles</p>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-gender-female display-6"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="fw-bold">
                    {hairstyles.filter(h => h.gender === 'male').length}
                  </h4>
                  <p className="mb-0">Male Styles</p>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-gender-male display-6"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="fw-bold">
                    {hairstyles.filter(h => h.gender === 'unisex').length}
                  </h4>
                  <p className="mb-0">Unisex Styles</p>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-people display-6"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-warning" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {/* Content */}
      {hairstyles.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <i className="bi bi-scissors display-1 text-muted mb-3"></i>
            <h3 className="text-muted">No Hairstyles Yet</h3>
            <p className="text-muted mb-4">
              Start showcasing your work by adding hairstyles to your shops.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/shopowner/shops')}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Go to My Shops
            </button>
          </div>
        </div>
      ) : (
        <div className="row">
          {hairstyles.map((hairstyle) => (
            <div key={hairstyle._id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="position-relative">
                  <img
                    src={hairstyle.imageUrl}
                    className="card-img-top"
                    alt={hairstyle.name}
                    style={{ height: '250px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                    }}
                  />
                  <span className={`position-absolute top-0 end-0 m-2 badge ${
                    hairstyle.gender === 'male' ? 'bg-info' : 
                    hairstyle.gender === 'female' ? 'bg-pink' : 'bg-secondary'
                  }`}>
                    {hairstyle.gender}
                  </span>
                </div>
                
                <div className="card-body">
                  <h5 className="card-title">{hairstyle.name}</h5>
                  <p className="card-text text-muted small">
                    <i className="bi bi-shop me-1"></i>
                    {hairstyle.shopName}
                  </p>
                  
                  {hairstyle.tags && hairstyle.tags.length > 0 && (
                    <div className="mb-2">
                      {hairstyle.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="badge bg-light text-dark me-1 mb-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="card-footer">
                  <div className="btn-group w-100" role="group">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => {/* Add edit functionality */}}
                    >
                      <i className="bi bi-pencil me-1"></i>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDeleteHairstyle(hairstyle._id)}
                    >
                      <i className="bi bi-trash me-1"></i>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Help Card */}
      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">
            <i className="bi bi-lightbulb text-warning me-2"></i>
            Tips for Showcasing Hairstyles
          </h5>
          <div className="row">
            <div className="col-md-6">
              <ul className="list-unstyled">
                <li className="mb-2">
                  <i className="bi bi-check text-success me-2"></i>
                  Use high-quality, well-lit photos
                </li>
                <li className="mb-2">
                  <i className="bi bi-check text-success me-2"></i>
                  Add relevant tags for better searchability
                </li>
                <li className="mb-2">
                  <i className="bi bi-check text-success me-2"></i>
                  Show different angles of the hairstyle
                </li>
              </ul>
            </div>
            <div className="col-md-6">
              <ul className="list-unstyled">
                <li className="mb-2">
                  <i className="bi bi-check text-success me-2"></i>
                  Include both male and female styles
                </li>
                <li className="mb-2">
                  <i className="bi bi-check text-success me-2"></i>
                  Update your portfolio regularly
                </li>
                <li className="mb-2">
                  <i className="bi bi-check text-success me-2"></i>
                  Use descriptive names for hairstyles
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopOwnerHairstyles;