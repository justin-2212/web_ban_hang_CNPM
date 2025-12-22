// src/components/CustomerRoute.jsx

// Bảo vệ các route dành cho khách hàng (không cho admin truy cập)

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

const CustomerRoute = () => {
  const { dbUser, loadingUser } = useAuth();

  console.log('🛒 CustomerRoute check:', { dbUser, loadingUser, quyen: dbUser?.Quyen });

  // 1. Đang tải thông tin user -> Hiện loading
  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  // 2. Nếu là Admin (Quyen = 0 hoặc '0') -> Đá về trang admin
  if (dbUser && (dbUser.Quyen === 0 || dbUser.Quyen === '0')) {
    console.log('⛔ Admin detected! Redirecting to /admin/dashboard');
    return <Navigate to="/admin/dashboard" replace />;
  }

  // 3. Cho phép truy cập (bao gồm cả chưa đăng nhập)
  console.log('✅ Access granted to customer routes');
  return <Outlet />;
};

export default CustomerRoute;
