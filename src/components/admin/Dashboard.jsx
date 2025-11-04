// src/components/admin/Dashboard.jsx
import React from "react";
import AdminLayout from "./AdminLayout";

const Dashboard = () => {
  // Mock data for demonstration
  const dashboardStats = {
    totalUsers: 1250,
    totalShops: 89,
    totalBookings: 2341,
    totalRevenue: 45678,
    recentActivities: [
      "New user 'John Doe' registered",
      "Shop 'Beauty Salon' was added",
      "Booking #1234 completed",
      "User 'Jane Smith' updated profile"
    ]
  };

  return (
    <AdminLayout>
      <div className="container-fluid">
        <h3 className="mb-4">📊 Admin Dashboard</h3>
        
        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-3 mb-4">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <h5>Total Users</h5>
                <h3>{dashboardStats.totalUsers}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="card bg-success text-white">
              <div className="card-body">
                <h5>Total Shops</h5>
                <h3>{dashboardStats.totalShops}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="card bg-info text-white">
              <div className="card-body">
                <h5>Total Bookings</h5>
                <h3>{dashboardStats.totalBookings}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="card bg-warning text-white">
              <div className="card-body">
                <h5>Revenue</h5>
                <h3>${dashboardStats.totalRevenue}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5>Recent Activities</h5>
              </div>
              <div className="card-body">
                <ul className="list-group">
                  {dashboardStats.recentActivities.map((activity, index) => (
                    <li key={index} className="list-group-item">
                      {activity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5>Quick Actions</h5>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <button className="btn btn-outline-primary">Manage Users</button>
                  <button className="btn btn-outline-success">View Shops</button>
                  <button className="btn btn-outline-info">Check Bookings</button>
                  <button className="btn btn-outline-warning">Generate Reports</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;