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
      SELECT 
        dh.*,
        tk.TenDayDu,
        tk.Gmail,
        tk.SoDienThoai,
        tk.DiaChi
      FROM DonHang dh
      LEFT JOIN TaiKhoan tk ON dh.MaTaiKhoan = tk.MaTaiKhoan
      WHERE dh.MaDonHang = ?
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

  // ===============================
  // Kiểm tra đơn hàng có thể hủy không (COD, trong vòng 5 phút)
  // ===============================
  canCancelOrder: async (maDonHang) => {
    const [order] = await db.query(
      `
      SELECT MaDonHang, NgayDat, PhuongThucThanhToan, TinhTrangDonHang
      FROM DonHang
      WHERE MaDonHang = ?
      `,
      [maDonHang]
    );

    if (order.length === 0) return { canCancel: false, reason: "Không tìm thấy đơn hàng" };

    const orderData = order[0];

    // Chỉ hủy được nếu là COD
    if (orderData.PhuongThucThanhToan !== "COD") {
      return { canCancel: false, reason: "Chỉ có thể hủy đơn hàng thanh toán COD" };
    }

    // Chỉ hủy được nếu trạng thái là "Đang xử lý" (0)
    if (orderData.TinhTrangDonHang !== 0) {
      return { canCancel: false, reason: "Đơn hàng không ở trạng thái có thể hủy" };
    }

    // Kiểm tra thời gian
    const createdTime = new Date(orderData.NgayDat).getTime();
    const currentTime = new Date().getTime();
    const diffMinutes = (currentTime - createdTime) / (1000 * 60);

    if (diffMinutes > 5) {
      return { canCancel: false, reason: "Quá thời gian hủy (5 phút)" };
    }

    return { canCancel: true, reason: "OK" };
  },

  // ===============================
  // ADMIN: Lấy tất cả đơn hàng với filter
  // ===============================
  getAllAdmin: async (filters = {}) => {
    let query = `
      SELECT 
        dh.*,
        tk.Gmail, tk.TenDayDu, tk.SoDienThoai, tk.DiaChi,
        COUNT(DISTINCT dhct.MaBienThe) as SoLuongSanPham
      FROM DonHang dh
      LEFT JOIN TaiKhoan tk ON dh.MaTaiKhoan = tk.MaTaiKhoan
      LEFT JOIN DonHangChiTiet dhct ON dh.MaDonHang = dhct.MaDonHang
    `;

    const conditions = [];
    const params = [];

    // Lọc theo trạng thái đơn hàng
    if (filters.tinhTrangDonHang !== undefined) {
      conditions.push('dh.TinhTrangDonHang = ?');
      params.push(filters.tinhTrangDonHang);
    }

    // Lọc theo trạng thái thanh toán
    if (filters.tinhTrangThanhToan !== undefined) {
      conditions.push('dh.TinhTrangThanhToan = ?');
      params.push(filters.tinhTrangThanhToan);
    }

    // Lọc theo phương thức thanh toán
    if (filters.phuongThucThanhToan) {
      conditions.push('dh.PhuongThucThanhToan = ?');
      params.push(filters.phuongThucThanhToan);
    }

    // Tìm kiếm theo mã đơn hàng hoặc tên/email khách
    if (filters.search) {
      conditions.push('(dh.MaDonHang LIKE ? OR tk.TenDayDu LIKE ? OR tk.Gmail LIKE ?)');
      params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
    }

    // Lọc theo khoảng thời gian
    if (filters.fromDate) {
      conditions.push('dh.NgayDat >= ?');
      params.push(filters.fromDate);
    }
    if (filters.toDate) {
      conditions.push('dh.NgayDat <= ?');
      params.push(filters.toDate);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += `
      GROUP BY dh.MaDonHang
      ORDER BY dh.NgayDat DESC
    `;

    const [rows] = await db.query(query, params);
    return rows;
  },

  // ===============================
  // ADMIN: Thống kê tổng quan đơn hàng
  // ===============================
  getOrderStats: async () => {
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as TongDonHang,
        SUM(CASE WHEN TinhTrangDonHang = 0 THEN 1 ELSE 0 END) as DangXuLy,
        SUM(CASE WHEN TinhTrangDonHang = 1 THEN 1 ELSE 0 END) as DangGiao,
        SUM(CASE WHEN TinhTrangDonHang = 2 THEN 1 ELSE 0 END) as DaGiao,
        SUM(CASE WHEN TinhTrangDonHang = 3 THEN 1 ELSE 0 END) as DaHuy,
        SUM(CASE WHEN TinhTrangThanhToan = 1 THEN TongTien ELSE 0 END) as TongDoanhThu,
        SUM(CASE WHEN TinhTrangThanhToan = 0 THEN TongTien ELSE 0 END) as ChuaThanhToan
      FROM DonHang
    `);

    return stats[0];
  },

  // ===============================
  // ADMIN: Doanh thu theo ngày
  // ===============================
  getRevenueByDate: async (fromDate, toDate) => {
    const [rows] = await db.query(
      `
      SELECT 
        DATE(NgayDat) as Ngay,
        COUNT(*) as SoDonHang,
        SUM(TongTien) as DoanhThu,
        SUM(CASE WHEN TinhTrangThanhToan = 1 THEN TongTien ELSE 0 END) as DaThanhToan
      FROM DonHang
      WHERE NgayDat BETWEEN ? AND ?
      GROUP BY DATE(NgayDat)
      ORDER BY Ngay DESC
      `,
      [fromDate, toDate]
    );

    return rows;
  },

  // ===============================
  // ADMIN: Top sản phẩm bán chạy
  // ===============================
  getTopSellingProducts: async (limit = 10) => {
    const [rows] = await db.query(
      `
      SELECT 
        bt.MaBienThe,
        bt.TenBienThe,
        bt.DuongDanAnhBienThe,
        sp.Ten as TenSanPham,
        SUM(dhct.SoLuongSanPham) as TongSoLuong,
        SUM(dhct.SoLuongSanPham * dhct.GiaTienCuaSanPham) as TongDoanhThu
      FROM DonHangChiTiet dhct
      JOIN BienThe bt ON dhct.MaBienThe = bt.MaBienThe
      JOIN SanPham sp ON bt.MaSP = sp.MaSP
      JOIN DonHang dh ON dhct.MaDonHang = dh.MaDonHang
      WHERE dh.TinhTrangDonHang != 3
      GROUP BY bt.MaBienThe, bt.TenBienThe, bt.DuongDanAnhBienThe, sp.Ten
      ORDER BY TongSoLuong DESC
      LIMIT ?
      `,
      [limit]
    );

    return rows;
  },
};

export default DonHang;