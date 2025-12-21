// server/utils/cloudinaryHelper.js

import { getOptimizedImageUrl } from '../config/cloudinary.js';

/**
 * Tạo URL ảnh được tối ưu hóa cho thumbnail
 * @param {string} cloudinaryUrl - URL từ Cloudinary
 * @returns {string} URL tối ưu cho thumbnail
 */
export const getThumbnailUrl = (cloudinaryUrl) => {
  return getOptimizedImageUrl(cloudinaryUrl, {
    width: 200,
    height: 200,
    quality: 'auto',
    format: 'auto',
  });
};

/**
 * Tạo URL ảnh được tối ưu hóa cho danh sách
 * @param {string} cloudinaryUrl
 * @returns {string}
 */
export const getListImageUrl = (cloudinaryUrl) => {
  return getOptimizedImageUrl(cloudinaryUrl, {
    width: 300,
    height: 300,
    quality: 'auto',
    format: 'auto',
  });
};

/**
 * Tạo URL ảnh được tối ưu hóa cho chi tiết
 * @param {string} cloudinaryUrl
 * @returns {string}
 */
export const getDetailImageUrl = (cloudinaryUrl) => {
  return getOptimizedImageUrl(cloudinaryUrl, {
    width: 600,
    height: 600,
    quality: 'auto',
    format: 'auto',
  });
};

/**
 * Tạo URL ảnh với blur placeholder
 * @param {string} cloudinaryUrl
 * @returns {string}
 */
export const getBlurPlaceholderUrl = (cloudinaryUrl) => {
  return getOptimizedImageUrl(cloudinaryUrl, {
    width: 50,
    height: 50,
    quality: 20,
    format: 'auto',
  });
};

/**
 * Tạo URL ảnh responsive cho tablet
 * @param {string} cloudinaryUrl
 * @returns {string}
 */
export const getTabletImageUrl = (cloudinaryUrl) => {
  return getOptimizedImageUrl(cloudinaryUrl, {
    width: 400,
    height: 400,
    quality: 'auto',
    format: 'auto',
  });
};

/**
 * Tạo URL ảnh responsive cho mobile
 * @param {string} cloudinaryUrl
 * @returns {string}
 */
export const getMobileImageUrl = (cloudinaryUrl) => {
  return getOptimizedImageUrl(cloudinaryUrl, {
    width: 250,
    height: 250,
    quality: 'auto',
    format: 'auto',
  });
};
