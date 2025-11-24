import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Footer() {
  return (
    <footer className="footer bg-dark text-light pt-5 pb-3 mt-auto">
      <div className="container">
        <div className="row gy-4">
          {/* Brand & Description */}
          <div className="col-lg-4 col-md-6">
            <div className="footer-brand mb-4">
              <h4 className="text-uppercase fw-bold mb-3">
                <span className="text-pink">Beauty</span>Hub
              </h4>
              <p className="text-muted mb-4">
                Your premier destination for discovering top-rated salons, booking appointments, 
                and exploring the latest beauty trends in Nairobi. Connect with the best stylists 
                and transform your look with ease.
              </p>
              <div className="trust-badges">
                <span className="badge bg-success me-2 mb-2">
                  <i className="bi bi-shield-check me-1"></i>Secure
                </span>
                <span className="badge bg-primary me-2 mb-2">
                  <i className="bi bi-lightning me-1"></i>Fast Booking
                </span>
                <span className="badge bg-warning text-dark mb-2">
                  <i className="bi bi-star me-1"></i>Top Rated
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="footer-title text-uppercase fw-semibold mb-3 text-pink">Explore</h6>
            <ul className="list-unstyled footer-links">
              <li className="mb-2">
                <Link className="footer-link" to="/">
                  <i className="bi bi-house me-2"></i>Home
                </Link>
              </li>
              <li className="mb-2">
                <Link className="footer-link" to="/shops">
                  <i className="bi bi-shop me-2"></i>Salons
                </Link>
              </li>
              <li className="mb-2">
                <Link className="footer-link" to="/hairstyles">
                  <i className="bi bi-scissors me-2"></i>Hairstyles
                </Link>
              </li>
              <li className="mb-2">
                <Link className="footer-link" to="/about">
                  <i className="bi bi-info-circle me-2"></i>About
                </Link>
              </li>
              <li className="mb-2">
                <Link className="footer-link" to="/contact">
                  <i className="bi bi-telephone me-2"></i>Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="col-lg-3 col-md-3 col-6">
            <h6 className="footer-title text-uppercase fw-semibold mb-3 text-pink">Support</h6>
            <ul className="list-unstyled footer-links">
              <li className="mb-2">
                <a className="footer-link" href="/help">
                  <i className="bi bi-question-circle me-2"></i>Help Center
                </a>
              </li>
              <li className="mb-2">
                <a className="footer-link" href="/faq">
                  <i className="bi bi-chat-dots me-2"></i>FAQ
                </a>
              </li>
              <li className="mb-2">
                <a className="footer-link" href="/booking-guide">
                  <i className="bi bi-book me-2"></i>Booking Guide
                </a>
              </li>
              <li className="mb-2">
                <a className="footer-link" href="/privacy">
                  <i className="bi bi-shield-lock me-2"></i>Privacy Policy
                </a>
              </li>
              <li className="mb-2">
                <a className="footer-link" href="/terms">
                  <i className="bi bi-file-text me-2"></i>Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="col-lg-3 col-md-6">
            <h6 className="footer-title text-uppercase fw-semibold mb-3 text-pink">Connect With Us</h6>
            
            {/* Contact Info */}
            <div className="contact-info mb-4">
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-envelope text-pink me-3"></i>
                <small className="text-muted">hello@beautyhub.com</small>
              </div>
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-telephone text-pink me-3"></i>
                <small className="text-muted">+254 700 123 456</small>
              </div>
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-geo-alt text-pink me-3"></i>
                <small className="text-muted">Nairobi, Kenya</small>
              </div>
            </div>

            {/* Social Links */}
            <div className="social-links mb-4">
              <h6 className="small fw-semibold mb-3 text-muted">FOLLOW US</h6>
              <div className="d-flex gap-3">
                <a
                  href="https://facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon facebook"
                  title="Facebook"
                >
                  <i className="bi bi-facebook"></i>
                </a>
                <a
                  href="https://instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon instagram"
                  title="Instagram"
                >
                  <i className="bi bi-instagram"></i>
                </a>
                <a
                  href="https://twitter.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon twitter"
                  title="Twitter"
                >
                  <i className="bi bi-twitter-x"></i>
                </a>
                <a
                  href="https://tiktok.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon tiktok"
                  title="TikTok"
                >
                  <i className="bi bi-tiktok"></i>
                </a>
                <a
                  href="https://youtube.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon youtube"
                  title="YouTube"
                >
                  <i className="bi bi-youtube"></i>
                </a>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="newsletter">
              <h6 className="small fw-semibold mb-2 text-muted">NEWSLETTER</h6>
              <div className="input-group input-group-sm">
                <input 
                  type="email" 
                  className="form-control form-control-sm" 
                  placeholder="Your email" 
                  aria-label="Email for newsletter"
                />
                <button className="btn btn-pink btn-sm" type="button">
                  <i className="bi bi-send"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-4 border-light opacity-10" />

        {/* Bottom Footer */}
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0 small text-muted">
              &copy; {new Date().getFullYear()} <span className="text-pink fw-semibold">BeautyHub</span>. 
              All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <div className="payment-methods">
              <small className="text-muted me-2">We accept:</small>
              <span className="badge bg-success me-1">
                <i className="bi bi-phone me-1"></i>M-Pesa
              </span>
              <span className="badge bg-primary me-1">
                <i className="bi bi-credit-card me-1"></i>Cards
              </span>
              <span className="badge bg-warning text-dark">
                <i className="bi bi-cash me-1"></i>Cash
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bootstrap Icons */}
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" 
        rel="stylesheet" 
      />

      {/* Custom Styles */}
      <style jsx>{`
        .footer {
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%) !important;
        }
        .text-pink {
          color: #e83e8c !important;
        }
        .btn-pink {
          background-color: #e83e8c;
          border-color: #e83e8c;
          color: white;
        }
        .btn-pink:hover {
          background-color: #d81b60;
          border-color: #d81b60;
          color: white;
        }
        .footer-title {
          font-size: 0.9rem;
          letter-spacing: 0.5px;
        }
        .footer-links .footer-link {
          color: #b0b0b0;
          text-decoration: none;
          font-size: 0.875rem;
          transition: all 0.3s ease;
          display: block;
          padding: 0.25rem 0;
        }
        .footer-links .footer-link:hover {
          color: #e83e8c;
          transform: translateX(5px);
        }
        .social-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          color: #b0b0b0;
          text-decoration: none;
          transition: all 0.3s ease;
          font-size: 1.1rem;
        }
        .social-icon:hover {
          transform: translateY(-3px);
          color: white;
        }
        .social-icon.facebook:hover { background: #3b5998; }
        .social-icon.instagram:hover { 
          background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); 
        }
        .social-icon.twitter:hover { background: #000000; }
        .social-icon.tiktok:hover { background: #000000; }
        .social-icon.youtube:hover { background: #ff0000; }
        .trust-badges .badge {
          font-size: 0.7rem;
          padding: 0.4rem 0.6rem;
        }
        .contact-info i {
          width: 16px;
          text-align: center;
        }
        .newsletter .form-control {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
        }
        .newsletter .form-control::placeholder {
          color: #b0b0b0;
        }
        .newsletter .form-control:focus {
          background: rgba(255, 255, 255, 0.15);
          border-color: #e83e8c;
          box-shadow: 0 0 0 0.2rem rgba(232, 62, 140, 0.25);
          color: white;
        }
        .payment-methods .badge {
          font-size: 0.65rem;
          padding: 0.3rem 0.5rem;
        }
        @media (max-width: 768px) {
          .footer-brand {
            text-align: center;
          }
          .trust-badges {
            text-align: center;
          }
          .social-links {
            text-align: center;
          }
          .social-links .d-flex {
            justify-content: center;
          }
          .newsletter {
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}

export default Footer;