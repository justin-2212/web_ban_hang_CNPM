import express from 'express';
const router = express.Router();
import SanPham from '../models/sanPham.model.js';

// GET /api/san-pham/search?q=keyword - Tìm kiếm sản phẩm (ĐẶT TRƯỚC)
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.trim() === '') {
            return res.status(400).json({ success: false, message: 'Vui lòng nhập từ khóa tìm kiếm' });
        }
        const products = await SanPham.search(q);
        res.json({ success: true, data: products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/san-pham/chi-tiet/:id - Lấy sản phẩm đầy đủ (ĐẶT TRƯỚC)
router.get('/chi-tiet/:id', async (req, res) => {
    try {
        const product = await SanPham.getWithVariants(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
        }
        res.json({ success: true, data: product });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/san-pham - Lấy tất cả sản phẩm
router.get('/', async (req, res) => {
    try {
        const products = await SanPham.getAll();
        res.json({ success: true, data: products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/san-pham/:id - Lấy sản phẩm theo ID (cơ bản)
router.get('/:id', async (req, res) => {
    try {
        const product = await SanPham.getById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
        }
        res.json({ success: true, data: product });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/san-pham/loai/:maLoai - Lấy sản phẩm theo loại (ĐẶT CUỐI)
router.get('/loai/:maLoai', async (req, res) => {
    try {
        const products = await SanPham.getByCategory(req.params.maLoai);
        res.json({ success: true, data: products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST /api/san-pham - Thêm sản phẩm mới
router.post('/', async (req, res) => {
    try {
        const insertId = await SanPham.create(req.body);
        res.status(201).json({ success: true, message: 'Thêm sản phẩm thành công', id: insertId });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// PUT /api/san-pham/:id - Cập nhật sản phẩm
router.put('/:id', async (req, res) => {
    try {
        const affected = await SanPham.update(req.params.id, req.body);
        if (affected === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
        }
        res.json({ success: true, message: 'Cập nhật thành công' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// DELETE /api/san-pham/:id - Xóa sản phẩm
router.delete('/:id', async (req, res) => {
    try {
        const affected = await SanPham.delete(req.params.id);
        if (affected === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
        }
        res.json({ success: true, message: 'Xóa thành công' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;