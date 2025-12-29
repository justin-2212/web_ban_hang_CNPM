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

### 📋 Yêu cầu
- **Node.js** v18+
- **MySQL** 8.0+
- Tài khoản **Clerk** (xác thực)
- Tài khoản **Cloudinary** (lưu ảnh)

### 1️⃣ Cài đặt và cấu hình

```bash
# Clone project
git clone <repo-url>
cd web-app

# Cài đặt dependencies
npm install
```

### 2️⃣ Cấu hình biến môi trường

Copy file `.env.example` thành `.env` và điền các thông tin:

```bash
cp .env.example .env
```

**Nội dung file `.env`:**

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=apple_store
DB_PORT=3306

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL
VITE_APP_URL=http://localhost:5173
VITE_API_BASE_URL=http://localhost:5000/api

# Clerk Authentication (lấy từ https://dashboard.clerk.com)
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key

# Cloudinary Configuration (lấy từ https://cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# MOMO Payment Gateway
MOMO_PARTNER_CODE=MOMO
MOMO_ACCESS_KEY=F8BBA842ECF85
MOMO_SECRET_KEY=K951B6PE1waDMi640xX08PD3vg6EkVlz
MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create

# Email Service (optional)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### 3️⃣ Cấu hình MySQL

```bash
# Tạo database và chạy migrations
mysql -u root -p < db/11_tao_database.sql

# Hoặc chạy từng file SQL theo thứ tự:
mysql -u root -p apple_store < db/01_loaiSanPham.sql
mysql -u root -p apple_store < db/02_sanPham.sql
# ... tiếp tục các file khác
```

**Reset dữ liệu (xóa tất cả):**
```bash
mysql -u root -p < db/00_reset.sql
```

### 4️⃣ Khởi động ứng dụng

```bash
# Chạy cả frontend + backend cùng lúc
npm run dev:fullstack

# HOẶC chạy riêng:
npm run dev       # Frontend: http://localhost:5173
npm run server    # Backend: http://localhost:5000
```

✅ Mở trình duyệt: **http://localhost:5173**

## 🛠️ Các lệnh phát triển

| Lệnh | Mô tả |
|------|-------|
| `npm run dev` | Chạy frontend (Vite dev server) |
| `npm run server` | Chạy backend (nodemon auto-reload) |
| `npm run dev:fullstack` | Chạy cả frontend + backend |
| `npm run build` | Build frontend production |
| `npm run seed` | Seed lại database mẫu |
| `npm run lint` | Kiểm tra lỗi ESLint |

## 📖 Hướng dẫn sử dụng chính

### 👤 Đăng nhập / Đăng ký

1. Nhấn **"Đăng nhập"** ở header
2. Dùng Clerk để tạo tài khoản (email, Google, v.v.)
3. Dữ liệu tự động đồng bộ vào MySQL
4. Có thể cập nhật thông tin ở **"Hồ sơ cá nhân"**

### 🛍️ Mua sắm

1. Xem tất cả sản phẩm ở trang **"Sản phẩm"**
2. Lọc theo **"Loại sản phẩm"** (iPhone, iPad, Mac, v.v.)
3. Click **"Chi tiết"** để xem thêm
4. Chọn **màu sắc, dung lượng** (biến thể sản phẩm)
5. Nhập số lượng → **"Thêm vào giỏ"**

### 🛒 Giỏ hàng & Thanh toán

1. Click **"Giỏ hàng"** ở header
2. Xem các sản phẩm đã thêm
3. Chỉnh sửa số lượng hoặc xóa sản phẩm
4. Nhấn **"Thanh toán"**
5. Chọn hình thức:
   - **Momo** (chuyển khoản điện tử)
   - **COD** (thanh toán khi nhận hàng)
6. Hoàn tất đơn hàng

### 📊 Trang quản trị (Admin)

**Truy cập:** `/admin` (cần tài khoản admin)

