// server/controllers/thongKeAdmin.controller.js

import DonHangAdmin from "../models/donHangAdmin.model.js";
import TaiKhoanAdmin from "../models/taiKhoanAdmin.model.js";
import BienTheAdmin from "../models/bienTheAdmin.model.js";
import db from "../config/db.js";

/**
 * Dashboard tổng quan
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    // Lấy thống kê đơn hàng
    const orderStats = await DonHangAdmin.getOrderStats();
    // Lấy thống kê người dùng
    const userStats = await TaiKhoanAdmin.getUserStats();

    // Lấy biến thể tồn kho thấp
    const lowStock = await BienTheAdmin.getLowStock(10);

    // Lấy top sản phẩm bán chạy
    const topProducts = await DonHangAdmin.getTopSellingProducts(5);

    // Thống kê hôm nay
    const today = new Date().toISOString().split("T")[0];
    const [todayStats] = await db.query(
      `
      SELECT 
        SUM(CASE WHEN TinhTrangDonHang = 2 THEN 1 ELSE 0 END) as DonHangHomNay,
        SUM(CASE WHEN TinhTrangDonHang = 2 THEN TongTien ELSE 0 END) as DoanhThuHomNay
      FROM DonHang
      WHERE DATE(NgayDat) = ?
      `,
      [today]
    );

    // Thống kê tuần này
    const [weekStats] = await db.query(
      `
      SELECT 
        SUM(CASE WHEN TinhTrangDonHang = 2 THEN 1 ELSE 0 END) as DonHangTuanNay,
        SUM(CASE WHEN TinhTrangDonHang = 2 THEN TongTien ELSE 0 END) as DoanhThuTuanNay
      FROM DonHang
      WHERE YEARWEEK(NgayDat, 1) = YEARWEEK(CURDATE(), 1)
      `
    );

    // Thống kê tháng này
    const [monthStats] = await db.query(
      `
      SELECT 
        SUM(CASE WHEN TinhTrangDonHang = 2 THEN 1 ELSE 0 END) as DonHangThangNay,
        SUM(CASE WHEN TinhTrangDonHang = 2 THEN TongTien ELSE 0 END) as DoanhThuThangNay
      FROM DonHang
      WHERE YEAR(NgayDat) = YEAR(CURDATE()) AND MONTH(NgayDat) = MONTH(CURDATE())
      `
    );

    //  Thêm thống kê NĂM NAY
    const [yearStats] = await db.query(
      `
      SELECT 
        SUM(CASE WHEN TinhTrangDonHang = 2 THEN 1 ELSE 0 END) as DonHangNamNay,
        SUM(CASE WHEN TinhTrangDonHang = 2 THEN TongTien ELSE 0 END) as DoanhThuNamNay
      FROM DonHang
      WHERE YEAR(NgayDat) = YEAR(CURDATE())
      `
    );

    res.json({
      success: true,
      data: {
        donHang: orderStats,
        nguoiDung: userStats,
        tonKhoThap: lowStock,
        topSanPham: topProducts,
        homNay: todayStats[0],
        tuanNay: weekStats[0],
        thangNay: monthStats[0],
        namNay: yearStats[0],
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Doanh thu theo khoảng thời gian
 */
export const getRevenueByPeriod = async (req, res, next) => {
  try {
    const { fromDate, toDate, groupBy = "day" } = req.query;

    if (!fromDate || !toDate) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp fromDate và toDate",
      });
    }

    let dateFormat;
    switch (groupBy) {
      case "month":
        dateFormat = "%Y-%m";
        break;
      case "year":
        dateFormat = "%Y";
        break;
      case "day":
      default:
        dateFormat = "%Y-%m-%d";
    }

    const [rows] = await db.query(
      `
      SELECT 
        DATE_FORMAT(NgayDat, ?) as Period,
        COUNT(*) as SoDonHang,
        SUM(TongTien) as DoanhThu,
        SUM(CASE WHEN TinhTrangThanhToan = 1 THEN TongTien ELSE 0 END) as DaThanhToan,
        SUM(CASE WHEN TinhTrangThanhToan = 0 THEN TongTien ELSE 0 END) as ChuaThanhToan,
        SUM(CASE WHEN TinhTrangDonHang = 3 THEN 1 ELSE 0 END) as DonHuy
      FROM DonHang
      WHERE NgayDat BETWEEN ? AND ?
      GROUP BY Period
      ORDER BY Period DESC
      `,
      [dateFormat, fromDate, toDate]
    );

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Thống kê sản phẩm
 */
