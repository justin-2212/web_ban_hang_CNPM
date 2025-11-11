import React from "react";

const reviews = [
  { name: "Ngọc Thắng", text: "Sản phẩm chính hãng, đóng gói cực kỳ cẩn thận!", rating: 5 },
  { name: "Châu Phương", text: "Mua MacBook ở đây rất ưng, nhân viên hỗ trợ nhiệt tình!", rating: 5 },
  { name: "Bảo Ngọc", text: "Giá tốt, giao hàng nhanh. Sẽ ủng hộ dài lâu!", rating: 4 },
];

const Reviews = () => {
  return (
    <section className="px-8 py-12 bg-white">
      
      <h3 
        data-aos="fade-up" 
        data-aos-offset="80" 
        className="text-2xl md:text-3xl font-extrabold text-center mb-10 text-red"
      >
        Đánh giá từ khách hàng
      </h3>

      
      <div className="grid md:grid-cols-3 gap-6">
        {reviews.map((r, i) => (
          <div
            key={i}
            data-aos="fade-up"
            data-aos-delay={i * 200}          
            data-aos-offset="100"              
            data-aos-once="true"
            className="p-6 border rounded-2xl shadow-sm hover:shadow-lg transition"
          >
            <p className="text-gray-700 mb-3">“{r.text}”</p>
            <p className="font-semibold text-gray-900">{r.name}</p>
            <p className="text-yellow-500">{'⭐'.repeat(r.rating)}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Reviews;