// src/services/adminAPI.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper function để xử lý response
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Có lỗi xảy ra');
  }
  return data;
};

// Helper function để lấy auth headers từ Clerk
const getAuthHeaders = () => {
  try {
    // Thử lấy từ Clerk trước
    const clerkUser = window.Clerk?.user;
    
    if (clerkUser?.id && clerkUser?.primaryEmailAddress?.emailAddress) {
      const headers = {
        'Content-Type': 'application/json',
        'X-Clerk-Id': clerkUser.id,
        'X-User-Email': clerkUser.primaryEmailAddress.emailAddress
      };
      console.log('🔐 Admin API Headers (from Clerk):', { clerkId: clerkUser.id.substring(0, 10) + '...', email: clerkUser.primaryEmailAddress.emailAddress });
      return headers;
    }
    
    // Fallback: Lấy từ localStorage (dbUser đã được sync bởi AuthContext)
    const userStr = localStorage.getItem('dbUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.ClerkID && user.Gmail) {
        const headers = {
          'Content-Type': 'application/json',
          'X-Clerk-Id': user.ClerkID,
          'X-User-Email': user.Gmail
        };
        console.log('🔐 Admin API Headers (from localStorage):', { clerkId: user.ClerkID.substring(0, 10) + '...', email: user.Gmail });
        return headers;
      }
    }
    
    console.warn('⚠️ No auth info available for Admin API');
    return { 'Content-Type': 'application/json' };
  } catch (error) {
    console.error('Error getting auth headers:', error);
    return { 'Content-Type': 'application/json' };
  }
};

// Helper for auth headers without Content-Type (for FormData)
const getAuthHeadersNoContentType = () => {
  try {
    const clerkUser = window.Clerk?.user;
    if (clerkUser?.id && clerkUser?.primaryEmailAddress?.emailAddress) {
      return {
        'X-Clerk-Id': clerkUser.id,
        'X-User-Email': clerkUser.primaryEmailAddress.emailAddress
      };
    }
    const userStr = localStorage.getItem('dbUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.ClerkID && user.Gmail) {
        return {
          'X-Clerk-Id': user.ClerkID,
          'X-User-Email': user.Gmail
        };
      }
    }
    return {};
  } catch (error) {
    console.error('Error getting auth headers:', error);
    return {};
  }
};

