import express from 'express';
const router = express.Router();
import GioHang from '../models/gioHang.model.js';

// ======================
// LẤY GIỎ HÀNG THEO USER
// ======================
router.get('/:maTaiKhoan', async (req, res) => {
    try {
        const cart = await GioHang.getByUser(req.params.maTaiKhoan);
        const totalItems = await GioHang.countItems(req.params.maTaiKhoan);

        const totalPrice = cart.reduce((sum, item) => 
            sum + item.GiaTienBienThe * item.SoLuong, 
        0);

        res.json({
            success: true,
            data: { items: cart, totalItems, totalPrice }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ======================
// THÊM SẢN PHẨM VÀO GIỎ
// ======================
router.post('/', async (req, res) => {
    try {
        const { maTaiKhoan, maBienThe, soLuong } = req.body;

        if (!maTaiKhoan || !maBienThe || !soLuong) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin yêu cầu'
            });
        }

        const result = await GioHang.addItem(maTaiKhoan, maBienThe, soLuong);

        res.status(201).json({
            success: true,
            message: result.action === 'updated' 
                ? 'Đã cập nhật số lượng' 
                : 'Đã thêm vào giỏ hàng',
            data: result
        });

    } catch (err) {
        console.error('Error in POST /gio-hang:', err.message);
        res.status(400).json({ success: false, message: err.message });
    }
});

// ======================
// CẬP NHẬT SỐ LƯỢNG
// ======================
router.put('/', async (req, res) => {
    try {
        const { maTaiKhoan, maBienThe, soLuong } = req.body;

        if (!maTaiKhoan || !maBienThe) {
            return res.status(400).json({
                success: false,
                message: "Thiếu dữ liệu"
            });
        }

        if (soLuong <= 0) {
            await GioHang.removeItem(maTaiKhoan, maBienThe);
            return res.json({
                success: true,
                message: "Đã xóa sản phẩm khỏi giỏ hàng"
            });
        }

        const affected = await GioHang.updateQuantity(maTaiKhoan, maBienThe, soLuong);

        res.json({
            success: true,
            message: "Đã cập nhật số lượng",
            affected
        });

    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// ======================
// XÓA TẤT CẢ (TRƯỚC XÓA 1 SẢN PHẨM)
// ======================
router.delete('/clear/:maTaiKhoan', async (req, res) => {
    try {
        const affected = await GioHang.clearCart(req.params.maTaiKhoan);
        res.json({ success: true, message: 'Đã xóa toàn bộ giỏ hàng', affected });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ======================
// XÓA 1 SẢN PHẨM
// ======================
router.delete('/:maTaiKhoan/:maBienThe', async (req, res) => {
    try {
        const affected = await GioHang.removeItem(req.params.maTaiKhoan, req.params.maBienThe);
        res.json({ success: true, message: 'Đã xóa sản phẩm', affected });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
