// components/shopowner/MyShops.js
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const MyShops = () => {
  const { user, token } = useContext(AuthContext);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    if (user && token) {
      fetchMyShops();
    }
  }, [user, token]);

  const fetchMyShops = async () => {
    try {
      setLoading(true);
      setError("");
      
      console.log("🔄 Fetching my shops...");
      
      const res = await axios.get("https://hair-salon-app-1.onrender.com/shop/getMyShops", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("📦 My shops response:", res.data);
      
      // Make sure we're setting the shops correctly
      const shopsData = Array.isArray(res.data) ? res.data : [];
      console.log("✅ Setting shops:", shopsData);
      setShops(shopsData);
      
    } catch (error) {
      console.error("❌ Error fetching shops:", error);
      setError(error.response?.data?.message || "Failed to load shops");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteShop = async (shopId) => {
    if (!window.confirm("Are you sure you want to delete this shop? This action cannot be undone.")) {
      return;
    }

    try {
      setDeleteLoading(shopId);
      await axios.delete(`https://hair-salon-app-1.onrender.com/shop/${shopId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setShops(shops.filter(shop => shop._id !== shopId));
      
    } catch (error) {
      console.error("Error deleting shop:", error);
      setError("Failed to delete shop");
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-2">Loading your shops...</span>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold text-primary">My Shops</h2>
        <p className="text-muted">Manage your beauty salons - edit details or remove shops</p>
        {/* Debug info */}
        <div className="text-muted small">
          User: {user?.name} | Shops found: {shops.length}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError("")}></button>
        </div>
      )}

      {/* Shops Grid */}
      {shops.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="bi bi-shop display-1 text-muted"></i>
          </div>
          <h4 className="text-muted mb-3">No shops found</h4>
          <p className="text-muted mb-4">You haven't created any shops yet.</p>
          <Link to="/shopowner/create" className="btn btn-success btn-lg">
            <i className="bi bi-plus-circle me-2"></i>
            Create Your First Shop
          </Link>
        </div>
      ) : (
        <>
          {/* Shop Count Summary */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card bg-light border-0">
                <div className="card-body py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-0 text-dark">
                        <i className="bi bi-shop me-2"></i>
                        Total Shops: <strong>{shops.length}</strong>
                      </h6>
                    </div>
                    <div className="text-muted small">
                      Click on any shop to manage its details
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shops List */}
          <div className="row g-4">
            {shops.map((shop) => (
              <div key={shop._id} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm border-0 shop-card">
                  {/* Shop Image */}
                  <div style={{ height: "200px", overflow: "hidden" }}>
                    <img
                      src={shop.image || "https://via.placeholder.com/300x200?text=No+Image"}
                      alt={shop.name}
                      className="card-img-top h-100 object-fit-cover"
                      style={{ objectFit: "cover" }}
                    />
                  </div>

                  <div className="card-body d-flex flex-column">
                    {/* Shop Name and Location */}
                    <h5 className="card-title text-primary">{shop.name}</h5>
                    <p className="card-text text-muted small">
                      <i className="bi bi-geo-alt me-1"></i>
                      {shop.location}
                    </p>

                    {/* Description */}
                    <p className="card-text flex-grow-1">
                      {shop.description || "No description provided."}
                    </p>

                    {/* Services Summary */}
                    <div className="mb-3">
                      <h6 className="text-success mb-2">
                        <i className="bi bi-scissors me-1"></i>
                        Services ({shop.services?.length || 0})
                      </h6>
                      {shop.services && shop.services.length > 0 ? (
                        <div className="d-flex flex-wrap gap-1">
                          {shop.services.slice(0, 3).map((service, index) => (
                            <span
                              key={index}
                              className="badge bg-light text-dark border small"
                            >
                              {service.serviceName} - Ksh {service.price}
                            </span>
                          ))}
                          {shop.services.length > 3 && (
                            <span className="badge bg-secondary small">
                              +{shop.services.length - 3} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted small">No services added</span>
                      )}
                    </div>

                    {/* Rating and Reviews */}
                    <div className="d-flex align-items-center mb-3">
                      <div className="text-warning">
                        <i className="bi bi-star-fill"></i>
                        <span className="ms-1 fw-semibold">{shop.rating || "0.0"}</span>
                      </div>
                      <span className="text-muted small ms-2">
                        ({shop.reviews?.length || 0} reviews)
                      </span>
                    </div>

                    {/* Action Buttons - Only Edit and Delete */}
                    <div className="d-grid gap-2">
                      <div className="row g-2">
                        <div className="col-6">
                          <Link
                            to={`/shopowner/edit/${shop._id}`}
                            className="btn btn-outline-primary btn-sm w-100"
                          >
                            <i className="bi bi-pencil me-1"></i>
                            Edit Shop
                          </Link>
                        </div>
                        <div className="col-6">
                          <button
                            onClick={() => handleDeleteShop(shop._id)}
                            disabled={deleteLoading === shop._id}
                            className="btn btn-outline-danger btn-sm w-100"
                          >
                            {deleteLoading === shop._id ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                                Deleting...
                              </>
                            ) : (
                              <>
                                <i className="bi bi-trash me-1"></i>
                                Delete
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer with Created Date */}
                  <div className="card-footer bg-transparent">
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        Created: {new Date(shop.createdAt).toLocaleDateString()}
                      </small>
                      <small className="text-muted">
                        Updated: {new Date(shop.updatedAt).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MyShops;