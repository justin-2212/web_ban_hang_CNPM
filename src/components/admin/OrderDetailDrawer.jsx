// src/components/admin/OrderDetailDrawer.jsx

import React from "react";
import { X } from "lucide-react";

// Hằng số trạng thái để hiển thị label/màu sắc (Copy từ trang quản lý để dùng chung hoặc có thể tách ra file constants)
const ORDER_STATUS = {
  0: { label: "Đang xử lý", color: "bg-yellow-100 text-yellow-800" },
  1: { label: "Đang giao", color: "bg-blue-100 text-blue-800" },
  2: { label: "Giao hàng thành công", color: "bg-green-100 text-green-800" },
  3: { label: "Đã hủy", color: "bg-red-100 text-red-800" },
};

const OrderDetailDrawer = ({
  isOpen,
  onClose,
  order,
  onUpdateStatus,
  onUpdatePayment,
  onCancel,
}) => {
  if (!isOpen || !order) return null;

  // Helper format tiền tệ
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value || 0);
  };

  // Helper format ngày
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  // Kiểm tra đơn hàng đã hoàn tất chưa
  const isOrderFinalized = [2, 3].includes(order.TinhTrangDonHang);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop (Lớp nền mờ) - Click để đóng */}
      <div
        className="absolute inset-0 bg-transparent transition-opacity"
        onClick={onClose}
      ></div>

      {/* Container Drawer - Cố định bên phải */}
      <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        {/* Panel Chính (Trượt từ phải sang) */}
        <div className="w-screen max-w-2xl transform transition ease-in-out duration-500 sm:duration-700 translate-x-0 bg-white shadow-2xl flex flex-col h-full border-l border-gray-200">
          {/* HEADER Drawer */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Chi tiết đơn hàng #{order.MaDonHang}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Ngày đặt: {formatDate(order.NgayDat)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full focus:outline-none"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* BODY Drawer - Nội dung cuộn dọc */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* 1. Thông tin khách hàng */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 border-b pb-2">
                Thông tin khách hàng
              </h3>
              <div className="bg-blue-50 rounded-lg p-4 space-y-2 border border-blue-100">
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Tên:</span>{" "}
                  {order.TenDayDu}
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Email:</span>{" "}
                  {order.Gmail}
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-700">SĐT:</span>{" "}
                  {order.SoDienThoai || "Chưa có"}
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Địa chỉ:</span>{" "}
                  {order.DiaChi || "Chưa có"}
                </p>
              </div>
            </div>

            {/* 2. Danh sách sản phẩm */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 border-b pb-2">
                Danh sách sản phẩm
              </h3>
              <div className="space-y-3">
                {order.chiTiet?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-start p-3 bg-white border rounded-lg shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      {item.DuongDanAnhBienThe ? (
                        <img
                          src={item.DuongDanAnhBienThe}
                          alt={item.TenBienThe}
                          className="w-16 h-16 object-cover rounded-md border"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">
                          No Image
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-sm text-gray-900">
                          {item.TenBienThe}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Số lượng:{" "}
                          <span className="font-bold">
                            {item.SoLuongSanPham}
                          </span>
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-blue-600">
                      {formatCurrency(item.GiaTienCuaSanPham)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Tổng tiền & Phương thức */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Phương thức thanh toán:</span>
                <span className="font-medium px-2 py-1 bg-gray-100 rounded text-sm">
                  {order.PhuongThucThanhToan}
                </span>
              </div>
              <div className="flex justify-between items-center mt-3 text-lg font-bold">
                <span>Tổng cộng:</span>
                <span className="text-green-600">
                  {formatCurrency(order.TongTien)}
                </span>
              </div>
            </div>

            {/* 4. Khu vực xử lý đơn hàng (Actions) */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Xử lý đơn hàng
              </h3>

              {isOrderFinalized ? (
                <div className="p-4 bg-gray-100 rounded-lg text-center border border-gray-200">
                  <p className="text-gray-600 font-medium">
                    Đơn hàng đã hoàn tất (
                    {ORDER_STATUS[order.TinhTrangDonHang]?.label}). <br />
                    <span className="text-xs text-gray-500">
                      Không thể thay đổi trạng thái
                    </span>
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Thay đổi trạng thái đơn hàng */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trạng thái đơn hàng
                    </label>
                    <select
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                      value={order.TinhTrangDonHang}
                      onChange={(e) =>
                        onUpdateStatus(
                          order.MaDonHang,
                          parseInt(e.target.value)
                        )
                      }
                    >
                      <option value={0}>Đang xử lý</option>
                      <option value={1}>Đang giao</option>
                      <option value={2}>Giao hàng thành công</option>
                    </select>
                  </div>

                  {/* Thay đổi trạng thái thanh toán (Chỉ hiện khi là COD) */}
                  {/* {order.PhuongThucThanhToan === "COD" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trạng thái thanh toán
                      </label>
                      <select
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                        value={order.TinhTrangThanhToan}
                        onChange={(e) =>
                          onUpdatePayment(
                            order.MaDonHang,
                            parseInt(e.target.value)
                          )
                        }
                      >
                        <option value={0}>Chưa thanh toán</option>
                        <option value={1}>Thanh toán bị lỗi</option>
                        <option value={2}>Đã thanh toán</option>
                      </select>
                    </div>
                  )} */}

                  {/* Nút Hủy Đơn Hàng */}
                  <button
                    onClick={() => onCancel(order.MaDonHang)}
                    className="w-full px-4 py-3 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 font-medium transition-colors mt-2 shadow-sm"
                  >
                    Hủy đơn hàng này
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* FOOTER Drawer - Cố định ở đáy */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end flex-shrink-0">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium shadow-sm transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailDrawer;
