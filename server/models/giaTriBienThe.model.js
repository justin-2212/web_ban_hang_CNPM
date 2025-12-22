// server/models/giaTriBienThe.model.js

import db from '../config/db.js';

const GiaTriBienThe = {
  /**
   * Lấy tất cả giá trị của biến thể
   */
  getByVariant: async (maBienThe) => {
    const [rows] = await db.query(
      `
      SELECT gtbt.*, tsbtm.TenThongSoBienThe, tsbtm.DonVi
      FROM GiaTriBienThe gtbt
      LEFT JOIN ThongSoBienTheMau tsbtm ON gtbt.MaThongSoBienTheMau = tsbtm.MaThongSoBienTheMau
      WHERE gtbt.MaBienThe = ?
      ORDER BY gtbt.ThuTuHienThi ASC
      `,
      [maBienThe]
    );
    return rows;
  },

  /**
   * Thêm giá trị cho biến thể (UPSERT - INSERT hoặc UPDATE nếu đã tồn tại)
   */
  create: async (data) => {
    const { maBienThe, maThongSoBienTheMau, giaTriHienThi, giaTriNhap, thuTuHienThi } = data;
    const [result] = await db.query(
      `
      INSERT INTO GiaTriBienThe 
      (MaBienThe, MaThongSoBienTheMau, GiaTriHienThi, GiaTriNhap, ThuTuHienThi)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        GiaTriHienThi = VALUES(GiaTriHienThi),
        GiaTriNhap = VALUES(GiaTriNhap),
        ThuTuHienThi = VALUES(ThuTuHienThi)
      `,
      [maBienThe, maThongSoBienTheMau, giaTriHienThi, giaTriNhap, thuTuHienThi]
    );
    return result.insertId;
  },

  /**
   * Cập nhật giá trị
   */
  update: async (maGiaTriBienThe, data) => {
    const { giaTriHienThi, giaTriNhap } = data;
    const [result] = await db.query(
      `
      UPDATE GiaTriBienThe 
      SET GiaTriHienThi = ?, GiaTriNhap = ?
      WHERE MaGiaTriBienThe = ?
      `,
      [giaTriHienThi, giaTriNhap, maGiaTriBienThe]
    );
    return result.affectedRows;
  },

  /**
   * Xóa giá trị
   */
  delete: async (maGiaTriBienThe) => {
    const [result] = await db.query(
      `DELETE FROM GiaTriBienThe WHERE MaGiaTriBienThe = ?`,
      [maGiaTriBienThe]
    );
    return result.affectedRows;
  },

  /**
   * Xóa tất cả giá trị của biến thể
   */
  deleteByVariant: async (maBienThe) => {
    const [result] = await db.query(
      `DELETE FROM GiaTriBienThe WHERE MaBienThe = ?`,
      [maBienThe]
    );
    return result.affectedRows;
  }
};

export default GiaTriBienThe;
