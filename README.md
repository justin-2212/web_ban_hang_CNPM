# Apple Store E-Commerce Platform

> Nền tảng thương mại điện tử bán sản phẩm Apple, xây dựng full-stack với **React 19 (Vite + TailwindCSS)**, **Node.js/Express** và **MySQL**.

---

## 🚀 Tính năng nổi bật

- Đăng nhập/xác thực hiện đại với Clerk, đồng bộ dữ liệu người dùng về MySQL
- Quản lý sản phẩm, biến thể (màu, dung lượng, giá riêng từng biến thể)
- Giỏ hàng, đặt hàng, thanh toán qua Momo hoặc COD
- Quản trị viên quản lý sản phẩm, đơn hàng, thống kê
- Tối ưu UI/UX với TailwindCSS, Framer Motion, AOS animation
- Ảnh sản phẩm lưu Cloudinary, tối ưu tốc độ tải

## 🏗️ Kiến trúc dự án

### Frontend
- **React 19 + Vite**
- **TailwindCSS 4**
- **Clerk** (auth)
- **Framer Motion, AOS** (animation)
- **Thư mục chính:**
	- `src/components/` (UI components)
	- `src/pages/` (các trang)
	- `src/services/api.js` (API tập trung)
	- `src/context/AuthContext.jsx` (đồng bộ user)

### Backend
- **Node.js/Express**
- **MySQL 8+** (kết nối qua mysql2/promise)
- **Cấu trúc:**
	- `server/models/` (truy vấn SQL)
	- `server/routes/` (định tuyến API)
	- `server/controllers/` (logic xử lý)
	- `server/config/` (kết nối DB, Cloudinary, hằng số)

### Database
- Thiết kế chuẩn hóa, tên bảng/column tiếng Việt viết tắt
- Sản phẩm, biến thể, loại sản phẩm, tài khoản, giỏ hàng, đơn hàng
- Xem chi tiết: `db/` và file hướng dẫn

## ⚡️ Khởi động nhanh

```bash
# 1. Cài đặt dependencies
npm install

# 2. Tạo file .env (xem ví dụ trong hướng dẫn)

# 3. Khởi động fullstack (frontend + backend)
npm run dev:fullstack

# 4. Truy cập frontend: http://localhost:5173
#    Backend API: http://localhost:5000/api
```

## 🛠️ Các lệnh phát triển

- `npm run dev`           : Chạy frontend (Vite)
- `npm run server`        : Chạy backend (nodemon)
- `npm run dev:fullstack` : Chạy cả frontend + backend
- `npm run build`         : Build frontend production
- `npm run seed`          : Seed lại database mẫu

## 📦 Thư mục & file quan trọng

| Vị trí                | Mục đích                                 |
|-----------------------|------------------------------------------|
| `src/services/api.js` | Tập trung các hàm gọi API                |
| `src/context/AuthContext.jsx` | Context đồng bộ user Clerk <-> MySQL |
| `server/models/`      | Truy vấn SQL, trả về dữ liệu đã group    |
| `server/routes/`      | Định tuyến API backend                   |
| `db/`                 | File SQL khởi tạo & seed dữ liệu         |

## 🔒 Bảo mật & lưu ý

- Không commit file `.env` lên git
- Đổi secret key, access key khi deploy thật
- Đảm bảo backend bật CORS cho frontend
- Đọc kỹ các file hướng dẫn: `MIGRATION_GUIDE.md`

## 📚 Tài liệu tham khảo

- [Clerk Docs](https://clerk.com/docs)
- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Express](https://expressjs.com/)
- [MySQL](https://dev.mysql.com/doc/)

---

> Mọi thắc mắc hoặc đóng góp, vui lòng liên hệ nhóm phát triển!
