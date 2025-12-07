import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loaiSanPhamAPI } from "../services/api";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loaiSanPhamAPI.getAllWithImages()
      .then(res => {
        setCategories(res.data || []);
      })
      .catch(err => {
        console.error("Lỗi lấy danh mục:", err);
        setCategories([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Icon mapping for categories
  const categoryIcons = {
    'iPhone': '📱',
    'iPad': '📲',
    'MacBook': '💻',
    'AirPods': '🎧',
    'Phụ kiện': '⌚'
  };

  if (loading) {
    return (
      <section className="w-full py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <h3 className="text-3xl md:text-4xl font-extrabold text-center mb-12 text-gray-900">
            Danh mục sản phẩm
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-gray-200 rounded-2xl h-48 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <h3 
          data-aos="fade-up"
          data-aos-offset="100"
          className="text-3xl md:text-4xl font-extrabold text-center mb-4 text-gray-900"
        >
          Danh mục sản phẩm
        </h3>
        <p 
          data-aos="fade-up"
          data-aos-delay="100"
          className="text-center text-gray-600 mb-12 max-w-2xl mx-auto"
        >
          Khám phá bộ sưu tập đầy đủ các sản phẩm Apple chính hãng
        </p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {categories.map((cat, index) => {
            const icon = categoryIcons[cat.TenLoai] || '📦';
            
            return (
              <Link
                key={cat.MaLoai}
                to={`/products?category=${cat.MaLoai}`}
                data-aos="zoom-in"
                data-aos-delay={index * 100}
                data-aos-offset="120"
                data-aos-once="true"
                className="group cursor-pointer text-center transform transition-all duration-300 hover:-translate-y-2"
              >
                {/* Card */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-md group-hover:shadow-2xl transition-all duration-300 border border-gray-100">
                  {/* Image Container */}
                  <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 p-6 relative overflow-hidden">
                    {/* Background Icon */}
                    <div className="absolute -bottom-4 -right-4 text-8xl opacity-5 group-hover:opacity-10 transition-opacity">
                      {icon}
                    </div>
                    
                    {/* Product Image */}
                    <img
                      src={cat.HinhAnh || "/assets/placeholder.png"}
                      alt={cat.TenLoai}
                      className="w-full h-full object-contain relative z-10 transform group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "/assets/placeholder.png";
                      }}
                    />
                  </div>

                  {/* Category Name */}
                  <div className="p-4 bg-white">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-2xl">{icon}</span>
                      <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {cat.TenLoai}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Xem tất cả →
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Category;