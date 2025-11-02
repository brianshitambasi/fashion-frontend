// components/admin/Users.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, selectedRole, selectedStatus]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Since we don't have a specific admin users endpoint, we'll use the regular users endpoint
      // In a real app, you'd have an admin endpoint that returns all users
      const response = await axios.get('https://hair-salon-app-1.onrender.com/user/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(async () => {
        // Fallback: Try to get users from other endpoints or use mock data
        return { data: [] };
      });

      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      // For demo purposes, let's create some mock data
      setUsers([
        {
          _id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+254712345678',
          role: 'customer',
          active: true,
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+254712345679',
          role: 'shopowner',
          active: true,
          createdAt: new Date().toISOString()
        },
        {
          _id: '3',
          name: 'Admin User',
          email: 'admin@example.com',
          phone: '+254712345670',
          role: 'admin',
          active: true,
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(user => 
        selectedStatus === 'active' ? user.active : !user.active
      );
    }

    setFilteredUsers(filtered);
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    if (!window.confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this user?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      // In a real app, you'd have an endpoint to update user status
      // await axios.put(`/api/admin/users/${userId}`, { active: !currentStatus });
      
      // For now, update locally
      setUsers(users.map(user => 
        user._id === userId ? { ...user, active: !currentStatus } : user
      ));
      
      alert(`User ${currentStatus ? 'deactivated' : 'activated'} successfully`);
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Failed to update user status');
    }
  };

  const deleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      // In a real app, you'd have an endpoint to delete users
      // await axios.delete(`/api/admin/users/${userId}`);
      
      // For now, remove locally
      setUsers(users.filter(user => user._id !== userId));
      alert('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { class: 'bg-danger', label: 'Admin' },
      shopowner: { class: 'bg-success', label: 'Shop Owner' },
      customer: { class: 'bg-primary', label: 'Customer' }
    };
    
    const config = roleConfig[role] || { class: 'bg-secondary', label: role };
    return <span className={`badge ${config.class}`}>{config.label}</span>;
  };

  const getStatusBadge = (active) => {
    return active ? 
      <span className="badge bg-success">Active</span> :
      <span className="badge bg-secondary">Inactive</span>;
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading users...</p>
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
              <li className="breadcrumb-item"><a href="/admin/dashboard" className="text-decoration-none">Dashboard</a></li>
              <li className="breadcrumb-item active">Users Management</li>
            </ol>
          </nav>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold">Users Management</h1>
              <p className="text-muted">Manage platform users and permissions</p>
            </div>
            <button className="btn btn-primary" onClick={fetchUsers}>
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
                <div className="col-md-4">
                  <label className="form-label">Search Users</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by name, email, or phone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="input-group-text">
                      <i className="bi bi-search"></i>
                    </span>
                  </div>
                </div>
                
                <div className="col-md-3">
                  <label className="form-label">Filter by Role</label>
                  <select
                    className="form-select"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="shopowner">Shop Owner</option>
                    <option value="customer">Customer</option>
                  </select>
                </div>
                
                <div className="col-md-3">
                  <label className="form-label">Filter by Status</label>
                  <select
                    className="form-select"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                
                <div className="col-md-2 d-flex align-items-end">
                  <button
                    className="btn btn-outline-secondary w-100"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedRole('all');
                      setSelectedStatus('all');
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

      {/* Users Table */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                Users ({filteredUsers.length})
                <small className="text-muted ms-2">
                  Showing {filteredUsers.length} of {users.length} users
                </small>
              </h5>
              <div className="text-muted">
                <i className="bi bi-download me-2"></i>
                Export
              </div>
            </div>
            <div className="card-body">
              {filteredUsers.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Contact</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(user => (
                        <tr key={user._id}>
                          <td>
                            <div>
                              <strong>{user.name}</strong>
                              <br />
                              <small className="text-muted">ID: {user._id}</small>
                            </div>
                          </td>
                          <td>
                            <div>
                              <div>{user.email}</div>
                              <small className="text-muted">{user.phone}</small>
                            </div>
                          </td>
                          <td>
                            {getRoleBadge(user.role)}
                          </td>
                          <td>
                            {getStatusBadge(user.active)}
                          </td>
                          <td>
                            <small>
                              {new Date(user.createdAt).toLocaleDateString()}
                              <br />
                              <span className="text-muted">
                                {new Date(user.createdAt).toLocaleTimeString()}
                              </span>
                            </small>
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
                                    <i className="bi bi-pencil me-2"></i>
                                    Edit User
                                  </button>
                                </li>
                                <li>
                                  <button 
                                    className="dropdown-item"
                                    onClick={() => toggleUserStatus(user._id, user.active)}
                                  >
                                    <i className={`bi ${user.active ? 'bi-pause' : 'bi-play'} me-2`}></i>
                                    {user.active ? 'Deactivate' : 'Activate'}
                                  </button>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                  <button 
                                    className="dropdown-item text-danger"
                                    onClick={() => deleteUser(user._id, user.name)}
                                  >
                                    <i className="bi bi-trash me-2"></i>
                                    Delete User
                                  </button>
                                </li>
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
                  <i className="bi bi-people display-1 text-muted"></i>
                  <h4 className="text-muted mt-3">No users found</h4>
                  <p className="text-muted">Try adjusting your search filters</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedRole('all');
                      setSelectedStatus('all');
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
              <h6 className="card-title">Users Statistics</h6>
              <div className="row text-center">
                <div className="col-md-2">
                  <div className="border-end">
                    <h4 className="text-primary">{users.length}</h4>
                    <small className="text-muted">Total Users</small>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="border-end">
                    <h4 className="text-success">{users.filter(u => u.role === 'shopowner').length}</h4>
                    <small className="text-muted">Shop Owners</small>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="border-end">
                    <h4 className="text-info">{users.filter(u => u.role === 'customer').length}</h4>
                    <small className="text-muted">Customers</small>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="border-end">
                    <h4 className="text-danger">{users.filter(u => u.role === 'admin').length}</h4>
                    <small className="text-muted">Admins</small>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="border-end">
                    <h4 className="text-success">{users.filter(u => u.active).length}</h4>
                    <small className="text-muted">Active Users</small>
                  </div>
                </div>
                <div className="col-md-2">
                  <h4 className="text-secondary">{users.filter(u => !u.active).length}</h4>
                  <small className="text-muted">Inactive Users</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;