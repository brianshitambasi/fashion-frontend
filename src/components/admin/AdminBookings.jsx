// components/admin/AdminBookings.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = "https://hair-salon-app-1.onrender.com";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BACKEND_URL}/admin/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data.bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <h1 className="h2 fw-bold text-primary mb-4">Booking Management</h1>
      <div className="card shadow">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Shop</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>{booking.customer?.name}</td>
                    <td>{booking.shop?.name}</td>
                    <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                    <td>{booking.bookingTime}</td>
                    <td>
                      <span className={`badge ${
                        booking.status === 'confirmed' ? 'bg-success' :
                        booking.status === 'pending' ? 'bg-warning' :
                        'bg-secondary'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td>KSh {booking.totalPrice?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;