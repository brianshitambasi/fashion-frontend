// components/shopowner/Profile.jsx
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const Profile = () => {
  const { user, token, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    address: "",
    bio: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        businessName: user.businessName || "",
        address: user.address || "",
        bio: user.bio || ""
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        businessName: formData.businessName,
        address: formData.address,
        bio: formData.bio
      };

      const res = await axios.put(
        "https://hair-salon-app-1.onrender.com/user/profile",
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Update user context with new data
      setUser(res.data.user);
      setSuccess("Profile updated successfully!");
      
      // Clear form
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));

    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const passwordData = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      };

      await axios.put(
        "https://hair-salon-app-1.onrender.com/user/change-password",
        passwordData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccess("Password changed successfully!");
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));

    } catch (error) {
      console.error("Error changing password:", error);
      setError(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Header */}
          <div className="mb-4">
            <h2 className="fw-bold text-primary">
              <i className="bi bi-person-circle me-2"></i>
              My Profile
            </h2>
            <p className="text-muted">Manage your account information and security</p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="alert alert-danger alert-dismissible fade show">
              {error}
              <button type="button" className="btn-close" onClick={() => setError("")}></button>
            </div>
          )}

          {success && (
            <div className="alert alert-success alert-dismissible fade show">
              {success}
              <button type="button" className="btn-close" onClick={() => setSuccess("")}></button>
            </div>
          )}

          <div className="row g-4">
            {/* Profile Information */}
            <div className="col-lg-6">
              <div className="card shadow border-0 h-100">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-person-badge me-2"></i>
                    Profile Information
                  </h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleProfileUpdate}>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Full Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          value={formData.email}
                          disabled
                        />
                        <small className="text-muted">Contact admin to change email</small>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Business Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        placeholder="Your salon/business name"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+254 XXX XXX XXX"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Address</label>
                      <textarea
                        className="form-control"
                        name="address"
                        rows="2"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Your business address"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label">Bio/Description</label>
                      <textarea
                        className="form-control"
                        name="bio"
                        rows="3"
                        value={formData.bio}
                        onChange={handleInputChange}
                        placeholder="Tell customers about yourself and your business..."
                      />
                    </div>

                    <div className="d-grid">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Updating...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-2"></i>
                            Update Profile
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="col-lg-6">
              <div className="card shadow border-0 h-100">
                <div className="card-header bg-warning text-dark">
                  <h5 className="mb-0">
                    <i className="bi bi-shield-lock me-2"></i>
                    Change Password
                  </h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handlePasswordChange}>
                    <div className="mb-3">
                      <label className="form-label">Current Password *</label>
                      <input
                        type="password"
                        className="form-control"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">New Password *</label>
                      <input
                        type="password"
                        className="form-control"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        required
                        minLength="6"
                      />
                      <small className="text-muted">Password must be at least 6 characters long</small>
                    </div>

                    <div className="mb-4">
                      <label className="form-label">Confirm New Password *</label>
                      <input
                        type="password"
                        className="form-control"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="d-grid">
                      <button
                        type="submit"
                        className="btn btn-warning"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Changing...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-key me-2"></i>
                            Change Password
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Account Info Card */}
            <div className="col-12">
              <div className="card shadow border-0">
                <div className="card-header bg-info text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-info-circle me-2"></i>
                    Account Information
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="mb-3">
                        <strong className="text-muted">Account Type:</strong>
                        <div className="badge bg-success ms-2">Shop Owner</div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <strong className="text-muted">Member Since:</strong>
                        <div className="ms-2">
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <strong className="text-muted">Last Updated:</strong>
                        <div className="ms-2">
                          {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="alert alert-light border">
                    <h6 className="alert-heading">
                      <i className="bi bi-lightbulb me-2"></i>
                      Profile Tips
                    </h6>
                    <ul className="mb-0 small">
                      <li>Keep your business information up to date for better customer engagement</li>
                      <li>Use a descriptive bio to attract more customers</li>
                      <li>Ensure your contact information is accurate</li>
                      <li>Change your password regularly for security</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;