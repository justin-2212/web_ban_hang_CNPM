// src/components/AuthRedirect.jsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthRedirect = () => {
  const { dbUser, loadingUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loadingUser && dbUser) {
      // Logic: Nếu là Nhân viên (Quyen = 0) VÀ đang ở trang chủ (/)
      // Thì chuyển hướng sang trang Admin
      if (dbUser.Quyen === 0 && location.pathname === "/") {
        navigate("/admin");
      }
      // Nếu là Khách hàng (Quyen = 1) -> Giữ nguyên (Mặc định ở trang chủ)
    }
  }, [dbUser, loadingUser, navigate, location.pathname]);

  return null; // Component này không hiển thị gì cả, chỉ chạy logic
};

export default AuthRedirect;
