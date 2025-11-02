import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner, Alert, Form, Button, Card, Row, Col } from "react-bootstrap";

const API_BASE = "https://hair-salon-app-1.onrender.com/api/settings";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    address: "",
    bio: "",
  });

  // ✅ Load current profile
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${API_BASE}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm({
          name: data.settings.name || "",
          email: data.settings.email || "",
          phone: data.settings.phone || "",
          businessName: data.settings.businessName || "",
          address: data.settings.address || "",
          bio: data.settings.bio || "",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load profile settings.");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // ✅ Handle form changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Submit profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE}/profile`,
        {
          name: form.name,
          phone: form.phone,
          businessName: form.businessName,
          address: form.address,
          bio: form.bio,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="container py-5">
      <Card className="shadow-lg border-0 rounded-4">
        <Card.Body className="p-4">
          <h3 className="text-center mb-4 fw-bold">
            <i className="bi bi-person-circle me-2"></i>Profile Settings
          </h3>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="name">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={form.email}
                    disabled
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="phone">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="businessName">
                  <Form.Label>Business Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="businessName"
                    value={form.businessName}
                    onChange={handleChange}
                    placeholder="Enter your business name"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter your business address"
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="bio">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Write a short description about your business..."
              />
            </Form.Group>

            <div className="text-center">
              <Button
                type="submit"
                variant="primary"
                className="px-4 py-2 rounded-pill fw-semibold"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Spinner size="sm" animation="border" /> Saving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-save me-2"></i>Save Changes
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Profile;
