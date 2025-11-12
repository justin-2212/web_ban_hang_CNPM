import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Search } from "lucide-react";
import AppleLogo from "../assets/logo.png";

// --- Clerk imports ---
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
} from "@clerk/clerk-react";

const Header = () => {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white shadow-sm sticky top-0 z-50">
      {/* Logo + Tên */}
      {/* Dùng Link để click vào logo thì chuyển hướng đến trang chủ */}
      <Link to="/" className="bg-apple-blue text-white px-6 py-3 rounded-full">
        <div className="flex items-center space-x-2">
          <img
            src={AppleLogo}
            alt="Apple Logo"
            className="w-12 h-12 object-contain"
          />
          <h2 className="text-2xl font-semibold text-gray-800">Apple Store</h2>
        </div>
      </Link>

      {/* Navigation */}

      <nav className="hidden md:flex space-x-10 text-gray-700 text-xl font-medium">
        <Link to="/" className="hover:text-black transition">
          Trang chủ
        </Link>
        <Link to="/products" className="hover:text-black transition">
          Sản phẩm
        </Link>
        <Link to="/about" className="hover:text-black transition">
          Thông tin thêm
        </Link>
        <Link to="/contact" className="hover:text-black transition">
          Liên hệ
        </Link>
      </nav>

      {/* Icon Section */}
      <div className="flex items-center space-x-4">
        <Link to="/search" className="hover:text-black transition">
          <Search className="w-6 h-6" />
        </Link>

        <Link to="/cart" className="relative hover:text-black transition">
          <ShoppingBag className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            0
          </span>
        </Link>

        {/* --- Clerk authentication --- */}
        <SignedIn>
          <UserButton />
        </SignedIn>

        <SignedOut>
          <SignInButton>
            <button className="px-4 py-2 bg-white text-red-600 border border-red-600 rounded hover:bg-red-50">
              Đăng nhập
            </button>
          </SignInButton>
        </SignedOut>
      </div>
    </header>
  );
};

export default Header;
