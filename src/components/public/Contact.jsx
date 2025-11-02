// components/public/Contact.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: 'bi-envelope',
      title: 'Email Us',
      details: 'support@looksnairobi.com',
      description: 'Send us an email anytime'
    },
    {
      icon: 'bi-telephone',
      title: 'Call Us',
      details: '+254 700 000 000',
      description: 'Mon to Fri, 8AM to 6PM'
    },
    {
      icon: 'bi-geo-alt',
      title: 'Visit Us',
      details: 'Nairobi, Kenya',
      description: 'We serve all of Nairobi'
    },
    {
      icon: 'bi-clock',
      title: 'Customer Support',
      details: '24/7 Available',
      description: 'Online support always available'
    }
  ];

  const faqs = [
    {
      question: 'How do I book an appointment?',
      answer: 'Simply browse our salons, select a service, choose your preferred date and time, and complete the booking process. You can pay instantly via M-Pesa.'
    },
    {
      question: 'Can I cancel my booking?',
      answer: 'Yes, you can cancel your booking from your dashboard. Please note that cancellation policies may vary by salon.'
    },
    {
      question: 'How do payments work?',
      answer: 'We support M-Pesa payments for instant booking confirmation. You can also pay at the salon for some services.'
    },
    {
      question: 'Are the salons verified?',
      answer: 'Yes, all salons on our platform are carefully vetted and verified to ensure quality service and customer satisfaction.'
    }
  ];

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="row mb-5">
        <div className="col">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Home</Link></li>
              <li className="breadcrumb-item active">Contact Us</li>
            </ol>
          </nav>
          <h1 className="fw-bold">Contact Us</h1>
          <p className="lead text-muted">We're here to help you look your best</p>
        </div>
      </div>

      <div className="row">
        {/* Contact Information */}
        <div className="col-lg-4 mb-4">
          <div className="card border-0 bg-light h-100">
            <div className="card-body p-4">
              <h4 className="fw-bold mb-4">Get in Touch</h4>
              {contactInfo.map((info, index) => (
                <div key={index} className="d-flex mb-4">
                  <div className="flex-shrink-0">
                    <i className={`bi ${info.icon} fs-4 text-primary`}></i>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="fw-bold mb-1">{info.title}</h6>
                    <p className="mb-1">{info.details}</p>
                    <small className="text-muted">{info.description}</small>
                  </div>
                </div>
              ))}

              <div className="mt-5">
                <h6 className="fw-bold mb-3">Follow Us</h6>
                <div className="d-flex gap-3">
                  <a href="#" className="text-primary">
                    <i className="bi bi-facebook fs-5"></i>
                  </a>
                  <a href="#" className="text-primary">
                    <i className="bi bi-twitter fs-5"></i>
                  </a>
                  <a href="#" className="text-primary">
                    <i className="bi bi-instagram fs-5"></i>
                  </a>
                  <a href="#" className="text-primary">
                    <i className="bi bi-linkedin fs-5"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h4 className="fw-bold mb-4">Send us a Message</h4>
              
              {submitted && (
                <div className="alert alert-success" role="alert">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Thank you for your message! We'll get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="name" className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">Email Address *</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="subject" className="form-label">Subject *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="message" className="form-label">Message *</label>
                  <textarea
                    className="form-control"
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary btn-lg">
                  <i className="bi bi-send me-2"></i>
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="card border-0 shadow-sm mt-4">
            <div className="card-body p-4">
              <h4 className="fw-bold mb-4">Frequently Asked Questions</h4>
              <div className="accordion" id="faqAccordion">
                {faqs.map((faq, index) => (
                  <div key={index} className="accordion-item border-0">
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button collapsed bg-light"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#faq${index}`}
                      >
                        {faq.question}
                      </button>
                    </h2>
                    <div
                      id={`faq${index}`}
                      className="accordion-collapse collapse"
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;