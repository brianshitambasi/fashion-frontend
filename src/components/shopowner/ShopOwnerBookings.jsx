// components/shopowner/Bookings.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShopOwnerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedShop, setSelectedShop] = useState('all');
  const [shops, setShops] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, selectedStatus, selectedShop]);

  const fetchData = async () => {
    try {
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
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.service?.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.shop?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(booking => booking.status === selectedStatus);
    }

    // Shop filter
    if (selectedShop !== 'all') {
      filtered = filtered.filter(booking => booking.shop?._id === selectedShop);
    }

    setFilteredBookings(filtered);
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://hair-salon-app-1.onrender.com/booking/${bookingId}`, {
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local state
      setBookings(bookings.map(booking =>
        booking._id === bookingId ? { ...booking, status: newStatus } : booking
      ));

      alert(`Booking status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status');
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

  const getStatusOptions = (currentStatus) => {
    const allStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    return allStatuses.filter(status => status !== currentStatus);
  };

  const calculateRevenue = () => {
    return bookings
      .filter(b => b.status === 'completed' && b.service)
      .reduce((sum, booking) => sum + (booking.service.price || 0), 0);
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/shopowner/dashboard" className="text-decoration-none">Dashboard</a></li>
              <li className="breadcrumb-item active">Bookings Management</li>
            </ol>
          </nav>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold">Bookings Management</h1>
              <p className="text-muted">Manage and track your salon bookings</p>
            </div>
            <button className="btn btn-primary" onClick={fetchData}>
              <i className="bi bi-arrow-clockwise me-2"></i>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">Search Bookings</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by customer or service..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="input-group-text">
                      <i className="bi bi-search"></i>
                    </span>
                  </div>
                </div>
                
                <div className="col-md-3">
                  <label className="form-label">Filter by Status</label>
                  <select
                    className="form-select"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                
                <div className="col-md-3">
                  <label className="form-label">Filter by Shop</label>
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
                
                <div className="col-md-3 d-flex align-items-end">
                  <button
                    className="btn btn-outline-secondary w-100"
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
          <div className="card">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                Bookings ({filteredBookings.length})
                <small className="text-muted ms-2">
                  Showing {filteredBookings.length} of {bookings.length} bookings
                </small>
              </h5>
              <div className="text-muted">
                Total Revenue: <strong className="text-success">KSh {calculateRevenue().toLocaleString()}</strong>
              </div>
            </div>
            <div className="card-body">
              {filteredBookings.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Shop</th>
                        <th>Service</th>
                        <th>Date & Time</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Payment</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map(booking => (
                        <tr key={booking._id}>
                          <td>
                            <div>
                              <strong>{booking.customer?.name}</strong>
                              <br />
                              <small className="text-muted">{booking.customer?.email}</small>
                              <br />
                              <small className="text-muted">{booking.customer?.phone}</small>
                            </div>
                          </td>
                          <td>
                            <strong>{booking.shop?.name}</strong>
                            <br />
                            <small className="text-muted">{booking.shop?.location}</small>
                          </td>
                          <td>
                            <div>
                              <strong>{booking.service?.serviceName}</strong>
                              <br />
                              <small className="text-muted">60 mins</small>
                            </div>
                          </td>
                          <td>
                            <div>
                              {new Date(booking.dateTime).toLocaleDateString()}
                              <br />
                              <small className="text-muted">
                                {new Date(booking.dateTime).toLocaleTimeString()}
                              </small>
                            </div>
                          </td>
                          <td className="fw-bold text-primary">
                            KSh {booking.service?.price}
                          </td>
                          <td>
                            {getStatusBadge(booking.status)}
                          </td>
                          <td>
                            {booking.payment ? (
                              <span className="badge bg-success">Paid</span>
                            ) : (
                              <span className="badge bg-warning text-dark">Pending</span>
                            )}
                          </td>
                          <td>
                            <div className="dropdown">
                              <button 
                                className="btn btn-sm btn-outline-secondary dropdown-toggle" 
                                type="button" 
                                data-bs-toggle="dropdown"
                              >
                                <i className="bi bi-three-dots"></i>
                              </button>
                              <ul className="dropdown-menu">
                                <li>
                                  <button className="dropdown-item">
                                    <i className="bi bi-eye me-2"></i>
                                    View Details
                                  </button>
                                </li>
                                <li>
                                  <button className="dropdown-item">
                                    <i className="bi bi-chat me-2"></i>
                                    Contact Customer
                                  </button>
                                </li>
                                <li>
                                  <hr className="dropdown-divider" />
                                </li>
                                <li>
                                  <span className="dropdown-item-text fw-bold">Update Status:</span>
                                </li>
                                {getStatusOptions(booking.status).map(status => (
                                  <li key={status}>
                                    <button 
                                      className="dropdown-item"
                                      onClick={() => updateBookingStatus(booking._id, status)}
                                    >
                                      <i className="bi bi-arrow-right me-2"></i>
                                      Mark as {status}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-calendar-x display-1 text-muted"></i>
                  <h4 className="text-muted mt-3">No bookings found</h4>
                  <p className="text-muted">Try adjusting your search filters</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedStatus('all');
                      setSelectedShop('all');
                    }}
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h6 className="card-title">Bookings Overview</h6>
              <div className="row text-center">
                <div className="col-md-2">
                  <div className="border-end">
                    <h4 className="text-primary">{bookings.length}</h4>
                    <small className="text-muted">Total Bookings</small>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="border-end">
                    <h4 className="text-warning">{bookings.filter(b => b.status === 'pending').length}</h4>
                    <small className="text-muted">Pending</small>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="border-end">
                    <h4 className="text-success">{bookings.filter(b => b.status === 'confirmed').length}</h4>
                    <small className="text-muted">Confirmed</small>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="border-end">
                    <h4 className="text-info">{bookings.filter(b => b.status === 'completed').length}</h4>
                    <small className="text-muted">Completed</small>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="border-end">
                    <h4 className="text-danger">{bookings.filter(b => b.status === 'cancelled').length}</h4>
                    <small className="text-muted">Cancelled</small>
                  </div>
                </div>
                <div className="col-md-2">
                  <h4 className="text-success">KSh {calculateRevenue().toLocaleString()}</h4>
                  <small className="text-muted">Total Revenue</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopOwnerBookings;