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
  const [dateTime, setDateTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bookings, setBookings] = useState([]);

  const token = localStorage.getItem("token");

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

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user || !user._id) return;
      try {
        const res = await axios.get(`${BACKEND_URL}/booking/customer/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };
    fetchBookings();
  }, [user, token]);

  const toggleService = (service) => {
    setSelectedServices((prev) =>
      prev.some((s) => s._id === service._id)
        ? prev.filter((s) => s._id !== service._id)
        : [...prev, service]
    );
  };

  const totalCost = selectedServices.reduce((sum, s) => sum + s.price, 0);

  const handleBooking = async () => {
    if (!selectedServices.length) return alert("Please select at least one service.");
    if (!dateTime) return alert("Please select a booking date and time.");
    if (!user || !user._id) return alert("User not found. Please log in again.");

    const dateObj = new Date(dateTime);
    const date = dateObj.toISOString().split("T")[0];
    const time = dateObj.toTimeString().slice(0, 5);

    try {
      setSubmitting(true);

      for (const s of selectedServices) {
        const payload = {
          shop: shop._id,
          service: { serviceName: s.serviceName, price: s.price },
          customer: user._id,
          date,
          time,
        };

        await axios.post(`${BACKEND_URL}/booking`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      alert("Booking(s) created successfully!");
      setSelectedServices([]);
      setDateTime("");

      const res = await axios.get(`${BACKEND_URL}/booking/customer/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (error) {
      console.error("Error creating booking:", error);
      alert(error.response?.data?.message || "Failed to create booking.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      await axios.delete(`${BACKEND_URL}/booking/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      alert("Booking deleted successfully!");
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to delete booking.");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading shop details...</div>;
  if (!shop) return <div className="p-6 text-center text-red-500">Shop not found.</div>;

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
        <label className="block text-gray-700 mb-2 font-medium">Choose Date & Time</label>
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

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>
        {bookings.length === 0 ? (
          <p className="text-gray-500">No bookings yet.</p>
        ) : (
          <ul className="space-y-4">
            {bookings.map((b) => (
              <li
                key={b._id}
                className="p-4 border rounded-md flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{b.service?.serviceName}</p>
                  <p className="text-sm text-gray-600">
                    Date: {b.date} | Time: {b.time}
                  </p>
                  <p className="text-sm text-gray-500">
                    Status: {b.status || "pending"}
                  </p>
                </div>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => handleDelete(b._id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CustomerBookings;
