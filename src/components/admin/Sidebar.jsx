// src/components/admin/Sidebar.jsx

import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Store,
  Layers,
  Settings,
} from "lucide-react";
import AppleLogo from "../../assets/logo.png"; // Đảm bảo đường dẫn logo đúng

const Sidebar = () => {
  // Định nghĩa danh sách menu để dễ quản lý
  const menuItems = [
    {
      path: "/admin",
      icon: <LayoutDashboard size={20} />,
      label: "Tổng quan",
      end: true,
    },
    { path: "/admin/products", icon: <Package size={20} />, label: "Sản phẩm" },
    {
      path: "/admin/categories", // Đường dẫn sẽ trỏ tới trang Quản lý loại
      icon: <Layers size={20} />,
      label: "Loại sản phẩm",
    },
    {
      path: "/admin/orders",
      icon: <ShoppingBag size={20} />,
      label: "Đơn hàng",
    },
    { path: "/admin/users", icon: <Users size={20} />, label: "Khách hàng" },
  ];

  // Style cho từng link (Active vs Inactive)
  const linkStyle = "relative group flex items-center gap-3 px-4 py-3 ";

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 z-30">
      {/* --- LOGO --- */}
      <div className="h-20 flex items-center gap-3 px-6 border-b border-gray-100">
        <img src={AppleLogo} alt="Logo" className="w-8 h-8 object-contain" />
        <span className="font-bold text-xl text-gray-800">Admin</span>
      </div>

      {/* --- MENU LIST --- */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
          Quản lý chính
        </div>

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={linkStyle}
            end={item.end} // end=true để Dashboard không bị sáng khi vào trang con
          >
            {({ isActive }) => (
              <>
                {item.icon}
                <span>{item.label}</span>
                {/* Đường kẻ animation */}
                <span
                  className={`absolute bottom-0 left-0 h-[3px] bg-blue-600 rounded-t-sm transition-all duration-300 ease-out ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </>
            )}
          </NavLink>
        ))}

        <div className="my-4 border-t border-gray-100"></div>

        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
          Hệ thống
        </div>

        {/* Link về trang bán hàng */}
        <Link to="/" className={linkStyle} state={{ fromAdmin: true }}>
          <Store size={20} />
          <span>Về trang bán hàng</span>
          <span className="absolute bottom-0 left-0 h-[3px] bg-blue-600 rounded-t-sm w-0 group-hover:w-full transition-all duration-300 ease-out"></span>
        </Link>
      </nav>

      {/* --- FOOTER SIDEBAR --- */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-4 py-2 text-sm text-gray-500">
          <Settings size={16} />
          <span>Phiên bản 1.0.0</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
