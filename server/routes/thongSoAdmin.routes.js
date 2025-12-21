// server/routes/thongSoAdmin.routes.js
import express from "express";
import {
  getSpecs,
  createSpec,
  deleteSpec,
  restoreSpec,
  updateSpec,
  getVariants,
  createVariant,
  deleteVariant,
  restoreVariant,
  updateVariant
} from "../controllers/thongSoAdmin.controller.js";

const router = express.Router();

// 1. Nhóm API Thông số kỹ thuật (ThongSoMau)
// Đường dẫn gốc: /api/admin/thong-so
router.get("/specs/:maLoai", getSpecs); // Lấy danh sách
router.post("/specs", createSpec); // Thêm mới
router.delete("/specs/:id", deleteSpec); // Xóa
router.put("/specs/restore/:id", restoreSpec); // Khôi phục
router.put("/specs/:id", updateSpec);

// 2. Nhóm API Biến thể mẫu (ThongSoBienTheMau)
router.get("/variants/:maLoai", getVariants);
router.post("/variants", createVariant);
router.delete("/variants/:id", deleteVariant);
router.put("/variants/restore/:id", restoreVariant);    
router.put("/variants/:id", updateVariant); //

export default router;
