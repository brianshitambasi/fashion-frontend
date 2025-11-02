// components/public/About.js
import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      description: 'Passionate about connecting people with the best beauty services in Nairobi.',
      image: '👩‍💼'
    },
    {
      name: 'Mike Chen',
      role: 'CTO',
      description: 'Tech enthusiast building seamless booking experiences for our users.',
      image: '👨‍💻'
    },
    {
      name: 'Grace Wanjiku',
      role: 'Head of Partnerships',
      description: 'Building relationships with top salons across Nairobi.',
      image: '👩‍🎨'
    }
  ];

  const milestones = [
    { year: '2023', event: 'Founded Looks Nairobi' },
    { year: '2024', event: 'Onboarded 50+ salons' },
    { year: '2024', event: 'Reached 1000+ customers' },
    { year: '2024', event: 'Launched M-Pesa integration' }
  ];

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="row mb-5">
        <div className="col">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Home</Link></li>
              <li className="breadcrumb-item active">About Us</li>
            </ol>
          </nav>
          <h1 className="fw-bold">About Looks Nairobi</h1>
          <p className="lead text-muted">Transforming the hair salon experience in Nairobi</p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="row mb-5">
        <div className="col-lg-6">
          <h2 className="fw-bold mb-4">Our Mission</h2>
          <p className="mb-4">
            At Looks Nairobi, we believe that everyone deserves access to quality hair care services 
            without the hassle of long waits and uncertain availability. Our platform bridges the gap 
            between talented hairstylists and customers looking for the perfect salon experience.
          </p>
          <p className="mb-4">
            We're committed to making beauty services more accessible, reliable, and convenient 
            for the people of Nairobi through technology and innovation.
          </p>
          <div className="d-flex gap-3">
            <Link to="/shops" className="btn btn-primary">
              Explore Salons
            </Link>
            <Link to="/register" className="btn btn-outline-primary">
              Join Our Community
            </Link>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card border-0 bg-light">
            <div className="card-body text-center p-5">
              <i className="bi bi-scissors display-1 text-primary mb-3"></i>
              <h4 className="fw-bold">Why Choose Us?</h4>
              <div className="row mt-4 text-start">
                <div className="col-6 mb-3">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Verified Salons
                </div>
                <div className="col-6 mb-3">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Secure Payments
                </div>
                <div className="col-6 mb-3">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Real Reviews
                </div>
                <div className="col-6 mb-3">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Instant Booking
                </div>
                <div className="col-6 mb-3">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Customer Support
                </div>
                <div className="col-6 mb-3">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Best Prices
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="row mb-5 py-5 bg-light rounded-3">
        <div className="col text-center">
          <div className="row g-4">
            <div className="col-md-3">
              <h3 className="fw-bold text-primary">50+</h3>
              <p className="text-muted">Professional Salons</p>
            </div>
            <div className="col-md-3">
              <h3 className="fw-bold text-success">1000+</h3>
              <p className="text-muted">Happy Customers</p>
            </div>
            <div className="col-md-3">
              <h3 className="fw-bold text-info">2000+</h3>
              <p className="text-muted">Successful Bookings</p>
            </div>
            <div className="col-md-3">
              <h3 className="fw-bold text-warning">4.8/5</h3>
              <p className="text-muted">Average Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="row mb-5">
        <div className="col-12">
          <h2 className="fw-bold text-center mb-5">Meet Our Team</h2>
          <div className="row g-4">
            {teamMembers.map((member, index) => (
              <div key={index} className="col-md-4">
                <div className="card border-0 text-center h-100">
                  <div className="card-body">
                    <div className="display-1 mb-3">{member.image}</div>
                    <h5 className="card-title">{member.name}</h5>
                    <h6 className="card-subtitle mb-3 text-primary">{member.role}</h6>
                    <p className="card-text text-muted">{member.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="row mb-5">
        <div className="col-12">
          <h2 className="fw-bold text-center mb-5">Our Journey</h2>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="timeline">
                {milestones.map((milestone, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-marker bg-primary"></div>
                    <div className="timeline-content">
                      <h5 className="fw-bold">{milestone.year}</h5>
                      <p className="text-muted mb-0">{milestone.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="row">
        <div className="col-12">
          <div className="card bg-primary text-white">
            <div className="card-body text-center py-5">
              <h2 className="fw-bold mb-3">Ready to Experience the Difference?</h2>
              <p className="mb-4 opacity-75">
                Join thousands of satisfied customers and discover the best salons in Nairobi
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Link to="/shops" className="btn btn-light btn-lg">
                  <i className="bi bi-search me-2"></i>
                  Find a Salon
                </Link>
                <Link to="/register" className="btn btn-outline-light btn-lg">
                  <i className="bi bi-person-plus me-2"></i>
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;