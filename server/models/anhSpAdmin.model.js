// server/models/anhSpAdmin.model.js

import db from "../config/db.js";

const AnhSpAdmin = {
  /**
   * Lấy tất cả ảnh của sản phẩm theo MaSP
   */
  getByProduct: async (maSP) => {
    const [rows] = await db.query(
      `SELECT * FROM AnhSP WHERE MaSP = ? ORDER BY ThuTuHienThi ASC`,
      [maSP]
    );
    return rows;
  },

  /**
   * Xóa ảnh theo MaAnhSP
   */
  delete: async (maAnh) => {
    // [LOGIC MỚI] Có thể lấy đường dẫn ảnh trước khi xóa để xóa file vật lý nếu cần (nhưng ở đây ta chỉ xóa DB trước)
    const [result] = await db.query(`DELETE FROM AnhSP WHERE MaAnh = ?`, [
      maAnh,
    ]);
    return result.affectedRows;
  },

  /**
   * Cập nhật thứ tự hiển thị
   */
  updateOrder: async (maAnh, thuTuHienThi) => {
    // [UPDATE] Sửa MaAnhSP thành MaAnh cho đúng với DB
    const [result] = await db.query(
      `UPDATE AnhSP SET ThuTuHienThi = ? WHERE MaAnh = ?`,
      [thuTuHienThi, maAnh]
    );
    return result.affectedRows;
  },
};

export default AnhSpAdmin;
