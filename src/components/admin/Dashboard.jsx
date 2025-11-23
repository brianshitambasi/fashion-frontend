// components/admin/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = "https://hair-salon-app-1.onrender.com";

const Dashboard  = () => {
  const [stats, setStats] = useState({});
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BACKEND_URL}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setStats(response.data.stats);
      setRecentBookings(response.data.recentBookings || []);
      setRecentUsers(response.data.recentUsers || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
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
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="h2 fw-bold text-primary">Admin Dashboard</h1>
          <p className="text-muted">Manage your beauty hub platform</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Total Users
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.totalUsers}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="bi bi-people fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Total Shops
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.totalShops}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="bi bi-shop fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-info shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Total Bookings
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.totalBookings}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="bi bi-calendar-check fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Pending Reviews
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.pendingReviews}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="bi bi-star fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Cards */}
      <div className="row mb-4">
        <div className="col-xl-4 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Total Revenue
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    KSh {stats.totalRevenue?.toLocaleString()}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="bi bi-currency-dollar fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Total Commission
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    KSh {stats.totalCommission?.toLocaleString()}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="bi bi-graph-up fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-md-6 mb-4">
          <div className="card border-left-info shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Quick Actions
                  </div>
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <Link to="/admin/users" className="btn btn-sm btn-primary me-2">
                        Manage Users
                      </Link>
                      <Link to="/admin/reviews/pending" className="btn btn-sm btn-warning">
                        Review Moderation
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="row">
        {/* Recent Bookings */}
        <div className="col-xl-6 col-lg-6">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">Recent Bookings</h6>
              <Link to="/admin/bookings" className="btn btn-sm btn-outline-primary">
                View All
              </Link>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered" width="100%" cellSpacing="0">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Shop</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr key={booking._id}>
                        <td>{booking.customer?.name}</td>
                        <td>{booking.shop?.name}</td>
                        <td>
                          <span className={`badge ${
                            booking.status === 'confirmed' ? 'bg-success' :
                            booking.status === 'pending' ? 'bg-warning' :
                            booking.status === 'cancelled' ? 'bg-danger' :
                            'bg-secondary'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Users */}
        <div className="col-xl-6 col-lg-6">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">Recent Users</h6>
              <Link to="/admin/users" className="btn btn-sm btn-outline-primary">
                View All
              </Link>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered" width="100%" cellSpacing="0">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((user) => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`badge ${
                            user.role === 'admin' ? 'bg-danger' :
                            user.role === 'shop' ? 'bg-info' :
                            'bg-success'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Quick Access</h6>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-md-3 mb-3">
                  <Link to="/admin/users" className="btn btn-outline-primary btn-lg w-100">
                    <i className="bi bi-people me-2"></i>
                    Users
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <Link to="/admin/shops" className="btn btn-outline-success btn-lg w-100">
                    <i className="bi bi-shop me-2"></i>
                    Shops
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <Link to="/admin/bookings" className="btn btn-outline-info btn-lg w-100">
                    <i className="bi bi-calendar-check me-2"></i>
                    Bookings
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <Link to="/admin/reviews" className="btn btn-outline-warning btn-lg w-100">
                    <i className="bi bi-star me-2"></i>
                    Reviews
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <Link to="/admin/payments" className="btn btn-outline-dark btn-lg w-100">
                    <i className="bi bi-credit-card me-2"></i>
                    Payments
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <Link to="/admin/announcements" className="btn btn-outline-secondary btn-lg w-100">
                    <i className="bi bi-megaphone me-2"></i>
                    Announcements
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <Link to="/admin/analytics" className="btn btn-outline-danger btn-lg w-100">
                    <i className="bi bi-graph-up me-2"></i>
                    Analytics
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <Link to="/admin/activities" className="btn btn-outline-primary btn-lg w-100">
                    <i className="bi bi-clock-history me-2"></i>
                    Activity Log
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;