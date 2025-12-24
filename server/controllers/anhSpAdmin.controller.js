// server/controllers/anhSpAdmin.controller.js

import AnhSpAdmin from "../models/anhSpAdmin.model.js";

/**
 * Lấy danh sách ảnh của một sản phẩm
 */
export const getAnhByProductAdmin = async (req, res, next) => {
  try {
    const { id } = req.params; // id ở đây là maSP
    const images = await AnhSpAdmin.getByProduct(id);

    res.json({
      success: true,
      data: images,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Xóa ảnh sản phẩm
 */
export const deleteAnhAdmin = async (req, res, next) => {
  try {
    const { id } = req.params; // id ở đây là maAnhSP

    const affectedRows = await AnhSpAdmin.delete(id);

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy ảnh hoặc ảnh đã bị xóa",
      });
    }

    res.json({
      success: true,
      message: "Xóa ảnh thành công",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật thứ tự hiển thị ảnh
 */
export const updateAnhOrderAdmin = async (req, res, next) => {
  try {
    const { id } = req.params; // maAnhSP
    const { thuTuHienThi } = req.body;

    if (thuTuHienThi === undefined) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp thứ tự hiển thị",
      });
    }

    const affectedRows = await AnhSpAdmin.updateOrder(id, thuTuHienThi);

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy ảnh",
      });
    }

    res.json({
      success: true,
      message: "Cập nhật thứ tự thành công",
    });
  } catch (error) {
    next(error);
  }
};