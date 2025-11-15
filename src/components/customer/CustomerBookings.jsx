// components/customer/CustomerBookings.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const BACKEND_URL = "https://hair-salon-app-1.onrender.com";

const CustomerBookings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const { shopId } = location.state || {};
  const [shop, setShop] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [dateTime, setDateTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  // Redirect if no shop selected
  useEffect(() => {
    if (!shopId) {
      navigate("/shops");
      return;
    }
  }, [shopId, navigate]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      alert("Please log in to book services");
      navigate("/login");
      return;
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Fetch shop details
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/shop/${shopId}`);
        if (!response.ok) throw new Error("Failed to fetch shop");
        
        const data = await response.json();
        setShop(data);
      } catch (error) {
        console.error("Error fetching shop:", error);
        alert("Failed to load shop details");
      } finally {
        setLoading(false);
      }
    };

    if (shopId) {
      fetchShop();
    }
  }, [shopId]);

  // Fetch user's bookings
  useEffect(() => {
    const fetchBookings = async () => {
      if (!isAuthenticated) return;
      
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BACKEND_URL}/booking`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, [isAuthenticated]);

  // Fetch cart items
  useEffect(() => {
    const fetchCart = async () => {
      if (!isAuthenticated) return;
      
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BACKEND_URL}/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setCartItems(data.items || []);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, [isAuthenticated]);

  const toggleService = (service) => {
    setSelectedServices((prev) =>
      prev.some((s) => s._id === service._id)
        ? prev.filter((s) => s._id !== service._id)
        : [...prev, service]
    );
  };

  const totalCost = selectedServices.reduce((sum, service) => sum + service.price, 0);

  const addToCart = async (service) => {
    if (!isAuthenticated || !user) {
      alert("Please log in to add services to cart");
      navigate("/login");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BACKEND_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shop: shopId,
          serviceName: service.serviceName,
          price: service.price,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCartItems(prev => [...prev, { ...service, shop: shopId }]);
        alert("Service added to cart!");
      } else {
        alert(data.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Error adding service to cart");
    }
  };

  // FIXED: Use the correct booking checkout endpoint
  const handleBooking = async () => {
    if (!selectedServices.length) {
      alert("Please select at least one service.");
      return;
    }
    
    if (!dateTime) {
      alert("Please select a date and time.");
      return;
    }
    
    if (!isAuthenticated || !user) {
      alert("Please log in to book services.");
      navigate("/login");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");

      // Add selected services to cart first
      for (const service of selectedServices) {
        const response = await fetch(`${BACKEND_URL}/cart/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            shop: shopId,
            serviceName: service.serviceName,
            price: service.price,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to add service to cart");
        }
      }

      // FIXED: Use the correct booking checkout endpoint
      console.log("Calling checkout endpoint:", `${BACKEND_URL}/booking/checkout`);
      
      const checkoutResponse = await fetch(`${BACKEND_URL}/booking/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dateTime: new Date(dateTime).toISOString(),
        }),
      });

      if (!checkoutResponse.ok) {
        const errorData = await checkoutResponse.json();
        throw new Error(errorData.message || "Checkout failed");
      }

      const checkoutData = await checkoutResponse.json();
      console.log("Checkout successful:", checkoutData);
      
      alert("Booking created successfully!");
      setSelectedServices([]);
      setDateTime("");
      setCartItems([]);

      // Refresh bookings
      const bookingsResponse = await fetch(`${BACKEND_URL}/booking`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData);
      }
      
    } catch (error) {
      console.error("Booking error:", error);
      alert(error.message || "Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  };

  // ADDED: Missing handleDeleteBooking function
  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BACKEND_URL}/booking/${bookingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setBookings(prev => prev.filter(booking => booking._id !== bookingId));
        alert("Booking deleted successfully!");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to delete booking");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Error deleting booking");
    }
  };

  // CORRECTED: handleCancelBooking using PUT method
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    
    try {
      const token = localStorage.getItem("token");
      
      // Use PUT method to avoid CORS issues
      const response = await fetch(`${BACKEND_URL}/booking/${bookingId}`, {
        method: "PUT", // ✅ USE PUT INSTEAD OF PATCH
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "cancelled"
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to cancel booking");
      }

      // Refresh bookings to get updated status
      const bookingsResponse = await fetch(`${BACKEND_URL}/booking`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData);
      }
      
      alert("Booking cancelled successfully!");
      
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert(error.message || "Failed to cancel booking");
    }
  };

  if (authLoading) {
    return <div className="p-6 text-center">Loading user information...</div>;
  }

  if (loading) {
    return <div className="p-6 text-center">Loading shop details...</div>;
  }

  if (!shop) {
    return <div className="p-6 text-center text-red-500">Shop not found.</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* User Info Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mb-6 border border-blue-200">
        <h1 className="text-2xl font-bold text-blue-800 mb-2">
          Welcome, {user?.name || 'Customer'}!
        </h1>
        <p className="text-blue-600">You are booking as: {user?.email}</p>
        <p className="text-blue-500 text-sm mt-1">Role: {user?.role}</p>
      </div>

      {/* Shop Information */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">{shop.name}</h1>
        <p className="text-gray-600 mb-2 flex items-center">
          📍 {shop.location}
        </p>
        <p className="text-gray-700 mb-4">{shop.description}</p>
        
        {shop.image && (
          <img 
            src={shop.image} 
            alt={shop.name}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
        )}
      </div>

      {/* Available Services */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Available Services</h2>
        <div className="space-y-3">
          {shop.services?.map((service) => (
            <div
              key={service._id}
              className={`flex justify-between items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedServices.some((s) => s._id === service._id)
                  ? "bg-green-50 border-green-500 shadow-md"
                  : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm"
              }`}
              onClick={() => toggleService(service)}
            >
              <div className="flex-1">
                <strong className="text-lg text-gray-800">{service.serviceName}</strong>
                <p className="text-sm text-gray-500 mt-1">KSh {service.price.toLocaleString()}</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(service);
                  }}
                  className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600 transition-colors"
                >
                  Add to Cart
                </button>
                <input
                  type="checkbox"
                  checked={selectedServices.some((s) => s._id === service._id)}
                  readOnly
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Date & Time Selection */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
        <label className="block text-gray-700 mb-3 font-medium text-lg">
          📅 Choose Date & Time
        </label>
        <input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          className="border-2 border-gray-300 p-3 rounded-lg w-full md:w-1/2 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          min={new Date().toISOString().slice(0, 16)}
        />
      </div>

      {/* Booking Summary */}
      {selectedServices.length > 0 && (
        <div className="bg-yellow-50 p-6 rounded-lg mb-6 border border-yellow-200">
          <h3 className="text-xl font-semibold mb-3 text-yellow-800">Booking Summary</h3>
          <div>
            <p className="font-medium text-yellow-700">Selected Services:</p>
            <ul className="list-disc list-inside mb-3 text-yellow-600">
              {selectedServices.map(service => (
                <li key={service._id} className="mb-1">
                  {service.serviceName} - KSh {service.price.toLocaleString()}
                </li>
              ))}
            </ul>
            <p className="font-bold text-lg text-yellow-800">
              Total: KSh {totalCost.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Cart Items */}
      {cartItems.length > 0 && (
        <div className="bg-purple-50 p-6 rounded-lg mb-6 border border-purple-200">
          <h3 className="text-xl font-semibold mb-3 text-purple-800">Cart Items ({cartItems.length})</h3>
          <ul className="space-y-2">
            {cartItems.map((item, index) => (
              <li key={index} className="text-purple-700">
                • {item.serviceName} - KSh {item.price.toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Book Now Button */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Total: <span className="text-green-600 text-2xl">KSh {totalCost.toLocaleString()}</span>
            </h3>
            <p className="text-sm text-gray-600">
              {selectedServices.length} service(s) selected for booking
            </p>
          </div>
          <button
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 text-lg font-semibold transition-colors shadow-md hover:shadow-lg w-full md:w-auto"
            onClick={handleBooking}
            disabled={submitting || !selectedServices.length || !dateTime || !isAuthenticated}
          >
            {submitting ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </span>
            ) : (
              "✅ Book Now"
            )}
          </button>
        </div>
      </div>

      {/* My Bookings Section */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">My Bookings</h2>
        {bookings.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg mb-2">No bookings yet.</p>
            <p className="text-gray-400">Book a service above to see your appointments here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="p-4 border-2 rounded-lg bg-white shadow-sm border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row justify-between items-start space-y-4 md:space-y-0">
                  <div className="flex-1">
                    <p className="font-bold text-lg text-gray-800 mb-2">{booking.shop?.name}</p>
                    <div className="space-y-1 mb-3">
                      {booking.services?.map((service, index) => (
                        <div key={index} className="text-gray-700 flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          {service.serviceName} - KSh {service.price.toLocaleString()}
                        </div>
                      ))}
                    </div>
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">📅 Date:</span> {new Date(booking.dateTime).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">🕒 Time:</span> {new Date(booking.dateTime).toLocaleTimeString()}
                    </p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800 border border-green-200' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-800 border border-red-200' :
                      booking.status === 'completed' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                      'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    }`}>
                      {booking.status?.toUpperCase()}
                    </span>
                    <p className="text-lg font-bold mt-2 text-green-700">
                      Total: KSh {booking.totalPrice?.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-2 w-full md:w-auto">
                    {booking.status === "pending" && (
                      <>
                        <button
                          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm font-medium transition-colors"
                          onClick={() => handleCancelBooking(booking._id)}
                        >
                          Cancel Booking
                        </button>
                        <button
                          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm font-medium transition-colors"
                          onClick={() => handleDeleteBooking(booking._id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                    {booking.status === "confirmed" && (
                      <button
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm font-medium transition-colors"
                        onClick={() => handleCancelBooking(booking._id)}
                      >
                        Cancel Booking
                      </button>
                    )}
                    {(booking.status === "completed" || booking.status === "cancelled") && (
                      <button
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm font-medium transition-colors"
                        onClick={() => handleDeleteBooking(booking._id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerBookings;