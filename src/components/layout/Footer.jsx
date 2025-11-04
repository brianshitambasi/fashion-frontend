// components/layout/Footer.js (Compact Version)
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white pt-4">
      <div className="container">
        <div className="row g-4">
          {/* Brand & Social */}
          <div className="col-lg-4 col-md-6">
            <h5 className="text-primary mb-3">
              <i className="bi bi-scissors me-2"></i>
              Looks Nairobi
            </h5>
            <p className="text-light small mb-3">
              Your premier hair salon booking platform in Nairobi.
            </p>
            <div className="social-icons">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-outline-light btn-sm rounded-circle me-2"
                title="Facebook"
              >
                <i className="bi bi-facebook"></i>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-outline-light btn-sm rounded-circle me-2"
                title="Instagram"
              >
                <i className="bi bi-instagram"></i>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-outline-light btn-sm rounded-circle"
                title="Twitter"
              >
                <i className="bi bi-twitter-x"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="text-primary mb-3">Explore</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><Link to="/" className="text-light text-decoration-none">Home</Link></li>
              <li className="mb-2"><Link to="/shops" className="text-light text-decoration-none">Salons</Link></li>
              <li className="mb-2"><Link to="/hairstyles" className="text-light text-decoration-none">Styles</Link></li>
              <li><Link to="/about" className="text-light text-decoration-none">About</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="text-primary mb-3">Support</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><Link to="/contact" className="text-light text-decoration-none">Contact</Link></li>
              <li className="mb-2"><Link to="/help" className="text-light text-decoration-none">Help</Link></li>
              <li className="mb-2"><Link to="/privacy" className="text-light text-decoration-none">Privacy</Link></li>
              <li><Link to="/terms" className="text-light text-decoration-none">Terms</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-lg-4">
            <h6 className="text-primary mb-3">Newsletter</h6>
            <div className="input-group input-group-sm">
              <input 
                type="email" 
                className="form-control" 
                placeholder="Your email" 
              />
              <button className="btn btn-primary" type="button">
                <i className="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>

        <hr className="my-3 border-light" />

        {/* Bottom */}
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
            <small className="text-muted">
              © {currentYear} Looks Nairobi. All rights reserved.
            </small>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <small className="text-muted">
              Made with <i className="bi bi-heart-fill text-danger"></i> in Nairobi
            </small>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;