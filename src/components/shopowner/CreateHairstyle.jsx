// components/shopowner/CreateHairstyle.js
import React, { useState } from 'react';
import axios from 'axios';

const CreateHairstyle = ({ shopId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    gender: 'unisex',
    imageUrl: '',
    tags: []
  });
  const [currentTag, setCurrentTag] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Hairstyle name is required');
      return false;
    }
    if (!formData.imageUrl.trim()) {
      setError('Image URL is required');
      return false;
    }
    // Basic URL validation
    try {
      new URL(formData.imageUrl);
    } catch {
      setError('Please enter a valid image URL');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const submitData = {
        ...formData,
        shop: shopId
      };

      const response = await axios.post(
        'https://hair-salon-app-1.onrender.com/hairstyles',
        submitData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      alert('Hairstyle created successfully!');
      setFormData({
        name: '',
        gender: 'unisex',
        imageUrl: '',
        tags: []
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating hairstyle:', error);
      setError(error.response?.data?.message || 'Failed to create hairstyle. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-success text-white">
        <h5 className="mb-0">
          <i className="bi bi-scissors me-2"></i>
          Add New Hairstyle
        </h5>
      </div>
      <div className="card-body p-4">
        {error && (
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="form-label">Hairstyle Name *</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="e.g., Afro Fade, Bob Cut, Braids"
              />
            </div>
            
            <div className="col-md-6">
              <label className="form-label">Gender *</label>
              <select
                className="form-select"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>
          </div>

          {/* Image URL */}
          <div className="mb-4">
            <label className="form-label">Image URL *</label>
            <input
              type="url"
              className="form-control"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              required
              placeholder="https://example.com/image.jpg"
            />
            <div className="form-text">
              Enter a direct URL to a high-quality image of the hairstyle
            </div>
            
            {formData.imageUrl && (
              <div className="mt-3">
                <label className="form-label">Image Preview</label>
                <div className="border rounded p-3 text-center">
                  <img 
                    src={formData.imageUrl} 
                    alt="Preview" 
                    className="img-fluid rounded"
                    style={{maxHeight: '200px'}}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="mb-4">
            <label className="form-label">Tags</label>
            <div className="input-group mb-2">
              <input
                type="text"
                className="form-control"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={handleTagKeyPress}
                placeholder="e.g., braids, short, formal, casual"
              />
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={handleAddTag}
              >
                <i className="bi bi-plus"></i>
              </button>
            </div>
            <div className="form-text">
              Add tags to help customers find this hairstyle. Press Enter or click + to add.
            </div>
            
            {formData.tags.length > 0 && (
              <div className="mt-2">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="badge bg-primary me-2 mb-2">
                    {tag}
                    <button
                      type="button"
                      className="btn-close btn-close-white ms-1"
                      style={{fontSize: '0.7rem'}}
                      onClick={() => handleRemoveTag(tag)}
                    ></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="d-flex gap-3 justify-content-end border-top pt-4">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => onSuccess && onSuccess()}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className="btn btn-success"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Creating...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  Create Hairstyle
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHairstyle;