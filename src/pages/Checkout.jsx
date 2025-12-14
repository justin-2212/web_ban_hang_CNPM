import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { gioHangAPI, checkoutAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, CreditCard, Truck } from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const { dbUser, loadingUser } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phuongThucThanhToan, setPhuongThucThanhToan] =
    useState("COD");

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
      setCartItems(res.data?.items || []);
    } catch (err) {
      console.error(err);
      setError("Không thể tải giỏ hàng");
    }
  }, [dbUser]);

  useEffect(() => {
    if (!loadingUser && dbUser?.MaTaiKhoan) {
      fetchCart();
    }
  }, [loadingUser, dbUser, fetchCart]);

  // =========================
  // Tổng tiền (chỉ hiển thị)
  // =========================
  const tongTien = cartItems.reduce(
    (sum, item) => sum + item.GiaTienBienThe * item.SoLuong,
    0
  );

  // =========================
  // Checkout
  // =========================
  const handleCheckout = async () => {
    if (!dbUser?.MaTaiKhoan) {
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      alert("Giỏ hàng trống");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await checkoutAPI.checkout({
        maTaiKhoan: dbUser.MaTaiKhoan,
        phuongThucThanhToan,
      });

      // ===== COD =====
      if (phuongThucThanhToan === "COD") {
        // ✅ Dispatch event để update header cart count
        window.dispatchEvent(new CustomEvent("cartServerUpdated"));
        navigate(`/order-success?orderId=${res.data.maDonHang}&status=success`);
        return;
      }

      // ===== MOMO ONLINE =====
      if (res.data.paymentUrl) {
        //⚠️ KHÔNG dispatch cartServerUpdated
        // Giỏ hàng vẫn giữ cho đến khi callback thành công
        window.location.href = res.data.paymentUrl;
      } else {
        throw new Error("Không tạo được link thanh toán");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Thanh toán thất bại"
      );
    } finally {
      setLoading(false);
    }
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ===================== */}
          {/* Danh sách sản phẩm */}
          {/* ===================== */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4">
              Sản phẩm
            </h3>

            <div className="space-y-4">
              {cartItems.map((item) => (
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

            <button
              onClick={handleCheckout}
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                loading
                  ? "bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading
                ? "Đang xử lý..."
                : "Xác nhận thanh toán"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;