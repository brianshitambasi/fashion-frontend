// components/shopowner/EditShop.jsx
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const EditShop = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    services: [{ serviceName: "", price: "" }],
    image: null,
    currentImage: ""
  });

  useEffect(() => {
    fetchShopDetails();
  }, [id]);

  const fetchShopDetails = async () => {
    try {
      setFetchLoading(true);
      const res = await axios.get(`https://hair-salon-app-1.onrender.com/shop/${id}`);
      
      const shop = res.data;
      console.log("Fetched shop data:", shop);
      
      setFormData({
        name: shop.name || "",
        location: shop.location || "",
        description: shop.description || "",
        services: shop.services && shop.services.length > 0 
          ? shop.services.map(service => ({
              serviceName: service.serviceName || "",
              price: service.price || ""
            }))
          : [{ serviceName: "", price: "" }],
        image: null,
        currentImage: shop.image || ""
      });
      
    } catch (error) {
      console.error("Error fetching shop details:", error);
      setError("Failed to load shop details");
    } finally {
      setFetchLoading(false);
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
      services: [...prev.services, { serviceName: "", price: "" }]
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
    setFormData(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null,
      currentImage: ""
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Submitting form data:", formData);

      const data = new FormData();
      data.append("name", formData.name);
      data.append("location", formData.location);
      data.append("description", formData.description);
      
      // Format services properly
      const formattedServices = formData.services
        .filter(service => service.serviceName.trim() && service.price)
        .map(service => ({
          serviceName: service.serviceName.trim(),
          price: Number(service.price)
        }));
      
      data.append("services", JSON.stringify(formattedServices));
      
      if (formData.image) {
        data.append("image", formData.image);
      }

      console.log("Sending data to server...");
      
      const res = await axios.put(`https://hair-salon-app-1.onrender.com/shop/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      console.log("Update successful:", res.data);
      navigate("/shopowner/shops");
      
    } catch (error) {
      console.error("Error updating shop:", error);
      console.error("Error response:", error.response?.data);
      
      // More detailed error handling
      if (error.response?.status === 500) {
        setError("Server error: Please check if all required fields are filled correctly");
      } else {
        setError(error.response?.data?.message || error.response?.data?.error || "Failed to update shop");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fixed placeholder image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9Ijc1IiB5PSI3NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNmM3NTgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zNWVtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=";
    }
    return imagePath;
  };

  if (fetchLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-2">Loading shop details...</span>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow border-0">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">
                <i className="bi bi-pencil-square me-2"></i>
                Edit Shop
              </h4>
            </div>
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger">
                  <strong>Error:</strong> {error}
                  <br />
                  <small className="text-muted">
                    Please check that all required fields are filled correctly and try again.
                  </small>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                {/* Shop Basic Info */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Shop Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
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
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your shop, services, and what makes it special..."
                  />
                </div>

                {/* Current Image Preview */}
                {formData.currentImage && (
                  <div className="mb-3">
                    <label className="form-label">Current Image</label>
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={getImageUrl(formData.currentImage)}
                        alt="Current shop"
                        className="img-thumbnail"
                        style={{ width: "150px", height: "150px", objectFit: "cover" }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={removeImage}
                      >
                        <i className="bi bi-trash me-1"></i>
                        Remove Image
                      </button>
                    </div>
                  </div>
                )}

                {/* New Image Upload */}
                <div className="mb-4">
                  <label className="form-label">
                    {formData.currentImage ? "Upload New Image" : "Shop Image"}
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <div className="form-text">
                    Upload a photo of your shop (optional). JPG, PNG, or WebP formats supported.
                  </div>
                  
                  {formData.image && (
                    <div className="mt-2">
                      <small className="text-success">
                        <i className="bi bi-check-circle me-1"></i>
                        New image selected: {formData.image.name}
                      </small>
                    </div>
                  )}
                </div>

                {/* Services */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <label className="form-label fw-semibold">Services *</label>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-success"
                      onClick={addService}
                    >
                      <i className="bi bi-plus me-1"></i>Add Service
                    </button>
                  </div>

                  {formData.services.map((service, index) => (
                    <div key={index} className="row mb-3 align-items-center border-bottom pb-3">
                      <div className="col-md-6">
                        <label className="form-label small">Service Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g., Haircut, Manicure, Facial"
                          value={service.serviceName}
                          onChange={(e) => handleServiceChange(index, "serviceName", e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small">Price (Ksh) *</label>
                        <div className="input-group">
                          <span className="input-group-text">Ksh</span>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="0"
                            value={service.price}
                            onChange={(e) => handleServiceChange(index, "price", e.target.value)}
                            min="0"
                            step="50"
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-2">
                        <label className="form-label small d-block">&nbsp;</label>
                        {formData.services.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger w-100"
                            onClick={() => removeService(index)}
                            title="Remove service"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {formData.services.length === 0 && (
                    <div className="alert alert-warning">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      Add at least one service to your shop.
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="d-grid gap-2 d-md-flex justify-content-md-end border-top pt-4">
                  <Link
                    to="/shopowner/shops"
                    className="btn btn-secondary me-md-2"
                  >
                    <i className="bi bi-arrow-left me-1"></i>
                    Back to My Shops
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Update Shop
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