// server/controllers/sanPhamAdmin.controller.js

import SanPhamAdmin from '../models/sanPhamAdmin.model.js';

/**
 * Lấy danh sách sản phẩm (có thể lọc)
 */
export const getAllSanPhamAdmin = async (req, res, next) => {
  try {
    const filters = {
      maLoai: req.query.maLoai,
      tinhTrang: req.query.tinhTrang,
      search: req.query.search
    };

    const products = await SanPhamAdmin.getAllAdmin(filters);

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy chi tiết sản phẩm
 */
export const getSanPhamByIdAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await SanPhamAdmin.getByIdAdmin(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Tạo sản phẩm mới
 */
export const createSanPhamAdmin = async (req, res, next) => {
  try {
    const { ten, moTa, maLoai, tinhTrangSanPham } = req.body;

    // Validation
    if (!ten || !ten.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Tên sản phẩm không được để trống'
      });
    }

    if (!maLoai) {
      return res.status(400).json({
        success: false,
        message: 'Loại sản phẩm không được để trống'
      });
    }

    const maSP = await SanPhamAdmin.create({
      ten: ten.trim(),
      moTa: moTa || '',
      maLoai,
      tinhTrangSanPham: tinhTrangSanPham !== undefined ? tinhTrangSanPham : 1
    });

    res.status(201).json({
      success: true,
      message: 'Thêm sản phẩm thành công',
      data: { maSP }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật sản phẩm
 */
export const updateSanPhamAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { ten, moTa, maLoai, tinhTrangSanPham } = req.body;

    // Validation
    if (!ten || !ten.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Tên sản phẩm không được để trống'
      });
    }

    if (!maLoai) {
      return res.status(400).json({
        success: false,
        message: 'Loại sản phẩm không được để trống'
      });
    }

    const affectedRows = await SanPhamAdmin.update(id, {
      ten: ten.trim(),
      moTa: moTa || '',
      maLoai,
      tinhTrangSanPham: tinhTrangSanPham !== undefined ? tinhTrangSanPham : 1
    });

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật sản phẩm thành công'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Xóa sản phẩm (soft delete)
 */
export const deleteSanPhamAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const affectedRows = await SanPhamAdmin.delete(id);

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    res.json({
      success: true,
      message: 'Xóa sản phẩm thành công'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Xóa vĩnh viễn sản phẩm (hard delete)
 */
export const hardDeleteSanPhamAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const affectedRows = await SanPhamAdmin.deleteHard(id);

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    res.json({
      success: true,
      message: 'Xóa vĩnh viễn sản phẩm thành công'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Kích hoạt/Vô hiệu hóa sản phẩm
 */
export const toggleStatusSanPhamAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const affectedRows = await SanPhamAdmin.toggleStatus(id);

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật trạng thái sản phẩm thành công'
    });
  } catch (error) {
    next(error);
  }
};
