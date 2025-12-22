// server/controllers/loaiSanPhamAdmin.controller.js

import LoaiSanPhamAdmin from "../models/loaiSanPhamAdmin.model.js";

// Lấy danh sách
export const getLoaiSanPhamAdmin = async (req, res) => {
  try {
    const data = await LoaiSanPhamAdmin.getAllAdmin();
    res.status(200).json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy chi tiết
export const getLoaiSanPhamByIdAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await LoaiSanPhamAdmin.getByIdAdmin(id);
    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy loại sản phẩm" });
    }
    res.status(200).json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Tạo mới
export const createLoaiSanPhamAdmin = async (req, res) => {
  const { tenLoai, thuTuHienThi, tinhTrang } = req.body;

  if (!tenLoai) {
    return res
      .status(400)
      .json({ success: false, message: "Tên loại không được để trống" });
  }

  try {
    // Mặc định thứ tự là 0, tình trạng là 1 nếu không truyền
    const newId = await LoaiSanPhamAdmin.createAdmin(
      tenLoai,
      thuTuHienThi || 0,
      tinhTrang || 1
    );
    res.status(201).json({
      success: true,
      message: "Thêm loại sản phẩm thành công",
      data: { MaLoai: newId, TenLoai: tenLoai },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật
export const updateLoaiSanPhamAdmin = async (req, res) => {
  const { id } = req.params;
  const { tenLoai, thuTuHienThi, tinhTrang } = req.body;

  try {
    const existing = await LoaiSanPhamAdmin.getByIdAdmin(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy loại sản phẩm để sửa",
      });
    }

    await LoaiSanPhamAdmin.updateAdmin(id, tenLoai, thuTuHienThi, tinhTrang);
    res.status(200).json({ success: true, message: "Cập nhật thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa (Hard delete)
export const deleteLoaiSanPhamAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await LoaiSanPhamAdmin.deleteAdmin(id);
    if (result === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy để xóa" });
    }
    res.status(200).json({
      success: true,
      message: "Đã xóa loại sản phẩm thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};
