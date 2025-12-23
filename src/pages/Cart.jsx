import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";
import { gioHangAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Cart = () => {
  const navigate = useNavigate();
  const { dbUser, loadingUser } = useAuth();

  const [cart, setCart] = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);
  // ✅ NEW: State quản lý sản phẩm được chọn
  const [selectedItems, setSelectedItems] = useState(new Set());

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
  // Load giỏ hàng từ DB (SIMPLIFIED)
  // =========================
  const fetchCart = useCallback(async () => {
    if (!dbUser?.MaTaiKhoan) return;

    setLoadingCart(true);
    
    try {
      const res = await gioHangAPI.get(dbUser.MaTaiKhoan);
      setCart(res.data?.items || []);
    } catch (err) {
      setCart([]);
    } finally {
      setLoadingCart(false);
    }
  }, [dbUser?.MaTaiKhoan]);

  // Load cart khi user ready
  useEffect(() => {
    if (!loadingUser && dbUser?.MaTaiKhoan) {
      fetchCart();
    }
  }, [loadingUser, dbUser?.MaTaiKhoan, fetchCart]);

  // =========================
  // Helper cập nhật + reload
  // =========================
  const refreshCart = async () => {
    await fetchCart();
    window.dispatchEvent(new CustomEvent("cartServerUpdated"));
  };

  // =========================
  // Tăng số lượng
  // =========================
  const increaseQuantity = async (maBienThe) => {
    const item = cart.find((i) => i.MaBienThe === maBienThe);
    if (!item) return;

    try {
      await gioHangAPI.updateQuantity(
        dbUser.MaTaiKhoan,
        maBienThe,
        item.SoLuong + 1
      );
      await refreshCart();
    } catch {
      alert("Không thể cập nhật số lượng");
    }
  };

  // =========================
  // Giảm số lượng
  // =========================
  const decreaseQuantity = async (maBienThe) => {
    const item = cart.find((i) => i.MaBienThe === maBienThe);
    if (!item) return;

    try {
      if (item.SoLuong <= 1) {
        await gioHangAPI.removeItem(dbUser.MaTaiKhoan, maBienThe);
      } else {
        await gioHangAPI.updateQuantity(
          dbUser.MaTaiKhoan,
          maBienThe,
          item.SoLuong - 1
        );
      }
      await refreshCart();
    } catch {
      alert("Không thể cập nhật số lượng");
    }
  };

  // =========================
  // Xóa 1 sản phẩm
  // =========================
  const removeItem = async (maBienThe) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm?")) return;

    try {
      await gioHangAPI.removeItem(dbUser.MaTaiKhoan, maBienThe);
      await refreshCart();
    } catch {
      alert("Không thể xóa sản phẩm");
    }
  };

  // =========================
  // Xóa toàn bộ
  // =========================
  const clearCart = async () => {
    if (!window.confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?")) return;

    try {
      await gioHangAPI.clearCart(dbUser.MaTaiKhoan);
      await refreshCart();
    } catch {
      alert("Không thể xóa giỏ hàng");
    }
  };

  // =========================
  // ✅ NEW: Toggle chọn sản phẩm
  // =========================
  const toggleSelectItem = (maBienThe) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(maBienThe)) {
      newSelected.delete(maBienThe);
    } else {
      newSelected.add(maBienThe);
    }
    setSelectedItems(newSelected);
  };

  // =========================
  // ✅ NEW: Chọn/bỏ chọn tất cả
  // =========================
  const toggleSelectAll = () => {
    if (selectedItems.size === cart.length) {
      // Bỏ chọn tất cả
      setSelectedItems(new Set());
    } else {
      // Chọn tất cả
      setSelectedItems(new Set(cart.map((item) => item.MaBienThe)));
    }
  };

  // =========================
  // Tổng tiền (chỉ tính sản phẩm được chọn)
  // =========================
  const totalPrice = cart
    .filter((item) => selectedItems.has(item.MaBienThe))
    .reduce((sum, item) => sum + item.GiaTienBienThe * item.SoLuong, 0);

  // =========================
  // Tổng số sản phẩm được chọn
  // =========================
  const totalSelectedItems = cart
    .filter((item) => selectedItems.has(item.MaBienThe))
    .reduce((sum, item) => sum + item.SoLuong, 0);

  const totalItems = cart.reduce((sum, item) => sum + item.SoLuong, 0);

  // =========================
  // Loading
  // =========================
  if (loadingUser || loadingCart) {
    return (
      <div className="bg-gray-50 min-h-screen pt-24 flex items-center justify-center">
        <p className="text-gray-600">Đang tải giỏ hàng...</p>
      </div>
    );
  }

  if (!dbUser) {
    navigate("/sign-in");
    return null;
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
                ? `Bạn có ${totalItems} sản phẩm (${selectedItems.size} được chọn)`
                : "Giỏ hàng trống"}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-6">
            <Link
              to="/orders"
              className="hover:text-blue-600 transition-colors text-gray-800 font-semibold"
            >
              📋 Lịch sử đơn hàng
            </Link>

            <Link
              to="/products"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>

        {cart.length === 0 ? (
          // Giỏ hàng trống
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold mb-3">
              Giỏ hàng trống
            </h3>
            <p className="text-gray-600 mb-8">
              Hãy thêm sản phẩm để bắt đầu mua sắm
            </p>
            <Link
              to="/products"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Khám phá sản phẩm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Danh sách sản phẩm */}
            <div className="lg:col-span-2 space-y-4">
              {/* ✅ NEW: Nút chọn tất cả */}
              <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === cart.length && cart.length > 0}
                    onChange={toggleSelectAll}
                    className="w-5 h-5 rounded"
                  />
                  <span className="font-semibold text-gray-700">
                    Chọn tất cả ({cart.length})
                  </span>
                </label>
              </div>

              {cart.map((item) => (
                <div
                  key={item.MaBienThe}
                  className={`bg-white rounded-xl shadow-sm p-6 flex items-center gap-6 transition relative ${
                    selectedItems.has(item.MaBienThe)
                      ? "border-2 border-blue-500"
                      : "border-2 border-transparent"
                  }`}
                >
                  {/* Nút xóa - góc trên phải */}
                  <button
                    onClick={() => removeItem(item.MaBienThe)}
                    className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                    title="Xóa sản phẩm"
                  >
                    <Trash2 size={18} />
                  </button>

                  {/* Checkbox để chọn sản phẩm */}
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.MaBienThe)}
                    onChange={() => toggleSelectItem(item.MaBienThe)}
                    className="w-5 h-5 rounded cursor-pointer"
                  />

                  <img
                    src={item.DuongDanAnhBienThe || "/assets/placeholder.png"}
                    alt={item.TenSanPham}
                    className="w-24 h-24 object-contain bg-gray-50 rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold">
                      {item.TenSanPham}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {item.TenBienThe}
                    </p>
                    <p className="text-blue-600 font-bold text-lg">
                      {formatPrice(item.GiaTienBienThe)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        decreaseQuantity(item.MaBienThe)
                      }
                      disabled={item.SoLuong <= 1}
                      className="w-14 h-7.5 bg-gray-100 rounded-lg"
                    >
                      <Minus size={16} />
                    </button>

                    <span className="w-8 text-center font-semibold">
                      {item.SoLuong}
                    </span>

                    <button
                      onClick={() =>
                        increaseQuantity(item.MaBienThe)
                      }
                      className="w-14 h-7.5 bg-gray-100 rounded-lg"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="min-w-[120px] text-right">
                    <p className="font-bold">
                      {formatPrice(item.SoLuong * item.GiaTienBienThe)}
                    </p>
                  </div>
                </div>
              ))}

              <button
                onClick={clearCart}
                className="w-full py-3 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50"
              >
                Xóa toàn bộ giỏ hàng
              </button>
            </div>

            {/* Tổng thanh toán */}
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-6">
                Tổng đơn hàng
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Số lượng chọn</span>
                  <span className="font-semibold">
                    {totalSelectedItems} sản phẩm
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span className="font-semibold">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Vận chuyển</span>
                  <span className="text-green-600">Miễn phí</span>
                </div>

                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Tổng cộng</span>
                  <span className="text-blue-600">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (selectedItems.size === 0) {
                    alert("Vui lòng chọn ít nhất 1 sản phẩm để thanh toán");
                    return;
                  }
                  // ✅ Truyền danh sách sản phẩm được chọn qua URL params
                  const selectedArray = Array.from(selectedItems);
                  const params = new URLSearchParams();
                  params.set("selected", JSON.stringify(selectedArray));
                  navigate(`/checkout?${params.toString()}`);
                }}
                disabled={selectedItems.size === 0}
                className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                  selectedItems.size === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Thanh toán ({selectedItems.size})
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
