// components/shopowner/Bookings.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShopOwnerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedShop, setSelectedShop] = useState('all');
  const [shops, setShops] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    revenue: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterBookings();
    calculateStats();
  }, [bookings, searchTerm, selectedStatus, selectedShop]);

  const fetchData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      
      const token = localStorage.getItem('token');
      const [bookingsRes, shopsRes] = await Promise.all([
        axios.get('https://hair-salon-app-1.onrender.com/booking', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('https://hair-salon-app-1.onrender.com/shop/getMyShops', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setBookings(bookingsRes.data);
      setShops(shopsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load bookings data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;

    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.service?.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.shop?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(booking => booking.status === selectedStatus);
    }

    if (selectedShop !== 'all') {
      filtered = filtered.filter(booking => booking.shop?._id === selectedShop);
    }

    setFilteredBookings(filtered);
  };

  const calculateStats = () => {
    const total = bookings.length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const cancelled = bookings.filter(b => b.status === 'cancelled').length;
    const revenue = bookings
      .filter(b => b.status === 'completed' && b.service)
      .reduce((sum, booking) => sum + (booking.service.price || 0), 0);

    setStats({ total, pending, confirmed, completed, cancelled, revenue });
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://hair-salon-app-1.onrender.com/booking/${bookingId}`, {
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setBookings(bookings.map(booking =>
        booking._id === bookingId ? { ...booking, status: newStatus } : booking
      ));

      // Show success toast notification
      showNotification(`Booking status updated to ${newStatus}`, 'success');
    } catch (error) {
      console.error('Error updating booking status:', error);
      showNotification('Failed to update booking status', 'error');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'bg-warning text-dark', icon: '⏳', label: 'Pending' },
      confirmed: { class: 'bg-primary', icon: '✅', label: 'Confirmed' },
      completed: { class: 'bg-success', icon: '🎉', label: 'Completed' },
      cancelled: { class: 'bg-danger', icon: '❌', label: 'Cancelled' }
    };
    
    const config = statusConfig[status] || { class: 'bg-secondary', icon: '', label: status };
    return (
      <span className={`badge ${config.class} d-flex align-items-center gap-1`}>
        <span>{config.icon}</span>
        {config.label}
      </span>
    );
  };

  const getStatusOptions = (currentStatus) => {
    const statusFlow = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['completed', 'cancelled'],
      completed: [],
      cancelled: ['confirmed']
    };
    return statusFlow[currentStatus] || [];
  };

  const showNotification = (message, type = 'info') => {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-bg-${type === 'error' ? 'danger' : type} border-0 show`;
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    `;
    
    const container = document.getElementById('toast-container');
    container.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Toast Container */}
      <div id="toast-container" className="toast-container position-fixed top-0 end-0 p-3"></div>

      {/* Header Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h1 className="h2 fw-bold text-dark mb-1">Bookings Management</h1>
              <p className="text-muted mb-0">Manage and track your salon appointments</p>
            </div>
            <button 
              className={`btn btn-primary d-flex align-items-center ${refreshing ? 'disabled' : ''}`}
              onClick={() => fetchData(true)}
              disabled={refreshing}
            >
              <i className={`bi ${refreshing ? 'bi-arrow-clockwise spin' : 'bi-arrow-clockwise'} me-2`}></i>
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/shopowner/dashboard" className="text-decoration-none text-muted">
                  <i className="bi bi-house me-1"></i>Dashboard
                </a>
              </li>
              <li className="breadcrumb-item active text-primary">Bookings</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="row g-3">
            <div className="col-md-2 col-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center">
                  <div className="text-primary mb-2">
                    <i className="bi bi-calendar-check fs-2"></i>
                  </div>
                  <h3 className="fw-bold text-dark">{stats.total}</h3>
                  <p className="text-muted small mb-0">Total Bookings</p>
                </div>
              </div>
            </div>
            <div className="col-md-2 col-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center">
                  <div className="text-warning mb-2">
                    <i className="bi bi-clock fs-2"></i>
                  </div>
                  <h3 className="fw-bold text-dark">{stats.pending}</h3>
                  <p className="text-muted small mb-0">Pending</p>
                </div>
              </div>
            </div>
            <div className="col-md-2 col-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center">
                  <div className="text-success mb-2">
                    <i className="bi bi-check-circle fs-2"></i>
                  </div>
                  <h3 className="fw-bold text-dark">{stats.confirmed}</h3>
                  <p className="text-muted small mb-0">Confirmed</p>
                </div>
              </div>
            </div>
            <div className="col-md-2 col-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center">
                  <div className="text-info mb-2">
                    <i className="bi bi-star fs-2"></i>
                  </div>
                  <h3 className="fw-bold text-dark">{stats.completed}</h3>
                  <p className="text-muted small mb-0">Completed</p>
                </div>
              </div>
            </div>
            <div className="col-md-2 col-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center">
                  <div className="text-danger mb-2">
                    <i className="bi bi-x-circle fs-2"></i>
                  </div>
                  <h3 className="fw-bold text-dark">{stats.cancelled}</h3>
                  <p className="text-muted small mb-0">Cancelled</p>
                </div>
              </div>
            </div>
            <div className="col-md-2 col-6">
              <div className="card border-0 shadow-sm h-100 bg-success text-white">
                <div className="card-body text-center">
                  <div className="mb-2">
                    <i className="bi bi-currency-dollar fs-2"></i>
                  </div>
                  <h3 className="fw-bold">KSh {stats.revenue.toLocaleString()}</h3>
                  <p className="small mb-0 opacity-75">Total Revenue</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Card */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 d-flex align-items-center">
                <i className="bi bi-funnel me-2 text-primary"></i>
                Filter Bookings
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-lg-4 col-md-6">
                  <label className="form-label fw-semibold">Search</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-search text-muted"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Search customers, services..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="col-lg-3 col-md-6">
                  <label className="form-label fw-semibold">Status</label>
                  <select
                    className="form-select"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                
                <div className="col-lg-3 col-md-6">
                  <label className="form-label fw-semibold">Shop</label>
                  <select
                    className="form-select"
                    value={selectedShop}
                    onChange={(e) => setSelectedShop(e.target.value)}
                  >
                    <option value="all">All Shops</option>
                    {shops.map(shop => (
                      <option key={shop._id} value={shop._id}>{shop.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-lg-2 col-md-6 d-flex align-items-end">
                  <button
                    className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedStatus('all');
                      setSelectedShop('all');
                    }}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 d-flex align-items-center">
                <i className="bi bi-list-check me-2 text-primary"></i>
                Bookings
                <span className="badge bg-primary ms-2">{filteredBookings.length}</span>
              </h5>
              <div className="text-muted">
                Showing {filteredBookings.length} of {bookings.length} bookings
              </div>
            </div>
            
            <div className="card-body p-0">
              {filteredBookings.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="ps-4">Customer & Service</th>
                        <th>Shop</th>
                        <th>Date & Time</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Payment</th>
                        <th className="text-end pe-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map(booking => {
                        const { date, time } = formatDate(booking.dateTime);
                        return (
                        <tr key={booking._id} className="border-bottom">
                          <td className="ps-4">
                            <div className="d-flex align-items-start">
                              <div className="flex-shrink-0">
                                <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                                  <i className="bi bi-person text-primary"></i>
                                </div>
                              </div>
                              <div className="flex-grow-1 ms-3">
                                <h6 className="mb-1 fw-semibold">{booking.customer?.name || 'N/A'}</h6>
                                <p className="text-muted small mb-1">{booking.service?.serviceName || 'N/A'}</p>
                                <small className="text-muted">{booking.customer?.phone || 'No phone'}</small>
                              </div>
                            </div>
                          </td>
                          
                          <td>
                            <div>
                              <strong className="d-block">{booking.shop?.name || 'N/A'}</strong>
                              <small className="text-muted">{booking.shop?.location || 'No location'}</small>
                            </div>
                          </td>
                          
                          <td>
                            <div>
                              <strong className="d-block">{date}</strong>
                              <small className="text-muted">{time}</small>
                            </div>
                          </td>
                          
                          <td>
                            <span className="fw-bold text-success">
                              KSh {booking.service?.price?.toLocaleString() || '0'}
                            </span>
                          </td>
                          
                          <td>
                            {getStatusBadge(booking.status)}
                          </td>
                          
                          <td>
                            {booking.payment ? (
                              <span className="badge bg-success d-flex align-items-center gap-1">
                                <i className="bi bi-check-circle"></i> Paid
                              </span>
                            ) : (
                              <span className="badge bg-warning text-dark d-flex align-items-center gap-1">
                                <i className="bi bi-clock"></i> Pending
                              </span>
                            )}
                          </td>
                          
                          <td className="text-end pe-4">
                            <div className="dropdown">
                              <button 
                                className="btn btn-sm btn-outline-primary dropdown-toggle" 
                                type="button" 
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                Actions
                              </button>
                              <ul className="dropdown-menu dropdown-menu-end shadow">
                                <li>
                                  <button className="dropdown-item text-primary">
                                    <i className="bi bi-eye me-2"></i>
                                    View Details
                                  </button>
                                </li>
                                <li>
                                  <button className="dropdown-item text-info">
                                    <i className="bi bi-chat me-2"></i>
                                    Contact Customer
                                  </button>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                  <span className="dropdown-item-text fw-bold text-dark">Update Status:</span>
                                </li>
                                {getStatusOptions(booking.status).map(status => (
                                  <li key={status}>
                                    <button 
                                      className="dropdown-item text-dark"
                                      onClick={() => updateBookingStatus(booking._id, status)}
                                    >
                                      <i className="bi bi-arrow-right me-2"></i>
                                      Mark as {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </td>
                        </tr>
                      )})}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <div className="py-4">
                    <i className="bi bi-calendar-x display-1 text-muted opacity-50"></i>
                    <h4 className="text-muted mt-3">No bookings found</h4>
                    <p className="text-muted mb-4">Try adjusting your search criteria or filters</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedStatus('all');
                        setSelectedShop('all');
                      }}
                    >
                      <i className="bi bi-filter-circle me-2"></i>
                      Clear All Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .card {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .card:hover {
          transform: translateY(-2px);
        }
        .table tbody tr {
          transition: background-color 0.15s ease-in-out;
        }
        .table tbody tr:hover {
          background-color: rgba(0, 0, 0, 0.02);
        }
      `}</style>
    </div>
  );
};

export default ShopOwnerBookings;