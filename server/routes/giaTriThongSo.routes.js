// server/routes/giaTriThongSo.routes.js

import express from 'express';
import GiaTriThongSo from '../models/giaTriThongSo.model.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/authorization.middleware.js';

const router = express.Router();

// Lấy giá trị thông số của sản phẩm
router.get('/san-pham/:maSP', async (req, res, next) => {
  try {
    const { maSP } = req.params;
    const values = await GiaTriThongSo.getByProduct(maSP);
    res.json({ success: true, data: values });
  } catch (error) {
    next(error);
  }
});

// Thêm/Cập nhật giá trị thông số (Admin only)
router.post('/', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const result = await GiaTriThongSo.upsert(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// Xóa giá trị thông số (Admin only)
router.delete('/:maSP/:maThongSoMau', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { maSP, maThongSoMau } = req.params;
    await GiaTriThongSo.delete(maSP, maThongSoMau);
    res.json({ success: true, message: 'Xóa thành công' });
  } catch (error) {
    next(error);
  }
});

export default router;
