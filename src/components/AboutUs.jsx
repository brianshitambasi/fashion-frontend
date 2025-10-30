import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const AboutUs = () => {
  return (
    <div className="about-page py-5 bg-light">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-5">
          <h1 className="fw-bold text-success">About Looks Nairobi</h1>
          <p className="text-muted fs-5 mt-3">
            Where style meets confidence. We connect clients to the best barbers, stylists, and grooming professionals across Nairobi.
          </p>
        </div>

        {/* Our Story */}
        <Row className="align-items-center mb-5">
          <Col md={6}>
            <img
              src="/static/images/fade.webp"
              alt="Salon Interior"
              className="img-fluid rounded shadow-sm"
            />
          </Col>
          <Col md={6}>
            <h3 className="fw-semibold text-dark mt-4 mt-md-0">Our Story</h3>
            <p className="text-muted">
              Founded with a passion for style and grooming excellence, <strong>Looks Nairobi</strong> was created to simplify how people discover and book hair and beauty services in the city. 
              Whether you're looking for a clean fade, trendy braids, or a luxury salon experience — we make it easy to connect you with the best professionals near you.
            </p>
            <p className="text-muted">
              Our platform empowers barbers and stylists to grow their businesses while offering customers a smooth and reliable booking experience.
            </p>
          </Col>
        </Row>

        {/* Our Values */}
        <Row className="text-center mb-5">
          <h3 className="fw-semibold text-success mb-4">Our Core Values</h3>
          <Col md={4}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="mb-3 fs-2 text-success">
                  <i className="bi bi-heart-fill"></i>
                </div>
                <Card.Title className="fw-bold">Passion for Style</Card.Title>
                <Card.Text>
                  We live and breathe fashion and grooming — every hairstyle is a form of art.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="mb-3 fs-2 text-success">
                  <i className="bi bi-people-fill"></i>
                </div>
                <Card.Title className="fw-bold">Community Driven</Card.Title>
                <Card.Text>
                  We bring together barbers, stylists, and clients in a thriving beauty community.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="mb-3 fs-2 text-success">
                  <i className="bi bi-shield-check"></i>
                </div>
                <Card.Title className="fw-bold">Trust & Quality</Card.Title>
                <Card.Text>
                  Verified shops, real reviews, and a commitment to excellence — always.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Call to Action */}
        <Row className="text-center mt-5">
          <Col>
            <h3 className="fw-bold mb-3 text-dark">
              Ready to redefine your look?
            </h3>
            <p className="text-muted mb-4">
              Join our growing community of stylists and clients who trust Looks Nairobi.
            </p>
            <Button variant="success" size="lg" href="/register">
              Get Started
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AboutUs;