// ==================== SẢN PHẨM ADMIN ====================
export const sanPhamAdminAPI = {
  // Lấy danh sách sản phẩm (có filter)
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.maLoai) queryParams.append('maLoai', filters.maLoai);
    if (filters.tinhTrang !== undefined) queryParams.append('tinhTrang', filters.tinhTrang);
    if (filters.search) queryParams.append('search', filters.search);

    const response = await fetch(
      `${API_BASE_URL}/admin/san-pham?${queryParams}`,
      {
        headers: getAuthHeaders()
      }
    );
    return handleResponse(response);
  },

  // Lấy chi tiết sản phẩm
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/san-pham/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Tạo sản phẩm mới
  create: async (data) => {
    const response = await fetch(`${API_BASE_URL}/admin/san-pham`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  // Cập nhật sản phẩm
  update: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/admin/san-pham/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  // Xóa sản phẩm (soft delete)
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/san-pham/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Xóa vĩnh viễn
  hardDelete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/san-pham/${id}/hard`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Kích hoạt/Vô hiệu hóa
  toggleStatus: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/san-pham/${id}/toggle-status`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// ==================== BIẾN THỂ ADMIN ====================
export const bienTheAdminAPI = {
  // Lấy biến thể theo sản phẩm
  getByProduct: async (maSP) => {
    const response = await fetch(`${API_BASE_URL}/admin/bien-the/product/${maSP}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Lấy chi tiết biến thể
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/bien-the/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Tạo biến thể mới
  create: async (data) => {
    const response = await fetch(`${API_BASE_URL}/admin/bien-the`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  // Cập nhật biến thể
  update: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/admin/bien-the/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  // Cập nhật tồn kho
  updateStock: async (id, soLuong) => {
    const response = await fetch(`${API_BASE_URL}/admin/bien-the/${id}/stock`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ soLuong })
    });
    return handleResponse(response);
  },

  // Điều chỉnh tồn kho
  adjustStock: async (id, delta) => {
    const response = await fetch(`${API_BASE_URL}/admin/bien-the/${id}/adjust-stock`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ delta })
    });
    return handleResponse(response);
  },

  // Xóa biến thể
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/bien-the/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Kích hoạt/Vô hiệu hóa
  toggleStatus: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/bien-the/${id}/toggle-status`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Lấy tồn kho thấp
  getLowStock: async (threshold = 10) => {
    const response = await fetch(
      `${API_BASE_URL}/admin/bien-the/low-stock?threshold=${threshold}`,
      {
        headers: getAuthHeaders()
      }
    );
    return handleResponse(response);
  }
};

// ==================== ĐƠN HÀNG ADMIN ====================
export const donHangAdminAPI = {
  // Lấy danh sách đơn hàng (có filter)
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.tinhTrangDonHang !== undefined) queryParams.append('tinhTrangDonHang', filters.tinhTrangDonHang);
    if (filters.tinhTrangThanhToan !== undefined) queryParams.append('tinhTrangThanhToan', filters.tinhTrangThanhToan);
    if (filters.phuongThucThanhToan) queryParams.append('phuongThucThanhToan', filters.phuongThucThanhToan);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.fromDate) queryParams.append('fromDate', filters.fromDate);
    if (filters.toDate) queryParams.append('toDate', filters.toDate);

    const response = await fetch(
      `${API_BASE_URL}/admin/don-hang?${queryParams}`,
      {
        headers: getAuthHeaders()
      }
    );
    return handleResponse(response);
  },

  // Lấy chi tiết đơn hàng
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/don-hang/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Cập nhật trạng thái đơn hàng
  updateStatus: async (id, tinhTrangDonHang) => {
    const response = await fetch(`${API_BASE_URL}/admin/don-hang/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ tinhTrangDonHang })
    });
    return handleResponse(response);
  },

  // Cập nhật trạng thái thanh toán
  updatePaymentStatus: async (id, tinhTrangThanhToan) => {
    const response = await fetch(`${API_BASE_URL}/admin/don-hang/${id}/payment`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ tinhTrangThanhToan })
    });
    return handleResponse(response);
  },

  // Hủy đơn hàng
  cancel: async (id, reason = '') => {
    const response = await fetch(`${API_BASE_URL}/admin/don-hang/${id}/cancel`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason })
    });
    return handleResponse(response);
  },

  // Thống kê đơn hàng
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/don-hang/stats`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Doanh thu theo ngày
  getRevenue: async (fromDate, toDate) => {
    const response = await fetch(
      `${API_BASE_URL}/admin/don-hang/revenue?fromDate=${fromDate}&toDate=${toDate}`,
      {
        headers: getAuthHeaders()
      }
    );
    return handleResponse(response);
  },

  // Top sản phẩm bán chạy
  getTopProducts: async (limit = 10) => {
    const response = await fetch(
      `${API_BASE_URL}/admin/don-hang/top-products?limit=${limit}`,
      {
        headers: getAuthHeaders()
      }
    );
    return handleResponse(response);
  }
};

// ==================== TÀI KHOẢN ADMIN ====================
export const taiKhoanAdminAPI = {
  // Lấy danh sách tài khoản (có filter)
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.quyen) queryParams.append('quyen', filters.quyen);
    if (filters.tinhTrang !== undefined) queryParams.append('tinhTrang', filters.tinhTrang);
    if (filters.search) queryParams.append('search', filters.search);

    const response = await fetch(
      `${API_BASE_URL}/admin/tai-khoan?${queryParams}`,
      {
        headers: getAuthHeaders()
      }
    );
    return handleResponse(response);
  },

  // Lấy chi tiết tài khoản
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/tai-khoan/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Cập nhật quyền
  updateRole: async (id, quyen) => {
    const response = await fetch(`${API_BASE_URL}/admin/tai-khoan/${id}/role`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ quyen })
    });
    return handleResponse(response);
  },

  // Kích hoạt/Vô hiệu hóa
  toggleStatus: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/tai-khoan/${id}/toggle-status`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Thống kê người dùng
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/tai-khoan/stats`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Người dùng mới
  getNewUsers: async (fromDate, toDate) => {
    const response = await fetch(
      `${API_BASE_URL}/admin/tai-khoan/new-users?fromDate=${fromDate}&toDate=${toDate}`,
      {
        headers: getAuthHeaders()
      }
    );
    return handleResponse(response);
  },

  // Đơn hàng của user
  getUserOrders: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/tai-khoan/${id}/orders`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// ==================== THỐNG KÊ ADMIN ====================
export const thongKeAdminAPI = {
  // Dashboard tổng quan
  getDashboard: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/thong-ke/dashboard`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Doanh thu theo khoảng thời gian
  getRevenue: async (fromDate, toDate, groupBy = 'day') => {
    const response = await fetch(
      `${API_BASE_URL}/admin/thong-ke/revenue?fromDate=${fromDate}&toDate=${toDate}&groupBy=${groupBy}`,
      {
        headers: getAuthHeaders()
      }
    );
    return handleResponse(response);
  },

  // Thống kê sản phẩm
  getProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/thong-ke/products`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Thống kê khách hàng
  getCustomers: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/thong-ke/customers`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // So sánh doanh thu
  compareRevenue: async (period = 'month') => {
    const response = await fetch(
      `${API_BASE_URL}/admin/thong-ke/compare?period=${period}`,
      {
        headers: getAuthHeaders()
      }
    );
    return handleResponse(response);
  }
};

