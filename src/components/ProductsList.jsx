// src/components/ProductsList.jsx
import React from "react";

export default function ProductsList({ products }) {
  if (!products.length) {
    return <p className="text-center text-gray-500">Không có sản phẩm phù hợp.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {products.map((p) => (
        <div
          key={p.id}
          data-aos="zoom-in"
          data-aos-delay={p.id * 50}
          className="bg-white rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-6 flex flex-col items-center text-center"
        >
          <div className="w-full h-52 flex items-center justify-center mb-4">
            <img src={p.img} alt={p.name} className="w-44 h-44 object-contain" />
          </div>
          <h4 className="font-semibold text-gray-900 text-lg">{p.name}</h4>
          <p className="text-blue-600 font-medium mt-1">${p.price}</p>
          <button className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-full">
            Thêm vào giỏ
          </button>
        </div>
      ))}
    </div>
  );
}
