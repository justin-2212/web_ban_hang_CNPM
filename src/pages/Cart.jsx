// src/pages/Cart.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { gioHangAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Cart = () => {
  const { dbUser, loadingUser } = useAuth();
  const [cart, setCart] = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);

  // Lấy giỏ hàng từ DB
  const fetchCart = async () => {
    if (!dbUser?.MaTaiKhoan) return;
    setLoadingCart(true);
    try {
      const res = await gioHangAPI.get(dbUser.MaTaiKhoan);
      // backend trả: { success, data: { items, totalItems, totalPrice } }
      setCart(res.data?.items || []);
    } catch (err) {
      console.error("Lỗi tải giỏ hàng:", err);
    } finally {
      setLoadingCart(false);
    }
  };

  useEffect(() => {
    if (!loadingUser && dbUser?.MaTaiKhoan) {
      fetchCart();
    }
  }, [loadingUser, dbUser]);

  // Tăng số lượng
  const increaseQuantity = async (maBienThe) => {
    const item = cart.find((i) => i.MaBienThe === maBienThe);
    if (!item) return;
    try {
      await gioHangAPI.updateQuantity(
        dbUser.MaTaiKhoan,
        maBienThe,
        item.SoLuong + 1
      );
      await fetchCart();
      window.dispatchEvent(new CustomEvent("cartServerUpdated"));
    } catch (err) {
      alert("Không thể cập nhật số lượng");
    }
  };

  // Giảm số lượng
  const decreaseQuantity = async (maBienThe) => {
    const item = cart.find((i) => i.MaBienThe === maBienThe);
    if (!item) return;

    const newQty = item.SoLuong - 1;
    try {
      if (newQty <= 0) {
        await gioHangAPI.removeItem(dbUser.MaTaiKhoan, maBienThe);
      } else {
        await gioHangAPI.updateQuantity(
          dbUser.MaTaiKhoan,
          maBienThe,
          newQty
        );
      }
      await fetchCart();
      window.dispatchEvent(new CustomEvent("cartServerUpdated"));
    } catch (err) {
      alert("Không thể cập nhật số lượng");
    }
  };

  // Xóa sản phẩm
  const removeItem = async (maBienThe) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm?")) return;
    try {
      await gioHangAPI.removeItem(dbUser.MaTaiKhoan, maBienThe);
      await fetchCart();
      window.dispatchEvent(new CustomEvent("cartServerUpdated"));
    } catch (err) {
      alert("Không thể xóa sản phẩm khỏi giỏ");
    }
  };

  // Xóa tất cả
  const clearCart = async () => {
    if (!window.confirm("Bạn có chắc muốn xóa tất cả sản phẩm?")) return;
    try {
      await gioHangAPI.clearCart(dbUser.MaTaiKhoan);
      await fetchCart();
      window.dispatchEvent(new CustomEvent("cartServerUpdated"));
    } catch (err) {
      alert("Không thể xóa toàn bộ giỏ hàng");
    }
  };

  // Format giá tiền
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price || 0);

  // Tính tổng tiền & tổng số lượng từ data DB
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.GiaTienBienThe * item.SoLuong,
    0
  );
  const totalItems = cart.reduce((sum, item) => sum + item.SoLuong, 0);

  if (loadingUser || loadingCart) {
    return (
      <div className="bg-gray-50 min-h-screen pt-24 pb-20 flex items-center justify-center">
        <p className="text-gray-600">Đang tải giỏ hàng...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Giỏ hàng của bạn
            </h1>
            <p className="text-gray-600">
              {totalItems > 0
                ? `Bạn có ${totalItems} sản phẩm trong giỏ hàng`
                : "Giỏ hàng trống"}
            </p>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Tiếp tục mua sắm
          </Link>
        </div>

        {cart.length === 0 ? (
          // Giỏ hàng trống
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              Giỏ hàng trống
            </h3>
            <p className="text-gray-600 mb-8">
              Hãy thêm sản phẩm vào giỏ hàng để bắt đầu mua sắm
            </p>
            <Link
              to="/products"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Khám phá sản phẩm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Danh sách sản phẩm */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.MaBienThe}
                  className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-6 hover:shadow-md transition"
                >
                  {/* Hình ảnh */}
                  <img
                    src={item.DuongDanAnhBienThe || "/assets/placeholder.png"}
                    alt={item.TenSanPham}
                    className="w-24 h-24 object-contain rounded-lg bg-gray-50"
                    onError={(e) => {
                      e.target.src = "/assets/placeholder.png";
                    }}
                  />

                  {/* Thông tin sản phẩm */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {item.TenSanPham}
                    </h3>
                    <p className="text-gray-500 text-sm mb-3">
                      {item.TenBienThe}
                    </p>
                    <p className="text-blue-600 font-bold text-xl">
                      {formatPrice(item.GiaTienBienThe)}
                    </p>
                  </div>

                  {/* Điều chỉnh số lượng */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => decreaseQuantity(item.MaBienThe)}
                      className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                      disabled={item.SoLuong <= 1}
                    >
                      <Minus className="w-4 h-4 text-gray-700" />
                    </button>
                    <span className="text-lg font-semibold text-gray-900 w-8 text-center">
                      {item.SoLuong}
                    </span>
                    <button
                      onClick={() => increaseQuantity(item.MaBienThe)}
                      className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                    >
                      <Plus className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>

                  {/* Tổng tiền item */}
                  <div className="text-right min-w-[120px]">
                    <p className="text-sm text-gray-500 mb-1">Tổng:</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatPrice(item.GiaTienBienThe * item.SoLuong)}
                    </p>
                  </div>

                  {/* Nút xóa */}
                  <button
                    onClick={() => removeItem(item.MaBienThe)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-600 transition"
                    title="Xóa sản phẩm"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}

              {/* Nút xóa tất cả */}
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="w-full py-3 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition font-medium"
                >
                  Xóa tất cả sản phẩm
                </button>
              )}
            </div>

            {/* Tổng thanh toán */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Tổng đơn hàng
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính:</span>
                    <span className="font-semibold">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển:</span>
                    <span className="font-semibold text-green-600">
                      Miễn phí
                    </span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                    <span>Tổng cộng:</span>
                    <span className="text-blue-600">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-2">
                    <ShoppingBag className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Ưu đãi đặc biệt</p>
                      <p>Miễn phí vận chuyển cho đơn hàng trên 5.000.000₫</p>
                    </div>
                  </div>
                </div>

                <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-lg mb-3 shadow-md hover:shadow-lg">
                  Thanh toán
                </button>

                <Link
                  to="/products"
                  className="block w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-center"
                >
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
