// src/services/categoryService.js
import axios from "axios"; // Hoặc import instance axios của bạn nếu có (ví dụ: src/services/api.js)

// Cấu hình đường dẫn gốc (Nếu bạn chưa cấu hình axios global)
const API_URL = "http://localhost:5000/api/admin/loai-san-pham";

// Hàm lấy token từ localStorage (để gửi kèm request)
const getAuthHeader = () => {
  const token = localStorage.getItem("token"); // Hoặc key bạn đang lưu token
  return { headers: { Authorization: `Bearer ${token}` } };
};

const categoryService = {
  // 1. Lấy danh sách
  getAll: async () => {
    const response = await axios.get(API_URL, getAuthHeader());
    return response.data; // Trả về { success: true, data: [...] }
  },

  // 2. Tạo mới
  create: async (data) => {
    // data: { tenLoai, thuTuHienThi, tinhTrang }
    const response = await axios.post(API_URL, data, getAuthHeader());
    return response.data;
  },

  // 3. Cập nhật
  update: async (id, data) => {
    const response = await axios.put(`${API_URL}/${id}`, data, getAuthHeader());
    return response.data;
  },

  // 4. Xóa
  delete: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
  },

  // 5. Lấy chi tiết (nếu cần)
  getById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
  },
};

export default categoryService;
