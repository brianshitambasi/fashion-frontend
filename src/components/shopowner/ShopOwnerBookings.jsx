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
    const colors = {
      pending: "bg-yellow-100 text-yellow-700",
      confirmed: "bg-blue-100 text-blue-700",
      completed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          colors[status] || "bg-gray-100 text-gray-700"
        }`}
      >
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
    return <div className="p-4 text-center">Loading bookings...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Bookings</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => fetchData(true)}
          disabled={refreshing}
        >
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search customer or service..."
          className="border px-3 py-2 rounded w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          className="border px-3 py-2 rounded"
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

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6 text-center">
        <div className="bg-gray-100 p-3 rounded">
          <p className="text-gray-600 text-sm">Total</p>
          <p className="text-xl font-semibold">{stats.total}</p>
        </div>
        <div className="bg-yellow-100 p-3 rounded">
          <p className="text-gray-600 text-sm">Pending</p>
          <p className="text-xl font-semibold">{stats.pending}</p>
        </div>
        <div className="bg-blue-100 p-3 rounded">
          <p className="text-gray-600 text-sm">Confirmed</p>
          <p className="text-xl font-semibold">{stats.confirmed}</p>
        </div>
        <div className="bg-green-100 p-3 rounded">
          <p className="text-gray-600 text-sm">Completed</p>
          <p className="text-xl font-semibold">{stats.completed}</p>
        </div>
        <div className="bg-red-100 p-3 rounded">
          <p className="text-gray-600 text-sm">Cancelled</p>
          <p className="text-xl font-semibold">{stats.cancelled}</p>
        </div>
        <div className="bg-gray-200 p-3 rounded">
          <p className="text-gray-600 text-sm">Revenue</p>
          <p className="text-xl font-semibold">${stats.revenue}</p>
        </div>
      </div>

      {/* Bookings Table */}
      {filteredBookings.length === 0 ? (
        <div className="text-center text-gray-500">No bookings found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Customer</th>
                <th className="border px-4 py-2">Service</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Shop</th>
                <th className="border px-4 py-2">Amount</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => (
                <tr key={b._id} className="text-center">
                  <td className="border px-4 py-2">{b.customer?.name || "-"}</td>
                  <td className="border px-4 py-2">{b.service || "-"}</td>
                  <td className="border px-4 py-2">{formatDate(b.date)}</td>
                  <td className="border px-4 py-2">{b.shop?.name || "-"}</td>
                  <td className="border px-4 py-2">
                    ${b.totalAmount?.toFixed(2) || "0.00"}
                  </td>
                  <td className="border px-4 py-2">{getStatusBadge(b.status)}</td>
                  <td className="border px-4 py-2">
                    {getStatusOptions(b.status).length > 0 ? (
                      <select
                        className="border px-2 py-1 rounded"
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
