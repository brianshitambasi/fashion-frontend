// components/admin/AdminAnnouncements.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = "https://hair-salon-app-1.onrender.com";

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BACKEND_URL}/admin/announcements`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnnouncements(response.data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
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
      <h1 className="h2 fw-bold text-primary mb-4">Announcements</h1>
      
      <div className="card shadow">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">System Announcements</h5>
          <button className="btn btn-primary">Create Announcement</button>
        </div>
        <div className="card-body">
          <div className="row">
            {announcements.map((announcement) => (
              <div key={announcement._id} className="col-md-6 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{announcement.title}</h5>
                    <p className="card-text">{announcement.message}</p>
                    <div className="d-flex justify-content-between">
                      <small className="text-muted">
                        By: {announcement.sentBy?.name}
                      </small>
                      <small className="text-muted">
                        {new Date(announcement.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnnouncements;