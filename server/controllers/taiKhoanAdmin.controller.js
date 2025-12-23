// server/controllers/taiKhoanAdmin.controller.js

import TaiKhoanAdmin from "../models/taiKhoanAdmin.model.js";

/**
 * Lấy danh sách tài khoản (có thể lọc)
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const filters = {
      quyen: req.query.quyen,
      tinhTrang: req.query.tinhTrang,
      search: req.query.search,
    };

    const users = await TaiKhoanAdmin.getAllAdmin(filters);

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy chi tiết tài khoản
 */
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await TaiKhoanAdmin.getByIdAdmin(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài khoản",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật quyền
 */
export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quyen } = req.body;

    // Validation
    if (quyen === undefined || quyen === null) {
      return res.status(400).json({
        success: false,
        message: "Quyền không được để trống",
      });
    }
    // Validate quyền hợp lệ
    if (![0, 1].includes(quyen)) {
      return res.status(400).json({
        success: false,
        message: "Quyền không hợp lệ. Chỉ chấp nhận 0 (Admin) hoặc 1 (User)",
      });
    }

    const affectedRows = await TaiKhoanAdmin.updateRole(id, quyen);

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài khoản",
      });
    }

    res.json({
      success: true,
      message: "Cập nhật quyền thành công",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Kích hoạt/Vô hiệu hóa tài khoản
 */
export const toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const affectedRows = await TaiKhoanAdmin.toggleStatus(id);

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài khoản",
      });
    }

    res.json({
      success: true,
      message: "Cập nhật trạng thái tài khoản thành công",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy thống kê người dùng
 */
export const getUserStats = async (req, res, next) => {
  try {
    const stats = await TaiKhoanAdmin.getUserStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy người dùng mới theo ngày
 */
export const getNewUsers = async (req, res, next) => {
  try {
    const { fromDate, toDate } = req.query;

    if (!fromDate || !toDate) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp fromDate và toDate",
      });
    }

    const data = await TaiKhoanAdmin.getNewUsers(fromDate, toDate);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy đơn hàng của user
 */
export const getUserOrders = async (req, res, next) => {
  try {
    const { id } = req.params;
    const orders = await TaiKhoanAdmin.getUserOrders(id);

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};
