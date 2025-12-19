import React from "react";
import { Smartphone, Banknote } from "lucide-react";

export default function PaymentGuide() {
  const paymentMethods = [
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Ví điện tử Momo",
      desc: "Thanh toán an toàn qua ứng dụng Momo",
      process: [
        "Chọn phương thức thanh toán Momo",
        "Chuyển hướng đến app Momo",
        "Xác nhận giao dịch trên Momo",
        "Hoàn tất thanh toán",
      ],
      features: [
        "Thanh toán tức thì",
        "Không phí thanh toán",
        "Hoàn cashback tự động",
      ],
    },
    {
      icon: <Banknote className="w-8 h-8" />,
      title: "Thanh toán khi nhận hàng",
      desc: "COD - Giao hàng toàn Việt Nam",
      process: [
        "Đặt hàng trực tuyến",
        "Chọn phương thức COD",
        "Xác nhận đơn hàng",
        "Thanh toán trực tiếp với shipper khi nhận hàng",
      ],
      features: [
        "Không rủi ro",
        "Kiểm tra hàng trước khi thanh toán",
        "Hỗ trợ toàn quốc",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
              Hướng dẫn thanh toán
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
              Chọn phương thức thanh toán phù hợp với bạn
            </p>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-16 bg-gray-50"
          style={{ clipPath: "polygon(0 50%, 100% 0, 100% 100%, 0 100%)" }}
        ></div>
      </section>

      {/* Payment Methods */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
            {paymentMethods.map((method, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-shadow"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="text-blue-600 mb-4 text-4xl">{method.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {method.title}
                </h3>
                <p className="text-gray-600 text-base mb-6">{method.desc}</p>

                <div className="border-t pt-6 mb-6">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Quy trình thanh toán:
                  </p>
                  <ol className="space-y-2">
                    {method.process.map((step, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex gap-3">
                        <span className="font-semibold text-blue-600 flex-shrink-0">
                          {idx + 1}.
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-xs font-semibold text-gray-700 mb-2">
                    ✓ Ưu điểm:
                  </p>
                  <ul className="space-y-1">
                    {method.features.map((feature, idx) => (
                      <li key={idx} className="text-xs text-gray-600">
                        • {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Security Info */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Bảo mật giao dịch
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  ✓ Công nghệ bảo mật
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Mã hóa SSL 256-bit cho tất cả giao dịch</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Xác thực bảo mật 3D Secure</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Hỗ trợ từ Momo và các đối tác thanh toán uy tín</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Kiểm tra giao dịch 24/7</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  ✓ Quyền lợi khách hàng
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Hoàn tiền 100% nếu bị lỗi giao dịch</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Không lưu thông tin thẻ/tài khoản</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Hỗ trợ khách hàng 24/7</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Bảo mật tuyệt đối dữ liệu cá nhân</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
