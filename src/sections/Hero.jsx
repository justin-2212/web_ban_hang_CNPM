// src/sections/Hero.jsx
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import AOS from "aos";
import "aos/dist/aos.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import p1 from "../assets/products/iphone/16pro.png";
import p2 from "../assets/products/iphone/17prm.jpg";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

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

  useEffect(() => {
    AOS.refresh();
  }, [currentSlide]);

  // 🔹 Nút mũi tên phải
  const NextArrow = ({ onClick }) => {
    const isLast = currentSlide === slides.length - 1;
    // Ẩn nếu là trang cuối
    if (isLast) return null;

    return (
      <button
        onClick={onClick}
        className="absolute right-5 top-1/2 transform -translate-y-1/2 bg-white/80 shadow-md hover:bg-gray-100 p-3 rounded-full z-10 transition"
      >
        <ArrowRight size={22} />
      </button>
    );
  };

  // 🔹 Nút mũi tên trái
  const PrevArrow = ({ onClick }) => {
    const isFirst = currentSlide === 0;
    // Ẩn nếu là trang đầu
    if (isFirst) return null;

    return (
      <button
        onClick={onClick}
        className="absolute left-5 top-1/2 transform -translate-y-1/2 bg-white/80 shadow-md hover:bg-gray-100 p-3 rounded-full z-10 transition"
      >
        <ArrowLeft size={22} />
      </button>
    );
  };

  const settings = {
    dots: true,
    infinite: false, // ❗ để xác định được "đầu/cuối" chính xác
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
    <div id="hero" className="w-full flex justify-center items-center lg:h-[700px] h-[600px] overflow-hidden">
      <Slider className="w-full" {...settings}>
        {slides.map((slide) => (
          <div key={slide.id}>
            <div
              className="w-full lg:px-20 px-5 lg:h-[700px] h-[600px] flex flex-col justify-center items-start gap-10 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.img})` }}
            >
              <div data-aos="fade-up" className="max-w-xl bg-white/70 backdrop-blur-sm p-6 rounded-2xl">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  {slide.title}
                </h2>
                <p
                  data-aos="fade-up"
                  data-aos-offset="50"
                  className="text-gray-700 mb-6 text-lg"
                >
                  {slide.desc}
                </p>
                <button
                  data-aos="fade-up"
                  data-aos-offset="100"
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition font-medium"
                >
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Hero;
