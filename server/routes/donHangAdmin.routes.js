// server/routes/donHangAdmin.routes.js

import express from 'express';
import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  getOrderStats,
  getRevenueByDate,
  getTopSellingProducts,
  cancelOrder
} from '../controllers/donHangAdmin.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/authorization.middleware.js';

const router = express.Router();

// Tất cả routes đều yêu cầu admin
router.use(authenticateToken, requireAdmin);

// GET /api/admin/don-hang/stats - Thống kê tổng quan
router.get('/stats', getOrderStats);

// GET /api/admin/don-hang/revenue - Doanh thu theo ngày
router.get('/revenue', getRevenueByDate);

// GET /api/admin/don-hang/top-products - Top sản phẩm bán chạy
router.get('/top-products', getTopSellingProducts);

// GET /api/admin/don-hang - Danh sách đơn hàng (có filter)
router.get('/', getAllOrders);

// GET /api/admin/don-hang/:id - Chi tiết đơn hàng
router.get('/:id', getOrderById);

// PATCH /api/admin/don-hang/:id/status - Cập nhật trạng thái đơn hàng
router.patch('/:id/status', updateOrderStatus);

// PATCH /api/admin/don-hang/:id/payment - Cập nhật trạng thái thanh toán
router.patch('/:id/payment', updatePaymentStatus);

// POST /api/admin/don-hang/:id/cancel - Hủy đơn hàng
router.post('/:id/cancel', cancelOrder);

export default router;
