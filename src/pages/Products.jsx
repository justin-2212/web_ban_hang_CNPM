import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { sanPhamAPI, loaiSanPhamAPI } from "../services/api";
import CategoryTabs from "../components/CategoryTabs";
import PriceRange from "../components/PriceRange";
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

  // Price range state
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000000 });

  const [sortBy, setSortBy] = useState("default");

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

    setLoading(true);
    setError(null);

    sanPhamAPI
      .getByCategory(selectedCategory)
      .then((res) => {
        setProducts(res.data);

        // Fetch variant prices to set correct min/max
        if (res.data.length > 0) {
          const fetchVariants = res.data.map((p) =>
            sanPhamAPI
              .getDetail(p.MaSP)
              .then((detail) => detail.data.variants || [])
              .catch(() => [])
          );

          Promise.all(fetchVariants).then((allVariants) => {
            const allPrices = allVariants
              .flat()
              .map((v) => v.GiaTienBienThe)
              .filter(Boolean);

            if (allPrices.length > 0) {
              setPriceRange({
                min: Math.min(...allPrices),
                max: Math.max(...allPrices),
              });
            }
          });
        }
      })
      .catch((err) => {
        console.error("Error loading products:", err);
        setError("Không thể tải sản phẩm");
      })
      .finally(() => setLoading(false));
  }, [selectedCategory, searchQuery]);

  // ------------------------------------------------------------
  // 3. SEARCH PRODUCTS
  // ------------------------------------------------------------
  const handleSearch = (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      // Reset về theo category
      if (selectedCategory) {
        sanPhamAPI
          .getByCategory(selectedCategory)
          .then((res) => setProducts(res.data))
          .catch((err) => console.error(err));
      }
      return;
    }

    setLoading(true);
    sanPhamAPI
      .search(query)
      .then((res) => {
        setProducts(res.data);
        setSelectedCategory(null); // Bỏ tab khi đang search
      })
      .catch((err) => {
        console.error("Search error:", err);
        setError("Lỗi tìm kiếm");
      })
      .finally(() => setLoading(false));
  };

  // ------------------------------------------------------------
  // 4. FILTER & SORT PRODUCTS
  // ------------------------------------------------------------
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Sort
    if (sortBy === "name-asc") {
      result.sort((a, b) => a.Ten.localeCompare(b.Ten));
    } else if (sortBy === "name-desc") {
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

        {/* Category Tabs */}
        {!searchQuery && (
          <div data-aos="fade-up" className="mb-8">
            <CategoryTabs
              categories={categories}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
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
            <ProductsList products={filteredProducts} priceRange={priceRange} />
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