export const getProductStats = async (req, res, next) => {
  try {
    // Tổng số sản phẩm và biến thể
    const [productCount] = await db.query(`
      SELECT 
        COUNT(DISTINCT sp.MaSP) as TongSanPham,
        COUNT(DISTINCT bt.MaBienThe) as TongBienThe,
        SUM(bt.SoLuongTonKho) as TongTonKho,
        SUM(CASE WHEN sp.TinhTrangSanPham = 1 THEN 1 ELSE 0 END) as SanPhamHoatDong,
        SUM(CASE WHEN bt.TinhTrangHoatDong = 1 THEN 1 ELSE 0 END) as BienTheHoatDong
      FROM SanPham sp
      LEFT JOIN BienThe bt ON sp.MaSP = bt.MaSP
    `);

    // Thống kê theo loại
    const [categoryStats] = await db.query(`
      SELECT 
        lsp.TenLoai,
        COUNT(DISTINCT sp.MaSP) as SoLuongSanPham,
        SUM(bt.SoLuongTonKho) as TonKho
      FROM LoaiSanPham lsp
      LEFT JOIN SanPham sp ON lsp.MaLoai = sp.MaLoai
      LEFT JOIN BienThe bt ON sp.MaSP = bt.MaSP
      GROUP BY lsp.MaLoai, lsp.TenLoai
      ORDER BY SoLuongSanPham DESC
    `);

    res.json({
      success: true,
      data: {
        tongQuan: productCount[0],
        theoLoai: categoryStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Thống kê khách hàng
 */
export const getCustomerStats = async (req, res, next) => {
  try {
    // Top khách hàng mua nhiều nhất
    const [topCustomers] = await db.query(`
      SELECT 
        tk.MaTaiKhoan,
        tk.TenDayDu,
        tk.Gmail,
        COUNT(DISTINCT dh.MaDonHang) as SoDonHang,
        SUM(dh.TongTien) as TongChiTieu
      FROM TaiKhoan tk
      JOIN DonHang dh ON tk.MaTaiKhoan = dh.MaTaiKhoan
      WHERE dh.TinhTrangDonHang != 3
      GROUP BY tk.MaTaiKhoan
      ORDER BY TongChiTieu DESC
      LIMIT 10
    `);

    // Khách hàng mới trong 30 ngày
    const [newCustomers] = await db.query(`
      SELECT COUNT(*) as SoLuong
      FROM TaiKhoan
      WHERE NgayTao >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `);

    res.json({
      success: true,
      data: {
        topKhachHang: topCustomers,
        khachHangMoi30Ngay: newCustomers[0].SoLuong,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * So sánh doanh thu theo kỳ
 */
export const compareRevenue = async (req, res, next) => {
  try {
    const { period = "month" } = req.query; // month, quarter, year

    let currentPeriod, previousPeriod;

    switch (period) {
      case "quarter":
        currentPeriod = "QUARTER(CURDATE())";
        previousPeriod = "QUARTER(DATE_SUB(CURDATE(), INTERVAL 3 MONTH))";
        break;
      case "year":
        currentPeriod = "YEAR(CURDATE())";
        previousPeriod = "YEAR(DATE_SUB(CURDATE(), INTERVAL 1 YEAR))";
        break;
      case "month":
      default:
        currentPeriod = "YEAR(CURDATE()) * 100 + MONTH(CURDATE())";
        previousPeriod =
          "YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) * 100 + MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))";
    }

    const [comparison] = await db.query(`
      SELECT 
        SUM(CASE WHEN ${currentPeriod} = YEAR(NgayDat) * 100 + MONTH(NgayDat) THEN TongTien ELSE 0 END) as KyHienTai,
        SUM(CASE WHEN ${previousPeriod} = YEAR(NgayDat) * 100 + MONTH(NgayDat) THEN TongTien ELSE 0 END) as KyTruoc,
        COUNT(CASE WHEN ${currentPeriod} = YEAR(NgayDat) * 100 + MONTH(NgayDat) THEN 1 END) as DonHangKyHienTai,
        COUNT(CASE WHEN ${previousPeriod} = YEAR(NgayDat) * 100 + MONTH(NgayDat) THEN 1 END) as DonHangKyTruoc
      FROM DonHang
      WHERE TinhTrangDonHang != 3
    `);

    const current = comparison[0].KyHienTai || 0;
    const previous = comparison[0].KyTruoc || 0;
    const growth =
      previous > 0 ? (((current - previous) / previous) * 100).toFixed(2) : 0;

    res.json({
      success: true,
      data: {
        ...comparison[0],
        TyLeThayDoi: growth,
      },
    });
  } catch (error) {
    next(error);
  }
};
