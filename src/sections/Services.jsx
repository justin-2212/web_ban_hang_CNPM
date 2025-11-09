import React from "react";

const services = [
  { icon: "🚚", title: "Giao hàng miễn phí", desc: "Miễn phí vận chuyển toàn quốc." },
  { icon: "💳", title: "Thanh toán an toàn", desc: "Bảo mật mọi giao dịch của bạn." },
  { icon: "🔁", title: "Đổi trả 7 ngày", desc: "Hoàn tiền hoặc đổi sản phẩm dễ dàng." },
  { icon: "🧰", title: "Bảo hành 12 tháng", desc: "Hỗ trợ kỹ thuật nhanh chóng." },
];

const Services = () => {
  return (
    <section className="px-8 py-12 bg-gray-100">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {services.map((s, i) => (
          <div
            key={i}
            data-aos="fade-up"
            data-aos-delay={i * 120}     
            data-aos-offset="100"          
            data-aos-once="true"            
          >
            <div className="text-4xl mb-2">{s.icon}</div>
            <h4 className="font-semibold text-gray-800">{s.title}</h4>
            <p className="text-gray-600 text-sm mt-1">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;