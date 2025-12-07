import db from '../config/db.js';

const LoaiSanPham = {
    // Lấy tất cả loại sản phẩm
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT * FROM LoaiSanPham 
            WHERE TinhTrangLoaiSanPham = 1
            ORDER BY ThuTuHienThi
        `);
        return rows;
    },

    // Lấy tất cả loại sản phẩm kèm ảnh đại diện
    getAllWithImage: async () => {
        const [rows] = await db.query(`
            SELECT 
                lsp.MaLoai,
                lsp.TenLoai,
                lsp.ThuTuHienThi,
                lsp.TinhTrangLoaiSanPham,
                COALESCE(
                    (SELECT bt.DuongDanAnhBienThe 
                     FROM BienThe bt
                     JOIN SanPham sp ON bt.MaSP = sp.MaSP
                     WHERE sp.MaLoai = lsp.MaLoai 
                       AND bt.DuongDanAnhBienThe IS NOT NULL
                       AND bt.TinhTrangHoatDong = 1
                     ORDER BY bt.ThuTuHienThi
                     LIMIT 1),
                    (SELECT a.DuongDanLuuAnh
                     FROM AnhSP a
                     JOIN SanPham sp ON a.MaSP = sp.MaSP
                     WHERE sp.MaLoai = lsp.MaLoai
                     ORDER BY a.ThuTuHienThi
                     LIMIT 1)
                ) AS HinhAnh
            FROM LoaiSanPham lsp
            WHERE lsp.TinhTrangLoaiSanPham = 1
            ORDER BY lsp.ThuTuHienThi
        `);
        return rows;
    },

    // Lấy loại sản phẩm theo ID
    getById: async (id) => {
        const [rows] = await db.query(
            'SELECT * FROM LoaiSanPham WHERE MaLoai = ?', 
            [id]
        );
        return rows[0];
    },

    // Lấy loại sản phẩm theo tên (iPhone, iPad, MacBook, AirPods, Phụ kiện)
    getByName: async (tenLoai) => {
        const [rows] = await db.query(
            'SELECT * FROM LoaiSanPham WHERE TenLoai LIKE ?', 
            [`%${tenLoai}%`]
        );
        return rows[0];
    },

    // Thêm loại sản phẩm
    create: async (data) => {
        const { TenLoai, ThuTuHienThi, TinhTrangLoaiSanPham } = data;
        const [result] = await db.query(`
            INSERT INTO LoaiSanPham (TenLoai, ThuTuHienThi, TinhTrangLoaiSanPham) 
            VALUES (?, ?, ?)
        `, [TenLoai, ThuTuHienThi, TinhTrangLoaiSanPham || 1]);
        return result.insertId;
    },

    // Cập nhật loại sản phẩm
    update: async (id, data) => {
        const { TenLoai, ThuTuHienThi, TinhTrangLoaiSanPham } = data;
        const [result] = await db.query(`
            UPDATE LoaiSanPham 
            SET TenLoai=?, ThuTuHienThi=?, TinhTrangLoaiSanPham=? 
            WHERE MaLoai=?
        `, [TenLoai, ThuTuHienThi, TinhTrangLoaiSanPham, id]);
        return result.affectedRows;
    },

    // Xóa loại sản phẩm (soft delete)
    delete: async (id) => {
        const [result] = await db.query(`
            UPDATE LoaiSanPham SET TinhTrangLoaiSanPham = 0 WHERE MaLoai = ?
        `, [id]);
        return result.affectedRows;
    }
};

export default LoaiSanPham;