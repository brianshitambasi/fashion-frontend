import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  // ✅ Automatically add token to all axios requests
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

  // ✅ Initialize auth on mount & whenever token/user changes
  useEffect(() => {
    const initializeAuth = async () => {
      if (token && user) {
        try {
          const decoded = jwtDecode(token);
          const isExpired = decoded.exp * 1000 < Date.now();

          if (isExpired) {
            console.log("Token expired, logging out...");
            logout();
            setLoading(false);
            return;
          }

          // Optional: Verify token with backend if you have /user/me endpoint
          try {
            const res = await axios.get(
              "https://hair-salon-app-1.onrender.com/user/me",
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            // Update user info if backend returns latest data
            if (res.data && res.data.user) {
              setUser(res.data.user);
              localStorage.setItem("user", JSON.stringify(res.data.user));
            }
          } catch (verifyError) {
            console.warn("Token verification failed, logging out...");
            logout();
          }
        } catch (error) {
          console.error("Error decoding token:", error);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []); // 👈 rerun when token/user changes

  // ✅ Login function
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
  };

  // ✅ Logout function
  const logout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken("");
  }, []);

  // ✅ Update user info in both state & localStorage
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
      {children}
    </AuthContext.Provider>
  );
};
