// server/models/taiKhoanAdmin.model.js

import db from "../config/db.js";

const TaiKhoanAdmin = {
  /**
   * Lấy tất cả tài khoản (với filter)
   */
  getAllAdmin: async (filters = {}) => {
    let query = `
      SELECT 
        MaTaiKhoan, Gmail, TenDayDu, SoDienThoai, DiaChi,
        Quyen, TinhTrangTaiKhoan
      FROM TaiKhoan
    `;

    const conditions = [];
    const params = [];

    // Lọc theo quyền
    //  Phải khác undefined VÀ khác chuỗi rỗng
    if (filters.quyen !== undefined && filters.quyen !== "") {
      conditions.push("Quyen = ?");
      params.push(filters.quyen);
    }

    // Lọc theo tình trạng
    //  Phải khác undefined VÀ khác chuỗi rỗng
    if (filters.tinhTrang !== undefined && filters.tinhTrang !== "") {
      conditions.push("TinhTrangTaiKhoan = ?");
      params.push(filters.tinhTrang);
    }
    // Tìm kiếm theo tên hoặc email
    if (filters.search) {
      conditions.push("(TenDayDu LIKE ? OR Gmail LIKE ?)");
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY MaTaiKhoan DESC";

    const [rows] = await db.query(query, params);
    return rows;
  },

  /**
   * Lấy chi tiết tài khoản
   */
  getByIdAdmin: async (maTaiKhoan) => {
    const [rows] = await db.query(
      `
      SELECT 
        MaTaiKhoan, Gmail, TenDayDu, SoDienThoai, DiaChi,
        Quyen, TinhTrangTaiKhoan, ClerkID
      FROM TaiKhoan
      WHERE MaTaiKhoan = ?
      `,
      [maTaiKhoan]
    );

    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Cập nhật quyền
   */
  updateRole: async (maTaiKhoan, quyen) => {
    const [result] = await db.query(
      `
      UPDATE TaiKhoan
      SET Quyen = ?
      WHERE MaTaiKhoan = ?
      `,
      [quyen, maTaiKhoan]
    );

    return result.affectedRows;
  },

  /**
   * Kích hoạt/Vô hiệu hóa tài khoản
   */
  toggleStatus: async (maTaiKhoan) => {
    const [result] = await db.query(
      `
      UPDATE TaiKhoan
      SET TinhTrangTaiKhoan = 1 - TinhTrangTaiKhoan
      WHERE MaTaiKhoan = ?
      `,
      [maTaiKhoan]
    );

    return result.affectedRows;
  },

  /**
   * Thống kê số lượng tài khoản
   */
  getUserStats: async () => {
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as TongTaiKhoan,
        SUM(CASE WHEN Quyen = 'Admin' THEN 1 ELSE 0 END) as Admin,
        SUM(CASE WHEN Quyen = 'User' THEN 1 ELSE 0 END) as User,
        SUM(CASE WHEN TinhTrangTaiKhoan = 1 THEN 1 ELSE 0 END) as DangHoatDong,
        SUM(CASE WHEN TinhTrangTaiKhoan = 0 THEN 1 ELSE 0 END) as VoHieuHoa
      FROM TaiKhoan
    `);

    return stats[0];
  },

  /**
   * Lấy người dùng mới theo khoảng thời gian
   */
  getNewUsers: async (fromDate, toDate) => {
    return [];
  },

  /**
   * Lấy thông tin đơn hàng của user
   */
  getUserOrders: async (maTaiKhoan) => {
    const [rows] = await db.query(
      `
      SELECT 
        MaDonHang, NgayDat, TongTien, TinhTrangDonHang, TinhTrangThanhToan, PhuongThucThanhToan
      FROM DonHang
      WHERE MaTaiKhoan = ?
      ORDER BY NgayDat DESC
      `,
      [maTaiKhoan]
    );

    return rows;
  },
};

export default TaiKhoanAdmin;
