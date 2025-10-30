import React from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Form, Button } from "react-bootstrap";

const PaymentPage = () => {
  const { id } = useParams();

  return (
    <Container className="py-4" style={{ maxWidth: "600px" }}>
      <Card className="shadow-sm p-4 border-0">
        <h2 className="text-center mb-3">💳 Payment Page</h2>
        <p className="text-center text-muted">
          Completing payment for booking ID: <strong>{id}</strong>
        </p>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Card Number</Form.Label>
            <Form.Control type="text" placeholder="1234 5678 9012 3456" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Expiry Date</Form.Label>
            <Form.Control type="text" placeholder="MM/YY" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>CVV</Form.Label>
            <Form.Control type="password" placeholder="•••" />
          </Form.Group>

          <Button variant="dark" className="w-100">
            Pay Now
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default PaymentPage;
