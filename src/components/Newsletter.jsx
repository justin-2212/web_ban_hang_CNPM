import React, { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/email/send-newsletter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setMessageType("success");
        setMessage("Cảm ơn bạn! Vui lòng kiểm tra email để xác nhận.");
        setEmail("");

        setTimeout(() => {
          setMessage("");
        }, 5000);
      } else {
        setMessageType("error");
        setMessage(result.message || "Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Error:", err);
      setMessageType("error");
      setMessage("Không thể gửi yêu cầu. Vui lòng kiểm tra kết nối mạng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-8 py-16 md:py-20 bg-gradient-to-br from-[#f5f5f7] to-white text-center">
      {/* Tiêu đề */}
      <h3
        data-aos="fade-up"
        data-aos-offset="80"
        className="text-3xl md:text-4xl font-semibold text-[#1d1d1f] mb-4"
      >
        Chào mừng bạn đến với Apple Store
      </h3>

      {/* Mô tả */}
      <p
        data-aos="fade-up"
        data-aos-delay="150"
        className="text-gray-600 text-lg mb-8 max-w-md mx-auto"
      >
        Đăng ký để nhận những ưu đãi độc quyền và cập nhật sản phẩm mới nhất từ
        Apple.
      </p>

      {/* Thông báo */}
      {message && (
        <div
          data-aos="fade-up"
          className={`mb-6 p-4 rounded-xl max-w-2xl mx-auto ${
            messageType === "success"
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          <p
            className={`font-medium ${
              messageType === "success"
                ? "text-green-700"
                : "text-red-700"
            }`}
          >
            {messageType === "success" ? "✓" : "✕"} {message}
          </p>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        data-aos="fade-up"
        data-aos-delay="300"
        className="flex justify-center items-center gap-0 max-w-2xl mx-auto"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Nhập email của bạn"
          className="px-5 py-3.5 w-full sm:w-72 rounded-l-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-gray-800 placeholder:text-gray-400 transition-all"
          required
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3.5 bg-[#0071e3] text-white rounded-r-full font-medium hover:bg-[#0061c3] hover:shadow-lg transition-all duration-200 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Đang gửi..." : "Đăng ký"}
        </button>
      </form>
    </section>
  );
};

export default Newsletter;