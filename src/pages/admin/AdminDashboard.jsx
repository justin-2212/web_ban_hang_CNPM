// src/pages/admin/AdminDashboard.jsx
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { dbUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">
          Trang quản lý nhân viên
        </h1>
        <p className="text-gray-600 mb-6">
          Xin chào, <span className="font-bold">{dbUser?.TenDayDu}</span>! 
          Đây là khu vực dành riêng cho quản trị viên/nhân viên (Quyền = 0).
        </p>
        
        <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="font-bold text-blue-700">Quản lý đơn hàng</h3>
                <p>Xem và cập nhật trạng thái đơn</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                <h3 className="font-bold text-purple-700">Quản lý sản phẩm</h3>
                <p>Thêm, sửa, xóa sản phẩm</p>
            </div>
        </div>

        <button 
            onClick={() => navigate('/')}
            className="mt-8 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-700"
        >
            Về trang chủ bán hàng
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;