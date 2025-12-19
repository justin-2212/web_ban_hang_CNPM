import express from "express";
import { sendContactEmail, sendNewsletterEmail } from "../services/email.service.js";

const router = express.Router();

// POST /api/email/send-contact
router.post("/send-contact", async (req, res) => {
  try {
    const { customerEmail, customerName, subject, message, phone } = req.body;

    // Validation
    if (!customerEmail || !customerName || !subject || !message || !phone) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return res.status(400).json({
        success: false,
        message: "Email không hợp lệ",
      });
    }

    // Gửi email
    await sendContactEmail(customerEmail, customerName, subject, message, phone);

    res.json({
      success: true,
      message: "Tin nhắn đã được gửi thành công. Vui lòng kiểm tra email của bạn.",
    });
  } catch (error) {
    console.error("Lỗi xử lý contact form:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.",
    });
  }
});

// POST /api/email/send-newsletter
router.post("/send-newsletter", async (req, res) => {
  try {
    const { email } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập email",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Email không hợp lệ",
      });
    }

    // Gửi email
    await sendNewsletterEmail(email);

    res.json({
      success: true,
      message: "Đăng ký thành công. Vui lòng kiểm tra email của bạn.",
    });
  } catch (error) {
    console.error("Lỗi xử lý newsletter:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Có lỗi xảy ra. Vui lòng thử lại sau.",
    });
  }
});

export default router;
