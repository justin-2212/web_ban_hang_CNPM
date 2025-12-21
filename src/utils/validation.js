/**
 * Validate Vietnamese phone number (10 digits, starts with 0)
 * @param {string} phone
 * @returns {object} { isValid: boolean, message: string }
 */
export const validatePhoneNumber = (phone) => {
  if (!phone || phone.trim() === "") {
    return { isValid: false, message: "Số điện thoại không được để trống" };
  }

  const phoneRegex = /^0\d{9}$/; // 0 followed by 9 more digits (total 10)
  if (!phoneRegex.test(phone)) {
    return {
      isValid: false,
      message: "Số điện thoại không hợp lệ (phải có 10 số, bắt đầu bằng 0)",
    };
  }

  return { isValid: true, message: "" };
};

/**
 * Validate Vietnamese address
 * @param {string} address
 * @returns {object} { isValid: boolean, message: string }
 */
export const validateAddress = (address) => {
  if (!address || address.trim() === "") {
    return { isValid: false, message: "Địa chỉ không được để trống" };
  }

  if (address.trim().length < 10) {
    return {
      isValid: false,
      message: "Địa chỉ phải có ít nhất 10 ký tự",
    };
  }

  return { isValid: true, message: "" };
};

/**
 * Validate both phone and address together
 * @returns {object} { isValid: boolean, errors: { phone?: string, address?: string } }
 */
export const validateDeliveryInfo = (phone, address) => {
  const errors = {};

  const phoneValidation = validatePhoneNumber(phone);
  if (!phoneValidation.isValid) {
    errors.phone = phoneValidation.message;
  }

  const addressValidation = validateAddress(address);
  if (!addressValidation.isValid) {
    errors.address = addressValidation.message;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