**Các tính năng:**
- 📦 **Quản lý sản phẩm** - Thêm, sửa, xóa sản phẩm
- 🎨 **Quản lý biến thể** - Quản lý màu sắc, dung lượng, giá
- 📷 **Quản lý ảnh** - Upload lên Cloudinary
- 📋 **Quản lý đơn hàng** - Xem, cập nhật trạng thái
- 👥 **Quản lý tài khoản** - Xem người dùng, quyền hạn
- 📈 **Thống kê** - Doanh thu, tổng đơn hàng, khách hàng

## 🔧 Cấu hình quan trọng

## 📦 Thư mục & file quan trọng

| Vị trí                | Mục đích                                 |
|-----------------------|------------------------------------------|
| `src/services/api.js` | Tập trung các hàm gọi API                |
| `src/context/AuthContext.jsx` | Context đồng bộ user Clerk <-> MySQL |
| `server/models/`      | Truy vấn SQL, trả về dữ liệu đã group    |
| `server/routes/`      | Định tuyến API backend                   |
| `db/`                 | File SQL khởi tạo & seed dữ liệu         |

## � Cấu hình quan trọng

### Clerk Authentication

1. Đăng ký tại [clerk.com](https://clerk.com)
2. Tạo application mới
3. Sao chép **Publishable Key**
4. Dán vào `.env`:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
   ```

### Cloudinary (Upload ảnh)

1. Đăng ký tại [cloudinary.com](https://cloudinary.com)
2. Vào **Account Settings** → **API Keys**
3. Sao chép:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
4. Dán vào `.env`:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### MySQL

Đảm bảo:
- MySQL server đang chạy
- Đã tạo database `apple_store`
- Thông tin kết nối trong `.env` chính xác

```bash
# Kiểm tra kết nối
mysql -u root -p -e "SELECT 1;"
```

## ⚠️ Khắc phục sự cố

### Frontend không kết nối backend

**Vấn đề:** Lỗi CORS hoặc API không phản hồi
```
❌ Error: Cannot POST http://localhost:5000/api/...
```

**Giải pháp:**
1. Kiểm tra backend có chạy: `npm run server`
2. Kiểm tra `VITE_API_BASE_URL` trong `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
3. Restart frontend: `npm run dev`

### MySQL kết nối thất bại

```
❌ Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Giải pháp:**
1. Khởi động MySQL:
   ```bash
   # Windows
   net start MySQL80
   
   # Mac
   mysql.server start
   ```
2. Kiểm tra thông tin trong `.env`:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   ```

### Cloudinary upload không hoạt động

```
❌ Error: Invalid Cloudinary credentials
```

**Giải pháp:**
1. Kiểm tra lại API keys trong `.env`
2. Đảm bảo không có khoảng trắng dư thừa
3. Tạo lại API Secret nếu cần

### Clerk đăng nhập không hoạt động

**Giải pháp:**
1. Kiểm tra `VITE_CLERK_PUBLISHABLE_KEY` đúng
2. Xác nhận redirect URL trong Clerk dashboard:
   - Development: `http://localhost:5173`
   - Production: your-domain.com
3. Clear cache browser & logout

## 📁 Cấu trúc thư mục chi tiết

```
web-app/
├── src/                    # Frontend (React + Vite)
│   ├── components/         # UI components
│   ├── pages/              # Các trang (Home, Products, Cart, Profile)
│   ├── services/api.js     # API calls tập trung
│   ├── context/            # Context API (Auth)
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Helper functions
│   ├── App.jsx             # Main app + routing
│   └── main.jsx            # Entry point
│
├── server/                 # Backend (Node.js/Express)
│   ├── models/             # SQL queries
│   ├── routes/             # API endpoints
│   ├── controllers/        # Business logic
│   ├── middleware/         # Auth, validation, error handling
│   ├── services/           # External services (Email, Payment)
│   ├── config/             # Database, Cloudinary, constants
│   └── index.js            # Server entry point
│
├── db/                     # SQL schema & seed data
│   ├── 00_reset.sql        # Xóa tất cả
│   ├── 01_loaiSanPham.sql  # Categories
│   ├── 02_sanPham.sql      # Products
│   └── ...
│
├── public/                 # Static assets
├── .env.example            # Environment template
├── package.json            # Dependencies
└── README.md               # Tài liệu này
```

## 🔒 Bảo mật

- ✅ **Không commit `.env`** - đã có `.gitignore`
- ✅ **Đổi secret key khi deploy** - không dùng test key
- ✅ **CORS đã bật** - nhưng giới hạn origin nếu cần
- ✅ **Password hashing** - dùng bcrypt (nếu có)
- ✅ **Rate limiting** - bảo vệ brute force attacks

## 📚 Tài liệu tham khảo

- [Clerk Documentation](https://clerk.com/docs)
- [Vite](https://vitejs.dev/)
- [React 19](https://react.dev/)
- [TailwindCSS 4](https://tailwindcss.com/)
- [Express.js](https://expressjs.com/)
- [MySQL 8](https://dev.mysql.com/doc/)
- [Cloudinary](https://cloudinary.com/documentation)
- [Framer Motion](https://www.framer.com/motion/)

## 🌐 API Endpoints

### Sản phẩm
- `GET /api/san-pham` - Lấy tất cả sản phẩm
- `GET /api/san-pham/:id` - Chi tiết sản phẩm
- `GET /api/san-pham/search?q=iphone` - Tìm kiếm

### Giỏ hàng
- `GET /api/gio-hang/:userId` - Lấy giỏ hàng
- `POST /api/gio-hang` - Thêm vào giỏ
- `PUT /api/gio-hang` - Cập nhật số lượng
- `DELETE /api/gio-hang/:id` - Xóa sản phẩm

### Tài khoản
- `GET /api/tai-khoan/:id` - Lấy thông tin user
- `GET /api/tai-khoan/get-by-email/:email` - Tìm user by email
- `PUT /api/tai-khoan/:id` - Cập nhật thông tin

### Thanh toán
- `POST /api/thanh-toan/momo` - Thanh toán Momo
- `POST /api/thanh-toan/cod` - Thanh toán COD

### Admin (yêu cầu authorization)
- `POST /api/san-pham-admin` - Tạo sản phẩm
- `PUT /api/san-pham-admin/:id` - Cập nhật sản phẩm
- `DELETE /api/san-pham-admin/:id` - Xóa sản phẩm
- `GET /api/don-hang-admin` - Quản lý đơn hàng
- `GET /api/thong-ke-admin` - Thống kê

*Xem chi tiết tại các file routes trong `server/routes/`*

## 🚀 Deploy

### Deploy Frontend (Vercel)

```bash
npm run build
# Deploy folder 'dist' lên Vercel
```

### Deploy Backend (Railway, Render, Heroku)

```bash
# Set environment variables trên platform
# Push code, nó sẽ auto-deploy
```

### Deploy Database (Planetscale, AWS RDS)

Sử dụng managed MySQL hoặc tự host

## 👥 Đóng góp

Để đóng góp:

1. Fork project này
2. Tạo branch: `git checkout -b feature/AmazingFeature`
3. Commit: `git commit -m 'Add some AmazingFeature'`
4. Push: `git push origin feature/AmazingFeature`
5. Mở Pull Request

## 📝 License

Project này không có license cụ thể. Vui lòng liên hệ chủ sở hữu.

## 📧 Liên hệ

- **Email**: support@applestore.local
- **Issue**: [GitHub Issues](https://github.com/...)
- **Slack**: [Team Workspace](https://slack.com/...)

---

**Cảm ơn bạn đã sử dụng Apple Store E-Commerce Platform! 🎉**

*Cập nhật lần cuối: 29/12/2025*
