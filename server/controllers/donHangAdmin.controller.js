// server/controllers/donHangAdmin.controller.js

import DonHang from '../models/donHang.model.js';
import db from '../config/db.js';

/**
 * Lấy tất cả đơn hàng (với filter)
 */
export const getAllOrders = async (req, res, next) => {
  try {
    const filters = {
      tinhTrangDonHang: req.query.tinhTrangDonHang,
      tinhTrangThanhToan: req.query.tinhTrangThanhToan,
      phuongThucThanhToan: req.query.phuongThucThanhToan,
      search: req.query.search,
      fromDate: req.query.fromDate,
      toDate: req.query.toDate
    };

    const orders = await DonHang.getAllAdmin(filters);

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy chi tiết đơn hàng
 */
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await DonHang.getById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật trạng thái đơn hàng
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tinhTrangDonHang } = req.body;

    if (tinhTrangDonHang === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái đơn hàng không được để trống'
      });
    }

    // Validate trạng thái (0: Đang xử lý, 1: Đang giao, 2: Đã giao, 3: Hủy)
    if (![0, 1, 2, 3].includes(parseInt(tinhTrangDonHang))) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái đơn hàng không hợp lệ'
      });
    }

    const affectedRows = await DonHang.updateOrderStatus(id, tinhTrangDonHang);

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật trạng thái đơn hàng thành công'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật trạng thái thanh toán (dành cho COD)
 */
export const updatePaymentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tinhTrangThanhToan } = req.body;

    if (tinhTrangThanhToan === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái thanh toán không được để trống'
      });
    }

    // Validate trạng thái thanh toán (0: Chưa thanh toán, 1: Thanh toán bị lỗi, 2: Đã thanh toán)
    if (![0, 1, 2].includes(parseInt(tinhTrangThanhToan))) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái thanh toán không hợp lệ'
      });
    }

    // Update trạng thái thanh toán
    const [result] = await db.query(
      `UPDATE DonHang SET TinhTrangThanhToan = ? WHERE MaDonHang = ?`,
      [tinhTrangThanhToan, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật trạng thái thanh toán thành công'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy thống kê tổng quan đơn hàng
 */
export const getOrderStats = async (req, res, next) => {
  try {
    const stats = await DonHang.getOrderStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy doanh thu theo ngày
 */
export const getRevenueByDate = async (req, res, next) => {
  try {
    const { fromDate, toDate } = req.query;

    if (!fromDate || !toDate) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp fromDate và toDate'
      });
    }

    const data = await DonHang.getRevenueByDate(fromDate, toDate);

    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy top sản phẩm bán chạy
 */
export const getTopSellingProducts = async (req, res, next) => {
  try {
    const limit = req.query.limit || 10;
    const data = await DonHang.getTopSellingProducts(limit);

    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Hủy đơn hàng (Admin có thể hủy mọi đơn)
 */
export const cancelOrder = async (req, res, next) => {
  let conn = null;
  try {
    const { id } = req.params;
    const { reason } = req.body;

    // Lấy thông tin đơn hàng
    const order = await DonHang.getById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    // Kiểm tra trạng thái (Admin chỉ có thể hủy đơn đang xử lý hoặc đang giao)
    if (![0, 1].includes(order.TinhTrangDonHang)) {
      return res.status(400).json({
        success: false,
        message: 'Không thể hủy đơn hàng đã giao hoặc đã hủy'
      });
    }

    conn = await db.getConnection();
    await conn.beginTransaction();

    try {
      // Cập nhật trạng thái thành "Hủy" (3)
      await DonHang.updateOrderStatus(id, 3);

      // ✅ Trả lại tồn kho (cho COD hoặc bất kỳ đơn nào bị hủy)
      if (order.chiTiet && order.chiTiet.length > 0) {
        const BienThe = (await import('../models/bienThe.model.js')).default;
        for (const item of order.chiTiet) {
          await BienThe.increaseStock(item.MaBienThe, item.SoLuongSanPham, conn);
        }
      }

      await conn.commit();

      // Ghi log lý do hủy (nếu cần thiết, có thể thêm trường LyDoHuy vào DB)
      console.log(`Admin hủy đơn hàng ${id}. Lý do: ${reason || 'Không có'}`);

      res.json({
        success: true,
        message: 'Hủy đơn hàng thành công'
      });
    } catch (dbError) {
      if (conn) await conn.rollback();
      throw dbError;
    }
  } catch (error) {
    next(error);
  } finally {
    if (conn) conn.release();
  }
};
