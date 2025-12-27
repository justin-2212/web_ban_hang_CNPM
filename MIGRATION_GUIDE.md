```md
# HƯỚNG DẪN MIGRATE ẢNH CŨ LÊN CLOUDINARY

## 1. Mục đích

Tài liệu này dùng để hướng dẫn migrate **toàn bộ ảnh đang lưu local** trong thư mục:

```

/public/assets/products/

````

lên **Cloudinary**, đồng thời **cập nhật lại đường dẫn ảnh trong database** một cách tự động thông qua script `migrateImagesToCloudinary.js`.

Tài liệu được viết để người khác trong team có thể làm theo mà không cần biết chi tiết code bên trong.

---

## 2. Nguyên lý hoạt động

Script migration hoạt động theo luồng sau:

1. Lấy danh sách ảnh từ database
   - Bảng `AnhSP`
   - Bảng `BienThe`
2. Với từng record:
   - Kiểm tra file ảnh có tồn tại trong thư mục local không
   - Nếu đường dẫn đã là Cloudinary → bỏ qua
   - Nếu là ảnh local → upload lên Cloudinary (folder `apple-store/`)
3. Sau khi upload thành công:
   - Update lại cột đường dẫn ảnh trong database
4. Kết thúc:
   - In ra báo cáo tổng hợp (success / failed)

---

## 3. Các bảng được migrate

| Bảng | Cột ảnh |
|------|--------|
| `AnhSP` | `DuongDanLuuAnh` |
| `BienThe` | `DuongDanAnhBienThe` |

---

## 4. Các chế độ chạy script

### 4.1 Dry Run (chạy thử – bắt buộc trước khi migrate thật)

```bash
node migrateImagesToCloudinary.js --dry-run
````

* Không upload ảnh
* Không update database
* Dùng để:

  * Xem số lượng ảnh sẽ migrate
  * Phát hiện lỗi path, file không tồn tại

---

### 4.2 Chỉ migrate ảnh sản phẩm (`AnhSP`)

```bash
node migrateImagesToCloudinary.js --table=anhsp
```

---

### 4.3 Chỉ migrate ảnh biến thể (`BienThe`)

```bash
node migrateImagesToCloudinary.js --table=bienthe
```

---

### 4.4 Migrate toàn bộ (mặc định)

```bash
node migrateImagesToCloudinary.js
```

hoặc

```bash
node migrateImagesToCloudinary.js --table=all
```

---

## 5. Hướng dẫn chạy từng bước

### Bước 1: Backup database (bắt buộc)

```bash
mysqldump -u root -pnucep2025 apple_store > backup_$(date +%Y%m%d_%H%M%S).sql
```

> Không chạy migration khi chưa backup database.

---

### Bước 2: Chạy dry-run để kiểm tra

```bash
node migrateImagesToCloudinary.js --dry-run
```

Ví dụ output:

```
MIGRATING ANHSP IMAGES
Tìm thấy 15 ảnh

[DRY RUN] [1/15] MaAnh 1: iphone/image1.jpg
[DRY RUN] [2/15] MaAnh 2: iphone/image2.jpg
```

Nếu không có lỗi nghiêm trọng → có thể chạy migrate thật.

---

### Bước 3: Chạy migrate thật

```bash
node migrateImagesToCloudinary.js
```

Ví dụ output:

```
MIGRATING ANHSP IMAGES
[1/15] MaAnh 1: Upload thành công

MIGRATING BIENTHE IMAGES
[1/45] MaBienThe 1: Upload thành công
```

---

### Bước 4: Kiểm tra lại database

```sql
-- Kiểm tra bảng AnhSP
SELECT COUNT(*) AS total,
       SUM(DuongDanLuuAnh LIKE '%cloudinary%') AS cloudinary_count
FROM AnhSP;

-- Kiểm tra bảng BienThe
SELECT COUNT(*) AS total,
       SUM(DuongDanAnhBienThe LIKE '%cloudinary%') AS cloudinary_count
FROM BienThe
WHERE DuongDanAnhBienThe IS NOT NULL;
```

Kết quả mong đợi:

```
total = cloudinary_count
```

---

## 6. Giải thích log & trạng thái

| Ký hiệu | Ý nghĩa                          |
| ------- | -------------------------------- |
| ✅       | Upload thành công & DB đã update |
| ❌       | Lỗi upload hoặc update DB        |
| ⚠️      | Ảnh đã là Cloudinary URL, bỏ qua |
| ℹ️      | Thông tin                        |

Ví dụ:

```
[45/45] MaBienThe 456: Upload failed - File not found
```

---

## 7. Các lỗi thường gặp

### Không kết nối được database

* Kiểm tra MySQL đang chạy
* Kiểm tra thông tin trong file `.env`
* Kiểm tra database `apple_store` tồn tại

---

### File ảnh không tồn tại

* Kiểm tra lại thư mục `/public/assets/products/`
* Hoặc chỉnh lại path trong database
* Hoặc xoá record nếu ảnh không còn dùng

---

### Upload Cloudinary thất bại

* Kiểm tra:

  * Internet
  * CLOUDINARY_API_KEY / CLOUDINARY_SECRET
  * Dung lượng và định dạng ảnh

---

## 8. Migrate số lượng lớn – lưu ý

* Không chạy nhiều instance script cùng lúc
* Có thể chia nhỏ:

  ```bash
  node migrateImagesToCloudinary.js --table=anhsp
  node migrateImagesToCloudinary.js --table=bienthe
  ```
* Nên lưu log:

  ```bash
  node migrateImagesToCloudinary.js > migration.log 2>&1
  ```

---

## 9. Sau khi migrate xong

### 9.1 Kiểm tra hiển thị ảnh trên frontend

Frontend **phải lấy URL từ database**, không hardcode path local.

```jsx
<img src={product.duongDanLuuAnh} />
```

---

### 9.2 Xoá ảnh local (tuỳ chọn)

Chỉ xoá khi chắc chắn migrate thành công 100%:

```bash
rm -rf public/assets/products/*
```

---

### 9.3 Kiểm tra Cloudinary Dashboard

* Storage
* Bandwidth
* Upload logs

---

## 10. Rollback khi có sự cố

### Restore database từ backup

```bash
mysql -u root -pnucep2025 apple_store < backup_20251221_120000.sql
```

---

## 11. Checklist

* [ ] Backup database
* [ ] Chạy dry-run
* [ ] Kiểm tra Cloudinary credentials
* [ ] Chạy migrate thật
* [ ] Verify database
* [ ] Test hiển thị ảnh
* [ ] (Tuỳ chọn) Xoá ảnh local

---

## 12. Kết luận

Script migration đã được chuẩn bị sẵn, chỉ cần làm đúng thứ tự.
Luôn **chạy `--dry-run` trước khi migrate thật** để tránh lỗi không mong muốn.

Bắt đầu bằng:

```bash
node migrateImagesToCloudinary.js --dry-run
```

```
```
