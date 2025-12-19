import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireOwnership } from "../middleware/authorization.middleware.js";
import { asyncHandler } from "../middleware/errorHandler.middleware.js";
import { validateRequiredFields } from "../middleware/validation.middleware.js";
import gioHangController from "../controllers/gioHang.controller.js";

const router = express.Router();

// ⚠️ CRITICAL: Specific routes FIRST (route precedence)
// Route `/clear/:maTaiKhoan` phải đứng TRƯỚC route `/:maTaiKhoan/:maBienThe`

// Xóa toàn bộ giỏ hàng (ĐẶT TRƯỚC)
router.delete(
  "/clear/:maTaiKhoan",
  authenticate,
  requireOwnership("maTaiKhoan"),
  asyncHandler(gioHangController.clearCart)
);

// Lấy giỏ hàng
router.get(
  "/:maTaiKhoan",
  authenticate,
  requireOwnership("maTaiKhoan"),
  asyncHandler(gioHangController.getCart)
);

// Thêm vào giỏ
router.post(
  "/",
  authenticate,
  validateRequiredFields("maTaiKhoan", "maBienThe", "soLuong"),
  requireOwnership(),
  asyncHandler(gioHangController.addItem)
);

// Cập nhật số lượng
router.put(
  "/",
  authenticate,
  validateRequiredFields("maTaiKhoan", "maBienThe", "soLuong"),
  requireOwnership(),
  asyncHandler(gioHangController.updateQuantity)
);

// Xóa khỏi giỏ (ĐẶT SAU /clear)
router.delete(
  "/:maTaiKhoan/:maBienThe",
  authenticate,
  requireOwnership("maTaiKhoan"),
  asyncHandler(gioHangController.removeItem)
);

export default router;
