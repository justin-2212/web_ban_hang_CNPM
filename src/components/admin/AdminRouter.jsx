// src/components/admin/AdminRoute.jsx

// bảo vệ các route dành riêng cho Admin/Nhân viên (không cho tài khoản có quyền khác truy cập bằng link admin)

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Loader2 } from "lucide-react";

const AdminRoute = () => {
  const { dbUser, loadingUser } = useAuth();

  // 1. Đang tải thông tin user -> Hiện loading
  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  // 2. Nếu chưa đăng nhập HOẶC Quyền không phải là 0 (Nhân viên)
  // -> Đá về trang chủ
  if (!dbUser || dbUser.Quyen !== 0) {
    return <Navigate to="/" replace />;
  }

  // 3. Nếu đúng là Admin -> Cho phép đi tiếp vào các route con
  return <Outlet />;
};

export default AdminRoute;
