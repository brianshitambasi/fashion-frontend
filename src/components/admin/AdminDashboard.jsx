// components/admin/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalShops: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingShops: 0,
    activeBookings: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch all data in parallel
      const [usersRes, shopsRes, bookingsRes, paymentsRes] = await Promise.all([
        axios.get('https://hair-salon-app-1.onrender.com/user/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ data: [] })),
        axios.get('https://hair-salon-app-1.onrender.com/shop', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('https://hair-salon-app-1.onrender.com/booking', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('https://hair-salon-app-1.onrender.com/payment', {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ data: [] }))
      ]);

      const users = usersRes.data;
      const shops = shopsRes.data;
      const bookings = bookingsRes.data;
      const payments = paymentsRes.data;

      // Calculate stats
      const totalRevenue = payments
        .filter(p => p.status === 'success')
        .reduce((sum, payment) => sum + (payment.amount || 0), 0);

      const pendingShops = shops.filter(shop => !shop.approved).length;
      const activeBookings = bookings.filter(b => 
        ['pending', 'confirmed'].includes(b.status)
      ).length;

      setStats({
        totalUsers: users.length,
        totalShops: shops.length,
        totalBookings: bookings.length,
        totalRevenue: totalRevenue,
        pendingShops: pendingShops,
        activeBookings: activeBookings
      });

      // Recent activities (combine recent users, shops, and bookings)
      const recentUsers = users
        .slice(0, 3)
        .map(user => ({
          type: 'user',
          action: 'registered',
          name: user.name,
          role: user.role,
          date: user.createdAt,
          id: user._id
        }));

      const recentShops = shops
        .slice(0, 3)
        .map(shop => ({
          type: 'shop',
          action: 'created',
          name: shop.name,
          owner: shop.owner?.name,
          date: shop.createdAt,
          id: shop._id
        }));

      const recentBookings = bookings
        .slice(0, 3)
        .map(booking => ({
          type: 'booking',
          action: 'created',
          service: booking.service?.serviceName,
          customer: booking.customer?.name,
          date: booking.createdAt,
          id: booking._id
        }));

      const allActivities = [...recentUsers, ...recentShops, ...recentBookings]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

      setRecentActivities(allActivities);
    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user': return 'bi-person-plus';
      case 'shop': return 'bi-shop';
      case 'booking': return 'bi-calendar-check';
      default: return 'bi-activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'user': return 'text-primary';
      case 'shop': return 'text-success';
      case 'booking': return 'text-warning';
      default: return 'text-secondary';
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold">Admin Dashboard</h1>
              <p className="text-muted">Manage your hair salon platform</p>
            </div>
            <div className="text-end">
              <p className="text-muted mb-1">System Overview</p>
              <p className="fw-bold mb-0">Last updated: {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        <div className="col-xl-2 col-md-4">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="fw-bold">{stats.totalUsers}</h4>
                  <p className="mb-0">Total Users</p>
                </div>
                <div className="fs-1">
                  <i className="bi bi-people"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-2 col-md-4">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="fw-bold">{stats.totalShops}</h4>
                  <p className="mb-0">Total Shops</p>
                </div>
                <div className="fs-1">
                  <i className="bi bi-shop"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-2 col-md-4">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="fw-bold">{stats.totalBookings}</h4>
                  <p className="mb-0">Total Bookings</p>
                </div>
                <div className="fs-1">
                  <i className="bi bi-calendar-check"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-2 col-md-4">
          <div className="card bg-warning text-dark">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="fw-bold">{stats.activeBookings}</h4>
                  <p className="mb-0">Active Bookings</p>
                </div>
                <div className="fs-1">
                  <i className="bi bi-clock"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-2 col-md-4">
          <div className="card bg-danger text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="fw-bold">{stats.pendingShops}</h4>
                  <p className="mb-0">Pending Shops</p>
                </div>
                <div className="fs-1">
                  <i className="bi bi-exclamation-triangle"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-2 col-md-4">
          <div className="card bg-dark text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="fw-bold">KSh {stats.totalRevenue.toLocaleString()}</h4>
                  <p className="mb-0">Total Revenue</p>
                </div>
                <div className="fs-1">
                  <i className="bi bi-currency-exchange"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mb-5">
        <div className="col">
          <div className="card">
            <div className="card-header bg-white">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-sm-6 col-md-4 col-lg-2">
                  <Link to="/admin/users" className="card card-hover text-decoration-none">
                    <div className="card-body text-center p-3">
                      <i className="bi bi-people display-6 text-primary mb-2"></i>
                      <h6>Manage Users</h6>
                      <small className="text-muted">{stats.totalUsers} users</small>
                    </div>
                  </Link>
                </div>
                <div className="col-sm-6 col-md-4 col-lg-2">
                  <Link to="/admin/shops" className="card card-hover text-decoration-none">
                    <div className="card-body text-center p-3">
                      <i className="bi bi-shop display-6 text-success mb-2"></i>
                      <h6>Manage Shops</h6>
                      <small className="text-muted">{stats.totalShops} shops</small>
                    </div>
                  </Link>
                </div>
                <div className="col-sm-6 col-md-4 col-lg-2">
                  <Link to="/admin/bookings" className="card card-hover text-decoration-none">
                    <div className="card-body text-center p-3">
                      <i className="bi bi-calendar-check display-6 text-info mb-2"></i>
                      <h6>View Bookings</h6>
                      <small className="text-muted">{stats.totalBookings} bookings</small>
                    </div>
                  </Link>
                </div>
                <div className="col-sm-6 col-md-4 col-lg-2">
                  <div className="card card-hover text-decoration-none">
                    <div className="card-body text-center p-3">
                      <i className="bi bi-credit-card display-6 text-warning mb-2"></i>
                      <h6>Payments</h6>
                      <small className="text-muted">View transactions</small>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-md-4 col-lg-2">
                  <div className="card card-hover text-decoration-none">
                    <div className="card-body text-center p-3">
                      <i className="bi bi-bar-chart display-6 text-danger mb-2"></i>
                      <h6>Analytics</h6>
                      <small className="text-muted">View reports</small>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-md-4 col-lg-2">
                  <div className="card card-hover text-decoration-none">
                    <div className="card-body text-center p-3">
                      <i className="bi bi-gear display-6 text-secondary mb-2"></i>
                      <h6>Settings</h6>
                      <small className="text-muted">System config</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Recent Activities */}
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Activities</h5>
              <button className="btn btn-sm btn-outline-primary" onClick={fetchDashboardData}>
                <i className="bi bi-arrow-clockwise"></i>
              </button>
            </div>
            <div className="card-body">
              {recentActivities.length > 0 ? (
                <div className="list-group list-group-flush">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="list-group-item border-0 px-0">
                      <div className="d-flex align-items-center">
                        <div className={`flex-shrink-0 ${getActivityColor(activity.type)} me-3`}>
                          <i className={`bi ${getActivityIcon(activity.type)} fs-4`}></i>
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="mb-1">
                                {activity.type === 'user' && `New ${activity.role} registered: ${activity.name}`}
                                {activity.type === 'shop' && `New shop created: ${activity.name} by ${activity.owner}`}
                                {activity.type === 'booking' && `New booking: ${activity.service} by ${activity.customer}`}
                              </h6>
                              <small className="text-muted">
                                {new Date(activity.date).toLocaleString()}
                              </small>
                            </div>
                            <span className={`badge ${
                              activity.type === 'user' ? 'bg-primary' :
                              activity.type === 'shop' ? 'bg-success' : 'bg-warning'
                            }`}>
                              {activity.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="bi bi-activity display-1 text-muted"></i>
                  <p className="text-muted mt-3">No recent activities</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header bg-white">
              <h5 className="mb-0">System Status</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Server Status</span>
                  <span className="badge bg-success">Online</span>
                </div>
                <div className="progress" style={{height: '6px'}}>
                  <div className="progress-bar bg-success" style={{width: '100%'}}></div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Database</span>
                  <span className="badge bg-success">Connected</span>
                </div>
                <div className="progress" style={{height: '6px'}}>
                  <div className="progress-bar bg-success" style={{width: '100%'}}></div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>API Services</span>
                  <span className="badge bg-success">Active</span>
                </div>
                <div className="progress" style={{height: '6px'}}>
                  <div className="progress-bar bg-success" style={{width: '100%'}}></div>
                </div>
              </div>

              <div className="mt-4">
                <h6>Quick Stats</h6>
                <div className="row text-center">
                  <div className="col-6">
                    <div className="border-end">
                      <div className="text-primary fw-bold">{Math.round((stats.totalBookings / Math.max(stats.totalUsers, 1)) * 100) / 100}</div>
                      <small className="text-muted">Bookings/User</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div>
                      <div className="text-success fw-bold">{stats.totalShops > 0 ? Math.round(stats.totalBookings / stats.totalShops) : 0}</div>
                      <small className="text-muted">Bookings/Shop</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Actions */}
          {stats.pendingShops > 0 && (
            <div className="card mt-4 border-warning">
              <div className="card-header bg-warning text-dark">
                <h6 className="mb-0">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Pending Actions
                </h6>
              </div>
              <div className="card-body">
                <div className="alert alert-warning mb-0">
                  <strong>{stats.pendingShops} shops</strong> need approval
                  <div className="mt-2">
                    <Link to="/admin/shops" className="btn btn-sm btn-warning">
                      Review Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;