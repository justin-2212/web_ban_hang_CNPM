import DonHang from '../models/donHang.model.js';

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
}

export default new DonHangController();
