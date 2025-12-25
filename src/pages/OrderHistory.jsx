// src/pages/OrderHistory.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { donHangAPI } from "../services/api";
import { ShoppingBag, Loader2, ArrowLeft, Eye, TrendingUp } from "lucide-react";

const OrderHistory = () => {
  const navigate = useNavigate();
  const { dbUser, loadingUser } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // Format tiền
  // =========================
  const formatPrice = (price = 0) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);

  // =========================
  // Format ngày
  // =========================
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // =========================
  // Lấy danh sách đơn hàng
  // =========================
  useEffect(() => {
    const fetchOrders = async () => {
      if (!dbUser?.MaTaiKhoan) return;

      try {
        setLoading(true);
        const res = await donHangAPI.getByUser(dbUser.MaTaiKhoan);
        setOrders(res.data || []);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Không thể tải danh sách đơn hàng");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    if (!loadingUser) {
      fetchOrders();
    }
  }, [loadingUser, dbUser?.MaTaiKhoan]);

  // =========================
  // Map trạng thái đơn hàng
  // =========================
  const getOrderStatusDisplay = (status) => {
    const statusMap = {
      0: {
        text: "🕐 Đang xử lý",
        color: "bg-blue-50 text-blue-700 border-blue-200",
      },
      1: {
        text: "🚚 Đang giao",
        color: "bg-yellow-50 text-yellow-700 border-yellow-200",
      },
      2: {
        text: "✅ Giao hàng thành công",
        color: "bg-green-50 text-green-700 border-green-200",
      },
      3: { text: "❌ Đã hủy", color: "bg-red-50 text-red-700 border-red-200" },
    };
    return (
      statusMap[status] || {
        text: "❓ Không xác định",
        color: "bg-gray-50 text-gray-700 border-gray-200",
      }
    );
  };

  // =========================
  // Map trạng thái thanh toán
  // =========================
  const getPaymentStatusDisplay = (status) => {
    const paymentMap = {
      0: { text: "Chưa thanh toán", color: "text-orange-600" },
      1: { text: "❌ Thanh toán lỗi", color: "text-red-600" },
      2: { text: "✅ Đã thanh toán", color: "text-green-600" },
    };
    return (
      paymentMap[status] || {
        text: "❓ Không xác định",
        color: "text-gray-600",
      }
    );
  };

  // =========================
  // Chưa đăng nhập
  // =========================
  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!dbUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="bg-white p-8 rounded-xl shadow text-center max-w-md">
          <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="mb-4 text-gray-600">
            Bạn cần đăng nhập để xem lịch sử đơn hàng
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // Không có đơn hàng
  // =========================
  if (!loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft size={18} />
            Quay lại
          </button>

          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Chưa có đơn hàng
            </h2>
            <p className="text-gray-600 mb-6">
              Bạn chưa đặt hàng nào. Hãy bắt đầu mua sắm ngay!
            </p>
            <button
              onClick={() => navigate("/products")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải danh sách đơn hàng...</p>
        </div>
      </div>
    );
  }

  // =========================
  // Hiển thị danh sách đơn hàng
  // =========================
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            📋 Lịch sử đơn hàng
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft size={18} />
            Quay lại
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Danh sách đơn hàng */}
        <div className="space-y-4">
          {orders.map((order) => {
            const orderStatusDisplay = getOrderStatusDisplay(
              order.TinhTrangDonHang
            );
            const paymentStatusDisplay = getPaymentStatusDisplay(
              order.TinhTrangThanhToan
            );

            return (
              <div
                key={order.MaDonHang}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  {/* Mã đơn hàng */}
                  <div>
                    <p className="text-sm text-gray-500">Mã đơn hàng</p>
                    <p className="text-lg font-bold text-gray-900">
                      #{order.MaDonHang}
                    </p>
                  </div>

                  {/* Ngày đặt */}
                  <div>
                    <p className="text-sm text-gray-500">Ngày đặt</p>
                    <p className="text-sm text-gray-900">
                      {formatDate(order.NgayDat)}
                    </p>
                  </div>

                  {/* Tổng tiền */}
                  <div>
                    <p className="text-sm text-gray-500">Tổng tiền</p>
                    <p className="text-lg font-bold text-blue-600">
                      {formatPrice(order.TongTien)}
                    </p>
                  </div>

                  {/* Trạng thái đơn hàng */}
                  <div>
                    <p className="text-sm text-gray-500">Trạng thái</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm border ${orderStatusDisplay.color}`}
                    >
                      {orderStatusDisplay.text}
                    </span>
                  </div>

                  {/* Thanh toán */}
                  <div>
                    <p className="text-sm text-gray-500">Thanh toán</p>
                    <p
                      className={`text-sm font-semibold ${paymentStatusDisplay.color}`}
                    >
                      {paymentStatusDisplay.text}
                    </p>
                  </div>
                </div>

                {/* Nút xem chi tiết */}
                <div className="mt-4 pt-4 border-t">
                  <button
                    onClick={() => navigate(`/order-detail/${order.MaDonHang}`)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    <Eye size={18} />
                    Xem chi tiết
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tổng quan */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Tổng đơn hàng</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.length}
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">Đang xử lý</p>
              <p className="text-2xl font-bold text-blue-600">
                {orders.filter((o) => o.TinhTrangDonHang === 0).length}
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">Đang giao</p>
              <p className="text-2xl font-bold text-yellow-600">
                {orders.filter((o) => o.TinhTrangDonHang === 1).length}
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">Đã giao</p>
              <p className="text-2xl font-bold text-green-600">
                {orders.filter((o) => o.TinhTrangDonHang === 2).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
