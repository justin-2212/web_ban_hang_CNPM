// src/components/Header.jsx

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import {
  ShoppingBag,
  Search,
  X,
  Loader2,
  ArrowRight,
  CircleUser,
  Trash2,
  Clock,
} from "lucide-react";
import AppleLogo from "../assets/logo.png";
import { sanPhamAPI, gioHangAPI } from "../services/api";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
} from "@clerk/clerk-react";
import { useAuth } from "../context/AuthContext";
import { useSearchHistory } from "../hooks/useSearchHistory";

const Header = () => {
  const navigate = useNavigate();
  const { dbUser, loadingUser } = useAuth();
  const { history, addSearch, clearHistory, removeItem } = useSearchHistory();

  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchTimeoutRef = useRef(null);

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

  // Auto focus khi mở search
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // Fetch cart count
  useEffect(() => {
    let isMounted = true;

    const fetchCartCount = async () => {
      if (!dbUser?.MaTaiKhoan) {
        if (isMounted) setCartCount(0);
        return;
      }

      try {
        const res = await gioHangAPI.get(dbUser.MaTaiKhoan);
        if (isMounted) {
          const total = res.data?.totalItems ?? 0;
          setCartCount(total);
        }
      } catch (err) {
        if (isMounted) setCartCount(0);
      }
    };

    if (!loadingUser && dbUser?.MaTaiKhoan) {
      fetchCartCount();
    } else if (!dbUser?.MaTaiKhoan) {
      setCartCount(0);
    }

    const handleCartUpdate = () => {
      if (isMounted && dbUser?.MaTaiKhoan) {
        fetchCartCount();
      }
    };

    window.addEventListener("cartServerUpdated", handleCartUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener("cartServerUpdated", handleCartUpdate);
    };
  }, [dbUser?.MaTaiKhoan, loadingUser]);

  // Tìm kiếm logic
  const handleSearch = (value) => {
    setQuery(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!value.trim()) {
      setFiltered([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);

    searchTimeoutRef.current = setTimeout(() => {
      sanPhamAPI
        .search(value)
        .then((res) => {
          setFiltered(res.data || []);
        })
        .catch(() => {
          setFiltered([]);
        })
        .finally(() => {
          setSearchLoading(false);
        });
    }, 500);
  };

  const clearSearch = () => {
    setQuery("");
    setFiltered([]);
    setShowSearch(false);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  };

  const handleSearchResultClick = (productId) => {
    addSearch(query);
    clearSearch();
    navigate(`/products/${productId}`);
  };

  const handleHistoryClick = (historyQuery) => {
    setQuery(historyQuery);
    handleSearch(historyQuery);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      addSearch(query);
      navigate(`/products?search=${encodeURIComponent(query)}`);
      clearSearch();
    }
  };

  // --- STYLES ---
  const navLinkStyle = ({ isActive }) =>
    `hover:text-blue-600 transition-colors relative group py-2 ${
      isActive ? "text-blue-600 font-bold" : "text-gray-800 font-semibold"
    }`;

  const mobileNavLinkStyle = ({ isActive }) =>
    `font-medium transition-colors ${
      isActive ? "text-blue-600 font-bold" : "text-gray-700 hover:text-blue-600"
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* --- LOGO --- */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img
              src={AppleLogo}
              alt="Apple Logo"
              className="w-14 h-14 object-contain transition-transform group-hover:scale-110"
            />
            <div className="hidden md:block">
              <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                Apple Store
              </h2>
              <p className="text-xs text-gray-500">Chính hãng VN/A</p>
            </div>
          </Link>

          {/* --- NAVIGATION --- */}
          <nav className="hidden lg:flex items-center space-x-12 text-xl font-semibold text-gray-800">
            {[
              { to: "/", label: "Trang chủ" },
              { to: "/products", label: "Sản phẩm" },
              { to: "/about", label: "Về chúng tôi" },
              { to: "/contact", label: "Liên hệ" },
            ].map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={navLinkStyle}
                end={link.to === "/"}
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    ></span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* --- RIGHT ACTIONS --- */}
          <div className="flex items-center space-x-4">
            {/* --- SEARCH BUTTON --- */}
            <div className="relative" ref={searchRef}>
              <button
                onClick={() => setShowSearch(!showSearch)}
                className={`group flex items-center gap-2 transition-all duration-300 rounded-full
                  !bg-white !bg-none !mt-0
                  !border-2 !border-red-500
                  ${showSearch ? "ring-2 !ring-red-200" : ""}
                  h-10 px-3 md:w-56 md:px-4 cursor-text
                `}
              >
                <Search className="w-5 h-5 !text-red-600" />
                <span className="hidden md:block text-sm !text-red-600 font-medium">
                  Tìm kiếm...
                </span>
              </button>

              {/* SEARCH DROPDOWN */}
              {showSearch && (
                <div className="absolute right-0 top-14 bg-white/90 backdrop-blur-2xl border border-gray-200 rounded-2xl w-[90vw] md:w-[450px] max-h-[500px] overflow-hidden z-50 shadow-2xl origin-top-right animate-in fade-in zoom-in-95 duration-200">
                  <form onSubmit={handleSearchSubmit} className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 !text-red-500" />
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={query}
                          onChange={(e) => handleSearch(e.target.value)}
                          placeholder="Nhập tên sản phẩm..."
                          className="w-full pl-10 pr-3 py-2.5 !bg-white border border-gray-200 focus:!border-red-300 rounded-xl text-sm !text-red-600 placeholder-red-300 focus:ring-4 focus:ring-red-100 transition-all outline-none"
                        />
                        {searchLoading && (
                          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 !text-red-500 animate-spin" />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors !bg-transparent !mt-0"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </form>

                  <div className="max-h-96 overflow-y-auto">
                    {filtered.length > 0 ? (
                      <div className="p-2 space-y-1">
                        <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Sản phẩm gợi ý
                        </div>
                        {filtered.map((item) => (
                          <button
                            key={item.MaSP}
                            onClick={() => handleSearchResultClick(item.MaSP)}
                            className="w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-50 rounded-xl transition-colors text-left group !bg-transparent hover:!bg-gray-50 !mt-0"
                          >
                            <div className="w-12 h-12 bg-white border border-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                              <span className="text-xl">📱</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                                {item.Ten}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {item.TenLoai}
                              </p>
                            </div>
                            <div className="flex items-center text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                              Xem <ArrowRight className="w-3 h-3 ml-1" />
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : query ? (
                      <div className="text-center py-10 px-4">
                        <div className="text-4xl mb-3">🔍</div>
                        <p className="text-gray-500 text-sm">
                          Không tìm thấy sản phẩm "{query}"
                        </p>
                      </div>
                    ) : (
                      <div className="p-4">
                        {history.length > 0 && (
                          <>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                  Lịch sử tìm kiếm
                                </p>
                              </div>
                              <button
                                onClick={clearHistory}
                                className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 !mt-0"
                              >
                                <Trash2 className="w-3 h-3" />
                                Xóa tất cả
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {history.map((item) => (
                                <div
                                  key={item}
                                  className="group relative flex items-center"
                                >
                                  <button
                                    onClick={() => handleHistoryClick(item)}
                                    className="px-3 py-1.5 !bg-gray-100 hover:!bg-blue-100 !text-gray-700 hover:!text-blue-600 text-sm rounded-lg border border-gray-200 transition-all !mt-0"
                                  >
                                    {item}
                                  </button>
                                  <button
                                    onClick={() => removeItem(item)}
                                    className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 !mt-0"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                            Từ khóa phổ biến
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {["iPhone 15", "MacBook", "iPad", "AirPods"].map(
                              (tag) => (
                                <button
                                  key={tag}
                                  onClick={() => handleHistoryClick(tag)}
                                  className="px-3 py-1 !bg-white hover:!bg-gray-100 !text-gray-600 text-sm rounded-lg border border-gray-100 transition-colors !mt-0"
                                >
                                  {tag}
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* --- CART --- */}
            <Link
              to="/cart"
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors group"
              aria-label="Giỏ hàng"
            >
              <ShoppingBag className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-bold px-1.5 shadow-lg animate-bounce">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* --- AUTH --- */}
            <SignedIn>
              <div className="flex items-center gap-2">
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `md:flex items-center gap-2 px-3 py-1.5 transition-colors relative group ${
                      isActive
                        ? "text-blue-600 font-bold"
                        : "text-gray-700 hover:text-blue-600"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <CircleUser className="w-4 h-4" />
                      <span>Địa chỉ của tôi</span>
                      <span
                        className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${
                          isActive ? "w-full" : "w-0 group-hover:w-full"
                        }`}
                      ></span>
                    </>
                  )}
                </NavLink>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9 ring-2 ring-blue-500 ring-offset-2",
                    },
                  }}
                />
              </div>
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-full hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 !mt-0">
                  <CircleUser className="w-5 h-5" />
                  <span className="hidden sm:inline">Đăng nhập</span>
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </div>

      {/* --- MOBILE NAV --- */}
      <div className="lg:hidden border-t border-gray-100 bg-white">
        <nav className="container mx-auto px-6 py-3 flex items-center justify-around text-sm">
          <NavLink to="/" className={({ isActive }) => `hover:text-blue-600 transition-colors relative group py-2 ${isActive ? "text-blue-600 font-bold" : "text-gray-800 font-semibold"}`} end>
            Trang chủ
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => `hover:text-blue-600 transition-colors relative group py-2 ${isActive ? "text-blue-600 font-bold" : "text-gray-800 font-semibold"}`}>
            Sản phẩm
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `hover:text-blue-600 transition-colors relative group py-2 ${isActive ? "text-blue-600 font-bold" : "text-gray-800 font-semibold"}`}>
            Về chúng tôi
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `hover:text-blue-600 transition-colors relative group py-2 ${isActive ? "text-blue-600 font-bold" : "text-gray-800 font-semibold"}`}>
            Liên hệ
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
