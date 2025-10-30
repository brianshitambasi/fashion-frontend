import React from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Form, Button } from "react-bootstrap";

const BookingPage = () => {
  const { id } = useParams();

  return (
    <Container className="py-4" style={{ maxWidth: "600px" }}>
      <Card className="shadow-sm p-4 border-0">
        <h2 className="text-center mb-3">📅 Book Appointment</h2>
        <p className="text-center text-muted">
          Booking for shop ID: <strong>{id}</strong>
        </p>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Select Date</Form.Label>
            <Form.Control type="date" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Select Time</Form.Label>
            <Form.Control type="time" />
          </Form.Group>

          <Button variant="dark" className="w-100">
            Confirm Booking
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default BookingPage;
