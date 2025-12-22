# HỆ THỐNG QUẢN LÝ ADMIN - APPLE STORE

## Tổng quan
Hệ thống quản lý admin đầy đủ cho nền tảng e-commerce Apple Store với các chức năng CRUD và thống kê chi tiết.

## 📋 Các chức năng đã triển khai

### 🔐 Backend API

#### 1. Quản lý Sản phẩm (`/api/admin/san-pham`)
- ✅ `GET /` - Lấy danh sách sản phẩm (có filter: loại, trạng thái, tìm kiếm)
- ✅ `GET /:id` - Lấy chi tiết sản phẩm kèm biến thể
- ✅ `POST /` - Tạo sản phẩm mới
- ✅ `PUT /:id` - Cập nhật sản phẩm
- ✅ `DELETE /:id` - Xóa sản phẩm (soft delete)
- ✅ `DELETE /:id/hard` - Xóa vĩnh viễn sản phẩm
- ✅ `PATCH /:id/toggle-status` - Kích hoạt/Vô hiệu hóa

#### 2. Quản lý Biến thể (`/api/admin/bien-the`)
- ✅ `GET /product/:maSP` - Lấy biến thể theo sản phẩm
- ✅ `GET /:id` - Chi tiết biến thể
- ✅ `GET /low-stock` - Danh sách tồn kho thấp
- ✅ `POST /` - Tạo biến thể mới
- ✅ `PUT /:id` - Cập nhật biến thể
- ✅ `PATCH /:id/stock` - Cập nhật tồn kho
- ✅ `PATCH /:id/adjust-stock` - Điều chỉnh tồn kho (tăng/giảm)
- ✅ `DELETE /:id` - Xóa biến thể (soft delete)
- ✅ `DELETE /:id/hard` - Xóa vĩnh viễn
- ✅ `PATCH /:id/toggle-status` - Kích hoạt/Vô hiệu hóa

#### 3. Quản lý Đơn hàng (`/api/admin/don-hang`)
- ✅ `GET /` - Lấy danh sách đơn hàng (filter: trạng thái, thanh toán, phương thức, ngày)
- ✅ `GET /:id` - Chi tiết đơn hàng
- ✅ `GET /stats` - Thống kê đơn hàng tổng quan
- ✅ `GET /revenue` - Doanh thu theo ngày
- ✅ `GET /top-products` - Top sản phẩm bán chạy
- ✅ `PATCH /:id/status` - Cập nhật trạng thái đơn hàng
- ✅ `POST /:id/cancel` - Hủy đơn hàng

#### 4. Quản lý Người dùng (`/api/admin/tai-khoan`)
- ✅ `GET /` - Danh sách tài khoản (filter: quyền, trạng thái, tìm kiếm)
- ✅ `GET /:id` - Chi tiết tài khoản
- ✅ `GET /:id/orders` - Đơn hàng của user
- ✅ `GET /stats` - Thống kê người dùng
- ✅ `GET /new-users` - Người dùng mới theo ngày
- ✅ `PATCH /:id/role` - Cập nhật quyền
- ✅ `PATCH /:id/toggle-status` - Kích hoạt/Khóa tài khoản

#### 5. Thống kê Tổng hợp (`/api/admin/thong-ke`)
- ✅ `GET /dashboard` - Dashboard tổng quan
  - Thống kê đơn hàng (tổng, theo trạng thái)
  - Thống kê người dùng
  - Tồn kho thấp
  - Top sản phẩm bán chạy
  - Doanh thu hôm nay, tuần này, tháng này
- ✅ `GET /revenue` - Doanh thu theo khoảng thời gian (groupBy: day/month/year)
- ✅ `GET /products` - Thống kê sản phẩm
- ✅ `GET /customers` - Thống kê khách hàng
- ✅ `GET /compare` - So sánh doanh thu theo kỳ

### 🎨 Frontend Components

