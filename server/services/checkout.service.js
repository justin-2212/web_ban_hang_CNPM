import db from "../config/db.js";
import GioHang from "../models/gioHang.model.js";
import BienThe from "../models/bienThe.model.js";

const CheckoutService = {
  checkout: async ({ maTaiKhoan, phuongThucThanhToan }) => {
    // ===== COD hoặc ONLINE: Lưu đơn hàng ngay =====
    const conn = await db.getConnection();

    try {
      await conn.beginTransaction();

      // 1. Lấy giỏ hàng (PHẢI truyền conn)
      const cartItems = await GioHang.getByUser(maTaiKhoan, conn);

      console.log(
        `[CHECKOUT] User ${maTaiKhoan}: Found ${cartItems.length} cart items`
      );

      if (!cartItems || cartItems.length === 0) {
        throw new Error(
          "Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán."
        );
      }

      // 2. Kiểm tra tồn kho + tính tổng tiền
      let tongTien = 0;

      for (const item of cartItems) {
        // ✅ Truyền conn
        const variant = await BienThe.getById(item.MaBienThe, conn);

        if (!variant) {
          throw new Error(`Biến thể ${item.MaBienThe} không tồn tại`);
        }

        if (item.SoLuong > variant.SoLuongTonKho) {
          throw new Error(
            `Biến thể ${item.TenBienThe} chỉ còn ${variant.SoLuongTonKho} sản phẩm, bạn yêu cầu ${item.SoLuong}`
          );
        }

        tongTien += item.SoLuong * variant.GiaTienBienThe;
      }

      console.log(
        `[CHECKOUT] Total: ${tongTien}VND, Payment: ${phuongThucThanhToan}`
      );

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

      console.log(`[CHECKOUT] Order created: #${maDonHang}`);

      // 4. Tạo chi tiết đơn + trừ tồn kho
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

        // ✅ Truyền conn
        await BienThe.decreaseStock(item.MaBienThe, item.SoLuong, conn);
      }

      // ✅ KHÔNG cập nhật TinhTrangThanhToan cho COD & ONLINE
      // Để mặc định = 0 (chưa thanh toán)
      // - COD: Admin cập nhật sau khi nhận hàng
      // - ONLINE: Callback MOMO cập nhật thành 1

      // 5. ✅ Xóa giỏ hàng (PHẢI truyền conn)
      await GioHang.clearCart(maTaiKhoan, conn);

      await conn.commit();

      console.log(
        `[CHECKOUT] ✅ Success: Order #${maDonHang}, Payment: ${phuongThucThanhToan}, TinhTrangThanhToan: 0`
      );

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