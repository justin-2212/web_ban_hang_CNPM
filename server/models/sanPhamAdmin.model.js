// server/models/sanPhamAdmin.model.js

import db from '../config/db.js';

const SanPhamAdmin = {
  /**
   * Lấy tất cả sản phẩm (bao gồm cả inactive) - Cho admin
   */
  getAllAdmin: async (filters = {}) => {
    let query = `
      SELECT 
        sp.MaSP, sp.Ten, sp.MoTa, sp.TinhTrangSanPham, sp.MaLoai,
        lsp.TenLoai,
        COUNT(DISTINCT bt.MaBienThe) as SoLuongBienThe,
        MIN(bt.GiaTienBienThe) as GiaThapNhat,
        MAX(bt.GiaTienBienThe) as GiaCaoNhat,
        SUM(bt.SoLuongTonKho) as TongTonKho
      FROM SanPham sp
      LEFT JOIN LoaiSanPham lsp ON sp.MaLoai = lsp.MaLoai
      LEFT JOIN BienThe bt ON sp.MaSP = bt.MaSP
    `;

    const conditions = [];
    const params = [];

    // Lọc theo loại sản phẩm
    if (filters.maLoai) {
      conditions.push('sp.MaLoai = ?');
      params.push(filters.maLoai);
    }

    // Lọc theo tình trạng
    if (filters.tinhTrang !== undefined && filters.tinhTrang !== '') {
      conditions.push('sp.TinhTrangSanPham = ?');
      params.push(filters.tinhTrang);
    }

    // Tìm kiếm theo tên
    if (filters.search) {
      conditions.push('sp.Ten LIKE ?');
      params.push(`%${filters.search}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += `
      GROUP BY sp.MaSP, sp.Ten, sp.MoTa, sp.TinhTrangSanPham, sp.MaLoai, lsp.TenLoai
      ORDER BY sp.MaSP ASC
    `;

    const [rows] = await db.query(query, params);
    return rows;
  },

  /**
   * Lấy chi tiết sản phẩm với tất cả biến thể - Cho admin
   */
  getByIdAdmin: async (maSP) => {
    // Lấy thông tin sản phẩm
    const [product] = await db.query(
      `
      SELECT sp.*, lsp.TenLoai
      FROM SanPham sp
      LEFT JOIN LoaiSanPham lsp ON sp.MaLoai = lsp.MaLoai
      WHERE sp.MaSP = ?
      `,
      [maSP]
    );

    if (product.length === 0) return null;

    // Lấy tất cả biến thể (bao gồm cả inactive)
    const [variants] = await db.query(
      `
      SELECT *
      FROM BienThe
      WHERE MaSP = ?
      ORDER BY ThuTuHienThi ASC
      `,
      [maSP]
    );

    return {
      ...product[0],
      variants: variants || []
    };
  },

  /**
   * Tạo sản phẩm mới
   */
  create: async (data) => {
    const { ten, moTa, maLoai, tinhTrangSanPham = 1 } = data;

    const [result] = await db.query(
      `
      INSERT INTO SanPham (Ten, MoTa, MaLoai, TinhTrangSanPham)
      VALUES (?, ?, ?, ?)
      `,
      [ten, moTa, maLoai, tinhTrangSanPham]
    );

    return result.insertId;
  },

  /**
   * Cập nhật sản phẩm
   */
  update: async (maSP, data) => {
    const { ten, moTa, maLoai, tinhTrangSanPham } = data;

    const [result] = await db.query(
      `
      UPDATE SanPham
      SET Ten = ?, MoTa = ?, MaLoai = ?, TinhTrangSanPham = ?
      WHERE MaSP = ?
      `,
      [ten, moTa, maLoai, tinhTrangSanPham, maSP]
    );

    return result.affectedRows;
  },

  /**
   * Xóa sản phẩm (hard delete - xóa vĩnh viễn)
   */
  delete: async (maSP) => {
    // 1. Lấy danh sách biến thể
    const [variants] = await db.query('SELECT MaBienThe FROM BienThe WHERE MaSP = ?', [maSP]);
    
    // 2. Xóa GiaTriBienThe của từng biến thể
    for (const variant of variants) {
      await db.query('DELETE FROM GiaTriBienThe WHERE MaBienThe = ?', [variant.MaBienThe]);
    }
    
    // 3. Xóa các biến thể
    await db.query('DELETE FROM BienThe WHERE MaSP = ?', [maSP]);
    
    // 4. Xóa thông số sản phẩm
    await db.query('DELETE FROM GiaTriThongSo WHERE MaSP = ?', [maSP]);
    
    // 5. Xóa ảnh sản phẩm
    await db.query('DELETE FROM AnhSP WHERE MaSP = ?', [maSP]);
    
    // 6. Xóa sản phẩm
    const [result] = await db.query(
      'DELETE FROM SanPham WHERE MaSP = ?',
      [maSP]
    );

    return result.affectedRows;
  },

  /**
   * Xóa vĩnh viễn sản phẩm (hard delete) - Cẩn thận!
   */
  deleteHard: async (maSP) => {
    // Xóa các biến thể trước
    await db.query('DELETE FROM BienThe WHERE MaSP = ?', [maSP]);
    
    // Xóa sản phẩm
    const [result] = await db.query(
      'DELETE FROM SanPham WHERE MaSP = ?',
      [maSP]
    );

    return result.affectedRows;
  },

  /**
   * Kích hoạt/Vô hiệu hóa sản phẩm
   */
  toggleStatus: async (maSP) => {
    const [result] = await db.query(
      `
      UPDATE SanPham
      SET TinhTrangSanPham = 1 - TinhTrangSanPham
      WHERE MaSP = ?
      `,
      [maSP]
    );

    return result.affectedRows;
  }
};

export default SanPhamAdmin;
