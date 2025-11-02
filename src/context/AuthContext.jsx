import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Create the context
export const AuthContext = createContext();

// Custom hook for consuming the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Provider component
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  // Computed property
  const isAuthenticated = !!user && !!token;

  // Axios interceptor for auth header
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => axios.interceptors.request.eject(interceptor);
  }, [token]);

  // Verify and initialize auth
  useEffect(() => {
    const initializeAuth = async () => {
      if (token && user) {
        try {
          // Decode token to check expiry
          const decoded = jwtDecode(token);
          const isExpired = decoded.exp * 1000 < Date.now();

          if (isExpired) {
            logout();
            return;
          }

          // Optionally verify token with backend
          await axios.get("https://hair-salon-app-1.onrender.com/user/verify", {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []); // runs once on mount

  // Login
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
  };

  // Logout
  const logout = useCallback(() => {
    localStorage.clear();
    setUser(null);
    setToken("");
    navigate("/login");
  }, [navigate]);

  // Update user info
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const value = {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    updateUser,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
