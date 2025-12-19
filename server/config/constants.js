/**
 * Server constants
 */

export const ORDER_STATUS = {
  PROCESSING: 0,
  SHIPPING: 1,
  DELIVERED: 2,
  CANCELLED: 3,
};

export const PAYMENT_STATUS = {
  UNPAID: 0,
  PAID_COD: 1,
  PAID_ONLINE: 2,
};

export const PAYMENT_METHOD = {
  COD: 'COD',
  ONLINE: 'ONLINE',
};

export const USER_ROLES = {
  ADMIN: 0,
  USER: 1,
};

export const PRODUCT_STATUS = {
  ACTIVE: 1,
  INACTIVE: 0,
};
