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
 * ✅ Hỗ trợ thanh toán riêng từng sản phẩm
 */
router.post("/", async (req, res, next) => {
  const connection = await db.getConnection();

  try {
    const { maTaiKhoan, phuongThucThanhToan, cartItems } = req.body;

    if (!maTaiKhoan || !phuongThucThanhToan) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin thanh toán",
      });
    }

    await connection.beginTransaction();

    // ✅ NEW: Nếu có cartItems từ client -> dùng đó, nếu không -> lấy toàn bộ giỏ hàng
    let itemsToCheckout = [];

    if (cartItems && Array.isArray(cartItems) && cartItems.length > 0) {
      // Lấy giá từ DB để đảm bảo an toàn (không tin client)
      for (const item of cartItems) {
        const [rows] = await connection.query(
          `SELECT bt.GiaTienBienThe, bt.SoLuongTonKho
           FROM BienThe bt
           WHERE bt.MaBienThe = ?`,
          [item.MaBienThe]
        );
        
        if (rows.length === 0) {
          await connection.rollback();
          return res.status(400).json({
            success: false,
            message: `Không tìm thấy biến thể ${item.MaBienThe}`,
          });
        }
        
        itemsToCheckout.push({
          MaBienThe: item.MaBienThe,
          SoLuong: item.SoLuong,
          GiaTienBienThe: parseFloat(rows[0].GiaTienBienThe),
          SoLuongTonKho: rows[0].SoLuongTonKho,
        });
      }
    } else {
      // Fallback: Lấy toàn bộ giỏ hàng
      const [allCartItems] = await connection.query(
        `
        SELECT gct.MaBienThe, gct.SoLuong, bt.GiaTienBienThe, bt.SoLuongTonKho
        FROM GioHangChiTiet gct
        JOIN BienThe bt ON gct.MaBienThe = bt.MaBienThe
        WHERE gct.MaTaiKhoan = ?
        `,
        [maTaiKhoan]
      );
      itemsToCheckout = allCartItems;
    }

    if (itemsToCheckout.length === 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: "Giỏ hàng trống hoặc không có sản phẩm được chọn",
      });
    }

    // ✅ 1. KIỂM TRA TỒN KHO TRƯỚC KHI TẠO ĐƠN HÀNG
    for (const item of itemsToCheckout) {
      if (item.SoLuong > item.SoLuongTonKho) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: `Sản phẩm ${item.MaBienThe} không đủ tồn kho (còn ${item.SoLuongTonKho})`,
        });
      }
    }

    // Tính tổng tiền
    const tongTien = itemsToCheckout.reduce(
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
    for (const item of itemsToCheckout) {
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
      for (const item of itemsToCheckout) {
        await BienThe.decreaseStock(item.MaBienThe, item.SoLuong, connection);
      }
    }

    // ✅ Chỉ xóa các sản phẩm đã thanh toán khỏi giỏ hàng (không xóa hết)
    const maBienTheList = itemsToCheckout.map(item => item.MaBienThe);
    if (maBienTheList.length > 0) {
      await connection.query(
        `DELETE FROM GioHangChiTiet WHERE MaTaiKhoan = ? AND MaBienThe IN (?)`,
        [maTaiKhoan, maBienTheList]
      );
    }

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