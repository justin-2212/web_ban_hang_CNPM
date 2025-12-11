//src/pages/Products.jsx

import React, { useState, useEffect, useMemo } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { sanPhamAPI, loaiSanPhamAPI } from "../services/api";
import CategoryTabs from "../components/CategoryTabs";
import SortSelect from "../components/SortSelect";
import ProductsList from "../components/ProductsList";
import SearchBar from "../components/SearchBar";
import { Loader2 } from "lucide-react";


export default function Products() {
  const [searchParams] = useSearchParams();
  const categoryFromURL = searchParams.get("category");

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const navigate = useNavigate(); 
  // ============================================================
  // HELPER FUNCTION: Fetch products with variants
  // ============================================================
  const fetchProductsWithVariants = (productsData) => {
    if (productsData.length === 0) {
      setProducts([]);
      return Promise.resolve([]);
    }

    // Fetch variants cho từng product
    const fetchVariants = productsData.map((p) =>
      sanPhamAPI
        .getDetail(p.MaSP)
        .then((detail) => {
          const variants = detail.data.variants || [];
          const prices = variants.map(v => v.GiaTienBienThe).filter(Boolean);
          
          return {
            ...p,
            variants,
            minPrice: prices.length > 0 ? Math.min(...prices) : 0,
            maxPrice: prices.length > 0 ? Math.max(...prices) : 0
          };
        })
        .catch(() => ({
          ...p,
          variants: [],
          minPrice: 0,
          maxPrice: 0
        }))
    );

    // Đợi tất cả fetch xong
    return Promise.all(fetchVariants)
      .then((productsWithPrices) => {
        setProducts(productsWithPrices);
        return productsWithPrices;
      });
  };

  // ------------------------------------------------------------
  // 1. FETCH CATEGORIES
  // ------------------------------------------------------------
  useEffect(() => {
    loaiSanPhamAPI
      .getAll()
      .then((res) => {
        setCategories(res.data);

        if (categoryFromURL) {
          const id = parseInt(categoryFromURL);
          setSelectedCategory(id);
        } else if (res.data.length > 0) {
          setSelectedCategory(res.data[0].MaLoai);
        }
      })
      .catch((err) => {
        console.error("Error loading categories:", err);
        setError("Không thể tải danh mục sản phẩm");
      });
  }, [categoryFromURL]);

  // ------------------------------------------------------------
  // 2. FETCH PRODUCTS BY CATEGORY
  // ------------------------------------------------------------
  useEffect(() => {
    if (!selectedCategory || searchQuery) return;
    
    // Clear products cũ NGAY để tránh hiển thị data cũ
    setProducts([]);
    setLoading(true);
    setError(null);
    
    sanPhamAPI
      .getByCategory(selectedCategory)
      .then((res) => {
        return fetchProductsWithVariants(res.data);
      })
      .catch((err) => {
        console.error("Error loading products:", err);
        setError("Không thể tải sản phẩm");
        setProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedCategory, searchQuery]);

  // ------------------------------------------------------------
  // 3. SEARCH PRODUCTS
  // ------------------------------------------------------------
  const handleSearch = (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      return;
    }

    // Clear products cũ trước khi search
    setProducts([]);
    setLoading(true);
    setError(null);
    
    sanPhamAPI
      .search(query)
      .then((res) => {
        setSelectedCategory(null);
        return fetchProductsWithVariants(res.data);
      })
      .catch((err) => {
        console.error("Search error:", err);
        setError("Lỗi tìm kiếm");
        setProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // ------------------------------------------------------------ 
  // 4. FILTER & SORT PRODUCTS 
  // ------------------------------------------------------------ 
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Sắp xếp theo giá tăng dần (Thấp -> Cao)
    if (sortBy === "price-asc") {
      result.sort((a, b) => {
        const priceA = a.minPrice || 0;
        const priceB = b.minPrice || 0;
        return priceA - priceB;
      });
    } 
    
    // Sắp xếp theo giá giảm dần (Cao -> Thấp)
    else if (sortBy === "price-desc") {
      result.sort((a, b) => {
        const priceA = a.minPrice || 0;
        const priceB = b.minPrice || 0;
        return priceB - priceA;
      });
    }
    
    // Sắp xếp theo tên A-Z
    else if (sortBy === "name-asc") {
      result.sort((a, b) => a.Ten.localeCompare(b.Ten));
    } 
    
    // Sắp xếp theo tên Z-A
    else if (sortBy === "name-desc") {
      result.sort((a, b) => b.Ten.localeCompare(a.Ten));
    }

    return result;
  }, [products, sortBy]);

  // ------------------------------------------------------------

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2
            data-aos="fade-down"
            className="text-5xl font-extrabold text-gray-900 mb-3"
          >
            Sản phẩm Apple chính hãng
          </h2>
          <p
            data-aos="fade-up"
            data-aos-delay="100"
            className="text-lg text-gray-600"
          >
            Khám phá bộ sưu tập đầy đủ các sản phẩm Apple mới nhất
          </p>
        </div>

        {/* Search Bar */}
        <div data-aos="fade-up" className="mb-8">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Tìm kiếm sản phẩm..."
          />
        </div>

        {/* Category Tabs fixxxxxxxxxxxxx*/}
        {!searchQuery && (
          <div data-aos="fade-up" className="mb-8">
            <CategoryTabs
              categories={categories}
              selected={selectedCategory}
              onSelect={(categoryId) => {
                setSelectedCategory(categoryId);
                navigate(`/products?category=${categoryId}`, { replace: true });
              }}
            /> 
          </div>
        )}

        {/* Controls: Sort */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="text-sm text-gray-600">
            Tìm thấy{" "}
            <span className="font-semibold text-gray-900">
              {filteredProducts.length}
            </span>{" "}
            sản phẩm
            {searchQuery && (
              <span className="ml-2">
                cho "{searchQuery}"
                <button
                  onClick={() => handleSearch("")}
                  className="ml-2 text-blue-600 hover:text-blue-700 underline"
                >
                  Xóa tìm kiếm
                </button>
              </span>
            )}
          </div>
          <SortSelect value={sortBy} onChange={setSortBy} />
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Products List */}
        {!loading && !error && (
          <div className="mt-6">
            <ProductsList products={filteredProducts} />
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📱</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Không tìm thấy sản phẩm
            </h3>
            <p className="text-gray-600">
              {searchQuery
                ? "Thử tìm kiếm với từ khóa khác"
                : "Chọn danh mục khác để xem sản phẩm"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
