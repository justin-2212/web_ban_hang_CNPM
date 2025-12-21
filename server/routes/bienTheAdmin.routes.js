// server/routes/bienTheAdmin.routes.js

import express from 'express';
import {
  getBienTheByProduct,
  getBienTheById,
  createBienThe,
  updateBienThe,
  updateStockBienThe,
  adjustStockBienThe,
  deleteBienThe,
  hardDeleteBienThe,
  toggleStatusBienThe,
  getLowStockBienThe
} from '../controllers/bienTheAdmin.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/authorization.middleware.js';

const router = express.Router();

// Tất cả routes đều yêu cầu admin
router.use(authenticateToken, requireAdmin);

// GET /api/admin/bien-the/low-stock - Danh sách tồn kho thấp
router.get('/low-stock', getLowStockBienThe);

// GET /api/admin/bien-the/product/:maSP - Lấy tất cả biến thể của sản phẩm
router.get('/product/:maSP', getBienTheByProduct);

// GET /api/admin/bien-the/:id - Chi tiết biến thể
router.get('/:id', getBienTheById);

// POST /api/admin/bien-the - Tạo biến thể mới
router.post('/', createBienThe);

// PUT /api/admin/bien-the/:id - Cập nhật biến thể
router.put('/:id', updateBienThe);

// PATCH /api/admin/bien-the/:id/stock - Cập nhật tồn kho
router.patch('/:id/stock', updateStockBienThe);

// PATCH /api/admin/bien-the/:id/adjust-stock - Điều chỉnh tồn kho
router.patch('/:id/adjust-stock', adjustStockBienThe);

// DELETE /api/admin/bien-the/:id - Xóa biến thể (soft delete)
router.delete('/:id', deleteBienThe);

// DELETE /api/admin/bien-the/:id/hard - Xóa vĩnh viễn
router.delete('/:id/hard', hardDeleteBienThe);

// PATCH /api/admin/bien-the/:id/toggle-status - Kích hoạt/Vô hiệu hóa
router.patch('/:id/toggle-status', toggleStatusBienThe);

export default router;
