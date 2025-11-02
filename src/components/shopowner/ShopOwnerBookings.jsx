import React, { useEffect, useState } from "react";
import axios from "axios";

const ShopOwnerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://hair-salon-app-1.onrender.com/booking/shopOwner",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading bookings...</p>;

  return (
    <div className="container py-4">
      <h1 className="fw-bold mb-4">My Shop Bookings</h1>

      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, i) => (
                <tr key={b._id}>
                  <td>{i + 1}</td>
                  <td>{b.customer?.name || "N/A"}</td>
                  <td>{b.service?.serviceName}</td>
                  <td>{new Date(b.dateTime).toLocaleDateString()}</td>
                  <td>{new Date(b.dateTime).toLocaleTimeString()}</td>
                  <td>
                    <span
                      className={`badge ${
                        b.status === "confirmed"
                          ? "bg-success"
                          : b.status === "cancelled"
                          ? "bg-danger"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {b.status || "pending"}
                    </span>
                  </td>
                  <td>
                    {b.paymentStatus === "paid" ? (
                      <span className="badge bg-success">Paid</span>
                    ) : (
                      <span className="badge bg-secondary">Unpaid</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ShopOwnerBookings;
