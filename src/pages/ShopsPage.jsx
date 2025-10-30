// src/pages/ShopsPage.jsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const ShopsPage = () => {
  const [shops, setShops] = useState([]);

  useEffect(() => {
    // Fetch shops from your backend API
    fetch("http://localhost:3002/shops")
      .then((res) => res.json())
      .then((data) => setShops(data))
      .catch((err) => console.error("Error fetching shops:", err));
  }, []);

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4">💈 Explore Beauty & Hair Studios</h2>
      <Row>
        {shops.length > 0 ? (
          shops.map((shop) => (
            <Col md={4} key={shop._id} className="mb-4">
              <Card className="h-100 shadow-sm border-0">
                <Card.Img
                  variant="top"
                  src={
                    shop.image ||
                    "https://images.unsplash.com/photo-1588776814546-ff2b5c3d0e1e?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={shop.name}
                />
                <Card.Body>
                  <Card.Title>{shop.name}</Card.Title>
                  <Card.Text>
                    📍 {shop.location}
                    <br />
                    💬 {shop.description || "No description provided."}
                  </Card.Text>
                  <Link to={`/shops/${shop._id}`}>
                    <Button variant="dark" className="w-100">
                      View Details
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-center text-muted">No shops available.</p>
        )}
      </Row>
    </Container>
  );
};

export default ShopsPage;
