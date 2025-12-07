import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Routes
import sanPhamRoutes from './routes/sanPham.routes.js';
import loaiSanPhamRoutes from './routes/loaiSanPham.routes.js';
import gioHangRoutes from './routes/gioHang.routes.js';
// import taiKhoanRoutes from './routes/taiKhoan.routes.js';
// import donHangRoutes from './routes/donHang.routes.js';

// Use Routes
app.use('/api/san-pham', sanPhamRoutes);
app.use('/api/loai-san-pham', loaiSanPhamRoutes);
app.use('/api/gio-hang', gioHangRoutes);
// app.use('/api/tai-khoan', taiKhoanRoutes);
// app.use('/api/don-hang', donHangRoutes);

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'API Apple Store đang hoạt động!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});