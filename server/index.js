// server/index.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";

// ✅ Tắt logging từ dotenv
dotenv.config({ debug: false });

// === ROUTES ===
import sanPhamRoutes from "./routes/sanPham.routes.js";
import loaiSanPhamRoutes from "./routes/loaiSanPham.routes.js";
import gioHangRoutes from "./routes/gioHang.routes.js";
import taiKhoanRoutes from "./routes/taiKhoan.routes.js";
import donHangRoutes from "./routes/donHang.routes.js";
import checkoutRoutes from "./routes/checkOut.routes.js";
import thanhToanRoutes from "./routes/thanhToan.routes.js";
import loaiSanPhamAdminRoutes from "./routes/loaiSanPhamAdmin.routes.js";
import emailRoutes from "./routes/email.routes.js"; //  Bỏ comment
import thongSoAdminRoutes from "./routes/thongSoAdmin.routes.js";

// === MIDDLEWARE ===
import {
  errorHandler,
  notFound,
} from "./middleware/errorHandler.middleware.js";

const app = express();

// === SECURITY MIDDLEWARE ===
// Helmet - Set security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// === MIDDLEWARE ===
app.use(express.json());
app.use(cors());

// Request logging (development only) - Critical endpoints only
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    const criticalPaths = [
      "/api/tai-khoan",
      "/api/gio-hang",
      "/api/don-hang",
      "/api/checkout",
      "/api/thanh-toan",
      "/api/email",
    ];

    const isCritical = criticalPaths.some((path) => req.path.startsWith(path));

    if (isCritical) {
      console.log(`🔒 ${req.method} ${req.path}`);
      if (req.body && Object.keys(req.body).length > 0) {
        console.log("Body:", req.body);
      }
    }
    next();
  });
}

// === API ROUTES ===
app.use("/api/san-pham", sanPhamRoutes);
app.use("/api/loai-san-pham", loaiSanPhamRoutes);
app.use("/api/gio-hang", gioHangRoutes);
app.use("/api/tai-khoan", taiKhoanRoutes);
app.use("/api/email", emailRoutes); // ✅ Bỏ comment
app.use("/api/don-hang", donHangRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/thanh-toan", thanhToanRoutes);
app.use("/api/admin/loai-san-pham", loaiSanPhamAdminRoutes);
app.use("/api/admin/thong-so", thongSoAdminRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "API Apple Store đang hoạt động!" });
});

// === ERROR HANDLERS ===
app.use(notFound); // 404 handler
app.use(errorHandler); // Global error handler

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
