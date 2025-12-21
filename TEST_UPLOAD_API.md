# 🧪 Test Cloudinary Upload APIs

## 📌 Trước tiên, start server
```bash
npm run dev:fullstack
# hoặc
npm run server
```

---

## 1️⃣ Upload Ảnh Sản Phẩm (AnhSP)

### Cách 1: Dùng cURL
```bash
# Giả sử bạn có file: image.jpg
curl -X POST http://localhost:5000/api/upload/anh-san-pham \
  -F "image=@image.jpg" \
  -F "maSP=1" \
  -F "thuTuHienThi=0"
```

### Cách 2: Dùng Postman
- **Method**: POST
- **URL**: `http://localhost:5000/api/upload/anh-san-pham`
- **Body** → Form Data:
  - `image` (File): chọn ảnh
  - `maSP` (text): `1`
  - `thuTuHienThi` (text): `0`

### Cách 3: JavaScript/Frontend
```javascript
import { uploadAPI } from '../services/api.js';

const file = document.getElementById('fileInput').files[0];
const result = await uploadAPI.uploadAnhSanPham(file, 1, 0);
console.log(result.data.duongDanLuuAnh); // URL ảnh
```

### Response Success (201)
```json
{
  "success": true,
  "message": "Upload ảnh sản phẩm thành công",
  "data": {
    "maAnh": 1,
    "duongDanLuuAnh": "https://res.cloudinary.com/dwdh18bhk/image/upload/v1234/apple-store/anh-san-pham/image.jpg",
    "thuTuHienThi": 0,
    "maSP": 1,
    "cloudinary": {
      "publicId": "apple-store/anh-san-pham/image",
      "width": 1200,
      "height": 800
    }
  }
}
```

---

## 2️⃣ Upload Ảnh Biến Thể (BienThe)

### Cách 1: cURL
```bash
curl -X POST http://localhost:5000/api/upload/anh-bien-the \
  -F "image=@variant.jpg" \
  -F "maBienThe=1"
```

### Cách 2: Postman
- **Method**: POST
- **URL**: `http://localhost:5000/api/upload/anh-bien-the`
- **Body** → Form Data:
  - `image` (File): chọn ảnh
  - `maBienThe` (text): `1`

### Cách 3: JavaScript
```javascript
const file = document.getElementById('variantInput').files[0];
const result = await uploadAPI.uploadAnhBienThe(file, 1);
console.log(result.data.duongDanAnhBienThe);
```

### Response Success (200)
```json
{
  "success": true,
  "message": "Upload ảnh biến thể thành công",
  "data": {
    "maBienThe": 1,
    "duongDanAnhBienThe": "https://res.cloudinary.com/dwdh18bhk/image/upload/v1234/apple-store/anh-bien-the/variant.jpg",
    "cloudinary": {
      "publicId": "apple-store/anh-bien-the/variant",
      "width": 1200,
      "height": 800
    }
  }
}
```

---

## 3️⃣ Upload Nhiều Ảnh (Bulk)

### Cách 1: cURL
```bash
curl -X POST http://localhost:5000/api/upload/anh-san-pham/bulk \
  -F "images=@image1.jpg" \
  -F "images=@image2.jpg" \
  -F "images=@image3.jpg" \
  -F "maSP=1"
```

### Cách 2: Postman
- **Method**: POST
- **URL**: `http://localhost:5000/api/upload/anh-san-pham/bulk`
- **Body** → Form Data:
  - `images` (File): chọn ảnh #1, #2, #3, ...
  - `maSP` (text): `1`

### Cách 3: JavaScript
```javascript
const files = document.getElementById('multiInput').files; // FileList
const result = await uploadAPI.uploadMultipleImages(Array.from(files), 1);
console.log(result.data); // Array of uploaded images
```

### Response Success (201)
```json
{
  "success": true,
  "message": "Upload 3 ảnh thành công",
  "data": [
    {
      "maAnh": 1,
      "duongDanLuuAnh": "https://res.cloudinary.com/.../image1.jpg",
      "thuTuHienThi": 0,
      "publicId": "apple-store/anh-san-pham/image1"
    },
    {
      "maAnh": 2,
      "duongDanLuuAnh": "https://res.cloudinary.com/.../image2.jpg",
      "thuTuHienThi": 1,
      "publicId": "apple-store/anh-san-pham/image2"
    },
    {
      "maAnh": 3,
      "duongDanLuuAnh": "https://res.cloudinary.com/.../image3.jpg",
      "thuTuHienThi": 2,
      "publicId": "apple-store/anh-san-pham/image3"
    }
  ]
}
```

