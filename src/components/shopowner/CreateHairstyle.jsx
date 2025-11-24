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
  const [imagePreview, setImagePreview] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Update image preview when URL changes
    if (name === 'imageUrl') {
      setImagePreview(value);
    }
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
      setImagePreview('');
      
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

  const popularTags = [
    'braids', 'weaves', 'natural', 'curly', 'straight', 'bob', 
    'pixie', 'updo', 'bridal', 'formal', 'casual', 'color',
    'balayage', 'highlights', 'ombre', 'undercut', 'fade', 'layered'
  ];

  const addPopularTag = (tag) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  return (
    <div className="card border-0 shadow-lg">
      {/* Card Header */}
      <div className="card-header bg-gradient-beauty text-white py-4">
        <div className="d-flex align-items-center">
          <div className="bg-white bg-opacity-20 rounded-circle p-3 me-3">
            <i className="bi bi-scissors fs-2"></i>
          </div>
          <div>
            <h4 className="fw-bold mb-1">Create New Hairstyle</h4>
            <p className="mb-0 opacity-75">Showcase your beautiful hairstyle creations</p>
          </div>
        </div>
      </div>

      <div className="card-body p-4">
        {error && (
          <div className="alert alert-danger border-0 d-flex align-items-center mb-4" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-3 fs-5"></i>
            <div className="flex-grow-1">
              <h6 className="alert-heading mb-1">Oops! Something went wrong</h6>
              <div className="small">{error}</div>
            </div>
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setError('')}
            ></button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control border-0 bg-light"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Hairstyle Name"
                  id="hairstyleName"
                />
                <label htmlFor="hairstyleName" className="text-muted">
                  <i className="bi bi-tag me-2 text-primary"></i>
                  Hairstyle Name *
                </label>
              </div>
              <div className="form-text text-muted ms-1">
                e.g., "Goddess Braids", "Balayage Bob", "Natural Afro"
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-floating">
                <select
                  className="form-select border-0 bg-light"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                  id="hairstyleGender"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="unisex">Unisex</option>
                </select>
                <label htmlFor="hairstyleGender" className="text-muted">
                  <i className="bi bi-gender-ambiguous me-2 text-primary"></i>
                  Gender Category *
                </label>
              </div>
            </div>
          </div>

          {/* Image URL Section */}
          <div className="mb-4">
            <div className="form-floating mb-3">
              <input
                type="url"
                className="form-control border-0 bg-light"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                required
                placeholder="Image URL"
                id="imageUrl"
              />
              <label htmlFor="imageUrl" className="text-muted">
                <i className="bi bi-image me-2 text-primary"></i>
                Hairstyle Image URL *
              </label>
            </div>
            <div className="form-text text-muted ms-1">
              Enter a direct URL to a high-quality, well-lit image of the hairstyle
            </div>
            
            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-4">
                <label className="form-label fw-semibold text-dark mb-3">
                  <i className="bi bi-eye me-2 text-success"></i>
                  Image Preview
                </label>
                <div className="card border-0 bg-light overflow-hidden">
                  <div className="card-body p-0">
                    <div className="position-relative">
                      <img 
                        src={imagePreview} 
                        alt="Hairstyle preview" 
                        className="img-fluid w-100 preview-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling?.classList.remove('d-none');
                        }}
                      />
                      <div className="d-none position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-gradient-beauty text-white">
                        <div className="text-center">
                          <i className="bi bi-image display-4 mb-2"></i>
                          <p className="mb-0 fw-semibold">Image Preview Unavailable</p>
                          <small>Please check the URL</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tags Section */}
          <div className="mb-4">
            <label className="form-label fw-semibold text-dark mb-3">
              <i className="bi bi-tags me-2 text-warning"></i>
              Style Tags & Categories
            </label>
            
            {/* Tag Input */}
            <div className="input-group input-group-lg mb-3">
              <input
                type="text"
                className="form-control border-0 bg-light"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={handleTagKeyPress}
                placeholder="Add a tag (e.g., braids, formal, curly)"
              />
              <button
                type="button"
                className="btn btn-primary px-4"
                onClick={handleAddTag}
              >
                <i className="bi bi-plus-lg"></i> Add
              </button>
            </div>

            {/* Popular Tags */}
            <div className="mb-3">
              <label className="form-label text-muted small mb-2">
                <i className="bi bi-lightning me-1"></i>
                Quick add popular tags:
              </label>
              <div className="d-flex flex-wrap gap-2">
                {popularTags.map((tag, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`btn btn-sm ${
                      formData.tags.includes(tag) 
                        ? 'btn-success' 
                        : 'btn-outline-primary'
                    }`}
                    onClick={() => addPopularTag(tag)}
                    disabled={formData.tags.includes(tag)}
                  >
                    {tag}
                    {formData.tags.includes(tag) && (
                      <i className="bi bi-check-lg ms-1"></i>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Tags */}
            {formData.tags.length > 0 && (
              <div className="mt-3">
                <label className="form-label text-muted small mb-2">
                  <i className="bi bi-check2-circle me-1 text-success"></i>
                  Selected tags ({formData.tags.length}):
                </label>
                <div className="d-flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span key={index} className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-2">
                      <i className="bi bi-tag-fill me-1"></i>
                      {tag}
                      <button
                        type="button"
                        className="btn-close btn-close-sm ms-2"
                        onClick={() => handleRemoveTag(tag)}
                        style={{fontSize: '0.6rem'}}
                      ></button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form Guidance */}
          <div className="alert alert-info border-0 mb-4">
            <div className="d-flex">
              <i className="bi bi-info-circle me-3 mt-1 text-primary"></i>
              <div>
                <h6 className="alert-heading mb-2">Tips for Great Hairstyle Listings</h6>
                <ul className="mb-0 small text-muted">
                  <li>Use high-quality, well-lit images that clearly show the hairstyle</li>
                  <li>Add relevant tags to help customers discover your styles</li>
                  <li>Choose the appropriate gender category for better targeting</li>
                  <li>Use descriptive names that customers would search for</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="d-flex gap-3 justify-content-end border-top pt-4">
            <button
              type="button"
              className="btn btn-outline-secondary px-4 py-2"
              onClick={() => onSuccess && onSuccess()}
              disabled={loading}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Cancel
            </button>
            
            <button
              type="submit"
              className="btn btn-primary px-4 py-2 fw-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Creating Beauty Style...
                </>
              ) : (
                <>
                  <i className="bi bi-magic me-2"></i>
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