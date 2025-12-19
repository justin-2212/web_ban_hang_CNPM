/**
 * Validation helpers
 */

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate số điện thoại VN
 */
export const isValidPhoneVN = (phone) => {
  const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate số dương
 */
export const isPositiveNumber = (num) => {
  return !isNaN(num) && num > 0;
};
