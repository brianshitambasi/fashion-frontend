// components/layout/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5">
      <div className="container py-5">
        <div className="row">
          <div className="col-md-4 mb-4 mb-md-0">
            <h5>💇‍♀️ Looks Nairobi</h5>
            <p className="text-muted">
              Your premier destination for hair salon bookings in Nairobi. 
              Find the best stylists and book appointments with ease.
            </p>
          </div>
          <div className="col-md-2 mb-4 mb-md-0">
            <h6>Quick Links</h6>
            <ul className="list-unstyled">
              <li><a href="/" className="text-muted text-decoration-none">Home</a></li>
              <li><a href="/shops" className="text-muted text-decoration-none">Salons</a></li>
              <li><a href="/about" className="text-muted text-decoration-none">About</a></li>
            </ul>
          </div>
          <div className="col-md-2 mb-4 mb-md-0">
            <h6>Support</h6>
            <ul className="list-unstyled">
              <li><a href="/contact" className="text-muted text-decoration-none">Contact</a></li>
              <li><a href="/help" className="text-muted text-decoration-none">Help Center</a></li>
              <li><a href="/privacy" className="text-muted text-decoration-none">Privacy</a></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h6>Connect With Us</h6>
            <div className="social-links mt-3">
              {/* Social links with proper accessibility and responsive design */}
              <div className="d-flex flex-wrap gap-3">
                <a 
                  href="#" 
                  className="text-muted text-decoration-none d-flex align-items-center gap-1 social-link"
                  aria-label="Follow us on Facebook"
                >
                  <span className="social-icon">📘</span>
                  <span className="social-text d-none d-sm-inline">Facebook</span>
                </a>
                <a 
                  href="#" 
                  className="text-muted text-decoration-none d-flex align-items-center gap-1 social-link"
                  aria-label="Follow us on Instagram"
                >
                  <span className="social-icon">📷</span>
                  <span className="social-text d-none d-sm-inline">Instagram</span>
                </a>
                <a 
                  href="#" 
                  className="text-muted text-decoration-none d-flex align-items-center gap-1 social-link"
                  aria-label="Follow us on Twitter"
                >
                  <span className="social-icon">🐦</span>
                  <span className="social-text d-none d-sm-inline">Twitter</span>
                </a>
              </div>
              
              {/* Alternative: Icon-only version for extra small screens */}
              <div className="d-flex d-sm-none justify-content-center gap-4 mt-2">
                <a href="#" className="text-muted fs-5" aria-label="Facebook">
                  📘
                </a>
                <a href="#" className="text-muted fs-5" aria-label="Instagram">
                  📷
                </a>
                <a href="#" className="text-muted fs-5" aria-label="Twitter">
                  🐦
                </a>
              </div>
            </div>
            
            {/* Optional: Newsletter signup for larger screens */}
            <div className="mt-4 d-none d-md-block">
              <p className="text-muted small mb-2">Stay updated with our latest offers</p>
              <div className="input-group input-group-sm">
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="Your email" 
                  aria-label="Email for newsletter"
                />
                <button className="btn btn-outline-light btn-sm" type="button">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
        <hr className="my-4" />
        <div className="row">
          <div className="col-md-6">
            <p className="text-muted mb-0">
              © {new Date().getFullYear()} Looks Nairobi. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <p className="text-muted mb-0">
              Made with ❤️ for Nairobi
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;