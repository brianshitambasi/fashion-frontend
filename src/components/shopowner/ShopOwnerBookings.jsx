import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const ShopOwnerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedShop, setSelectedShop] = useState("all");
  const [shops, setShops] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    revenue: 0,
  });

  const location = useLocation();
  const preselectedShopId = location.state?.shopId;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (preselectedShopId && shops.length > 0) {
      setSelectedShop(preselectedShopId);
    }
  }, [preselectedShopId, shops]);

  useEffect(() => {
    filterBookings();
    calculateStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookings, searchTerm, selectedStatus, selectedShop]);

  /** --------------------------
   * Fetch all data
   * -------------------------- */
  const fetchData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      const token = localStorage.getItem("token");

      const [bookingsRes, shopsRes] = await Promise.all([
        axios.get("https://hair-salon-app-1.onrender.com/booking", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("https://hair-salon-app-1.onrender.com/shop/getMyShops", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setBookings(bookingsRes.data);
      setShops(shopsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to load bookings data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /** --------------------------
   * Filter bookings by search/status/shop
   * -------------------------- */
  const filterBookings = () => {
    let filtered = bookings;

    if (selectedShop !== "all") {
      filtered = filtered.filter(
        (b) => b.shop?._id === selectedShop || b.shop === selectedShop
      );
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((b) => b.status === selectedStatus);
    }

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.customer?.name?.toLowerCase().includes(term) ||
          b.service?.toLowerCase().includes(term)
      );
    }

    setFilteredBookings(filtered);
  };

  /** --------------------------
   * Calculate booking statistics
   * -------------------------- */
  const calculateStats = () => {
    const statsData = {
      total: bookings.length,
      pending: bookings.filter((b) => b.status === "pending").length,
      confirmed: bookings.filter((b) => b.status === "confirmed").length,
      completed: bookings.filter((b) => b.status === "completed").length,
      cancelled: bookings.filter((b) => b.status === "cancelled").length,
      revenue: bookings
        .filter((b) => b.status === "completed")
        .reduce((acc, b) => acc + (b.totalAmount || 0), 0),
    };
    setStats(statsData);
  };

  /** --------------------------
   * Update booking status
   * -------------------------- */
  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://hair-salon-app-1.onrender.com/booking/${bookingId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
      );
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Failed to update booking status");
    }
  };

  /** --------------------------
   * Helpers
   * -------------------------- */
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString();
  };

  const getStatusBadge = (status) => {
    const badgeMap = {
      pending: "bg-warning text-dark",
      confirmed: "bg-primary text-white",
      completed: "bg-success text-white",
      cancelled: "bg-danger text-white",
    };
    return (
      <span className={`badge ${badgeMap[status] || "bg-secondary"}`}>
        {status}
      </span>
    );
  };

  const getStatusOptions = (status) => {
    switch (status) {
      case "pending":
        return ["confirmed", "cancelled"];
      case "confirmed":
        return ["completed", "cancelled"];
      default:
        return [];
    }
  };

  /** --------------------------
   * Render
   * -------------------------- */
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">📅 Bookings</h2>
        <button
          className="btn btn-primary"
          onClick={() => fetchData(true)}
          disabled={refreshing}
        >
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Filters */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search customer or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={selectedShop}
            onChange={(e) => setSelectedShop(e.target.value)}
          >
            <option value="all">All Shops</option>
            {shops.map((shop) => (
              <option key={shop._id} value={shop._id}>
                {shop.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="row text-center mb-4">
        {[
          { label: "Total", value: stats.total, color: "bg-light" },
          { label: "Pending", value: stats.pending, color: "bg-warning bg-opacity-25" },
          { label: "Confirmed", value: stats.confirmed, color: "bg-primary bg-opacity-25" },
          { label: "Completed", value: stats.completed, color: "bg-success bg-opacity-25" },
          { label: "Cancelled", value: stats.cancelled, color: "bg-danger bg-opacity-25" },
          { label: "Revenue", value: `$${stats.revenue}`, color: "bg-secondary bg-opacity-25" },
        ].map((s, i) => (
          <div key={i} className="col-6 col-md-2 mb-3">
            <div className={`p-3 rounded shadow-sm ${s.color}`}>
              <p className="text-muted mb-1 small">{s.label}</p>
              <h5 className="fw-semibold mb-0">{s.value}</h5>
            </div>
          </div>
        ))}
      </div>

      {/* Bookings Table */}
      {filteredBookings.length === 0 ? (
        <div className="alert alert-secondary text-center">No bookings found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Customer</th>
                <th>Service</th>
                <th>Date</th>
                <th>Shop</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => (
                <tr key={b._id}>
                  <td>{b.customer?.name || "-"}</td>
                  <td>{b.service || "-"}</td>
                  <td>{formatDate(b.date)}</td>
                  <td>{b.shop?.name || "-"}</td>
                  <td>${b.totalAmount?.toFixed(2) || "0.00"}</td>
                  <td>{getStatusBadge(b.status)}</td>
                  <td>
                    {getStatusOptions(b.status).length > 0 ? (
                      <select
                        className="form-select form-select-sm"
                        onChange={(e) =>
                          updateBookingStatus(b._id, e.target.value)
                        }
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Update...
                        </option>
                        {getStatusOptions(b.status).map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      "-"
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
