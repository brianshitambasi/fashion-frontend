import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; // ADD THIS IMPORT

const ShopOwnerDashboard = () => {
  const [stats, setStats] = useState({
    totalShops: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalEarnings: 0,
    averageRating: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // NOW THIS WILL WORK

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [shopsRes, bookingsRes] = await Promise.all([
        axios.get('https://hair-salon-app-1.onrender.com/shop/getMyShops', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('https://hair-salon-app-1.onrender.com/booking', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const shopsData = shopsRes.data;
      const bookingsData = bookingsRes.data;

      // Calculate stats
      const totalEarnings = bookingsData
        .filter(b => b.status === 'completed' && b.service)
        .reduce((sum, booking) => sum + (booking.service.price || 0), 0);

      const pendingBookings = bookingsData.filter(b => b.status === 'pending').length;
      const completedBookings = bookingsData.filter(b => b.status === 'completed').length;

      // Calculate average rating across all shops
      const totalRating = shopsData.reduce((sum, shop) => sum + (shop.rating || 0), 0);
      const averageRating = shopsData.length > 0 ? totalRating / shopsData.length : 0;

      setStats({
        totalShops: shopsData.length,
        totalBookings: bookingsData.length,
        pendingBookings,
        completedBookings,
        totalEarnings,
        averageRating: parseFloat(averageRating.toFixed(1))
      });

      setShops(shopsData);
      setRecentBookings(bookingsData.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'bg-warning text-dark', label: 'Pending' },
      confirmed: { class: 'bg-success', label: 'Confirmed' },
      completed: { class: 'bg-info', label: 'Completed' },
      cancelled: { class: 'bg-danger', label: 'Cancelled' }
    };
    
    const config = statusConfig[status] || { class: 'bg-secondary', label: status };
    return <span className={`badge ${config.class}`}>{config.label}</span>;
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Welcome Section */}
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold">Welcome, {user?.name}! 🏪</h1>
              <p className="text-muted">Manage your hair salons and track your business</p>
            </div>
            <div className="text-end">
              <p className="text-muted mb-1">Business Overview</p>
              <p className="fw-bold mb-0">{stats.totalShops} Salon(s)</p>
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
                  <h4 className="fw-bold">{stats.totalShops}</h4>
                  <p className="mb-0">My Salons</p>
                </div>
                <div className="fs-1">
                  <i className="bi bi-shop"></i>
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
                  <h4 className="fw-bold">{stats.pendingBookings}</h4>
                  <p className="mb-0">Pending</p>
                </div>
                <div className="fs-1">
                  <i className="bi bi-clock"></i>
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
                  <h4 className="fw-bold">{stats.completedBookings}</h4>
                  <p className="mb-0">Completed</p>
                </div>
                <div className="fs-1">
                  <i className="bi bi-check-circle"></i>
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
                  <h4 className="fw-bold">KSh {stats.totalEarnings.toLocaleString()}</h4>
                  <p className="mb-0">Total Earnings</p>
                </div>
                <div className="fs-1">
                  <i className="bi bi-currency-exchange"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-2 col-md-4">
          <div className="card bg-secondary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="fw-bold">{stats.averageRating}</h4>
                  <p className="mb-0">Avg Rating</p>
                </div>
                <div className="fs-1">
                  <i className="bi bi-star"></i>
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
                  <Link to="/shopowner/shops/create" className="card card-hover text-decoration-none">
                    <div className="card-body text-center p-3">
                      <i className="bi bi-plus-circle display-6 text-primary mb-2"></i>
                      <h6>Add Salon</h6>
                      <small className="text-muted">Create new salon</small>
                    </div>
                  </Link>
                </div>
                <div className="col-sm-6 col-md-4 col-lg-2">
                  <Link to="/shopowner/shops" className="card card-hover text-decoration-none">
                    <div className="card-body text-center p-3">
                      <i className="bi bi-shop display-6 text-success mb-2"></i>
                      <h6>My Salons</h6>
                      <small className="text-muted">{stats.totalShops} salons</small>
                    </div>
                  </Link>
                </div>
                <div className="col-sm-6 col-md-4 col-lg-2">
                  <Link to="/shopowner/bookings" className="card card-hover text-decoration-none">
                    <div className="card-body text-center p-3">
                      <i className="bi bi-calendar-check display-6 text-info mb-2"></i>
                      <h6>Bookings</h6>
                      <small className="text-muted">{stats.totalBookings} bookings</small>
                    </div>
                  </Link>
                </div>
                <div className="col-sm-6 col-md-4 col-lg-2">
                  <Link to="/shopowner/hairstyles" className="card card-hover text-decoration-none">
                    <div className="card-body text-center p-3">
                      <i className="bi bi-scissors display-6 text-warning mb-2"></i>
                      <h6>Hairstyles</h6>
                      <small className="text-muted">Manage styles</small>
                    </div>
                  </Link>
                </div>
                <div className="col-sm-6 col-md-4 col-lg-2">
                  <Link to="/shopowner/profile" className="card card-hover text-decoration-none">
                    <div className="card-body text-center p-3">
                      <i className="bi bi-person display-6 text-danger mb-2"></i>
                      <h6>Profile</h6>
                      <small className="text-muted">Account settings</small>
                    </div>
                  </Link>
                </div>
                <div className="col-sm-6 col-md-4 col-lg-2">
                  <Link to="/shopowner/settings" className="card card-hover text-decoration-none">
                    <div className="card-body text-center p-3">
                      <i className="bi bi-gear display-6 text-secondary mb-2"></i>
                      <h6>Settings</h6>
                      <small className="text-muted">Business settings</small>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* My Salons */}
        <div className="col-lg-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">My Salons</h5>
              <Link to="/shopowner/shops" className="btn btn-sm btn-outline-primary">
                View All
              </Link>
            </div>
            <div className="card-body">
              {shops.length > 0 ? (
                <div className="list-group list-group-flush">
                  {shops.slice(0, 3).map(shop => (
                    <div key={shop._id} className="list-group-item border-0 px-0">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="mb-0">{shop.name}</h6>
                            {shop.rating > 0 && (
                              <span className="badge bg-warning text-dark">
                                <i className="bi bi-star-fill me-1"></i>
                                {shop.rating.toFixed(1)}
                              </span>
                            )}
                          </div>
                          <p className="text-muted small mb-1">
                            <i className="bi bi-geo-alt me-1"></i>
                            {shop.location}
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                              {shop.services?.length || 0} services
                            </small>
                            <small className="text-muted">
                              {shop.reviews?.length || 0} reviews
                            </small>
                          </div>
                        </div>
                        <Link 
                          to={`/shopowner/shops/edit/${shop._id}`}
                          className="btn btn-sm btn-outline-secondary ms-3"
                        >
                          <i className="bi bi-pencil"></i>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="bi bi-shop display-6 text-muted"></i>
                  <p className="text-muted mt-3">No salons yet</p>
                  <Link to="/shopowner/shops/create" className="btn btn-primary">
                    Add Your First Salon
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="col-lg-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Bookings</h5>
              <Link to="/shopowner/bookings" className="btn btn-sm btn-outline-primary">
                View All
              </Link>
            </div>
            <div className="card-body">
              {recentBookings.length > 0 ? (
                <div className="list-group list-group-flush">
                  {recentBookings.map(booking => (
                    <div key={booking._id} className="list-group-item border-0 px-0">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <h6 className="mb-0">{booking.service?.serviceName}</h6>
                            {getStatusBadge(booking.status)}
                          </div>
                          <p className="text-muted small mb-1">
                            {booking.customer?.name} • {booking.shop?.name}
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                              {new Date(booking.dateTime).toLocaleDateString()}
                            </small>
                            <small className="fw-bold text-primary">
                              KSh {booking.service?.price}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="bi bi-calendar-x display-6 text-muted"></i>
                  <p className="text-muted mt-3">No bookings yet</p>
                  <p className="text-muted small">Bookings will appear here when customers book your services</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-white">
              <h5 className="mb-0">Business Performance</h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-md-3">
                  <div className="border-end">
                    <h4 className="text-primary">{stats.totalBookings}</h4>
                    <small className="text-muted">Total Bookings</small>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="border-end">
                    <h4 className="text-success">
                      {stats.totalBookings > 0 
                        ? Math.round((stats.completedBookings / stats.totalBookings) * 100)
                        : 0
                      }%
                    </h4>
                    <small className="text-muted">Completion Rate</small>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="border-end">
                    <h4 className="text-info">KSh {stats.totalEarnings.toLocaleString()}</h4>
                    <small className="text-muted">Total Revenue</small>
                  </div>
                </div>
                <div className="col-md-3">
                  <h4 className="text-warning">
                    {stats.totalShops > 0 ? Math.round(stats.totalBookings / stats.totalShops) : 0}
                  </h4>
                  <small className="text-muted">Bookings per Salon</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 

export default ShopOwnerDashboard;