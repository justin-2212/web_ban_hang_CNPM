// src/components/admin/AdminHeader.jsx

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { UserButton } from "@clerk/clerk-react";
import { Bell, Search, X, Package, ShoppingCart, User, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { sanPhamAdminAPI, donHangAdminAPI, taiKhoanAdminAPI, bienTheAdminAPI } from "../../services/adminAPI";

const AdminHeader = () => {
  const { dbUser } = useAuth();
  const navigate = useNavigate();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    products: [],
    orders: [],
    users: []
  });
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef(null);
  
  // Notification state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const notificationRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search functionality
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        handleSearch();
      } else {
        setSearchResults({ products: [], orders: [], users: [] });
        setShowSearchResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSearch = async () => {
    setSearchLoading(true);
    try {
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        sanPhamAdminAPI.getAll({ search: searchQuery }),
        donHangAdminAPI.getAll({ search: searchQuery }),
        taiKhoanAdminAPI.getAll({ search: searchQuery })
      ]);

      setSearchResults({
        products: productsRes.success ? productsRes.data.slice(0, 5) : [],
        orders: ordersRes.success ? ordersRes.data.slice(0, 5) : [],
        users: usersRes.success ? usersRes.data.slice(0, 5) : []
      });
      setShowSearchResults(true);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  // Load notifications
  const loadNotifications = async () => {
    if (notifications.length > 0) return; // Already loaded
    
    setNotificationLoading(true);
    try {
      const [ordersRes, lowStockRes] = await Promise.all([
        donHangAdminAPI.getAll({ tinhTrangDonHang: 0 }), // Đơn hàng đang xử lý
        bienTheAdminAPI.getLowStock(10) // Sản phẩm tồn kho thấp
      ]);

      const notifs = [];

      // Đơn hàng mới
      if (ordersRes.success && ordersRes.data.length > 0) {
        notifs.push({
          id: 'new-orders',
          type: 'order',
          title: `${ordersRes.data.length} đơn hàng mới`,
          message: 'Cần xử lý',
          time: 'Mới',
          icon: ShoppingCart,
          color: 'text-blue-600 bg-blue-50',
          action: () => navigate('/admin/orders?status=0')
        });
      }

      // Tồn kho thấp
      if (lowStockRes.success && lowStockRes.data.length > 0) {
        notifs.push({
          id: 'low-stock',
          type: 'warning',
          title: `${lowStockRes.data.length} sản phẩm sắp hết hàng`,
          message: 'Cần nhập thêm',
          time: 'Hôm nay',
          icon: Package,
          color: 'text-orange-600 bg-orange-50',
          action: () => navigate('/admin/products')
        });
      }

      setNotifications(notifs);
      setUnreadCount(notifs.length);
    } catch (err) {
      console.error('Load notifications error:', err);
    } finally {
      setNotificationLoading(false);
    }
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      loadNotifications();
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value || 0);
  };

  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-20">
      {/* Thanh tìm kiếm */}
      <div ref={searchRef} className="relative w-96 hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm, đơn hàng, khách hàng..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery.trim().length >= 2 && setShowSearchResults(true)}
          className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery("");
              setShowSearchResults(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}

        {/* Search Results Dropdown */}
        {showSearchResults && (
          <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50">
            {searchLoading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : (
              <>
                {/* Products */}
                {searchResults.products.length > 0 && (
                  <div className="border-b border-gray-100">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
                      SẢN PHẨM
                    </div>
                    {searchResults.products.map((product) => (
                      <button
                        key={product.MaSP}
                        onClick={() => {
                          navigate(`/admin/products/${product.MaSP}`);
                          setShowSearchResults(false);
                          setSearchQuery("");
                        }}
                        className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-left"
                      >
                        <Package className="w-4 h-4 text-blue-600" />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{product.Ten}</div>
                          <div className="text-xs text-gray-500">{product.TenLoai}</div>
                        </div>
                        <div className="text-xs text-green-600 font-medium">
                          {formatCurrency(product.GiaThapNhat)}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Orders */}
                {searchResults.orders.length > 0 && (
                  <div className="border-b border-gray-100">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
                      ĐƠN HÀNG
                    </div>
                    {searchResults.orders.map((order) => (
                      <button
                        key={order.MaDonHang}
                        onClick={() => {
                          navigate('/admin/orders');
                          setShowSearchResults(false);
                          setSearchQuery("");
                        }}
                        className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-left"
                      >
                        <ShoppingCart className="w-4 h-4 text-purple-600" />
                        <div className="flex-1">
                          <div className="font-medium text-sm">#{order.MaDonHang}</div>
                          <div className="text-xs text-gray-500">{order.TenDayDu || 'Khách hàng'}</div>
                        </div>
                        <div className="text-xs text-green-600 font-medium">
                          {formatCurrency(order.TongTien)}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Users */}
                {searchResults.users.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
                      NGƯỜI DÙNG
                    </div>
                    {searchResults.users.map((user) => (
                      <button
                        key={user.MaTaiKhoan}
                        onClick={() => {
                          navigate('/admin/users');
                          setShowSearchResults(false);
                          setSearchQuery("");
                        }}
                        className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-left"
                      >
                        <User className="w-4 h-4 text-green-600" />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{user.TenDayDu}</div>
                          <div className="text-xs text-gray-500">{user.Gmail}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* No results */}
                {searchResults.products.length === 0 && 
                 searchResults.orders.length === 0 && 
                 searchResults.users.length === 0 && (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    Không tìm thấy kết quả cho "{searchQuery}"
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Thông tin Admin */}
      <div className="flex items-center gap-6">
        {/* Nút thông báo */}
        <div ref={notificationRef} className="relative">
          <button 
            onClick={handleNotificationClick}
            className="admin-notification-btn relative p-2 text-black hover:bg-gray-100 rounded-full transition-colors bg-transparent border-none"
            style={{ 
              background: showNotifications ? '#F3F4F6' : 'transparent',
              marginTop: 0
            }}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-white text-[10px] font-bold items-center justify-center border-2 border-white">
                  {unreadCount}
                </span>
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
              <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Thông báo</h3>
                <span className="text-xs text-gray-500">{unreadCount} mới</span>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notificationLoading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : notifications.length > 0 ? (
                  notifications.map((notif) => {
                    const Icon = notif.icon;
                    return (
                      <button
                        key={notif.id}
                        onClick={() => {
                          notif.action();
                          setShowNotifications(false);
                        }}
                        className="admin-notification-item w-full px-4 py-3 hover:bg-gray-50 flex items-start gap-3 border-b border-gray-100 text-left bg-transparent"
                        style={{ marginTop: 0 }}
                      >
                        <div className={`p-2 rounded-full ${notif.color}`}>
                          <Icon size={16} />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-900">{notif.title}</div>
                          <div className="text-xs text-gray-500 mt-1">{notif.message}</div>
                          <div className="text-xs text-gray-400 mt-1">{notif.time}</div>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-gray-500 text-sm">
                    <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    Không có thông báo mới
                  </div>
                )}
              </div>

              {notifications.length > 0 && (
                <div className="px-4 py-3 border-t border-gray-200">
                  <button 
                    onClick={() => {
                      setUnreadCount(0);
                      setShowNotifications(false);
                    }}
                    className="admin-clear-btn text-sm text-blue-600 hover:text-blue-700 font-medium bg-transparent border-none"
                    style={{ marginTop: 0 }}
                  >
                    Đánh dấu đã đọc tất cả
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-gray-200"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-bold text-gray-800">
              {dbUser?.TenDayDu || "Admin"}
            </div>
            <div className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full inline-block">
              Quản trị viên
            </div>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
