import React from "react";
import { Shield, Clock, CheckCircle } from "lucide-react";

export default function WarrantyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
              Chính sách bảo hành
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
              Cam kết chất lượng và dịch vụ hậu mãi tốt nhất cho khách hàng
            </p>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-16 bg-gray-50"
          style={{ clipPath: "polygon(0 50%, 100% 0, 100% 100%, 0 100%)" }}
        ></div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Overview */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Tổng quan về bảo hành
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Tất cả các sản phẩm Apple tại Apple Store Việt Nam đều được bảo
              hành chính hãng từ Apple. Chúng tôi cung cấp dịch vụ bảo hành
              toàn diện với mục tiêu mang lại sự an tâm tối đa cho khách hàng.
            </p>
          </div>

          {/* Warranty Details */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Bảo hành 1 năm",
                desc: "Toàn bộ sản phẩm được bảo hành 1 năm tính từ ngày mua",
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Hỗ trợ nhanh chóng",
                desc: "Phản hồi trong 24 giờ và xử lý trong thời gian tối thiểu",
              },
              {
                icon: <CheckCircle className="w-8 h-8" />,
                title: "Chính hãng Apple",
                desc: "Sử dụng linh kiện chính hãng Apple trong mọi lần sửa chữa",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-blue-600 mb-4 flex justify-center">
                  {item.icon}
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Terms */}
          <div className="bg-white rounded-2xl shadow-lg p-8" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Điều kiện bảo hành
            </h2>

            <div className="space-y-6">
              {[
                {
                  title: "Điều kiện áp dụng bảo hành",
                  points: [
                    "Sản phẩm còn trong hạn bảo hành (12 tháng từ ngày mua)",
                    "Hóa đơn mua hàng còn hạn sử dụng",
                    "Không có dấu hiệu lỗi do người dùng gây ra",
                    "Số serial product không bị thay đổi hoặc xóa",
                  ],
                },
                {
                  title: "Trường hợp không được bảo hành",
                  points: [
                    "Hư hỏng do tác động tác dụng bên ngoài, va đập, rơi ngã",
                    "Lỗi do vận chuyển không đúng cách",
                    "Linh kiện bị ám ướt nước, chất lỏng",
                    "Sửa chữa bởi bên thứ ba không phải Apple Store",
                    "Hết hạn bảo hành hoặc không có hóa đơn",
                  ],
                },
                {
                  title: "Quy trình bảo hành",
                  points: [
                    "Bước 1: Mang sản phẩm và hóa đơn đến Apple Store",
                    "Bước 2: Kiểm tra và chẩn đoán lỗi (miễn phí)",
                    "Bước 3: Báo giá sửa chữa nếu không được bảo hành",
                    "Bước 4: Tiến hành sửa chữa hoặc thay thế",
                    "Bước 5: Bàn giao sản phẩm được sửa chữa",
                  ],
                },
              ].map((section, index) => (
                <div key={index}>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {section.title}
                  </h3>
                  <ul className="space-y-2 ml-4">
                    {section.points.map((point, idx) => (
                      <li key={idx} className="text-gray-600 flex gap-3">
                        <span className="text-blue-600 font-bold">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
