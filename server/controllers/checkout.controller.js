import CheckoutService from '../services/checkout.service.js';
import MomoPaymentService from '../services/momoPayment.service.js';
import db from '../config/db.js';
import DonHang from '../models/donHang.model.js';
import GioHang from '../models/gioHang.model.js';
import BienThe from '../models/bienThe.model.js';

class CheckoutController {
  async checkout(req, res, next) {
    try {
      const {
        maTaiKhoan,
        phuongThucThanhToan,
        cartItems, // ✅ NEW: Nhận danh sách sản phẩm được chọn
      } = req.body;

      if (!maTaiKhoan || !phuongThucThanhToan) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin bắt buộc',
        });
      }

      // ✅ NEW: Nếu không có cartItems, lấy toàn bộ (fallback)
      let itemsToCheckout = cartItems;

      if (!itemsToCheckout || itemsToCheckout.length === 0) {
        try {
          const cartResult = await GioHang.getByUser(maTaiKhoan);
          itemsToCheckout = cartResult;
        } catch (err) {
          return res.status(500).json({
            success: false,
            message: 'Không thể tải giỏ hàng',
          });
        }
      }

      if (itemsToCheckout.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Giỏ hàng trống',
        });
      }

      let conn = null;

      try {
        conn = await db.getConnection();
        await conn.beginTransaction();

        // ✅ NEW: Tính tổng tiền từ sản phẩm được chọn
        const tongTien = itemsToCheckout.reduce(
          (sum, item) => sum + item.GiaTienBienThe * item.SoLuong,
          0
        );

        // 1. Kiểm tra tồn kho
        for (const item of itemsToCheckout) {
          const variant = await BienThe.getById(item.MaBienThe, conn);
          if (!variant || item.SoLuong > variant.SoLuongTonKho) {
            throw new Error(`Sản phẩm ${item.MaBienThe} không đủ tồn kho`);
          }
        }

        // 2. Tạo đơn hàng
        const maDonHang = await DonHang.createOrder(
          {
            maTaiKhoan,
            tongTien,
            phuongThucThanhToan,
          },
          conn
        );

        // 3. Tạo chi tiết đơn hàng
        for (const item of itemsToCheckout) {
          await DonHang.addOrderDetail(
            maDonHang,
            {
              maBienThe: item.MaBienThe,
              soLuong: item.SoLuong,
              giaTien: item.GiaTienBienThe,
            },
            conn
          );
        }

        // 4. COD: Trừ kho + xóa giỏ
        if (phuongThucThanhToan === 'COD') {
          for (const item of itemsToCheckout) {
            await BienThe.decreaseStock(item.MaBienThe, item.SoLuong, conn);
          }
          await GioHang.clearCart(maTaiKhoan, conn);
        }

        await conn.commit();

        return res.json({
          success: true,
          data: { maDonHang },
          message: 'Đơn hàng tạo thành công',
        });
      } catch (error) {
        if (conn) await conn.rollback();
        console.error('[CHECKOUT] Error:', error);
        return res.status(500).json({
          success: false,
          message: error.message || 'Thanh toán thất bại',
        });
      } finally {
        if (conn) conn.release();
      }
    } catch (error) {
      next(error);
    }
  }
}

export default new CheckoutController();
