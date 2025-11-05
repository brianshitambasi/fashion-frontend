// components/shopowner/HairstyleList.js
import React, { useState } from 'react';
import axios from 'axios';

const HairstyleList = ({ hairstyles, onDelete, onRefresh, shopId }) => {
  const [filterGender, setFilterGender] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHairstyles = hairstyles.filter(hairstyle => {
    const matchesGender = filterGender === 'all' || hairstyle.gender === filterGender;
    const matchesSearch = hairstyle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hairstyle.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesGender && matchesSearch;
  });

  const handleEdit = async (hairstyle) => {
    // You can implement edit functionality here
    const newName = prompt('Enter new hairstyle name:', hairstyle.name);
    if (newName && newName !== hairstyle.name) {
      try {
        const token = localStorage.getItem('token');
        await axios.put(
          `https://hair-salon-app-1.onrender.com/hairstyles/${hairstyle._id}`,
          { name: newName },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        alert('Hairstyle updated successfully!');
        onRefresh();
      } catch (error) {
        alert('Failed to update hairstyle');
        console.error('Error updating hairstyle:', error);
      }
    }
  };

  if (hairstyles.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <i className="bi bi-scissors display-1 text-muted"></i>
          <h4 className="mt-3 text-muted">No Hairstyles Yet</h4>
          <p className="text-muted">Get started by adding your first hairstyle to showcase your work.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-md-6">
              <label className="form-label">Search Hairstyles</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Filter by Gender</label>
              <select
                className="form-select"
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value)}
              >
                <option value="all">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">&nbsp;</label>
              <div>
                <span className="badge bg-primary">
                  {filteredHairstyles.length} of {hairstyles.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hairstyles Grid */}
      <div className="row g-4">
        {filteredHairstyles.map(hairstyle => (
          <div key={hairstyle._id} className="col-md-6 col-lg-4">
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
              
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{hairstyle.name}</h5>
                
                {hairstyle.tags.length > 0 && (
                  <div className="mb-2">
                    {hairstyle.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="badge bg-light text-dark me-1 mb-1">
                        {tag}
                      </span>
                    ))}
                    {hairstyle.tags.length > 3 && (
                      <span className="badge bg-light text-dark">
                        +{hairstyle.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
                
                <div className="mt-auto">
                  <div className="btn-group w-100" role="group">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleEdit(hairstyle)}
                    >
                      <i className="bi bi-pencil me-1"></i>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => onDelete(hairstyle._id)}
                    >
                      <i className="bi bi-trash me-1"></i>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="card-footer text-muted small">
                <div className="d-flex justify-content-between">
                  <span>Created: {new Date(hairstyle.createdAt).toLocaleDateString()}</span>
                  <span>Updated: {new Date(hairstyle.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredHairstyles.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-search display-1 text-muted"></i>
          <h4 className="mt-3 text-muted">No Hairstyles Found</h4>
          <p className="text-muted">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default HairstyleList;