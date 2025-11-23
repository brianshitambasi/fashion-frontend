// components/admin/AdminShops.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = "https://hair-salon-app-1.onrender.com";

const AdminShops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchShops();
  }, [currentPage, searchTerm]);

  const fetchShops = async () => {
    try {
      const token = localStorage.getItem("token");
      const params = {
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm })
      };

      const response = await axios.get(`${BACKEND_URL}/admin/shops`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      });

      setShops(response.data.shops);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching shops:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateShopStatus = async (shopId, updates) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${BACKEND_URL}/admin/shops/${shopId}/status`,
        updates,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      fetchShops(); // Refresh the list
      alert("Shop updated successfully");
    } catch (error) {
      console.error("Error updating shop:", error);
      alert("Failed to update shop");
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 fw-bold text-primary">Shop Management</h1>
      </div>

      {/* Filters */}
      <div className="card shadow mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-10">
              <input
                type="text"
                className="form-control"
                placeholder="Search shops by name, location, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <button className="btn btn-outline-secondary w-100" onClick={fetchShops}>
                <i className="bi bi-arrow-clockwise"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Shops Table */}
      <div className="card shadow">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">All Shops</h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered" width="100%" cellSpacing="0">
              <thead>
                <tr>
                  <th>Shop Name</th>
                  <th>Owner</th>
                  <th>Location</th>
                  <th>Services</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {shops.map((shop) => (
                  <tr key={shop._id}>
                    <td>
                      <strong>{shop.name}</strong>
                      {shop.featured && (
                        <span className="badge bg-warning ms-2">Featured</span>
                      )}
                    </td>
                    <td>
                      <div>
                        <div>{shop.owner?.name}</div>
                        <small className="text-muted">{shop.owner?.email}</small>
                      </div>
                    </td>
                    <td>{shop.location}</td>
                    <td>
                      <span className="badge bg-info">
                        {shop.services?.length || 0} services
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="text-warning me-1">
                          <i className="bi bi-star-fill"></i>
                        </span>
                        <span>{shop.rating || 'No ratings'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="btn-group-vertical">
                        <button
                          className={`btn btn-sm ${shop.isVerified ? 'btn-success' : 'btn-warning'}`}
                          onClick={() => updateShopStatus(shop._id, { isVerified: !shop.isVerified })}
                        >
                          {shop.isVerified ? 'Verified' : 'Verify'}
                        </button>
                        <button
                          className={`btn btn-sm ${shop.featured ? 'btn-info' : 'btn-outline-info'}`}
                          onClick={() => updateShopStatus(shop._id, { featured: !shop.featured })}
                        >
                          {shop.featured ? 'Featured' : 'Feature'}
                        </button>
                      </div>
                    </td>
                    <td>
                      <div className="btn-group">
                        <Link
                          to={`/admin/shops/${shop._id}`}
                          className="btn btn-sm btn-primary"
                        >
                          View
                        </Link>
                        <button
                          className={`btn btn-sm ${shop.isActive ? 'btn-warning' : 'btn-success'}`}
                          onClick={() => updateShopStatus(shop._id, { isActive: !shop.isActive })}
                        >
                          {shop.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav>
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </button>
                </li>
                
                {[...Array(totalPages)].map((_, index) => (
                  <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminShops;