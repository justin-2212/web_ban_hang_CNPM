import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { donHangAPI } from "../services/api";
import { ArrowLeft, Loader2, AlertCircle, Package, DollarSign, Calendar, Truck, CreditCard } from "lucide-react";

const OrderDetail = () => {
  const { id: maDonHang } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
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
  // Load chi tiết đơn hàng
  // =========================
  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!maDonHang) {
        setError("Không tìm thấy mã đơn hàng");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await donHangAPI.getById(maDonHang);

        if (res.data) {
          setOrder(res.data);
          setError("");
        } else {
          setError("Không tìm thấy thông tin đơn hàng");
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Lỗi khi tải chi tiết đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [maDonHang]);

  // =========================
  // Map trạng thái đơn hàng
  // =========================
  const getOrderStatusDisplay = (status) => {
    const statusMap = {
      0: { text: "🕐 Đang xử lý", color: "bg-blue-50 text-blue-700 border-blue-200" },
      1: { text: "🚚 Đang giao", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
      2: { text: "✅ Đã giao", color: "bg-green-50 text-green-700 border-green-200" },
      3: { text: "❌ Đã hủy", color: "bg-red-50 text-red-700 border-red-200" },
    };
    return statusMap[status] || { text: "❓ Không xác định", color: "bg-gray-50 text-gray-700 border-gray-200" };
  };

  // =========================
  // Map trạng thái thanh toán
  // =========================
  const getPaymentStatusDisplay = (status) => {
    const paymentMap = {
      0: { text: "Chưa thanh toán", color: "text-orange-600", bg: "bg-orange-50" },
      1: { text: "Thanh toán khi nhận (COD)", color: "text-orange-600", bg: "bg-orange-50" },
      2: { text: "✅ Đã thanh toán", color: "text-green-600", bg: "bg-green-50" },
    };
    return paymentMap[status] || { text: "❓ Không xác định", color: "text-gray-600", bg: "bg-gray-50" };
  };

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải chi tiết đơn hàng...</p>
        </div>
      </div>
    );
  }

  // =========================
  // Error
  // =========================
  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-3xl">
          <button
            onClick={() => navigate("/orders")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft size={18} />
            Quay lại
          </button>

          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Lỗi
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              to="/orders"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Quay lại lịch sử đơn hàng
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // Chi tiết đơn hàng
  // =========================
  if (!order) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-600">Không tìm thấy đơn hàng</p>
          </div>
        </div>
      </div>
    );
  }

  const orderStatusDisplay = getOrderStatusDisplay(order.TinhTrangDonHang);
  const paymentStatusDisplay = getPaymentStatusDisplay(order.TinhTrangThanhToan);

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gray-50">
      <div className="container mx-auto px-6 max-w-3xl">
        {/* Back Button */}
        <button
          onClick={() => navigate("/orders")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
        >
          <ArrowLeft size={18} />
          Quay lại lịch sử đơn hàng
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Đơn hàng #{order.MaDonHang}
            </h1>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold border ${orderStatusDisplay.color}`}
            >
              {orderStatusDisplay.text}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Ngày đặt</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatDate(order.NgayDat)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Tổng tiền</p>
                <p className="text-sm font-semibold text-blue-600">
                  {formatPrice(order.TongTien)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Vận chuyển</p>
                <p className="text-sm font-semibold text-gray-900">Miễn phí</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Thanh toán</p>
                <p
                  className={`text-sm font-semibold ${paymentStatusDisplay.color}`}
                >
                  {paymentStatusDisplay.text}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sản phẩm */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Sản phẩm
          </h2>

          <div className="space-y-4">
            {order.chiTiet && order.chiTiet.length > 0 ? (
              order.chiTiet.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {item.TenBienThe}
                    </p>
                    {/* {item.DuongDanAnhBienThe && (
                      <p className="text-xs text-gray-500 mt-1">
                        {item.DuongDanAnhBienThe}
                      </p>
                    )} */}
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">
                      Số lượng: <span className="font-semibold">{item.SoLuongSanPham}</span>
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      Đơn giá: <span className="font-semibold">{formatPrice(item.GiaTienCuaSanPham)}</span>
                    </p>
                    <p className="text-base font-bold text-blue-600">
                      {formatPrice(item.GiaTienCuaSanPham * item.SoLuongSanPham)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">Không có sản phẩm</p>
            )}
          </div>
        </div>

        {/* Thông tin thanh toán online (nếu có) */}
        {order.thanhToanOnline && (
          <div className={`rounded-xl shadow-sm p-6 mb-6 ${paymentStatusDisplay.bg}`}>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Thông tin thanh toán online
            </h2>

            <div className="space-y-3">
              {order.thanhToanOnline.MaGiaoDich && (
                <div className="flex justify-between">
                  <span className="text-gray-700">Mã giao dịch:</span>
                  <span className="font-mono font-semibold">
                    {order.thanhToanOnline.MaGiaoDich}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-700">Số tiền thanh toán:</span>
                <span className="font-semibold">
                  {formatPrice(order.thanhToanOnline.SoTienThanhToan)}
                </span>
              </div>

              {order.thanhToanOnline.ThoiDiemThanhToan && (
                <div className="flex justify-between">
                  <span className="text-gray-700">Thời gian:</span>
                  <span className="font-semibold">
                    {formatDate(order.thanhToanOnline.ThoiDiemThanhToan)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Phương thức thanh toán */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Phương thức thanh toán</h2>
          <p className="text-gray-700">
            {order.PhuongThucThanhToan === "COD"
              ? "💵 Thanh toán khi nhận hàng (COD)"
              : "💳 Thanh toán online (MOMO)"}
          </p>
        </div>

        {/* Tóm tắt */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold mb-4">Tóm tắt đơn hàng</h2>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-700">Tạm tính</span>
              <span className="font-semibold">{formatPrice(order.TongTien)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-700">Phí vận chuyển</span>
              <span className="text-green-600 font-semibold">Miễn phí</span>
            </div>

            <div className="border-t-2 pt-3 flex justify-between text-lg">
              <span className="font-bold">Tổng cộng</span>
              <span className="text-blue-600 font-bold">
                {formatPrice(order.TongTien)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