---

## ❌ Error Cases

### 1. File Không Valid
```
Status: 400
{
  "success": false,
  "message": "Chỉ chấp nhận file ảnh (JPEG, PNG, WebP, GIF)"
}
```

### 2. File Quá Lớn (> 5MB)
```
Status: 400
{
  "success": false,
  "message": "Chỉ chấp nhận file ảnh (JPEG, PNG, WebP, GIF)"
}
```

### 3. Thiếu maSP / maBienThe
```
Status: 400
{
  "success": false,
  "message": "Thiếu maSP hoặc ảnh không hợp lệ"
}
```

### 4. SanPham / BienThe Không Tồn Tại
```
Status: 404
{
  "success": false,
  "message": "Sản phẩm không tồn tại" // hoặc "Biến thể sản phẩm không tồn tại"
}
```

### 5. Lỗi Server / Cloudinary
```
Status: 500
{
  "success": false,
  "message": "Lỗi server: [error details]"
}
```

---

## 📚 Database Verification

### Sau khi upload, kiểm tra database:

```sql
-- Kiểm tra AnhSP
SELECT * FROM AnhSP;
-- Kỳ vọng: DuongDanLuuAnh chứa URL Cloudinary

-- Kiểm tra BienThe
SELECT * FROM BienThe;
-- Kỳ vọng: DuongDanAnhBienThe chứa URL Cloudinary
```

---

## 🎯 Frontend Integration Example

### Trong React Component
```jsx
import { useState } from 'react';
import { uploadAPI } from '../services/api.js';

export function ImageUploadForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = e.target.image.files[0];
    const maSP = e.target.maSP.value;

    if (!file || !maSP) return;

    try {
      setLoading(true);
      setError(null);
      
      const result = await uploadAPI.uploadAnhSanPham(file, parseInt(maSP));
      
      setSuccess(`Upload thành công! URL: ${result.data.duongDanLuuAnh}`);
      e.target.reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <input type="number" name="maSP" placeholder="Mã sản phẩm" required />
      <input type="file" name="image" accept="image/*" required />
      <button type="submit" disabled={loading}>
        {loading ? 'Đang upload...' : 'Upload'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </form>
  );
}
```

---

## 🚀 Tips & Tricks

### 1. Test Upload Thực
Tạo test file ảnh nhỏ để test nhanh:
```bash
# Tạo ảnh test 100x100px
ffmpeg -f lavfi -i color=c=blue:s=100x100:d=1 -frames:v 1 test.jpg
```

### 2. Kiểm tra URL Ảnh
Paste URL trực tiếp vào browser để xem ảnh:
```
https://res.cloudinary.com/dwdh18bhk/image/upload/v1234/apple-store/anh-san-pham/image.jpg
```

### 3. Dùng URL Transformation
Thêm transformation trực tiếp vào URL:
```
# Thumbnail 200x200
https://res.cloudinary.com/dwdh18bhk/image/upload/w_200,h_200,c_fill,q_auto,f_auto/v1234/...

# Blur placeholder 50x50
https://res.cloudinary.com/dwdh18bhk/image/upload/w_50,h_50,q_20,f_auto/v1234/...

# Responsive (auto format WebP if supported)
https://res.cloudinary.com/dwdh18bhk/image/upload/w_auto,q_auto,f_auto/v1234/...
```

### 4. Kiểm tra Cloudinary Dashboard
Truy cập: https://cloudinary.com/console/media_library  
Xem tất cả ảnh đã upload, statistics, transformations applied, v.v.

---

## 📞 Troubleshooting

### Upload không work?
- ✅ Kiểm tra `.env` có `CLOUDINARY_*` keys không
- ✅ Kiểm tra server chạy trên `5000`
- ✅ Kiểm tra file size < 5MB
- ✅ Kiểm tra file format (JPEG, PNG, WebP, GIF)

### Ảnh không hiển thị?
- ✅ Kiểm tra URL có tồn tại không (paste vào browser)
- ✅ Kiểm tra database lưu URL chính xác không
- ✅ Kiểm tra CORS headers

### Cloudinary limit đạt?
- ✅ Check free tier quota
- ✅ Xem storage usage trong Dashboard
- ✅ Upgrade nếu cần

---

**Happy Testing! 🎉**
