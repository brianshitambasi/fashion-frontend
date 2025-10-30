// components/Login.js
import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { setToken, setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3002/user/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      if (!user || !token) {
        setError("Invalid credentials. Please try again.");
        setLoading(false);
        return;
      }

      // ✅ Save token + user in context and localStorage
      setToken(token);
      setUser(user);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // 🧭 Redirect based on role
      switch (user.role) {
        case "admin":
          navigate("/admin");
          break;
        case "shop":
          navigate("/shopowner"); // This will show ShopDashboard with sidebar
          break;
        case "customer":
          navigate("/customer/dashboard");
          break;
        default:
          navigate("/");
          break;
      }
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <form onSubmit={handleSubmit} className="card shadow p-4 bg-light rounded">
        <h1 className="text-center text-success mb-3">LOOKSNAIROBI</h1>
        <h2 className="text-center mb-4 text-success">Login</h2>

        {/* Alerts */}
        {error && <div className="alert alert-danger">{error}</div>}
        {loading && <div className="alert alert-info">Logging in...</div>}

        {/* Inputs */}
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="d-grid mb-3">
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        <div className="text-center">
          <p>
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-decoration-none text-success fw-semibold"
            >
              Register Here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;