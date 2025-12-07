const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper function
const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Có lỗi xảy ra');
    return data;
};

// ============ SẢN PHẨM ============
export const sanPhamAPI = {
    // Lấy tất cả sản phẩm với filter & sort
    getAll: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return fetch(`${API_BASE}/san-pham${queryString ? '?' + queryString : ''}`).then(handleResponse);
    },
    
    getById: (id) => fetch(`${API_BASE}/san-pham/${id}`).then(handleResponse),
    
    // Lấy theo loại với filter
    getByCategory: (maLoai, params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return fetch(`${API_BASE}/san-pham/loai/${maLoai}${queryString ? '?' + queryString : ''}`).then(handleResponse);
    },
    
    // Chi tiết đầy đủ (kèm variants, images, specs)
    getDetail: (id) => fetch(`${API_BASE}/san-pham/chi-tiet/${id}`).then(handleResponse),
    
    // Tìm kiếm sản phẩm
    search: (keyword) => fetch(`${API_BASE}/san-pham/search?q=${encodeURIComponent(keyword)}`).then(handleResponse),
    
    create: (data) => fetch(`${API_BASE}/san-pham`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse),
    
    update: (id, data) => fetch(`${API_BASE}/san-pham/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse),
    
    delete: (id) => fetch(`${API_BASE}/san-pham/${id}`, { method: 'DELETE' }).then(handleResponse)
};

// ============ LOẠI SẢN PHẨM ============
export const loaiSanPhamAPI = {
    getAll: () => fetch(`${API_BASE}/loai-san-pham`).then(handleResponse),
    getAllWithImages: () => fetch(`${API_BASE}/loai-san-pham/with-images`).then(handleResponse),
    getById: (id) => fetch(`${API_BASE}/loai-san-pham/${id}`).then(handleResponse)
};

// ============ GIỎ HÀNG ============
export const gioHangAPI = {
    get: (maTaiKhoan) => fetch(`${API_BASE}/gio-hang/${maTaiKhoan}`).then(handleResponse),
    
    addItem: (maTaiKhoan, maBienThe, soLuong) => fetch(`${API_BASE}/gio-hang`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maTaiKhoan, maBienThe, soLuong })
    }).then(handleResponse),
    
    updateQuantity: (maTaiKhoan, maBienThe, soLuong) => fetch(`${API_BASE}/gio-hang`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maTaiKhoan, maBienThe, soLuong })
    }).then(handleResponse),
    
    removeItem: (maTaiKhoan, maBienThe) => 
        fetch(`${API_BASE}/gio-hang/${maTaiKhoan}/${maBienThe}`, { method: 'DELETE' }).then(handleResponse),
    
    clearCart: (maTaiKhoan) => 
        fetch(`${API_BASE}/gio-hang/clear/${maTaiKhoan}`, { method: 'DELETE' }).then(handleResponse)
};

// ============ TÀI KHOẢN ============
export const taiKhoanAPI = {
    login: (gmail) => fetch(`${API_BASE}/tai-khoan/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gmail })
    }).then(handleResponse),
    
    register: (data) => fetch(`${API_BASE}/tai-khoan/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse),
    
    getProfile: (id) => fetch(`${API_BASE}/tai-khoan/${id}`).then(handleResponse),
    
    updateProfile: (id, data) => fetch(`${API_BASE}/tai-khoan/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse)
};

// ============ ĐƠN HÀNG ============
export const donHangAPI = {
    create: (data) => fetch(`${API_BASE}/don-hang`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse),
    
    getByUser: (maTaiKhoan) => fetch(`${API_BASE}/don-hang/user/${maTaiKhoan}`).then(handleResponse),
    
    getById: (id) => fetch(`${API_BASE}/don-hang/${id}`).then(handleResponse),
    
    updateStatus: (id, status) => fetch(`${API_BASE}/don-hang/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    }).then(handleResponse)
};