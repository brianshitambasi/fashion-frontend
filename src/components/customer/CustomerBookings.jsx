// components/customer/CustomerBookings.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const BACKEND_URL = "https://hair-salon-app-1.onrender.com";

const CustomerBookings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { shopId } = location.state || {};

  const [shop, setShop] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dateTime, setDateTime] = useState("");

  // Fetch the shop details & services
  useEffect(() => {
    if (!shopId) {
      navigate("/shops");
      return;
    }
    const fetchShop = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/shop/${shopId}`);
        setShop(res.data);
      } catch (err) {
        console.error("Error fetching shop details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, [shopId, navigate]);

  const toggleService = (service) => {
    setSelectedServices((prev) =>
      prev.some((s) => s._id === service._id)
        ? prev.filter((s) => s._id !== service._id)
        : [...prev, service]
    );
  };

  const totalCost = selectedServices.reduce((sum, s) => sum + s.price, 0);

  const handleBooking = async () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service.");
      return;
    }
    if (!dateTime) {
      alert("Please select a booking date and time.");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BACKEND_URL}/booking`,
        {
          shop: shop._id,
          services: selectedServices.map((s) => ({
            serviceName: s.serviceName,
            price: s.price,
          })),
          dateTime,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Booking created successfully!");
      navigate("/customer/my-bookings");
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading shop details...</div>;
  }

  if (!shop) {
    return <div className="p-6 text-center text-red-500">Shop not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{shop.name}</h1>
      <p className="text-gray-600 mb-2">📍 {shop.location}</p>
      <p className="text-gray-700 mb-4">{shop.description}</p>

      <h2 className="text-2xl font-semibold mb-3">Available Services</h2>
      <div className="space-y-3">
        {shop.services?.map((service) => (
          <div
            key={service._id}
            className={`flex justify-between items-center p-3 border rounded-md cursor-pointer ${
              selectedServices.some((s) => s._id === service._id)
                ? "bg-blue-50 border-blue-500"
                : "hover:bg-gray-50"
            }`}
            onClick={() => toggleService(service)}
          >
            <span>
              <strong>{service.serviceName}</strong>
              <p className="text-sm text-gray-500">KSh {service.price}</p>
            </span>
            <input
              type="checkbox"
              checked={selectedServices.some((s) => s._id === service._id)}
              readOnly
            />
          </div>
        ))}
      </div>

      <div className="mt-6">
        <label className="block text-gray-700 mb-2 font-medium">
          Choose Date & Time
        </label>
        <input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          className="border p-2 rounded-md w-full md:w-1/2"
        />
      </div>

      <div className="mt-6 flex justify-between items-center">
        <h3 className="text-xl font-semibold">
          Total: <span className="text-blue-600">KSh {totalCost}</span>
        </h3>
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          onClick={handleBooking}
          disabled={submitting}
        >
          {submitting ? "Processing..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
};

export default CustomerBookings;
