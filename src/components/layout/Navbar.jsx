// components/layout/Navbar.js
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
          <i className="bi bi-scissors me-2"></i>
          Looks Nairobi
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActiveRoute('/') ? 'active' : ''}`} 
                to="/"
              >
                <i className="bi bi-house me-1"></i>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActiveRoute('/shops') ? 'active' : ''}`} 
                to="/shops"
              >
                <i className="bi bi-shop me-1"></i>
                Salons
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActiveRoute('/hairstyles') ? 'active' : ''}`} 
                to="/hairstyles"
              >
                <i className="bi bi-star me-1"></i>
                Styles
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActiveRoute('/about') ? 'active' : ''}`} 
                to="/about"
              >
                <i className="bi bi-info-circle me-1"></i>
                About
              </Link>
            </li>
          </ul>

          <ul className="navbar-nav">
            {isAuthenticated ? (
              <>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown">
                    <i className="bi bi-person-circle me-2"></i>
                    {user?.name}
                    <span className="badge bg-light text-dark ms-2">{user?.role}</span>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    {/* Customer Menu */}
                    {user?.role === 'customer' && (
                      <>
                        <li>
                          <Link className="dropdown-item" to="/customer/dashboard">
                            <i className="bi bi-speedometer2 me-2"></i>
                            Dashboard
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/customer/bookings">
                            <i className="bi bi-calendar-check me-2"></i>
                            My Bookings
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/customer/cart">
                            <i className="bi bi-cart me-2"></i>
                            Cart
                            <span className="badge bg-primary ms-2">0</span>
                          </Link>
                        </li>
                      </>
                    )}
                    
                    {/* Shop Owner Menu */}
                    {user?.role === 'shopowner' && (
                      <>
                        <li>
                          <Link className="dropdown-item" to="/shopowner/dashboard">
                            <i className="bi bi-speedometer2 me-2"></i>
                            Dashboard
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/shopowner/shops">
                            <i className="bi bi-shop me-2"></i>
                            My Salons
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/shopowner/bookings">
                            <i className="bi bi-calendar-check me-2"></i>
                            Bookings
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/shopowner/hairstyles">
                            <i className="bi bi-scissors me-2"></i>
                            Styles
                          </Link>
                        </li>
                      </>
                    )}
                    
                    {/* Admin Menu */}
                    {user?.role === 'admin' && (
                      <li>
                        <Link className="dropdown-item" to="/admin/dashboard">
                          <i className="bi bi-speedometer2 me-2"></i>
                          Admin Panel
                        </Link>
                      </li>
                    )}
                    
                    <li><hr className="dropdown-divider" /></li>
                    
                    <li>
                      <Link className="dropdown-item" to="/customer/profile">
                        <i className="bi bi-person me-2"></i>
                        Profile
                      </Link>
                    </li>
                    
                    {user?.role === 'shopowner' && (
                      <li>
                        <Link className="dropdown-item" to="/shopowner/settings">
                          <i className="bi bi-gear me-2"></i>
                          Settings
                        </Link>
                      </li>
                    )}
                    
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-outline-light ms-2" to="/register">
                    <i className="bi bi-person-plus me-1"></i>
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;