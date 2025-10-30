// src/components/FooterComponent.jsx
import React from "react";
import { Container } from "react-bootstrap";

const FooterComponent = () => {
  return (
    <footer className="bg-dark text-light py-3 mt-5">
      <Container className="text-center">
        <small>© {new Date().getFullYear()} Looks Nairobi. All rights reserved.</small>
      </Container>
    </footer>
  );
};

export default FooterComponent;
