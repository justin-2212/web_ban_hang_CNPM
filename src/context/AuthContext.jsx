//src/context/AuthContext.jsx

/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useUser } from "@clerk/clerk-react";
import { taiKhoanAPI } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { user, isLoaded } = useUser();
  const [dbUser, setDbUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    try {
      const email = user.primaryEmailAddress.emailAddress;
      const res = await taiKhoanAPI.getByEmail(email);
      
      if (res.success && res.data) {
        setDbUser(res.data);
        localStorage.setItem("dbUser", JSON.stringify(res.data));
      }
    } catch (error) {
      console.error("Lỗi sync user context:", error);
    } finally {
      setLoadingUser(false);
    }
  }, [user?.primaryEmailAddress?.emailAddress]);

  useEffect(() => {
    if (isLoaded && user) {
      refreshUser();
    } else if (isLoaded && !user) {
      setDbUser(null);
      localStorage.removeItem("dbUser");
      setLoadingUser(false);
    }
  }, [isLoaded, user?.id]);

  const value = useMemo(
    () => ({ dbUser, refreshUser, loadingUser }),
    [dbUser, refreshUser, loadingUser]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook để dùng nhanh ở các component khác
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export default AuthProvider;
