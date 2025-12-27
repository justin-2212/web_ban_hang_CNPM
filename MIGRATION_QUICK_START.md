````md
# MIGRATION QUICK START – HƯỚNG DẪN CHẠY NHANH

## 1. Mục đích

File này dùng để **hướng dẫn nhanh cách migrate ảnh cũ lên Cloudinary** bằng script đã chuẩn bị sẵn.  
Phù hợp cho người mới tiếp cận dự án hoặc cần chạy migration mà không đọc toàn bộ tài liệu chi tiết.

Chỉ cần thực hiện **3 bước** theo đúng thứ tự.

---

## 2. Quy trình tổng quát

Quá trình migration sẽ:
- Upload các ảnh đang lưu local lên Cloudinary
- Cập nhật lại đường dẫn ảnh trong database
- Giữ nguyên cấu trúc dữ liệu, không làm ảnh hưởng logic hệ thống

---

## 3. 3 Bước Thực Hiện

### Bước 1: Chạy thử (Preview – không thay đổi dữ liệu)

```bash
node migrateImagesToCloudinary.js --dry-run
````

Bước này dùng để:

* Xem script sẽ migrate những ảnh nào
* Phát hiện sớm lỗi (file không tồn tại, đường dẫn sai…)
* **Không upload ảnh**
* **Không cập nhật database**

Khuyến nghị **luôn chạy bước này trước** khi migrate thật.

---

### Bước 2: Chạy migrate thật

```bash
node migrateImagesToCloudinary.js
```

Khi chạy lệnh này:

* Ảnh local sẽ được upload lên Cloudinary
* Database được update tự động sang URL mới
* Script hiển thị tiến trình xử lý từng ảnh

> Lưu ý: Không tắt terminal hoặc ngắt mạng trong quá trình chạy.

---

### Bước 3: Kiểm tra lại dữ liệu

Sau khi script chạy xong, cần kiểm tra lại database để đảm bảo:

* Đường dẫn ảnh đã được cập nhật
* Không còn ảnh trỏ về thư mục local

Ví dụ:

```sql
-- Kiểm tra ảnh sản phẩm
SELECT COUNT(*) AS total,
       SUM(DuongDanLuuAnh LIKE '%cloudinary%') AS cloudinary_count
FROM AnhSP;

-- Kiểm tra ảnh biến thể
SELECT COUNT(*) AS total,
       SUM(DuongDanAnhBienThe LIKE '%cloudinary%') AS cloudinary_count
FROM BienThe
WHERE DuongDanAnhBienThe IS NOT NULL;
```

Nếu `total = cloudinary_count` → migration hoàn tất.

---

## 4. Migration sẽ thay đổi gì?

### Trước migration

* Ảnh được load từ thư mục local
* Database lưu đường dẫn local

### Sau migration

* Ảnh được load trực tiếp từ Cloudinary
* Database lưu URL Cloudinary
* Frontend không cần thay đổi logic hiển thị

---

## 5. Script hỗ trợ sẵn

* Tự động upload ảnh
* Tự động cập nhật database
* Hiển thị tiến trình xử lý
* Báo lỗi chi tiết nếu có
* Hỗ trợ chế độ chạy thử (`--dry-run`)
* Có thể rollback bằng database backup

---

## 6. Một số lỗi thường gặp

### File ảnh không tồn tại

* File đã bị xóa hoặc path trong database không đúng
* Cần kiểm tra lại thư mục ảnh local

### Upload Cloudinary thất bại

* Kiểm tra kết nối mạng
* Kiểm tra thông tin Cloudinary trong `.env`
* Kiểm tra dung lượng và định dạng ảnh

### Không update được database

* Kiểm tra MySQL đang chạy
* Kiểm tra đúng tên cột và bảng

---

## 7. Tài liệu liên quan

Để biết chi tiết hơn (backup, rollback, troubleshooting…), xem:

```
MIGRATION_GUIDE.md
```

---

## 8. Bắt đầu

Thứ tự khuyến nghị:

```bash
node migrateImagesToCloudinary.js --dry-run
```

Sau khi kiểm tra ổn định, chạy migrate thật.

---

```
```
