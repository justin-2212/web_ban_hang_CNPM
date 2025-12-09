// src/sections/Banner.jsx
import React, { useState, useEffect } from "react";
import { ArrowRight, Tag, Clock } from "lucide-react";

const Banner = () => {
  // Logic đếm ngược giả lập (đếm ngược đến cuối ngày chẳng hạn)
  const [timeLeft, setTimeLeft] = useState({
    hours: 24,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0)
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0)
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative py-10 overflow-hidden bg-black">
      {/* Background Gradient Mesh Animation */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/30 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Badge Khuyến mãi */}
          <div
            data-aos="fade-down"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-blue-400 text-sm font-medium mb-6"
          >
            <Tag className="w-4 h-4" />
            <span>Ưu đãi giới hạn</span>
          </div>

          {/* Tiêu đề chính */}
          <h3
            data-aos="fade-up"
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight"
          >
            Giảm{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              15%
            </span>{" "}
            <br className="hidden md:block" />
            cho tất cả phụ kiện Apple
          </h3>

          {/* Mô tả & Countdown */}
          <div
            data-aos="fade-up"
            data-aos-delay="100"
            className="flex flex-col md:flex-row items-center gap-4 md:gap-8 mb-10 text-gray-400 text-lg"
          >
            <p>Chỉ áp dụng đến hết tuần này. Nhanh tay sở hữu ngay!</p>
            <div className="hidden md:block w-px h-6 bg-gray-700"></div>
            <div className="flex items-center gap-2 text-white font-mono bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-800">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>
                {String(timeLeft.hours).padStart(2, "0")}:
                {String(timeLeft.minutes).padStart(2, "0")}:
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Nút bấm Glow Effect */}
          <button
            data-aos="zoom-in"
            data-aos-delay="200"
            className="group relative px-8 py-4 bg-white text-black rounded-full font-semibold text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
          >
            <span className="flex items-center gap-2">
              Khám phá ngay
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Banner;
