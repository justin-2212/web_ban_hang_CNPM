import axios from "axios";

// Đường dẫn gốc trỏ tới route thongSoAdmin (Port 5000)
const API_URL = "http://localhost:5000/api/admin/thong-so";

// Hàm lấy token từ localStorage để xác thực Admin
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

const thongSoServiceAdmin = {
  // --- NHÓM 1: THÔNG SỐ KỸ THUẬT (Tech Specs - ThongSoMau) ---

  // Lấy danh sách thông số của 1 loại
  getSpecs: async (maLoai) => {
    const response = await axios.get(
      `${API_URL}/specs/${maLoai}`,
      getAuthHeader()
    );
    return response.data; // Trả về: { success: true, data: [...] }
  },

  // Thêm thông số mới
  createSpec: async (data) => {
    // data: { ten, donVi, thuTu, maLoai }
    const response = await axios.post(
      `${API_URL}/specs`,
      data,
      getAuthHeader()
    );
    return response.data;
  },

  // Xóa thông số
  deleteSpec: async (id) => {
    const response = await axios.delete(
      `${API_URL}/specs/${id}`,
      getAuthHeader()
    );
    return response.data;
  },
  // Khôi phục thông số
  restoreSpec: async (id) => {
    const response = await axios.put(
      `${API_URL}/specs/restore/${id}`,
      {},
      getAuthHeader()
    );
    return response.data;
  },
  // Cập nhật thông số
  updateSpec: async (id, data) => {
    const response = await axios.put(
      `${API_URL}/specs/${id}`,
      data,
      getAuthHeader()
    );
    return response.data;
  },

  // Xóa cứng thông số
  hardDeleteSpec: async (id) => {
    const response = await axios.delete(
      `${API_URL}/specs/hard-delete/${id}`,
      getAuthHeader()
    );
    return response.data;
  },

  // --- NHÓM 2: BIẾN THỂ MẪU (Variants - ThongSoBienTheMau) ---

  // Lấy danh sách biến thể mẫu của 1 loại
  getVariants: async (maLoai) => {
    const response = await axios.get(
      `${API_URL}/variants/${maLoai}`,
      getAuthHeader()
    );
    return response.data;
  },

  // Thêm biến thể mẫu mới
  createVariant: async (data) => {
    const response = await axios.post(
      `${API_URL}/variants`,
      data,
      getAuthHeader()
    );
    return response.data;
  },

  // Xóa biến thể mẫu
  deleteVariant: async (id) => {
    const response = await axios.delete(
      `${API_URL}/variants/${id}`,
      getAuthHeader()
    );
    return response.data;
  },

  // Khôi phục biến thể mẫu
  restoreVariant: async (id) => {
    const response = await axios.put(
      `${API_URL}/variants/restore/${id}`,
      {},
      getAuthHeader()
    );
    return response.data;
  },

  // Cập nhật biến thể mẫu
  updateVariant: async (id, data) => {
    const response = await axios.put(
      `${API_URL}/variants/${id}`,
      data,
      getAuthHeader()
    );
    return response.data;
  },

  // Xóa cứng biến thể
  hardDeleteVariant: async (id) => {
    const response = await axios.delete(
      `${API_URL}/variants/hard-delete/${id}`,
      getAuthHeader()
    );
    return response.data;
  },

};

export default thongSoServiceAdmin;
