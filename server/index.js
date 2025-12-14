// server/index.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// === ROUTES ===
import sanPhamRoutes from "./routes/sanPham.routes.js";
import loaiSanPhamRoutes from "./routes/loaiSanPham.routes.js";
import gioHangRoutes from "./routes/gioHang.routes.js";
import taiKhoanRoutes from "./routes/taiKhoan.routes.js";
import donHangRoutes from "./routes/donHang.routes.js";
import checkoutRoutes from "./routes/checkOut.routes.js";
import thanhToanRoutes from "./routes/thanhToan.routes.js";

dotenv.config();
const app = express();

// === MIDDLEWARE ===
app.use(express.json());
app.use(cors());

// === API ROUTES ===
app.use("/api/san-pham", sanPhamRoutes);
app.use("/api/loai-san-pham", loaiSanPhamRoutes);
app.use("/api/gio-hang", gioHangRoutes);
app.use("/api/tai-khoan", taiKhoanRoutes);
app.use("/api/don-hang", donHangRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/thanh-toan", thanhToanRoutes);

// === ERROR HANDLER ===
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Test route
app.get("/", (req, res) => {
  res.json({ message: "API Apple Store đang hoạt động!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});