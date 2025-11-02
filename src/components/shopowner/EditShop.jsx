// components/shopowner/EditShop.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditShop = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    services: [{ serviceName: '', price: '' }]
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchShop();
  }, [id]);

  const fetchShop = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://hair-salon-app-1.onrender.com/shop/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const shop = response.data;
      setFormData({
        name: shop.name,
        location: shop.location,
        description: shop.description,
        services: shop.services && shop.services.length > 0 ? shop.services : [{ serviceName: '', price: '' }]
      });
      
      if (shop.image) {
        setCurrentImage(shop.image);
        setImagePreview(`https://hair-salon-app-1.onrender.com${shop.image}`);
      }
    } catch (error) {
      console.error('Error fetching shop:', error);
      setError('Failed to load shop details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...formData.services];
    updatedServices[index][field] = field === 'price' ? Number(value) : value;
    setFormData(prev => ({
      ...prev,
      services: updatedServices
    }));
  };

  const addService = () => {
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, { serviceName: '', price: '' }]
    }));
  };

  const removeService = (index) => {
    if (formData.services.length > 1) {
      const updatedServices = formData.services.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        services: updatedServices
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please select a valid image file (JPEG, PNG, WebP, or GIF)');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setImage(file);
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Salon name is required');
      return false;
    }
    if (!formData.location.trim()) {
      setError('Location is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }

    const validServices = formData.services.filter(service => 
      service.serviceName.trim() && service.price > 0
    );

    if (validServices.length === 0) {
      setError('At least one service with name and price is required');
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

    setUpdating(true);

    try {
      const token = localStorage.getItem('token');
      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      submitData.append('location', formData.location.trim());
      submitData.append('description', formData.description.trim());
      
      const validServices = formData.services.filter(service => 
        service.serviceName.trim() && service.price > 0
      );
      submitData.append('services', JSON.stringify(validServices));
      
      if (image) {
        submitData.append('image', image);
      }

      const response = await axios.put(`https://hair-salon-app-1.onrender.com/shop/${id}`, submitData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Salon updated successfully!');
      navigate('/shopowner/shops');
    } catch (error) {
      console.error('Error updating shop:', error);
      setError(error.response?.data?.message || 'Failed to update salon. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading salon details...</p>
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
              <li className="breadcrumb-item"><a href="/shopowner/dashboard" className="text-decoration-none">Dashboard</a></li>
              <li className="breadcrumb-item"><a href="/shopowner/shops" className="text-decoration-none">My Salons</a></li>
              <li className="breadcrumb-item active">Edit Salon</li>
            </ol>
          </nav>
          <h1 className="fw-bold">Edit Salon</h1>
          <p className="text-muted">Update your salon information and services</p>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <i className="bi bi-pencil-square me-2"></i>
                Edit Salon Information
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
                <div className="mb-4">
                  <h5 className="mb-3 text-primary">
                    <i className="bi bi-info-circle me-2"></i>
                    Basic Information
                  </h5>
                  
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Salon Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter salon name"
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label">Location *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter salon location"
                      />
                    </div>
                    
                    <div className="col-12">
                      <label className="form-label">Description *</label>
                      <textarea
                        className="form-control"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="4"
                        placeholder="Describe your salon..."
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Salon Image */}
                <div className="mb-4">
                  <h5 className="mb-3 text-primary">
                    <i className="bi bi-image me-2"></i>
                    Salon Image
                  </h5>
                  
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <div className="form-text">
                        Upload a new image or keep the current one
                      </div>
                      {currentImage && !imagePreview && (
                        <div className="mt-2">
                          <small className="text-muted">Current image:</small>
                          <div>
                            <img 
                              src={`https://hair-salon-app-1.onrender.com${currentImage}`} 
                              alt="Current" 
                              className="img-thumbnail mt-1"
                              style={{maxHeight: '100px'}}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="col-md-6">
                      {imagePreview && (
                        <div className="text-center">
                          <p className="text-success">
                            <i className="bi bi-check-circle me-1"></i>
                            New image selected
                          </p>
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="img-fluid rounded shadow-sm"
                            style={{maxHeight: '200px'}}
                          />
                          <div className="mt-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => {
                                setImage(null);
                                setImagePreview(currentImage ? `https://hair-salon-app-1.onrender.com${currentImage}` : null);
                              }}
                            >
                              <i className="bi bi-arrow-counterclockwise me-1"></i>
                              Use Current Image
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0 text-primary">
                      <i className="bi bi-list-check me-2"></i>
                      Services & Pricing
                    </h5>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={addService}
                    >
                      <i className="bi bi-plus me-1"></i>
                      Add Service
                    </button>
                  </div>
                  
                  {formData.services.map((service, index) => (
                    <div key={index} className="card mb-3 border-success">
                      <div className="card-header bg-light d-flex justify-content-between align-items-center">
                        <span className="fw-bold">Service #{index + 1}</span>
                        {formData.services.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeService(index)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        )}
                      </div>
                      <div className="card-body">
                        <div className="row g-3 align-items-center">
                          <div className="col-md-6">
                            <label className="form-label">Service Name *</label>
                            <input
                              type="text"
                              className="form-control"
                              value={service.serviceName}
                              onChange={(e) => handleServiceChange(index, 'serviceName', e.target.value)}
                              placeholder="e.g., Haircut, Coloring, Styling"
                              required
                            />
                          </div>
                          
                          <div className="col-md-4">
                            <label className="form-label">Price (KSh) *</label>
                            <input
                              type="number"
                              className="form-control"
                              value={service.price}
                              onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                              placeholder="e.g., 500"
                              min="1"
                              required
                            />
                          </div>
                          
                          <div className="col-md-2">
                            <label className="form-label">Duration</label>
                            <select className="form-select" defaultValue="60">
                              <option value="30">30 mins</option>
                              <option value="60">60 mins</option>
                              <option value="90">90 mins</option>
                              <option value="120">120 mins</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Submit Buttons */}
                <div className="d-flex gap-3 justify-content-end border-top pt-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/shopowner/shops')}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={updating}
                  >
                    {updating ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Updating Salon...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Update Salon
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditShop;