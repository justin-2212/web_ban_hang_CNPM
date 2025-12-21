import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { gioHangAPI, checkoutAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, CreditCard, Truck, AlertCircle, Loader2 } from "lucide-react";
import { validateDeliveryInfo } from "../utils/validation";

const Checkout = () => {
  const navigate = useNavigate();
  const { dbUser, loadingUser } = useAuth();
  const [searchParams] = useSearchParams();

  const [cartItems, setCartItems] = useState([]);
  const [selectedMaBienThe, setSelectedMaBienThe] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phuongThucThanhToan, setPhuongThucThanhToan] = useState("COD");

  // ✅ NEW: State cho confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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
  // Load giỏ hàng từ DB
  // =========================
  const fetchCart = useCallback(async () => {
    if (!dbUser?.MaTaiKhoan) return;

    try {
      const res = await gioHangAPI.get(dbUser.MaTaiKhoan);
      const items = res.data?.items || [];
      setCartItems(items);

      // ✅ NEW: Lấy danh sách sản phẩm được chọn từ query param hoặc chọn tất cả
      const selectedParam = searchParams.get("selected");
      if (selectedParam) {
        try {
          const selected = JSON.parse(decodeURIComponent(selectedParam));
          setSelectedMaBienThe(new Set(selected));
        } catch (e) {
          // Nếu parse lỗi, chọn tất cả
          setSelectedMaBienThe(
            new Set(items.map((item) => item.MaBienThe))
          );
        }
      } else {
        // Nếu không có param, chọn tất cả (fallback)
        setSelectedMaBienThe(
          new Set(items.map((item) => item.MaBienThe))
        );
      }
    } catch (err) {
      console.error(err);
      setError("Không thể tải giỏ hàng");
    }
  }, [dbUser, searchParams]);

  useEffect(() => {
    if (!loadingUser && dbUser?.MaTaiKhoan) {
      fetchCart();
    }
  }, [loadingUser, dbUser, fetchCart]);

  // =========================
  // ✅ NEW: Tổng tiền (chỉ sản phẩm được chọn)
  // =========================
  const selectedItems = cartItems.filter((item) =>
    selectedMaBienThe.has(item.MaBienThe)
  );

  const tongTien = selectedItems.reduce(
    (sum, item) => sum + item.GiaTienBienThe * item.SoLuong,
    0
  );

  // ✅ NEW: Xử lý thanh toán thực tế (gọi từ modal)
  const processCheckout = async () => {
    if (!dbUser?.MaTaiKhoan) {
      navigate("/login");
      return;
    }

    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất 1 sản phẩm");
      return;
    }

    try {
      setIsProcessing(true);
      setError("");

      // ===== COD =====
      if (phuongThucThanhToan === "COD") {
        const res = await checkoutAPI.checkout({
          maTaiKhoan: dbUser.MaTaiKhoan,
          phuongThucThanhToan: "COD",
          // ✅ NEW: Chỉ gửi sản phẩm được chọn
          cartItems: selectedItems.map(item => ({
            MaBienThe: item.MaBienThe,
            SoLuong: item.SoLuong,
            GiaTienBienThe: item.GiaTienBienThe,
          })),
        });

        window.dispatchEvent(new CustomEvent("cartServerUpdated"));
        setShowConfirmModal(false);
        navigate(`/order-success?orderId=${res.data.maDonHang}&status=success`);
        return;
      }

      // ===== MOMO ONLINE =====
      if (phuongThucThanhToan === "ONLINE") {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"}/thanh-toan/momo/create-payment`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              maTaiKhoan: dbUser.MaTaiKhoan,
              // ✅ NEW: Chỉ gửi sản phẩm được chọn
              cartItems: selectedItems.map(item => ({
                MaBienThe: item.MaBienThe,
                SoLuong: item.SoLuong,
                GiaTienBienThe: item.GiaTienBienThe,
              })),
              tongTien,
            }),
          }
        );

        const data = await res.json();

        if (data.success && data.data?.paymentUrl) {
          setShowConfirmModal(false);
          window.location.href = data.data.paymentUrl;
        } else {
          throw new Error(
            data.message || "Không tạo được link thanh toán"
          );
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Thanh toán thất bại");
    } finally {
      setIsProcessing(false);
    }
  };

  // ✅ NEW: Nút xác nhận thanh toán (mở modal thay vì xử lý trực tiếp)
  const handleCheckoutClick = () => {
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất 1 sản phẩm");
      return;
    }
    setShowConfirmModal(true);
  };

  // =========================
  // Chưa đăng nhập
  // =========================
  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Đang tải...</p>
      </div>
    );
  }

  if (!dbUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow text-center">
          <p className="mb-4">Bạn cần đăng nhập để thanh toán</p>
          <Link
            to="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-20">
      {/* ✅ NEW: Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-8 h-8 text-blue-600 flex-shrink-0" />
              <h3 className="text-2xl font-bold text-gray-900">
                Xác nhận đặt hàng
              </h3>
            </div>

            {/* Order Summary */}
            <div className="mb-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">
                  Phương thức thanh toán
                </p>
                <p className="font-semibold text-gray-900">
                  {phuongThucThanhToan === "COD"
                    ? "💳 Thanh toán khi nhận hàng"
                    : "📱 Thanh toán Momo"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">
                  Số sản phẩm
                </p>
                <p className="font-semibold text-gray-900">
                  {selectedItems.length} sản phẩm ({selectedItems.reduce((sum, item) => sum + item.SoLuong, 0)} item)
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-blue-600 mb-2">
                  Tổng cộng
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {formatPrice(tongTien)}
                </p>
              </div>
            </div>

            {/* Warning Message */}
            <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ Vui lòng kiểm tra lại thông tin trước khi xác nhận
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={processCheckout}
                disabled={isProcessing}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                  isProcessing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isProcessing && (
                  <Loader2 className="w-5 h-5 animate-spin" />
                )}
                Đồng ý
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={isProcessing}
                className="flex-1 py-3 px-6 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Thanh toán
          </h1>
          <Link
            to="/cart"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft size={18} />
            Quay lại giỏ hàng
          </Link>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Show warning if delivery info is incomplete */}
        {(!dbUser?.SoDienThoai || !dbUser?.DiaChi) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-800 font-medium">
                Cập nhật thông tin giao hàng
              </p>
              <p className="text-yellow-700 text-sm mt-1">
                Vui lòng điền đầy đủ số điện thoại và địa chỉ trước khi thanh toán.{" "}
                <button
                  onClick={() => navigate("/profile")}
                  className="underline font-semibold hover:text-yellow-900"
                >
                  Cập nhật ngay
                </button>
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ===================== */}
          {/* Danh sách sản phẩm */}
          {/* ===================== */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4">
              Sản phẩm ({selectedItems.length})
            </h3>

            <div className="space-y-4">
              {selectedItems.map((item) => (
                <div
                  key={item.MaBienThe}
                  className="flex items-center justify-between border-b pb-4"
                >
                  <div>
                    <p className="font-medium">
                      {item.TenSanPham}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.TenBienThe} × {item.SoLuong}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {formatPrice(
                      item.GiaTienBienThe * item.SoLuong
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ===================== */}
          {/* Tổng & thanh toán */}
          {/* ===================== */}
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
            <h3 className="text-xl font-semibold mb-6">
              Tổng đơn hàng
            </h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span>{formatPrice(tongTien)}</span>
              </div>

              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span className="text-green-600">
                  Miễn phí
                </span>
              </div>

              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Tổng cộng</span>
                <span className="text-blue-600">
                  {formatPrice(tongTien)}
                </span>
              </div>
            </div>

            {/* Phương thức thanh toán */}
            <div className="mb-6 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  value="COD"
                  checked={
                    phuongThucThanhToan === "COD"
                  }
                  onChange={(e) =>
                    setPhuongThucThanhToan(
                      e.target.value
                    )
                  }
                />
                <Truck size={18} />
                Thanh toán khi nhận hàng (COD)
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  value="ONLINE"
                  checked={
                    phuongThucThanhToan === "ONLINE"
                  }
                  onChange={(e) =>
                    setPhuongThucThanhToan(
                      e.target.value
                    )
                  }
                />
                <CreditCard size={18} />
                Thanh toán online
              </label>
            </div>

            {/* ✅ NEW: Nút xác nhận (mở modal thay vì xử lý trực tiếp) */}
            <button
              onClick={handleCheckoutClick}
              disabled={selectedItems.length === 0}
              className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                selectedItems.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Xác nhận thanh toán ({selectedItems.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;