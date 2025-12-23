// src/components/AuthSync.jsx

import { useEffect } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { taiKhoanAPI } from "../services/api"; // Import API chuẩn từ file api.js
import { useAuth } from "../context/AuthContext"; // Import context để refresh user

const AuthSync = () => {
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk(); //  Lấy hàm signOut từ Clerk
  const { refreshUser } = useAuth(); // Lấy hàm refresh từ context
  const navigate = useNavigate();

  useEffect(() => {
    const syncUserToDB = async () => {
      // Chỉ chạy khi đã đăng nhập và có thông tin user từ Clerk
      if (isSignedIn && user) {
        const email = user.primaryEmailAddress?.emailAddress;
        const fullName = user.fullName;
        const clerkId = user.id;

        try {
          // GỌI API ĐỒNG BỘ (Sử dụng hàm đã định nghĩa trong api.js để đảm bảo đúng URL)
          // URL thực tế sẽ là: http://localhost:5000/api/tai-khoan/sync-user
          const res = await taiKhoanAPI.syncUser({
            email,
            fullName,
            clerkId,
          });

          if (res.success) {
            console.log("Đồng bộ user thành công:", res.data);

            // Quan trọng: Gọi hàm này để AuthContext cập nhật lại dbUser ngay lập tức
            await refreshUser();

            // Logic chuyển trang (Admin/User)
            if (res.data.Quyen === 0) {
              // Lấy đường dẫn hiện tại
              const currentPath = window.location.pathname;

              // Chỉ chuyển hướng về Dashboard nếu đang ở trang chủ (/)
              // hoặc trang đăng nhập/đăng ký.
              // Nếu đang ở /admin/products hay /admin/categories thì GIỮ NGUYÊN.
              if (
                currentPath === "/" ||
                currentPath.includes("/sign-in") ||
                currentPath.includes("/sign-up")
              ) {
                navigate("/admin/dashboard");
              }
            } else {
              // Nếu đang ở trang login/signup thì chuyển về home
              if (
                window.location.pathname.includes("/sign-in") ||
                window.location.pathname.includes("/sign-up")
              ) {
                navigate("/");
              }
            }
          }
        } catch (error) {
          // 3. BẮT LỖI TÀI KHOẢN BỊ KHÓA Ở ĐÂY
          // Kiểm tra nếu lỗi trả về từ server có status 403 hoặc message khóa
          console.log("Log lỗi chi tiết:", error); // Để debug xem cấu trúc lỗi thực tế

          // Lấy tin nhắn lỗi (ưu tiên message từ Error object)
          const errorMessage = error.message || "Lỗi không xác định";

          // Kiểm tra xem lỗi có phải do bị khóa hay không dựa trên 3 trường hợp:
          // 1. Backend trả về 403 (nếu dùng axios)
          // 2. Message chứa từ "bị khóa" (do api.js ném Error string)
          // 3. Có cờ isLocked từ dữ liệu trả về
          const isLocked =
            error.response?.status === 403 ||
            errorMessage.includes("bị khóa") || // <--- Đây là dòng sửa lỗi cho trường hợp của bạn
            error.response?.data?.isLocked;

          if (isLocked) {
            // 1. Hiện thông báo
            alert("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Admin!");

            // 2. Đăng xuất Clerk ngay lập tức
            await signOut();

            // 3. Đẩy về trang chủ
            navigate("/");
          } else {
            console.error("Lỗi đồng bộ user (Không phải khóa):", error);
          }
        }
      }
    };

    syncUserToDB();
  }, [isSignedIn, user, navigate, refreshUser, signOut]);

  return null; // Component này chạy ngầm, không hiển thị UI
};

export default AuthSync;

// import { useEffect } from 'react';
// import { useUser } from '@clerk/clerk-react';
// import { useNavigate } from 'react-router-dom';
// import { taiKhoanAPI } from '../services/api'; // Import API chuẩn từ file api.js
// import { useAuth } from '../context/AuthContext'; // Import context để refresh user

// const AuthSync = () => {
//   const { user, isSignedIn } = useUser();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const syncUserToDB = async () => {
//       // Chỉ chạy khi đã đăng nhập
//       if (isSignedIn && user) {
//         const email = user.primaryEmailAddress?.emailAddress;
//         const fullName = user.fullName;
//         const clerkId = user.id; // Lấy Clerk ID

//         try {
//           // Gọi API Backend
//           const response = await fetch('http://localhost:5000/api/users/sync-user', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ email, fullName, clerkId }), // Gửi ClerkID đi
//           });

//           const result = await response.json();

//           if (result.success) {
//             // Lưu thông tin user vào localStorage để dùng dần
//             localStorage.setItem('currentUser', JSON.stringify(result.data));

//             // Logic chuyển trang (Admin/User)
//             if (result.data.Quyen === 0) {
//                 navigate('/admin');
//             } else {
//                 // Nếu đang ở trang login thì mới chuyển về home,
//                 // còn đang ở trang khác thì giữ nguyên để tránh reload khó chịu
//                 if (window.location.pathname === '/sign-in' || window.location.pathname === '/sign-up') {
//                     navigate('/');
//                 }
//             }
//           }
//         } catch (error) {
//           console.error("Lỗi đồng bộ:", error);
//         }
//       }
//     };

//     syncUserToDB();
//   }, [isSignedIn, user, navigate]);

//   return null;
// };

// export default AuthSync;
