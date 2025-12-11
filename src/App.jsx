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
import SignInPage from "./pages/auth/SignInPage";
import ProductDetail from "./pages/ProductsDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
// import AuthSync from "./components/AuthSync";
import Profile from "./pages/Profile";

// === LAYOUT ===
import Header from "./components/Header";
import Footer from "./components/Footer";
import { LogIn } from "lucide-react";

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
      {/* Header luôn hiển thị */}
      <Header />
      {/* Nội dung chính – thay đổi theo route */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      {/* Footer luôn hiển thị */}
      <Footer />
    </div>
  );
};

export default App;
