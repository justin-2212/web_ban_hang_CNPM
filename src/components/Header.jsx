import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Search, X } from "lucide-react";
import AppleLogo from "../assets/logo.png";
import { productsData } from "../data/productsData";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
} from "@clerk/clerk-react";

import { CircleUser } from "lucide-react";

const Header = () => {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const searchRef = useRef(null);

  // Đóng search khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cập nhật số lượng giỏ hàng
  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartCount(total);
    };
    updateCart();
    window.addEventListener("cartUpdated", updateCart);
    return () => window.removeEventListener("cartUpdated", updateCart);
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);
    if (!value.trim()) {
      setFiltered([]);
      return;
    }
    const results = productsData.filter((item) =>
      item.name.toLowerCase().includes(value)
    );
    setFiltered(results);
  };

  const clearSearch = () => {
    setQuery("");
    setFiltered([]);
    setShowSearch(false);
  };

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white shadow-sm sticky top-0 z-50">
      {/* Logo + Tên cửa hàng */}
      <Link to="/" className="flex items-center space-x-2">
        <img
          src={AppleLogo}
          alt="Apple Logo"
          className="w-12 h-12 object-contain"
        />
        <h2 className="text-2xl font-semibold text-gray-800">Apple Store</h2>
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
        {/* Search */}
        <div className="relative" ref={searchRef}>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="hover:text-black transition"
          >
            <Search className="w-6 h-6" />
          </button>

          {/* Dropdown tìm kiếm */}
          {showSearch && (
            <div className="absolute right-0 top-12 bg-white shadow-xl border rounded-xl p-3 w-72">
              <div className="flex items-center mb-2">
                <input
                  type="text"
                  value={query}
                  onChange={handleSearch}
                  placeholder="Tìm sản phẩm..."
                  className="w-full border px-3 py-2 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={clearSearch}
                  className="ml-2 text-gray-500 hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Kết quả tìm kiếm */}
              {filtered.length > 0 && (
                <div className="max-h-64 overflow-y-auto">
                  {filtered.map((item) => (
                    <Link
                      key={item.id}
                      to={`/products/${item.id}`}
                      className="flex items-center gap-3 px-2 py-2 hover:bg-gray-100 rounded-lg transition"
                      onClick={clearSearch}
                    >
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          ${item.price.toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Không tìm thấy */}
              {query && filtered.length === 0 && (
                <p className="text-gray-500 text-center text-sm py-2">
                  Không tìm thấy sản phẩm
                </p>
              )}
            </div>
          )}
        </div>

        {/* Giỏ hàng */}
        <Link to="/cart" className="relative hover:text-black transition">
          <ShoppingBag className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </Link>

        {/* Authentication */}
        <SignedIn>
          <UserButton />
        </SignedIn>

        <SignedOut>
        <SignInButton> 
          <div className="px-5 py-2 bg-red-600 text-white font-bold text-xl hover:bg-red-700 cursor-pointer transition flex items-center gap-2 rounded-full shadow-sm">
            Đăng nhập
            <CircleUser /> {/*thêm icon*/}
          </div>
        </SignInButton>
      </SignedOut>

      </div>
    </header>
  );
};

export default Header;
