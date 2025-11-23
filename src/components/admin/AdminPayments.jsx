// components/admin/AdminPayments.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = "https://hair-salon-app-1.onrender.com";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
    fetchRevenue();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BACKEND_URL}/admin/payments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayments(response.data.payments || []);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const fetchRevenue = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BACKEND_URL}/admin/revenue`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRevenue(response.data[0]?.totalRevenue || 0);
    } catch (error) {
      console.error("Error fetching revenue:", error);
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
      <h1 className="h2 fw-bold text-primary mb-4">Financial Management</h1>
      
      {/* Revenue Card */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">Total Revenue</h5>
              <h2 className="card-text">KSh {revenue.toLocaleString()}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="card shadow">
        <div className="card-header">
          <h5 className="mb-0">Payment History</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Commission</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment._id}>
                    <td>{payment.transactionId}</td>
                    <td>{payment.booking?.customer?.name}</td>
                    <td>KSh {payment.amount?.toLocaleString()}</td>
                    <td>KSh {payment.commission?.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${
                        payment.status === 'success' ? 'bg-success' : 'bg-warning'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
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

export default AdminPayments;