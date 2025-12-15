//src/context/AuthContext.jsx

/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { taiKhoanAPI } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { user, isLoaded } = useUser();
  const [dbUser, setDbUser] = useState(null); // User từ MySQL
  const [loadingUser, setLoadingUser] = useState(true);

  // 1. Hàm đồng bộ User từ Clerk về MySQL và Load lên Context
  const refreshUser = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    try {
      const email = user.primaryEmailAddress.emailAddress;
      const fullName = user.fullName;
      const clerkId = user.id;
      // Gọi API get-by-email mà bạn đã định nghĩa trong route
      // const res = await taiKhoanAPI.getByEmail(email);
      const res = await taiKhoanAPI.syncUser({ email, fullName, clerkId });
      if (res.success && res.data) {
        setDbUser(res.data);
        // Lưu cache local để dùng khi cần gấp (tùy chọn)
        localStorage.setItem("dbUser", JSON.stringify(res.data));
      }
    } catch (error) {
      console.error("Lỗi sync user context:", error);
    } finally {
      setLoadingUser(false);
    }
  };

  // 2. Tự động chạy khi Clerk load xong
  useEffect(() => {
    if (isLoaded && user) {
      refreshUser();
    } else if (isLoaded && !user) {
      setDbUser(null);
      setLoadingUser(false);
    }
  }, [isLoaded, user]);

  return (
    <AuthContext.Provider value={{ dbUser, refreshUser, loadingUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook để dùng nhanh ở các component khác
export const useAuth = () => useContext(AuthContext);
