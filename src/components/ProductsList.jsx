import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { sanPhamAPI } from "../services/api";
import { ShoppingCart, Eye } from "lucide-react";
import { useUser, SignInButton } from "@clerk/clerk-react";

export default function ProductsList({ products, priceRange }) {
  const { isSignedIn } = useUser();
  const [productsWithVariants, setProductsWithVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (!products || products.length === 0) {
      setProductsWithVariants([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // === BẮT ĐẦU SỬA: GIỮ NGUYÊN THỨ TỰ PROPS ===
    
    // Fetch variants for each product
    const fetchVariants = products.map(product =>
      sanPhamAPI.getDetail(product.MaSP)
        .then(res => ({
          ...product,
          variants: res.data.variants || [],
          images: res.data.images || [],
          minPrice: res.data.variants?.length > 0
            ? Math.min(...res.data.variants.map(v => v.GiaTienBienThe))
            : 0,
          maxPrice: res.data.variants?.length > 0
            ? Math.max(...res.data.variants.map(v => v.GiaTienBienThe))
            : 0
        }))
        .catch(err => {
          console.error(`Error fetching variants for product ${product.MaSP}:`, err);
          return {
            ...product,
            variants: [],
            images: [],
            minPrice: 0,
            maxPrice: 0
          };
        })
    );

    // ✅ SỬA: Dùng Promise.all GIỮ NGUYÊN THỨ TỰ
    Promise.all(fetchVariants)
      .then(results => {
        // ✅ results giữ nguyên thứ tự của products[] prop
        // Filter by price range if provided
        const filtered = priceRange
          ? results.filter(p =>
              p.minPrice <= priceRange.max && p.maxPrice >= priceRange.min
            )
          : results;

        setProductsWithVariants(filtered);
      })
      .finally(() => setLoading(false));
      
    // === KẾT THÚC SỬA ===
  }, [products, priceRange]);


  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const addToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Kiểm tra đăng nhập
    if (!isSignedIn) {
      setShowLoginModal(true);
      return;
    }
    
    // Get the first available variant
    const firstVariant = product.variants[0];
    if (!firstVariant) {
      alert('Sản phẩm tạm hết hàng');
      return;
    }

    const cartItem = {
      maBienThe: firstVariant.MaBienThe,
      tenSanPham: product.Ten,
      tenBienThe: firstVariant.TenBienThe,
      giaTien: firstVariant.GiaTienBienThe,
      soLuong: 1,
      hinhAnh: firstVariant.DuongDanAnhBienThe || product.images[0]?.DuongDanLuuAnh,
    };

    // Get existing cart
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if item exists
    const existingIndex = cart.findIndex(item => item.maBienThe === cartItem.maBienThe);
    
    if (existingIndex >= 0) {
      cart[existingIndex].soLuong += 1;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Dispatch event to update cart count
    window.dispatchEvent(new Event('cartUpdated'));
    
    alert('Đã thêm vào giỏ hàng!');
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-2xl shadow-md p-6 animate-pulse">
            <div className="w-full h-52 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!productsWithVariants.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Không có sản phẩm phù hợp.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Modal yêu cầu đăng nhập */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Yêu cầu đăng nhập
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng
            </p>
            <div className="flex gap-3">
              <SignInButton mode="modal">
                <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                  Đăng nhập
                </button>
              </SignInButton>
              <button
                onClick={() => setShowLoginModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {productsWithVariants.map((product, index) => {
        const mainImage = product.images[0]?.DuongDanLuuAnh 
                    || product.variants[0]?.DuongDanAnhBienThe 
                    || '/assets/placeholder.png';

        const hasMultipleVariants = product.variants.length > 1;
        const inStock = product.variants.some(v => v.SoLuongTonKho > 0);

        return (
          <Link
            key={product.MaSP}
            to={`/products/${product.MaSP}?category=${product.MaLoai}`}
            data-aos="zoom-in"
            data-aos-delay={index * 50}
            className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            {/* Image Container */}
            <div className="relative w-full h-64 bg-gray-50 flex items-center justify-center p-6 overflow-hidden">
              <img 
                src={mainImage}
                alt={product.Ten} 
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = '/assets/placeholder.png';
                }}
              />
              
              {/* Stock badge */}
              {!inStock && (
                <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                  Hết hàng
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

            </div>

            {/* Content */}
            <div className="p-5">
              {/* Category badge */}
              <div className="text-xs text-blue-600 font-semibold mb-2 uppercase tracking-wide">
                {product.TenLoai}
              </div>

              {/* Product name */}
              <h4 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 min-h-[3.5rem]">
                {product.Ten}
              </h4>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {product.MoTa || 'Sản phẩm Apple chính hãng'}
              </p>

              {/* Price */}
              <div className="mb-4">
                {hasMultipleVariants ? (
                  <div className="text-blue-600 font-bold text-lg">
                    {formatPrice(product.minPrice)} - {formatPrice(product.maxPrice)}
                  </div>
                ) : (
                  <div className="text-blue-600 font-bold text-lg">
                    {formatPrice(product.minPrice)}
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  {product.variants.length} phiên bản
                </div>
              </div>

              {/* Action button */}
              <button
                onClick={(e) => addToCart(product, e)}
                disabled={!inStock}
                className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  inStock
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                {inStock ? 'Thêm vào giỏ' : 'Hết hàng'}
              </button>
            </div>
          </Link>
        );
      })}
    </div>
  );
}