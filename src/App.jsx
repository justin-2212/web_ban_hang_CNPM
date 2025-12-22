// src/App.jsx
import React, { useEffect } from "react";
import { Routes, Route, Router } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

// === khách hàngPAGES ===
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import ProductsDetail from './pages/ProductsDetail';
import About from "./pages/About";
import Contact from "./pages/Contact";
import OrderHistory from "./pages/OrderHistory";
import WarrantyPolicy from './pages/WarrantyPolicy';
import Support from './pages/Support';
import ReturnPolicy from './pages/ReturnPolicy';
import PaymentGuide from './pages/PaymentGuide';
import ShoppingGuide from './pages/ShoppingGuide';
// === CHECKOUT & ORDER ===
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Profile from "./pages/Profile";
import OrderDetail from "./pages/OrderDetail";

// === ADMIN PAGES ===
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCategoryManagement from "./pages/admin/CategoryPage";
import ProductsManagement from "./pages/admin/ProductsManagement";
import ProductDetailManagement from "./pages/admin/ProductDetailManagement";
import OrdersManagement from "./pages/admin/OrdersManagement";
import UsersManagement from "./pages/admin/UsersManagement";
import Dashboard from "./pages/admin/Dashboard";

// === LAYOUT ===
import Header from "./components/Header";
import Footer from "./components/Footer";
import { LogIn } from "lucide-react";
import AdminRoute from "./components/admin/AdminRouter"; // Import bảo vệ admin
import CustomerRoute from "./components/CustomerRoute"; // Import bảo vệ customer
import AuthRedirect from "./components/AuthRedirect"; // Import chuyển hướng tự động
import MainLayout from "./components/MainLayout";
import AdminLayout from "./components/admin/AdminLayout";

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
        {/* --- TẤT CẢ CÁC ROUTE CUSTOMER (Chặn admin) --- */}
        <Route element={<CustomerRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductsDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            <Route path="/warranty-policy" element={<WarrantyPolicy />} />
            <Route path="/support" element={<Support />} />
            <Route path="/return-policy" element={<ReturnPolicy />} />
            <Route path="/payment-guide" element={<PaymentGuide />} />
            <Route path="/shopping-guide" element={<ShoppingGuide />} />

            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/order-detail/:id" element={<OrderDetail />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* --- CÁC ROUTE ADMIN (Được bảo vệ) --- */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            {/* Dashboard mới */}
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            
            {/* Quản lý loại sản phẩm */}
            <Route path="/admin/categories" element={<AdminCategoryManagement />} />
            
            {/* Quản lý sản phẩm */}
            <Route path="/admin/products" element={<ProductsManagement />} />
            <Route path="/admin/products/:id" element={<ProductDetailManagement />} />
            
            {/* Quản lý đơn hàng */}
            <Route path="/admin/orders" element={<OrdersManagement />} />
            
            {/* Quản lý người dùng */}
            <Route path="/admin/users" element={<UsersManagement />} />
            
            {/* Legacy dashboard (giữ lại để tương thích) */}
            <Route path="/admin/old-dashboard" element={<AdminDashboard />} />
          </Route>
        </Route>

        {/* Route 404 - Phải để cuối cùng */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
