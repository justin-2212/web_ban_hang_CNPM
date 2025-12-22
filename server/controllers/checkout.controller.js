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
      
      console.log('[CHECKOUT] Received cartItems:', JSON.stringify(cartItems, null, 2));

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

        // Lấy giá từ DB
        const itemsWithPrice = await Promise.all(
          itemsToCheckout.map(async (item) => {
            const [rows] = await conn.query(`
              SELECT bt.GiaTienBienThe
              FROM bienthe bt
              WHERE bt.MaBienThe = ?
            `, [item.MaBienThe]);
            
            if (rows.length === 0) {
              throw new Error(`Không tìm thấy biến thể ${item.MaBienThe}`);
            }
            
            return {
              ...item,
              GiaTienBienThe: parseFloat(rows[0].GiaTienBienThe)
            };
          })
        );

        // Tính tổng tiền
        const tongTien = itemsWithPrice.reduce(
          (sum, item) => sum + item.GiaTienBienThe * item.SoLuong,
          0
        );

        // 1. Kiểm tra tồn kho
        for (const item of itemsWithPrice) {
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
        for (const item of itemsWithPrice) {
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

        // 4. COD: Trừ kho + xóa sản phẩm đã thanh toán khỏi giỏ
        if (phuongThucThanhToan === 'COD') {
          for (const item of itemsWithPrice) {
            await BienThe.decreaseStock(item.MaBienThe, item.SoLuong, conn);
          }
          // ✅ Chỉ xóa những sản phẩm đã thanh toán, không xóa hết giỏ
          const maBienTheList = itemsWithPrice.map(item => item.MaBienThe);
          await GioHang.removeItems(maTaiKhoan, maBienTheList, conn);
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
