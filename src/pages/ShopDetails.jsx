import React from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Button } from "react-bootstrap";

const ShopDetails = () => {
  const { id } = useParams();

  return (
    <Container className="py-4">
      <Card className="shadow-sm p-4 border-0">
        <h2 className="text-center mb-3">💈 Shop Details</h2>
        <p className="text-center text-muted">
          Displaying details for shop ID: <strong>{id}</strong>
        </p>
        <div className="text-center">
          <Button variant="dark">Book Appointment</Button>
        </div>
      </Card>
    </Container>
  );
};

export default ShopDetails;
