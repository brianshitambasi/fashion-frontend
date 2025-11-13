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
      if (!token) return;
      try {
        const res = await axios.get(`${BACKEND_URL}/booking`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };
    fetchBookings();
  }, [token]);

  const toggleService = (service) => {
    setSelectedServices((prev) =>
      prev.some((s) => s._id === service._id)
        ? prev.filter((s) => s._id !== service._id)
        : [...prev, service]
    );
  };

  const totalCost = selectedServices.reduce((sum, s) => sum + s.price, 0);

  // Add services to cart first, then checkout
  const addToCart = async () => {
    if (!selectedServices.length) return alert("Please select at least one service.");
    if (!dateTime) return alert("Please select a booking date and time.");
    if (!user || !user._id) return alert("User not found. Please log in again.");

    try {
      setSubmitting(true);

      // Add each selected service to cart
      for (const service of selectedServices) {
        await axios.post(
          `${BACKEND_URL}/cart/add`,
          {
            shop: shopId,
            serviceName: service.serviceName,
            price: service.price,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      // After adding to cart, proceed to checkout
      await handleCheckout();
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert(error.response?.data?.message || "Failed to add services to cart.");
    } finally {
      setSubmitting(false);
    }
  };

  // Checkout cart to create booking
  const handleCheckout = async () => {
    try {
      const checkoutResponse = await axios.post(
        `${BACKEND_URL}/booking/checkout`,
        {
          dateTime: new Date(dateTime).toISOString(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Booking created successfully!");
      setSelectedServices([]);
      setDateTime("");

      // Refresh bookings list
      const bookingsRes = await axios.get(`${BACKEND_URL}/booking`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error("Error during checkout:", error);
      alert(error.response?.data?.message || "Failed to create booking.");
    }
  };

  // Direct booking without cart (alternative approach)
  const handleDirectBooking = async () => {
    if (!selectedServices.length) return alert("Please select at least one service.");
    if (!dateTime) return alert("Please select a booking date and time.");
    if (!user || !user._id) return alert("User not found. Please log in again.");

    try {
      setSubmitting(true);

      const bookingData = {
        customer: user._id,
        shop: shopId,
        services: selectedServices.map(service => ({
          serviceName: service.serviceName,
          price: service.price,
        })),
        totalPrice: totalCost,
        dateTime: new Date(dateTime).toISOString(),
        status: "pending",
      };

      const response = await axios.post(`${BACKEND_URL}/booking/direct`, bookingData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Booking created successfully!");
      setSelectedServices([]);
      setDateTime("");

      // Refresh bookings list
      const bookingsRes = await axios.get(`${BACKEND_URL}/booking`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(bookingsRes.data);
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
      alert(error.response?.data?.message || "Failed to delete booking.");
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await axios.patch(
        `${BACKEND_URL}/booking/${bookingId}`,
        { status: "cancelled" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      // Refresh bookings to get updated status
      const bookingsRes = await axios.get(`${BACKEND_URL}/booking`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(bookingsRes.data);
      alert("Booking cancelled successfully!");
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert(error.response?.data?.message || "Failed to cancel booking.");
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
          min={new Date().toISOString().slice(0, 16)}
        />
      </div>

      <div className="mt-6 flex justify-between items-center">
        <h3 className="text-xl font-semibold">
          Total: <span className="text-blue-600">KSh {totalCost}</span>
        </h3>
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
          onClick={addToCart} // Use addToCart for cart flow or handleDirectBooking for direct booking
          disabled={submitting || !selectedServices.length || !dateTime}
        >
          {submitting ? "Processing..." : "Book Now"}
        </button>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>
        {bookings.length === 0 ? (
          <p className="text-gray-500">No bookings yet.</p>
        ) : (
          <ul className="space-y-4">
            {bookings.map((booking) => (
              <li
                key={booking._id}
                className="p-4 border rounded-md"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{booking.shop?.name}</p>
                    <div className="mt-2">
                      {booking.services?.map((service, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          {service.serviceName} - KSh {service.price}
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Date: {new Date(booking.dateTime).toLocaleDateString()} | 
                      Time: {new Date(booking.dateTime).toLocaleTimeString()}
                    </p>
                    <p className={`text-sm font-medium mt-1 ${
                      booking.status === 'confirmed' ? 'text-green-600' :
                      booking.status === 'cancelled' ? 'text-red-600' :
                      booking.status === 'completed' ? 'text-blue-600' :
                      'text-yellow-600'
                    }`}>
                      Status: {booking.status?.toUpperCase()}
                    </p>
                    <p className="text-sm font-semibold mt-1">
                      Total: KSh {booking.totalPrice}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-2">
                    {booking.status === "pending" && (
                      <>
                        <button
                          className="text-red-600 hover:underline text-sm"
                          onClick={() => handleCancel(booking._id)}
                        >
                          Cancel
                        </button>
                        <button
                          className="text-red-600 hover:underline text-sm"
                          onClick={() => handleDelete(booking._id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                    {booking.status === "confirmed" && (
                      <button
                        className="text-red-600 hover:underline text-sm"
                        onClick={() => handleCancel(booking._id)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CustomerBookings;