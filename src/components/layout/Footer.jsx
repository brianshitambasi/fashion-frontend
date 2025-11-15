import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
// import "./Footer.css";



function Footer() {
  return (
    <footer className="footer bg-dark text-light pt-5 mt-auto">
      <div className="container">
        <div className="row gy-4">
          {/* About */}
          <div className="col-md-4">
            <h5 className="text-uppercase mb-3 text-pink">BeautyHub</h5>
            <p className="small text-muted">
              Discover top salons, book appointments, and explore the latest beauty trends in Nairobi and beyond. 
              BeautyHub connects you to the best stylists and services effortlessly.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4">
            <h5 className="mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link className="footer-link" to="/">Home</Link></li>
              <li><Link className="footer-link" to="/shops">Salons</Link></li>
              <li><Link className="footer-link" to="/hairstyles">Hairstyles</Link></li>
              <li><Link className="footer-link" to="/about">About</Link></li>
              <li><Link className="footer-link" to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Socials */}
          <div className="col-md-4">
            <h5 className="mb-3">Follow Us</h5>
            <div className="d-flex gap-3">
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
              >
                <i className="bi bi-twitter-x"></i>
              </a>
              <a
                href="https://facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
              >
                <i className="bi bi-facebook"></i>
              </a>
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
              >
                <i className="bi bi-instagram"></i>
              </a>
            </div>
          </div>
        </div>

        <hr className="my-4 border-light opacity-25" />
        <div className="text-center pb-3 small text-muted">
          &copy; {new Date().getFullYear()} BeautyHub — All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
