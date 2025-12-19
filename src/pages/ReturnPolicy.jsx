import React from "react";
import { RefreshCw, AlertCircle } from "lucide-react";

export default function ReturnPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
              Chính sách đổi trả
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
              Chúng tôi cam kết 100% hài lòng với mỗi lần mua hàng
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
            <div className="flex gap-4 items-start">
              <RefreshCw className="w-8 h-8 text-blue-600 flex-shrink-0" />
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Tổng quan chính sách đổi trả
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Apple Store cung cấp chính sách đổi trả linh hoạt và minh bạch.
                  Nếu bạn không hài lòng với sản phẩm, bạn có thể đổi trả trong
                  thời gian quy định mà không cần bất kỳ câu hỏi bổ sung nào.
                </p>
              </div>
            </div>
          </div>

          {/* Return Details */}
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
            {[
              {
                title: "Thời gian đổi trả",
                icon: <RefreshCw className="w-6 h-6" />,
                content: (
                  <div className="space-y-3">
                    <p className="text-gray-600">
                      • <strong>30 ngày:</strong> Đổi trả miễn phí cho sản phẩm
                      khó chịu hoặc không phù hợp
                    </p>
                    <p className="text-gray-600">
                      • <strong>14 ngày:</strong> Đổi sang sản phẩm khác hoặc hoàn
                      tiền
                    </p>
                    <p className="text-gray-600">
                      • <strong>Sau 30 ngày:</strong> Có thể sử dụng dịch vụ sửa
                      chữa hoặc bảo hành
                    </p>
                  </div>
                ),
              },
              {
                title: "Điều kiện đổi trả",
                icon: <AlertCircle className="w-6 h-6" />,
                content: (
                  <div className="space-y-3">
                    <p className="text-gray-600">
                      ✓ Sản phẩm còn nguyên vẹn, không bị hư hỏng
                    </p>
                    <p className="text-gray-600">
                      ✓ Còn đầy đủ hộp, phụ kiện, tài liệu hướng dẫn
                    </p>
                    <p className="text-gray-600">
                      ✓ Không có dấu vết sử dụng hoặc rất nhẹ
                    </p>
                    <p className="text-gray-600">
                      ✓ Có hóa đơn/chứng minh mua hàng từ Apple Store
                    </p>
                  </div>
                ),
              },
              {
                title: "Quy trình đổi trả",
                content: (
                  <div className="space-y-3">
                    <p className="text-gray-600">
                      <strong>Bước 1:</strong> Mang sản phẩm đến cửa hàng Apple
                      Store với hóa đơn
                    </p>
                    <p className="text-gray-600">
                      <strong>Bước 2:</strong> Kiểm tra tình trạng sản phẩm
                    </p>
                    <p className="text-gray-600">
                      <strong>Bước 3:</strong> Lựa chọn đổi sang sản phẩm khác
                      hoặc xin hoàn tiền
                    </p>
                    <p className="text-gray-600">
                      <strong>Bước 4:</strong> Hoàn tất giao dịch (hoàn tiền trong
                      5-7 ngày)
                    </p>
                  </div>
                ),
              },
              {
                title: "Trường hợp không được đổi trả",
                content: (
                  <div className="space-y-3">
                    <p className="text-gray-600">
                      ✗ Sản phẩm có dấu hiệu hư hỏng do tác động bên ngoài
                    </p>
                    <p className="text-gray-600">
                      ✗ Thiếu hộp, phụ kiện hoặc tài liệu hướng dẫn
                    </p>
                    <p className="text-gray-600">
                      ✗ Quá hạn thời gian đổi trả
                    </p>
                    <p className="text-gray-600">
                      ✗ Không có hóa đơn hoặc hóa đơn không còn hạn sử dụng
                    </p>
                  </div>
                ),
              },
            ].map((section, index) => (
              <div key={index}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-blue-600">{section.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {section.title}
                  </h3>
                </div>
                {section.content}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
