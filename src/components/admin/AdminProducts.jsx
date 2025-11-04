import React from "react";
import AdminLayout from "./AdminLayout";

const AdminProducts = () => {
  return (
    <AdminLayout>
      <div className="container-fluid">
        <h3 className="mb-4">💇 Manage Hairstyles / Products</h3>
        <div className="card shadow-sm">
          <div className="card-body">
            <p>Here admins can review, approve, or delete salon hairstyle listings.</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
