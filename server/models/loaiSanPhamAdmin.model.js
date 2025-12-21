// server/models/loaiSanPhamAdmin.model.js

import pool from "../config/db.js";

const LoaiSanPhamAdmin = {
  // 1. Lấy danh sách loại sản phẩm (Admin)
  getAllAdmin: async () => {
    // Admin cần xem danh sách, có thể sắp xếp theo thứ tự hiển thị
    const [rows] = await pool.query(
      "SELECT * FROM LoaiSanPham ORDER BY ThuTuHienThi ASC"
    );
    return rows;
  },

  // 2. Lấy chi tiết 1 loại theo ID (Admin)
  getByIdAdmin: async (id) => {
    const [rows] = await pool.query(
      "SELECT * FROM LoaiSanPham WHERE MaLoai = ?",
      [id]
    );
    return rows[0];
  },

  // 3. Tạo mới loại sản phẩm (Admin)
  createAdmin: async (tenLoai, thuTuHienThi, tinhTrang) => {
    const [result] = await pool.query(
      "INSERT INTO LoaiSanPham (TenLoai, ThuTuHienThi, TinhTrangLoaiSanPham) VALUES (?, ?, ?)",
      [tenLoai, thuTuHienThi, tinhTrang]
    );
    return result.insertId;
  },

  // 4. Cập nhật loại sản phẩm (Admin)
  updateAdmin: async (id, tenLoai, thuTuHienThi, tinhTrang) => {
    const [result] = await pool.query(
      "UPDATE LoaiSanPham SET TenLoai = ?, ThuTuHienThi = ?, TinhTrangLoaiSanPham = ? WHERE MaLoai = ?",
      [tenLoai, thuTuHienThi, tinhTrang, id]
    );
    return result.affectedRows;
  },

  // 5. Xóa loại sản phẩm (Admin)
  deleteAdmin: async (id) => {
    const [result] = await pool.query(
      "UPDATE LoaiSanPham SET TinhTrangLoaiSanPham = 0 WHERE MaLoai = ?",
      [id]
    );
    return result.affectedRows;
  },
};

export default LoaiSanPhamAdmin;
