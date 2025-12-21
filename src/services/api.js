//src/services/api.js

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Helper function với auth headers
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Có lỗi xảy ra");
  return data;
};

// Helper để lấy auth headers từ localStorage hoặc Clerk
const getAuthHeaders = () => {
  const headers = { "Content-Type": "application/json" };

  // Lấy thông tin user từ localStorage (được set bởi AuthContext)
  const userStr = localStorage.getItem("dbUser");
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.ClerkID) {
        headers["X-Clerk-Id"] = user.ClerkID;
      }
      if (user.Gmail) {
        headers["X-User-Email"] = user.Gmail;
      }
    } catch (e) {
      console.error("Error parsing user from localStorage:", e);
    }
  }

  return headers;
};

// ============ SẢN PHẨM ============
export const sanPhamAPI = {
  // Lấy tất cả sản phẩm với filter & sort
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetch(
      `${API_BASE_URL}/san-pham${queryString ? "?" + queryString : ""}`
    ).then(handleResponse);
  },

  getById: (id) => fetch(`${API_BASE_URL}/san-pham/${id}`).then(handleResponse),

  // Lấy theo loại với filter
  getByCategory: (maLoai, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetch(
      `${API_BASE_URL}/san-pham/loai/${maLoai}${
        queryString ? "?" + queryString : ""
      }`
    ).then(handleResponse);
  },

  // Chi tiết đầy đủ (kèm variants, images, specs)
  getDetail: (id) =>
    fetch(`${API_BASE_URL}/san-pham/chi-tiet/${id}`).then(handleResponse),

  // Tìm kiếm sản phẩm
  search: (keyword) =>
    fetch(`${API_BASE_URL}/san-pham/search?q=${encodeURIComponent(keyword)}`).then(
      handleResponse
    ),

  create: (data) =>
    fetch(`${API_BASE_URL}/san-pham`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleResponse),

  update: (id, data) =>
    fetch(`${API_BASE_URL}/san-pham/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleResponse),

  delete: (id) =>
    fetch(`${API_BASE_URL}/san-pham/${id}`, { method: "DELETE" }).then(
      handleResponse
    ),

  getVariantAttributes: async (maSP) => {
    const response = await fetch(
      `${API_BASE_URL}/san-pham/variant-attributes/${maSP}`
    );
    return handleResponse(response);
  },
};

// ============ LOẠI SẢN PHẨM ============
export const loaiSanPhamAPI = {
  getAll: () => fetch(`${API_BASE_URL}/loai-san-pham`).then(handleResponse),
  getAllWithImages: () =>
    fetch(`${API_BASE_URL}/loai-san-pham/with-images`).then(handleResponse),
  getById: (id) =>
    fetch(`${API_BASE_URL}/loai-san-pham/${id}`).then(handleResponse),
};

// ============ GIỎ HÀNG ============
export const gioHangAPI = {
  // ✅ GET: Lấy giỏ hàng của user
  get: (maTaiKhoan) =>
    fetch(`${API_BASE_URL}/gio-hang/${maTaiKhoan}`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),

  // ✅ POST: Thêm item hoặc tăng số lượng
  addItem: (maTaiKhoan, maBienThe, soLuong) =>
    fetch(`${API_BASE_URL}/gio-hang`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ maTaiKhoan, maBienThe, soLuong }),
    }).then(handleResponse),

  // ✅ PUT: Cập nhật số lượng item
  updateQuantity: (maTaiKhoan, maBienThe, soLuong) =>
    fetch(`${API_BASE_URL}/gio-hang`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ maTaiKhoan, maBienThe, soLuong }),
    }).then(handleResponse),

  // ✅ DELETE: Xóa 1 item khỏi giỏ
  removeItem: (maTaiKhoan, maBienThe) =>
    fetch(`${API_BASE_URL}/gio-hang/${maTaiKhoan}/${maBienThe}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    }).then(handleResponse),

  // ✅ DELETE: Xóa toàn bộ giỏ hàng
  clearCart: (maTaiKhoan) =>
    fetch(`${API_BASE_URL}/gio-hang/clear/${maTaiKhoan}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    }).then(handleResponse),
};

// ============ TÀI KHOẢN ============
export const taiKhoanAPI = {
  login: (gmail) =>
    fetch(`${API_BASE_URL}/tai-khoan/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gmail }),
    }).then(handleResponse),

  register: (data) =>
    fetch(`${API_BASE_URL}/tai-khoan/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleResponse),

  // Lấy thông tin user
  getProfile: (id) => fetch(`${API_BASE_URL}/tai-khoan/${id}`).then(handleResponse),
  syncUser: (data) =>
    fetch(`${API_BASE_URL}/tai-khoan/sync-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleResponse),

  // --- SỬA LẠI ĐOẠN NÀY ---
  // Backend của bạn là: router.put("/update-info", ...)
  // Nên ở đây ta phải gọi đúng endpoint đó và gửi data (bao gồm cả maTaiKhoan) vào body
  updateProfile: (data) =>
    fetch(`${API_BASE_URL}/tai-khoan/update-info`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
      // data lúc này sẽ là { maTaiKhoan: 1, soDienThoai: "...", diaChi: "..." }
    }).then(handleResponse),

  // Gọi xuống backend để lấy thông tin mới nhất
  getByEmail: (email) =>
    fetch(`${API_BASE_URL}/tai-khoan/get-by-email/${email}`).then(handleResponse),
};

