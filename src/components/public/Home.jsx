// components/public/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const stats = [
    { number: '50+', label: 'Professional Salons' },
    { number: '1000+', label: 'Happy Customers' },
    { number: '200+', label: 'Trending Styles' },
    { number: '24/7', label: 'Customer Support' }
  ];

  const features = [
    {
      icon: 'bi-search',
      title: 'Find Best Salons',
      description: 'Discover top-rated hair salons in Nairobi with real reviews and ratings from verified customers.'
    },
    {
      icon: 'bi-scissors',
      title: 'Browse Styles',
      description: 'Explore hundreds of trendy hair styles and get inspiration for your next transformation.'
    },
    {
      icon: 'bi-calendar-check',
      title: 'Easy Booking',
      description: 'Book appointments instantly with secure online payments and instant confirmation.'
    },
    {
      icon: 'bi-star',
      title: 'Rate & Review',
      description: 'Share your experience and help others find the perfect salon for their needs.'
    },
    {
      icon: 'bi-credit-card',
      title: 'Secure Payments',
      description: 'Pay safely with M-Pesa integration and get instant booking confirmation.'
    },
    {
      icon: 'bi-clock',
      title: 'Save Time',
      description: 'No more waiting in lines. Book your slot and walk in at your scheduled time.'
    }
  ];

  const popularServices = [
    { name: 'Haircut & Styling', icon: 'bi-scissors' },
    { name: 'Hair Coloring', icon: 'bi-palette' },
    { name: 'Hair Treatment', icon: 'bi-droplet' },
    { name: 'Braiding', icon: 'bi-three-dots' },
    { name: 'Weaving', icon: 'bi-wind' },
    { name: 'Makeup', icon: 'bi-eyedropper' }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section bg-primary text-white py-5">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                Book Your Perfect <span className="text-warning">Hair Style</span> in Nairobi
              </h1>
              <p className="lead mb-4">
                Discover the best hair salons, browse trending styles, and book appointments instantly. 
                Your perfect look is just a click away with secure M-Pesa payments.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/shops" className="btn btn-light btn-lg px-4 py-2">
                  <i className="bi bi-search me-2"></i>
                  Explore Salons
                </Link>
                {!isAuthenticated && (
                  <Link to="/register" className="btn btn-outline-light btn-lg px-4 py-2">
                    <i className="bi bi-person-plus me-2"></i>
                    Join Now
                  </Link>
                )}
                {isAuthenticated && user?.role === 'customer' && (
                  <Link to="/customer/dashboard" className="btn btn-warning btn-lg px-4 py-2">
                    <i className="bi bi-speedometer2 me-2"></i>
                    My Dashboard
                  </Link>
                )}
                {isAuthenticated && user?.role === 'shopowner' && (
                  <Link to="/shopowner/dashboard" className="btn btn-warning btn-lg px-4 py-2">
                    <i className="bi bi-speedometer2 me-2"></i>
                    Salon Dashboard
                  </Link>
                )}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="text-center">
                <div className="hero-image bg-light rounded-3 p-5 shadow">
                  <i className="bi bi-scissors display-1 text-primary mb-3"></i>
                  <h3 className="text-dark">Nairobi's Premier Salon Booking Platform</h3>
                  <p className="text-muted">Beauty and convenience combined</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-4">
            {stats.map((stat, index) => (
              <div key={index} className="col-6 col-md-3">
                <div className="text-center">
                  <h3 className="fw-bold text-primary">{stat.number}</h3>
                  <p className="text-muted mb-0">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-5">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col">
              <h2 className="fw-bold">Popular Services</h2>
              <p className="text-muted">Discover our most booked hair services</p>
            </div>
          </div>
          
          <div className="row g-4">
            {popularServices.map((service, index) => (
              <div key={index} className="col-md-4 col-lg-2">
                <div className="card border-0 text-center card-hover">
                  <div className="card-body">
                    <i className={`bi ${service.icon} display-6 text-primary mb-3`}></i>
                    <h6 className="card-title">{service.name}</h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col">
              <h2 className="fw-bold">Why Choose Looks Nairobi?</h2>
              <p className="text-muted lead">The modern way to book hair services in Nairobi</p>
            </div>
          </div>
          
          <div className="row g-4">
            {features.map((feature, index) => (
              <div key={index} className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100 feature-card">
                  <div className="card-body text-center p-4">
                    <div className="feature-icon bg-primary bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
                      <i className={`bi ${feature.icon} fs-1 text-primary`}></i>
                    </div>
                    <h5 className="fw-bold">{feature.title}</h5>
                    <p className="text-muted">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-5">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col">
              <h2 className="fw-bold">How It Works</h2>
              <p className="text-muted">Get your perfect style in 3 easy steps</p>
            </div>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="text-center">
                <div className="step-number bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3">
                  1
                </div>
                <h5>Find a Salon</h5>
                <p className="text-muted">Browse through our curated list of top-rated salons in Nairobi</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <div className="step-number bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3">
                  2
                </div>
                <h5>Book & Pay</h5>
                <p className="text-muted">Choose your service, select a time slot, and pay securely with M-Pesa</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <div className="step-number bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3">
                  3
                </div>
                <h5>Get Styled</h5>
                <p className="text-muted">Visit the salon at your scheduled time and enjoy your new look</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-5 bg-primary text-white">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col">
              <h2 className="fw-bold">What Our Customers Say</h2>
              <p className="opacity-75">Real experiences from our happy customers</p>
            </div>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card border-0 bg-dark bg-opacity-25">
                <div className="card-body text-center">
                  <div className="text-warning mb-3">
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                  </div>
                  <p className="card-text">"I found the perfect salon for my wedding hairstyle! The booking was so easy and the payment was secure."</p>
                  <h6 className="card-title mb-1">Sarah M.</h6>
                  <small className="opacity-75">Westlands, Nairobi</small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 bg-dark bg-opacity-25">
                <div className="card-body text-center">
                  <div className="text-warning mb-3">
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                  </div>
                  <p className="card-text">"As a busy professional, this platform saves me so much time. I can book appointments during my lunch break!"</p>
                  <h6 className="card-title mb-1">John K.</h6>
                  <small className="opacity-75">Kilimani, Nairobi</small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 bg-dark bg-opacity-25">
                <div className="card-body text-center">
                  <div className="text-warning mb-3">
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-half"></i>
                  </div>
                  <p className="card-text">"The M-Pesa integration is seamless. I love that I can pay instantly and get immediate confirmation."</p>
                  <h6 className="card-title mb-1">Grace W.</h6>
                  <small className="opacity-75">Karen, Nairobi</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-light">
        <div className="container text-center">
          <h3 className="fw-bold mb-3">Ready to Transform Your Look?</h3>
          <p className="text-muted mb-4">Join thousands of satisfied customers in Nairobi who trust us for their beauty needs</p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/shops" className="btn btn-primary btn-lg px-5">
              <i className="bi bi-search me-2"></i>
              Find Salons
            </Link>
            {!isAuthenticated && (
              <Link to="/register" className="btn btn-outline-primary btn-lg px-5">
                <i className="bi bi-person-plus me-2"></i>
                Sign Up Free
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;