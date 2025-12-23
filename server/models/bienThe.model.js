import db from "../config/db.js";

const BienThe = {
  // ===============================
  // Lấy biến thể theo ID
  // ===============================
  getById: async (maBienThe, conn) => {
    const connection = conn || db;

    const [rows] = await connection.query(
      `
      SELECT *
      FROM BienThe
      WHERE MaBienThe = ? AND TinhTrangHoatDong = 1
      `,
      [maBienThe]
    );

    return rows[0] || null;
  },

  // ===============================
  // Trừ tồn kho
  // ===============================
  decreaseStock: async (maBienThe, soLuong, conn) => {
    const connection = conn || db;

    const [result] = await connection.query(
      `
      UPDATE BienThe
      SET SoLuongTonKho = SoLuongTonKho - ?
      WHERE MaBienThe = ? AND SoLuongTonKho >= ?
      `,
      [soLuong, maBienThe, soLuong]
    );

    if (result.affectedRows === 0) {
      throw new Error("Không đủ tồn kho để trừ");
    }

    return result.affectedRows;
  },

  // ===============================
  // Trả lại tồn kho (khi hủy đơn)
  // ===============================
  increaseStock: async (maBienThe, soLuong, conn) => {
    const connection = conn || db;

    const [result] = await connection.query(
      `
      UPDATE BienThe
      SET SoLuongTonKho = SoLuongTonKho + ?
      WHERE MaBienThe = ?
      `,
      [soLuong, maBienThe]
    );

    if (result.affectedRows === 0) {
      throw new Error("Không tìm thấy biến thể để trả lại tồn kho");
    }

    return result.affectedRows;
  },
};

export default BienThe;
