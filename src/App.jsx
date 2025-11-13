// src/App.jsx
import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { ClerkProvider } from "@clerk/clerk-react";

// === PAGES ===
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
// import SearchPage from "./pages/Search";

// === LAYOUT ===
import Header from "./components/Header";
import Footer from "./components/Footer";

const App = ({ clerkPublishableKey }) => {
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
    <ClerkProvider publishableKey={clerkPublishableKey}>
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
          {/* <Route path="/search" element={<SearchPage />} /> */}
        </Routes>
      </main>

      {/* Footer luôn hiển thị */}
      <Footer />
    </div>
    </ClerkProvider>  
  );
};

export default App;
