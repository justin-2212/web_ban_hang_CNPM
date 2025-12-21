# 🚀 MIGRATION GUIDE - Migrate Ảnh Cũ Lên Cloudinary

## 📋 Overview

Script này giúp migrate **100% ảnh cũ** từ `/public/assets/products/` lên Cloudinary và update database tự động.

---

## 🎯 Cách Hoạt Động

### Luồng Migration
```
1. Đọc tất cả ảnh từ database (AnhSP & BienThe)
2. Kiểm tra từng file có tồn tại không
3. Upload lên Cloudinary (folder: apple-store/)
4. Update database với URL mới
5. Report kết quả (success/failed)
```

### Các Bảng Migrate
- **AnhSP** - Cột `DuongDanLuuAnh`
- **BienThe** - Cột `DuongDanAnhBienThe`

---

## 🔧 Các Mode Chạy

### 1️⃣ **Dry Run** (Preview)
```bash
node migrateImagesToCloudinary.js --dry-run
```
✅ Chỉ preview, không thay đổi gì  
✅ Xem sẽ migrate bao nhiêu ảnh  
✅ Kiểm tra có lỗi nào không

### 2️⃣ **Migrate AnhSP Chỉ**
```bash
node migrateImagesToCloudinary.js --table=anhsp
```

### 3️⃣ **Migrate BienThe Chỉ**
```bash
node migrateImagesToCloudinary.js --table=bienthe
```

### 4️⃣ **Migrate Cả 2**
```bash
node migrateImagesToCloudinary.js
```
Hoặc:
```bash
node migrateImagesToCloudinary.js --table=all
```

---

## 📖 Hướng Dẫn Step-by-Step

### Step 1: Backup Database
```bash
# Backup MySQL trước migration
mysqldump -u root -pnucep2025 apple_store > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Step 2: Dry Run (Preview)
```bash
node migrateImagesToCloudinary.js --dry-run
```

Output sẽ như sau:
```
🖼️  MIGRATING ANHSP IMAGES
ℹ️  Tìm thấy 15 ảnh AnhSP
[DRY RUN] [1/15] MaAnh 1: iphone/image1.jpg → Cloudinary
[DRY RUN] [2/15] MaAnh 2: iphone/image2.jpg → Cloudinary
...

📊 MIGRATION SUMMARY
AnhSP:
  Total:   15
  Success: 15
  Failed:  0

💡 This was a DRY RUN. Run without --dry-run to actually migrate.
```

### Step 3: Thực Tế Migration
```bash
# Migrate tất cả (AnhSP + BienThe)
node migrateImagesToCloudinary.js
```

Output:
```
🖼️  MIGRATING ANHSP IMAGES
ℹ️  Tìm thấy 15 ảnh AnhSP
✅ [1/15] MaAnh 1: Upload thành công
✅ [2/15] MaAnh 2: Upload thành công
...

🎨 MIGRATING BIENTHE IMAGES
ℹ️  Tìm thấy 45 ảnh BienThe
✅ [1/45] MaBienThe 1: Upload thành công
...

📊 MIGRATION SUMMARY
AnhSP:
  Total:   15
  Success: 15
  Failed:  0

BienThe:
  Total:   45
  Success: 45
  Failed:  0

🎉 Migration completed successfully!
```

### Step 4: Verify Migration
```sql
-- Kiểm tra AnhSP
SELECT COUNT(*) as total, 
       SUM(CASE WHEN DuongDanLuuAnh LIKE '%cloudinary%' THEN 1 ELSE 0 END) as cloudinary_count
FROM AnhSP;

-- Kỳ vọng: total = cloudinary_count (tất cả đã migrate)

-- Kiểm tra BienThe
SELECT COUNT(*) as total,
       SUM(CASE WHEN DuongDanAnhBienThe LIKE '%cloudinary%' THEN 1 ELSE 0 END) as cloudinary_count
FROM BienThe WHERE DuongDanAnhBienThe IS NOT NULL;
```

---

## ⚡ Quick Start

```bash
# 1. Preview
node migrateImagesToCloudinary.js --dry-run

# 2. Migrate AnhSP
node migrateImagesToCloudinary.js --table=anhsp

# 3. Migrate BienThe
node migrateImagesToCloudinary.js --table=bienthe

# 4. Verify
mysql -u root -pnucep2025 apple_store -e "SELECT COUNT(*) FROM AnhSP WHERE DuongDanLuuAnh LIKE '%cloudinary%';"
```

---

## 🔍 Understanding Output

### Status Icons
- ✅ **Success** - Upload thành công, DB updated
- ❌ **Error** - Upload failed hoặc DB update failed
- ⚠️ **Warning** - File đã là Cloudinary URL, bỏ qua
- ℹ️ **Info** - General information
- 📊 **Summary** - Final report

### Output Example
```
[1/45] MaBienThe 123: Upload thành công
  ↑     ↑             ↑
  Position in queue    Status

[45/45] MaBienThe 456: Upload failed - File not found
  ↑     ↑             ↑ Upload failed
  Last item in queue    Error detail
