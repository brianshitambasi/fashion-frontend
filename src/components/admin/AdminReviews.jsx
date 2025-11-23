// components/admin/AdminReviews.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = "https://hair-salon-app-1.onrender.com";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("pending");

  useEffect(() => {
    fetchReviews();
  }, [currentPage, statusFilter]);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("token");
      const endpoint = statusFilter === "pending" 
        ? `${BACKEND_URL}/admin/reviews/pending`
        : `${BACKEND_URL}/admin/reviews`;

      const params = statusFilter === "pending" ? {} : {
        page: currentPage,
        limit: 10,
        status: statusFilter
      };

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
        ...(Object.keys(params).length > 0 && { params })
      });

      setReviews(response.data.reviews || response.data);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateReviewStatus = async (reviewId, status, adminNotes = "") => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${BACKEND_URL}/admin/reviews/${reviewId}/status`,
        { status, adminNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      fetchReviews(); // Refresh the list
      alert(`Review ${status} successfully`);
    } catch (error) {
      console.error("Error updating review:", error);
      alert("Failed to update review");
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
        <h1 className="h2 fw-bold text-primary">Review Management</h1>
      </div>

      {/* Filters */}
      <div className="card shadow mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <select
                className="form-control"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="pending">Pending Reviews</option>
                <option value="approved">Approved Reviews</option>
                <option value="rejected">Rejected Reviews</option>
                <option value="">All Reviews</option>
              </select>
            </div>
            <div className="col-md-6">
              <button className="btn btn-outline-secondary w-100" onClick={fetchReviews}>
                <i className="bi bi-arrow-clockwise"></i> Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="row">
        {reviews.map((review) => (
          <div key={review._id} className="col-12 mb-4">
            <div className="card shadow">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-8">
                    <h5 className="card-title">
                      {review.customer?.name} reviewed {review.shop?.name}
                    </h5>
                    <div className="mb-2">
                      <span className="text-warning">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`bi bi-star${i < review.rating ? '-fill' : ''}`}
                          ></i>
                        ))}
                      </span>
                      <span className="ms-2">({review.rating}/5)</span>
                    </div>
                    <p className="card-text">{review.comment}</p>
                    <small className="text-muted">
                      Posted on {new Date(review.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                  <div className="col-md-4">
                    <div className="d-flex flex-column gap-2">
                      <span className={`badge ${
                        review.status === 'approved' ? 'bg-success' :
                        review.status === 'rejected' ? 'bg-danger' :
                        'bg-warning'
                      }`}>
                        {review.status?.toUpperCase()}
                      </span>
                      
                      {review.status === 'pending' && (
                        <>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => updateReviewStatus(review._id, 'approved')}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => {
                              const reason = prompt("Enter rejection reason:");
                              if (reason) {
                                updateReviewStatus(review._id, 'rejected', reason);
                              }
                            }}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      
                      {review.adminNotes && (
                        <div className="mt-2">
                          <small className="text-muted">
                            <strong>Admin Notes:</strong> {review.adminNotes}
                          </small>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Reviews Message */}
      {reviews.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-check-circle display-1 text-success mb-3"></i>
          <h5 className="text-success">No {statusFilter} Reviews</h5>
          <p className="text-muted">
            {statusFilter === 'pending' 
              ? "All reviews have been moderated." 
              : "No reviews found for the selected filter."
            }
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && statusFilter !== 'pending' && (
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
  );
};

export default AdminReviews;