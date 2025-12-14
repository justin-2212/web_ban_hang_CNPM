import db from "../config/db.js";

const DonHang = {
  // ===============================
  // Tạo đơn hàng
  // ===============================
  createOrder: async (
    {
      maTaiKhoan,
      tongTien,
      phuongThucThanhToan,
    },
    conn
  ) => {
    const connection = conn || db;

    const [result] = await connection.query(
      `
      INSERT INTO DonHang
        (MaTaiKhoan, NgayDat, TinhTrangDonHang, TongTien, PhuongThucThanhToan, TinhTrangThanhToan)
      VALUES
        (?, NOW(), ?, ?, ?, ?)
      `,
      [
        maTaiKhoan,
        0, // TinhTrangDonHang = Đang xử lý
        tongTien,
        phuongThucThanhToan,
        0, // TinhTrangThanhToan = Chưa thanh toán (mặc định)
      ]
    );

    return result.insertId;
  },

  // ===============================
  // Thêm chi tiết đơn hàng
  // ===============================
  addOrderDetail: async (
    maDonHang,
    { maBienThe, soLuong, giaTien },
    conn
  ) => {
    const connection = conn || db;

    const [result] = await connection.query(
      `
      INSERT INTO DonHangChiTiet
        (MaDonHang, MaBienThe, SoLuongSanPham, GiaTienCuaSanPham)
      VALUES
        (?, ?, ?, ?)
      `,
      [maDonHang, maBienThe, soLuong, giaTien]
    );

    return result.affectedRows;
  },

  // ===============================
  // Tạo thông tin thanh toán online (khi MOMO)
  // ===============================
  createOnlinePaymentInfo: async (
    { maDonHang, soTien, maGiaoDich },
    conn
  ) => {
    const connection = conn || db;

    // Lưu thông tin thanh toán online (trạng thái = 0: đang chờ)
    const [result] = await connection.query(
      `
      INSERT INTO ThongTinThanhToanOnline
        (MaDonHang, SoTienThanhToan, TinhTrangThanhToan, MaGiaoDich, ThoiDiemThanhToan)
      VALUES
        (?, ?, ?, ?, NOW())
      `,
      [maDonHang, soTien, 0, maGiaoDich || null]
    );

    return result.affectedRows;
  },

  // ===============================
  // Cập nhật trạng thái thanh toán ONLINE (khi callback từ MOMO)
  // ⚠️ CHỈ UPDATE ThongTinThanhToanOnline, KHÔNG UPDATE DonHang.TinhTrangThanhToan
  // ===============================
  updatePaymentStatus: async (
    { maDonHang, tinhTrangThanhToan, maGiaoDich },
    conn
  ) => {
    const connection = conn || db;

    // Update CHỈ bảng ThongTinThanhToanOnline
    const [paymentResult] = await connection.query(
      `
      UPDATE ThongTinThanhToanOnline
      SET
        TinhTrangThanhToan = ?,
        MaGiaoDich = ?,
        ThoiDiemThanhToan = NOW()
      WHERE MaDonHang = ?
      `,
      [tinhTrangThanhToan, maGiaoDich, maDonHang]
    );

    // Update DonHang.TinhTrangThanhToan để đồng bộ
    const [orderResult] = await connection.query(
      `
      UPDATE DonHang
      SET TinhTrangThanhToan = ?
      WHERE MaDonHang = ?
      `,
      [tinhTrangThanhToan, maDonHang]
    );

    return paymentResult.affectedRows + orderResult.affectedRows;
  },

  // ===============================
  // Cập nhật trạng thái đơn hàng (0=Đang xử lý, 1=Đang giao, 2=Đã giao, 3=Hủy)
  // ===============================
  updateOrderStatus: async (maDonHang, tinhTrangDonHang, conn) => {
    const connection = conn || db;

    const [result] = await connection.query(
      `
      UPDATE DonHang
      SET TinhTrangDonHang = ?
      WHERE MaDonHang = ?
      `,
      [tinhTrangDonHang, maDonHang]
    );

    return result.affectedRows;
  },

  // ===============================
  // Lấy đơn hàng theo user
  // ===============================
  getByUser: async (maTaiKhoan) => {
    const [rows] = await db.query(
      `
      SELECT *
      FROM DonHang
      WHERE MaTaiKhoan = ?
      ORDER BY NgayDat DESC
      `,
      [maTaiKhoan]
    );

    return rows;
  },

  // ===============================
  // Lấy chi tiết đơn hàng (bao gồm thông tin thanh toán online nếu có)
  // ===============================
  getById: async (maDonHang) => {
    const [order] = await db.query(
      `
      SELECT *
      FROM DonHang
      WHERE MaDonHang = ?
      `,
      [maDonHang]
    );

    if (order.length === 0) return null;

    // Lấy chi tiết sản phẩm
    const [details] = await db.query(
      `
      SELECT
        dhct.*,
        bt.TenBienThe,
        bt.DuongDanAnhBienThe
      FROM DonHangChiTiet dhct
      JOIN BienThe bt ON dhct.MaBienThe = bt.MaBienThe
      WHERE dhct.MaDonHang = ?
      `,
      [maDonHang]
    );

    // Lấy thông tin thanh toán online nếu có
    const [paymentInfo] = await db.query(
      `
      SELECT *
      FROM ThongTinThanhToanOnline
      WHERE MaDonHang = ?
      `,
      [maDonHang]
    );

    return {
      ...order[0],
      chiTiet: details,
      thanhToanOnline: paymentInfo.length > 0 ? paymentInfo[0] : null,
    };
  },

  // ===============================
  // Lấy thông tin thanh toán online
  // ===============================
  getPaymentInfo: async (maDonHang) => {
    const [rows] = await db.query(
      `
      SELECT *
      FROM ThongTinThanhToanOnline
      WHERE MaDonHang = ?
      `,
      [maDonHang]
    );

    return rows.length > 0 ? rows[0] : null;
  },
};

export default DonHang;