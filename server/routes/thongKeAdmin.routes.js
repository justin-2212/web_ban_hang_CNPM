// server/routes/thongKeAdmin.routes.js

import express from 'express';
import {
  getDashboardStats,
  getRevenueByPeriod,
  getProductStats,
  getCustomerStats,
  compareRevenue
} from '../controllers/thongKeAdmin.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/authorization.middleware.js';

const router = express.Router();

// Tất cả routes đều yêu cầu admin
router.use(authenticateToken, requireAdmin);

// GET /api/admin/thong-ke/dashboard - Tổng quan dashboard
router.get('/dashboard', getDashboardStats);

// GET /api/admin/thong-ke/revenue - Doanh thu theo khoảng thời gian
router.get('/revenue', getRevenueByPeriod);

// GET /api/admin/thong-ke/products - Thống kê sản phẩm
router.get('/products', getProductStats);

// GET /api/admin/thong-ke/customers - Thống kê khách hàng
router.get('/customers', getCustomerStats);

// GET /api/admin/thong-ke/compare - So sánh doanh thu theo kỳ
router.get('/compare', compareRevenue);

export default router;
