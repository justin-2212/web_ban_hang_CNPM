// src/components/admin/AdminHeader.jsx

import React from "react";
import { useAuth } from "../../context/AuthContext";
import { UserButton } from "@clerk/clerk-react";
import { Bell, Search } from "lucide-react";

const AdminHeader = () => {
  const { dbUser } = useAuth();

  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-20">
      {/* Thanh tìm kiếm nhanh (Giao diện thôi) */}
      <div className="relative w-96 hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Tìm kiếm nhanh đơn hàng, sản phẩm..."
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
        />
      </div>

      {/* Thông tin Admin */}
      <div className="flex items-center gap-6">
        {/* Nút thông báo */}
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        <div className="h-8 w-px bg-gray-200"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-bold text-gray-800">
              {dbUser?.TenDayDu || "Admin"}
            </div>
            <div className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full inline-block">
              Quản trị viên
            </div>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
