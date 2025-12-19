/**
 * Utility functions cho format dữ liệu (Frontend)
 */

/**
 * Format giá tiền VND
 */
export const formatPrice = (price = 0) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Format ngày giờ
 */
export const formatDate = (dateString) => {
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
 * Truncate text với ellipsis
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Remove HTML tags
 */
export const stripHTML = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
};
