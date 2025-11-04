import React from "react";
import AdminLayout from "./AdminLayout";

const AdminSettings = () => {
  return (
    <AdminLayout>
      <div className="container-fluid">
        <h3 className="mb-4">⚙️ System Settings</h3>
        <div className="card shadow-sm">
          <div className="card-body">
            <p>Configure platform-wide settings, permissions, and notifications.</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
