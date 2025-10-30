import React, { useState } from "react";
import axios from "axios";

const CreateShop = () => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
  });
  const [services, setServices] = useState([{ serviceName: "", price: "" }]);
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleServiceChange = (index, e) => {
    const newServices = [...services];
    newServices[index][e.target.name] = e.target.value;
    setServices(newServices);
  };

  const addService = () => {
    setServices([...services, { serviceName: "", price: "" }]);
  };

  const removeService = (index) => {
    const newServices = [...services];
    newServices.splice(index, 1);
    setServices(newServices);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("❌ Please log in first");
        setLoading(false);
        return;
      }

      const data = new FormData();
      data.append("name", formData.name);
      data.append("location", formData.location);
      data.append("description", formData.description);
      data.append("services", JSON.stringify(services));
      if (image) data.append("image", image);

      const res = await axios.post("https://hair-salon-app-1.onrender.com/shop", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(`✅ ${res.data.message}`);
      setFormData({ name: "", location: "", description: "" });
      setServices([{ serviceName: "", price: "" }]);
      setImage(null);
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.message || "❌ Error creating shop. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="card shadow p-4">
        <h3 className="text-center mb-4">🛍️ Create a New Shop</h3>

        {message && (
          <div
            className={`alert ${
              message.startsWith("✅") ? "alert-success" : "alert-danger"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-3">
            <label className="form-label">Shop Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
              rows="3"
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label">Services</label>
            {services.map((service, index) => (
              <div className="row g-2 mb-2" key={index}>
                <div className="col-md-6">
                  <input
                    type="text"
                    name="serviceName"
                    value={service.serviceName}
                    onChange={(e) => handleServiceChange(index, e)}
                    className="form-control"
                    placeholder="Service Name"
                    required
                  />
                </div>
                <div className="col-md-4">
                  <input
                    type="number"
                    name="price"
                    value={service.price}
                    onChange={(e) => handleServiceChange(index, e)}
                    className="form-control"
                    placeholder="Price"
                    required
                  />
                </div>
                <div className="col-md-2">
                  {services.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeService(index)}
                      className="btn btn-danger w-100"
                    >
                      ✖
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addService}
              className="btn btn-secondary mt-2"
            >
              + Add Service
            </button>
          </div>

          <div className="mb-3">
            <label className="form-label">Shop Image</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Shop"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateShop;
