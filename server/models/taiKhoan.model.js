// server/models/taiKhoan.model.js
import pool from "../config/db.js";

const TaiKhoan = {
  // 1. Tìm user bằng Gmail
  findByEmail: async (email) => {
    // Không cần try-catch ở đây, lỗi sẽ tự bắn sang Route
    const [rows] = await pool.query("SELECT * FROM TaiKhoan WHERE Gmail = ?", [
      email,
    ]);
    return rows[0];
  },

  // 2. Tạo user mới
  create: async (email, fullName, clerkId) => {
    // <--- Nhận thêm clerkId
    const [result] = await pool.query(
      // Lưu clerkId vào cột MaXacThuc
      "INSERT INTO TaiKhoan (Gmail, TenDayDu, ClerkID, Quyen, TinhTrangTaiKhoan) VALUES (?, ?, ?, 1, 1)",
      [email, fullName, clerkId]
    );
    return result.insertId;
  },

  // 3. Cập nhật thông tin
  updateInfo: async (id, soDienThoai, diaChi) => {
    const [result] = await pool.query(
      "UPDATE TaiKhoan SET SoDienThoai = ?, DiaChi = ? WHERE MaTaiKhoan = ?",
      [soDienThoai, diaChi, id]
    );
    return result.affectedRows;
  },
};

export default TaiKhoan;