// ============ ĐƠN HÀNG ============
export const donHangAPI = {
  create: (data) =>
    fetch(`${API_BASE_URL}/don-hang`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  getByUser: (maTaiKhoan) =>
    fetch(`${API_BASE_URL}/don-hang/user/${maTaiKhoan}`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),

  getById: (id) =>
    fetch(`${API_BASE_URL}/don-hang/${id}`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),

  // ✅ NEW: Hủy đơn hàng
  cancelOrder: (maDonHang) =>
    fetch(`${API_BASE_URL}/don-hang/${maDonHang}/cancel`, {
      method: "POST",
      headers: getAuthHeaders(),
    }).then(handleResponse),

  updateStatus: (id, status) =>
    fetch(`${API_BASE_URL}/don-hang/${id}/status`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    }).then(handleResponse),

  // Lấy trạng thái thanh toán online
  getPaymentStatus: (maDonHang) =>
    fetch(`${API_BASE_URL}/don-hang/${maDonHang}/payment-status`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),
};

// ============ CHECKOUT & THANH TOÁN ============
export const checkoutAPI = {
  checkout: ({ maTaiKhoan, phuongThucThanhToan }) =>
    fetch(`${API_BASE_URL}/checkout`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        maTaiKhoan,
        phuongThucThanhToan, // "COD" | "ONLINE"
      }),
    }).then(handleResponse),
};

export const thanhToanAPI = {
  createOnlinePayment: ({ maDonHang, soTien }) =>
    fetch(`${API_BASE_URL}/thanh-toan/online`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        maDonHang,
        soTien,
      }),
    }).then(handleResponse),

  getPaymentStatus: (maDonHang) =>
    fetch(`${API_BASE_URL}/thanh-toan/status/${maDonHang}`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),
};

// ============ UPLOAD ẢNH CLOUDINARY ============
export const uploadAPI = {
  // Upload ảnh sản phẩm (AnhSP)
  uploadAnhSanPham: (file, maSP, thuTuHienThi = 0) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('maSP', maSP);
    formData.append('thuTuHienThi', thuTuHienThi);

    return fetch(`${API_BASE_URL}/upload/anh-san-pham`, {
      method: 'POST',
      body: formData,
    }).then(handleResponse);
  },

  // Upload ảnh biến thể (BienThe)
  uploadAnhBienThe: (file, maBienThe) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('maBienThe', maBienThe);

    return fetch(`${API_BASE_URL}/upload/anh-bien-the`, {
      method: 'POST',
      body: formData,
    }).then(handleResponse);
  },

  // Upload nhiều ảnh cùng lúc cho sản phẩm
  uploadMultipleImages: (files, maSP) => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('images', file);
    });
    formData.append('maSP', maSP);

    return fetch(`${API_BASE_URL}/upload/anh-san-pham/bulk`, {
      method: 'POST',
      body: formData,
    }).then(handleResponse);
  },
};

