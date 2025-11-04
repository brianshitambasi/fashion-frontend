// src/components/admin/AdminUsers.jsx
import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";

const AdminUsers = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalShops: 0,
    totalProducts: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use mock data instead of API calls
    const mockStats = {
      totalUsers: 1250,
      totalShops: 89,
      totalProducts: 456,
      totalRevenue: 12560
    };
    
    setStats(mockStats);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="container-fluid">
          <div className="text-center">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container-fluid">
        <h3 className="mb-4">👥 Manage Users</h3>
        
        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <h5>Total Users</h5>
                <h3>{stats.totalUsers}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card bg-success text-white">
              <div className="card-body">
                <h5>Total Shops</h5>
                <h3>{stats.totalShops}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card bg-info text-white">
              <div className="card-body">
                <h5>Total Products</h5>
                <h3>{stats.totalProducts}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card bg-warning text-white">
              <div className="card-body">
                <h5>Total Revenue</h5>
                <h3>${stats.totalRevenue}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            <p>Here you can view, edit, or delete registered users.</p>
            <div className="alert alert-info">
              <small>
                <strong>Note:</strong> Backend API endpoints are not available. 
                Currently displaying mock data for demonstration.
              </small>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;