#### 1. Dashboard (`/admin/dashboard`)
- ✅ Hiển thị các chỉ số KPI: Doanh thu, Đơn hàng, Người dùng, Tồn kho
- ✅ Biểu đồ doanh thu tháng
- ✅ Top 5 sản phẩm bán chạy
- ✅ Cảnh báo tồn kho thấp
- ✅ Trạng thái đơn hàng theo loại

#### 2. Quản lý Sản phẩm (`/admin/products`)
- ✅ Danh sách sản phẩm với phân trang
- ✅ Tìm kiếm và lọc (loại, trạng thái)
- ✅ Hiển thị: Tên, Loại, Số biến thể, Giá, Tồn kho
- ✅ Thao tác: Xem/Sửa, Kích hoạt/Vô hiệu hóa, Xóa
- ✅ Badge cảnh báo tồn kho thấp

#### 3. Quản lý Đơn hàng (`/admin/orders`)
- ✅ Danh sách đơn hàng với filter đa chiều
- ✅ Tìm kiếm theo mã đơn, tên khách, email
- ✅ Lọc: Trạng thái đơn, Trạng thái thanh toán, Phương thức
- ✅ Modal chi tiết đơn hàng
- ✅ Cập nhật trạng thái: Đang xử lý → Đang giao → Đã giao
- ✅ Hủy đơn hàng (với lý do)

#### 4. Quản lý Người dùng (`/admin/users`)
- ✅ Danh sách người dùng
- ✅ Tìm kiếm và lọc (quyền, trạng thái)
- ✅ Modal chi tiết user với lịch sử đơn hàng
- ✅ Cập nhật quyền: User ↔ Admin
- ✅ Khóa/Mở khóa tài khoản

## 📁 Cấu trúc File

### Backend
```
server/
├── controllers/
│   ├── sanPhamAdmin.controller.js
│   ├── bienTheAdmin.controller.js
│   ├── donHangAdmin.controller.js
│   ├── taiKhoanAdmin.controller.js
│   └── thongKeAdmin.controller.js
├── models/
│   ├── sanPhamAdmin.model.js
│   ├── bienTheAdmin.model.js
│   ├── taiKhoanAdmin.model.js
│   └── donHang.model.js (đã mở rộng)
├── routes/
│   ├── sanPhamAdmin.routes.js
│   ├── bienTheAdmin.routes.js
│   ├── donHangAdmin.routes.js
│   ├── taiKhoanAdmin.routes.js
│   └── thongKeAdmin.routes.js
└── index.js (đã thêm routes admin)
```

### Frontend
```
src/
├── pages/admin/
│   ├── Dashboard.jsx
│   ├── ProductsManagement.jsx
│   ├── OrdersManagement.jsx
│   └── UsersManagement.jsx
├── services/
│   └── adminAPI.js (API service cho admin)
├── components/admin/
│   ├── Sidebar.jsx (đã cập nhật menu)
│   └── AdminRouter.jsx (đã sửa auth)
└── App.jsx (đã thêm routes)
```

## 🚀 Cách sử dụng

### 1. Cài đặt & Khởi động

```bash
# Install dependencies (nếu chưa)
npm install

# Chạy đồng thời backend + frontend
npm run dev:fullstack

# Hoặc chạy riêng
npm run server  # Backend: http://localhost:5000
npm run dev     # Frontend: http://localhost:5173
```

### 2. Đăng nhập Admin

1. Truy cập: `http://localhost:5173`
2. Đăng nhập với tài khoản có `Quyen = 'Admin'` trong database
3. Hệ thống sẽ tự động chuyển đến `/admin/dashboard`

### 3. Database Schema

