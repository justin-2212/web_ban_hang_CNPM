//src/services/api.js

import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Tạo axios instance với base URL
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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
  getAll: (params = {}) =>
    apiClient.get("/san-pham", { params }).then(res => res.data),

  getById: (id) => apiClient.get(`/san-pham/${id}`).then(res => res.data),

  // Lấy theo loại với filter
  getByCategory: (maLoai, params = {}) =>
    apiClient.get(`/san-pham/loai/${maLoai}`, { params }).then(res => res.data),

  // Chi tiết đầy đủ (kèm variants, images, specs)
  getDetail: (id) =>
    apiClient.get(`/san-pham/chi-tiet/${id}`).then(res => res.data),

  // Tìm kiếm sản phẩm
  search: (keyword) =>
    apiClient.get("/san-pham/search", { params: { q: keyword } }).then(res => res.data),

  // Lấy top sản phẩm bán chạy
  getTopSelling: (limit = 5) =>
    apiClient.get("/san-pham/top-selling", { params: { limit } }).then(res => res.data),

  create: (data) =>
    apiClient.post("/san-pham", data).then(res => res.data),

  update: (id, data) =>
    apiClient.put(`/san-pham/${id}`, data).then(res => res.data),

  delete: (id) =>
    apiClient.delete(`/san-pham/${id}`).then(res => res.data),

  getVariantAttributes: (maSP) =>
    apiClient.get(`/san-pham/variant-attributes/${maSP}`).then(res => res.data),
};

// ============ LOẠI SẢN PHẨM ============
export const loaiSanPhamAPI = {
  getAll: () => apiClient.get("/loai-san-pham").then(res => res.data),
  getAllWithImages: () =>
    apiClient.get("/loai-san-pham/with-images").then(res => res.data),
  getById: (id) =>
    apiClient.get(`/loai-san-pham/${id}`).then(res => res.data),
};

// ============ GIỎ HÀNG ============
export const gioHangAPI = {
  // GET: Lấy giỏ hàng của user
  get: (maTaiKhoan) =>
    apiClient.get(`/gio-hang/${maTaiKhoan}`, {
      headers: getAuthHeaders(),
    }).then(res => res.data),

  // POST: Thêm item hoặc tăng số lượng
  addItem: (maTaiKhoan, maBienThe, soLuong) =>
    apiClient.post("/gio-hang", { maTaiKhoan, maBienThe, soLuong }, {
      headers: getAuthHeaders(),
    }).then(res => res.data),

  // PUT: Cập nhật số lượng item
  updateQuantity: (maTaiKhoan, maBienThe, soLuong) =>
    apiClient.put("/gio-hang", { maTaiKhoan, maBienThe, soLuong }, {
      headers: getAuthHeaders(),
    }).then(res => res.data),

  // DELETE: Xóa 1 item khỏi giỏ
  removeItem: (maTaiKhoan, maBienThe) =>
    apiClient.delete(`/gio-hang/${maTaiKhoan}/${maBienThe}`, {
      headers: getAuthHeaders(),
    }).then(res => res.data),

  // DELETE: Xóa toàn bộ giỏ hàng
  clearCart: (maTaiKhoan) =>
    apiClient.delete(`/gio-hang/clear/${maTaiKhoan}`, {
      headers: getAuthHeaders(),
    }).then(res => res.data),
};

// ============ TÀI KHOẢN ============
export const taiKhoanAPI = {
  login: (gmail) =>
    apiClient.post("/tai-khoan/login", { gmail }).then(res => res.data),

  register: (data) =>
    apiClient.post("/tai-khoan/register", data).then(res => res.data),

  // Lấy thông tin user
  getProfile: (id) => apiClient.get(`/tai-khoan/${id}`).then(res => res.data),
  syncUser: (data) =>
    apiClient.post("/tai-khoan/sync-user", data).then(res => res.data),


  updateProfile: (data) =>
    apiClient.put("/tai-khoan/update-info", data, {
      headers: getAuthHeaders(),
    }).then(res => res.data),

  // Gọi xuống backend để lấy thông tin mới nhất
  getByEmail: (email) =>
    apiClient.get(`/tai-khoan/get-by-email/${email}`).then(res => res.data),
};

// ============ ĐƠN HÀNG ============
export const donHangAPI = {
  create: (data) =>
    apiClient.post("/don-hang", data, {
      headers: getAuthHeaders(),
    }).then(res => res.data),

  getByUser: (maTaiKhoan) =>
    apiClient.get(`/don-hang/user/${maTaiKhoan}`, {
      headers: getAuthHeaders(),
    }).then(res => res.data),

  getById: (id) =>
    apiClient.get(`/don-hang/${id}`, {
      headers: getAuthHeaders(),
    }).then(res => res.data),

  // Hủy đơn hàng
  cancelOrder: (maDonHang) =>
    apiClient.post(`/don-hang/${maDonHang}/cancel`, {}, {
      headers: getAuthHeaders(),
    }).then(res => res.data),

  updateStatus: (id, status) =>
    apiClient.put(`/don-hang/${id}/status`, { status }, {
      headers: getAuthHeaders(),
    }).then(res => res.data),

  // Lấy trạng thái thanh toán online
  getPaymentStatus: (maDonHang) =>
    apiClient.get(`/don-hang/${maDonHang}/payment-status`, {
      headers: getAuthHeaders(),
    }).then(res => res.data),
};

// ============ CHECKOUT & THANH TOÁN ============
export const checkoutAPI = {
  checkout: ({ maTaiKhoan, phuongThucThanhToan }) =>
    apiClient.post("/checkout", {
      maTaiKhoan,
      phuongThucThanhToan, // "COD" | "ONLINE"
    }, {
      headers: getAuthHeaders(),
    }).then(res => res.data),
};

export const thanhToanAPI = {
  createOnlinePayment: ({ maDonHang, soTien }) =>
    apiClient.post("/thanh-toan/online", {
      maDonHang,
      soTien,
    }, {
      headers: getAuthHeaders(),
    }).then(res => res.data),

  getPaymentStatus: (maDonHang) =>
    apiClient.get(`/thanh-toan/status/${maDonHang}`, {
      headers: getAuthHeaders(),
    }).then(res => res.data),
};

// ============ UPLOAD ẢNH CLOUDINARY ============
export const uploadAPI = {
  // Upload ảnh sản phẩm (AnhSP)
  uploadAnhSanPham: (file, maSP, thuTuHienThi = 0) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('maSP', maSP);
    formData.append('thuTuHienThi', thuTuHienThi);

    return apiClient.post('/upload/anh-san-pham', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => res.data);
  },

  // Upload ảnh biến thể (BienThe)
  uploadAnhBienThe: (file, maBienThe) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('maBienThe', maBienThe);

    return apiClient.post('/upload/anh-bien-the', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => res.data);
  },

  // Upload nhiều ảnh cùng lúc cho sản phẩm
  uploadMultipleImages: (files, maSP) => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('images', file);
    });
    formData.append('maSP', maSP);

    return apiClient.post('/upload/anh-san-pham/bulk', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => res.data);
  },
};
