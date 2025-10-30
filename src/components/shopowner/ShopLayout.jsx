// components/shopowner/ShopLayout.js
import React from "react";
import { Outlet } from "react-router-dom";
import ShopSidebar from "./ShopSidebar";

const ShopLayout = () => {
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <ShopSidebar />
      <div className="flex-grow-1 p-4" style={{ backgroundColor: "#f8f9fa" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default ShopLayout;