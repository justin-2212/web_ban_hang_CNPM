// server/routes/anhSP.routes.js

import express from 'express';
import AnhSP from '../models/anhSP.model.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/authorization.middleware.js';

const router = express.Router();

// Lấy tất cả ảnh của sản phẩm
router.get('/san-pham/:maSP', async (req, res, next) => {
  try {
    const { maSP } = req.params;
    const images = await AnhSP.getByProduct(maSP);
    res.json({ success: true, data: images });
  } catch (error) {
    next(error);
  }
});

// Thêm ảnh mới (Admin only)
router.post('/', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { maSP, duongDanLuuAnh, thuTuHienThi } = req.body;
    const id = await AnhSP.create(maSP, duongDanLuuAnh, thuTuHienThi);
    res.json({ success: true, data: { maAnhSP: id } });
  } catch (error) {
    next(error);
  }
});

// Xóa ảnh (Admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    await AnhSP.delete(id);
    res.json({ success: true, message: 'Xóa ảnh thành công' });
  } catch (error) {
    next(error);
  }
});

// Cập nhật thứ tự (Admin only)
router.put('/:id/order', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { thuTuHienThi } = req.body;
    await AnhSP.updateOrder(id, thuTuHienThi);
    res.json({ success: true, message: 'Cập nhật thứ tự thành công' });
  } catch (error) {
    next(error);
  }
});

export default router;
