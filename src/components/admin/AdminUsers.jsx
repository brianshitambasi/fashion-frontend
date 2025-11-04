// src/components/admin/AdminUsers.jsx
import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import userService from "../../services/userService";
import shopService from "../../services/shopService";
import productService from "../../services/productService";

const AdminUsers = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalShops: 0,
    totalProducts: 0,
    totalRevenue: 0
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      // Try to fetch real data, fallback to mock if API not available
      let usersData = [], shopsData = [], productsData = [];

      try {
        usersData = await userService.getAllUsers();
      } catch (userErr) {
        console.warn('Users API not available:', userErr.message);
      }

      try {
        shopsData = await shopService.getAllShops();
      } catch (shopErr) {
        console.warn('Shops API not available:', shopErr.message);
      }

      try {
        productsData = await productService.getAllProducts();
      } catch (productErr) {
        console.warn('Products API not available:', productErr.message);
      }

      setStats({
        totalUsers: usersData.length || 0,
        totalShops: shopsData.length || 0,
        totalProducts: productsData.length || 0,
        totalRevenue: calculateRevenue(productsData)
      });

      setUsers(usersData || []);

    } catch (err) {
      setError('Failed to fetch data: ' + (err.message || 'Please check backend connection'));
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateRevenue = (products) => {
    if (!products || !Array.isArray(products)) return 0;
    return products.reduce((total, product) => {
      const price = product.price || 0;
      const stock = product.stock || 0;
      return total + (price * stock);
    }, 0) / 100; // Convert cents to dollars
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(userId);
        setUsers(users.filter(user => user._id !== userId));
        setStats(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
        alert('User deleted successfully');
      } catch (err) {
        alert('Failed to delete user: ' + (err.message || 'Please check backend connection'));
        console.error('Error deleting user:', err);
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="container-fluid">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading dashboard data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container-fluid">
        <h3 className="mb-4">👥 Manage Users</h3>
        
        {error && (
          <div className="alert alert-warning">
            <strong>Note:</strong> {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <h5>Total Users</h5>
                <h3>{stats.totalUsers}</h3>
                <small>Registered accounts</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card bg-success text-white">
              <div className="card-body">
                <h5>Total Shops</h5>
                <h3>{stats.totalShops}</h3>
                <small>Active salons</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card bg-info text-white">
              <div className="card-body">
                <h5>Total Products</h5>
                <h3>{stats.totalProducts}</h3>
                <small>Hairstyles & services</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card bg-warning text-white">
              <div className="card-body">
                <h5>Inventory Value</h5>
                <h3>${stats.totalRevenue.toLocaleString()}</h3>
                <small>Total product value</small>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="card shadow-sm">
          <div className="card-header bg-light d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Registered Users</h5>
            <button 
              className="btn btn-primary btn-sm"
              onClick={fetchData}
              disabled={loading}
            >
              <i className="bi bi-arrow-clockwise me-1"></i>
              Refresh
            </button>
          </div>
          <div className="card-body">
            {users.length === 0 ? (
              <div className="text-center py-4">
                <i className="bi bi-people display-4 text-muted mb-3"></i>
                <p className="text-muted">No users found in the database</p>
                <small className="text-muted">
                  This could mean the users API endpoint is not yet implemented.
                </small>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" 
                                 style={{width: '35px', height: '35px'}}>
                              <span className="text-white fw-bold">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                              </span>
                            </div>
                            {user.name || 'N/A'}
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>{user.phone || 'N/A'}</td>
                        <td>
                          <span className={`badge ${
                            user.role === 'admin' ? 'bg-danger' :
                            user.role === 'shopowner' ? 'bg-warning' :
                            'bg-primary'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button className="btn btn-outline-primary">
                              <i className="bi bi-eye"></i>
                            </button>
                            <button className="btn btn-outline-secondary">
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="btn btn-outline-danger"
                              disabled={user.role === 'admin'}
                              title={user.role === 'admin' ? 'Cannot delete admin users' : 'Delete user'}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;