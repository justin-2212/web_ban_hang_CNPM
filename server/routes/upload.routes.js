// server/routes/upload.routes.js

import express from 'express';
const router = express.Router();
import upload from '../middleware/upload.middleware.js';
import { uploadToCloudinaryMiddleware } from '../middleware/upload.middleware.js';
import db from '../config/db.js';

// =====================================
// UPLOAD ẢNH SẢN PHẨM (AnhSP)
// =====================================

/**
 * POST /api/upload/anh-san-pham
 * Upload ảnh vào bảng AnhSP
 * Body: { maSP: number, thuTuHienThi?: number }
 */
router.post(
  '/anh-san-pham',
  upload.single('image'),
  uploadToCloudinaryMiddleware('apple-store/anh-san-pham'),
  async (req, res) => {
    try {
      const { maSP, thuTuHienThi = 0 } = req.body;

      //  Validate input
      if (!maSP || !req.cloudinaryResult) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu maSP hoặc ảnh không hợp lệ',
        });
      }

      //  Kiểm tra sản phẩm có tồn tại
      const [productCheck] = await db.query(
        'SELECT MaSP FROM SanPham WHERE MaSP = ?',
        [maSP]
      );

      if (productCheck.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Sản phẩm không tồn tại',
        });
      }

      // ✅ Insert ảnh vào bảng AnhSP
      const [result] = await db.query(
        'INSERT INTO AnhSP (DuongDanLuuAnh, ThuTuHienThi, MaSP) VALUES (?, ?, ?)',
        [req.cloudinaryResult.url, thuTuHienThi, maSP]
      );

      res.status(201).json({
        success: true,
        message: 'Upload ảnh sản phẩm thành công',
        data: {
          maAnh: result.insertId,
          duongDanLuuAnh: req.cloudinaryResult.url,
          thuTuHienThi,
          maSP,
          cloudinary: {
            publicId: req.cloudinaryResult.publicId,
            width: req.cloudinaryResult.width,
            height: req.cloudinaryResult.height,
          },
        },
      });
    } catch (error) {
      console.error('Lỗi upload ảnh sản phẩm:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server: ' + error.message,
      });
    }
  }
);

// =====================================
// UPLOAD ẢNH BIẾN THỂ (BienThe)
// =====================================

/**
 * POST /api/upload/anh-bien-the
 * Upload ảnh vào bảng BienThe
 * Body: { maBienThe: number }
 */
router.post(
  '/anh-bien-the',
  upload.single('image'),
  uploadToCloudinaryMiddleware('apple-store/anh-bien-the'),
  async (req, res) => {
    try {
      const { maBienThe } = req.body;

      // ✅ Validate input
      if (!maBienThe || !req.cloudinaryResult) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu maBienThe hoặc ảnh không hợp lệ',
        });
      }

      // ✅ Kiểm tra biến thể có tồn tại
      const [bienTheCheck] = await db.query(
        'SELECT DuongDanAnhBienThe FROM BienThe WHERE MaBienThe = ?',
        [maBienThe]
      );

      if (bienTheCheck.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Biến thể sản phẩm không tồn tại',
        });
      }

      // ✅ Update ảnh vào bảng BienThe
      const [updateResult] = await db.query(
        'UPDATE BienThe SET DuongDanAnhBienThe = ? WHERE MaBienThe = ?',
        [req.cloudinaryResult.url, maBienThe]
      );

      res.status(200).json({
        success: true,
        message: 'Upload ảnh biến thể thành công',
        data: {
          maBienThe,
          duongDanAnhBienThe: req.cloudinaryResult.url,
          cloudinary: {
            publicId: req.cloudinaryResult.publicId,
            width: req.cloudinaryResult.width,
            height: req.cloudinaryResult.height,
          },
        },
      });
    } catch (error) {
      console.error('Lỗi upload ảnh biến thể:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server: ' + error.message,
      });
    }
  }
);

// =====================================
// UPLOAD NHIỀU ẢNH (AnhSP)
// =====================================

/**
 * POST /api/upload/anh-san-pham/bulk
 * Upload nhiều ảnh cùng lúc cho 1 sản phẩm
 * Body: FormData { maSP: number, images: File[] }
 */
router.post(
  '/anh-san-pham/bulk',
  upload.array('images', 10), // Tối đa 10 ảnh
  async (req, res) => {
    try {
      const { maSP } = req.body;

      if (!maSP || !req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu maSP hoặc ảnh',
        });
      }

      // ✅ Kiểm tra sản phẩm
      const [productCheck] = await db.query(
        'SELECT MaSP FROM SanPham WHERE MaSP = ?',
        [maSP]
      );

      if (productCheck.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Sản phẩm không tồn tại',
        });
      }

      // ✅ Upload tất cả ảnh lên Cloudinary
      const { uploadToCloudinary } = await import('../config/cloudinary.js');
      const uploadPromises = req.files.map((file, index) =>
        uploadToCloudinary(file.buffer, file.originalname, 'apple-store/anh-san-pham')
          .then((result) => ({
            duongDanLuuAnh: result.secure_url,
            publicId: result.public_id,
            thuTuHienThi: index,
          }))
      );

      const uploadedImages = await Promise.all(uploadPromises);

      // ✅ Insert vào database
      const insertPromises = uploadedImages.map((img) =>
        db.query(
          'INSERT INTO AnhSP (DuongDanLuuAnh, ThuTuHienThi, MaSP) VALUES (?, ?, ?)',
          [img.duongDanLuuAnh, img.thuTuHienThi, maSP]
        )
      );

      const results = await Promise.all(insertPromises);

      res.status(201).json({
        success: true,
        message: `Upload ${uploadedImages.length} ảnh thành công`,
        data: uploadedImages.map((img, idx) => ({
          maAnh: results[idx][0].insertId,
          duongDanLuuAnh: img.duongDanLuuAnh,
          thuTuHienThi: img.thuTuHienThi,
          publicId: img.publicId,
        })),
      });
    } catch (error) {
      console.error('Lỗi upload nhiều ảnh:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server: ' + error.message,
      });
    }
  }
);

export default router;
