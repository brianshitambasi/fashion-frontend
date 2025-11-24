// components/public/About.js
import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      description: 'Passionate about connecting people with the best beauty services in Nairobi.',
      image: '👩‍💼',
      social: {
        twitter: '#',
        linkedin: '#',
        instagram: '#'
      }
    },
    {
      name: 'Mike Chen',
      role: 'CTO',
      description: 'Tech enthusiast building seamless booking experiences for our users.',
      image: '👨‍💻',
      social: {
        twitter: '#',
        linkedin: '#',
        github: '#'
      }
    },
    {
      name: 'Grace Wanjiku',
      role: 'Head of Partnerships',
      description: 'Building relationships with top salons across Nairobi.',
      image: '👩‍🎨',
      social: {
        twitter: '#',
        linkedin: '#',
        instagram: '#'
      }
    },
    {
      name: 'David Omondi',
      role: 'Customer Success',
      description: 'Ensuring every customer has an amazing experience with our platform.',
      image: '👨‍💼',
      social: {
        twitter: '#',
        linkedin: '#'
      }
    }
  ];

  const milestones = [
    { 
      year: '2023', 
      event: 'Founded BeautyHub',
      description: 'Started with a vision to transform beauty services in Nairobi',
      icon: 'bi-rocket-takeoff'
    },
    { 
      year: '2024', 
      event: 'Onboarded 50+ Premium Salons',
      description: 'Partnered with top-rated salons across the city',
      icon: 'bi-shop'
    },
    { 
      year: '2024', 
      event: 'Reached 1000+ Customers',
      description: 'Helped thousands discover their perfect beauty services',
      icon: 'bi-people'
    },
    { 
      year: '2024', 
      event: 'Launched M-Pesa Integration',
      description: 'Made secure payments seamless for Kenyan customers',
      icon: 'bi-phone'
    },
    { 
      year: '2024', 
      event: 'Expanded Service Categories',
      description: 'Added makeup, spa, and premium beauty services',
      icon: 'bi-gem'
    }
  ];

  const values = [
    {
      icon: 'bi-heart',
      title: 'Customer First',
      description: 'We prioritize our customers\' satisfaction above everything else.'
    },
    {
      icon: 'bi-shield-check',
      title: 'Trust & Safety',
      description: 'Verified salons and secure payments ensure your peace of mind.'
    },
    {
      icon: 'bi-lightning',
      title: 'Innovation',
      description: 'Constantly improving our platform to serve you better.'
    },
    {
      icon: 'bi-star',
      title: 'Excellence',
      description: 'Only the best salons and services make it to our platform.'
    },
    {
      icon: 'bi-people',
      title: 'Community',
      description: 'Building a community of beauty enthusiasts and professionals.'
    },
    {
      icon: 'bi-globe',
      title: 'Accessibility',
      description: 'Making premium beauty services accessible to everyone.'
    }
  ];

  return (
    <div className="container-fluid bg-light min-vh-100">
      {/* Hero Section */}
      <section className="bg-gradient-beauty text-white py-5">
        <div className="container">
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb breadcrumb-light">
              <li className="breadcrumb-item">
                <Link to="/" className="text-white-50 text-decoration-none">
                  <i className="bi bi-house me-1"></i>Home
                </Link>
              </li>
              <li className="breadcrumb-item active text-white">About Us</li>
            </ol>
          </nav>
          
          <div className="row align-items-center py-4">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-3">
                About <span className="text-warning">BeautyHub</span>
              </h1>
              <p className="lead mb-4 opacity-75">
                Transforming the beauty salon experience in Nairobi through innovation, 
                technology, and a passion for exceptional service.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3">
                <Link to="/shops" className="btn btn-light btn-lg px-4 py-2 fw-semibold">
                  <i className="bi bi-search me-2"></i>
                  Explore Salons
                </Link>
                <Link to="/register" className="btn btn-outline-light btn-lg px-4 py-2">
                  <i className="bi bi-person-plus me-2"></i>
                  Join Our Community
                </Link>
              </div>
            </div>
            <div className="col-lg-4 text-center">
              <div className="bg-white bg-opacity-10 rounded-circle p-5 d-inline-block">
                <i className="bi bi-scissors display-1 text-warning"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-5">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-6">
              <div className="pe-lg-4">
                <h2 className="fw-bold mb-4 text-dark">
                  <i className="bi bi-bullseye me-3 text-primary"></i>
                  Our Mission
                </h2>
                <p className="fs-5 text-muted mb-4">
                  At BeautyHub, we believe that everyone deserves access to quality beauty services 
                  without the hassle of long waits and uncertain availability. Our platform bridges the gap 
                  between talented beauty professionals and customers looking for the perfect salon experience.
                </p>
                <p className="fs-5 text-muted mb-4">
                  We're committed to making beauty services more accessible, reliable, and convenient 
                  for the people of Nairobi through technology and innovation.
                </p>
                
                <div className="row g-3 mt-4">
                  <div className="col-6">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-check-circle-fill text-success me-2 fs-5"></i>
                      <span className="fw-semibold">Verified Salons</span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-check-circle-fill text-success me-2 fs-5"></i>
                      <span className="fw-semibold">Secure Payments</span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-check-circle-fill text-success me-2 fs-5"></i>
                      <span className="fw-semibold">Real Reviews</span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-check-circle-fill text-success me-2 fs-5"></i>
                      <span className="fw-semibold">Instant Booking</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="card border-0 shadow-lg h-100">
                <div className="card-body p-4 p-md-5">
                  <h3 className="fw-bold mb-4 text-dark">
                    <i className="bi bi-eye me-3 text-primary"></i>
                    Our Vision
                  </h3>
                  <p className="fs-5 text-muted mb-4">
                    To become Nairobi's most trusted platform for beauty services, where customers 
                    can effortlessly discover, book, and enjoy premium salon experiences.
                  </p>
                  
                  <div className="mt-4">
                    <h5 className="fw-semibold mb-3 text-dark">Why Choose BeautyHub?</h5>
                    <div className="row g-3">
                      <div className="col-12">
                        <div className="d-flex align-items-start">
                          <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                            <i className="bi bi-gem text-primary"></i>
                          </div>
                          <div>
                            <h6 className="fw-semibold mb-1">Premium Quality</h6>
                            <p className="text-muted small mb-0">Only the best salons and stylists</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-flex align-items-start">
                          <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                            <i className="bi bi-lightning text-success"></i>
                          </div>
                          <div>
                            <h6 className="fw-semibold mb-1">Instant Booking</h6>
                            <p className="text-muted small mb-0">Book appointments in seconds</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-flex align-items-start">
                          <div className="bg-warning bg-opacity-10 rounded-circle p-2 me-3">
                            <i className="bi bi-shield-check text-warning"></i>
                          </div>
                          <div>
                            <h6 className="fw-semibold mb-1">Secure Payments</h6>
                            <p className="text-muted small mb-0">M-Pesa and card payments</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-3 col-6 text-center">
              <div className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-flex align-items-center justify-content-center mb-3">
                <i className="bi bi-shop fs-2 text-primary"></i>
              </div>
              <h3 className="fw-bold text-dark mb-1">50+</h3>
              <p className="text-muted mb-0">Premium Salons</p>
            </div>
            <div className="col-md-3 col-6 text-center">
              <div className="bg-success bg-opacity-10 rounded-circle p-3 d-inline-flex align-items-center justify-content-center mb-3">
                <i className="bi bi-emoji-smile fs-2 text-success"></i>
              </div>
              <h3 className="fw-bold text-dark mb-1">1000+</h3>
              <p className="text-muted mb-0">Happy Customers</p>
            </div>
            <div className="col-md-3 col-6 text-center">
              <div className="bg-info bg-opacity-10 rounded-circle p-3 d-inline-flex align-items-center justify-content-center mb-3">
                <i className="bi bi-calendar-check fs-2 text-info"></i>
              </div>
              <h3 className="fw-bold text-dark mb-1">2000+</h3>
              <p className="text-muted mb-0">Successful Bookings</p>
            </div>
            <div className="col-md-3 col-6 text-center">
              <div className="bg-warning bg-opacity-10 rounded-circle p-3 d-inline-flex align-items-center justify-content-center mb-3">
                <i className="bi bi-star fs-2 text-warning"></i>
              </div>
              <h3 className="fw-bold text-dark mb-1">4.8/5</h3>
              <p className="text-muted mb-0">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3 text-dark">Our Values</h2>
            <p className="text-muted lead">The principles that guide everything we do</p>
          </div>
          
          <div className="row g-4">
            {values.map((value, index) => (
              <div key={index} className="col-md-6 col-lg-4">
                <div className="card border-0 h-100 hover-lift">
                  <div className="card-body text-center p-4">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-flex align-items-center justify-content-center mb-3">
                      <i className={`bi ${value.icon} fs-3 text-primary`}></i>
                    </div>
                    <h5 className="fw-semibold mb-3">{value.title}</h5>
                    <p className="text-muted mb-0">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3 text-dark">Meet Our Team</h2>
            <p className="text-muted lead">The passionate people behind BeautyHub</p>
          </div>
          
          <div className="row g-4">
            {teamMembers.map((member, index) => (
              <div key={index} className="col-md-6 col-lg-3">
                <div className="card border-0 shadow-sm h-100 team-card">
                  <div className="card-body text-center p-4">
                    <div className="team-avatar mb-3">
                      <span className="display-1">{member.image}</span>
                    </div>
                    <h5 className="fw-bold mb-2">{member.name}</h5>
                    <h6 className="text-primary mb-3">{member.role}</h6>
                    <p className="text-muted small mb-3">{member.description}</p>
                    
                    <div className="social-links">
                      {member.social.twitter && (
                        <a href={member.social.twitter} className="social-link">
                          <i className="bi bi-twitter-x"></i>
                        </a>
                      )}
                      {member.social.linkedin && (
                        <a href={member.social.linkedin} className="social-link">
                          <i className="bi bi-linkedin"></i>
                        </a>
                      )}
                      {member.social.instagram && (
                        <a href={member.social.instagram} className="social-link">
                          <i className="bi bi-instagram"></i>
                        </a>
                      )}
                      {member.social.github && (
                        <a href={member.social.github} className="social-link">
                          <i className="bi bi-github"></i>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3 text-dark">Our Journey</h2>
            <p className="text-muted lead">Milestones in our BeautyHub story</p>
          </div>
          
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="timeline">
                {milestones.map((milestone, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-marker">
                      <i className={`bi ${milestone.icon}`}></i>
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-year">{milestone.year}</div>
                      <h5 className="fw-bold mb-2">{milestone.event}</h5>
                      <p className="text-muted mb-0">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-gradient-primary text-white">
        <div className="container text-center">
          <h2 className="fw-bold mb-3">Ready to Experience the Difference?</h2>
          <p className="lead mb-4 opacity-75">
            Join thousands of satisfied customers and discover the best beauty services in Nairobi
          </p>
          <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
            <Link to="/shops" className="btn btn-light btn-lg px-4 py-2 fw-semibold">
              <i className="bi bi-search me-2"></i>
              Find a Salon
            </Link>
            <Link to="/register" className="btn btn-outline-light btn-lg px-4 py-2">
              <i className="bi bi-person-plus me-2"></i>
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Bootstrap Icons */}
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" 
        rel="stylesheet" 
      />

      {/* Custom Styles */}
      <style jsx>{`
        .bg-gradient-beauty {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .breadcrumb-light .breadcrumb-item.active {
          color: white;
        }
        .breadcrumb-light .breadcrumb-item a:hover {
          color: white !important;
        }
        .hover-lift {
          transition: all 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        .team-card {
          transition: all 0.3s ease;
        }
        .team-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .team-avatar {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }
        .social-links {
          display: flex;
          justify-content: center;
          gap: 10px;
        }
        .social-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          background: #f8f9fa;
          color: #6c757d;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .social-link:hover {
          background: #667eea;
          color: white;
          transform: translateY(-2px);
        }
        .timeline {
          position: relative;
          padding: 40px 0;
        }
        .timeline::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, #667eea, #764ba2);
          transform: translateX(-50%);
        }
        .timeline-item {
          display: flex;
          align-items: center;
          margin-bottom: 50px;
          position: relative;
        }
        .timeline-item:nth-child(odd) {
          flex-direction: row-reverse;
          text-align: right;
        }
        .timeline-item:nth-child(odd) .timeline-content {
          margin-right: 30px;
          margin-left: 0;
        }
        .timeline-marker {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: white;
          border: 3px solid #667eea;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          color: #667eea;
          z-index: 2;
          flex-shrink: 0;
        }
        .timeline-content {
          background: white;
          padding: 25px;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          margin-left: 30px;
          flex: 1;
        }
        .timeline-year {
          font-size: 0.875rem;
          color: #667eea;
          font-weight: 600;
          margin-bottom: 5px;
        }
        @media (max-width: 768px) {
          .timeline::before {
            left: 30px;
          }
          .timeline-item {
            flex-direction: row !important;
            text-align: left !important;
          }
          .timeline-item .timeline-content {
            margin-left: 30px !important;
            margin-right: 0 !important;
          }
          .display-4 {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default About;