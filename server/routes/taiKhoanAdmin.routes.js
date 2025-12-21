// server/routes/taiKhoanAdmin.routes.js

import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  toggleUserStatus,
  getUserStats,
  getNewUsers,
  getUserOrders
} from '../controllers/taiKhoanAdmin.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/authorization.middleware.js';

const router = express.Router();

// Tất cả routes đều yêu cầu admin
router.use(authenticateToken, requireAdmin);

// GET /api/admin/tai-khoan/stats - Thống kê người dùng
router.get('/stats', getUserStats);

// GET /api/admin/tai-khoan/new-users - Người dùng mới theo ngày
router.get('/new-users', getNewUsers);

// GET /api/admin/tai-khoan - Danh sách tài khoản (có filter)
router.get('/', getAllUsers);

// GET /api/admin/tai-khoan/:id - Chi tiết tài khoản
router.get('/:id', getUserById);

// GET /api/admin/tai-khoan/:id/orders - Đơn hàng của user
router.get('/:id/orders', getUserOrders);

// PATCH /api/admin/tai-khoan/:id/role - Cập nhật quyền
router.patch('/:id/role', updateUserRole);

// PATCH /api/admin/tai-khoan/:id/toggle-status - Kích hoạt/Vô hiệu hóa
router.patch('/:id/toggle-status', toggleUserStatus);

export default router;
