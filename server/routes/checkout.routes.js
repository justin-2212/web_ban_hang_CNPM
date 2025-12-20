import express from "express";
import db from "../config/db.js";
import DonHang from "../models/donHang.model.js";
import {
  sendOrderConfirmationCOD,
  sendOrderConfirmationMomo,
} from "../services/email.service.js";

const router = express.Router();

/**
 * POST /api/checkout
 * Tạo đơn hàng từ giỏ hàng được chọn
 */
router.post("/", async (req, res, next) => {
  const connection = await db.getConnection();

  try {
    const { maTaiKhoan, phuongThucThanhToan } = req.body;

    if (!maTaiKhoan || !phuongThucThanhToan) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin thanh toán",
      });
    }

    await connection.beginTransaction();

    // Lấy giỏ hàng của user
    const [cartItems] = await connection.query(
      `
      SELECT gct.MaBienThe, gct.SoLuong, bt.GiaTienBienThe
      FROM GioHangChiTiet gct
      JOIN BienThe bt ON gct.MaBienThe = bt.MaBienThe
      WHERE gct.MaTaiKhoan = ?
      `,
      [maTaiKhoan]
    );

    if (cartItems.length === 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: "Giỏ hàng trống",
      });
    }

    // Tính tổng tiền
    const tongTien = cartItems.reduce(
      (sum, item) => sum + item.GiaTienBienThe * item.SoLuong,
      0
    );

    // Tạo đơn hàng
    const maDonHang = await DonHang.createOrder(
      {
        maTaiKhoan,
        tongTien,
        phuongThucThanhToan,
      },
      connection
    );

    // Thêm chi tiết đơn hàng
    for (const item of cartItems) {
      await DonHang.addOrderDetail(
        maDonHang,
        {
          maBienThe: item.MaBienThe,
          soLuong: item.SoLuong,
          giaTien: item.GiaTienBienThe,
        },
        connection
      );
    }

    // Xóa giỏ hàng
    await connection.query(
      "DELETE FROM GioHangChiTiet WHERE MaTaiKhoan = ?",
      [maTaiKhoan]
    );

    await connection.commit();

    // ✅ NEW: Lấy thông tin đơn hàng và gửi email
    const order = await DonHang.getById(maDonHang);
    const [userInfo] = await db.query(
      "SELECT Gmail, TenDayDu FROM TaiKhoan WHERE MaTaiKhoan = ?",
      [maTaiKhoan]
    );

    if (userInfo.length > 0) {
      const customerEmail = userInfo[0].Gmail;
      const customerName = userInfo[0].TenDayDu;
      const orderDetails = order.chiTiet || [];

      try {
        if (phuongThucThanhToan === "COD") {
          await sendOrderConfirmationCOD(
            customerEmail,
            customerName,
            order,
            orderDetails
          );
        } else if (phuongThucThanhToan === "ONLINE") {
          await sendOrderConfirmationMomo(
            customerEmail,
            customerName,
            order,
            orderDetails
          );
        }
      } catch (emailError) {
        console.error("Lỗi gửi email xác nhận đơn hàng:", emailError);
        // Không throw error, chỉ log
      }
    }

    res.json({
      success: true,
      message: "Tạo đơn hàng thành công",
      data: { maDonHang },
    });
  } catch (error) {
    await connection.rollback();
    console.error("Lỗi checkout:", error);
    next(error);
  } finally {
    connection.release();
  }
});

export default router;