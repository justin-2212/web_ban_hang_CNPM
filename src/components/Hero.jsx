import React, { useState, useEffect, useCallback } from "react";
import Slider from "react-slick";
import AOS from "aos";
import { useNavigate } from "react-router-dom";
import "aos/dist/aos.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowLeft, ArrowRight, Loader2, ChevronRight } from "lucide-react";

// Import API
import { sanPhamAPI } from "../services/api";

const Hero = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // ---------------------------
  // 1. HELPER FUNCTIONS
  // ---------------------------

  // Lấy giá thấp nhất từ danh sách biến thể để hiển thị "Giá từ..."
  const getDisplayPrice = (product) => {
    // Ưu tiên tính toán từ variants nếu có
    if (product.variants && product.variants.length > 0) {
      const prices = product.variants.map(v => Number(v.GiaTienBienThe));
      return Math.min(...prices);
    }
    // Nếu không có variants, dùng giá gốc của sản phẩm
    return Number(product.GiaTien) || 0;
  };

  // Lấy ảnh đại diện chính xác
  const getHeroImage = (product) => {
    // 1. Kiểm tra trong variants (dữ liệu bạn vừa INSERT nằm ở đây)
    // Sắp xếp theo ThuTuHienThi để lấy ảnh ưu tiên (Deep Purple)
    if (product.variants && product.variants.length > 0) {
      const sortedVariants = [...product.variants].sort((a, b) => a.ThuTuHienThi - b.ThuTuHienThi);
      // Tìm biến thể đầu tiên có ảnh
      const vImage = sortedVariants.find(v => v.DuongDanAnhBienThe)?.DuongDanAnhBienThe;
      if (vImage) return vImage;
    }
    
    // 2. Fallback: Kiểm tra mảng images (nếu bảng SanPham có ảnh riêng)
    if (product.images && product.images.length > 0) {
      return product.images[0].DuongDanLuuAnh;
    }

    // 3. Fallback: Ảnh giữ chỗ
    return "/assets/placeholder.png"; 
  };

  // ---------------------------
  // 2. FETCH DATA
  // ---------------------------
  useEffect(() => {
    const fetchHeroProducts = async () => {
      try {
        setLoading(true);
        const res = await sanPhamAPI.getAll(); 
        const allProducts = res.data || [];
        
        console.log("Dữ liệu API trả về:", allProducts); // Kiem tra xem co variants khong

        // Danh sách từ khóa để lọc sản phẩm hot
        const keywords = ["iPhone", "iPad", "MacBook", "AirPods"];
        const heroData = [];

        keywords.forEach((key) => {
          // Lọc các sản phẩm có TÊN chứa từ khóa (vd: "iPhone 14 Pro")
          const productsInCat = allProducts.filter((p) => 
            p.Ten?.toLowerCase().includes(key.toLowerCase())
          );

          if (productsInCat.length > 0) {
            // Sắp xếp giảm dần theo giá cao nhất (để lấy dòng Flagship, vd Pro Max)
            productsInCat.sort((a, b) => getDisplayPrice(b) - getDisplayPrice(a));

            // Lấy sản phẩm đầu tiên (Flagship)
            const topProduct = productsInCat[0];
            const displayPrice = getDisplayPrice(topProduct);

            heroData.push({
              id: topProduct.MaSP,
              title: topProduct.Ten,
              // Xử lý mô tả: Bỏ tag HTML và cắt ngắn
              desc: topProduct.MoTa 
                ? topProduct.MoTa.replace(/<[^>]*>?/gm, '').substring(0, 150) + "..." 
                : `Trải nghiệm ${topProduct.Ten} với công nghệ đỉnh cao.`,
              img: getHeroImage(topProduct),
              price: displayPrice,
              tag: `Hot ${key}`,
            });
          }
        });

        console.log("Dữ liệu Hero sau khi xử lý:", heroData);
        setSlides(heroData);
      } catch (error) {
        console.error("Lỗi khi tải Hero slides:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroProducts();
    AOS.init({ duration: 800, once: true });
  }, []);

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  // ---------------------------
  // 3. SLIDER SETTINGS (UI)
  // ---------------------------
  const NextArrow = useCallback(({ onClick }) => {
    if (slides.length <= 1) return null;
    return (
      <button onClick={onClick} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/30 hover:bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 group shadow-sm">
        <ArrowRight size={24} className="text-gray-800 group-hover:scale-110 transition-transform" />
      </button>
    );
  }, [slides.length]);

  const PrevArrow = useCallback(({ onClick }) => {
    if (slides.length <= 1) return null;
    return (
      <button onClick={onClick} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/30 hover:bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 group shadow-sm">
        <ArrowLeft size={24} className="text-gray-800 group-hover:scale-110 transition-transform" />
      </button>
    );
  }, [slides.length]);

  const settings = {
    dots: true,
    infinite: slides.length > 1,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    pauseOnHover: true,
    fade: true,
    cssEase: "cubic-bezier(0.87, 0, 0.13, 1)",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (_, next) => setCurrentSlide(next),
    appendDots: dots => (
      <div style={{ bottom: "30px" }}>
        <ul className="m-0 flex justify-center gap-2"> {dots} </ul>
      </div>
    ),
    customPaging: (i) => (
      <div className={`h-1.5 rounded-full transition-all duration-500 ${i === currentSlide ? 'bg-gray-800 w-8' : 'bg-gray-300 w-2 hover:bg-gray-400'}`} />
    ),
  };

  if (loading) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-[#fbfbfd]">
        <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
      </div>
    );
  }

  if (slides.length === 0) return null;

  return (
    <div id="hero" className="w-full bg-[#fbfbfd] overflow-hidden relative group/hero">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide.id} className="outline-none">
            <div className="relative w-full h-[600px] lg:h-[700px] flex items-center">
              
              <div className="container mx-auto px-6 h-full">
                <div className="flex flex-col-reverse lg:flex-row items-center justify-between h-full relative">
                  
                  {/* --- TEXT CONTENT --- */}
                  <div className="w-full lg:w-5/12 z-10 pt-8 lg:pt-0 flex flex-col items-center lg:items-start text-center lg:text-left">
                    <span 
                      data-aos="fade-down"
                      className="text-orange-600 font-bold tracking-widest uppercase text-xs mb-4"
                    >
                      {slide.tag}
                    </span>
                    
                    <h2
                      data-aos="fade-up"
                      data-aos-delay="100"
                      className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight leading-tight"
                    >
                      {slide.title}
                    </h2>
                    
                    <p
                      data-aos="fade-up"
                      data-aos-delay="200"
                      className="text-2xl md:text-3xl text-gray-800 mb-6 font-medium"
                    >
                      Giá từ {formatPrice(slide.price)}
                    </p>

                    <p
                      data-aos="fade-up"
                      data-aos-delay="300"
                      className="text-gray-500 mb-8 text-base md:text-lg max-w-md mx-auto lg:mx-0 line-clamp-2"
                    >
                      {slide.desc}
                    </p>

                    <div className="flex gap-4" data-aos="fade-up" data-aos-delay="400">
                      <button
                        onClick={() => navigate(`/products/${slide.id}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full transition-all shadow-lg hover:shadow-blue-200 font-medium flex items-center gap-2 transform hover:-translate-y-1"
                      >
                        Mua ngay <ChevronRight size={18} />
                      </button>
                      <button
                        onClick={() => navigate(`/products/${slide.id}`)}
                        className="text-blue-600 hover:text-blue-800 font-medium px-6 py-3 flex items-center gap-1 group/btn"
                      >
                        Xem chi tiết <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform"/>
                      </button>
                    </div>
                  </div>

                  {/* --- IMAGE CONTENT --- */}
                  <div className="w-full lg:w-7/12 h-[320px] lg:h-full flex items-center justify-center lg:justify-end relative pb-4 lg:pb-0">
                    <div className="absolute w-[300px] h-[300px] lg:w-[600px] lg:h-[600px] bg-gradient-to-tr from-blue-50 to-purple-50 rounded-full blur-3xl opacity-80 -z-10"></div>
                    
                    <img
                      src={slide.img}
                      alt={slide.title}
                      className="h-full w-auto object-contain max-h-[300px] lg:max-h-[580px] drop-shadow-2xl transition-transform duration-700 group-hover/hero:scale-105"
                      onError={(e) => {
                         console.log("Lỗi tải ảnh:", slide.img);
                         e.target.src = "/assets/placeholder.png";
                      }}
                    />
                  </div>

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