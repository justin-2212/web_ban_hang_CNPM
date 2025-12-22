#!/usr/bin/env node
/**
 * MIGRATION SCRIPT: Migrate ảnh cũ lên Cloudinary
 * 
 * Cách chạy:
 * node migrateImagesToCloudinary.js [--dry-run] [--table=anhsp|bienthe|all]
 * 
 * Examples:
 * node migrateImagesToCloudinary.js --dry-run
 * node migrateImagesToCloudinary.js --table=anhsp
 * node migrateImagesToCloudinary.js --table=bienthe
 * node migrateImagesToCloudinary.js
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import db from './server/config/db.js';
import { uploadToCloudinary } from './server/config/cloudinary.js';

dotenv.config();

// ============================================
// CONFIGURATION
// ============================================

const IMAGES_BASE_PATH = path.join(process.cwd(), 'public', 'assets', 'products');
const DRY_RUN = process.argv.includes('--dry-run');
const TABLE = process.argv.find(arg => arg.startsWith('--table='))?.split('=')[1] || 'all';

const LOG_COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${LOG_COLORS.blue}ℹ️  ${msg}${LOG_COLORS.reset}`),
  success: (msg) => console.log(`${LOG_COLORS.green}✅ ${msg}${LOG_COLORS.reset}`),
  warn: (msg) => console.log(`${LOG_COLORS.yellow}⚠️  ${msg}${LOG_COLORS.reset}`),
  error: (msg) => console.log(`${LOG_COLORS.red}❌ ${msg}${LOG_COLORS.reset}`),
  dryrun: (msg) => console.log(`${LOG_COLORS.cyan}[DRY RUN] ${msg}${LOG_COLORS.reset}`),
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Lấy tất cả ảnh từ AnhSP table
 */
const getAnhSPImages = async () => {
  try {
    const [rows] = await db.query(`
      SELECT MaAnh, DuongDanLuuAnh, MaSP, ThuTuHienThi 
      FROM AnhSP 
      WHERE DuongDanLuuAnh IS NOT NULL
      ORDER BY MaSP, ThuTuHienThi
    `);
    return rows;
  } catch (error) {
    log.error(`Lỗi lấy AnhSP: ${error.message}`);
    return [];
  }
};

/**
 * Lấy tất cả ảnh từ BienThe table
 */
const getBienTheImages = async () => {
  try {
    const [rows] = await db.query(`
      SELECT MaBienThe, DuongDanAnhBienThe, MaSP 
      FROM BienThe 
      WHERE DuongDanAnhBienThe IS NOT NULL
      ORDER BY MaSP, MaBienThe
    `);
    return rows;
  } catch (error) {
    log.error(`Lỗi lấy BienThe: ${error.message}`);
    return [];
  }
};

/**
 * Upload file lên Cloudinary
 */
