import React from "react";

const Newsletter = () => {
  return (
    <section className="px-8 py-16 md:py-20 bg-gradient-to-br from-[#f5f5f7] to-white text-center">
      {/* Tiêu đề */}
      <h3 
        data-aos="fade-up"
        data-aos-offset="80"
        className="text-3xl md:text-4xl font-semibold text-[#1d1d1f] mb-4"
      >
        Đăng ký nhận thông tin mới nhất
      </h3>

      {/* Mô tả */}
      <p 
        data-aos="fade-up"
        data-aos-delay="150"
        className="text-gray-600 text-lg mb-8 max-w-md mx-auto"
      >
        Cập nhật ưu đãi và sản phẩm Apple mới mỗi tuần!
      </p>

      {/* Form */}
      <form 
        data-aos="fade-up"
        data-aos-delay="300"
        className="flex justify-center items-center gap-0 max-w-2xl mx-auto"
      >
        <input
          type="email"
          placeholder="Nhập email của bạn"
          className="px-5 py-3.5 w-full sm:w-72 rounded-l-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-gray-800 placeholder:text-gray-400 transition-all"
          required
        />
        <button 
          type="submit"
          className="px-8 py-3.5 bg-[#0071e3] text-white rounded-r-full font-medium hover:bg-[#0061c3] hover:shadow-lg transition-all duration-200 whitespace-nowrap"
        >
          Đăng ký
        </button>
      </form>
    </section>
  );
};

export default Newsletter;