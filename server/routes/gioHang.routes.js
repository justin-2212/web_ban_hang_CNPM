// server/routes/gioHang.routes.js

import express from 'express';
const router = express.Router();
import GioHang from '../models/gioHang.model.js';

// GET /api/gio-hang/:maTaiKhoan - Lấy giỏ hàng của user
router.get('/:maTaiKhoan', async (req, res) => {
    try {
        const cart = await GioHang.getByUser(req.params.maTaiKhoan);
        const totalItems = await GioHang.countItems(req.params.maTaiKhoan);
        
        // Tính tổng tiền
        const totalPrice = cart.reduce((sum, item) => {
            return sum + (item.GiaTienBienThe * item.SoLuong);
        }, 0);

        res.json({ 
            success: true, 
            data: { 
                items: cart, 
                totalItems, 
                totalPrice 
            } 
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST /api/gio-hang - Thêm sản phẩm vào giỏ
router.post('/', async (req, res) => {
    try {
        const { maTaiKhoan, maBienThe, soLuong } = req.body;
        
        if (!maTaiKhoan || !maBienThe || !soLuong) {
            return res.status(400).json({ 
                success: false, 
                message: 'Thiếu thông tin bắt buộc' 
            });
        }

        const result = await GioHang.addItem(maTaiKhoan, maBienThe, soLuong);
        res.status(201).json({ 
            success: true, 
            message: result.action === 'updated' ? 'Đã cập nhật số lượng' : 'Đã thêm vào giỏ hàng',
            data: result
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// PUT /api/gio-hang - Cập nhật số lượng
router.put('/', async (req, res) => {
    try {
        const { maTaiKhoan, maBienThe, soLuong } = req.body;
        
        if (soLuong <= 0) {
            // Nếu số lượng = 0, xóa khỏi giỏ
            await GioHang.removeItem(maTaiKhoan, maBienThe);
            return res.json({ success: true, message: 'Đã xóa sản phẩm khỏi giỏ hàng' });
        }

        const affected = await GioHang.updateQuantity(maTaiKhoan, maBienThe, soLuong);
        res.json({ success: true, message: 'Đã cập nhật số lượng', affected });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// DELETE /api/gio-hang/:maTaiKhoan/:maBienThe - Xóa item
router.delete('/:maTaiKhoan/:maBienThe', async (req, res) => {
    try {
        const { maTaiKhoan, maBienThe } = req.params;
        const affected = await GioHang.removeItem(maTaiKhoan, maBienThe);
        res.json({ success: true, message: 'Đã xóa sản phẩm', affected });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// DELETE /api/gio-hang/clear/:maTaiKhoan - Xóa toàn bộ giỏ
router.delete('/clear/:maTaiKhoan', async (req, res) => {
    try {
        const affected = await GioHang.clearCart(req.params.maTaiKhoan);
        res.json({ success: true, message: 'Đã xóa toàn bộ giỏ hàng', affected });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;