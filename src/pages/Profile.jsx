// // src/pages/Profile.jsx

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom"; // Dùng để chuyển trang
import { useAuth } from "../context/AuthContext"; // Import hook vừa tạo
import { taiKhoanAPI } from "../services/api";
import { User, Phone, MapPin, Save, Loader2, ArrowLeft } from "lucide-react";

// Tách hàm validate ra ngoài component để code gọn hơn
const validateForm = (phone) => {
  const phoneRegex = /^0\d{9}$/;
  if (!phone) return "Vui lòng nhập số điện thoại!";
  if (!phoneRegex.test(phone))
    return "Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0).";
  return null;
};

const Profile = () => {
  const { user, isLoaded } = useUser(); // Info từ Clerk (Avatar, Email)
  const { dbUser, refreshUser } = useAuth(); // Info từ MySQL (SĐT, Địa chỉ) lấy qua Context
  const navigate = useNavigate(); // Hook điều hướng
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    soDienThoai: "",
    diaChi: "",
  });
  // --- HÀM THOÁT (QUAY VỀ TRANG CHỦ) ---

  // 1. Chỉ đơn giản là sync dữ liệu từ Context vào Form khi dbUser có thay đổi
  useEffect(() => {
    if (dbUser) {
      setFormData({
        soDienThoai: dbUser.SoDienThoai || "",
        diaChi: dbUser.DiaChi || "",
      });
    }
  }, [dbUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "soDienThoai") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  // --- HÀM THOÁT (QUAY VỀ TRANG CHỦ) ---
  const handleExit = () => {
    navigate("/"); // Chuyển hướng về trang chủ ("/")
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    const errorMsg = validateForm(formData.soDienThoai);
    if (errorMsg) return alert(errorMsg);

    if (!dbUser?.MaTaiKhoan) return alert("Chưa tải được thông tin tài khoản.");

    setLoading(true);
    try {
      // Gọi API update (Backend yêu cầu: maTaiKhoan, soDienThoai, diaChi)
      const res = await taiKhoanAPI.updateProfile({
        maTaiKhoan: dbUser.MaTaiKhoan,
        soDienThoai: formData.soDienThoai,
        diaChi: formData.diaChi,
      });

      if (res.success) {
        alert("Cập nhật thành công!");
        // QUAN TRỌNG: Gọi hàm này để Context tự đi lấy lại dữ liệu mới nhất từ Server
        // Profile.jsx không cần tự sửa state hay localStorage nữa.
        await refreshUser();
      } else {
        alert(res.message || "Có lỗi xảy ra.");
      }
    } catch (error) {
      console.error("Lỗi update:", error);
      alert("Lỗi kết nối server.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || !user) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header - Lấy từ Clerk */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center">
          <div className="relative inline-block">
            <img
              src={user.imageUrl}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg mx-auto mb-4"
            />
          </div>
          <h2 className="text-2xl font-bold">{user.fullName}</h2>
          <p className="text-blue-100">
            {user.primaryEmailAddress?.emailAddress}
          </p>
        </div>

        {/* Form - Dữ liệu từ MySQL */}
        <div className="p-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Thông tin giao hàng
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input Số điện thoại */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="soDienThoai"
                  value={formData.soDienThoai}
                  onChange={handleChange}
                  placeholder="Nhập số điện thoại (0xxxxxxxxx)"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Input Địa chỉ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ nhận hàng
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  name="diaChi"
                  value={formData.diaChi}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Số nhà, đường, phường/xã..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition-all resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" /> Lưu thay đổi
                </>
              )}
            </button>

            <button
              type="button" // type="button" để không submit form
              onClick={handleExit}
              className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 border border-gray-200"
            >
              <ArrowLeft className="w-5 h-5" />
              Quay lại trang chủ
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;

// import React, { useState, useEffect } from "react";
// import { useUser } from "@clerk/clerk-react";
// import { taiKhoanAPI } from "../services/api";
// import { User, Phone, MapPin, Save, Loader2 } from "lucide-react";
// // import { toast } from "react-toastify"; // Nếu bạn có cài react-toastify, hoặc dùng alert

// const Profile = () => {
//   const { user, isLoaded } = useUser();
//   const [dbUser, setDbUser] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // State cho form
//   const [formData, setFormData] = useState({
//     soDienThoai: "",
//     diaChi: "",
//   });

//   // 1. Lấy thông tin user từ LocalStorage (do AuthSync đã lưu) hoặc gọi API
//   useEffect(() => {
//     const fetchUserData = async () => {
//       // Chỉ chạy khi Clerk đã tải xong và có thông tin user
//       if (isLoaded && user && user.primaryEmailAddress) {
//         try {
//           const email = user.primaryEmailAddress.emailAddress;

//           // Gọi API lấy dữ liệu mới nhất từ MySQL
//           const response = await taiKhoanAPI.getByEmail(email);

//           if (response.success && response.data) {
//             const userData = response.data;
//             setDbUser(userData); // Lưu thông tin user (để lấy MaTaiKhoan)

//             // TỰ ĐỘNG ĐIỀN VÀO FORM
//             setFormData({
//               soDienThoai: userData.SoDienThoai || "", // Nếu null thì để rỗng
//               diaChi: userData.DiaChi || "",
//             });
//           }
//         } catch (error) {
//           console.error("Lỗi lấy thông tin user:", error);
//         }
//       }
//     };

//     fetchUserData();
//   }, [isLoaded, user]); // Chạy lại khi user thay đổi
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // Nếu là ô số điện thoại, chỉ cho phép nhập ký tự số
//     if (name === "soDienThoai") {
//       const numericValue = value.replace(/[^0-9]/g, ""); // Loại bỏ ký tự không phải số
//       setFormData({ ...formData, [name]: numericValue });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Ngăn reload trang
//     if (!dbUser || !dbUser.MaTaiKhoan) {
//       alert(
//         "Lỗi: Không tìm thấy ID tài khoản. Vui lòng đăng xuất và đăng nhập lại."
//       );
//       return;
//     }

//     // --- BẮT ĐẦU KIỂM TRA SỐ ĐIỆN THOẠI ---
//     const phoneRegex = /^0\d{9}$/; // Bắt đầu bằng 0, theo sau là 9 chữ số (Tổng 10 số)

//     if (!formData.soDienThoai) {
//       alert("Vui lòng nhập số điện thoại!");
//       return;
//     }

//     if (!phoneRegex.test(formData.soDienThoai)) {
//       alert("Số điện thoại không hợp lệ! Phải có 10 số và bắt đầu bằng số 0.");
//       return; // Dừng lại, không gửi API
//     }
//     // --- KẾT THÚC KIỂM TRA ---

//     setLoading(true);
//     try {
//       console.log("Đang gửi update:", {
//         maTaiKhoan: dbUser.MaTaiKhoan,
//         soDienThoai: formData.soDienThoai,
//         diaChi: formData.diaChi,
//       });

//       // Gọi API update
//       await taiKhoanAPI.updateProfile({
//         maTaiKhoan: dbUser.MaTaiKhoan,
//         soDienThoai: formData.soDienThoai,
//         diaChi: formData.diaChi,
//       });

//       // Cập nhật lại LocalStorage để đồng bộ
//       const updatedUser = {
//         ...dbUser,
//         SoDienThoai: formData.soDienThoai,
//         DiaChi: formData.diaChi,
//       };
//       localStorage.setItem("currentUser", JSON.stringify(updatedUser));
//       setDbUser(updatedUser);

//       alert("Cập nhật thông tin thành công!"); // Hoặc dùng toast
//     } catch (error) {
//       console.error("Lỗi update:", error);
//       alert("Có lỗi xảy ra, vui lòng thử lại.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isLoaded || !user) {
//     return (
//       <div className="flex justify-center py-20">
//         <Loader2 className="animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-10 max-w-2xl">
//       <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
//         {/* Header Setup */}
//         <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center">
//           <div className="relative inline-block">
//             <img
//               src={user.imageUrl}
//               alt="Avatar"
//               className="w-24 h-24 rounded-full border-4 border-white shadow-lg mx-auto mb-4"
//             />
//           </div>
//           <h2 className="text-2xl font-bold">{user.fullName}</h2>
//           <p className="text-blue-100">
//             {user.primaryEmailAddress?.emailAddress}
//           </p>
//         </div>

//         {/* Form Update */}
//         <div className="p-8">
//           <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
//             <User className="w-5 h-5 text-blue-600" />
//             Thông tin giao hàng
//           </h3>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             {/* Số điện thoại */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Số điện thoại
//               </label>
//               <div className="relative">
//                 <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type="text"
//                   name="soDienThoai"
//                   value={formData.soDienThoai}
//                   onChange={handleChange}
//                   placeholder="Nhập số điện thoại của bạn"
//                   className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
//                 />
//               </div>
//             </div>

//             {/* Địa chỉ */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Địa chỉ nhận hàng
//               </label>
//               <div className="relative">
//                 <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
//                 <textarea
//                   name="diaChi"
//                   value={formData.diaChi}
//                   onChange={handleChange}
//                   rows="3"
//                   placeholder="Số nhà, đường, phường/xã..."
//                   className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
//                 />
//               </div>
//             </div>

//             {/* Button Save */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-70"
//             >
//               {loading ? (
//                 <Loader2 className="w-5 h-5 animate-spin" />
//               ) : (
//                 <>
//                   <Save className="w-5 h-5" />
//                   Lưu thay đổi
//                 </>
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;
