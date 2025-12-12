// src/components/MainLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Outlet là nơi nội dung các trang con hiển thị */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
