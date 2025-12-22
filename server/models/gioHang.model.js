import db from '../config/db.js';

const GioHang = {
    // ===============================
    // Lấy giỏ hàng theo user
    // ===============================
    getByUser: async (maTaiKhoan, conn) => {
        const connection = conn || db;
        const [rows] = await connection.query(`
            SELECT 
                ghct.*,
                bt.TenBienThe, bt.GiaTienBienThe, bt.DuongDanAnhBienThe, bt.SoLuongTonKho,
                sp.Ten AS TenSanPham, sp.MaSP
            FROM giohangchitiet ghct
            JOIN bienthe bt ON ghct.MaBienThe = bt.MaBienThe
            JOIN sanpham sp ON bt.MaSP = sp.MaSP
            WHERE ghct.MaTaiKhoan = ?
            ORDER BY ghct.ThoiGianThem DESC
        `, [maTaiKhoan]);
        return rows;
    },

    // ===============================
    // Lấy giỏ hàng với tổng số items
    // ===============================
    getWithTotals: async (maTaiKhoan, conn) => {
        const items = await GioHang.getByUser(maTaiKhoan, conn);
        const totalItems = items.reduce((sum, item) => sum + item.SoLuong, 0);
        const totalPrice = items.reduce(
            (sum, item) => sum + item.GiaTienBienThe * item.SoLuong,
            0
        );

        return {
            items,
            totalItems,
            totalPrice,
        };
    },

    // ===============================
    // Thêm item vào giỏ
    // ===============================
    addItem: async (maTaiKhoan, maBienThe, soLuong, conn) => {
        const connection = conn || db;

        // 1. Kiểm tra biến thể có tồn tại
        const [variant] = await connection.query(`
            SELECT MaBienThe, SoLuongTonKho 
            FROM bienthe 
            WHERE MaBienThe = ?
        `, [maBienThe]);

        if (variant.length === 0) {
            throw new Error("Biến thể sản phẩm không tồn tại");
        }

        const tonKho = variant[0].SoLuongTonKho;

        // 2. Kiểm tra đã có trong giỏ chưa
        const [existing] = await connection.query(`
            SELECT SoLuong 
            FROM giohangchitiet 
            WHERE MaTaiKhoan = ? AND MaBienThe = ?
        `, [maTaiKhoan, maBienThe]);

        if (existing.length > 0) {
            const newQuantity = existing[0].SoLuong + soLuong;

            if (newQuantity > tonKho) {
                throw new Error(`Chỉ còn ${tonKho} sản phẩm trong kho`);
            }

            const [result] = await connection.query(`
                UPDATE giohangchitiet 
                SET SoLuong = ?, ThoiGianThem = NOW()
                WHERE MaTaiKhoan = ? AND MaBienThe = ?
            `, [newQuantity, maTaiKhoan, maBienThe]);

            if (result.affectedRows === 0) {
                throw new Error("Không thể cập nhật giỏ hàng");
            }

            return { action: 'updated', affected: result.affectedRows };
        }

        // 3. Nếu chưa có → thêm mới
        if (soLuong > tonKho) {
            throw new Error(`Chỉ còn ${tonKho} sản phẩm trong kho`);
        }

        const [result] = await connection.query(`
            INSERT INTO giohangchitiet (MaTaiKhoan, MaBienThe, SoLuong, ThoiGianThem)
            VALUES (?, ?, ?, NOW())
        `, [maTaiKhoan, maBienThe, soLuong]);

        if (result.affectedRows === 0) {
            throw new Error("Không thể thêm sản phẩm vào giỏ hàng");
        }

        return { action: 'inserted', affected: result.affectedRows };
    },

    // ===============================
    // Cập nhật số lượng trong giỏ
    // ===============================
    updateQuantity: async (maTaiKhoan, maBienThe, soLuong, conn) => {
        const connection = conn || db;

        // Không cho số lượng <=0
        if (soLuong <= 0) return 0;

        // Kiểm tra tồn kho
        const [variant] = await connection.query(`
            SELECT SoLuongTonKho 
            FROM bienthe 
            WHERE MaBienThe = ?
        `, [maBienThe]);

        if (variant.length === 0) {
            throw new Error("Biến thể không tồn tại");
        }

        if (soLuong > variant[0].SoLuongTonKho) {
            throw new Error(`Chỉ còn ${variant[0].SoLuongTonKho} sản phẩm trong kho`);
        }

        const [result] = await connection.query(`
            UPDATE giohangchitiet 
            SET SoLuong = ?
            WHERE MaTaiKhoan = ? AND MaBienThe = ?
        `, [soLuong, maTaiKhoan, maBienThe]);

        return result.affectedRows;
    },

    // ===============================
    // Xóa 1 sản phẩm khỏi giỏ
    // ===============================
    removeItem: async (maTaiKhoan, maBienThe, conn) => {
        const connection = conn || db;
        const [result] = await connection.query(`
            DELETE FROM giohangchitiet 
            WHERE MaTaiKhoan = ? AND MaBienThe = ?
        `, [maTaiKhoan, maBienThe]);
        return result.affectedRows;
    },

    // ===============================
    // Xóa nhiều sản phẩm cụ thể khỏi giỏ (dùng khi checkout một phần)
    // ===============================
    removeItems: async (maTaiKhoan, maBienTheList, conn) => {
        if (!maBienTheList || maBienTheList.length === 0) return 0;
        
        const connection = conn || db;
        const placeholders = maBienTheList.map(() => '?').join(',');
        const [result] = await connection.query(`
            DELETE FROM giohangchitiet 
            WHERE MaTaiKhoan = ? AND MaBienThe IN (${placeholders})
        `, [maTaiKhoan, ...maBienTheList]);
        return result.affectedRows;
    },

    // ===============================
    // Xóa toàn bộ giỏ
    // ===============================
    clearCart: async (maTaiKhoan, conn) => {
        const connection = conn || db;
        const [result] = await connection.query(`
            DELETE FROM giohangchitiet WHERE MaTaiKhoan = ?
        `, [maTaiKhoan]);
        return result.affectedRows;
    },

    // ===============================
    // Tổng số lượng item
    // ===============================
    countItems: async (maTaiKhoan, conn) => {
        const connection = conn || db;
        const [rows] = await connection.query(`
            SELECT SUM(SoLuong) AS total 
            FROM giohangchitiet 
            WHERE MaTaiKhoan = ?
        `, [maTaiKhoan]);

        return rows[0].total || 0;
    }
};

export default GioHang;
