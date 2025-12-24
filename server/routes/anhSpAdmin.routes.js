// server/routes/anhSpAdmin.routes.js

import express from "express";
import {
  getAnhByProductAdmin,
  deleteAnhAdmin,
  updateAnhOrderAdmin,
} from "../controllers/anhSpAdmin.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js"; // Đảm bảo bạn import đúng middleware auth của bạn
import { requireAdmin } from "../middleware/authorization.middleware.js";

const router = express.Router();

// Middleware chung cho tất cả các route ảnh admin: Phải đăng nhập & là Admin
router.use(authenticateToken, requireAdmin);

// GET /api/admin/anh-sp/product/:id - Lấy tất cả ảnh của sản phẩm
router.get("/product/:id", getAnhByProductAdmin);

// DELETE /api/admin/anh-sp/:id - Xóa ảnh
router.delete("/:id", deleteAnhAdmin);

// PUT /api/admin/anh-sp/:id/order - Cập nhật thứ tự
router.put("/:id/order", updateAnhOrderAdmin);

export default router;
