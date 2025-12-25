// src/services/donHangServiceAdmin.js

// Khai báo Base URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

//  Helper xử lý response
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Có lỗi xảy ra");
  }
  return data;
};

//  Helper lấy Auth Headers (Copy logic từ adminAPI để hoạt động độc lập)
const getAuthHeaders = () => {
  try {
    const clerkUser = window.Clerk?.user;
    if (clerkUser?.id && clerkUser?.primaryEmailAddress?.emailAddress) {
      return {
        "Content-Type": "application/json",
        "X-Clerk-Id": clerkUser.id,
        "X-User-Email": clerkUser.primaryEmailAddress.emailAddress,
      };
    }

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

    console.warn(" No auth info available for DonHang Admin Service");
    return { "Content-Type": "application/json" };
  } catch (error) {
    console.error("Error getting auth headers:", error);
    return { "Content-Type": "application/json" };
  }
};

//  Service API riêng cho Đơn Hàng Admin
export const donHangServiceAdmin = {
  // Lấy danh sách đơn hàng (có filter)
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (
      filters.tinhTrangDonHang !== "" &&
      filters.tinhTrangDonHang !== undefined
    ) {
      queryParams.append("tinhTrangDonHang", filters.tinhTrangDonHang);
    }
    if (
      filters.tinhTrangThanhToan !== "" &&
      filters.tinhTrangThanhToan !== undefined
    ) {
      queryParams.append("tinhTrangThanhToan", filters.tinhTrangThanhToan);
    }
    if (filters.phuongThucThanhToan)
      queryParams.append("phuongThucThanhToan", filters.phuongThucThanhToan);
    if (filters.search) queryParams.append("search", filters.search);
    if (filters.fromDate) queryParams.append("fromDate", filters.fromDate);
    if (filters.toDate) queryParams.append("toDate", filters.toDate);

    const response = await fetch(
      `${API_BASE_URL}/admin/don-hang?${queryParams}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return handleResponse(response);
  },

  // Lấy chi tiết đơn hàng
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/don-hang/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Cập nhật trạng thái đơn hàng
  updateStatus: async (id, tinhTrangDonHang) => {
    const response = await fetch(
      `${API_BASE_URL}/admin/don-hang/${id}/status`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ tinhTrangDonHang }),
      }
    );
    return handleResponse(response);
  },

  // Cập nhật trạng thái thanh toán
  updatePaymentStatus: async (id, tinhTrangThanhToan) => {
    const response = await fetch(
      `${API_BASE_URL}/admin/don-hang/${id}/payment`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ tinhTrangThanhToan }),
      }
    );
    return handleResponse(response);
  },

  // Hủy đơn hàng
  cancel: async (id, reason = "") => {
    const response = await fetch(
      `${API_BASE_URL}/admin/don-hang/${id}/cancel`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ reason }),
      }
    );
    return handleResponse(response);
  },

  // Thống kê đơn hàng
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/don-hang/stats`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Doanh thu theo ngày
  getRevenue: async (fromDate, toDate) => {
    const response = await fetch(
      `${API_BASE_URL}/admin/don-hang/revenue?fromDate=${fromDate}&toDate=${toDate}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return handleResponse(response);
  },

  // Top sản phẩm bán chạy
  getTopProducts: async (limit = 10) => {
    const response = await fetch(
      `${API_BASE_URL}/admin/don-hang/top-products?limit=${limit}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return handleResponse(response);
  },
};

export default donHangServiceAdmin;
