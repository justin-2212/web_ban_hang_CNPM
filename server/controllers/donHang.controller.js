import DonHang from '../models/donHang.model.js';
import db from '../config/db.js';
import {
  sendOrderConfirmationCOD,
  sendOrderConfirmationMomo,
  sendOrderCancellationEmail,
} from '../services/email.service.js';

class DonHangController {
  /**
   * Lấy chi tiết đơn hàng
   */
  async getById(req, res, next) {
    try {
      const { maDonHang } = req.params;
      const order = await DonHang.getById(maDonHang);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đơn hàng',
        });
      }

      return res.json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy danh sách đơn hàng của user
   */
  async getByUser(req, res, next) {
    try {
      const { maTaiKhoan } = req.params;
      const orders = await DonHang.getByUser(maTaiKhoan);

      return res.json({
        success: true,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cập nhật trạng thái đơn hàng
   */
  async updateStatus(req, res, next) {
    try {
      const { maDonHang } = req.params;
      const { tinhTrangDonHang } = req.body;

      if (tinhTrangDonHang === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu trạng thái đơn hàng',
        });
      }

      const affected = await DonHang.updateOrderStatus(
        maDonHang,
        tinhTrangDonHang
      );

      if (affected === 0) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đơn hàng',
        });
      }

      return res.json({
        success: true,
        message: 'Cập nhật trạng thái đơn hàng thành công',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy trạng thái thanh toán online
   */
  async getPaymentStatus(req, res, next) {
    try {
      const { maDonHang } = req.params;
      const paymentInfo = await DonHang.getPaymentInfo(maDonHang);

      return res.json({
        success: true,
        data: paymentInfo,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * ✅ NEW: Hủy đơn hàng
   */
  async cancelOrder(req, res, next) {
    try {
      const { maDonHang } = req.params;

      // Kiểm tra có thể hủy không
      const checkResult = await DonHang.canCancelOrder(maDonHang);
      if (!checkResult.canCancel) {
        return res.status(400).json({
          success: false,
          message: checkResult.reason,
        });
      }

      // Lấy thông tin đơn hàng trước khi hủy
      const order = await DonHang.getById(maDonHang);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đơn hàng',
        });
      }

      // Cập nhật trạng thái thành "Hủy" (3)
      await DonHang.updateOrderStatus(maDonHang, 3);

      // ✅ FIX: Gửi email thông báo hủy đơn hàng
      try {
        const [taiKhoan] = await db.query(
          'SELECT Gmail, TenDayDu FROM TaiKhoan WHERE MaTaiKhoan = ?',
          [order.MaTaiKhoan]
        );

        if (taiKhoan.length > 0) {
          const customerEmail = taiKhoan[0].Gmail;
          const customerName = taiKhoan[0].TenDayDu;
          await sendOrderCancellationEmail(customerEmail, customerName, order);
        }
      } catch (emailError) {
        console.error('Lỗi gửi email hủy đơn hàng:', emailError);
        // Không throw error, chỉ log
      }

      return res.json({
        success: true,
        message: 'Đơn hàng đã được hủy thành công',
        data: { maDonHang },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new DonHangController();
