import express from "express";
import checkoutController from "../controllers/checkout.controller.js";

const router = express.Router();

/**
 * POST /api/checkout
 * Body:
 * {
 *   maTaiKhoan: number,
 *   phuongThucThanhToan: "COD" | "ONLINE"
 * }
 * 
 * ✅ MOMO: TẠO ĐƠN HÀNG NGAY (TinhTrangThanhToan = 0)
 *    Chỉ cập nhật thành 1 khi callback thành công
 */
router.post("/", checkoutController.checkout);

export default router;