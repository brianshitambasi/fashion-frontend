// components/layout/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5">
      <div className="container py-5">
        <div className="row">
          <div className="col-md-4">
            <h5>💇‍♀️ Looks Nairobi</h5>
            <p className="text-muted">
              Your premier destination for hair salon bookings in Nairobi. 
              Find the best stylists and book appointments with ease.
            </p>
          </div>
          <div className="col-md-2">
            <h6>Quick Links</h6>
            <ul className="list-unstyled">
              <li><a href="/" className="text-muted text-decoration-none">Home</a></li>
              <li><a href="/shops" className="text-muted text-decoration-none">Salons</a></li>
              <li><a href="/about" className="text-muted text-decoration-none">About</a></li>
            </ul>
          </div>
          <div className="col-md-2">
            <h6>Support</h6>
            <ul className="list-unstyled">
              <li><a href="/contact" className="text-muted text-decoration-none">Contact</a></li>
              <li><a href="/help" className="text-muted text-decoration-none">Help Center</a></li>
              <li><a href="/privacy" className="text-muted text-decoration-none">Privacy</a></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h6>Connect With Us</h6>
            <div className="d-flex gap-3 mt-3">
              <a href="#" className="text-muted">📘 Facebook</a>
              <a href="#" className="text-muted">📷 Instagram</a>
              <a href="#" className="text-muted">🐦 Twitter</a>
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