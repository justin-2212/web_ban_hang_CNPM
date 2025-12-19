/**
 * Utility functions cho format dữ liệu
 */

/**
 * Format price theo VND
 */
export const formatVND = (price = 0) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Format datetime theo múi giờ VN
 */
export const formatDateVN = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Sanitize string input
 */
export const sanitizeInput = (str) => {
  if (!str) return '';
  return str.trim().replace(/<[^>]*>/g, '');
};