// ==================== ẢNH SẢN PHẨM ====================
export const anhSPAPI = {
  // Lấy tất cả ảnh của sản phẩm
  getByProduct: async (maSP) => {
    const response = await fetch(`${API_BASE_URL}/anh-sp/san-pham/${maSP}`);
    return handleResponse(response);
  },

  // Thêm ảnh mới
  create: async (data) => {
    const response = await fetch(`${API_BASE_URL}/anh-sp`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  // Xóa ảnh
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/anh-sp/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Cập nhật thứ tự
  updateOrder: async (id, thuTuHienThi) => {
    const response = await fetch(`${API_BASE_URL}/anh-sp/${id}/order`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ thuTuHienThi })
    });
    return handleResponse(response);
  }
};

// ==================== THÔNG SỐ BIẾN THỂ MẪU ====================
export const thongSoBienTheMauAPI = {
  // Lấy theo loại sản phẩm
  getByCategory: async (maLoai) => {
    const response = await fetch(`${API_BASE_URL}/thong-so-bien-the-mau/loai/${maLoai}`);
    return handleResponse(response);
  },

  // Lấy tất cả
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/thong-so-bien-the-mau`);
    return handleResponse(response);
  }
};

// ==================== GIÁ TRỊ BIẾN THỂ ====================
export const giaTriBienTheAPI = {
  // Lấy giá trị của biến thể
  getByVariant: async (maBienThe) => {
    const response = await fetch(`${API_BASE_URL}/gia-tri-bien-the/bien-the/${maBienThe}`);
    return handleResponse(response);
  },

  // Thêm giá trị
  create: async (data) => {
    const response = await fetch(`${API_BASE_URL}/gia-tri-bien-the`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  // Cập nhật giá trị
  update: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/gia-tri-bien-the/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  // Xóa giá trị
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/gia-tri-bien-the/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// ==================== UPLOAD ẢNH ====================
export const uploadAPI = {
  // Upload ảnh sản phẩm (AnhSP)
  uploadAnhSanPham: async (file, maSP, thuTuHienThi = 0) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('maSP', maSP);
    formData.append('thuTuHienThi', thuTuHienThi);

    const response = await fetch(`${API_BASE_URL}/upload/anh-san-pham`, {
      method: 'POST',
      headers: getAuthHeadersNoContentType(),
      body: formData
    });
    return handleResponse(response);
  },

  // Upload ảnh biến thể (BienThe)
  uploadAnhBienThe: async (file, maBienThe) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('maBienThe', maBienThe);

    const response = await fetch(`${API_BASE_URL}/upload/anh-bien-the`, {
      method: 'POST',
      headers: getAuthHeadersNoContentType(),
      body: formData
    });
    return handleResponse(response);
  },

  // Upload nhiều ảnh sản phẩm
  uploadBulkAnhSanPham: async (files, maSP) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    formData.append('maSP', maSP);

    const response = await fetch(`${API_BASE_URL}/upload/anh-san-pham/bulk`, {
      method: 'POST',
      headers: getAuthHeadersNoContentType(),
      body: formData
    });
    return handleResponse(response);
  }
};
