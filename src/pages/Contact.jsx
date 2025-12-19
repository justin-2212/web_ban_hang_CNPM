import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Sending request to:", "http://localhost:5000/api/email/send-contact");
      console.log("Form data:", formData);
      
      // Send email via backend API
      const response = await fetch(
        "http://localhost:5000/api/email/send-contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerEmail: formData.email,
            customerName: formData.name,
            subject: formData.subject,
            message: formData.message,
            phone: formData.phone,
          }),
        }
      );

      console.log("Response status:", response.status);
      const result = await response.json();
      console.log("Response data:", result);

      if (result.success) {
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      } else {
        setError(result.message || "Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Full error:", err);
      setError("Không thể gửi tin nhắn. Vui lòng kiểm tra kết nối mạng.");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Địa chỉ",
      content: "280 An Dương Vương, phường Chợ Quán, TPHCM",
      link: "https://maps.google.com",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Điện thoại",
      content: "1900 1010",
      link: "tel:19001010",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      content: "support@apple.com",
      link: "mailto:support@apple.com",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Giờ làm việc",
      content: "8:00 - 22:00 (Tất cả các ngày)",
      link: null,
    },
  ];

  const socialLinks = [
    {
      icon: <Facebook className="w-6 h-6" />,
      name: "Facebook",
      link: "https://www.facebook.com/apple",
      color: "hover:bg-blue-600",
    },
    {
      icon: <Instagram className="w-6 h-6" />,
      name: "Instagram",
      link: "https://www.instagram.com/apple/",
      color: "hover:bg-pink-600",
    },
    {
      icon: <Youtube className="w-6 h-6" />,
      name: "YouTube",
      link: "https://www.youtube.com/@Apple",
      color: "hover:bg-red-600",
    },
  ];

  const faqLinks = [
    {
      title: "Chính sách bảo hành",
      path: "/warranty-policy",
    },
    {
      title: "Chính sách đổi trả",
      path: "/return-policy",
    },
    {
      title: "Hướng dẫn thanh toán",
      path: "/payment-guide",
    },
    {
      title: "Hướng dẫn mua hàng",
      path: "/shopping-guide",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
              Liên hệ với chúng tôi
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
            </p>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-16 bg-gray-50"
          style={{ clipPath: "polygon(0 50%, 100% 0, 100% 100%, 0 100%)" }}
        ></div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 -mt-8">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="text-blue-600 mb-4">{info.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {info.title}
                </h3>
                {info.link ? (
                  <a
                    href={info.link}
                    target={info.link.startsWith("http") ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {info.content}
                  </a>
                ) : (
                  <p className="text-gray-600">{info.content}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div data-aos="fade-right">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Gửi tin nhắn cho chúng tôi
              </h2>
              <p className="text-gray-600 mb-8">
                Điền thông tin vào form bên dưới và chúng tôi sẽ phản hồi trong
                thời gian sớm nhất
              </p>

              {submitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-green-700 font-medium">
                    ✓ Cảm ơn bạn! Tin nhắn đã được gửi thành công. Vui lòng kiểm tra email của bạn.
                  </p>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-700 font-medium">✕ {error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="0912345678"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tiêu đề *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Vấn đề cần hỗ trợ"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nội dung *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Mô tả chi tiết vấn đề của bạn..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                  {loading ? "Đang gửi..." : "Gửi tin nhắn"}
                </button>
              </form>
            </div>

            {/* Map & Social */}
            <div data-aos="fade-left" className="space-y-8">
              {/* Google Map */}
              <div className="bg-gray-200 rounded-2xl overflow-hidden shadow-lg h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3173.0017237308933!2d-122.0115469!3d37.334648!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb596e9e188fd%3A0x3b0d8391510688f0!2sApple%20Park!5e0!3m2!1svi!2s!4v1733610720000!5m2!1svi!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Store Location"
                ></iframe>
              </div>

              {/* Social Links */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Kết nối với chúng tôi
                </h3>
                <p className="text-gray-300 mb-6">
                  Theo dõi chúng tôi trên mạng xã hội để cập nhật thông tin mới
                  nhất
                </p>
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-4 bg-gray-700 text-white rounded-xl hover:scale-110 transition-all ${social.color}`}
                      aria-label={social.name}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-blue-50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Câu hỏi thường gặp
                </h3>
                <ul className="space-y-2">
                  {faqLinks.map((link, index) => (
                    <li key={index}>
                      <button
                        onClick={() => navigate(link.path)}
                        className="text-blue-600 hover:text-blue-700 hover:underline font-medium text-sm bg-none border-none p-0 cursor-pointer text-left"
                      >
                        {link.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
