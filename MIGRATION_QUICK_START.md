# 🚀 MIGRATION QUICK START - 3 Commands

## 📋 Tóm Tắt

Bạn có **425 ảnh cũ** (137 AnhSP + 288 BienThe) sẽ migrate lên Cloudinary tự động.

---

## ⚡ 3 Bước Duy Nhất

### 1️⃣ **Preview (Không thay đổi)**
```bash
node migrateImagesToCloudinary.js --dry-run
```
✅ Xem sẽ migrate 425 ảnh  
✅ Kiểm tra có lỗi không  
✅ Không thay đổi database  

### 2️⃣ **Migrate Thực Tế**
```bash
node migrateImagesToCloudinary.js
```
✅ Upload tất cả 425 ảnh lên Cloudinary  
✅ Update database tự động  
✅ Mất ~5-10 phút (tùy network)  

### 3️⃣ **Verify (Kiểm Tra)**
```sql
-- Kiểm tra AnhSP
SELECT COUNT(*) as total, 
       SUM(CASE WHEN DuongDanLuuAnh LIKE '%cloudinary%' THEN 1 ELSE 0 END) as cloudinary_count
FROM AnhSP;
-- Kỳ vọng: total = 137, cloudinary_count = 137

-- Kiểm tra BienThe  
SELECT COUNT(*) as total,
       SUM(CASE WHEN DuongDanAnhBienThe LIKE '%cloudinary%' THEN 1 ELSE 0 END) as cloudinary_count
FROM BienThe WHERE DuongDanAnhBienThe IS NOT NULL;
-- Kỳ vọng: total = 288, cloudinary_count = 288
```

---

## 📊 What Will Happen

```
Before (Local):
  /public/assets/products/iphone/image.jpg → database
  /public/assets/products/ipad/image.jpg → database

After (Cloudinary):
  https://res.cloudinary.com/dwdh18bhk/image/upload/v1234/apple-store/iphone/image.jpg → database
  https://res.cloudinary.com/dwdh18bhk/image/upload/v1234/apple-store/ipad/image.jpg → database
```

---

## ✨ Features

✅ Auto upload lên Cloudinary  
✅ Auto update database URLs  
✅ Progress tracking (show 1/425, 2/425, ...)  
✅ Error reporting chi tiết  
✅ Dry-run mode để preview  
✅ Rollback nếu cần  

---

## 📈 Expected Result

```
✅ [1/425] AnhSP 1: Upload thành công
✅ [2/425] BienThe 1: Upload thành công
...
✅ [425/425] BienThe 288: Upload thành công

📊 MIGRATION SUMMARY

AnhSP:
  Total:   137
  Success: 137 ✅
  Failed:  0

BienThe:
  Total:   288
  Success: 288 ✅
  Failed:  0

Total:
  All:     425
  Success: 425 ✅
  Failed:  0

🎉 Migration completed successfully!
```

---

## 🆘 Nếu Có Lỗi

### Error: File not found
→ File ảnh đã bị xóa hoặc path sai  
→ Kiểm tra `/public/assets/products/` còn file không  

### Error: Cloudinary upload failed
→ Check network  
→ Check .env credentials  
→ Check file size < 5MB  

### Error: DB update failed
→ Check MySQL running  
→ Check database columns exist  

---

## 📚 Full Guide

Xem [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) để:
- Detailed steps
- Troubleshooting
- Database backup
- Rollback plan
- Performance tips

---

**Ready? Start with**: `node migrateImagesToCloudinary.js --dry-run` 🚀
