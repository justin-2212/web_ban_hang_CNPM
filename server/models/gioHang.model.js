import db from '../config/db.js';

const GioHang = {
    // Lấy giỏ hàng của user
    getByUser: async (maTaiKhoan) => {
        const [rows] = await db.query(`
            SELECT 
                ghct.*,
                bt.TenBienThe, bt.GiaTienBienThe, bt.DuongDanAnhBienThe, bt.SoLuongTonKho,
                sp.Ten AS TenSanPham, sp.MaSP
            FROM GioHangChiTiet ghct
            JOIN BienThe bt ON ghct.MaBienThe = bt.MaBienThe
            JOIN SanPham sp ON bt.MaSP = sp.MaSP
            WHERE ghct.MaTaiKhoan = ?
            ORDER BY ghct.ThoiGianThem DESC
        `, [maTaiKhoan]);
        return rows;
    },

    // Thêm sản phẩm vào giỏ
    addItem: async (maTaiKhoan, maBienThe, soLuong) => {
        // Kiểm tra đã có trong giỏ chưa
        const [existing] = await db.query(`
            SELECT * FROM GioHangChiTiet 
            WHERE MaTaiKhoan = ? AND MaBienThe = ?
        `, [maTaiKhoan, maBienThe]);

        if (existing.length > 0) {
            // Cập nhật số lượng
            const [result] = await db.query(`
                UPDATE GioHangChiTiet 
                SET SoLuong = SoLuong + ?, ThoiGianThem = NOW()
                WHERE MaTaiKhoan = ? AND MaBienThe = ?
            `, [soLuong, maTaiKhoan, maBienThe]);
            return { action: 'updated', affected: result.affectedRows };
        } else {
            // Thêm mới
            const [result] = await db.query(`
                INSERT INTO GioHangChiTiet (MaTaiKhoan, MaBienThe, SoLuong, ThoiGianThem)
                VALUES (?, ?, ?, NOW())
            `, [maTaiKhoan, maBienThe, soLuong]);
            return { action: 'inserted', affected: result.affectedRows };
        }
    },

    // Cập nhật số lượng
    updateQuantity: async (maTaiKhoan, maBienThe, soLuong) => {
        const [result] = await db.query(`
            UPDATE GioHangChiTiet 
            SET SoLuong = ?
            WHERE MaTaiKhoan = ? AND MaBienThe = ?
        `, [soLuong, maTaiKhoan, maBienThe]);
        return result.affectedRows;
    },

    // Xóa item khỏi giỏ
    removeItem: async (maTaiKhoan, maBienThe) => {
        const [result] = await db.query(`
            DELETE FROM GioHangChiTiet 
            WHERE MaTaiKhoan = ? AND MaBienThe = ?
        `, [maTaiKhoan, maBienThe]);
        return result.affectedRows;
    },

    // Xóa toàn bộ giỏ hàng
    clearCart: async (maTaiKhoan) => {
        const [result] = await db.query(`
            DELETE FROM GioHangChiTiet WHERE MaTaiKhoan = ?
        `, [maTaiKhoan]);
        return result.affectedRows;
    },

    // Đếm số item trong giỏ
    countItems: async (maTaiKhoan) => {
        const [rows] = await db.query(`
            SELECT SUM(SoLuong) as total FROM GioHangChiTiet 
            WHERE MaTaiKhoan = ?
        `, [maTaiKhoan]);
        return rows[0].total || 0;
    }
};

export default GioHang;