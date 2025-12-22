// server/routes/thongSoMau.routes.js

import express from 'express';
import ThongSoMau from '../models/thongSoMau.model.js';

const router = express.Router();

// Lấy thông số mẫu theo loại sản phẩm
router.get('/loai/:maLoai', async (req, res, next) => {
  try {
    const { maLoai } = req.params;
    const specs = await ThongSoMau.getByCategory(maLoai);
    res.json({ success: true, data: specs });
  } catch (error) {
    next(error);
  }
});

// Lấy tất cả thông số (Admin)
router.get('/', async (req, res, next) => {
  try {
    const specs = await ThongSoMau.getAll();
    res.json({ success: true, data: specs });
  } catch (error) {
    next(error);
  }
});

export default router;
