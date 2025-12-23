//src/pages/ProductsDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { sanPhamAPI, gioHangAPI } from "../services/api";
import {
  ShoppingCart,
  ArrowLeft,
  Check,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useUser, SignInButton } from "@clerk/clerk-react";
import { useAuth } from "../context/AuthContext";
import OptionSelector from "../components/OptionSelector";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const location = useLocation();

  // --- STATE ---
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [allImages, setAllImages] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { dbUser, loadingUser } = useAuth(); // lấy user DB

  // State cho Thumbnail Slider
  const [thumbStart, setThumbStart] = useState(0);
  const THUMB_PER_ROW = 4;

  const [isAnimating, setIsAnimating] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // State cho thông số biến thể
  const [variantAttributes, setVariantAttributes] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState({});

  // ---------------------------
  // 1. LOAD PRODUCT DATA (FIXED - Handle missing variant attributes)
  // ---------------------------
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        // Fetch product detail
        const productResult = await sanPhamAPI.getDetail(id);
        if (!productResult.success) {
          setError("Không thể tải thông tin sản phẩm");
          setLoading(false);
          return;
        }

        setProduct(productResult.data);


        // ✅ KHỞI TẠO allImages
        const imagesList = [];
        const seenUrls = new Set();

        if (productResult.data.images?.length > 0) {
          productResult.data.images.forEach((img) => {
            if (!seenUrls.has(img.DuongDanLuuAnh)) {
              imagesList.push({
                src: img.DuongDanLuuAnh,
                type: "product",
                maSP: productResult.data.MaSP,
              });
              seenUrls.add(img.DuongDanLuuAnh);
            }
          });
        }

        if (productResult.data.variants?.length > 0) {
          productResult.data.variants.forEach((variant) => {
            if (variant.DuongDanAnhBienThe && !seenUrls.has(variant.DuongDanAnhBienThe)) {
              imagesList.push({
                src: variant.DuongDanAnhBienThe,
                type: "variant",
                maBienThe: variant.MaBienThe,
              });
              seenUrls.add(variant.DuongDanAnhBienThe);
            }
          });
        }

        setAllImages(imagesList);

        // Fetch variant attributes
        const attrResult = await sanPhamAPI.getVariantAttributes(id);

        if (attrResult.success && attrResult.data.length > 0) {
          setVariantAttributes(attrResult.data);

          // ✅ Lấy variant ĐẦU TIÊN CÒN HÀNG
          const firstAvailableVariant = productResult.data.variants?.find(
            v => v.SoLuongTonKho > 0
          ) || productResult.data.variants?.[0];

          // ✅ FIX: Kiểm tra variant có thongSo không
          if (firstAvailableVariant) {
            if (firstAvailableVariant.thongSo && firstAvailableVariant.thongSo.length > 0) {
              // Có thông số → khởi tạo selectedAttributes
              const initialSelection = {};
              firstAvailableVariant.thongSo.forEach((spec) => {
                initialSelection[spec.maThongSo] = spec.giaTriNhap;
              });
              setSelectedAttributes(initialSelection);
              setSelectedVariant(firstAvailableVariant);

              // Tự động chuyển ảnh
              if (firstAvailableVariant.DuongDanAnhBienThe && imagesList.length > 0) {
                const imgIndex = imagesList.findIndex(
                  (img) => img.src === firstAvailableVariant.DuongDanAnhBienThe
                );
                if (imgIndex >= 0) {
                  setActiveImageIndex(imgIndex);
                }
              }
            } else {
              // ⚠️ KHÔNG CÓ thongSo → bỏ qua variant attributes, chọn variant đầu tiên
              console.warn(`[Product ${id}] Variant ${firstAvailableVariant.MaBienThe} không có thông số biến thể`);
              setSelectedVariant(firstAvailableVariant);
              setVariantAttributes([]); // Reset về rỗng
            }
          }
        } else {
          // Không có variant attributes → chọn variant đầu tiên
          if (productResult.data.variants?.length > 0) {
            setSelectedVariant(productResult.data.variants[0]);
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Không thể tải thông tin sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // ---------------------------
  // 2. TÌM BIẾN THỂ PHÙ HỢP (COMPLETELY REWRITTEN)
  // ---------------------------
  useEffect(() => {
    if (!product?.variants || Object.keys(selectedAttributes).length === 0)
      return;

    // ✅ Tìm variant khớp CHÍNH XÁC với tất cả attributes đã chọn
    const matchingVariant = product.variants.find((variant) => {
      if (!variant.thongSo || variant.thongSo.length === 0) {
        return false;
      }

      // Kiểm tra số lượng thông số phải khớp
      if (variant.thongSo.length !== Object.keys(selectedAttributes).length) {
        return false;
      }

      // Kiểm tra TẤT CẢ thông số đã chọn phải khớp
      return Object.entries(selectedAttributes).every(([maThongSo, giaTriNhap]) => {
        const variantSpec = variant.thongSo.find(
          (spec) => String(spec.maThongSo) === String(maThongSo)
        );
        return variantSpec && variantSpec.giaTriNhap === giaTriNhap;
      });
    });

    if (matchingVariant) {
      setSelectedVariant(matchingVariant);

      // ✅ TỰ ĐỘNG CHUYỂN ẢNH KHI CHỌN VARIANT
      if (matchingVariant.DuongDanAnhBienThe && allImages.length > 0) {
        const imgIndex = allImages.findIndex(
          (img) => img.src === matchingVariant.DuongDanAnhBienThe
        );

        if (imgIndex >= 0 && imgIndex !== activeImageIndex) {
          changeActiveImage(imgIndex);
        }
      }
    } else {
      // ✅ Chỉ set null nếu đã chọn đủ số lượng attributes
      if (Object.keys(selectedAttributes).length === variantAttributes.length) {
        setSelectedVariant(null);
      }
    }
  }, [selectedAttributes, product, allImages, variantAttributes, activeImageIndex]);

  // ---------------------------
  // 3. XỬ LÝ CHỌN THÔNG SỐ (CẢI TIẾN)
  // ---------------------------
  const handleSelectAttribute = (maThongSo, giaTriNhap) => {
    setSelectedAttributes((prev) => {
      const newSelection = { ...prev };
      newSelection[maThongSo] = giaTriNhap;

      // ✅ RESET các lựa chọn PHÍA SAU khi thay đổi lựa chọn trước
      const currentIndex = variantAttributes.findIndex(
        (attr) => attr.maThongSo === parseInt(maThongSo)
      );

      // Xóa tất cả lựa chọn sau vị trí hiện tại
      variantAttributes.slice(currentIndex + 1).forEach((attr) => {
        delete newSelection[attr.maThongSo];
      });

      return newSelection;
    });
  };

  // ---------------------------
  // 2. CHANGE ACTIVE IMAGE (Logic trượt thumbnail tự động)
  // ---------------------------
  const changeActiveImage = (newIndex) => {
    if (!allImages.length || newIndex < 0 || newIndex >= allImages.length)
      return;

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
  // ✅ HELPER: TÍNH TOÁN OPTION KHẢ DỤNG (REWRITTEN)
  // ---------------------------
  const getAvailableOptions = (attributeIndex) => {
    const attribute = variantAttributes[attributeIndex];
    if (!attribute) return { available: new Set(), disabled: new Set() };

    // Lấy tất cả lựa chọn ĐÃ CHỌN trước attributeIndex
    const previousSelections = {};
    for (let i = 0; i < attributeIndex; i++) {
      const prevAttr = variantAttributes[i];
      const value = selectedAttributes[prevAttr.maThongSo];
      if (value !== undefined) {
        previousSelections[prevAttr.maThongSo] = value;
      }
    }

    // Nếu chưa có lựa chọn nào trước đó, tất cả options đều available
    if (Object.keys(previousSelections).length === 0) {
      const available = new Set();
      const disabled = new Set();

      product.variants.forEach((variant) => {
        const variantSpec = variant.thongSo?.find(
          (spec) => String(spec.maThongSo) === String(attribute.maThongSo)
        );

        if (variantSpec) {
          if (variant.SoLuongTonKho > 0) {
            available.add(variantSpec.giaTriNhap);
          } else {
            if (!available.has(variantSpec.giaTriNhap)) {
              disabled.add(variantSpec.giaTriNhap);
            }
          }
        }
      });

      return { available, disabled };
    }

    // Lọc variants khớp với lựa chọn trước đó
    const matchingVariants = product.variants.filter((variant) => {
      if (!variant.thongSo || variant.thongSo.length === 0) return false;

      // Kiểm tra TẤT CẢ thông số đã chọn trước đó
      return Object.entries(previousSelections).every(([maThongSo, giaTriNhap]) => {
        const variantSpec = variant.thongSo.find(
          (spec) => String(spec.maThongSo) === String(maThongSo)
        );
        return variantSpec && variantSpec.giaTriNhap === giaTriNhap;
      });
    });

    const available = new Set();
    const disabled = new Set();

    // Duyệt qua variants khớp để xác định options khả dụng
    matchingVariants.forEach((variant) => {
      const variantSpec = variant.thongSo.find(
        (spec) => String(spec.maThongSo) === String(attribute.maThongSo)
      );

      if (variantSpec) {
        const optionValue = variantSpec.giaTriNhap;
        
        if (variant.SoLuongTonKho > 0) {
          available.add(optionValue);
          disabled.delete(optionValue);
        } else if (!available.has(optionValue)) {
          disabled.add(optionValue);
        }
      }
    });

    return { available, disabled };
  };

  // ---------------------------
  // ✅ HELPER: LỌC OPTIONS HIỂN THỊ
  // ---------------------------
  const getFilteredOptions = (attribute, attributeIndex) => {
    const { available, disabled } = getAvailableOptions(attributeIndex);

    // ✅ LUÔN hiển thị TẤT CẢ options từ DB, chỉ đánh dấu trạng thái
    return attribute.options.map((option) => ({
      ...option,
      isAvailable: available.has(option.giaTriNhap),
      isDisabled: disabled.has(option.giaTriNhap),
    }));
  };

  // ---------------------------
  // 4. HELPER FUNCTIONS
  // ---------------------------
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);

  const formatSpecValue = (giaTriHienThi, donVi) => {
    // Nếu DonVi trống hoặc GiaTriHienThi đã chứa DonVi, chỉ hiển thị GiaTriHienThi
    if (!donVi || !giaTriHienThi) {
      return giaTriHienThi;
    }
    
    const displayValue = String(giaTriHienThi).trim();
    const unit = String(donVi).trim();
    
    // Kiểm tra xem GiaTriHienThi đã chứa DonVi hay chưa
    if (displayValue.includes(unit)) {
      return displayValue;
    }
    
    return `${displayValue} ${unit}`;
  };

  const addToCart = async () => {
    if (!isSignedIn) {
      return setShowLoginModal(true);
    }

    if (loadingUser) {
      return alert("Đang tải thông tin tài khoản, vui lòng thử lại sau.");
    }

    if (!dbUser?.MaTaiKhoan) {
      return alert(
        "Không tìm thấy tài khoản trong hệ thống. Vui lòng đăng nhập lại."
      );
    }

    // ✅ FIX: Kiểm tra đã chọn đủ thông số chưa
    if (variantAttributes.length > 0) {
      const missingAttributes = variantAttributes.filter(
        attr => !selectedAttributes[attr.maThongSo]
      );

      if (missingAttributes.length > 0) {
        const missingNames = missingAttributes.map(attr => attr.tenThongSo).join(', ');
        return alert(`Vui lòng chọn: ${missingNames}`);
      }
    }

    if (!selectedVariant) {
      return alert("Không tìm thấy sản phẩm phù hợp với lựa chọn của bạn");
    }

    // ✅ Kiểm tra tồn kho
    if (selectedVariant.SoLuongTonKho <= 0) {
      return alert("Sản phẩm này hiện đã hết hàng");
    }

    try {
      const response = await gioHangAPI.addItem(
        dbUser.MaTaiKhoan,
        selectedVariant.MaBienThe,
        1
      );

      if (response.success) {
        window.dispatchEvent(new CustomEvent("cartServerUpdated"));
        alert("Đã thêm vào giỏ hàng!");
      } else {
        alert(response.message || "Không thể thêm vào giỏ hàng");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert(err.message || "Lỗi khi thêm vào giỏ hàng. Vui lòng thử lại.");
    }
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

  const thumbPrev = () =>
    setThumbStart((prev) => Math.max(prev - THUMB_PER_ROW, 0));

  const thumbNext = () =>
    setThumbStart((prev) =>
      Math.min(
        prev + THUMB_PER_ROW,
        Math.max(0, allImages.length - THUMB_PER_ROW)
      )
    );

  // Variables for Render
  const mainImage =
    allImages?.[activeImageIndex]?.src ||
    selectedVariant?.DuongDanAnhBienThe ||
    product?.images?.[0]?.DuongDanLuuAnh ||
    "/assets/placeholder.png";

  const thumbVisible = allImages.slice(thumbStart, thumbStart + THUMB_PER_ROW);
  const inStock = selectedVariant?.SoLuongTonKho > 0;
  
  // ✅ Kiểm tra đã chọn đủ thông số chưa
  const hasAllAttributesSelected = variantAttributes.length === 0 || 
    Object.keys(selectedAttributes).length === variantAttributes.length;

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
          onClick={() => {
            const params = new URLSearchParams(location.search);
            const categoryId = params.get("category");

            if (categoryId) {
              navigate(`/products?category=${categoryId}`);
            } else {
              navigate("/products");
            }
          }}
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
                          ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                          : "bg-gray-100 hover:bg-gray-200"
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
                            onError={(e) =>
                              (e.target.src = "/assets/placeholder.png")
                            }
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
                          ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                          : "bg-gray-100 hover:bg-gray-200"
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
                  <div className="flex items-center gap-2 text-green-600 mt-3">
                    <Check className="w-5 h-5" />
                    <span>
                      Còn hàng ({selectedVariant.SoLuongTonKho} sản phẩm)
                    </span>
                  </div>
                ) : (
                  <div className="text-red-600">Hết hàng</div>
                )}
              </div>

              {/* THÔNG SỐ BIẾN THỂ */}
              {variantAttributes.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Chọn cấu hình:
                  </h3>
                  {variantAttributes.map((attr, index) => {
                    const filteredOptions = getFilteredOptions(attr, index);
                    
                    return (
                      <OptionSelector
                        key={attr.maThongSo}
                        attribute={{
                          ...attr,
                          options: filteredOptions,
                        }}
                        selectedValue={selectedAttributes[attr.maThongSo]}
                        onSelect={handleSelectAttribute}
                      />
                    );
                  })}
                </div>
              )}

              {/* ✅ Hiển thị message khi không có variant khớp (CHỈ KHI ĐÃ CHỌN ĐẦY ĐỦ) */}
              {variantAttributes.length > 0 && 
               Object.keys(selectedAttributes).length === variantAttributes.length &&
               !selectedVariant && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Không tìm thấy biến thể phù hợp. Vui lòng chọn lại.
                  </p>
                </div>
              )}

              {/* Add to Cart */}
              <button
                onClick={addToCart}
                disabled={!hasAllAttributesSelected || !selectedVariant || !inStock}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all ${
                  hasAllAttributesSelected && selectedVariant && inStock
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <ShoppingCart className="w-6 h-6" />
                {!hasAllAttributesSelected
                  ? "Vui lòng chọn đầy đủ thông số"
                  : !selectedVariant
                  ? "Không có sản phẩm phù hợp"
                  : !inStock
                  ? "Hết hàng"
                  : "Thêm vào giỏ hàng"}
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
                          {formatSpecValue(spec.GiaTriHienThi, spec.DonVi)}
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
