// components/shopowner/CreateShop.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateShop = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    services: [{ serviceName: '', price: '', duration: '60' }]
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

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
      services: [...prev.services, { serviceName: '', price: '', duration: '60' }]
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

    setLoading(true);

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

      const response = await axios.post('https://hair-salon-app-1.onrender.com/shop', submitData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('🎉 Salon created successfully! Welcome to our beauty community!');
      navigate('/shopowner/shops');
    } catch (error) {
      console.error('Error creating shop:', error);
      setError(error.response?.data?.message || 'Failed to create salon. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!formData.name.trim() || !formData.location.trim() || !formData.description.trim()) {
        setError('Please fill in all basic information fields');
        return;
      }
    }
    setCurrentStep(currentStep + 1);
    setError('');
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    setError('');
  };

  const popularServices = [
    { name: "Women's Haircut", price: 1500, duration: "60" },
    { name: "Men's Haircut", price: 800, duration: "30" },
    { name: "Hair Coloring", price: 3000, duration: "120" },
    { name: "Hair Treatment", price: 2000, duration: "90" },
    { name: "Braiding", price: 2500, duration: "120" },
    { name: "Makeup", price: 2500, duration: "90" },
    { name: "Manicure", price: 1200, duration: "60" },
    { name: "Pedicure", price: 1500, duration: "60" }
  ];

  const addPopularService = (service) => {
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, { 
        serviceName: service.name, 
        price: service.price, 
        duration: service.duration 
      }]
    }));
  };

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      <div className="container">
        {/* Header with Breadcrumb */}
        <div className="row mb-4">
          <div className="col-12">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb bg-white rounded-pill px-4 py-2 shadow-sm d-inline-flex">
                <li className="breadcrumb-item">
                  <a href="/shopowner/dashboard" className="text-decoration-none text-primary">
                    <i className="bi bi-house me-1"></i>
                    Dashboard
                  </a>
                </li>
                <li className="breadcrumb-item">
                  <a href="/shopowner/shops" className="text-decoration-none text-primary">
                    <i className="bi bi-shop me-1"></i>
                    My Salons
                  </a>
                </li>
                <li className="breadcrumb-item active text-pink">
                  <i className="bi bi-plus-circle me-1"></i>
                  Create Salon
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Main Header */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card border-0 shadow-sm bg-gradient-beauty text-white overflow-hidden">
              <div className="card-body p-5 text-center">
                <div className="row align-items-center">
                  <div className="col-md-8 text-md-start">
                    <h1 className="display-5 fw-bold mb-3">
                      <i className="bi bi-shop-window me-3"></i>
                      Create Your Beauty Salon
                    </h1>
                    <p className="lead mb-0 opacity-75">
                      Join our premium network of beauty professionals and showcase your talent to thousands of customers
                    </p>
                  </div>
                  <div className="col-md-4 text-md-end">
                    <div className="bg-white bg-opacity-20 rounded-pill px-4 py-3 d-inline-block">
                      <div className="h4 fw-bold mb-0">{currentStep}/3</div>
                      <small>Setup Progress</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* Progress Steps */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <div className="row text-center">
                  <div className="col-md-4 mb-3 mb-md-0">
                    <div className={`step-indicator ${currentStep >= 1 ? 'active' : ''}`}>
                      <div className="step-number">1</div>
                      <div className="step-label">Basic Info</div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3 mb-md-0">
                    <div className={`step-indicator ${currentStep >= 2 ? 'active' : ''}`}>
                      <div className="step-number">2</div>
                      <div className="step-label">Services</div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className={`step-indicator ${currentStep >= 3 ? 'active' : ''}`}>
                      <div className="step-number">3</div>
                      <div className="step-label">Review</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Form Card */}
            <div className="card border-0 shadow-lg">
              <div className="card-body p-0">
                {error && (
                  <div className="alert alert-danger border-0 rounded-0 m-0" role="alert">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-exclamation-triangle-fill me-3 fs-5"></i>
                      <div className="flex-grow-1">
                        <h6 className="alert-heading mb-1">Please check your input</h6>
                        <div className="small">{error}</div>
                      </div>
                      <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => setError('')}
                      ></button>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Step 1: Basic Information */}
                  {currentStep === 1 && (
                    <div className="p-4">
                      <h4 className="fw-bold text-dark mb-4">
                        <i className="bi bi-building me-2 text-primary"></i>
                        Salon Basic Information
                      </h4>
                      
                      <div className="row g-4">
                        <div className="col-md-6">
                          <div className="form-floating">
                            <input
                              type="text"
                              className="form-control border-0 bg-light"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                              placeholder="Salon Name"
                              id="salonName"
                            />
                            <label htmlFor="salonName" className="text-muted">
                              <i className="bi bi-tag me-2 text-primary"></i>
                              Salon Name *
                            </label>
                          </div>
                        </div>
                        
                        <div className="col-md-6">
                          <div className="form-floating">
                            <input
                              type="text"
                              className="form-control border-0 bg-light"
                              name="location"
                              value={formData.location}
                              onChange={handleInputChange}
                              required
                              placeholder="Location"
                              id="salonLocation"
                            />
                            <label htmlFor="salonLocation" className="text-muted">
                              <i className="bi bi-geo-alt me-2 text-primary"></i>
                              Location *
                            </label>
                          </div>
                          <div className="form-text ms-1">
                            e.g., "Westlands, Nairobi" or "Mombasa Road"
                          </div>
                        </div>
                        
                        <div className="col-12">
                          <div className="form-floating">
                            <textarea
                              className="form-control border-0 bg-light"
                              name="description"
                              value={formData.description}
                              onChange={handleInputChange}
                              rows="5"
                              placeholder="Salon description"
                              id="salonDescription"
                              required
                            ></textarea>
                            <label htmlFor="salonDescription" className="text-muted">
                              <i className="bi bi-pencil me-2 text-primary"></i>
                              Salon Description *
                            </label>
                          </div>
                          <div className="form-text ms-1">
                            Describe your salon's specialty, atmosphere, and what makes you unique
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="card border-0 bg-light">
                            <div className="card-body">
                              <h6 className="fw-semibold text-dark mb-3">
                                <i className="bi bi-image me-2 text-success"></i>
                                Salon Image
                              </h6>
                              <div className="row align-items-center">
                                <div className="col-md-6">
                                  <input
                                    type="file"
                                    className="form-control border-0"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                  />
                                  <div className="form-text">
                                    Upload a professional photo of your salon (max 5MB)
                                  </div>
                                </div>
                                
                                <div className="col-md-6">
                                  {imagePreview && (
                                    <div className="text-center">
                                      <div className="position-relative d-inline-block">
                                        <img 
                                          src={imagePreview} 
                                          alt="Preview" 
                                          className="img-fluid rounded shadow-sm preview-image"
                                        />
                                        <button
                                          type="button"
                                          className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                                          onClick={() => {
                                            setImage(null);
                                            setImagePreview(null);
                                          }}
                                        >
                                          <i className="bi bi-x"></i>
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="d-flex justify-content-end mt-4 pt-3 border-top">
                        <button
                          type="button"
                          className="btn btn-primary px-4 py-2"
                          onClick={nextStep}
                        >
                          Continue to Services
                          <i className="bi bi-arrow-right ms-2"></i>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Services */}
                  {currentStep === 2 && (
                    <div className="p-4">
                      <h4 className="fw-bold text-dark mb-4">
                        <i className="bi bi-scissors me-2 text-primary"></i>
                        Services & Pricing
                      </h4>

                      {/* Popular Services Quick Add */}
                      <div className="card border-0 bg-light mb-4">
                        <div className="card-body">
                          <h6 className="fw-semibold text-dark mb-3">
                            <i className="bi bi-lightning me-2 text-warning"></i>
                            Quick Add Popular Services
                          </h6>
                          <div className="row g-2">
                            {popularServices.map((service, index) => (
                              <div key={index} className="col-md-6 col-lg-3">
                                <button
                                  type="button"
                                  className="btn btn-outline-primary btn-sm w-100 text-start"
                                  onClick={() => addPopularService(service)}
                                >
                                  <small>
                                    <strong>{service.name}</strong>
                                    <br />
                                    <span className="text-success">KSh {service.price}</span>
                                    <span className="text-muted"> • {service.duration}min</span>
                                  </small>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Services List */}
                      <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h6 className="fw-semibold text-dark mb-0">
                            Your Services ({formData.services.length})
                          </h6>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={addService}
                          >
                            <i className="bi bi-plus me-1"></i>
                            Add Custom Service
                          </button>
                        </div>
                        
                        {formData.services.map((service, index) => (
                          <div key={index} className="card border-0 bg-light mb-3">
                            <div className="card-body">
                              <div className="row g-3 align-items-center">
                                <div className="col-md-5">
                                  <div className="form-floating">
                                    <input
                                      type="text"
                                      className="form-control border-0"
                                      value={service.serviceName}
                                      onChange={(e) => handleServiceChange(index, 'serviceName', e.target.value)}
                                      placeholder="Service Name"
                                      id={`serviceName-${index}`}
                                      required
                                    />
                                    <label htmlFor={`serviceName-${index}`} className="text-muted">
                                      Service Name *
                                    </label>
                                  </div>
                                </div>
                                
                                <div className="col-md-3">
                                  <div className="form-floating">
                                    <input
                                      type="number"
                                      className="form-control border-0"
                                      value={service.price}
                                      onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                                      placeholder="Price"
                                      id={`servicePrice-${index}`}
                                      min="1"
                                      required
                                    />
                                    <label htmlFor={`servicePrice-${index}`} className="text-muted">
                                      Price (KSh) *
                                    </label>
                                  </div>
                                </div>
                                
                                <div className="col-md-3">
                                  <div className="form-floating">
                                    <select 
                                      className="form-select border-0"
                                      value={service.duration}
                                      onChange={(e) => handleServiceChange(index, 'duration', e.target.value)}
                                      id={`serviceDuration-${index}`}
                                    >
                                      <option value="30">30 minutes</option>
                                      <option value="60">60 minutes</option>
                                      <option value="90">90 minutes</option>
                                      <option value="120">120 minutes</option>
                                      <option value="180">180 minutes</option>
                                    </select>
                                    <label htmlFor={`serviceDuration-${index}`} className="text-muted">
                                      Duration
                                    </label>
                                  </div>
                                </div>
                                
                                <div className="col-md-1">
                                  {formData.services.length > 1 && (
                                    <button
                                      type="button"
                                      className="btn btn-outline-danger btn-sm w-100"
                                      onClick={() => removeService(index)}
                                      title="Remove service"
                                    >
                                      <i className="bi bi-trash"></i>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                        <button
                          type="button"
                          className="btn btn-outline-secondary px-4 py-2"
                          onClick={prevStep}
                        >
                          <i className="bi bi-arrow-left me-2"></i>
                          Back
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary px-4 py-2"
                          onClick={nextStep}
                        >
                          Review & Create
                          <i className="bi bi-check-circle ms-2"></i>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Review & Submit */}
                  {currentStep === 3 && (
                    <div className="p-4">
                      <h4 className="fw-bold text-dark mb-4">
                        <i className="bi bi-eye me-2 text-primary"></i>
                        Review Your Salon
                      </h4>

                      <div className="row g-4">
                        {/* Basic Info Review */}
                        <div className="col-md-6">
                          <div className="card border-0 bg-light h-100">
                            <div className="card-body">
                              <h6 className="fw-semibold text-dark mb-3">
                                <i className="bi bi-building me-2"></i>
                                Basic Information
                              </h6>
                              <div className="space-y-2">
                                <div>
                                  <small className="text-muted">Salon Name</small>
                                  <p className="fw-semibold mb-1">{formData.name}</p>
                                </div>
                                <div>
                                  <small className="text-muted">Location</small>
                                  <p className="fw-semibold mb-1">{formData.location}</p>
                                </div>
                                <div>
                                  <small className="text-muted">Description</small>
                                  <p className="mb-0">{formData.description}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Services Review */}
                        <div className="col-md-6">
                          <div className="card border-0 bg-light h-100">
                            <div className="card-body">
                              <h6 className="fw-semibold text-dark mb-3">
                                <i className="bi bi-scissors me-2"></i>
                                Services ({formData.services.filter(s => s.serviceName.trim()).length})
                              </h6>
                              <div className="space-y-2">
                                {formData.services.filter(service => service.serviceName.trim()).map((service, index) => (
                                  <div key={index} className="d-flex justify-content-between align-items-center border-bottom pb-2">
                                    <div>
                                      <p className="fw-semibold mb-0 small">{service.serviceName}</p>
                                      <small className="text-muted">{service.duration} minutes</small>
                                    </div>
                                    <span className="fw-bold text-success">KSh {service.price}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Image Preview */}
                        {imagePreview && (
                          <div className="col-12">
                            <div className="card border-0 bg-light">
                              <div className="card-body">
                                <h6 className="fw-semibold text-dark mb-3">
                                  <i className="bi bi-image me-2"></i>
                                  Salon Image Preview
                                </h6>
                                <div className="text-center">
                                  <img 
                                    src={imagePreview} 
                                    alt="Salon preview" 
                                    className="img-fluid rounded shadow-sm"
                                    style={{maxHeight: '300px'}}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                        <button
                          type="button"
                          className="btn btn-outline-secondary px-4 py-2"
                          onClick={prevStep}
                        >
                          <i className="bi bi-arrow-left me-2"></i>
                          Back to Services
                        </button>
                        <div className="d-flex gap-3">
                          <button
                            type="button"
                            className="btn btn-outline-secondary px-4 py-2"
                            onClick={() => navigate('/shopowner/shops')}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="btn btn-success px-4 py-2 fw-semibold"
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Creating Your Beauty Salon...
                              </>
                            ) : (
                              <>
                                <i className="bi bi-check-circle me-2"></i>
                                Launch My Salon
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Help Card */}
            <div className="card border-0 shadow-sm mt-4">
              <div className="card-body">
                <h6 className="card-title text-primary fw-bold mb-3">
                  <i className="bi bi-stars me-2"></i>
                  Tips for an Outstanding Salon Profile
                </h6>
                <div className="row">
                  <div className="col-md-6">
                    <ul className="list-unstyled small">
                      <li className="mb-3 d-flex align-items-start">
                        <i className="bi bi-camera text-success me-2 mt-1"></i>
                        <div>
                          <strong>High-quality photos</strong> showcase your salon's professional atmosphere
                        </div>
                      </li>
                      <li className="mb-3 d-flex align-items-start">
                        <i className="bi bi-pencil text-primary me-2 mt-1"></i>
                        <div>
                          <strong>Compelling descriptions</strong> highlight your unique expertise and style
                        </div>
                      </li>
                      <li className="d-flex align-items-start">
                        <i className="bi bi-geo-alt text-warning me-2 mt-1"></i>
                        <div>
                          <strong>Clear location details</strong> help customers find you easily
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <ul className="list-unstyled small">
                      <li className="mb-3 d-flex align-items-start">
                        <i className="bi bi-scissors text-pink me-2 mt-1"></i>
                        <div>
                          <strong>Complete service menu</strong> with clear, competitive pricing
                        </div>
                      </li>
                      <li className="mb-3 d-flex align-items-start">
                        <i className="bi bi-clock text-info me-2 mt-1"></i>
                        <div>
                          <strong>Realistic durations</strong> help customers plan their visits
                        </div>
                      </li>
                      <li className="d-flex align-items-start">
                        <i className="bi bi-award text-warning me-2 mt-1"></i>
                        <div>
                          <strong>Professional presentation</strong> builds trust and credibility
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
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
        .text-pink {
          color: #e83e8c !important;
        }
        .min-vh-100 {
          min-height: 100vh;
        }
        .step-indicator {
          text-align: center;
          padding: 1rem;
          border-radius: 10px;
          transition: all 0.3s ease;
        }
        .step-indicator.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e9ecef;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.5rem;
          font-weight: bold;
        }
        .step-indicator.active .step-number {
          background: rgba(255,255,255,0.2);
          color: white;
        }
        .preview-image {
          height: 200px;
          object-fit: cover;
        }
        .form-control:focus, .form-select:focus {
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
          border-color: #667eea;
        }
      `}</style>
    </div>
  );
};

export default CreateShop;