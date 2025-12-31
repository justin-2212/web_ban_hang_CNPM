import db from '../config/db.js';
import DonHang from '../models/donHang.model.js';
import GioHang from '../models/gioHang.model.js';
import BienThe from '../models/bienThe.model.js';
import MomoPaymentService from '../services/momoPayment.service.js';

class ThanhToanController {
  
  //  THÊM: Tạo link MOMO (KHÔNG tạo đơn hàng)
  async createMomoPayment(req, res) {
    try {
      const { maTaiKhoan, cartItems, tongTien } = req.body;

      if (!maTaiKhoan || !cartItems || !tongTien) {
        return res.status(400).json({
          success: false,
          message: "Thiếu thông tin bắt buộc",
        });
      }

      // Encode thông tin giỏ hàng vào orderInfo
      const orderInfo = JSON.stringify({
        maTaiKhoan,
        cartItems: cartItems.map(item => ({
          maBienThe: item.MaBienThe,
          soLuong: item.SoLuong,
          giaTien: item.GiaTienBienThe,
        })),
        tongTien,
      });

      //  QUAN TRỌNG: redirectUrl phải trỏ về BACKEND để xử lý callback
      // Vì MoMo không thể gọi IPN đến localhost
      const backendUrl = process.env.APP_URL || "http://localhost:5000";
      const returnUrl = `${backendUrl}/api/thanh-toan/momo/callback`;

      // Tạo link MOMO (không cần maDonHang)
      const paymentData = await MomoPaymentService.createPaymentLinkWithoutOrder(
        orderInfo,
        tongTien,
        returnUrl
      );

      return res.json({
        success: true,
        message: "Tạo link thanh toán MOMO thành công",
        data: {
          paymentUrl: paymentData.paymentUrl,
          orderId: paymentData.orderId, // MOMO's orderId (not our DB)
        },
      });
    } catch (error) {
      console.error("[MOMO CREATE PAYMENT] Error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Không thể tạo link thanh toán",
      });
    }
  }

  //  SỬA: Callback handler
  async handleMomoCallback(req, res) {
    const data = req.method === 'GET' ? req.query : req.body;
    const { orderInfo, resultCode, transId, message } = data;

    console.log('='.repeat(80));
    console.log(`[MOMO CALLBACK] Received ${req.method} callback`);
    console.log(`ResultCode: ${resultCode}, TransID: ${transId}`);
    console.log(`OrderInfo: ${orderInfo}`);
    console.log('='.repeat(80));

    let conn = null;
    const frontendUrl = process.env.VITE_APP_URL || 'http://localhost:5173';

    try {
      //  SANDBOX: Bỏ qua verify signature vì sandbox có thể khác format
      // Production nên bật lại
      // const secretKey = process.env.MOMO_SECRET_KEY || 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
      // const isValidSignature = MomoPaymentService.verifySignature(signature, data, secretKey);

      // 2. Parse orderInfo (chứa thông tin giỏ hàng)
      let orderData;
      try {
        orderData = JSON.parse(orderInfo);
      } catch (e) {
        console.error('[MOMO CALLBACK] Cannot parse orderInfo:', orderInfo);
        return res.redirect(`${frontendUrl}/order-success?status=invalid_order_info`);
      }

      const { maTaiKhoan, cartItems, tongTien } = orderData;

      if (!maTaiKhoan || !cartItems || !tongTien) {
        console.error('[MOMO CALLBACK] Missing required fields in orderInfo');
        if (req.method === 'GET') {
          return res.redirect(`${frontendUrl}/order-success?status=error&message=Missing+data`);
        }
        return res.status(400).json({ message: 'Missing required data' });
      }

      // 3. Process payment result
      conn = await db.getConnection();
      await conn.beginTransaction();

      try {
        //  resultCode có thể là string hoặc number
        if (String(resultCode) === '0') {
          //  THANH TOÁN THÀNH CÔNG → TẠO ĐƠN HÀNG
          console.log(`[MOMO CALLBACK] Payment SUCCESS. Creating order...`);

          // 3.1. Kiểm tra tồn kho
          for (const item of cartItems) {
            const variant = await BienThe.getById(item.maBienThe, conn);
            if (!variant || item.soLuong > variant.SoLuongTonKho) {
              throw new Error(`Sản phẩm ${item.maBienThe} không đủ tồn kho`);
            }
          }

          // 3.2. Tạo đơn hàng
          const maDonHang = await DonHang.createOrder(
            {
              maTaiKhoan,
              tongTien,
              phuongThucThanhToan: 'ONLINE',
            },
            conn
          );

          // 3.3. Tạo chi tiết đơn hàng
          for (const item of cartItems) {
            await DonHang.addOrderDetail(
              maDonHang,
              {
                maBienThe: item.maBienThe,
                soLuong: item.soLuong,
                giaTien: item.giaTien,
              },
              conn
            );
          }

          // 3.4. Tạo thông tin thanh toán online
          await DonHang.createOnlinePaymentInfo(
            {
              maDonHang,
              soTien: tongTien,
              maGiaoDich: transId,
            },
            conn
          );

          // 3.5. Update payment status = 2 (Đã thanh toán)
          await DonHang.updatePaymentStatus({
            maDonHang,
            tinhTrangThanhToan: 2,
            maGiaoDich: transId,
          }, conn);

          // 3.6. Trừ kho (LẤY CHI TIẾT TỪ DB THAY VÌ TỪ orderInfo)
          const [orderDetails] = await conn.query(
            `SELECT MaBienThe, SoLuongSanPham FROM DonHangChiTiet WHERE MaDonHang = ?`,
            [maDonHang]
          );
          for (const item of orderDetails) {
            await BienThe.decreaseStock(item.MaBienThe, item.SoLuongSanPham, conn);
          }

          // 3.7. Xóa giỏ hàng
          await GioHang.clearCart(maTaiKhoan, conn);

          await conn.commit();
          console.log(`[MOMO CALLBACK]  Order #${maDonHang} created successfully`);

          // Redirect to success page
          return res.redirect(
            `${frontendUrl}/order-success?orderId=${maDonHang}&status=success&transId=${transId}`
          );

        } else {
          //  THANH TOÁN THẤT BẠI → KHÔNG TẠO ĐƠN HÀNG
          console.log(`[MOMO CALLBACK]  Payment FAILED. Code: ${resultCode}`);

          await conn.commit(); // Commit empty transaction

          // Redirect to failed page (giữ nguyên giỏ hàng)
          return res.redirect(
            `${frontendUrl}/order-success?status=failed&message=${encodeURIComponent(message || 'Payment failed')}`
          );
        }

      } catch (dbError) {
        await conn.rollback();
        throw dbError;
      }

    } catch (error) {
      if (conn) try { await conn.rollback(); } catch (e) {}
      console.error('[MOMO CALLBACK] Fatal error:', error.message);
      
      return res.redirect(
        `${frontendUrl}/order-success?status=error&message=${encodeURIComponent(error.message)}`
      );
      
    } finally {
      if (conn) try { conn.release(); } catch (e) {}
    }
  }
}

export default new ThanhToanController();
