// server/routes/giaTriBienThe.routes.js

import express from 'express';
import GiaTriBienThe from '../models/giaTriBienThe.model.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/authorization.middleware.js';

const router = express.Router();

// Lấy giá trị của biến thể
router.get('/bien-the/:maBienThe', async (req, res, next) => {
  try {
    const { maBienThe } = req.params;
    const values = await GiaTriBienThe.getByVariant(maBienThe);
    res.json({ success: true, data: values });
  } catch (error) {
    next(error);
  }
});

// Thêm giá trị (Admin only)
router.post('/', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const id = await GiaTriBienThe.create(req.body);
    res.json({ success: true, data: { maGiaTriBienThe: id } });
  } catch (error) {
    next(error);
  }
});

// Cập nhật giá trị (Admin only)
router.put('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    await GiaTriBienThe.update(id, req.body);
    res.json({ success: true, message: 'Cập nhật thành công' });
  } catch (error) {
    next(error);
  }
});

// Xóa giá trị (Admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    await GiaTriBienThe.delete(id);
    res.json({ success: true, message: 'Xóa thành công' });
  } catch (error) {
    next(error);
  }
});

export default router;
