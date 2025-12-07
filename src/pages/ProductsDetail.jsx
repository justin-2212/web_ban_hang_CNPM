import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { sanPhamAPI } from "../services/api";
import {
  ShoppingCart,
  ArrowLeft,
  Check,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useUser, SignInButton } from "@clerk/clerk-react";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  // --- STATE ---
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [allImages, setAllImages] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // State cho Thumbnail Slider
  const [thumbStart, setThumbStart] = useState(0);
  const THUMB_PER_ROW = 4;
  
  const [isAnimating, setIsAnimating] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // ---------------------------
  // 1. LOAD PRODUCT DATA
  // ---------------------------
  useEffect(() => {
    setLoading(true);
    sanPhamAPI
      .getDetail(id)
      .then((res) => {
        const data = res.data;
        setProduct(data);

        const defaultVariant = data.variants?.[0] || null;
        setSelectedVariant(defaultVariant);

        // --- Merge images ---
        const productImgs = (data.images || []).map((img) => ({
          src: img.DuongDanLuuAnh,
          type: "product",
        }));

        // Lấy TẤT CẢ ảnh variant
        const variantImgs = (data.variants || [])
          .filter((v) => v.DuongDanAnhBienThe)
          .map((v) => ({
            src: v.DuongDanAnhBienThe,
            type: "variant",
            maBienThe: v.MaBienThe,
          }));

        // Lọc trùng
        const seen = new Set(productImgs.map((i) => i.src));
        const uniqueVariantImgs = variantImgs.filter((v) => {
          if (seen.has(v.src)) {
            seen.add(v.src); 
            return true;
          }
          seen.add(v.src);
          return true;
        });

        const merged = [...productImgs, ...uniqueVariantImgs];
        setAllImages(merged);

        // Set initial active image
        let initialIndex = 0;
        if (defaultVariant?.DuongDanAnhBienThe) {
          const found = merged.findIndex(
            (i) =>
              i.type === "variant" &&
              String(i.maBienThe) === String(defaultVariant.MaBienThe)
          );
          if (found >= 0) initialIndex = found;
        }
        setActiveImageIndex(initialIndex);
        setThumbStart(Math.max(0, initialIndex - Math.floor(THUMB_PER_ROW / 2)));
      })
      .catch(() => setError("Không thể tải thông tin sản phẩm"))
      .finally(() => setLoading(false));
  }, [id]);

  // ---------------------------
  // 2. CHANGE ACTIVE IMAGE (Logic trượt thumbnail tự động)
  // ---------------------------
  const changeActiveImage = (newIndex) => {
    if (!allImages.length || newIndex < 0 || newIndex >= allImages.length) return;

    setIsAnimating(false);
    setTimeout(() => {
      setActiveImageIndex(newIndex);

      // Tự động trượt thumbnail nếu ảnh chọn nằm ngoài vùng hiển thị
      if (newIndex < thumbStart) setThumbStart(Math.max(0, newIndex));
      if (newIndex >= thumbStart + THUMB_PER_ROW)
        setThumbStart(
          Math.min(
            newIndex - THUMB_PER_ROW + 1,
            Math.max(0, allImages.length - THUMB_PER_ROW)
          )
        );

      requestAnimationFrame(() =>
        requestAnimationFrame(() => setIsAnimating(true))
      );
    }, 120);
  };

  // ---------------------------
  // 3. SELECT VARIANT
  // ---------------------------
  const handleSelectVariant = (variant) => {
    setSelectedVariant(variant);

    if (!variant?.DuongDanAnhBienThe) return;

    // Tìm ảnh variant theo MaBienThe (ưu tiên)
    const exactMatch = allImages.findIndex(
      (i) => i.type === "variant" && String(i.maBienThe) === String(variant.MaBienThe)
    );

    if (exactMatch >= 0) {
      changeActiveImage(exactMatch);
      return;
    }

    // Nếu không tìm thấy exact match, tìm theo URL ảnh
    const urlMatch = allImages.findIndex(
      (i) => i.src === variant.DuongDanAnhBienThe
    );

    if (urlMatch >= 0) {
      changeActiveImage(urlMatch);
      return;
    }
  };

  // ---------------------------
  // 4. HELPER FUNCTIONS
  // ---------------------------
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);

  const addToCart = () => {
    if (!isSignedIn) return setShowLoginModal(true);
    if (!selectedVariant) return alert("Vui lòng chọn phiên bản sản phẩm");

    const cartItem = {
      maBienThe: selectedVariant.MaBienThe,
      tenSanPham: product.Ten,
      tenBienThe: selectedVariant.TenBienThe,
      giaTien: selectedVariant.GiaTienBienThe,
      soLuong: 1,
      hinhAnh:
        selectedVariant.DuongDanAnhBienThe ||
        product.images?.[0]?.DuongDanLuuAnh ||
        allImages?.[0]?.src ||
        null,
    };

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const i = cart.findIndex((c) => c.maBienThe === cartItem.maBienThe);
    if (i >= 0) cart[i].soLuong++;
    else cart.push(cartItem);

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    alert("Đã thêm vào giỏ hàng!");
  };

  // ---------------------------
  // 5. NAVIGATION HANDLERS
  // ---------------------------
  const handlePrevMain = () =>
    changeActiveImage(
      activeImageIndex === 0 ? allImages.length - 1 : activeImageIndex - 1
    );

  const handleNextMain = () =>
    changeActiveImage(
      activeImageIndex === allImages.length - 1 ? 0 : activeImageIndex + 1
    );

  const thumbPrev = () => setThumbStart((prev) => Math.max(prev - THUMB_PER_ROW, 0));

  const thumbNext = () =>
    setThumbStart((prev) =>
      Math.min(prev + THUMB_PER_ROW, Math.max(0, allImages.length - THUMB_PER_ROW))
    );

  // Variables for Render
  const mainImage =
    allImages?.[activeImageIndex]?.src ||
    selectedVariant?.DuongDanAnhBienThe ||
    product?.images?.[0]?.DuongDanLuuAnh ||
    "/assets/placeholder.png";

  const thumbVisible = allImages.slice(thumbStart, thumbStart + THUMB_PER_ROW);
  const inStock = selectedVariant?.SoLuongTonKho > 0;

  // ---------------------------
  // 6. RENDER
  // ---------------------------
  if (loading)
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );

  if (error || !product)
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy sản phẩm
          </h2>
          <Link to="/products" className="text-blue-600 hover:text-blue-700">
            Quay lại trang sản phẩm
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gray-50">
      {/* --- Login Modal --- */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Yêu cầu đăng nhập
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng
            </p>

            <div className="flex gap-3">
              <SignInButton mode="modal">
                <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700">
                  Đăng nhập
                </button>
              </SignInButton>
              <button
                onClick={() => setShowLoginModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT --- */}
      <div className="container mx-auto px-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </button>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* --- GALLERY SECTION (LEFT) --- */}
            <div>
              {/* Main Image */}
              <div className="relative bg-gray-50 rounded-2xl p-8 mb-4 flex items-center justify-center overflow-hidden">
                {allImages.length > 1 && (
                  <button
                    onClick={handlePrevMain}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-colors z-10"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}

                <img
                  key={activeImageIndex}
                  src={mainImage}
                  alt={product.Ten}
                  className={`w-full h-96 object-contain transition-opacity duration-300 ${
                    isAnimating ? "opacity-100" : "opacity-0"
                  }`}
                  onError={(e) => (e.target.src = "/assets/placeholder.png")}
                />

                {allImages.length > 1 && (
                  <button
                    onClick={handleNextMain}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-colors z-10"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* --- THUMBNAIL STRIP (FIXED) --- */}
              {allImages.length > 0 && (
                <div className="flex items-center gap-2 mt-4">
                  {/* Prev Thumb Button */}
                  {allImages.length > THUMB_PER_ROW && (
                    <button
                      onClick={thumbPrev}
                      disabled={thumbStart === 0}
                      className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                        thumbStart === 0 
                          ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  )}
                  
                  {/* Thumb Grid */}
                  <div className="grid grid-cols-4 gap-2 flex-1">
                    {thumbVisible.map((img, idx) => {
                      const real = thumbStart + idx; // Calculate Real Index
                      return (
                        <div
                          key={`${img.src}-${real}`}
                          onClick={() => changeActiveImage(real)}
                          className={`p-1 rounded-lg cursor-pointer border transition-all h-24 flex items-center justify-center bg-white ${
                            real === activeImageIndex
                              ? "border-blue-500 shadow ring-1 ring-blue-200"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          <img
                            src={img.src}
                            alt={`Thumbnail ${real + 1}`}
                            className="w-full h-full object-contain rounded"
                            onError={(e) => (e.target.src = "/assets/placeholder.png")}
                          />
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Next Thumb Button */}
                  {allImages.length > THUMB_PER_ROW && (
                    <button
                      onClick={thumbNext}
                      disabled={thumbStart + THUMB_PER_ROW >= allImages.length}
                      className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                        thumbStart + THUMB_PER_ROW >= allImages.length
                          ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* --- PRODUCT INFO SECTION (RIGHT) --- */}
            <div>
              <div className="text-sm text-blue-600 font-semibold mb-2 uppercase tracking-wide">
                {product.TenLoai}
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {product.Ten}
              </h1>
              <p className="text-gray-600 mb-6 text-lg">{product.MoTa}</p>

              <div className="mb-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {formatPrice(selectedVariant?.GiaTienBienThe)}
                </div>
                {inStock ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="w-5 h-5" />
                    <span>
                      Còn hàng ({selectedVariant.SoLuongTonKho} sản phẩm)
                    </span>
                  </div>
                ) : (
                  <div className="text-red-600">Hết hàng</div>
                )}
              </div>

              {/* Variants */}
              {product.variants?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Chọn phiên bản:
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    {product.variants.map((variant) => {
                      const isSelected =
                        selectedVariant?.MaBienThe === variant.MaBienThe;
                      const available = variant.SoLuongTonKho > 0;

                      return (
                        <button
                          key={variant.MaBienThe}
                          onClick={() => handleSelectVariant(variant)}
                          disabled={!available}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            isSelected
                              ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                              : available
                              ? "border-gray-200 hover:border-blue-300"
                              : "border-gray-200 opacity-50 cursor-not-allowed"
                          }`}
                        >
                          <div className="font-medium text-gray-900">
                            {variant.TenBienThe}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {formatPrice(variant.GiaTienBienThe)}
                          </div>
                          {!available && (
                            <div className="text-xs text-red-600 mt-1">
                              Hết hàng
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Add to Cart */}
              <button
                onClick={addToCart}
                disabled={!inStock}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all ${
                  inStock
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <ShoppingCart className="w-6 h-6" />
                {inStock ? "Thêm vào giỏ hàng" : "Hết hàng"}
              </button>

              {/* Specs */}
              {product.specs?.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Thông số kỹ thuật:
                  </h3>
                  <div className="space-y-3">
                    {product.specs.map((spec, i) => (
                      <div
                        key={i}
                        className="flex justify-between py-2 border-b border-gray-100"
                      >
                        <span className="text-gray-600">{spec.TenThongSo}:</span>
                        <span className="font-medium text-gray-900">
                          {spec.GiaTriHienThi} {spec.DonVi}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}