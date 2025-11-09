import React from "react";
import p1 from "../assets/products/iphone/16pro.png";
import p2 from "../assets/products/macbook/mac_airm3.jpeg";
import p3 from "../assets/products/ipad/ipad_prom4.jpeg";
import p4 from "../assets/products/airpods/ap_pro2.jpeg";

const products = [
  { name: "iPhone 16 Pro", price: "$1199", img: p1 },
  { name: "MacBook Air M3", price: "$1399", img: p2 },
  { name: "iPad Pro M4", price: "$999", img: p3 },
  { name: "AirPods Pro 2", price: "$249", img: p4 },
];

const ProductsGrid = () => (
  <section className="px-8 py-12 bg-gray-50">
    {/* Tiêu đề – hiện trước */}
    <h3 
      data-aos="fade-up" 
      data-aos-offset="100" 
      className="text-2xl font-semibold text-center mb-8 text-black"
    >
      Sản phẩm nổi bật
    </h3>

    {/* Grid – từng card hiện có nhịp */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {products.map((p, i) => (
        <div
          key={i}
          data-aos="fade-up"
          data-aos-delay={i * 100}        // Mỗi cái trễ 100ms
          data-aos-offset="120"           // Hiện khi còn 120px
          data-aos-once="true"            // Chỉ hiện 1 lần
          className="bg-white rounded-2xl shadow p-4 hover:shadow-lg transition"
        >
          <img
            src={p.img}
            alt={p.name}
            className="w-full h-48 object-contain mb-4"
          />
          <h4 className="font-medium text-gray-800">{p.name}</h4>
          <p className="text-gray-600">{p.price}</p>
          <button className="mt-3 bg-black text-white px-4 py-2 rounded-lg w-full">
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  </section>
);

export default ProductsGrid;