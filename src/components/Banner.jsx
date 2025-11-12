// src/sections/Banner.jsx
import React from "react";
import { ArrowRight } from "lucide-react";

const Banner = () => {
  return (
    <section className="pt-20 pb-20 bg-blue-50">
      <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
        {/* Tiêu đề chính – nổi bật */}
        <h3 
          data-aos="fade-up" 
          data-aos-delay="0" 
          data-aos-offset="100" 
          className="text-3xl md:text-4xl lg:text-5xl font-semibold text-black mb-4 leading-tight"
        >
          Giảm <span className="text-apple-blue">15%</span> cho tất cả phụ kiện Apple
        </h3>

        {/* Mô tả nhỏ – tinh tế */}
        <p 
          data-aos="fade-up" 
          data-aos-delay="120" 
          data-aos-offset="100" 
          className="text-black text-lg md:text-xl mb-8 max-w-2xl mx-auto"
        >
          Chỉ áp dụng đến hết tuần này. Nhanh tay sở hữu ngay!
        </p>

        {/* Nút bấm – kiểu Apple – ĐEN + TRẮNG */}
        <button 
          data-aos="fade-up" 
          data-aos-delay="300" 
          data-aos-offset="100" 
          className="group inline-flex items-center gap-2 bg-black text-white px-7 py-3.5 rounded-full font-medium text-sm md:text-base transition-all hover:bg-gray-800 hover:shadow-xl hover:shadow-white/10 hover:scale-105"
        >
          Khám phá ngay
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Hiệu ứng nền tinh tế */}
        <div className="absolute inset-0 -z-10 opacity-20">
          <div 
            data-aos="fade" 
            data-aos-delay="450" 
            data-aos-offset="100" 
            className="absolute top-0 left-0 w-96 h-96 bg-apple-blue rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
          ></div>
          <div 
            data-aos="fade" 
            data-aos-delay="600" 
            data-aos-offset="100" 
            className="absolute bottom-0 right-0 w-80 h-80 bg-apple-blue rounded-full blur-3xl translate-x-1/3 translate-y-1/3"
          ></div>
        </div>
      </div>
    </section>
  );
};

export default Banner;