/**
 * Middleware kiểm tra quyền admin
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Vui lòng đăng nhập'
    });
  }

  if (req.user.Quyen !== 0) {
    return res.status(403).json({
      success: false,
      message: 'Bạn không có quyền truy cập'
    });
  }

  next();
};

/**
 * Middleware kiểm tra quyền theo role
 * @param {string[]} allowedRoles - Mảng các role được phép
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập'
      });
    }

    if (!allowedRoles.includes(req.user.Quyen)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền truy cập'
      });
    }

    next();
  };
};

/**
 * Middleware kiểm tra user chỉ được truy cập tài nguyên của chính mình
 * Dùng cho các route như /profile/:id, /orders/:userId
 */
export const requireOwnership = (paramName = 'id') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập'
      });
    }

    const resourceId = parseInt(req.params[paramName]) || parseInt(req.body.maTaiKhoan);
    
    // Admin có thể truy cập mọi tài nguyên
    if (req.user.Quyen === 'Admin') {
      return next();
    }

    // User chỉ được truy cập tài nguyên của mình
    if (req.user.MaTaiKhoan !== resourceId) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền truy cập tài nguyên này'
      });
    }

    next();
  };
};
