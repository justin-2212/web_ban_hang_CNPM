// src/App.jsx
import React, { useEffect } from "react";
import { Routes, Route, Router } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

// === PAGES ===
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import ProductDetail from "./pages/ProductsDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";

// === ADMIN PAGES ===
import AdminDashboard from "./pages/admin/AdminDashboard"; // Import trang Admin

// === LAYOUT ===
import Header from "./components/Header";
import Footer from "./components/Footer";
import { LogIn } from "lucide-react";
import AdminRoute from "./components/AdminRouter"; // Import bảo vệ
import AuthRedirect from "./components/AuthRedirect"; // Import chuyển hướng tự động
import MainLayout from "./components/MainLayout";

const App = () => {
  // Khởi tạo AOS khi app load
  useEffect(() => {
    AOS.init({
      duration: 600, // Thời gian hiệu ứng (ms)
      once: true, // Chỉ chạy một lần khi cuộn tới
      offset: 100, // Khoảng cách trước khi hiệu ứng kích hoạt
      easing: "ease-in-out",
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Component này sẽ tự động check quyền và chuyển trang khi load web */}
      <AuthRedirect />
      {/* Nội dung chính – thay đổi theo route */}
      <Routes>
        <Route element={<MainLayout />}>
          {/* --- CÁC ROUTE khách hàng--- */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* --- CÁC ROUTE ADMIN (Được bảo vệ) --- */}
        {/* AdminRoute sẽ chặn khách thường, chỉ cho Quyen=0 đi qua */}
        <Route element={<AdminRoute />}>
          {/* Đây là dòng code bạn đang thiếu, khiến bị lỗi 404 */}
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Route 404 - Phải để cuối cùng */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
