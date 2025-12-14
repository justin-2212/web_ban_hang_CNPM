import db from "../config/db.js";
import DonHang from "../models/donHang.model.js";
import GioHang from "../models/gioHang.model.js";
import BienThe from "../models/bienThe.model.js";

const ThanhToanService = {
  // ✅ Thanh toán thành công (từ MOMO callback)
  thanhToanThanhCong: async ({ maDonHang, maGiaoDich, maTaiKhoan }) => {
    const conn = await db.getConnection();

    try {
      await conn.beginTransaction();

      // 1. Lấy thông tin đơn hàng
      const orderInfo = await DonHang.getById(maDonHang);

      if (!orderInfo) {
        throw new Error(`Đơn hàng #${maDonHang} không tồn tại`);
      }

      // 2. Cập nhật Payment Status = 1 (Thành công)
      // ⚠️ Đã bổ sung maGiaoDich
      await DonHang.updatePaymentStatus(
        {
          maDonHang,
          tinhTrangThanhToan: 1, // 1: Thành công
          maGiaoDich: maGiaoDich, // ✅ Bắt buộc phải có để lưu mã MOMO
        },
        conn
      );

      // 3. Cập nhật trạng thái đơn hàng: 0 = Đang xử lý
      await DonHang.updateOrderStatus(maDonHang, 0, conn);

      // 4. Trừ tồn kho
      for (const item of orderInfo.chiTiet) {
        await BienThe.decreaseStock(item.MaBienThe, item.SoLuongSanPham, conn);
      }

      // 5. Xóa giỏ hàng
      const actualMaTaiKhoan = maTaiKhoan || orderInfo.MaTaiKhoan;
      await GioHang.clearCart(actualMaTaiKhoan, conn);

      await conn.commit();
      console.log(`[THANH TOAN] ✅ Order #${maDonHang} success. TransID: ${maGiaoDich}`);
      return { success: true };

    } catch (error) {
      await conn.rollback();
      console.error(`[THANH TOAN] ❌ Error:`, error.message);
      throw error;
    } finally {
      conn.release();
    }
  },

  // ❌ Thanh toán thất bại (từ MOMO callback hoặc timeout)
  thanhToanThatBai: async ({ maDonHang }) => {
    const conn = await db.getConnection();

    try {
      await conn.beginTransaction();

      // 1. Cập nhật Payment Status = 2 (Thất bại)
      // ✅ Cần update để biết là giao dịch này đã fail, không phải đang treo
      await DonHang.updatePaymentStatus(
        {
          maDonHang,
          tinhTrangThanhToan: 2, // 2: Thất bại (Quy ước thêm)
          maGiaoDich: null,
        },
        conn
      );

      // 2. Cập nhật trạng thái đơn hàng: 3 = Hủy
      await DonHang.updateOrderStatus(maDonHang, 3, conn);

      // ⚠️ Giữ nguyên giỏ hàng để user mua lại

      await conn.commit();
      console.log(`[THANH TOAN] ❌ Order #${maDonHang} failed/cancelled.`);
      return { success: true };

    } catch (error) {
      await conn.rollback();
      console.error(`[THANH TOAN] ❌ Error:`, error.message);
      throw error;
    } finally {
      conn.release();
    }
  },
};

export default ThanhToanService;