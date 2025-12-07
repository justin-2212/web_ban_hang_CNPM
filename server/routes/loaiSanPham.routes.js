import express from 'express';
const router = express.Router();
import LoaiSanPham from '../models/loaiSanPham.model.js';

// GET /api/loai-san-pham/with-images - Lấy tất cả loại kèm ảnh
router.get('/with-images', async (req, res) => {
    try {
        const categories = await LoaiSanPham.getAllWithImage();
        res.json({ success: true, data: categories });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/loai-san-pham - Lấy tất cả loại
router.get('/', async (req, res) => {
    try {
        const categories = await LoaiSanPham.getAll();
        res.json({ success: true, data: categories });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/loai-san-pham/:id
router.get('/:id', async (req, res) => {
    try {
        const category = await LoaiSanPham.getById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy loại sản phẩm' });
        }
        res.json({ success: true, data: category });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST /api/loai-san-pham
router.post('/', async (req, res) => {
    try {
        const insertId = await LoaiSanPham.create(req.body);
        res.status(201).json({ success: true, message: 'Thêm loại sản phẩm thành công', id: insertId });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// PUT /api/loai-san-pham/:id
router.put('/:id', async (req, res) => {
    try {
        const affected = await LoaiSanPham.update(req.params.id, req.body);
        if (affected === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy loại sản phẩm' });
        }
        res.json({ success: true, message: 'Cập nhật thành công' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// DELETE /api/loai-san-pham/:id
router.delete('/:id', async (req, res) => {
    try {
        const affected = await LoaiSanPham.delete(req.params.id);
        if (affected === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy loại sản phẩm' });
        }
        res.json({ success: true, message: 'Xóa thành công' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;