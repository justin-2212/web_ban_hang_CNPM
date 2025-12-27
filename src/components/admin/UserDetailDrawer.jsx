// src/components/admin/UserDetailDrawer.jsx

import React from "react";
import { ShieldCheck, ShieldOff, Ban, CheckCircle, X } from "lucide-react";

const UserDetailDrawer = ({
  isOpen,
  onClose,
  user,
  onUpdateRole,
  onToggleStatus,
}) => {
  // Nếu drawer không mở hoặc không có user thì không render gì cả
  if (!isOpen || !user) return null;

  // Helper format ngày
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Helper format tiền tệ
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value || 0);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* 1. Backdrop (Lớp nền mờ) - Click để đóng */}
      <div
        className="absolute inset-0 bg-transparent transition-opacity"
        onClick={onClose}
      ></div>

      {/* 2. Drawer Container - Cố định bên phải */}
      <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        {/* 3. Panel Chính */}
        <div className="w-screen max-w-md transform transition ease-in-out duration-500 sm:duration-700 translate-x-0 bg-white shadow-2xl flex flex-col h-full border-l border-gray-200">
          {/* HEADER */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
            <h2 className="text-lg font-bold text-gray-900">
              Chi tiết người dùng #{user.MaTaiKhoan}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full focus:outline-none"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* BODY - Phần nội dung cuộn dọc */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Thông tin cá nhân */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 border-b pb-2">
                Thông tin cá nhân
              </h3>
              <div className="bg-blue-50 rounded-lg p-4 space-y-2 border border-blue-100">
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Tên:</span>{" "}
                  {user.TenDayDu || "N/A"}
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Email:</span>{" "}
                  {user.Gmail}
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-700">SĐT:</span>{" "}
                  {user.SoDienThoai || "Chưa có"}
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Địa chỉ:</span>{" "}
                  {user.DiaChi || "Chưa có"}
                </p>
              </div>
            </div>

            {/* Lịch sử đơn hàng */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 border-b pb-2">
                Lịch sử đơn hàng ({user.orders?.length || 0})
              </h3>

              {user.orders && user.orders.length > 0 ? (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {user.orders.map((order) => (
                    <div
                      key={order.MaDonHang}
                      className="flex justify-between items-start p-3 bg-white border rounded-lg shadow-sm hover:bg-gray-50 mr-1" // Thêm mr-1 để tránh sát thanh cuộn
                    >
                      <div>
                        <p className="text-sm font-medium text-blue-600">
                          Đơn #{order.MaDonHang}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(order.NgayDat)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {formatCurrency(order.TongTien)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {order.PhuongThucThanhToan}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  Chưa có đơn hàng nào
                </p>
              )}
            </div>
          </div>

          {/* FOOTER - Các nút hành động */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex flex-col gap-3 flex-shrink-0">
            {/* Nút Đổi Quyền (Admin <-> User) */}
            {user.Quyen === 1 ? (
              // Đang là USER -> Nút Thăng cấp
              <button
                onClick={() => onUpdateRole(user.MaTaiKhoan, 0)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                Thăng cấp Admin
              </button>
            ) : (
              // Đang là ADMIN -> Nút Hạ quyền
              <button
                onClick={() => onUpdateRole(user.MaTaiKhoan, 1)}
                className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <ShieldOff className="w-4 h-4" />
                Hạ xuống User
              </button>
            )}

            {/* Nút Khóa / Mở Khóa */}
            <button
              onClick={() => onToggleStatus(user.MaTaiKhoan)}
              className={`w-full px-4 py-2 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors border ${
                user.TinhTrangTaiKhoan === 1
                  ? "bg-white text-red-600 border-red-200 hover:bg-red-50"
                  : "bg-white text-green-600 border-green-200 hover:bg-green-50"
              }`}
            >
              {user.TinhTrangTaiKhoan === 1 ? (
                <>
                  <Ban className="w-4 h-4" />
                  Khóa tài khoản
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Mở khóa tài khoản
                </>
              )}
            </button>

            {/* Nút Đóng */}
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailDrawer;
