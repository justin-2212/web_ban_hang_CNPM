// server/models/donHangAdmin.model.js

import db from "../config/db.js";

const DonHangAdmin = {
  // Lấy tất cả đơn hàng với bộ lọc (Filter) - Logic copy từ getAllAdmin cũ
  getAll: async (filters = {}) => {
    let query = `
      SELECT 
        dh.*,
        tk.Gmail, tk.TenDayDu, tk.SoDienThoai, tk.DiaChi,
        COUNT(DISTINCT dhct.MaBienThe) as SoLuongSanPham
      FROM DonHang dh
      LEFT JOIN TaiKhoan tk ON dh.MaTaiKhoan = tk.MaTaiKhoan
      LEFT JOIN DonHangChiTiet dhct ON dh.MaDonHang = dhct.MaDonHang
    `;

    const conditions = [];
    const params = [];

    if (filters.tinhTrangDonHang !== undefined) {
      conditions.push("dh.TinhTrangDonHang = ?");
      params.push(filters.tinhTrangDonHang);
    }

    if (filters.tinhTrangThanhToan !== undefined) {
      conditions.push("dh.TinhTrangThanhToan = ?");
      params.push(filters.tinhTrangThanhToan);
    }

    if (filters.phuongThucThanhToan) {
      conditions.push("dh.PhuongThucThanhToan = ?");
      params.push(filters.phuongThucThanhToan);
    }

    if (filters.search) {
      conditions.push(
        "(dh.MaDonHang LIKE ? OR tk.TenDayDu LIKE ? OR tk.Gmail LIKE ?)"
      );
      params.push(
        `%${filters.search}%`,
        `%${filters.search}%`,
        `%${filters.search}%`
      );
    }

    if (filters.fromDate) {
      conditions.push("dh.NgayDat >= ?");
      params.push(filters.fromDate);
    }
    if (filters.toDate) {
      conditions.push("dh.NgayDat <= ?");
      params.push(filters.toDate);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += `
      GROUP BY dh.MaDonHang
      ORDER BY dh.NgayDat DESC
    `;

    const [rows] = await db.query(query, params);
    return rows;
  },

  //  Lấy chi tiết đơn hàng (Dùng chung logic join bảng để lấy chi tiết)
  getById: async (maDonHang) => {
    const [order] = await db.query(
      `
      SELECT 
        dh.*,
        tk.TenDayDu,
        tk.Gmail,
        tk.SoDienThoai,
        tk.DiaChi
      FROM DonHang dh
      LEFT JOIN TaiKhoan tk ON dh.MaTaiKhoan = tk.MaTaiKhoan
      WHERE dh.MaDonHang = ?
      `,
      [maDonHang]
    );

    if (order.length === 0) return null;

    // Lấy chi tiết sản phẩm
    const [details] = await db.query(
      `
      SELECT
        dhct.*,
        bt.TenBienThe,
        bt.DuongDanAnhBienThe
      FROM DonHangChiTiet dhct
      JOIN BienThe bt ON dhct.MaBienThe = bt.MaBienThe
      WHERE dhct.MaDonHang = ?
      `,
      [maDonHang]
    );

    // Lấy thông tin thanh toán online nếu có
    const [paymentInfo] = await db.query(
      `SELECT * FROM ThongTinThanhToanOnline WHERE MaDonHang = ?`,
      [maDonHang]
    );

    return {
      ...order[0],
      chiTiet: details,
      thanhToanOnline: paymentInfo.length > 0 ? paymentInfo[0] : null,
    };
  },

  // Cập nhật trạng thái đơn hàng
  updateOrderStatus: async (maDonHang, tinhTrangDonHang) => {
    const [result] = await db.query(
      `UPDATE DonHang SET TinhTrangDonHang = ? WHERE MaDonHang = ?`,
      [tinhTrangDonHang, maDonHang]
    );
    return result.affectedRows;
  },

  //  Thống kê tổng quan đơn hàng
  getOrderStats: async () => {
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as TongDonHang,
        SUM(CASE WHEN TinhTrangDonHang = 0 THEN 1 ELSE 0 END) as DangXuLy,
        SUM(CASE WHEN TinhTrangDonHang = 1 THEN 1 ELSE 0 END) as DangGiao,
        SUM(CASE WHEN TinhTrangDonHang = 2 THEN 1 ELSE 0 END) as DaGiao,
        SUM(CASE WHEN TinhTrangDonHang = 3 THEN 1 ELSE 0 END) as DaHuy,
        SUM(CASE WHEN TinhTrangThanhToan = 1 THEN TongTien ELSE 0 END) as TongDoanhThu,
        SUM(CASE WHEN TinhTrangThanhToan = 0 THEN TongTien ELSE 0 END) as ChuaThanhToan
      FROM DonHang
    `);
    return stats[0];
  },

  // Doanh thu theo ngày
  getRevenueByDate: async (fromDate, toDate) => {
    const [rows] = await db.query(
      `
      SELECT 
        DATE(NgayDat) as Ngay,
        COUNT(*) as SoDonHang,
        SUM(TongTien) as DoanhThu,
        SUM(CASE WHEN TinhTrangThanhToan = 1 THEN TongTien ELSE 0 END) as DaThanhToan
      FROM DonHang
      WHERE NgayDat BETWEEN ? AND ?
      GROUP BY DATE(NgayDat)
      ORDER BY Ngay DESC
      `,
      [fromDate, toDate]
    );
    return rows;
  },

  // Top sản phẩm bán chạy
  getTopSellingProducts: async (limit = 5) => {
    const [rows] = await db.query(
      `
      SELECT 
        bt.MaBienThe,
        bt.TenBienThe,
        bt.DuongDanAnhBienThe,
        sp.Ten as TenSanPham,
        SUM(dhct.SoLuongSanPham) as TongSoLuong,
        SUM(dhct.SoLuongSanPham * dhct.GiaTienCuaSanPham) as TongDoanhThu
      FROM DonHangChiTiet dhct
      JOIN BienThe bt ON dhct.MaBienThe = bt.MaBienThe
      JOIN SanPham sp ON bt.MaSP = sp.MaSP
      JOIN DonHang dh ON dhct.MaDonHang = dh.MaDonHang
      WHERE dh.TinhTrangDonHang = 2 
      GROUP BY bt.MaBienThe, bt.TenBienThe, bt.DuongDanAnhBienThe, sp.Ten
      ORDER BY TongSoLuong DESC, TongDoanhThu DESC
      LIMIT ?
      `,
      [limit]
    );
    return rows;
  },
};

export default DonHangAdmin;
