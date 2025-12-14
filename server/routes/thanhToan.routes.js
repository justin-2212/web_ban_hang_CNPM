import express from "express";
import db from "../config/db.js";
import DonHang from "../models/donHang.model.js";
import MomoPaymentService from "../services/momoPayment.service.js";
// ❌ Bỏ import GioHang và BienThe vì không cần dùng trong callback nữa

const router = express.Router();

//⚠️ HANDLER CHUNG cho cả GET và POST callback
const handleMomoCallback = async (req, res) => {
  // Lấy data từ query (GET) hoặc body (POST)
  const data = req.method === "GET" ? req.query : req.body;

  const {
    partnerCode,
    orderId,
    requestId,
    amount,
    orderInfo,
    orderType,
    transId,
    resultCode,
    message,
    payType,
    responseTime,
    extraData,
    signature,
  } = data;

  console.log("=".repeat(80));
  console.log(`[MOMO CALLBACK] ✅ CALLBACK TRIGGERED! (${req.method})`);
  console.log("=".repeat(80));

  let conn = null;
  const frontendUrl = process.env.VITE_APP_URL || "http://localhost:5173";

  try {
    const secretKey = process.env.MOMO_SECRET_KEY || "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    const accessKey = process.env.MOMO_ACCESS_KEY || "F8BBA842ECF85";

    // 1. Kiểm tra chữ ký
    const isValidSignature = MomoPaymentService.verifySignature(
      signature,
      {
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
        transId,
      },
      secretKey
    );

    if (!isValidSignature) {
      console.warn("[MOMO CALLBACK] ❌ Invalid signature!");
      if (req.method === "GET") {
        return res.redirect(`${frontendUrl}/order-success?status=invalid_signature`);
      }
      return res.status(400).json({ message: "Invalid signature" });
    }

    // 2. Trích xuất Mã Đơn Hàng từ orderInfo
    // Log cho thấy: "Thanh toan Apple Store - User #34" -> 34 chính là Mã Đơn Hàng đã tạo trước đó
    const match = orderInfo.match(/#(\d+)/);
    const maDonHang = match ? parseInt(match[1]) : null;

    if (!maDonHang) {
      console.error("[MOMO CALLBACK] Cannot extract Order ID from:", orderInfo);
      if (req.method === "GET") {
        return res.redirect(`${frontendUrl}/order-success?status=invalid_order_info`);
      }
      return res.status(400).json({ message: "Invalid order info" });
    }

    // 3. Lấy thông tin đơn hàng từ DB để kiểm tra
    const existingOrder = await DonHang.getById(maDonHang);
    
    if (!existingOrder) {
        console.error(`[MOMO CALLBACK] Order #${maDonHang} not found in DB`);
        if (req.method === "GET") {
            return res.redirect(`${frontendUrl}/order-success?status=error&message=Order+not+found`);
        }
        return res.status(404).json({ message: "Order not found" });
    }

    // Lấy User ID từ đơn hàng để redirect đúng
    const maTaiKhoan = existingOrder.MaTaiKhoan;

    console.log(`[MOMO CALLBACK] Found Order #${maDonHang} for User #${maTaiKhoan}. ResultCode: ${resultCode}`);

    // 4. Xử lý kết quả thanh toán
    conn = await db.getConnection();
    await conn.beginTransaction();

    try {
        if (resultCode === "0") {
            // ✅ THANH TOÁN THÀNH CÔNG
            // Cập nhật trạng thái thanh toán = 2 (Đã thanh toán)
            await DonHang.updatePaymentStatus(
                {
                    maDonHang,
                    tinhTrangThanhToan: 2,
                    maGiaoDich: transId,
                },
                conn
            );
            
            // Nếu cần, tạo record thanh toán online nếu chưa có (thường createOrder đã tạo rồi hoặc tạo ở đây)
            // Kiểm tra xem đã có record trong ThongTinThanhToanOnline chưa
            const paymentInfo = await DonHang.getPaymentInfo(maDonHang);
            if (!paymentInfo) {
                 await DonHang.createOnlinePaymentInfo({
                    maDonHang,
                    soTien: parseInt(amount),
                    maGiaoDich: transId
                 }, conn);
            }

            console.log(`[MOMO CALLBACK] ✅ Order #${maDonHang} payment updated: SUCCESS`);
        } else {
            // ❌ THANH TOÁN THẤT BẠI
            // Cập nhật trạng thái = 1 (Thất bại) hoặc giữ nguyên
            // Có thể hủy đơn hàng nếu muốn
            await DonHang.updatePaymentStatus(
                {
                    maDonHang,
                    tinhTrangThanhToan: 1, // 1: Lỗi/Thất bại (Tuỳ quy ước của bạn 1 hay 0)
                    maGiaoDich: transId,
                },
                conn
            );
            console.log(`[MOMO CALLBACK] ❌ Order #${maDonHang} payment updated: FAILED`);
        }

        await conn.commit();

        // 5. Redirect về Frontend
        if (req.method === "GET") {
            if (resultCode === "0") {
                return res.redirect(
                    `${frontendUrl}/order-success?orderId=${maDonHang}&status=success&transId=${transId}`
                );
            } else {
                return res.redirect(
                    `${frontendUrl}/order-success?status=failed&message=${encodeURIComponent(message)}&maTaiKhoan=${maTaiKhoan}`
                );
            }
        }
        
        return res.status(200).json({ message: "Callback processed" });

    } catch (dbError) {
        await conn.rollback();
        throw dbError;
    }

  } catch (error) {
    if (conn) try { await conn.rollback(); } catch (e) {}
    console.error("[MOMO CALLBACK] Fatal error:", error.message);
    
    if (req.method === "GET") {
      return res.redirect(
        `${frontendUrl}/order-success?status=error&message=${encodeURIComponent(error.message)}`
      );
    }
    return res.status(500).json({ message: error.message });
    
  } finally {
    if (conn) try { conn.release(); } catch (e) {}
  }
};

router.get("/momo/callback", handleMomoCallback);
router.post("/momo/callback", handleMomoCallback);
router.post("/momo/ipn", handleMomoCallback);

export default router;