import crypto from "crypto";

const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
const accessKey = "F8BBA842ECF85";

// Giả lập callback từ MOMO
const mockCallback = {
  partnerCode: "MOMO",
  orderId: "MOMO1704067200000",
  requestId: "MOMO1704067200000",
  amount: "100000",
  orderInfo: "Thanh toan Apple Store - User #1",
  orderType: "momo_wallet",
  transId: "2999999999",
  resultCode: "0",
  message: "Successful.",
  payType: "qr",
  responseTime: Date.now().toString(),
  extraData: "",
  accessKey,
};

// ✅ Tạo signature theo thứ tự callback
const rawSignature =
  "accessKey=" + mockCallback.accessKey +
  "&amount=" + mockCallback.amount +
  "&extraData=" + mockCallback.extraData +
  "&message=" + mockCallback.message +
  "&orderId=" + mockCallback.orderId +
  "&orderInfo=" + mockCallback.orderInfo +
  "&orderType=" + mockCallback.orderType +
  "&partnerCode=" + mockCallback.partnerCode +
  "&payType=" + mockCallback.payType +
  "&requestId=" + mockCallback.requestId +
  "&responseTime=" + mockCallback.responseTime +
  "&resultCode=" + mockCallback.resultCode +
  "&transId=" + mockCallback.transId;

const signature = crypto
  .createHmac("sha256", secretKey)
  .update(rawSignature)
  .digest("hex");

console.log("✅ Test Signature:");
console.log(`Raw: ${rawSignature}`);
console.log(`\nSignature: ${signature}`);
