// src/components/HomeComponent.jsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner, Carousel } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Home.css";

const HomeComponent = () => {
  const [shops, setShops] = useState([]);
  const [hairstyles, setHairstyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [shopRes, styleRes] = await Promise.all([
          axios.get("http://localhost:3002/shop"),
          axios.get("http://localhost:3002/hairstyle"),
        ]);
        setShops(shopRes.data);
        setHairstyles(styleRes.data);
      } catch (error) {
        console.error("❌ Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  // 🔐 Handle Explore / Get Started click
  const handleExploreClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/shops");
    } else {
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="home bg-light">
      {/* ===== HERO SECTION ===== */}
      <section className="hero d-flex align-items-center justify-content-center text-center text-white bg-dark position-relative">
        <div className="overlay position-absolute w-100 h-100" style={{ background: "rgba(0,0,0,0.6)" }}></div>
        <div className="container position-relative z-2 py-5">
          <h1 className="display-3 fw-bold mb-3 animate__animated animate__fadeInDown">
            Style Meets Simplicity
          </h1>
          <p className="lead mb-4 fs-5 animate__animated animate__fadeInUp">
            Discover Nairobi’s best salons and barbershops — book your next look effortlessly.
          </p>
          <Button
            onClick={handleExploreClick}
            variant="primary"
            size="lg"
            className="px-5 py-3 fw-semibold shadow"
          >
            Explore Shops
          </Button>
        </div>
      </section>

      {/* ===== TRENDING HAIRSTYLES ===== */}
      <section className="py-5 bg-white">
        <Container>
          <h2 className="text-center fw-bold text-primary mb-4">Trending Hairstyles ✨</h2>
          <Carousel indicators={false} interval={2500} className="rounded shadow">
            {hairstyles.length > 0 ? (
              hairstyles.slice(0, 5).map((style) => (
                <Carousel.Item key={style._id}>
                  <img
                    className="d-block w-100 rounded-4"
                    src={
                      style.imageUrl ||
                      "https://images.unsplash.com/photo-1596464716121-2be739ef8c01?auto=format&fit=crop&w=1600&q=80"
                    }
                    alt={style.name}
                    height="500"
                    style={{ objectFit: "cover" }}
                  />
                  <Carousel.Caption className="bg-dark bg-opacity-50 rounded p-3">
                    <h3>{style.name}</h3>
                    <p>{style.description || "Popular trending hairstyle"}</p>
                  </Carousel.Caption>
                </Carousel.Item>
              ))
            ) : (
              <Carousel.Item>
                <img
                  className="d-block w-100 rounded-4"
                  src="https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=1600&q=80"
                  alt="Default Style"
                  height="500"
                  style={{ objectFit: "cover" }}
                />
                <Carousel.Caption className="bg-dark bg-opacity-50 rounded p-3">
                  <h3>No Hairstyles Yet</h3>
                  <p>Check back soon for more styles!</p>
                </Carousel.Caption>
              </Carousel.Item>
            )}
          </Carousel>
        </Container>
      </section>

      {/* ===== FEATURED SHOPS ===== */}
      <Container className="my-5">
        <h2 className="text-center fw-semibold mb-4">💈 Featured Shops</h2>
        <Row>
          {shops.length > 0 ? (
            shops.slice(0, 4).map((shop) => (
              <Col md={3} sm={6} xs={12} key={shop._id} className="mb-4">
                <Card className="shadow-sm h-100 border-0 hover-card">
                  <Card.Img
                    variant="top"
                    src={
                      shop.image ||
                      "https://images.unsplash.com/photo-1600180758890-6d5bbde9d89a?auto=format&fit=crop&w=800&q=80"
                    }
                    height="180"
                    style={{ objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title className="fw-bold">{shop.name}</Card.Title>
                    <Card.Text className="text-muted">{shop.location}</Card.Text>
                    <Card.Text>
                      {shop.description?.substring(0, 80) ||
                        "A great place for a fresh look."}
                    </Card.Text>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={handleExploreClick}
                    >
                      View Shop
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p className="text-center text-muted">No shops available yet.</p>
          )}
        </Row>
      </Container>

      {/* ===== WHY LOOKSNAIROBI ===== */}
      <section className="container py-5 text-center">
        <h2 className="fw-bold text-primary mb-4">Why Choose Looksnairobi?</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="p-4 shadow-sm bg-white rounded h-100">
              <i className="bi bi-calendar-check fs-1 text-success mb-3"></i>
              <h4 className="fw-semibold">Easy Bookings</h4>
              <p>Book your haircut or salon service instantly — no waiting in line!</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 shadow-sm bg-white rounded h-100">
              <i className="bi bi-cash-stack fs-1 text-warning mb-3"></i>
              <h4 className="fw-semibold">Transparent Payments</h4>
              <p>We charge only 5% commission — your stylist earns fairly, always.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 shadow-sm bg-white rounded h-100">
              <i className="bi bi-star-fill fs-1 text-primary mb-3"></i>
              <h4 className="fw-semibold">Rated & Reviewed</h4>
              <p>All shops are verified and rated by real customers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section
        className="text-center text-white py-5"
        style={{ backgroundColor: "#212529" }}
      >
        <div className="container">
          <h2 className="fw-bold mb-3">Join the Looksnairobi Movement</h2>
          <p className="mb-4 lead">
            Whether you’re a barber, salon, or customer — we make beauty booking effortless.
          </p>
          <Button
            onClick={handleExploreClick}
            variant="light"
            size="lg"
            className="fw-semibold px-5 py-3 shadow"
          >
            Get Started
          </Button>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-primary text-white text-center py-4 mt-5">
        <div className="container">
          <p className="mb-3">
            Looksnairobi connects customers with trusted salons and barbers across Kenya.  
            Style, convenience, and trust — all in one platform.
          </p>
          <p className="mb-1">
            © {new Date().getFullYear()} Looksnairobi. All rights reserved.
          </p>
          <p>
            <Link to="/privacy" className="text-white me-3">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-white">
              Terms of Service
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomeComponent;
