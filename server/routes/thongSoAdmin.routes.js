// server/routes/thongSoAdmin.routes.js
import express from "express";
import {
  getSpecs,
  createSpec,
  deleteSpec,
  restoreSpec,
  updateSpec,
  hardDeleteSpec,
  getVariants,
  createVariant,
  deleteVariant,
  restoreVariant,
  updateVariant,
  hardDeleteVariant,
} from "../controllers/thongSoAdmin.controller.js";

const router = express.Router();

// 1. Nhóm API Thông số kỹ thuật (ThongSoMau)
// Đường dẫn gốc: /api/admin/thong-so
router.get("/specs/:maLoai", getSpecs); // Lấy danh sách
router.post("/specs", createSpec); // Thêm mới
router.delete("/specs/:id", deleteSpec); // Xóa mềm
router.delete("/specs/hard-delete/:id", hardDeleteSpec); // Xóa cứng
router.put("/specs/restore/:id", restoreSpec); // Khôi phục
router.put("/specs/:id", updateSpec);

// 2. Nhóm API Biến thể mẫu (ThongSoBienTheMau)
router.get("/variants/:maLoai", getVariants);
router.post("/variants", createVariant);
router.delete("/variants/:id", deleteVariant);
router.delete("/variants/hard-delete/:id", hardDeleteVariant);
router.put("/variants/restore/:id", restoreVariant);
router.put("/variants/:id", updateVariant); //

export default router;
