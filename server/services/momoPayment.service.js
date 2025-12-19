import crypto from "crypto";
import axios from "axios";

const MomoPaymentService = {
  /**
   * Tạo link thanh toán MOMO (v2 API)
   */
  createPaymentLink: async (maDonHang, soTien, returnUrl) => {
    const partnerCode = process.env.MOMO_PARTNER_CODE || "MOMO";
    const accessKey = process.env.MOMO_ACCESS_KEY || "F8BBA842ECF85";
    const secretKey = process.env.MOMO_SECRET_KEY || "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    const endpoint = process.env.MOMO_ENDPOINT || "https://test-payment.momo.vn/v2/gateway/api/create";

    try {
      const requestId = partnerCode + new Date().getTime();
      const orderId = requestId;
      const orderInfo = `Thanh toan Apple Store - Order #${maDonHang}`; // ✅ Format đúng
      const amount = soTien.toString();
      const requestType = "captureWallet";
      const extraData = ""; // ⚠️ Lưu ý: extraData rỗng lúc tạo

      const backendUrl = process.env.APP_URL || "http://localhost:5000";
      const redirectUrl = returnUrl;
      const ipnUrl = `${backendUrl}/api/thanh-toan/momo/callback`;

      console.log("[MOMO] 📝 Creating payment link");
      
      // Tạo chữ ký
      const rawSignature =
        "accessKey=" + accessKey +
        "&amount=" + amount +
        "&extraData=" + extraData +
        "&ipnUrl=" + ipnUrl +
        "&orderId=" + orderId +
        "&orderInfo=" + orderInfo +
        "&partnerCode=" + partnerCode +
        "&redirectUrl=" + redirectUrl +
        "&requestId=" + requestId +
        "&requestType=" + requestType;

      const signature = crypto
        .createHmac("sha256", secretKey)
        .update(rawSignature)
        .digest("hex");

      const requestBody = {
        partnerCode,
        accessKey,
        requestId,
        amount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        extraData,
        requestType,
        signature,
        lang: "vi",
      };

      const response = await axios({
        method: "POST",
        url: endpoint,
        headers: { "Content-Type": "application/json" },
        data: requestBody,
      });

      if (response.data.payUrl) {
        return {
          paymentUrl: response.data.payUrl,
          requestId,
          orderId,
        };
      } else {
        throw new Error(`MOMO error: ${response.data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("[MOMO] ❌ Error creating payment link:", error.message);
      throw error;
    }
  },

  // ✅ THÊM: Tạo payment link KHÔNG CẦN maDonHang
  createPaymentLinkWithoutOrder: async (orderInfo, soTien, returnUrl) => {
    const partnerCode = process.env.MOMO_PARTNER_CODE || "MOMO";
    const accessKey = process.env.MOMO_ACCESS_KEY || "F8BBA842ECF85";
    const secretKey = process.env.MOMO_SECRET_KEY || "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    const endpoint = process.env.MOMO_ENDPOINT || "https://test-payment.momo.vn/v2/gateway/api/create";

    try {
      const requestId = partnerCode + new Date().getTime();
      const orderId = requestId;
      // orderInfo = JSON string chứa giỏ hàng
      const amount = soTien.toString();
      const requestType = "captureWallet";
      const extraData = "";

      const backendUrl = process.env.APP_URL || "http://localhost:5000";
      const redirectUrl = returnUrl;
      const ipnUrl = `${backendUrl}/api/thanh-toan/momo/callback`;

      // Tạo chữ ký
      const rawSignature =
        "accessKey=" + accessKey +
        "&amount=" + amount +
        "&extraData=" + extraData +
        "&ipnUrl=" + ipnUrl +
        "&orderId=" + orderId +
        "&orderInfo=" + orderInfo +
        "&partnerCode=" + partnerCode +
        "&redirectUrl=" + redirectUrl +
        "&requestId=" + requestId +
        "&requestType=" + requestType;

      const signature = crypto
        .createHmac("sha256", secretKey)
        .update(rawSignature)
        .digest("hex");

      const requestBody = {
        partnerCode,
        accessKey,
        requestId,
        amount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        extraData,
        requestType,
        signature,
        lang: "vi",
      };

      const response = await axios({
        method: "POST",
        url: endpoint,
        headers: { "Content-Type": "application/json" },
        data: requestBody,
      });

      if (response.data.payUrl) {
        return {
          paymentUrl: response.data.payUrl,
          requestId,
          orderId,
        };
      } else {
        throw new Error(`MOMO error: ${response.data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("[MOMO] ❌ Error creating payment link:", error.message);
      throw error;
    }
  },

  /**
   * Xác minh chữ ký từ MOMO callback
   */
  verifySignature: (signature, data, secretKey) => {
    // ✅ FIX: Đảm bảo các trường không bị undefined
    const {
      accessKey,
      amount,
      extraData,
      message,
      orderId,
      orderInfo,
      orderType,
      partnerCode,
      payType,
      requestId,
      responseTime,
      resultCode,
      transId
    } = data;

    // ⚠️ QUAN TRỌNG: 
    // - Thứ tự tham số phải đúng chuẩn MOMO
    // - extraData phải xử lý: nếu undefined thì gán bằng "" (để khớp với lúc tạo)
    const rawSignature =
      "accessKey=" + accessKey +
      "&amount=" + amount +
      "&extraData=" + (extraData || "") + // ✅ Fix lỗi chính tại đây
      "&message=" + message +
      "&orderId=" + orderId +
      "&orderInfo=" + orderInfo +
      "&orderType=" + orderType +
      "&partnerCode=" + partnerCode +
      "&payType=" + payType +
      "&requestId=" + requestId +
      "&responseTime=" + responseTime +
      "&resultCode=" + resultCode +
      "&transId=" + transId;

    const computedSignature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");
    
    // Debug Log: Nếu vẫn lỗi, hãy chụp lại phần này ở console
    console.log("---------------------------------------------------");
    console.log("MOMO Sent Signature:   ", signature);
    console.log("Server Computed Signature: ", computedSignature);
    console.log("Raw String Server Used:", rawSignature);
    console.log("---------------------------------------------------");

    return signature === computedSignature;
  },
};

export default MomoPaymentService;