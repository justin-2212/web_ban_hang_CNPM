// server/controllers/sanPhamAdmin.controller.js

import SanPhamAdmin from "../models/sanPhamAdmin.model.js";

/**
 * Lấy danh sách sản phẩm (có thể lọc)
 */
export const getAllSanPhamAdmin = async (req, res, next) => {
  try {
    const filters = {
      maLoai: req.query.maLoai,
      tinhTrang: req.query.tinhTrang,
      search: req.query.search,
    };

    const products = await SanPhamAdmin.getAllAdmin(filters);

    res.json({
      success: true,
      data: products,
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
        message: "Không tìm thấy sản phẩm",
      });
    }

    res.json({
      success: true,
      data: product,
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
    // Nhận cả viết hoa và viết thường để tương thích
    const {
      ten,
      Ten,
      moTa,
      MoTa,
      maLoai,
      MaLoai,
      tinhTrangSanPham,
      TinhTrangSanPham,
    } = req.body;

    const productName = Ten || ten;
    const productDesc = MoTa || moTa || "";
    const categoryId = MaLoai || maLoai;
    const productStatus =
      TinhTrangSanPham !== undefined
        ? TinhTrangSanPham
        : tinhTrangSanPham !== undefined
        ? tinhTrangSanPham
        : 1;

    // Validation
    if (!productName || !productName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Tên sản phẩm không được để trống",
      });
    }

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Loại sản phẩm không được để trống",
      });
    }

    const maSP = await SanPhamAdmin.create({
      ten: productName.trim(),
      moTa: productDesc,
      maLoai: categoryId,
      tinhTrangSanPham: productStatus,
    });

    res.status(201).json({
      success: true,
      message: "Thêm sản phẩm thành công",
      data: { maSP },
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
    // Nhận cả viết hoa và viết thường để tương thích
    const {
      ten,
      Ten,
      moTa,
      MoTa,
      maLoai,
      MaLoai,
      tinhTrangSanPham,
      TinhTrangSanPham,
    } = req.body;

    const productName = Ten || ten;
    const productDesc = MoTa || moTa || "";
    const categoryId = MaLoai || maLoai;
    const productStatus =
      TinhTrangSanPham !== undefined
        ? TinhTrangSanPham
        : tinhTrangSanPham !== undefined
        ? tinhTrangSanPham
        : 1;

    // Validation
    if (!productName || !productName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Tên sản phẩm không được để trống",
      });
    }

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Loại sản phẩm không được để trống",
      });
    }

    const affectedRows = await SanPhamAdmin.update(id, {
      ten: productName.trim(),
      moTa: productDesc,
      maLoai: categoryId,
      tinhTrangSanPham: productStatus,
    });

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    res.json({
      success: true,
      message: "Cập nhật sản phẩm thành công",
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

    // 1. GỌI MODEL KIỂM TRA (Chỉ còn trả về variantCount)
    const deps = await SanPhamAdmin.checkDependencies(id);

    // --- THAY ĐỔI: Đã bỏ qua kiểm tra Đơn hàng và Giỏ hàng theo yêu cầu ---

    // --- Kiểm tra Biến thể ---
    // Nếu sản phẩm còn biến thể -> CHẶN
    if (deps.variantCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Không thể xóa! Sản phẩm này đang có ${deps.variantCount} biến thể. Vui lòng xóa các biến thể bên trong trang chi tiết trước.`,
      });
    }

    // 2. Nếu không còn biến thể nào (count == 0) -> Cho phép xóa sản phẩm
    const affectedRows = await SanPhamAdmin.delete(id);

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    res.json({
      success: true,
      message: "Đã xóa vĩnh viễn sản phẩm thành công",
    });
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(400).json({
        success: false,
        message: "Không thể xóa do dữ liệu này đang được sử dụng ở bảng khác.",
      });
    }
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
        message: "Không tìm thấy sản phẩm",
      });
    }

    res.json({
      success: true,
      message: "Xóa vĩnh viễn sản phẩm thành công",
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
        message: "Không tìm thấy sản phẩm",
      });
    }

    res.json({
      success: true,
      message: "Cập nhật trạng thái sản phẩm thành công",
    });
  } catch (error) {
    next(error);
  }
};
