import express from "express";
import thanhToanController from "../controllers/thanhToan.controller.js";

const router = express.Router();

// ✅ THÊM: Route tạo link MOMO (không tạo đơn hàng)
router.post("/momo/create-payment", thanhToanController.createMomoPayment);

router.get("/momo/callback", thanhToanController.handleMomoCallback.bind(thanhToanController));
router.post("/momo/callback", thanhToanController.handleMomoCallback.bind(thanhToanController));
router.post("/momo/ipn", thanhToanController.handleMomoCallback.bind(thanhToanController));

export default router;