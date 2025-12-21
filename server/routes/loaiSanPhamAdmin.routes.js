//server/routes/loaiSanPhamAdmin.routes.js

import express from "express";
import {
  getLoaiSanPhamAdmin,
  getLoaiSanPhamByIdAdmin,
  createLoaiSanPhamAdmin,
  updateLoaiSanPhamAdmin,
  deleteLoaiSanPhamAdmin,
} from "../controllers/loaiSanPhamAdmin.controller.js";

const router = express.Router();

// Định nghĩa các endpoints dành cho Admin
router.get("/", getLoaiSanPhamAdmin); // GET /api/admin/loai-san-pham
router.get("/:id", getLoaiSanPhamByIdAdmin); // GET /api/admin/loai-san-pham/:id
router.post("/", createLoaiSanPhamAdmin); // POST /api/admin/loai-san-pham
router.put("/:id", updateLoaiSanPhamAdmin); // PUT /api/admin/loai-san-pham/:id
router.delete("/:id", deleteLoaiSanPhamAdmin); // DELETE /api/admin/loai-san-pham/:id

export default router;
