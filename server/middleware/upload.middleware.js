// server/middleware/upload.middleware.js

import multer from 'multer';
import { uploadToCloudinary } from '../config/cloudinary.js';

// ✅ Cấu hình storage memory (không lưu file vào disk, upload trực tiếp lên Cloudinary)
const storage = multer.memoryStorage();

// ✅ Filter file (chỉ nhận ảnh)
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh (JPEG, PNG, WebP, GIF)'), false);
  }
};

// ✅ Cấu hình multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// ✅ Middleware upload và upload lên Cloudinary
export const uploadToCloudinaryMiddleware = (folderName = 'apple-store') => {
  return async (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn tệp ảnh',
      });
    }

    try {
      // Upload lên Cloudinary
      const result = await uploadToCloudinary(
        req.file.buffer,
        req.file.originalname,
        folderName
      );

      // Lưu thông tin ảnh vào req
      req.cloudinaryResult = {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        size: result.bytes,
      };

      next();
    } catch (error) {
      console.error('Lỗi upload ảnh:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi upload ảnh: ' + error.message,
      });
    }
  };
};

export default upload;
