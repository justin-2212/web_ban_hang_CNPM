// Script để test MOMO callback locally
// ⚠️ NOTE: This is for testing purposes only
// In production, MOMO callbacks require a public URL
// 
// Chạy: node testMomoCallback.js

import axios from "axios";
import crypto from "crypto";

const testCallback = async () => {
  console.log("🧪 Testing MOMO callback...\n");

  const backendUrl = "http://localhost:5000"; // ✅ Local only
  const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
  const accessKey = "F8BBA842ECF85";
  const partnerCode = "MOMO";

  // ⚠️ QUAN TRỌNG: Thay đổi giá trị này để match với đơn hàng thực
  // Nếu bạn tạo đơn hàng #1 với tổng = 529000 VND
  // Thì phải set amount = "529000" ở đây
  const maDonHang = 1; // ID đơn hàng vừa tạo
  const amount = "529000"; // ✅ Phải match với TongTien trong DB

  // Giả lập callback từ MOMO (thành công)
  const mockData = {
    partnerCode,
    orderId: `MOMO${Date.now()}`,
    requestId: `MOMO${Date.now()}`,
    amount, // ✅ PHẢI match với số tiền đơn hàng
    orderInfo: `Thanh toan Apple Store - Order #${maDonHang}`, // ✅ Format đúng
    orderType: "momo_wallet",
    transId: `TXN${Date.now()}`,
    resultCode: "0", // 0 = thành công
    message: "Successful.",
    payType: "qr",
    responseTime: Date.now().toString(),
    extraData: "",
    accessKey,
  };

  console.log("📋 Mock Data:");
  console.log(`  Order ID: #${maDonHang}`);
  console.log(`  Amount: ${amount} VND`);
  console.log(`  OrderInfo: ${mockData.orderInfo}`);
  console.log("\n");

  // Tạo signature
  const rawSignature =
    "accessKey=" + mockData.accessKey +
    "&amount=" + mockData.amount +
    "&extraData=" + mockData.extraData +
    "&message=" + mockData.message +
    "&orderId=" + mockData.orderId +
    "&orderInfo=" + mockData.orderInfo +
    "&orderType=" + mockData.orderType +
    "&partnerCode=" + mockData.partnerCode +
    "&payType=" + mockData.payType +
    "&requestId=" + mockData.requestId +
    "&responseTime=" + mockData.responseTime +
    "&resultCode=" + mockData.resultCode +
    "&transId=" + mockData.transId;

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  const callbackUrl = `${backendUrl}/api/thanh-toan/momo/callback`;

  console.log("📤 Sending MOMO callback simulation...\n");
  console.log(`URL: ${callbackUrl}`);
  console.log(`Signature: ${signature}`);
  console.log("\n");

  try {
    const response = await axios.get(callbackUrl, {
      params: {
        ...mockData,
        signature,
      },
      maxRedirects: 0,
      validateStatus: (status) => status < 400,
    });

    console.log("✅ Callback processed!");
    console.log(`Status: ${response.status}`);
    console.log(`Redirect location: ${response.headers.location || "No redirect"}`);
    
    // Parse redirect URL để hiển thị kết quả
    if (response.headers.location) {
      const redirectUrl = new URL(response.headers.location);
      const status = redirectUrl.searchParams.get("status");
      const message = redirectUrl.searchParams.get("message");
      const orderId = redirectUrl.searchParams.get("orderId");
      
      console.log("\n📍 Redirect Details:");
      console.log(`  Status: ${status}`);
      console.log(`  Order ID: ${orderId}`);
      console.log(`  Message: ${decodeURIComponent(message || "")}`);
    }
  } catch (error) {
    if (error.response?.status === 302 || error.code === "ERR_FR_TOO_MANY_REDIRECTS") {
      console.log("✅ Callback successful (302 redirect)!");
      console.log(`Redirect to: ${error.response?.headers?.location || error.config?.url}`);
    } else {
      console.error("❌ Error:", error.message);
    }
  }
};

testCallback();