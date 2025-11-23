// components/admin/AdminAnalytics.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = "https://hair-salon-app-1.onrender.com";

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BACKEND_URL}/admin/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
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
      <h1 className="h2 fw-bold text-primary mb-4">Analytics & Reports</h1>
      
      <div className="row">
        <div className="col-md-6">
          <div className="card shadow mb-4">
            <div className="card-header">
              <h5 className="mb-0">User Registrations</h5>
            </div>
            <div className="card-body">
              {analytics.userRegistrations?.map((item) => (
                <div key={item._id} className="d-flex justify-content-between mb-2">
                  <span>{item._id}</span>
                  <span className="badge bg-primary">{item.count} users</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card shadow mb-4">
            <div className="card-header">
              <h5 className="mb-0">Booking Analytics</h5>
            </div>
            <div className="card-body">
              {analytics.bookingAnalytics?.map((item) => (
                <div key={item._id} className="d-flex justify-content-between mb-2">
                  <span>{item._id}</span>
                  <div>
                    <span className="badge bg-success me-2">{item.count} bookings</span>
                    <span className="badge bg-info">KSh {item.revenue?.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;