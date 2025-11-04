import React from "react";
import AdminLayout from "./AdminLayout";

const AdminReports = () => {
  return (
    <AdminLayout>
      <div className="container-fluid">
        <h3 className="mb-4">📊 Reports & Analytics</h3>
        <div className="card shadow-sm">
          <div className="card-body">
            <p>Generate insights like total bookings, revenue, and salon performance.</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
