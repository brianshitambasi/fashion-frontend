// components/admin/AdminActivities.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = "https://hair-salon-app-1.onrender.com";

const AdminActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BACKEND_URL}/admin/activities`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActivities(response.data.activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
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
      <h1 className="h2 fw-bold text-primary mb-4">Admin Activity Log</h1>
      
      <div className="card shadow">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Admin</th>
                  <th>Action</th>
                  <th>Resource</th>
                  <th>Details</th>
                  <th>Date</th>
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={activity._id}>
                    <td>{activity.admin?.name}</td>
                    <td>
                      <span className="badge bg-info text-capitalize">
                        {activity.action.replace('_', ' ')}
                      </span>
                    </td>
                    <td>{activity.resource}</td>
                    <td>
                      {activity.details && (
                        <small className="text-muted">
                          {JSON.stringify(activity.details)}
                        </small>
                      )}
                    </td>
                    <td>{new Date(activity.createdAt).toLocaleString()}</td>
                    <td>
                      <code>{activity.ipAddress}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminActivities;