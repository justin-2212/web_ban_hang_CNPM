import db from "../config/db.js";
import GioHang from "../models/gioHang.model.js";
import BienThe from "../models/bienThe.model.js";

const CheckoutService = {
  checkout: async ({ maTaiKhoan, phuongThucThanhToan }) => {
    const conn = await db.getConnection();

    try {
      await conn.beginTransaction();

      // 1. Lấy giỏ hàng
      const cartItems = await GioHang.getByUser(maTaiKhoan, conn);

      if (!cartItems || cartItems.length === 0) {
        throw new Error(
          "Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán."
        );
      }

      // 2. Kiểm tra tồn kho
      let tongTien = 0;

      for (const item of cartItems) {
        const variant = await BienThe.getById(item.MaBienThe, conn);

        if (!variant) {
          throw new Error(`Biến thể ${item.MaBienThe} không tồn tại`);
        }

        if (item.SoLuong > variant.SoLuongTonKho) {
          throw new Error(
            `Biến thể ${item.TenBienThe} chỉ còn ${variant.SoLuongTonKho} sản phẩm`
          );
        }

        tongTien += item.SoLuong * variant.GiaTienBienThe;
      }

      // 3. Tạo đơn hàng
      const DonHang = (await import("../models/donHang.model.js")).default;

      const maDonHang = await DonHang.createOrder(
        {
          maTaiKhoan,
          tongTien,
          phuongThucThanhToan,
        },
        conn
      );

      // 4. Tạo chi tiết đơn hàng
      for (const item of cartItems) {
        await DonHang.addOrderDetail(
          maDonHang,
          {
            maBienThe: item.MaBienThe,
            soLuong: item.SoLuong,
            giaTien: item.GiaTienBienThe,
          },
          conn
        );
      }

      // ✅ 5. XỬ LÝ THEO PHƯƠNG THỨC THANH TOÁN
      if (phuongThucThanhToan === "COD") {
        // ✅ COD: Trừ kho + Xóa giỏ NGAY
        for (const item of cartItems) {
          await BienThe.decreaseStock(item.MaBienThe, item.SoLuong, conn);
        }
        await GioHang.clearCart(maTaiKhoan, conn);

        console.log(
          `[CHECKOUT] ✅ COD Order #${maDonHang} - Cleared cart & decreased stock`
        );
      } else if (phuongThucThanhToan === "ONLINE") {
        // ✅ ONLINE: KHÔNG trừ kho, KHÔNG xóa giỏ
        // Tạo bản ghi ThongTinThanhToanOnline với TinhTrangThanhToan = 0 (Pending)
        await DonHang.createOnlinePaymentInfo(
          {
            maDonHang,
            soTien: tongTien,
            maGiaoDich: null, // Chưa có mã giao dịch
          },
          conn
        );

        console.log(
          `[CHECKOUT] ⏳ ONLINE Order #${maDonHang} - PENDING (cart preserved)`
        );
      }

      await conn.commit();

      return { maDonHang, tongTien };
    } catch (error) {
      await conn.rollback();
      console.error(`[CHECKOUT] ❌ Error:`, error.message);
      throw error;
    } finally {
      conn.release();
    }
  },
};

export default CheckoutService;