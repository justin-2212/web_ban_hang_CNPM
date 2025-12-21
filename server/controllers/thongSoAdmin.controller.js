// server/controllers/thongSoAdmin.controller.js
import {
  ThongSoMauModel,
  ThongSoBienTheModel,
} from "../models/thongSoAdmin.model.js";

// --- CONTROLLER CHO THÔNG SỐ KỸ THUẬT (Spec) ---
export const getSpecs = async (req, res) => {
  const { maLoai } = req.params;
  try {
    const data = await ThongSoMauModel.getByLoai(maLoai);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createSpec = async (req, res) => {
  const { ten, donVi, thuTu, tinhTrang, maLoai } = req.body;
  if (!ten || !maLoai) {
    return res
      .status(400)
      .json({ success: false, message: "Thiếu tên hoặc mã loại" });
  }
  try {
    const newId = await ThongSoMauModel.create(
      ten,
      donVi || "",
      thuTu || 0,
      tinhTrang ?? 1,
      maLoai
    );
    res
      .status(201)
      .json({ success: true, message: "Thêm thông số thành công", newId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteSpec = async (req, res) => {
  const { id } = req.params;
  try {
    await ThongSoMauModel.delete(id);
    res.status(200).json({ success: true, message: "Đã xóa thông số" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSpec = async (req, res) => {
  const { id } = req.params;
  const { ten, donVi, thuTu, tinhTrang } = req.body;
  if (!ten)
    return res.status(400).json({ success: false, message: "Thiếu tên" });

  try {
    await ThongSoMauModel.update(id, ten, donVi, thuTu, tinhTrang);
    res.status(200).json({ success: true, message: "Cập nhật thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const restoreSpec = async (req, res) => {
  const { id } = req.params;
  try {
    await ThongSoMauModel.restore(id);
    res.status(200).json({ success: true, message: "Đã khôi phục thông số" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- CONTROLLER CHO BIẾN THỂ (Variant) ---
export const getVariants = async (req, res) => {
  const { maLoai } = req.params;
  try {
    const data = await ThongSoBienTheModel.getByLoai(maLoai);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createVariant = async (req, res) => {
  const { ten, donVi, thuTu, tinhTrang, maLoai } = req.body;
  if (!ten || !maLoai) {
    return res
      .status(400)
      .json({ success: false, message: "Thiếu tên hoặc mã loại" });
  }
  try {
    const newId = await ThongSoBienTheModel.create(
      ten,
      donVi || "",
      thuTu || 0,
      tinhTrang ?? 1,
      maLoai
    );
    res
      .status(201)
      .json({ success: true, message: "Thêm biến thể mẫu thành công", newId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteVariant = async (req, res) => {
  const { id } = req.params;
  try {
    await ThongSoBienTheModel.delete(id);
    res.status(200).json({ success: true, message: "Đã xóa biến thể mẫu" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const restoreVariant = async (req, res) => {
  const { id } = req.params;
  try {
    await ThongSoBienTheModel.restore(id);
    res
      .status(200)
      .json({ success: true, message: "Đã khôi phục biến thể mẫu" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateVariant = async (req, res) => {
  const { id } = req.params;
  const { ten, donVi, thuTu, tinhTrang } = req.body;
  if (!ten)
    return res.status(400).json({ success: false, message: "Thiếu tên" });

  try {
    await ThongSoBienTheModel.update(id, ten, donVi, thuTu, tinhTrang);
    res.status(200).json({ success: true, message: "Cập nhật thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
