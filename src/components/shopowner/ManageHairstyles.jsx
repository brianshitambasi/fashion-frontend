// components/shopowner/ManageHairstyles.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreateHairstyle from './CreateHairstyle';
import HairstyleList from './HairstyleList';

const ManageHairstyles = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [hairstyles, setHairstyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('list');

  const fetchHairstyles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://hair-salon-app-1.onrender.com/hairstyles/shop/${shopId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setHairstyles(response.data);
    } catch (error) {
      setError('Failed to fetch hairstyles');
      console.error('Error fetching hairstyles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shopId) {
      fetchHairstyles();
    }
  }, [shopId]);

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
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
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
              <li className="breadcrumb-item">
                <a href="/shopowner/shops" className="text-decoration-none">My Salons</a>
              </li>
              <li className="breadcrumb-item active">Manage Hairstyles</li>
            </ol>
          </nav>
          
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold">Manage Hairstyles</h1>
              <p className="text-muted">Add and manage hairstyles for your salon</p>
            </div>
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate('/shopowner/shops')}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back to Salons
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="row">
        <div className="col-12">
          <ul className="nav nav-tabs" id="hairstyleTabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'list' ? 'active' : ''}`}
                onClick={() => setActiveTab('list')}
              >
                <i className="bi bi-grid me-2"></i>
                View Hairstyles ({hairstyles.length})
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'create' ? 'active' : ''}`}
                onClick={() => setActiveTab('create')}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add New Hairstyle
              </button>
            </li>
          </ul>

          {/* Tab Content */}
          <div className="tab-content mt-4">
            {activeTab === 'list' && (
              <HairstyleList
                hairstyles={hairstyles}
                onDelete={handleDeleteHairstyle}
                onRefresh={fetchHairstyles}
                shopId={shopId}
              />
            )}
            
            {activeTab === 'create' && (
              <CreateHairstyle
                shopId={shopId}
                onSuccess={() => {
                  setActiveTab('list');
                  fetchHairstyles();
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageHairstyles;