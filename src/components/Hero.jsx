// src/sections/Hero.jsx
import React, { useState, useEffect, useCallback } from "react";
import Slider from "react-slick";
import AOS from "aos";
import "aos/dist/aos.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import p1 from "../assets/products/iphone/16pro.jpg";
import p2 from "../assets/products/iphone/17prm.jpg";
import { ArrowLeft, ArrowRight } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "iPhone 16 Pro — Beyond Titanium.",
    desc: "Trải nghiệm sức mạnh của A18 Pro và thiết kế titan cao cấp.",
    img: p1,
  },
  {
    id: 2,
    title: "iPhone 17 Pro Max — The Future Unfolds.",
    desc: "Khám phá công nghệ mới nhất từ Apple với hiệu năng vượt trội.",
    img: p2,
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Init AOS once
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  // Arrow components
  const NextArrow = useCallback(
    ({ onClick }) => {
      if (currentSlide === slides.length - 1) return null;
      return (
        <button
          onClick={onClick}
          className="absolute right-5 top-1/2 -translate-y-1/2 bg-white shadow-lg hover:bg-gray-100 p-3 rounded-full z-50 transition"
        >
          <ArrowRight size={22} />
        </button>
      );
    },
    [currentSlide]
  );

  const PrevArrow = useCallback(
    ({ onClick }) => {
      if (currentSlide === 0) return null;
      return (
        <button
          onClick={onClick}
          className="absolute left-5 top-1/2 -translate-y-1/2 bg-white shadow-lg hover:bg-gray-100 p-3 rounded-full z-50 transition"
        >
          <ArrowLeft size={22} />
        </button>
      );
    },
    [currentSlide]
  );

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (_, next) => setCurrentSlide(next),
  };

  return (
    <div id="hero" className="w-full bg-white overflow-hidden">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide.id}>
            <div className="relative w-full lg:h-[700px] h-[500px] flex items-center justify-start bg-white">
              {/* Ảnh iPhone – luôn sát bên phải */}
              <img
                src={slide.img}
                alt={slide.title}
                className="absolute right-0 top-0 h-full w-auto object-contain z-0"
              />

              {/* Khung chữ – bên trái, responsive */}
              <div className="relative z-10 max-w-xl lg:pl-32 md:pl-16 sm:pl-8 pl-4">
                <div
                  className="bg-gradient-to-br from-gray-50 to-gray-100/90 backdrop-blur-sm p-6 lg:p-8 rounded-2xl shadow-xl border border-gray-200"
                >
                  <h2
                    data-aos="fade-up"
                    className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight"
                  >
                    {slide.title}
                  </h2>
                  <p
                    data-aos="fade-up"
                    data-aos-delay="100"
                    className="text-gray-700 mb-6 text-base sm:text-lg"
                  >
                    {slide.desc}
                  </p>
                  <button
                    data-aos="fade-up"
                    data-aos-delay="200"
                    className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition font-medium"
                  >
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Hero;
