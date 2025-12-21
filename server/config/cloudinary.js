// server/config/cloudinary.js

import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// ✅ Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Hàm upload lên Cloudinary
export const uploadToCloudinary = async (fileBuffer, fileName, folder = 'apple-store') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folder, // Tổ chức ảnh theo folder trên Cloudinary
        resource_type: 'auto',
        public_id: fileName.replace(/\.[^/.]+$/, ''), // Loại bỏ extension
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
};

// ✅ Hàm xóa ảnh từ Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Lỗi khi xóa ảnh từ Cloudinary:', error);
    throw error;
  }
};

// ✅ Hàm tạo URL transformation để tối ưu hóa ảnh
export const getOptimizedImageUrl = (cloudinaryUrl, options = {}) => {
  if (!cloudinaryUrl) return '';
  
  // Mặc định options
  const {
    width = null,
    height = null,
    quality = 'auto', // auto hoặc số từ 1-100
    format = 'auto',  // auto, webp, jpg, png...
  } = options;

  // Tạo transformation string
  let transforms = [];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (quality) transforms.push(`q_${quality}`);
  if (format) transforms.push(`f_${format}`);

  if (transforms.length === 0) return cloudinaryUrl;

  // Thêm transformations vào URL
  const transformString = transforms.join(',');
  return cloudinaryUrl.replace('/upload/', `/upload/${transformString}/`);
};

export default cloudinary;
