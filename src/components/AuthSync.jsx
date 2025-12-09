// src/components/AuthSync.jsx

import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const AuthSync = () => {
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const syncUserToDB = async () => {
      // Chỉ chạy khi đã đăng nhập
      if (isSignedIn && user) {
        const email = user.primaryEmailAddress?.emailAddress;
        const fullName = user.fullName;
        const clerkId = user.id; // Lấy Clerk ID

        try {
          // Gọi API Backend
          const response = await fetch('http://localhost:5000/api/users/sync-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, fullName, clerkId }), // Gửi ClerkID đi
          });
          
          const result = await response.json();

          if (result.success) {
            // Lưu thông tin user vào localStorage để dùng dần
            localStorage.setItem('currentUser', JSON.stringify(result.data));

            // Logic chuyển trang (Admin/User)
            if (result.data.Quyen === 0) {
                navigate('/admin'); 
            } else {
                // Nếu đang ở trang login thì mới chuyển về home, 
                // còn đang ở trang khác thì giữ nguyên để tránh reload khó chịu
                if (window.location.pathname === '/sign-in' || window.location.pathname === '/sign-up') {
                    navigate('/');
                }
            }
          }
        } catch (error) {
          console.error("Lỗi đồng bộ:", error);
        }
      }
    };

    syncUserToDB();
  }, [isSignedIn, user, navigate]);

  return null; 
};

export default AuthSync;