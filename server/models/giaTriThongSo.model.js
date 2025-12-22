// server/models/giaTriThongSo.model.js

import db from '../config/db.js';

const GiaTriThongSo = {
  /**
   * Lấy tất cả giá trị thông số của sản phẩm
   */
  getByProduct: async (maSP) => {
    const [rows] = await db.query(
      `
      SELECT DISTINCT gts.MaSP, gts.MaThongSoMau, gts.GiaTriHienThi, gts.GiaTriNhap,
             tsm.TenThongSo, tsm.DonVi, tsm.ThuTuHienThi
      FROM GiaTriThongSo gts
      LEFT JOIN ThongSoMau tsm ON gts.MaThongSoMau = tsm.MaThongSoMau
      WHERE gts.MaSP = ?
      GROUP BY gts.MaSP, gts.MaThongSoMau, gts.GiaTriHienThi, gts.GiaTriNhap, 
               tsm.TenThongSo, tsm.DonVi, tsm.ThuTuHienThi
      ORDER BY tsm.ThuTuHienThi ASC
      `,
      [maSP]
    );
    return rows;
  },

  /**
   * Thêm hoặc cập nhật giá trị thông số (UPSERT)
   */
  upsert: async (data) => {
    const { maSP, maThongSoMau, giaTriHienThi, giaTriNhap } = data;
    const [result] = await db.query(
      `
      INSERT INTO GiaTriThongSo 
      (MaSP, MaThongSoMau, GiaTriHienThi, GiaTriNhap)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        GiaTriHienThi = VALUES(GiaTriHienThi),
        GiaTriNhap = VALUES(GiaTriNhap)
      `,
      [maSP, maThongSoMau, giaTriHienThi, giaTriNhap]
    );
    return result.insertId || result.affectedRows;
  },

  /**
   * Xóa giá trị thông số
   */
  delete: async (maSP, maThongSoMau) => {
    const [result] = await db.query(
      `DELETE FROM GiaTriThongSo WHERE MaSP = ? AND MaThongSoMau = ?`,
      [maSP, maThongSoMau]
    );
    return result.affectedRows;
  },

  /**
   * Xóa tất cả thông số của sản phẩm
   */
  deleteByProduct: async (maSP) => {
    const [result] = await db.query(
      `DELETE FROM GiaTriThongSo WHERE MaSP = ?`,
      [maSP]
    );
    return result.affectedRows;
  }
};

export default GiaTriThongSo;
