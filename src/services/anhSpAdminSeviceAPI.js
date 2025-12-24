// src/services/anhSpAdminSeviceAPI.js

// [NOTE] Khai báo lại Base URL để file này hoạt động độc lập
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// [NOTE] Helper xử lý response (Copy từ adminAPI sang để dùng riêng)
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Có lỗi xảy ra");
  }
  return data;
};

// [NOTE] Helper lấy Auth Headers (Copy từ adminAPI sang để dùng riêng)
// Vì các API này thuộc Admin nên bắt buộc phải có Header xác thực
const getAuthHeaders = () => {
  try {
    // 1. Thử lấy từ Clerk (nếu dùng Clerk)
    const clerkUser = window.Clerk?.user;
    if (clerkUser?.id && clerkUser?.primaryEmailAddress?.emailAddress) {
      return {
        "Content-Type": "application/json",
        "X-Clerk-Id": clerkUser.id,
        "X-User-Email": clerkUser.primaryEmailAddress.emailAddress,
      };
    }

    // 2. Fallback: Lấy từ localStorage
    const userStr = localStorage.getItem("dbUser");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.ClerkID && user.Gmail) {
        return {
          "Content-Type": "application/json",
          "X-Clerk-Id": user.ClerkID,
          "X-User-Email": user.Gmail,
        };
      }
    }

    console.warn("No auth info available for Admin Image API");
    return { "Content-Type": "application/json" };
  } catch (error) {
    console.error("Error getting auth headers:", error);
    return { "Content-Type": "application/json" };
  }
};

// ==================== SERVICE ẢNH SẢN PHẨM (ADMIN) ====================
// Object này chứa các hàm gọi API sang endpoint mới: /api/admin/anh-sp

export const anhSpAdminServiceAPI = {
  /**
   * Lấy tất cả ảnh của sản phẩm
   * Method: GET
   * URL: /api/admin/anh-sp/product/:id
   */
  getByProduct: async (maSP) => {
    const response = await fetch(
      `${API_BASE_URL}/admin/anh-sp/product/${maSP}`,
      {
        headers: getAuthHeaders(), // [IMPORTANT] Phải có auth header
      }
    );
    return handleResponse(response);
  },

  /**
   * Xóa ảnh
   * Method: DELETE
   * URL: /api/admin/anh-sp/:id
   */
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/anh-sp/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  /**
   * Cập nhật thứ tự hiển thị
   * Method: PUT
   * URL: /api/admin/anh-sp/:id/order
   */
  updateOrder: async (id, thuTuHienThi) => {
    const response = await fetch(`${API_BASE_URL}/admin/anh-sp/${id}/order`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ thuTuHienThi }),
    });
    return handleResponse(response);
  },
};

export default anhSpAdminServiceAPI;
