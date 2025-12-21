// server/models/anhSP.model.js

import db from '../config/db.js';

const AnhSP = {
  /**
   * Lấy tất cả ảnh của sản phẩm
   */
  getByProduct: async (maSP) => {
    const [rows] = await db.query(
      `SELECT * FROM AnhSP WHERE MaSP = ? ORDER BY ThuTuHienThi ASC`,
      [maSP]
    );
    return rows;
  },

  /**
   * Thêm ảnh mới cho sản phẩm
   */
  create: async (maSP, duongDanLuuAnh, thuTuHienThi = 99) => {
    const [result] = await db.query(
      `INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES (?, ?, ?)`,
      [maSP, duongDanLuuAnh, thuTuHienThi]
    );
    return result.insertId;
  },

  /**
   * Xóa ảnh
   */
  delete: async (maAnhSP) => {
    const [result] = await db.query(
      `DELETE FROM AnhSP WHERE MaAnhSP = ?`,
      [maAnhSP]
    );
    return result.affectedRows;
  },

  /**
   * Xóa tất cả ảnh của sản phẩm
   */
  deleteByProduct: async (maSP) => {
    const [result] = await db.query(
      `DELETE FROM AnhSP WHERE MaSP = ?`,
      [maSP]
    );
    return result.affectedRows;
  },

  /**
   * Cập nhật thứ tự hiển thị
   */
  updateOrder: async (maAnhSP, thuTuHienThi) => {
    const [result] = await db.query(
      `UPDATE AnhSP SET ThuTuHienThi = ? WHERE MaAnhSP = ?`,
      [thuTuHienThi, maAnhSP]
    );
    return result.affectedRows;
  }
};

export default AnhSP;
