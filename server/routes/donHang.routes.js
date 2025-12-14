import express from "express";
import DonHang from "../models/donHang.model.js";

const router = express.Router();

/**
 * GET /api/don-hang/:maDonHang
 * Lấy chi tiết đơn hàng
 */
router.get("/:maDonHang", async (req, res) => {
  try {
    const { maDonHang } = req.params;
    const order = await DonHang.getById(maDonHang);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    return res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Lỗi khi tải đơn hàng",
    });
  }
});

/**
 * GET /api/don-hang/user/:maTaiKhoan
 * Lấy danh sách đơn hàng của user
 */
router.get("/user/:maTaiKhoan", async (req, res) => {
  try {
    const { maTaiKhoan } = req.params;
    const orders = await DonHang.getByUser(maTaiKhoan);

    return res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Lỗi khi tải danh sách đơn hàng",
    });
  }
});

/**
 * PUT /api/don-hang/:maDonHang/status
 * Cập nhật trạng thái đơn hàng
 */
router.put("/:maDonHang/status", async (req, res) => {
  try {
    const { maDonHang } = req.params;
    const { tinhTrangDonHang } = req.body;

    if (tinhTrangDonHang === undefined) {
      return res.status(400).json({
        success: false,
        message: "Thiếu trạng thái đơn hàng",
      });
    }

    const affected = await DonHang.updateOrderStatus(
      maDonHang,
      tinhTrangDonHang
    );

    if (affected === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    return res.json({
      success: true,
      message: "Cập nhật trạng thái đơn hàng thành công",
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Lỗi khi cập nhật trạng thái đơn hàng",
    });
  }
});

/**
 * GET /api/don-hang/:maDonHang/payment-status
 * Lấy trạng thái thanh toán online (nếu có)
 */
router.get("/:maDonHang/payment-status", async (req, res) => {
  try {
    const { maDonHang } = req.params;
    const paymentInfo = await DonHang.getPaymentInfo(maDonHang);

    return res.json({
      success: true,
      data: paymentInfo,
    });
  } catch (error) {
    console.error("Error fetching payment status:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Lỗi khi tải trạng thái thanh toán",
    });
  }
});

export default router;
