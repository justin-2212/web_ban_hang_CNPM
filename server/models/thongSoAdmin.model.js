// server/models/thongSoAdmin.model.js
import pool from "../config/db.js";

// --- XỬ LÝ BẢNG THÔNG SỐ MẪU (Kỹ thuật) ---
export const ThongSoMauModel = {
  // Lấy danh sách theo Loại Sản Phẩm
  getByLoai: async (maLoai) => {
    const [rows] = await pool.query(
      "SELECT * FROM ThongSoMau WHERE MaLoai = ? ORDER BY ThuTuHienThi ASC",
      [maLoai]
    );
    return rows;
  },

  // Thêm mới (Đã sửa: Thêm tham số tinhTrang và truyền đủ 5 biến vào mảng)
  create: async (ten, donVi, thuTu, tinhTrang, maLoai) => {
    const [result] = await pool.query(
      "INSERT INTO ThongSoMau (TenThongSo, DonVi, ThuTuHienThi, TinhTrangThongSoMau, MaLoai) VALUES (?, ?, ?, ?, ?)",
      [ten, donVi, thuTu, tinhTrang, maLoai]
    );
    return result.insertId;
  },

  // Ngừng hoạt động mềm (Ẩn đi)
  delete: async (id) => {
    const [result] = await pool.query(
      "UPDATE ThongSoMau SET TinhTrangThongSoMau = 0 WHERE MaThongSoMau = ?",
      [id]
    );
    return result.affectedRows;
  },
  // Cập nhật thông số (Nếu cần)
  update: async (id, ten, donVi, thuTu, tinhTrang) => {
    const [result] = await pool.query(
      "UPDATE ThongSoMau SET TenThongSo = ?, DonVi = ?, ThuTuHienThi = ?, TinhTrangThongSoMau = ? WHERE MaThongSoMau = ?",
      [ten, donVi, thuTu, tinhTrang, id]
    );
    return result.affectedRows;
  },
  // Hoạt động lại (Khôi phục)
  // --- ĐÃ SỬA LỖI Ở ĐÂY: Đổi tên bảng thành ThongSoMau ---
  restore: async (id) => {
    const [result] = await pool.query(
      "UPDATE ThongSoMau SET TinhTrangThongSoMau = 1 WHERE MaThongSoMau = ?",
      [id]
    );
    return result.affectedRows;
  },
};

// --- XỬ LÝ BẢNG THÔNG SỐ BIẾN THỂ MẪU (Bán hàng) ---
export const ThongSoBienTheModel = {
  // Lấy danh sách
  getByLoai: async (maLoai) => {
    const [rows] = await pool.query(
      "SELECT * FROM ThongSoBienTheMau WHERE MaLoai = ? ORDER BY ThuTuHienThi ASC",
      [maLoai]
    );
    return rows;
  },

  // Thêm mới (Đã sửa: Thêm tham số tinhTrang)
  create: async (ten, donVi, thuTu, tinhTrang, maLoai) => {
    const [result] = await pool.query(
      "INSERT INTO ThongSoBienTheMau (TenThongSoBienThe, DonVi, ThuTuHienThi, TinhTrangThongSoBienThe, MaLoai) VALUES (?, ?, ?, ?, ?)",
      [ten, donVi, thuTu, tinhTrang, maLoai]
    );
    return result.insertId;
  },

  // Xóa mềm
  delete: async (id) => {
    const [result] = await pool.query(
      "UPDATE ThongSoBienTheMau SET TinhTrangThongSoBienThe = 0 WHERE MaThongSoBienTheMau = ?",
      [id]
    );
    return result.affectedRows;
  },

  // Khôi phục
  restore: async (id) => {
    const [result] = await pool.query(
      "UPDATE ThongSoBienTheMau SET TinhTrangThongSoBienThe = 1 WHERE MaThongSoBienTheMau = ?",
      [id]
    );
    return result.affectedRows;
  },

  // Cập nhật thông số
  update: async (id, ten, donVi, thuTu, tinhTrang) => {
    const [result] = await pool.query(
      "UPDATE ThongSoBienTheMau SET TenThongSoBienThe = ?, DonVi = ?, ThuTuHienThi = ?, TinhTrangThongSoBienThe = ? WHERE MaThongSoBienTheMau = ?",
      [ten, donVi, thuTu, tinhTrang, id]
    );
    return result.affectedRows;
  },
};
