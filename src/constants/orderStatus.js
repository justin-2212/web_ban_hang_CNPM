/**
 * Constants cho trạng thái đơn hàng & thanh toán
 */

export const ORDER_STATUS = {
  PROCESSING: 0,
  SHIPPING: 1,
  DELIVERED: 2,
  CANCELLED: 3,
};

export const ORDER_STATUS_DISPLAY = {
  [ORDER_STATUS.PROCESSING]: {
    text: '🕐 Đang xử lý',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  [ORDER_STATUS.SHIPPING]: {
    text: '🚚 Đang giao',
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  },
  [ORDER_STATUS.DELIVERED]: {
    text: '✅ Đã giao',
    color: 'bg-green-50 text-green-700 border-green-200',
  },
  [ORDER_STATUS.CANCELLED]: {
    text: '❌ Đã hủy',
    color: 'bg-red-50 text-red-700 border-red-200',
  },
};

export const PAYMENT_STATUS = {
  UNPAID: 0,
  PAID_COD: 1,
  PAID_ONLINE: 2,
};

export const PAYMENT_STATUS_DISPLAY = {
  [PAYMENT_STATUS.UNPAID]: {
    text: 'Chưa thanh toán',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  [PAYMENT_STATUS.PAID_COD]: {
    text: 'Thanh toán khi nhận (COD)',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  [PAYMENT_STATUS.PAID_ONLINE]: {
    text: '✅ Đã thanh toán',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
};

export const PAYMENT_METHOD = {
  COD: 'COD',
  ONLINE: 'ONLINE',
};
