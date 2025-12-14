// src/components/admin/AdminLayout.jsx

import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import AdminHeader from "./AdminHeader";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* 1. Sidebar cố định bên trái */}
      <Sidebar />

      {/* 2. Nội dung chính bên phải */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Header */}
        <AdminHeader />

        {/* Nội dung thay đổi (Dashboard, Product, Users...) */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
