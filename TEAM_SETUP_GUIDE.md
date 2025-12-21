# 👥 TEAM SETUP GUIDE - Cloudinary Integration

## 📋 Cho Bạn Bạn (Pull Code Mới)

Khi bạn bạn pull code về từ git, họ cần làm các bước sau để setup Cloudinary.

---

## 🎯 Tòm Tắt 4 Bước

```
Step 1: Pull code + cài dependencies (2 min)
Step 2: Setup .env Cloudinary (1 min)
Step 3: Test upload API (2 min)
Step 4: Chạy migration (optional, 5-10 min)
```

---

## 🔧 Bước 1: Pull Code & Cài Dependencies

### 1.1 Pull code từ Git
```bash
git pull origin main
# Hoặc branch khác tùy project
```

### 1.2 Cài npm packages
```bash
npm install
```
✅ Sẽ cài `cloudinary` v2.8.0 và `multer` v2.0.2 (đã trong package.json)

### 1.3 Kiểm tra files có không
```bash
# Windows PowerShell
Test-Path server/config/cloudinary.js
Test-Path server/routes/upload.routes.js
Test-Path src/services/api.js
# Tất cả phải trả về True
```

---

## 🔐 Bước 2: Setup .env Cloudinary Credentials

### 2.1 Mở file `.env`
```bash
# Dùng editor yêu thích (VSCode, Nano, Vim)
code .env
```

### 2.2 Thêm/Update 3 dòng này vào `.env`
```env
# ===============================
# Cloudinary Configuration
# ===============================
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

⚠️ **Quan trọng**: 
- Không commit `.env` lên git (mỗi dev có env riêng)
- Credentials đã shared cho bạn bạn offline / email
- Keep `.env` an toàn, không share công khai

### 2.3 Save file
```
Ctrl+S (Save)
```

---

## 🧪 Bước 3: Test Upload API (Optional)

### 3.1 Verify Cloudinary config
```bash
node testCloudinaryIntegration.js
```

Expected output:
```
✅ Cloud Name: ???
✅ API Key: Set
✅ API Secret: Set
✅ All checks completed!
```

### 3.2 Start server
```bash
# Terminal 1: Backend
npm run server
# Server running on port 5000

# Terminal 2: Frontend (optional)
npm run dev
# Frontend on port 5173
```

### 3.3 Test upload (cURL / Postman)
```bash
# Terminal 3: Test
curl -X POST http://localhost:5000/api/upload/anh-san-pham \
  -F "image=@test-image.jpg" \
  -F "maSP=1"

# Response phải có:
# { "success": true, "data": { "duongDanLuuAnh": "https://res.cloudinary.com/..." } }
```

✅ Nếu OK, quay lại bước 4

❌ Nếu có lỗi, kiểm tra:
- MySQL server running?
- `.env` credentials đúng?
- test-image.jpg tồn tại?

---

## 🚀 Bước 4: Chạy Migration (Optional Nếu Có Ảnh Cũ)

### 4.1 Preview migration
```bash
node migrateImagesToCloudinary.js --dry-run
```

Output:
```
ℹ️ Tìm thấy 137 ảnh AnhSP
ℹ️ Tìm thấy 288 ảnh BienThe
[DRY RUN] [1/425] MaAnh 1: ... → Cloudinary
...
This was a DRY RUN. Run without --dry-run to actually migrate.
```

### 4.2 Nếu muốn migrate (không bắt buộc)
```bash
# Backup database trước
mysqldump -u root -pnucep2025 apple_store > backup_$(date +%Y%m%d_%H%M%S).sql

# Chạy migration
node migrateImagesToCloudinary.js
# Mất ~5-10 phút tùy network
```

### 4.3 Verify migration (Nếu chạy)
```sql
-- Kiểm tra AnhSP
SELECT COUNT(*) as total, 
       SUM(CASE WHEN DuongDanLuuAnh LIKE '%cloudinary%' THEN 1 ELSE 0 END) as migrated
FROM AnhSP;
-- Kỳ vọng: total = migrated = 137

-- Kiểm tra BienThe
SELECT COUNT(*) as total,
       SUM(CASE WHEN DuongDanAnhBienThe LIKE '%cloudinary%' THEN 1 ELSE 0 END) as migrated
FROM BienThe WHERE DuongDanAnhBienThe IS NOT NULL;
-- Kỳ vọng: total = migrated = 288
```

---

## ✅ Checklist Setup

Bạn bạn cần tick hết các điều này:

- [ ] Pull code từ git
- [ ] `npm install` chạy thành công
- [ ] 3 files Cloudinary tồn tại:
  - `server/config/cloudinary.js`
  - `server/routes/upload.routes.js`
  - `src/services/api.js`
- [ ] `.env` có 3 dòng Cloudinary credentials
- [ ] `testCloudinaryIntegration.js` chạy OK
- [ ] `npm run server` start thành công (port 5000)
- [ ] Test upload (curl/Postman) thành công
- [ ] (Optional) Migration chạy OK

---

## 📚 Tài Liệu Tham Khảo

| File | Mục Đích |
|------|---------|
| [CLOUDINARY_QUICK_START.md](CLOUDINARY_QUICK_START.md) | Quick reference |
| [CLOUDINARY_GUIDE.md](CLOUDINARY_GUIDE.md) | Full guide + API docs |
| [MIGRATION_QUICK_START.md](MIGRATION_QUICK_START.md) | Migration 3-step guide |
| [TEST_UPLOAD_API.md](TEST_UPLOAD_API.md) | Test examples (cURL, Postman) |

---

## 🆘 Troubleshooting

### Problem: "Cannot find module 'cloudinary'"
```bash
Solution:
npm install cloudinary multer
```

### Problem: ".env credentials not loaded"
```
Solution:
- Check .env file exists in root directory
- Check 3 lines: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
- Restart server: npm run server
```

### Problem: "Cloudinary upload failed"
```
Solution:
- Check network connection
- Check credentials in .env correct
- Check file size < 5MB
- Check file format (JPEG, PNG, WebP, GIF)
```

### Problem: "MySQL connection failed"
```
Solution:
- Start MySQL server
- Check .env DB credentials: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
```

### Problem: "Migration stuck / slow"
```
Solution:
- Upgrade to paid Cloudinary plan
- Check network latency (ping cloudinary.com)
- Run in off-peak hours
- Contact admin if needed
```

---

## 💬 Questions?

Nếu bạn bạn có câu hỏi:
1. Đọc [CLOUDINARY_GUIDE.md](CLOUDINARY_GUIDE.md)
2. Run test: `node testCloudinaryIntegration.js`
3. Check logs: `npm run server` (xem error detail)
4. Ask lead/admin

---

## 🎯 Final Steps to Start Development

```bash
# 1. All setup done? Start backend
npm run server

# 2. In another terminal, start frontend
npm run dev

# 3. Open browser
http://localhost:5173

# 4. Ready to code! 🚀
```

---

**Total Time**: ~10 minutes (without migration)  
**Difficulty**: Easy ⭐⭐☆☆☆

---

## 📝 Version Info

- **Date**: 2025-12-21
- **Cloudinary**: v2.8.0
- **Node**: v18+ recommended
- **Status**: Ready for team development ✅
