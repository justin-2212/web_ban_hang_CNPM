// server/controllers/bienTheAdmin.controller.js

import BienTheAdmin from '../models/bienTheAdmin.model.js';

/**
 * Lấy tất cả biến thể của sản phẩm
 */
export const getBienTheByProduct = async (req, res, next) => {
  try {
    const { maSP } = req.params;
    const variants = await BienTheAdmin.getByProduct(maSP);

    res.json({
      success: true,
      data: variants
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy chi tiết biến thể
 */
export const getBienTheById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const variant = await BienTheAdmin.getById(id);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy biến thể'
      });
    }

    res.json({
      success: true,
      data: variant
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Tạo biến thể mới
 */
export const createBienThe = async (req, res, next) => {
  try {
    const {
      maSP,
      tenBienThe,
      giaTienBienThe,
      duongDanAnhBienThe,
      soLuongTonKho,
      thuTuHienThi,
      tinhTrangHoatDong
    } = req.body;

    // Validation
    if (!maSP) {
      return res.status(400).json({
        success: false,
        message: 'Mã sản phẩm không được để trống'
      });
    }

    if (!tenBienThe || !tenBienThe.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Tên biến thể không được để trống'
      });
    }

    if (!giaTienBienThe || giaTienBienThe <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Giá tiền phải lớn hơn 0'
      });
    }

    const maBienThe = await BienTheAdmin.create({
      maSP,
      tenBienThe: tenBienThe.trim(),
      giaTienBienThe,
      duongDanAnhBienThe: duongDanAnhBienThe || '',
      soLuongTonKho: soLuongTonKho || 0,
      thuTuHienThi: thuTuHienThi || 0,
      tinhTrangHoatDong: tinhTrangHoatDong !== undefined ? tinhTrangHoatDong : 1
    });

    res.status(201).json({
      success: true,
      message: 'Thêm biến thể thành công',
      data: { maBienThe }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật biến thể
 */
export const updateBienThe = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      tenBienThe,
      giaTienBienThe,
      duongDanAnhBienThe,
      soLuongTonKho,
      thuTuHienThi,
      tinhTrangHoatDong
    } = req.body;

    // Validation
    if (!tenBienThe || !tenBienThe.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Tên biến thể không được để trống'
      });
    }

    if (!giaTienBienThe || giaTienBienThe <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Giá tiền phải lớn hơn 0'
      });
    }

    const affectedRows = await BienTheAdmin.update(id, {
      tenBienThe: tenBienThe.trim(),
      giaTienBienThe,
      duongDanAnhBienThe: duongDanAnhBienThe || '',
      soLuongTonKho: soLuongTonKho || 0,
      thuTuHienThi: thuTuHienThi || 0,
      tinhTrangHoatDong: tinhTrangHoatDong !== undefined ? tinhTrangHoatDong : 1
    });

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy biến thể'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật biến thể thành công'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật tồn kho
 */
export const updateStockBienThe = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { soLuong } = req.body;

    if (soLuong === undefined || soLuong < 0) {
      return res.status(400).json({
        success: false,
        message: 'Số lượng tồn kho không hợp lệ'
      });
    }

    const affectedRows = await BienTheAdmin.updateStock(id, soLuong);

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy biến thể'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật tồn kho thành công'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Điều chỉnh tồn kho (tăng/giảm)
 */
export const adjustStockBienThe = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { delta } = req.body;

    if (delta === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Giá trị điều chỉnh không được để trống'
      });
    }

    const affectedRows = await BienTheAdmin.adjustStock(id, delta);

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy biến thể'
      });
    }

    res.json({
      success: true,
      message: 'Điều chỉnh tồn kho thành công'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Xóa biến thể (soft delete)
 */
export const deleteBienThe = async (req, res, next) => {
  try {
    const { id } = req.params;

    const affectedRows = await BienTheAdmin.delete(id);

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy biến thể'
      });
    }

    res.json({
      success: true,
      message: 'Xóa biến thể thành công'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Xóa vĩnh viễn biến thể
 */
export const hardDeleteBienThe = async (req, res, next) => {
  try {
    const { id } = req.params;

    const affectedRows = await BienTheAdmin.deleteHard(id);

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy biến thể'
      });
    }

    res.json({
      success: true,
      message: 'Xóa vĩnh viễn biến thể thành công'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Kích hoạt/Vô hiệu hóa biến thể
 */
export const toggleStatusBienThe = async (req, res, next) => {
  try {
    const { id } = req.params;

    const affectedRows = await BienTheAdmin.toggleStatus(id);

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy biến thể'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật trạng thái biến thể thành công'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy danh sách biến thể có tồn kho thấp
 */
export const getLowStockBienThe = async (req, res, next) => {
  try {
    const threshold = req.query.threshold || 10;
    const variants = await BienTheAdmin.getLowStock(threshold);

    res.json({
      success: true,
      data: variants
    });
  } catch (error) {
    next(error);
  }
};
