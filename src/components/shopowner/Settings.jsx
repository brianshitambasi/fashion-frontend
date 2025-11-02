// src/components/shopowner/Settings.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Alert, Spinner } from "react-bootstrap";

const Settings = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  // Profile & Preferences State
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [preferences, setPreferences] = useState({
    notifications: true,
    theme: "light",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const API_BASE = "https://hair-salon-app-1.onrender.com/settings";

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [profileRes, prefRes] = await Promise.all([
          axios.get(`${API_BASE}/profile`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE}/preferences`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setProfile(profileRes.data);
        setPreferences(prefRes.data);
      } catch (err) {
        setError("Failed to load settings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [token]);

  // Handle Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE}/profile`, profile, { headers: { Authorization: `Bearer ${token}` } });
      setMessage("Profile updated successfully!");
      setError("");
    } catch {
      setError("Error updating profile.");
      setMessage("");
    }
  };

  // Handle Preferences Update
  const handlePreferencesSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE}/preferences`, preferences, { headers: { Authorization: `Bearer ${token}` } });
      setMessage("Preferences updated successfully!");
      setError("");
    } catch {
      setError("Error updating preferences.");
      setMessage("");
    }
  };

  // Handle Password Reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    try {
      await axios.post(`${API_BASE}/reset`, passwordData, { headers: { Authorization: `Bearer ${token}` } });
      setMessage("Password reset successful!");
      setError("");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      setError("Error resetting password.");
      setMessage("");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">Account Settings</h2>

      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Profile Section */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white">Profile Information</div>
        <div className="card-body">
          <form onSubmit={handleProfileSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input
                type="text"
                className="form-control"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
            <button className="btn btn-primary" type="submit">Update Profile</button>
          </form>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-success text-white">Preferences</div>
        <div className="card-body">
          <form onSubmit={handlePreferencesSubmit}>
            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={preferences.notifications}
                onChange={(e) =>
                  setPreferences({ ...preferences, notifications: e.target.checked })
                }
              />
              <label className="form-check-label">Enable Notifications</label>
            </div>
            <div className="mb-3">
              <label className="form-label">Theme</label>
              <select
                className="form-select"
                value={preferences.theme}
                onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <button className="btn btn-success" type="submit">Save Preferences</button>
          </form>
        </div>
      </div>

      {/* Password Reset Section */}
      <div className="card shadow-sm">
        <div className="card-header bg-danger text-white">Reset Password</div>
        <div className="card-body">
          <form onSubmit={handlePasswordReset}>
            <div className="mb-3">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-control"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              />
            </div>
            <button className="btn btn-danger" type="submit">Reset Password</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