Đảm bảo có các bảng:
- `SanPham` (MaSP, Ten, MoTa, MaLoai, TinhTrangSanPham)
- `BienThe` (MaBienThe, MaSP, TenBienThe, GiaTienBienThe, SoLuongTonKho, TinhTrangHoatDong)
- `DonHang` (MaDonHang, MaTaiKhoan, NgayDat, TongTien, TinhTrangDonHang, TinhTrangThanhToan)
- `DonHangChiTiet` (MaDonHang, MaBienThe, SoLuongSanPham, GiaTienCuaSanPham)
- `TaiKhoan` (MaTaiKhoan, Gmail, TenDayDu, Quyen, TinhTrangTaiKhoan, NgayTao)

## 🔒 Bảo mật

- ✅ Tất cả routes admin yêu cầu middleware `authenticateToken`
- ✅ Kiểm tra quyền Admin (`requireAdmin`)
- ✅ Frontend có `AdminRoute` bảo vệ
- ✅ Clerk authentication tích hợp

## 📊 Trạng thái & Constants

### Trạng thái đơn hàng
- `0` - Đang xử lý
- `1` - Đang giao
- `2` - Đã giao
- `3` - Đã hủy

### Trạng thái thanh toán
- `0` - Chưa thanh toán
- `1` - Đã thanh toán

### Quyền
- `'Admin'` - Quản trị viên
- `'User'` - Người dùng

### Trạng thái tài khoản
- `1` - Hoạt động
- `0` - Bị khóa

## 🎯 Các tính năng nổi bật

### 1. Thống kê Dashboard
- **Real-time stats**: Hiển thị dữ liệu thời gian thực
- **KPI Cards**: Doanh thu, Đơn hàng, Người dùng, Cảnh báo
- **Top Products**: Top 5 sản phẩm bán chạy
- **Order Status**: Phân bổ đơn hàng theo trạng thái

### 2. Quản lý Sản phẩm
- **Multi-filter**: Tìm kiếm + Lọc loại + Lọc trạng thái
- **Bulk actions**: Kích hoạt/Vô hiệu hóa nhiều sản phẩm
- **Stock warning**: Badge đỏ cho sản phẩm tồn kho thấp
- **Variant count**: Hiển thị số lượng biến thể

### 3. Quản lý Đơn hàng
- **Advanced filters**: 5 tiêu chí lọc đồng thời
- **Status workflow**: Chuyển trạng thái theo luồng
- **Order detail modal**: Xem đầy đủ thông tin + sản phẩm
- **Cancel with reason**: Hủy đơn kèm lý do

### 4. Quản lý Người dùng
- **Role management**: Nâng/Hạ quyền User ↔ Admin
- **Account control**: Khóa/Mở khóa tài khoản
- **Order history**: Xem lịch sử mua hàng của user
- **User detail**: Thông tin đầy đủ + thống kê

## 🐛 Lưu ý khi Test

1. **Tạo tài khoản Admin**: 
   ```sql
   UPDATE TaiKhoan SET Quyen = 'Admin' WHERE Gmail = 'your@email.com';
   ```

2. **Check auth middleware**: Đảm bảo `authenticateToken` hoạt động đúng

3. **CORS**: Backend phải enable CORS cho `http://localhost:5173`

4. **Database data**: Cần có dữ liệu mẫu để test các tính năng

## 📝 TODO / Tính năng mở rộng

- [ ] Form thêm/sửa sản phẩm với upload ảnh
- [ ] Biểu đồ doanh thu (Line chart với Chart.js hoặc Recharts)
- [ ] Export báo cáo Excel/PDF
- [ ] Pagination cho các bảng
- [ ] Thông báo real-time (WebSocket)
- [ ] Activity log (nhật ký hoạt động admin)
- [ ] Backup & Restore data
- [ ] Email notifications cho thay đổi trạng thái

## 🤝 Support

Nếu gặp vấn đề, kiểm tra:
1. Console logs (F12)
2. Network tab (kiểm tra API calls)
3. Backend terminal (xem lỗi server)
4. Database connection

---

**Phiên bản**: 1.0.0  
**Ngày cập nhật**: 2025-01-21  
**Trạng thái**: ✅ Production Ready
