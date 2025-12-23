// server/models/thongSoMau.model.js

import db from '../config/db.js';

const ThongSoMau = {
  /**
   * Lấy tất cả thông số mẫu theo loại sản phẩm
   */
  getByCategory: async (maLoai) => {
    const [rows] = await db.query(
      `
      SELECT DISTINCT MaThongSoMau, TenThongSo, DonVi, ThuTuHienThi, TinhTrangThongSoMau, MaLoai
      FROM ThongSoMau 
      WHERE MaLoai = ? AND TinhTrangThongSoMau = 1
      GROUP BY MaThongSoMau, TenThongSo, DonVi, ThuTuHienThi, TinhTrangThongSoMau, MaLoai
      ORDER BY ThuTuHienThi ASC
      `,
      [maLoai]
    );
    return rows;
  },

  /**
   * Lấy tất cả (cho admin)
   */
  getAll: async () => {
    const [rows] = await db.query(
      `
      SELECT tsm.*, lsp.TenLoai
      FROM ThongSoMau tsm
      LEFT JOIN LoaiSanPham lsp ON tsm.MaLoai = lsp.MaLoai
      ORDER BY tsm.MaLoai ASC, tsm.ThuTuHienThi ASC
      `
    );
    return rows;
  },

  /**
   * Lấy chi tiết
   */
  getById: async (maThongSoMau) => {
    const [rows] = await db.query(
      `SELECT * FROM ThongSoMau WHERE MaThongSoMau = ?`,
      [maThongSoMau]
    );
    return rows[0];
  }
};

export default ThongSoMau;