```

---

## 🐛 Troubleshooting

### Error: "Database connection failed"
```
Solution: 
- Check MySQL server running
- Check .env credentials correct
- Check database 'apple_store' exists
```

### Error: "File not found"
```
Example: File không tìm thấy (/path/to/file.jpg)

Solutions:
- Move file to correct location
- Or update database path manually
- Or delete row if file no longer needed
```

### Error: "Cloudinary upload failed"
```
Check:
- Network connection
- Cloudinary credentials in .env
- File size < 5MB
- File format (JPEG, PNG, WebP, GIF)
```

### Error: "DB update failed"
```
Solutions:
- Check MySQL connection
- Check MaAnh / MaBienThe exists
- Check column names correct (DuongDanLuuAnh, DuongDanAnhBienThe)
```

---

## 📊 Performance Tips

### Large Migrations
Nếu có hàng ngàn ảnh, migration có thể mất lâu. Tips:

```bash
# 1. Migrate từng loại riêng
node migrateImagesToCloudinary.js --table=anhsp  # Chạy lần 1
# ... chờ hoàn thành ...
node migrateImagesToCloudinary.js --table=bienthe # Chạy lần 2

# 2. Kiểm tra Cloudinary Dashboard
# https://cloudinary.com/console/media_library
# Xem upload stats, bandwidth, v.v.

# 3. Monitor logs
# Lưu output vào file
node migrateImagesToCloudinary.js --table=anhsp > migration_anhsp.log 2>&1
```

---

## 🔐 Safety

### Trước Migration
- ✅ Backup database
- ✅ Run dry-run first
- ✅ Test Cloudinary credentials
- ✅ Verify file paths

### Trong Migration
- ✅ Không tắt script khi chạy
- ✅ Giữ kết nối internet ổn định
- ✅ Không chạy multiple instances cùng lúc

### Sau Migration
- ✅ Verify tất cả ảnh migrate thành công
- ✅ Test hiển thị ảnh trên website
- ✅ Kiểm tra Cloudinary dashboard
- ✅ Có thể xóa ảnh cũ (optional)

---

## 🔄 Rollback Plan

Nếu có lỗi và cần rollback:

### Option 1: Restore Backup
```bash
mysql -u root -pnucep2025 apple_store < backup_20251221_120000.sql
```

### Option 2: Revert Manual
```sql
-- Nếu partial migration failed, có thể revert selected rows
UPDATE AnhSP 
SET DuongDanLuuAnh = REPLACE(DuongDanLuuAnh, 'https://res.cloudinary.com/...', 'old/path')
WHERE MaAnh IN (123, 456, ...);
```

---

## 📈 Post-Migration

### 1. Delete Old Images (Optional)
```bash
# Nếu chắc chắn tất cả đã migrate thành công
rm -rf public/assets/products/*
```

### 2. Update Frontend URLs
Nếu frontend hardcode ảnh path, cần update:

```javascript
// OLD
<img src="/assets/products/iphone/image.jpg" />

// NEW - Lấy từ database
<img src={product.duongDanLuuAnh} />
```

### 3. Monitor Cloudinary Usage
```
https://cloudinary.com/console
- Check storage used
- Check monthly transformations
- Monitor bandwidth
```

---

## 📚 Related Documentation

- [CLOUDINARY_GUIDE.md](../CLOUDINARY_GUIDE.md) - Full Cloudinary guide
- [TEST_UPLOAD_API.md](../TEST_UPLOAD_API.md) - Upload API testing
- [CLOUDINARY_ARCHITECTURE.md](../CLOUDINARY_ARCHITECTURE.md) - System design

---

## ⚙️ Script Details

### Input Validation
- ✅ Check file exists before upload
- ✅ Check MaAnh/MaBienThe exists in DB
- ✅ Check Cloudinary credentials
- ✅ Check file format

### Data Integrity
- ✅ Transaction-like behavior (upload → DB update)
- ✅ Error reporting with full details
- ✅ Skip already-migrated URLs (contain 'cloudinary.com')
- ✅ Preserve file metadata (size, width, height)

### Progress Tracking
- ✅ Show [Current/Total] for each image
- ✅ Real-time status updates
- ✅ Final summary report
- ✅ Success/failure counts

---

## 🎯 Migration Checklist

- [ ] Backup database (`mysqldump`)
- [ ] Run dry-run (`--dry-run`)
- [ ] Review output
- [ ] Check Cloudinary credentials in `.env`
- [ ] Run actual migration (`node migrate...js`)
- [ ] Verify database (SQL query)
- [ ] Test website (hiển thị ảnh)
- [ ] Check Cloudinary dashboard
- [ ] Delete old images (optional)
- [ ] Update frontend if needed

---

## 📞 Support

Nếu gặp lỗi:

1. Check error message trong output
2. Xem Troubleshooting section ở trên
3. Run `--dry-run` again để diagnostic
4. Restore backup nếu cần

---

**Migration Script Ready!** 🚀

Chạy `node migrateImagesToCloudinary.js --dry-run` để bắt đầu.
