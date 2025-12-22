// server/routes/sanPhamAdmin.routes.js

import express from 'express';
import {
  getAllSanPhamAdmin,
  getSanPhamByIdAdmin,
  createSanPhamAdmin,
  updateSanPhamAdmin,
  deleteSanPhamAdmin,
  hardDeleteSanPhamAdmin,
  toggleStatusSanPhamAdmin
} from '../controllers/sanPhamAdmin.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/authorization.middleware.js';

const router = express.Router();

// Tất cả routes đều yêu cầu admin
router.use(authenticateToken, requireAdmin);

// GET /api/admin/san-pham - Danh sách sản phẩm (có filter)
router.get('/', getAllSanPhamAdmin);

// GET /api/admin/san-pham/:id - Chi tiết sản phẩm
router.get('/:id', getSanPhamByIdAdmin);

// POST /api/admin/san-pham - Tạo sản phẩm mới
router.post('/', createSanPhamAdmin);

// PUT /api/admin/san-pham/:id - Cập nhật sản phẩm
router.put('/:id', updateSanPhamAdmin);

// DELETE /api/admin/san-pham/:id - Xóa sản phẩm (soft delete)
router.delete('/:id', deleteSanPhamAdmin);

// DELETE /api/admin/san-pham/:id/hard - Xóa vĩnh viễn
router.delete('/:id/hard', hardDeleteSanPhamAdmin);

// PATCH /api/admin/san-pham/:id/toggle-status - Kích hoạt/Vô hiệu hóa
router.patch('/:id/toggle-status', toggleStatusSanPhamAdmin);

export default router;
