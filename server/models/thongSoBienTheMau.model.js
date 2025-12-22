// server/models/thongSoBienTheMau.model.js

import db from '../config/db.js';

const ThongSoBienTheMau = {
  /**
   * Lấy tất cả thông số biến thể theo loại sản phẩm
   */
  getByCategory: async (maLoai) => {
    const [rows] = await db.query(
      `
      SELECT * FROM ThongSoBienTheMau 
      WHERE MaLoai = ? AND TinhTrangThongSoBienThe = 1
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
      SELECT tsbtm.*, lsp.TenLoai
      FROM ThongSoBienTheMau tsbtm
      LEFT JOIN LoaiSanPham lsp ON tsbtm.MaLoai = lsp.MaLoai
      ORDER BY tsbtm.MaLoai ASC, tsbtm.ThuTuHienThi ASC
      `
    );
    return rows;
  },

  /**
   * Lấy chi tiết
   */
  getById: async (maThongSoBienTheMau) => {
    const [rows] = await db.query(
      `SELECT * FROM ThongSoBienTheMau WHERE MaThongSoBienTheMau = ?`,
      [maThongSoBienTheMau]
    );
    return rows[0];
  }
};

export default ThongSoBienTheMau;
