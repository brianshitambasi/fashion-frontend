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

  // ✅ Normalize user role - convert 'shop' to 'shopowner'
  const normalizeUserRole = (userData) => {
    if (!userData || !userData.role) return userData;
    
    return {
      ...userData,
      role: userData.role === 'shop' ? 'shopowner' : userData.role
    };
  };

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

  // ✅ Initialize auth on mount
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
              const normalizedUser = normalizeUserRole(res.data.user);
              setUser(normalizedUser);
              localStorage.setItem("user", JSON.stringify(normalizedUser));
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
  }, []);

  // ✅ Login function with role normalization
  const login = (userData, authToken) => {
    console.log("🔐 Login - Original user data:", userData);
    
    // Normalize the user role before storing
    const normalizedUser = normalizeUserRole(userData);
    console.log("🔐 Login - Normalized user data:", normalizedUser);
    
    setUser(normalizedUser);
    setToken(authToken);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    localStorage.setItem("token", authToken);
  };

  // ✅ Logout function
  const logout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken("");
  }, []);

  // ✅ Update user info in both state & localStorage with normalization
  const updateUser = (userData) => {
    const normalizedUser = normalizeUserRole(userData);
    setUser(normalizedUser);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
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