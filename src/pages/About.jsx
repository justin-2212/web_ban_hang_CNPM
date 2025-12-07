import React from "react";
import { Link } from "react-router-dom";
import { Shield, Award, Truck, HeadphonesIcon, Store, Users } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Sản phẩm chính hãng",
      description: "100% sản phẩm Apple chính hãng VN/A, đầy đủ tem, hộp, phụ kiện"
    },
    {
      icon: <Award className="w-12 h-12" />,
      title: "Bảo hành uy tín",
      description: "Bảo hành chính hãng Apple 12 tháng tại tất cả trung tâm bảo hành"
    },
    {
      icon: <Truck className="w-12 h-12" />,
      title: "Giao hàng nhanh",
      description: "Giao hàng toàn quốc, miễn phí ship cho đơn hàng từ 5 triệu"
    },
    {
      icon: <HeadphonesIcon className="w-12 h-12" />,
      title: "Hỗ trợ 24/7",
      description: "Đội ngũ tư vấn nhiệt tình, hỗ trợ khách hàng mọi lúc mọi nơi"
    }
  ];

  const stats = [
    { number: "50K+", label: "Khách hàng tin dùng" },
    { number: "100+", label: "Cửa hàng toàn quốc" },
    { number: "99%", label: "Khách hàng hài lòng" },
    { number: "10+", label: "Năm kinh nghiệm" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
              Về chúng tôi
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
              Đối tác ủy quyền chính thức của Apple tại Việt Nam, 
              mang đến trải nghiệm mua sắm sản phẩm Apple tốt nhất
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-50" 
             style={{ clipPath: 'polygon(0 50%, 100% 0, 100% 100%, 0 100%)' }}>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                data-aos="zoom-in"
                data-aos-delay={index * 100}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-extrabold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16" data-aos="fade-up">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Câu chuyện của chúng tôi
              </h2>
              <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div data-aos="fade-right">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl h-96 flex items-center justify-center shadow-2xl">
                  <Store className="w-32 h-32 text-white" />
                </div>
              </div>

              <div data-aos="fade-left" className="space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Được thành lập từ năm 2014, chúng tôi tự hào là một trong những đối tác 
                  ủy quyền chính thức của Apple tại Việt Nam.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Với hơn 10 năm kinh nghiệm trong ngành, chúng tôi cam kết mang đến 
                  cho khách hàng những sản phẩm Apple chính hãng với giá tốt nhất 
                  cùng dịch vụ chăm sóc khách hàng tận tâm.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Hệ thống cửa hàng trải rộng khắp cả nước, đội ngũ nhân viên được 
                  đào tạo bài bản bởi Apple, chúng tôi luôn sẵn sàng tư vấn và hỗ trợ 
                  bạn tìm được sản phẩm phù hợp nhất.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tại sao chọn chúng tôi?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Cam kết mang đến trải nghiệm mua sắm tuyệt vời nhất
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100"
              >
                <div className="text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
            <Users className="w-20 h-20 mx-auto mb-6 text-blue-400" />
            <h2 className="text-4xl font-bold mb-6">
              Đội ngũ của chúng tôi
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Với hơn 500 nhân viên được đào tạo chuyên nghiệp bởi Apple, 
              chúng tôi cam kết mang đến dịch vụ tư vấn và chăm sóc khách hàng 
              tốt nhất. Mỗi thành viên trong đội ngũ đều là những chuyên gia 
              am hiểu sâu sắc về sản phẩm Apple.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center" data-aos="zoom-in">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Sẵn sàng trải nghiệm?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Ghé thăm cửa hàng gần nhất hoặc mua sắm trực tuyến ngay hôm nay
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Khám phá sản phẩm
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-300 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all"
              >
                Liên hệ với chúng tôi
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}