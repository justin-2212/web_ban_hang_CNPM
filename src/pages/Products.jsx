// src/pages/Products.jsx
import React, { useMemo, useState } from "react";
import { productsData, categories } from "../data/productsData";
import CategoryTabs from "../components/CategoryTabs";
import PriceRange from "../components/PriceRange";
import SortSelect from "../components/SortSelect";
import ProductsList from "../components/ProductsList";

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState("iPhone"); // mặc định
  const prices = productsData.map((p) => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const [priceRange, setPriceRange] = useState({ min: minPrice, max: maxPrice });
  const [sortBy, setSortBy] = useState("default");

  // Filter + sort (useMemo để tối ưu)
  const filtered = useMemo(() => {
    const out = productsData
      .filter((p) => p.category === selectedCategory)
      .filter((p) => p.price >= priceRange.min && p.price <= priceRange.max);

    if (sortBy === "price-asc") {
      out.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      out.sort((a, b) => b.price - a.price);
    }
    return out;
  }, [selectedCategory, priceRange, sortBy]);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-6">
        <h2 data-aos="fade-down" className="text-4xl font-extrabold text-center text-gray-900 mb-2">
          Sản phẩm Apple chính hãng
        </h2>
        <p data-aos="fade-up" data-aos-delay="100" className="text-center text-gray-600 mb-8">
          Chọn danh mục để xem sản phẩm — kéo thanh giá để lọc theo khoảng mong muốn
        </p>

        {/* Tabs */}
        <div data-aos="fade-up" className="mb-6">
          <CategoryTabs categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />
        </div>

        {/* Controls: price range + sort */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <PriceRange
            min={minPrice}
            max={maxPrice}
            from={priceRange.min}
            to={priceRange.max}
            onChange={(r) => setPriceRange(r)}
          />
          <SortSelect value={sortBy} onChange={setSortBy} />
        </div>

        {/* Products list */}
        <div className="mt-6">
          <ProductsList products={filtered} />
        </div>
      </div>
    </div>
  );
}
