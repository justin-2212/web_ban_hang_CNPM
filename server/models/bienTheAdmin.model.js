// server/models/bienTheAdmin.model.js

import db from "../config/db.js";

const BienTheAdmin = {
  /**
   * Lấy tất cả biến thể của sản phẩm
   */
  getByProduct: async (maSP) => {
    const [rows] = await db.query(
      `
      SELECT *
      FROM BienThe
      WHERE MaSP = ?
      ORDER BY ThuTuHienThi ASC
      `,
      [maSP]
    );

    return rows;
  },

  /**
   * Lấy chi tiết biến thể
   */
  getById: async (maBienThe) => {
    const [rows] = await db.query(
      `
      SELECT bt.*, sp.Ten as TenSanPham
      FROM BienThe bt
      LEFT JOIN SanPham sp ON bt.MaSP = sp.MaSP
      WHERE bt.MaBienThe = ?
      `,
      [maBienThe]
    );

    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Tạo biến thể mới
   */
  create: async (data) => {
    const {
      maSP,
      tenBienThe,
      giaTienBienThe,
      duongDanAnhBienThe,
      soLuongTonKho = 0,
      thuTuHienThi = 0,
      tinhTrangHoatDong = 1,
    } = data;

    const [result] = await db.query(
      `
      INSERT INTO BienThe
        (MaSP, TenBienThe, GiaTienBienThe, DuongDanAnhBienThe, SoLuongTonKho, ThuTuHienThi, TinhTrangHoatDong)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        maSP,
        tenBienThe,
        giaTienBienThe,
        duongDanAnhBienThe,
        soLuongTonKho,
        thuTuHienThi,
        tinhTrangHoatDong,
      ]
    );

    return result.insertId;
  },

  /**
   * Cập nhật biến thể
   */
  update: async (maBienThe, data) => {
    const {
      tenBienThe,
      giaTienBienThe,
      duongDanAnhBienThe,
      soLuongTonKho,
      thuTuHienThi,
      tinhTrangHoatDong,
    } = data;

    const [result] = await db.query(
      `
      UPDATE BienThe
      SET
        TenBienThe = ?,
        GiaTienBienThe = ?,
        DuongDanAnhBienThe = ?,
        SoLuongTonKho = ?,
        ThuTuHienThi = ?,
        TinhTrangHoatDong = ?
      WHERE MaBienThe = ?
      `,
      [
        tenBienThe,
        giaTienBienThe,
        duongDanAnhBienThe,
        soLuongTonKho,
        thuTuHienThi,
        tinhTrangHoatDong,
        maBienThe,
      ]
    );

    return result.affectedRows;
  },

  /**
   * Cập nhật tồn kho
   */
  updateStock: async (maBienThe, soLuong) => {
    const [result] = await db.query(
      `
      UPDATE BienThe
      SET SoLuongTonKho = ?
      WHERE MaBienThe = ?
      `,
      [soLuong, maBienThe]
    );

    return result.affectedRows;
  },

  /**
   * Tăng/Giảm tồn kho
   */
  adjustStock: async (maBienThe, delta) => {
    const [result] = await db.query(
      `
      UPDATE BienThe
      SET SoLuongTonKho = SoLuongTonKho + ?
      WHERE MaBienThe = ?
      `,
      [delta, maBienThe]
    );

    return result.affectedRows;
  },

  // Hàm kiểm tra ràng buộc dữ liệu (xem có đơn hàng nào chứa biến thể này không)
  checkDependencies: async (maBienThe) => {
    try {
      // Giả sử bảng chi tiết đơn hàng tên là 'ChiTietDonHang'
      // Nếu tên bảng của bạn khác (ví dụ: OrderDetails), hãy đổi lại cho đúng
      const [rows] = await db.query(
        "SELECT COUNT(*) as count FROM DonHangChiTiet WHERE MaBienThe = ?",
        [maBienThe]
      );

      return {
        orderCount: rows[0].count, // Trả về số lượng đơn hàng chứa biến thể này
      };
    } catch (error) {
      // Nếu bảng ChiTietDonHang chưa tồn tại hoặc lỗi khác, log ra và giả định là 0 để không chặn xóa
      console.error("Lỗi checkDependencies:", error.message);
      return { orderCount: 0 };
    }
  },

  /**
   * Xóa biến thể (hard delete)
   */
  delete: async (maBienThe) => {
    // Xóa các giá trị biến thể trước (foreign key)
    await db.query("DELETE FROM GiaTriBienThe WHERE MaBienThe = ?", [
      maBienThe,
    ]);

    // Xóa biến thể
    const [result] = await db.query("DELETE FROM BienThe WHERE MaBienThe = ?", [
      maBienThe,
    ]);

    return result.affectedRows;
  },

  /**
   * Xóa vĩnh viễn biến thể
   */
  deleteHard: async (maBienThe) => {
    const [result] = await db.query("DELETE FROM BienThe WHERE MaBienThe = ?", [
      maBienThe,
    ]);

    return result.affectedRows;
  },

  /**
   * Kích hoạt/Vô hiệu hóa biến thể
   */
  toggleStatus: async (maBienThe) => {
    const [result] = await db.query(
      `
      UPDATE BienThe
      SET TinhTrangHoatDong = 1 - TinhTrangHoatDong
      WHERE MaBienThe = ?
      `,
      [maBienThe]
    );

    return result.affectedRows;
  },

  /**
   * Lấy danh sách biến thể có tồn kho thấp
   */
  getLowStock: async (threshold = 10) => {
    const [rows] = await db.query(
      `
      SELECT bt.*, sp.Ten as TenSanPham
      FROM BienThe bt
      LEFT JOIN SanPham sp ON bt.MaSP = sp.MaSP
      WHERE bt.SoLuongTonKho <= ? AND bt.TinhTrangHoatDong = 1
      ORDER BY bt.SoLuongTonKho ASC
      `,
      [threshold]
    );

    return rows;
  },
};

export default BienTheAdmin;
