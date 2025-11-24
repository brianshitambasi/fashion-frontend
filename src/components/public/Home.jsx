// components/public/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Home.css'; // We'll create this CSS file for custom styles

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const stats = [
    { number: '50+', label: 'Professional Salons', icon: 'bi-shop' },
    { number: '1000+', label: 'Happy Customers', icon: 'bi-emoji-smile' },
    { number: '200+', label: 'Trending Styles', icon: 'bi-gem' },
    { number: '24/7', label: 'Customer Support', icon: 'bi-headset' }
  ];

  const features = [
    {
      icon: 'bi-search-heart',
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
      icon: 'bi-shield-check',
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

  const testimonials = [
    {
      name: 'Sarah M.',
      location: 'Westlands, Nairobi',
      rating: 5,
      text: '"I found the perfect salon for my wedding hairstyle! The booking was so easy and the payment was secure."',
      image: '👩'
    },
    {
      name: 'John K.',
      location: 'Kilimani, Nairobi',
      rating: 5,
      text: '"As a busy professional, this platform saves me so much time. I can book appointments during my lunch break!"',
      image: '👨'
    },
    {
      name: 'Grace W.',
      location: 'Karen, Nairobi',
      rating: 4.5,
      text: '"The M-Pesa integration is seamless. I love that I can pay instantly and get immediate confirmation."',
      image: '👩'
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i 
        key={i} 
        className={`bi ${i < rating ? 'bi-star-fill' : 'bi-star'} ${i < Math.floor(rating) && i >= rating ? 'bi-star-half' : ''}`}
      ></i>
    ));
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center min-vh-80">
            <div className="col-lg-6">
              <div className="hero-content">
                <span className="badge bg-warning text-dark mb-3">
                  <i className="bi bi-award me-2"></i>
                  Nairobi's #1 Salon Booking Platform
                </span>
                <h1 className="hero-title">
                  Book Your Perfect <span className="text-gradient">Hair Style</span> in Nairobi
                </h1>
                <p className="hero-subtitle">
                  Discover the best hair salons, browse trending styles, and book appointments instantly. 
                  Your perfect look is just a click away with secure M-Pesa payments.
                </p>
                <div className="hero-buttons">
                  <Link to="/shops" className="btn btn-primary btn-lg">
                    <i className="bi bi-search me-2"></i>
                    Explore Salons
                  </Link>
                  {!isAuthenticated && (
                    <Link to="/register" className="btn btn-outline-light btn-lg">
                      <i className="bi bi-person-plus me-2"></i>
                      Join Now
                    </Link>
                  )}
                  {isAuthenticated && (
                    <Link 
                      to={user?.role === 'customer' ? "/customer/dashboard" : "/shopowner/dashboard"} 
                      className="btn btn-warning btn-lg"
                    >
                      <i className="bi bi-speedometer2 me-2"></i>
                      {user?.role === 'customer' ? 'My Dashboard' : 'Salon Dashboard'}
                    </Link>
                  )}
                </div>
                
                {/* Trust Indicators */}
                <div className="trust-indicators mt-4">
                  <div className="d-flex align-items-center text-white-50">
                    <i className="bi bi-shield-check me-2"></i>
                    <small>Secure M-Pesa Payments • 1000+ Happy Customers • Instant Booking</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-visual">
                <div className="floating-card card-1">
                  <i className="bi bi-scissors"></i>
                  <span>Hair Styling</span>
                </div>
                <div className="floating-card card-2">
                  <i className="bi bi-palette"></i>
                  <span>Hair Color</span>
                </div>
                <div className="floating-card card-3">
                  <i className="bi bi-gem"></i>
                  <span>Premium</span>
                </div>
                <div className="main-hero-image">
                  <div className="hero-avatar">
                    <i className="bi bi-star-fill"></i>
                  </div>
                  <h4>Nairobi's Premier Salon Booking</h4>
                  <p>Beauty and convenience combined</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-5">
        <div className="container">
          <div className="row g-4">
            {stats.map((stat, index) => (
              <div key={index} className="col-6 col-md-3">
                <div className="stat-card text-center">
                  <div className="stat-icon">
                    <i className={`bi ${stat.icon}`}></i>
                  </div>
                  <h3 className="stat-number">{stat.number}</h3>
                  <p className="stat-label">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="services-section py-5">
        <div className="container">
          <div className="section-header text-center mb-5">
            <h2>Popular Services</h2>
            <p className="section-subtitle">Discover our most booked hair services in Nairobi</p>
          </div>
          
          <div className="row g-4">
            {popularServices.map((service, index) => (
              <div key={index} className="col-md-4 col-lg-2">
                <div className="service-card text-center">
                  <div className="service-icon">
                    <i className={`bi ${service.icon}`}></i>
                  </div>
                  <h6 className="service-name">{service.name}</h6>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <div className="container">
          <div className="section-header text-center mb-5">
            <h2>Why Choose Looks Nairobi?</h2>
            <p className="section-subtitle">The modern way to book hair services in Nairobi</p>
          </div>
          
          <div className="row g-4">
            {features.map((feature, index) => (
              <div key={index} className="col-md-6 col-lg-4">
                <div className="feature-card">
                  <div className="feature-icon-container">
                    <i className={`bi ${feature.icon}`}></i>
                  </div>
                  <h5>{feature.title}</h5>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="process-section py-5">
        <div className="container">
          <div className="section-header text-center mb-5">
            <h2>How It Works</h2>
            <p className="section-subtitle">Get your perfect style in 3 easy steps</p>
          </div>
          
          <div className="process-steps">
            <div className="process-line"></div>
            <div className="row g-4">
              <div className="col-md-4">
                <div className="process-step text-center">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h5>Find a Salon</h5>
                    <p>Browse through our curated list of top-rated salons in Nairobi</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="process-step text-center">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h5>Book & Pay</h5>
                    <p>Choose your service, select a time slot, and pay securely with M-Pesa</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="process-step text-center">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h5>Get Styled</h5>
                    <p>Visit the salon at your scheduled time and enjoy your new look</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section py-5">
        <div className="container">
          <div className="section-header text-center mb-5">
            <h2>What Our Customers Say</h2>
            <p className="section-subtitle">Real experiences from our happy customers</p>
          </div>
          
          <div className="row g-4">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="col-md-4">
                <div className="testimonial-card">
                  <div className="testimonial-header">
                    <div className="customer-avatar">
                      {testimonial.image}
                    </div>
                    <div className="customer-info">
                      <h6>{testimonial.name}</h6>
                      <small>{testimonial.location}</small>
                    </div>
                  </div>
                  <div className="testimonial-rating text-warning">
                    {renderStars(testimonial.rating)}
                  </div>
                  <p className="testimonial-text">{testimonial.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5">
        <div className="container text-center">
          <div className="cta-content">
            <h2>Ready to Transform Your Look?</h2>
            <p>Join thousands of satisfied customers in Nairobi who trust us for their beauty needs</p>
            <div className="cta-buttons">
              <Link to="/shops" className="btn btn-primary btn-lg">
                <i className="bi bi-search me-2"></i>
                Find Salons
              </Link>
              {!isAuthenticated && (
                <Link to="/register" className="btn btn-outline-primary btn-lg">
                  <i className="bi bi-person-plus me-2"></i>
                  Sign Up Free
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;