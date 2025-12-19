import React from "react";
import { Search, ShoppingCart, Truck, CheckCircle } from "lucide-react";

export default function ShoppingGuide() {
  const steps = [
    {
      number: "1",
      icon: <Search className="w-8 h-8" />,
      title: "Tìm kiếm sản phẩm",
      desc: "Duyệt danh sách sản phẩm hoặc tìm kiếm sản phẩm cụ thể",
      details: [
        "Vào mục 'Sản phẩm' hoặc 'Cửa hàng'",
        "Sử dụng thanh tìm kiếm để gõ tên sản phẩm",
        "Lọc theo danh mục: iPhone, iPad, Mac, v.v",
        "So sánh giá và thông số kỹ thuật",
      ],
    },
    {
      number: "2",
      icon: <ShoppingCart className="w-8 h-8" />,
      title: "Thêm vào giỏ hàng",
      desc: "Chọn sản phẩm và số lượng cần mua",
      details: [
        "Nhấp vào sản phẩm để xem chi tiết",
        "Chọn màu sắc, dung lượng (nếu có)",
        "Nhập số lượng cần mua",
        "Nhấn 'Thêm vào giỏ hàng'",
      ],
    },
    {
      number: "3",
      icon: <Truck className="w-8 h-8" />,
      title: "Thanh toán & Giao hàng",
      desc: "Chọn địa chỉ giao hàng và phương thức thanh toán",
      details: [
        "Vào giỏ hàng và kiểm tra lại đơn hàng",
        "Nhấp 'Tiến hành thanh toán'",
        "Nhập/xác nhận địa chỉ giao hàng",
        "Chọn phương thức thanh toán",
      ],
    },
    {
      number: "4",
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Xác nhận đơn hàng",
      desc: "Hoàn tất mua hàng và nhận xác nhận",
      details: [
        "Kiểm tra lại toàn bộ thông tin đơn hàng",
        "Nhấn 'Đặt hàng' để hoàn tất",
        "Nhận email xác nhận đơn hàng",
        "Theo dõi tình trạng đơn hàng real-time",
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
              Hướng dẫn mua hàng
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
              Các bước đơn giản để mua sắm sản phẩm Apple yêu thích của bạn
            </p>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-16 bg-gray-50"
          style={{ clipPath: "polygon(0 50%, 100% 0, 100% 100%, 0 100%)" }}
        ></div>
      </section>

      {/* Steps */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          {steps.map((step, index) => (
            <div key={index} className="mb-12" data-aos="fade-up">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* Step Info */}
                  <div className="flex-1 p-8">
                    <div className="flex items-start gap-6">
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
                        {step.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          Bước {step.number}: {step.title}
                        </h3>
                        <p className="text-gray-600 mb-4">{step.desc}</p>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 md:w-80">
                    <h4 className="font-bold text-gray-900 mb-4">Chi tiết:</h4>
                    <ul className="space-y-3">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex gap-3">
                          <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-sm">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Tips */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mt-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              💡 Mẹo hữu ích
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                "Tạo tài khoản để lưu địa chỉ giao hàng yêu thích",
                "Đăng ký nhận email để cập nhật khuyến mãi",
                "Kiểm tra mã vận chuyển để theo dõi gói hàng",
                "Liên hệ hỗ trợ nếu có bất kỳ câu hỏi nào",
              ].map((tip, index) => (
                <div key={index} className="flex gap-3">
                  <div className="text-blue-600 flex-shrink-0">✓</div>
                  <p className="text-gray-600">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
