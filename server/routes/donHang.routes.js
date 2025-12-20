import express from "express";
import donHangController from "../controllers/donHang.controller.js";

const router = express.Router();

// Specific routes BEFORE generic /:maDonHang
/**
 * POST /api/don-hang/:maDonHang/cancel
 * Hủy đơn hàng (chỉ COD, trong 5 phút)
 */
router.post("/:maDonHang/cancel", donHangController.cancelOrder);

/**
 * GET /api/don-hang/:maDonHang
 * Lấy chi tiết đơn hàng
 */
router.get("/:maDonHang", donHangController.getById);

/**
 * GET /api/don-hang/user/:maTaiKhoan
 * Lấy danh sách đơn hàng của user
 */
router.get("/user/:maTaiKhoan", donHangController.getByUser);

/**
 * PUT /api/don-hang/:maDonHang/status
 * Cập nhật trạng thái đơn hàng
 */
router.put("/:maDonHang/status", donHangController.updateStatus);

/**
 * GET /api/don-hang/:maDonHang/payment-status
 * Lấy trạng thái thanh toán online (nếu có)
 */
router.get("/:maDonHang/payment-status", donHangController.getPaymentStatus);

export default router;
