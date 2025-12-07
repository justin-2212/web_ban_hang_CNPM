import React from "react";

const products = [
  { name: "iPhone 17 Pro Max", price: "$1399", img: "/assets/products/iphone/17prm.jpg" },
  { name: "MacBook Air M3", price: "$1499", img: "/assets/products/macbook/mac_airm3.jpeg" },
  { name: "iPad Pro M4", price: "$999", img: "/assets/products/ipad/ipad_prom4.jpeg" },
  { name: "AirPods Pro 2", price: "$249", img: "/assets/products/airpods/ap_pro2.jpeg" },
];

const ProductsGrid = () => (
  <section className="pt-20 pb-20 bg-blue-50">
    {/* Tiêu đề */}
    <h3
      data-aos="fade-up"
      className="text-2xl md:text-3xl font-extrabold text-center mb-10 text-red"
    >
      Sản phẩm nổi bật
    </h3>

    {/* Lưới sản phẩm */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-6 md:px-12 max-w-7xl mx-auto">
      {products.map((p, i) => (
        <div
          key={i}
          data-aos="zoom-in"
          data-aos-delay={i * 100}
          className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-md 
                     hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 
                     flex flex-col items-center text-center p-6"
        >
          {/* Hình sản phẩm */}
          <div className="relative w-full h-52 flex justify-center items-center mb-4">
            <img
              src={p.img}
              alt={p.name}
              className="w-44 h-44 object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Tên + Giá */}
          <h4 className="font-semibold text-gray-900 text-lg">{p.name}</h4>
          <p className="text-blue-600 font-medium mt-1">{p.price}</p>

          {/* Button */}
          <button
            className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white 
                       px-5 py-2 rounded-full font-medium hover:opacity-90 
                       active:scale-95 transition-transform duration-150"
          >
            Thêm vào giỏ
          </button>
        </div>
      ))}
    </div>
  </section>
);

export default ProductsGrid;
