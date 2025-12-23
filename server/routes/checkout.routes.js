import express from "express";
import db from "../config/db.js";
import DonHang from "../models/donHang.model.js";
import BienThe from "../models/bienThe.model.js";
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

    // ✅ 1. KIỂM TRA TỒN KHO TRƯỚC KHI TẠO ĐƠN HÀNG
    for (const item of cartItems) {
      const variant = await BienThe.getById(item.MaBienThe, connection);
      if (!variant || item.SoLuong > variant.SoLuongTonKho) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: `Sản phẩm ${item.MaBienThe} không đủ tồn kho`,
        });
      }
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

    // ✅ 2. TRỪ TỒN KHO CHO COD (MOMO sẽ trừ kho sau khi callback thành công)
    if (phuongThucThanhToan === "COD") {
      for (const item of cartItems) {
        await BienThe.decreaseStock(item.MaBienThe, item.SoLuong, connection);
      }
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