import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { donHangAPI } from "../services/api";
import { CheckCircle, AlertCircle, Loader2, XCircle, Home, ShoppingBag } from "lucide-react";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const orderId = searchParams.get("orderId");
  const status = searchParams.get("status"); // "success" | "failed" | "error" | "invalid_signature"
  const transId = searchParams.get("transId");
  const message = searchParams.get("message");
  const maTaiKhoan = searchParams.get("maTaiKhoan");

  // =========================
  // Load đơn hàng với retry logic
  // =========================
  useEffect(() => {
    const loadOrder = async () => {
      // Nếu không có orderId và status là failed/error => không cần load
      if (!orderId) {
        if (status === "failed" || status === "error" || status === "invalid_signature" || status === "invalid_order_info") {
          setLoading(false);
          return;
        }
        
        // Trường hợp khác: thiếu thông tin
        setError("Không tìm thấy thông tin đơn hàng");
        setLoading(false);
        return;
      }

      // Có orderId => load thông tin đơn hàng
      try {
        const res = await donHangAPI.getById(orderId);

        if (res.data) {
          setOrder(res.data);
          setRetryCount(0); // Reset retry count khi thành công
          
          // ✅ Dispatch event để update cart count
          if (status === "success") {
            window.dispatchEvent(new CustomEvent("cartServerUpdated"));
          }
        } else {
          throw new Error("Không có dữ liệu đơn hàng");
        }
      } catch (err) {
        console.error(`[Order Load] Error (attempt ${retryCount + 1}):`, err.message);

        //⚠️ Retry logic: MOMO callback có thể chậm
        // Thử lại tối đa 5 lần, mỗi lần cách 2 giây
        if (retryCount < 5 && status === "success") {
          console.log(`[Order Load] Retrying in 2 seconds...`);
          setTimeout(() => {
            setRetryCount(retryCount + 1);
          }, 2000);
          return;
        }

        // Nếu retry hết mà vẫn không được => set error
        setError("Không thể tải thông tin đơn hàng. Vui lòng kiểm tra lại sau.");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId, status, retryCount]);

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
  // Render theo trạng thái
  // =========================
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">
            {retryCount > 0
              ? `Đang tải đơn hàng... (Lần ${retryCount})`
              : "Đang xử lý..."}
          </p>
          {retryCount > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              (Nếu chậm, vui lòng đợi)
            </p>
          )}
        </div>
      </div>
    );
  }

  // ===== THANH TOÁN THẤT BẠI (không có orderId) =====
  if (status === "failed" && !orderId) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <XCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Thanh toán thất bại
            </h1>
            <p className="text-gray-600 mb-2">
              {message || "Giao dịch đã bị hủy hoặc thất bại"}
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Giỏ hàng của bạn vẫn được giữ nguyên. Bạn có thể thử lại.
            </p>

            <div className="flex gap-4 justify-center">
              <Link
                to="/cart"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <ShoppingBag size={18} />
                Quay lại giỏ hàng
              </Link>
              <Link
                to="/"
                className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                <Home size={18} />
                Về trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== LỖI XỬ LÝ (error state) =====
  if (status === "error" || error) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Có lỗi xảy ra
            </h2>
            <p className="text-gray-600 mb-2">
              {message || error || "Không thể xử lý đơn hàng của bạn"}
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Vui lòng liên hệ hỗ trợ nếu vấn đề vẫn tiếp diễn.
            </p>

            <div className="flex gap-4 justify-center">
              <Link
                to="/cart"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <ShoppingBag size={18} />
                Quay lại giỏ hàng
              </Link>
              <Link
                to="/"
                className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                <Home size={18} />
                Về trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== CHỮ KÝ KHÔNG HỢP LỆ =====
  if (status === "invalid_signature" || status === "invalid_order_info") {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Yêu cầu không hợp lệ
            </h2>
            <p className="text-gray-600 mb-8">
              Thông tin thanh toán không hợp lệ hoặc đã bị giả mạo.
            </p>

            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Home size={18} />
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ===== ĐƠN HÀNG KHÔNG TỒN TẠI (có orderId nhưng load lỗi) =====
  if (!order && orderId) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Không tìm thấy đơn hàng
            </h2>
            <p className="text-gray-600 mb-2">
              Đơn hàng #{orderId} không tồn tại hoặc đã bị xóa.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              {retryCount >= 5 && (
                <>
                  Đã thử tải lại {retryCount} lần nhưng vẫn không tìm được.
                  <br />
                  Vui lòng liên hệ hỗ trợ.
                </>
              )}
            </p>

            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Home size={18} />
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // THANH TOÁN THÀNH CÔNG - Hiển thị chi tiết đơn hàng
  // =========================
  const getPaymentStatusDisplay = () => {
    const paymentInfo = order?.thanhToanOnline;
    
    if (status === "success" || paymentInfo?.TinhTrangThanhToan === 2) {
      return {
        color: "text-green-600",
        bgColor: "bg-green-50",
        icon: CheckCircle,
        message: "Đặt hàng thành công!",
      };
    }
    
    if (order?.PhuongThucThanhToan === "COD") {
      return {
        color: "text-green-600",
        bgColor: "bg-green-50",
        icon: CheckCircle,
        message: "Đặt hàng thành công!",
      };
    }
    
    return {
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      icon: AlertCircle,
      message: "Đơn hàng đang xử lý",
    };
  };

  const statusDisplay = getPaymentStatusDisplay();
  const StatusIcon = statusDisplay.icon;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gray-50">
      <div className="container mx-auto px-6 max-w-2xl">
        {/* Status Card */}
        <div
          className={`rounded-xl shadow-sm p-8 text-center mb-8 ${statusDisplay.bgColor}`}
        >
          <StatusIcon
            className={`w-16 h-16 ${statusDisplay.color} mx-auto mb-4`}
          />
          <h1 className={`text-3xl font-bold ${statusDisplay.color} mb-2`}>
            {statusDisplay.message}
          </h1>
          <p className="text-gray-600">
            Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận.
          </p>
          {order && (
            <p className="text-gray-600 mt-2">
              Mã đơn hàng: <span className="font-semibold">#{order.MaDonHang}</span>
            </p>
          )}
          {transId && (
            <p className="text-sm text-gray-500 mt-1">
              Mã giao dịch: {transId}
            </p>
          )}
        </div>

        {/* Order Details */}
        {order && (
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Chi tiết đơn hàng</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between pb-4 border-b">
                <span className="text-gray-600">Mã đơn hàng</span>
                <span className="font-semibold">#{order.MaDonHang}</span>
              </div>

              <div className="flex justify-between pb-4 border-b">
                <span className="text-gray-600">Ngày đặt</span>
                <span className="font-semibold">
                  {new Date(order.NgayDat).toLocaleDateString("vi-VN")}
                </span>
              </div>

              <div className="flex justify-between pb-4 border-b">
                <span className="text-gray-600">Phương thức thanh toán</span>
                <span className="font-semibold">
                  {order.PhuongThucThanhToan === "COD"
                    ? "Thanh toán khi nhận hàng"
                    : "Thanh toán online (MOMO)"}
                </span>
              </div>

              <div className="flex justify-between pb-4 border-b">
                <span className="text-gray-600">Trạng thái đơn hàng</span>
                <span className="font-semibold">
                  {order.TinhTrangDonHang === 0
                    ? "Đang xử lý"
                    : order.TinhTrangDonHang === 1
                    ? "Đang giao"
                    : order.TinhTrangDonHang === 2
                    ? "Đã giao"
                    : "Đã hủy"}
                </span>
              </div>

              <div className="flex justify-between pt-4 border-t-2">
                <span className="text-lg font-bold">Tổng cộng</span>
                <span className="text-lg font-bold text-blue-600">
                  {formatPrice(order.TongTien)}
                </span>
              </div>
            </div>

            {/* Sản phẩm */}
            {order.chiTiet && order.chiTiet.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-4">Sản phẩm</h3>
                <div className="space-y-2">
                  {order.chiTiet.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between pb-2 border-b text-sm"
                    >
                      <span className="flex-1">{item.TenBienThe}</span>
                      <span className="w-16 text-center">x{item.SoLuongSanPham}</span>
                      <span className="w-32 text-right">
                        {formatPrice(item.GiaTienCuaSanPham * item.SoLuongSanPham)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Thông tin thanh toán online */}
            {order.thanhToanOnline && (
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Thông tin thanh toán online
                </h3>
                {order.thanhToanOnline.MaGiaoDich && (
                  <p className="text-sm text-blue-700">
                    Mã giao dịch:{" "}
                    <span className="font-mono">
                      {order.thanhToanOnline.MaGiaoDich}
                    </span>
                  </p>
                )}
                <p className="text-sm text-blue-700">
                  Thời gian:{" "}
                  {new Date(order.thanhToanOnline.ThoiDiemThanhToan).toLocaleString(
                    "vi-VN"
                  )}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/products")}
            className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Tiếp tục mua sắm
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;