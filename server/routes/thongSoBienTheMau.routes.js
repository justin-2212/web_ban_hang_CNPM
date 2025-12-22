// server/routes/thongSoBienTheMau.routes.js

import express from 'express';
import ThongSoBienTheMau from '../models/thongSoBienTheMau.model.js';

const router = express.Router();

// Lấy thông số biến thể theo loại sản phẩm
router.get('/loai/:maLoai', async (req, res, next) => {
  try {
    const { maLoai } = req.params;
    const specs = await ThongSoBienTheMau.getByCategory(maLoai);
    res.json({ success: true, data: specs });
  } catch (error) {
    next(error);
  }
});

// Lấy tất cả thông số (Admin)
router.get('/', async (req, res, next) => {
  try {
    const specs = await ThongSoBienTheMau.getAll();
    res.json({ success: true, data: specs });
  } catch (error) {
    next(error);
  }
});

export default router;