const uploadFile = async (filePath, fileName, folder) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File không tồn tại: ${filePath}`);
    }

    const fileBuffer = fs.readFileSync(filePath);
    const result = await uploadToCloudinary(fileBuffer, fileName, folder);
    
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Migrate AnhSP images
 */
const migrateAnhSP = async () => {
  console.log(`\n${LOG_COLORS.bright}🖼️  MIGRATING ANHSP IMAGES${LOG_COLORS.reset}\n`);

  const images = await getAnhSPImages();

  if (images.length === 0) {
    log.info('Không có ảnh AnhSP để migrate');
    return { total: 0, success: 0, failed: 0 };
  }

  log.info(`Tìm thấy ${images.length} ảnh AnhSP`);

  let successCount = 0;
  let failedCount = 0;
  const failedImages = [];

  for (let i = 0; i < images.length; i++) {
    const { MaAnh, DuongDanLuuAnh, MaSP, ThuTuHienThi } = images[i];
    const progress = `[${i + 1}/${images.length}]`;

    // Bỏ qua URL Cloudinary (đã migrate)
    if (DuongDanLuuAnh && DuongDanLuuAnh.includes('cloudinary.com')) {
      log.warn(`${progress} MaAnh ${MaAnh}: Đã là Cloudinary URL, bỏ qua`);
      continue;
    }

    // Tìm file local
    // Fix path: database có thể chứa full path hoặc relative path, cần clean nó
    let cleanPath = DuongDanLuuAnh;
    if (cleanPath.includes('assets/products/')) {
      cleanPath = cleanPath.split('assets/products/')[1];
    }
    const filePath = path.join(IMAGES_BASE_PATH, cleanPath);

    if (!fs.existsSync(filePath)) {
      log.error(`${progress} MaAnh ${MaAnh}: File không tìm thấy (${filePath})`);
      failedCount++;
      failedImages.push({ MaAnh, path: filePath });
      continue;
    }

    if (DRY_RUN) {
      log.dryrun(`${progress} MaAnh ${MaAnh}: ${DuongDanLuuAnh} → Cloudinary`);
      successCount++;
      continue;
    }

    // Upload lên Cloudinary
    const fileName = path.basename(DuongDanLuuAnh);
    const uploadResult = await uploadFile(filePath, fileName, 'apple-store/anh-san-pham');

    if (uploadResult.success) {
      // Update database
      try {
        await db.query(
          'UPDATE AnhSP SET DuongDanLuuAnh = ? WHERE MaAnh = ?',
          [uploadResult.url, MaAnh]
        );
        log.success(`${progress} MaAnh ${MaAnh}: Upload thành công`);
        successCount++;
      } catch (dbError) {
        log.error(`${progress} MaAnh ${MaAnh}: Upload OK nhưng DB update failed: ${dbError.message}`);
        failedCount++;
        failedImages.push({ MaAnh, error: 'DB update failed' });
      }
    } else {
      log.error(`${progress} MaAnh ${MaAnh}: Upload failed - ${uploadResult.error}`);
      failedCount++;
      failedImages.push({ MaAnh, error: uploadResult.error });
    }
  }

  if (failedImages.length > 0) {
    console.log(`\n${LOG_COLORS.yellow}⚠️  Failed Images:${LOG_COLORS.reset}`);
    failedImages.forEach(img => console.log(`  - MaAnh: ${img.MaAnh}`));
  }

  return { total: images.length, success: successCount, failed: failedCount };
};

/**
 * Migrate BienThe images
 */
const migrateBienThe = async () => {
  console.log(`\n${LOG_COLORS.bright}🎨 MIGRATING BIENTHE IMAGES${LOG_COLORS.reset}\n`);

  const images = await getBienTheImages();

  if (images.length === 0) {
    log.info('Không có ảnh BienThe để migrate');
    return { total: 0, success: 0, failed: 0 };
  }

  log.info(`Tìm thấy ${images.length} ảnh BienThe`);

  let successCount = 0;
  let failedCount = 0;
  const failedImages = [];

  for (let i = 0; i < images.length; i++) {
    const { MaBienThe, DuongDanAnhBienThe, MaSP } = images[i];
    const progress = `[${i + 1}/${images.length}]`;

    // Bỏ qua URL Cloudinary (đã migrate)
    if (DuongDanAnhBienThe && DuongDanAnhBienThe.includes('cloudinary.com')) {
      log.warn(`${progress} MaBienThe ${MaBienThe}: Đã là Cloudinary URL, bỏ qua`);
      continue;
    }

    // Tìm file local
    // Fix path: database có thể chứa full path hoặc relative path, cần clean nó
    let cleanPath = DuongDanAnhBienThe;
    if (cleanPath.includes('assets/products/')) {
      cleanPath = cleanPath.split('assets/products/')[1];
    }
    const filePath = path.join(IMAGES_BASE_PATH, cleanPath);

    if (!fs.existsSync(filePath)) {
      log.error(`${progress} MaBienThe ${MaBienThe}: File không tìm thấy (${filePath})`);
      failedCount++;
      failedImages.push({ MaBienThe, path: filePath });
      continue;
    }

    if (DRY_RUN) {
      log.dryrun(`${progress} MaBienThe ${MaBienThe}: ${DuongDanAnhBienThe} → Cloudinary`);
      successCount++;
      continue;
    }

    // Upload lên Cloudinary
    const fileName = path.basename(DuongDanAnhBienThe);
    const uploadResult = await uploadFile(filePath, fileName, 'apple-store/anh-bien-the');

    if (uploadResult.success) {
      // Update database
      try {
        await db.query(
          'UPDATE BienThe SET DuongDanAnhBienThe = ? WHERE MaBienThe = ?',
          [uploadResult.url, MaBienThe]
        );
        log.success(`${progress} MaBienThe ${MaBienThe}: Upload thành công`);
        successCount++;
      } catch (dbError) {
        log.error(`${progress} MaBienThe ${MaBienThe}: Upload OK nhưng DB update failed: ${dbError.message}`);
        failedCount++;
        failedImages.push({ MaBienThe, error: 'DB update failed' });
      }
    } else {
      log.error(`${progress} MaBienThe ${MaBienThe}: Upload failed - ${uploadResult.error}`);
      failedCount++;
      failedImages.push({ MaBienThe, error: uploadResult.error });
    }
  }

  if (failedImages.length > 0) {
    console.log(`\n${LOG_COLORS.yellow}⚠️  Failed Images:${LOG_COLORS.reset}`);
    failedImages.forEach(img => console.log(`  - MaBienThe: ${img.MaBienThe}`));
  }

  return { total: images.length, success: successCount, failed: failedCount };
};

// ============================================
// MAIN EXECUTION
// ============================================

const main = async () => {
  console.log(`\n${LOG_COLORS.bright}╔════════════════════════════════════════════╗${LOG_COLORS.reset}`);
  console.log(`${LOG_COLORS.bright}║  IMAGE MIGRATION SCRIPT - MIGRATE TO CLOUDINARY  ║${LOG_COLORS.reset}`);
  console.log(`${LOG_COLORS.bright}╚════════════════════════════════════════════╝${LOG_COLORS.reset}\n`);

  if (DRY_RUN) {
    log.warn('DRY RUN MODE - Không thay đổi gì, chỉ preview');
  }

  log.info(`Base Path: ${IMAGES_BASE_PATH}`);
  log.info(`Table: ${TABLE}`);
  console.log('');

  try {
    let results = { anhsp: null, bienthe: null };

    if (TABLE === 'anhsp' || TABLE === 'all') {
      results.anhsp = await migrateAnhSP();
    }

    if (TABLE === 'bienthe' || TABLE === 'all') {
      results.bienthe = await migrateBienThe();
    }

    // Print Summary
    console.log(`\n${LOG_COLORS.bright}📊 MIGRATION SUMMARY${LOG_COLORS.reset}\n`);

    if (results.anhsp) {
      console.log(`${LOG_COLORS.cyan}AnhSP:${LOG_COLORS.reset}`);
      console.log(`  Total:   ${results.anhsp.total}`);
      console.log(`  Success: ${LOG_COLORS.green}${results.anhsp.success}${LOG_COLORS.reset}`);
      console.log(`  Failed:  ${results.anhsp.failed > 0 ? LOG_COLORS.red : LOG_COLORS.green}${results.anhsp.failed}${LOG_COLORS.reset}`);
    }

    if (results.bienthe) {
      console.log(`\n${LOG_COLORS.cyan}BienThe:${LOG_COLORS.reset}`);
      console.log(`  Total:   ${results.bienthe.total}`);
      console.log(`  Success: ${LOG_COLORS.green}${results.bienthe.success}${LOG_COLORS.reset}`);
      console.log(`  Failed:  ${results.bienthe.failed > 0 ? LOG_COLORS.red : LOG_COLORS.green}${results.bienthe.failed}${LOG_COLORS.reset}`);
    }

    const grandTotal = (results.anhsp?.total || 0) + (results.bienthe?.total || 0);
    const grandSuccess = (results.anhsp?.success || 0) + (results.bienthe?.success || 0);
    const grandFailed = (results.anhsp?.failed || 0) + (results.bienthe?.failed || 0);

    console.log(`\n${LOG_COLORS.cyan}Total:${LOG_COLORS.reset}`);
    console.log(`  All:     ${grandTotal}`);
    console.log(`  Success: ${LOG_COLORS.green}${grandSuccess}${LOG_COLORS.reset}`);
    console.log(`  Failed:  ${grandFailed > 0 ? LOG_COLORS.red : LOG_COLORS.green}${grandFailed}${LOG_COLORS.reset}`);

    if (DRY_RUN) {
      console.log(`\n${LOG_COLORS.yellow}💡 This was a DRY RUN. Run without --dry-run to actually migrate.${LOG_COLORS.reset}`);
    } else if (grandFailed === 0 && grandTotal > 0) {
      console.log(`\n${LOG_COLORS.green}🎉 Migration completed successfully!${LOG_COLORS.reset}`);
    }

    console.log('');
    process.exit(grandFailed > 0 ? 1 : 0);
  } catch (error) {
    log.error(`Fatal error: ${error.message}`);
    process.exit(1);
  }
};

main();
