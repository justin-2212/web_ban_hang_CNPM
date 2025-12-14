import express from "express";
import CheckoutService from "../services/checkout.service.js";
import MomoPaymentService from "../services/momoPayment.service.js";
import DonHang from "../models/donHang.model.js";
import db from "../config/db.js";

const router = express.Router();

/**
 * POST /api/checkout
 * Body:
 * {
 *   maTaiKhoan: number,
 *   phuongThucThanhToan: "COD" | "ONLINE"
 * }
 * 
 * ✅ MOMO: TẠO ĐƠN HÀNG NGAY (TinhTrangThanhToan = 0)
 *    Chỉ cập nhật thành 1 khi callback thành công
 */
router.post("/", async (req, res) => {
  try {
    const { maTaiKhoan, phuongThucThanhToan } = req.body;

    if (!maTaiKhoan || !phuongThucThanhToan) {
      return res.status(400).json({
        message: "Thiếu thông tin checkout",
      });
    }

    if (!["COD", "ONLINE"].includes(phuongThucThanhToan)) {
      return res.status(400).json({
        message: "Phương thức thanh toán không hợp lệ",
      });
    }

    // ===== COD hoặc ONLINE: Lưu đơn hàng ngay =====
    // Khác biệt: COD = TinhTrangThanhToan 0, ONLINE = TinhTrangThanhToan 0 (chờ callback)
    const result = await CheckoutService.checkout({
      maTaiKhoan,
      phuongThucThanhToan,
    });

    console.log(`[CHECKOUT] ✅ Order #${result.maDonHang} created, Payment: ${phuongThucThanhToan}`);

    // ===== MOMO: Tạo link thanh toán =====
    if (phuongThucThanhToan === "ONLINE") {
      try {
        const backendUrl = process.env.APP_URL || "http://localhost:5000";
        const returnUrl = `${backendUrl}/api/thanh-toan/momo/callback`;

        const momoResult = await MomoPaymentService.createPaymentLink(
          result.maDonHang, // ✅ Dùng maDonHang (đã tạo) thay vì maTaiKhoan
          result.tongTien,
          returnUrl
        );

        console.log(`[CHECKOUT MOMO] Link created for order #${result.maDonHang}`);

        return res.status(201).json({
          message: "Tạo link thanh toán thành công",
          data: {
            maDonHang: result.maDonHang,
            paymentUrl: momoResult.paymentUrl,
            tongTien: result.tongTien,
          },
        });
      } catch (momoError) {
        console.error("MOMO payment error:", momoError);
        
        // ⚠️ Nếu tạo link MOMO thất bại → cập nhật đơn hàng = Hủy
        await DonHang.updateOrderStatus(result.maDonHang, 3);
        
        return res.status(400).json({
          message:
            momoError.message || "Không thể tạo link thanh toán MOMO",
        });
      }
    }

    // ===== COD: Thanh toán thành công =====
    return res.status(201).json({
      message: "Checkout thành công",
      data: {
        maDonHang: result.maDonHang,
        tongTien: result.tongTien,
      },
    });

  } catch (error) {
    console.error("Checkout error:", error);
    return res.status(400).json({
      message: error.message || "Checkout thất bại",
    });
  }
});

export default router;