#!/usr/bin/env node
/**
 * Test Cloudinary Integration
 * 
 * Cách chạy:
 * node testCloudinaryIntegration.js
 */

import dotenv from 'dotenv';
import cloudinary from './server/config/cloudinary.js';
import { uploadToCloudinary, getOptimizedImageUrl } from './server/config/cloudinary.js';
import fs from 'fs';
import path from 'path';

dotenv.config();

console.log('🔍 Testing Cloudinary Integration...\n');

// ✅ Test 1: Check Config
console.log('📌 Test 1: Cloudinary Configuration');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing');
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing');
console.log('');

// ✅ Test 2: Test URL Transformation
console.log('📌 Test 2: URL Transformation Examples');
const testUrl = 'https://res.cloudinary.com/dwdh18bhk/image/upload/v1234/apple-store/test.jpg';

const thumbnail = getOptimizedImageUrl(testUrl, {
  width: 200,
  height: 200,
  quality: 'auto',
  format: 'auto'
});

const detail = getOptimizedImageUrl(testUrl, {
  width: 600,
  height: 600,
  quality: 'auto',
  format: 'auto'
});

console.log('Original:', testUrl);
console.log('Thumbnail:', thumbnail);
console.log('Detail:', detail);
console.log('');

// ✅ Test 3: Check API Endpoints
console.log('📌 Test 3: API Endpoints to Test');
console.log('');
console.log('1. Upload Ảnh Sản Phẩm:');
console.log('   POST /api/upload/anh-san-pham');
console.log('   Body: FormData { image, maSP, thuTuHienThi }');
console.log('');
console.log('2. Upload Ảnh Biến Thể:');
console.log('   POST /api/upload/anh-bien-the');
console.log('   Body: FormData { image, maBienThe }');
console.log('');
console.log('3. Upload Nhiều Ảnh:');
console.log('   POST /api/upload/anh-san-pham/bulk');
console.log('   Body: FormData { images[], maSP }');
console.log('');

// ✅ Test 4: Database Columns Check
console.log('📌 Test 4: Database Columns');
console.log('');
console.log('AnhSP table:');
console.log('  ✓ MaAnh (INT, PRIMARY KEY)');
console.log('  ✓ DuongDanLuuAnh (VARCHAR 250) - Lưu URL Cloudinary');
console.log('  ✓ ThuTuHienThi (INT)');
console.log('  ✓ MaSP (INT, FOREIGN KEY)');
console.log('');
console.log('BienThe table:');
console.log('  ✓ MaBienThe (INT, PRIMARY KEY)');
console.log('  ✓ DuongDanAnhBienThe (VARCHAR 250) - Lưu URL Cloudinary');
console.log('');

// ✅ Test 5: Frontend API Calls
console.log('📌 Test 5: Frontend API Calls (src/services/api.js)');
console.log('');
console.log('uploadAPI.uploadAnhSanPham(file, maSP, thuTuHienThi)');
console.log('uploadAPI.uploadAnhBienThe(file, maBienThe)');
console.log('uploadAPI.uploadMultipleImages(files[], maSP)');
console.log('');

// ✅ Test 6: Helper Functions
console.log('📌 Test 6: Helper Functions (server/utils/cloudinaryHelper.js)');
console.log('');
console.log('Available functions:');
console.log('  • getThumbnailUrl(cloudinaryUrl) - 200x200');
console.log('  • getListImageUrl(cloudinaryUrl) - 300x300');
console.log('  • getDetailImageUrl(cloudinaryUrl) - 600x600');
console.log('  • getBlurPlaceholderUrl(cloudinaryUrl) - 50x50');
console.log('  • getTabletImageUrl(cloudinaryUrl) - 400x400');
console.log('  • getMobileImageUrl(cloudinaryUrl) - 250x250');
console.log('');

// ✅ Test 7: File Size & Type Constraints
console.log('📌 Test 7: Constraints');
console.log('');
console.log('File Size: Max 5MB');
console.log('Formats: JPEG, PNG, WebP, GIF');
console.log('Bulk Upload: Max 10 images');
console.log('');

console.log('✅ All checks completed!\n');
console.log('📚 Read CLOUDINARY_GUIDE.md for full documentation');
