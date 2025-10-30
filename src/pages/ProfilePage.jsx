import React, { useEffect, useState } from "react";
import { Container, Form, Button, Alert, Spinner, Card, Image } from "react-bootstrap";

const ProfilePage = () => {
  const [user, setUser] = useState({ name: "", email: "", phone: "", profileImage: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:3002/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setUser(data.user);
          setPreview(data.user.profileImage ? `http://localhost:3002${data.user.profileImage}` : "");
        } else {
          setError(data.message || "Failed to load profile");
        }
      } catch (err) {
        setError("Error connecting to server");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  // Handle input changes
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("phone", user.phone);
      if (file) formData.append("profileImage", file);

      const res = await fetch("http://localhost:3002/user/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Profile updated successfully!");
        setUser(data.user);
      } else {
        setError(data.message || "Failed to update profile");
      }
    } catch (err) {
      setError("Error connecting to server");
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="dark" />
      </Container>
    );
  }

  return (
    <Container className="py-5" style={{ maxWidth: "600px" }}>
      <Card className="shadow-sm border-0 p-4">
        <h3 className="text-center mb-3">👤 My Profile</h3>

        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={user.name || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" 
            value={user.email || ""} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={user.phone || ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Profile Image</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
          </Form.Group>

          {preview && (
            <div className="text-center mb-3">
              <Image
                src={preview}
                alt="Profile Preview"
                roundedCircle
                width="120"
                height="120"
              />
            </div>
          )}

          <Button type="submit" variant="dark" className="w-100">
            Save Changes
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default ProfilePage;
