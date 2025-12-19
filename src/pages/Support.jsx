import React from "react";
import { MessageSquare, Phone, Mail, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export default function Support() {
  const supportOptions = [
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Chat trực tiếp",
      desc: "Hỗ trợ từ 8:00 - 22:00 hàng ngày",
      action: "Bắt đầu chat",
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Gọi cho chúng tôi",
      desc: "Hotline: 1900 1010 (miễn phí)",
      action: "Gọi ngay",
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Gửi Email",
      desc: "support@apple.com",
      action: "Liên hệ",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Thời gian hỗ trợ",
      desc: "8:00 - 22:00 (Tất cả các ngày)",
      action: "Chi tiết",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
              Hỗ trợ khách hàng
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
              Chúng tôi luôn sẵn sàng giúp bạn giải quyết mọi vấn đề
            </p>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-16 bg-gray-50"
          style={{ clipPath: "polygon(0 50%, 100% 0, 100% 100%, 0 100%)" }}
        ></div>
      </section>

      {/* Support Options */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {supportOptions.map((option, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow text-center"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="text-blue-600 mb-4 flex justify-center">
                  {option.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {option.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{option.desc}</p>
                <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                  {option.action} →
                </button>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Các trang hỗ trợ khác
            </h2>
            <div className="grid gap-4">
              {[
                {
                  title: "Chính sách bảo hành",
                  link: "/warranty-policy",
                  desc: "Tìm hiểu về chính sách bảo hành toàn diện",
                },
                {
                  title: "Chính sách đổi trả",
                  link: "/return-policy",
                  desc: "Điều kiện và quy trình đổi trả sản phẩm",
                },
                {
                  title: "Hướng dẫn thanh toán",
                  link: "/payment-guide",
                  desc: "Hướng dẫn các phương thức thanh toán có sẵn",
                },
                {
                  title: "Hướng dẫn mua hàng",
                  link: "/shopping-guide",
                  desc: "Từng bước hướng dẫn cách mua hàng trên website",
                },
              ].map((item, index) => (
                <Link
                  key={index}
                  to={item.link}
                  className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-all hover:translate-x-1"
                >
                  <h3 className="text-lg font-bold text-blue-600 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
