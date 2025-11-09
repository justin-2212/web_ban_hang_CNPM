// src/sections/Category.jsx
import React from "react";

// Import tất cả hình ảnh trước
import iphone16pro from "../assets/products/iphone/16pro.png";
import ipadProm4 from "../assets/products/ipad/ipad_prom4.jpeg";
import macAirM3 from "../assets/products/macbook/mac_airm3.jpeg";
import airpodsPro2 from "../assets/products/airpods/ap_pro2.jpeg";
import caseAccessory from "../assets/products/accessories/case.png";

// Dữ liệu danh mục – dùng biến đã import
const categories = [
  { name: "iPhone", img: iphone16pro },
  { name: "iPad", img: ipadProm4 },
  { name: "MacBook", img: macAirM3 },
  { name: "AirPods", img: airpodsPro2 },
  { name: "Phụ kiện", img: caseAccessory },
];

const Category = () => {
  return (
    <section className="w-full py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Tiêu đề – hiện trước */}
        <h3 
          data-aos="fade-up" 
          data-aos-offset="100" 
          className="text-2xl md:text-3xl font-semibold text-center mb-10 text-gray-900"
        >
          Danh mục sản phẩm
        </h3>

        {/* Grid – từng cái hiện có nhịp */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8">
          {categories.map((cat, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}        // Mỗi cái trễ 100ms
              data-aos-offset="120"               // Hiện khi còn 120px
              data-aos-once="true"                // Chỉ hiện 1 lần
              className="group cursor-pointer text-center transform transition-all duration-300 hover:scale-105"
            >
              <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden shadow-sm group-hover:shadow-xl transition-shadow">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover p-6"
                />
              </div>
              <p className="mt-3 font-medium text-gray-700 group-hover:text-apple-blue transition">
                {cat.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Category;