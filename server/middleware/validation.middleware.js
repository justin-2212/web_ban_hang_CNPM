import { AppError } from './errorHandler.middleware.js';

/**
 * Validate required fields trong request body
 */
export const validateRequiredFields = (...fields) => {
  return (req, res, next) => {
    const missingFields = fields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Thiếu thông tin bắt buộc: ${missingFields.join(', ')}`
      });
    }
    
    next();
  };
};

/**
 * Validate email format
 */
export const validateEmail = (req, res, next) => {
  const { gmail, email } = req.body;
  const emailField = gmail || email;
  
  if (emailField && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField)) {
    return res.status(400).json({
      success: false,
      message: 'Email không hợp lệ'
    });
  }
  
  next();
};

/**
 * Validate số điện thoại VN
 */
export const validatePhone = (req, res, next) => {
  const { soDienThoai } = req.body;
  
  if (soDienThoai && !/^(0|\+84)[0-9]{9,10}$/.test(soDienThoai)) {
    return res.status(400).json({
      success: false,
      message: 'Số điện thoại không hợp lệ'
    });
  }
  
  next();
};
