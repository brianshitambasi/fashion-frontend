import React from "react";
import AdminLayout from "./AdminLayout";

const AdminSalons = () => {
  return (
    <AdminLayout>
      <div className="container-fluid">
        <h3 className="mb-4">🏪 Manage Salons</h3>
        <div className="card shadow-sm">
          <div className="card-body">
            <p>View, verify, and manage salon owner accounts and their shops.</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSalons;
