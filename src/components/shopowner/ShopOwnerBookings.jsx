import React, { useState, useEffect } from "react";
import axios from "axios";

const ShopOwnerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    // Refresh every 30 seconds to check for new bookings
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  /** --------------------------
   * Fetch shop owner's bookings
   * -------------------------- */
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      // Get shop owner's shops
      const shopsRes = await axios.get("https://hair-salon-app-1.onrender.com/shop/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userShops = shopsRes.data;
      
      if (userShops.length === 0) {
        setBookings([]);
        setLoading(false);
        return;
      }

      // Get shop IDs owned by this user
      const shopIds = userShops.map(shop => shop._id);

      // Fetch all bookings
      const bookingsRes = await axios.get("https://hair-salon-app-1.onrender.com/booking", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filter bookings to only show PENDING bookings for the shop owner's shops
      const pendingBookings = bookingsRes.data.filter(booking => 
        (shopIds.includes(booking.shop?._id) || shopIds.includes(booking.shop)) && 
        booking.status === "pending"
      );

      setBookings(pendingBookings);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  /** --------------------------
   * Accept or Reject booking
   * -------------------------- */
  const handleBookingAction = async (bookingId, action) => {
    try {
      const token = localStorage.getItem("token");
      const newStatus = action === "accept" ? "confirmed" : "cancelled";
      
      // FIXED: Use PATCH instead of PUT
      await axios.patch(
        `https://hair-salon-app-1.onrender.com/booking/${bookingId}`,
        { 
          status: newStatus,
          approvedByShop: action === "accept"
        },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      // Remove the booking from the list after action
      setBookings(prev => prev.filter(booking => booking._id !== bookingId));
      
      alert(`Booking ${action === "accept" ? "accepted" : "rejected"} successfully!`);
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Failed to update booking");
    }
  };

  /** --------------------------
   * Helpers
   * -------------------------- */
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalPrice = (booking) => {
    return booking.totalPrice || (booking.services && booking.services.reduce((sum, service) => sum + (service.price || 0), 0)) || 0;
  };

  if (loading) {
    return (
      <div className="container py-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="fw-bold">📦 New Booking Requests</h2>
        <p className="text-muted">Accept or reject customer booking requests</p>
      </div>

      {/* Auto-refresh indicator */}
      <div className="text-center mb-3">
        <small className="text-muted">🔄 Auto-refreshes every 30 seconds</small>
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <div className="card text-center py-5">
          <div className="card-body">
            <i className="bi bi-check-circle display-1 text-success mb-3"></i>
            <h5 className="text-success">No Pending Bookings</h5>
            <p className="text-muted">All booking requests have been processed.</p>
            <button 
              className="btn btn-outline-primary"
              onClick={fetchData}
            >
              🔄 Check for New Bookings
            </button>
          </div>
        </div>
      ) : (
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {bookings.map((booking) => (
              <div key={booking._id} className="card mb-4 shadow-sm border-0">
                <div className="card-body">
                  {/* Customer & Shop Info */}
                  <div className="row mb-3">
                    <div className="col-6">
                      <h6 className="fw-bold text-primary">👤 Customer</h6>
                      <p className="mb-1">{booking.customer?.name || "Customer"}</p>
                      <small className="text-muted">{booking.customer?.email || ""}</small>
                    </div>
                    <div className="col-6">
                      <h6 className="fw-bold text-primary">🏪 Shop</h6>
                      <p className="mb-0">{booking.shop?.name || "Your Shop"}</p>
                      <small className="text-muted">{booking.shop?.location || ""}</small>
                    </div>
                  </div>

                  {/* Booking Date */}
                  <div className="mb-3">
                    <h6 className="fw-bold text-primary">📅 Booking Time</h6>
                    <p className="mb-0">{formatDate(booking.dateTime)}</p>
                  </div>

                  {/* Services */}
                  <div className="mb-3">
                    <h6 className="fw-bold text-primary">📋 Requested Services</h6>
                    <div className="bg-light p-3 rounded">
                      {booking.services && booking.services.map((service, index) => (
                        <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                          <span>{service.serviceName}</span>
                          <strong className="text-success">KSh {service.price}</strong>
                        </div>
                      ))}
                      <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                        <strong>Total Amount:</strong>
                        <strong className="text-success fs-5">KSh {getTotalPrice(booking)}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="row g-2">
                    <div className="col-6">
                      <button
                        className="btn btn-success w-100 py-3 fw-bold"
                        onClick={() => handleBookingAction(booking._id, "accept")}
                      >
                        ✅ ACCEPT BOOKING
                      </button>
                    </div>
                    <div className="col-6">
                      <button
                        className="btn btn-danger w-100 py-3 fw-bold"
                        onClick={() => handleBookingAction(booking._id, "reject")}
                      >
                        ❌ REJECT BOOKING
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopOwnerBookings;