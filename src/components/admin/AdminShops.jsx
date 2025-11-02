// components/admin/Shops.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminShops = () => {
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    fetchShops();
  }, []);

  useEffect(() => {
    filterShops();
  }, [shops, searchTerm, selectedStatus]);

  const fetchShops = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://hair-salon-app-1.onrender.com/shop', {
        headers: { Authorization: `Bearer ${token}` }
      });
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
        shop.owner?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter (using approved field)
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(shop => 
        selectedStatus === 'approved' ? shop.approved : !shop.approved
      );
    }

    setFilteredShops(filtered);
  };

  const toggleShopStatus = async (shopId, currentStatus) => {
    const newStatus = !currentStatus;
    const action = newStatus ? 'approve' : 'disapprove';
    
    if (!window.confirm(`Are you sure you want to ${action} this shop?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      // In a real app, you'd have an endpoint to update shop approval status
      // await axios.put(`/api/admin/shops/${shopId}`, { approved: newStatus });
      
      // For now, update locally
      setShops(shops.map(shop => 
        shop._id === shopId ? { ...shop, approved: newStatus } : shop
      ));
      
      alert(`Shop ${newStatus ? 'approved' : 'disapproved'} successfully`);
    } catch (error) {
      console.error('Error updating shop status:', error);
      alert('Failed to update shop status');
    }
  };

  const deleteShop = async (shopId, shopName) => {
    if (!window.confirm(`Are you sure you want to delete shop "${shopName}"? This will also remove all associated bookings and reviews.`)) {
      return;
    }

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
      alert('Failed to delete shop');
    }
  };

  const getStatusBadge = (shop) => {
    if (shop.approved === false) {
      return <span className="badge bg-warning text-dark">Pending Approval</span>;
    }
    return <span className="badge bg-success">Approved</span>;
  };

  const getRatingStars = (rating) => {
    if (!rating || rating === 0) return 'No ratings';
    
    const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
    return (
      <span className="text-warning">
        {stars} ({rating.toFixed(1)})
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
          <p className="mt-3">Loading shops...</p>
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
              <li className="breadcrumb-item"><a href="/admin/dashboard" className="text-decoration-none">Dashboard</a></li>
              <li className="breadcrumb-item active">Shops Management</li>
            </ol>
          </nav>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold">Shops Management</h1>
              <p className="text-muted">Manage hair salons and approve new registrations</p>
            </div>
            <button className="btn btn-primary" onClick={fetchShops}>
              <i className="bi bi-arrow-clockwise me-2"></i>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Search Shops</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by name, location, or owner..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="input-group-text">
                      <i className="bi bi-search"></i>
                    </span>
                  </div>
                </div>
                
                <div className="col-md-4">
                  <label className="form-label">Filter by Status</label>
                  <select
                    className="form-select"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="all">All Shops</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending Approval</option>
                  </select>
                </div>
                
                <div className="col-md-2 d-flex align-items-end">
                  <button
                    className="btn btn-outline-secondary w-100"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedStatus('all');
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

      {/* Shops Grid */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                Shops ({filteredShops.length})
                <small className="text-muted ms-2">
                  Showing {filteredShops.length} of {shops.length} shops
                </small>
              </h5>
              <div className="text-muted">
                <i className="bi bi-download me-2"></i>
                Export
              </div>
            </div>
            <div className="card-body">
              {filteredShops.length > 0 ? (
                <div className="row g-4">
                  {filteredShops.map(shop => (
                    <div key={shop._id} className="col-md-6 col-lg-4">
                      <div className="card h-100">
                        {shop.image ? (
                          <img 
                            src={`https://hair-salon-app-1.onrender.com${shop.image}`} 
                            className="card-img-top" 
                            alt={shop.name}
                            style={{height: '200px', objectFit: 'cover'}}
                          />
                        ) : (
                          <div className="card-img-top bg-light d-flex align-items-center justify-content-center" style={{height: '200px'}}>
                            <i className="bi bi-shop display-4 text-muted"></i>
                          </div>
                        )}
                        
                        <div className="card-body d-flex flex-column">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h5 className="card-title mb-0">{shop.name}</h5>
                            {getStatusBadge(shop)}
                          </div>
                          
                          <p className="card-text text-muted small mb-2">
                            <i className="bi bi-geo-alt me-1"></i>
                            {shop.location}
                          </p>
                          
                          <p className="card-text small flex-grow-1">{shop.description}</p>
                          
                          <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-muted">
                                <i className="bi bi-person me-1"></i>
                                {shop.owner?.name}
                              </small>
                              <small className="text-warning">
                                {getRatingStars(shop.rating)}
                              </small>
                            </div>
                          </div>

                          {shop.services && shop.services.length > 0 && (
                            <div className="mb-3">
                              <h6 className="small fw-bold mb-2">Services ({shop.services.length})</h6>
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
                            <div className="d-grid gap-2">
                              <div className="d-flex gap-2">
                                <Link 
                                  to={`/shops/${shop._id}`} 
                                  className="btn btn-outline-primary btn-sm flex-fill"
                                  target="_blank"
                                >
                                  <i className="bi bi-eye me-2"></i>
                                  View
                                </Link>
                                <button
                                  className={`btn btn-sm ${shop.approved ? 'btn-warning' : 'btn-success'}`}
                                  onClick={() => toggleShopStatus(shop._id, shop.approved)}
                                >
                                  <i className={`bi ${shop.approved ? 'bi-pause' : 'bi-check'} me-1`}></i>
                                  {shop.approved ? 'Disapprove' : 'Approve'}
                                </button>
                              </div>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => deleteShop(shop._id, shop.name)}
                              >
                                <i className="bi bi-trash me-2"></i>
                                Delete Shop
                              </button>
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
                  <h4 className="text-muted mt-3">No shops found</h4>
                  <p className="text-muted">Try adjusting your search filters</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedStatus('all');
                    }}
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h6 className="card-title">Shops Statistics</h6>
              <div className="row text-center">
                <div className="col-md-3">
                  <div className="border-end">
                    <h4 className="text-primary">{shops.length}</h4>
                    <small className="text-muted">Total Shops</small>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="border-end">
                    <h4 className="text-success">{shops.filter(s => s.approved).length}</h4>
                    <small className="text-muted">Approved Shops</small>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="border-end">
                    <h4 className="text-warning">{shops.filter(s => !s.approved).length}</h4>
                    <small className="text-muted">Pending Approval</small>
                  </div>
                </div>
                <div className="col-md-3">
                  <h4 className="text-info">
                    {shops.reduce((total, shop) => total + (shop.services?.length || 0), 0)}
                  </h4>
                  <small className="text-muted">Total Services</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminShops;