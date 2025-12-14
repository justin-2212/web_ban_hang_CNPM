import express from "express";
import GioHang from "../models/gioHang.model.js";

const router = express.Router();

/**
 * DELETE /api/gio-hang/clear/:maTaiKhoan
 * ⚠️ PHẢI ĐỊNH NGHĨA TRƯỚC nhé!
 */
router.delete("/clear/:maTaiKhoan", async (req, res) => {
  try {
    const { maTaiKhoan } = req.params;
    const affected = await GioHang.clearCart(maTaiKhoan);

    return res.json({
      success: true,
      message: "Xóa giỏ hàng thành công",
      data: { affected },
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Lỗi khi xóa giỏ hàng",
    });
  }
});

/**
 * GET /api/gio-hang/:maTaiKhoan
 * Lấy giỏ hàng của user
 */
router.get("/:maTaiKhoan", async (req, res) => {
  try {
    const { maTaiKhoan } = req.params;
    const items = await GioHang.getByUser(maTaiKhoan);

    const totalItems = items.reduce((sum, item) => sum + item.SoLuong, 0);
    const totalPrice = items.reduce(
      (sum, item) => sum + item.GiaTienBienThe * item.SoLuong,
      0
    );

    return res.json({
      success: true,
      data: {
        items,
        totalItems,
        totalPrice,
      },
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Lỗi khi tải giỏ hàng",
    });
  }
});

/**
 * POST /api/gio-hang
 * Thêm sản phẩm vào giỏ
 */
router.post("/", async (req, res) => {
  try {
    const { maTaiKhoan, maBienThe, soLuong } = req.body;

    if (!maTaiKhoan || !maBienThe || !soLuong) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin",
      });
    }

    const result = await GioHang.addItem(maTaiKhoan, maBienThe, soLuong);

    return res.status(201).json({
      success: true,
      message: "Thêm vào giỏ hàng thành công",
      data: result,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Lỗi khi thêm vào giỏ hàng",
    });
  }
});

/**
 * PUT /api/gio-hang
 * Cập nhật số lượng
 */
router.put("/", async (req, res) => {
  try {
    const { maTaiKhoan, maBienThe, soLuong } = req.body;

    if (!maTaiKhoan || !maBienThe) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin",
      });
    }

    const affected = await GioHang.updateQuantity(
      maTaiKhoan,
      maBienThe,
      soLuong
    );

    return res.json({
      success: true,
      message: "Cập nhật giỏ hàng thành công",
      data: { affected },
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Lỗi khi cập nhật giỏ hàng",
    });
  }
});

/**
 * DELETE /api/gio-hang/:maTaiKhoan/:maBienThe
 * Xóa 1 sản phẩm
 */
router.delete("/:maTaiKhoan/:maBienThe", async (req, res) => {
  try {
    const { maTaiKhoan, maBienThe } = req.params;

    const affected = await GioHang.removeItem(maTaiKhoan, maBienThe);

    return res.json({
      success: true,
      message: "Xóa sản phẩm thành công",
      data: { affected },
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Lỗi khi xóa sản phẩm",
    });
  }
});

export default router;
