import db from '../config/db.js';

/**
 * Middleware xác thực dựa trên ClerkID hoặc email
 * Frontend gửi ClerkID hoặc email qua header X-User-ID hoặc X-User-Email
 */
export const authenticate = async (req, res, next) => {
  try {
    // Lấy thông tin user từ header (do frontend gửi lên)
    const clerkId = req.headers['x-clerk-id'];
    const userEmail = req.headers['x-user-email'];
    
    // Debug logging
    console.log('🔐 Auth Middleware:', {
      clerkId: clerkId ? clerkId.substring(0, 10) + '...' : 'missing',
      userEmail: userEmail || 'missing',
      headers: Object.keys(req.headers)
    });
    
    if (!clerkId && !userEmail) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập để tiếp tục',
        debug: 'Missing X-Clerk-Id and X-User-Email headers'
      });
    }

    // Tìm user trong DB theo ClerkID hoặc Email
    let query = '';
    let params = [];
    
    if (clerkId) {
      query = 'SELECT MaTaiKhoan, Gmail, TenDayDu, Quyen, SoDienThoai, DiaChi, ClerkID FROM TaiKhoan WHERE ClerkID = ? AND TinhTrangTaiKhoan = 1';
      params = [clerkId];
    } else {
      query = 'SELECT MaTaiKhoan, Gmail, TenDayDu, Quyen, SoDienThoai, DiaChi, ClerkID FROM TaiKhoan WHERE Gmail = ? AND TinhTrangTaiKhoan = 1';
      params = [userEmail];
    }

    const [users] = await db.query(query, params);

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản không tồn tại hoặc đã bị vô hiệu hóa'
      });
    }

    // Attach user vào request
    req.user = users[0];
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware xác thực optional (không bắt buộc đăng nhập)
 * Nếu có thông tin user thì attach, không có thì vẫn cho qua
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const clerkId = req.headers['x-clerk-id'];
    const userEmail = req.headers['x-user-email'];
    
    if (!clerkId && !userEmail) {
      return next();
    }

    let query = '';
    let params = [];
    
    if (clerkId) {
      query = 'SELECT MaTaiKhoan, Gmail, TenDayDu, Quyen, SoDienThoai, DiaChi, ClerkID FROM TaiKhoan WHERE ClerkID = ? AND TinhTrangTaiKhoan = 1';
      params = [clerkId];
    } else {
      query = 'SELECT MaTaiKhoan, Gmail, TenDayDu, Quyen, SoDienThoai, DiaChi, ClerkID FROM TaiKhoan WHERE Gmail = ? AND TinhTrangTaiKhoan = 1';
      params = [userEmail];
    }

    const [users] = await db.query(query, params);

    if (users.length > 0) {
      req.user = users[0];
    }
    
    next();
  } catch (error) {
    // Ignore errors in optional auth
    next();
  }
};

/**
 * Alias cho authenticate để tương thích với code cũ
 */
export const authenticateToken = authenticate;
