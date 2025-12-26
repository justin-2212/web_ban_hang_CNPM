import db from '../config/db.js';

class GioHangController {
  /**
   * Lấy giỏ hàng của user
   */
  async getCart(req, res, next) {
    try {
      const { maTaiKhoan } = req.params;

      const [items] = await db.query(
        `SELECT 
          ghct.MaBienThe,
          ghct.SoLuong,
          bt.TenBienThe,
          bt.GiaTienBienThe,
          bt.DuongDanAnhBienThe,
          bt.SoLuongTonKho,
          sp.MaSP,
          sp.Ten AS TenSanPham
        FROM giohangchitiet ghct
        JOIN bienthe bt ON ghct.MaBienThe = bt.MaBienThe
        JOIN sanpham sp ON bt.MaSP = sp.MaSP
        WHERE ghct.MaTaiKhoan = ?
        ORDER BY ghct.ThoiGianThem DESC`,
        [maTaiKhoan]
      );

      const totalItems = items.reduce((sum, item) => sum + item.SoLuong, 0);

      res.json({
        success: true,
        data: {
          items,
          totalItems,
          totalPrice: items.reduce(
            (sum, item) => sum + item.GiaTienBienThe * item.SoLuong,
            0
          ),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Thêm sản phẩm vào giỏ
   */
  async addItem(req, res, next) {
    try {
      const { maTaiKhoan, maBienThe, soLuong } = req.body;

      console.log('📦 Adding to cart:', { maTaiKhoan, maBienThe, soLuong });

      // ✅ Kiểm tra số lượng phải > 0
      if (!soLuong || soLuong <= 0) {
        return res
          .status(400)
          .json({ success: false, message: 'Số lượng phải lớn hơn 0' });
      }

      // Kiểm tra tồn kho của biến thể
      const [variants] = await db.query(
        'SELECT SoLuongTonKho FROM BienThe WHERE MaBienThe = ?',
        [maBienThe]
      );

      if (variants.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: 'Sản phẩm không tồn tại' });
      }

      const tonKho = variants[0].SoLuongTonKho;

      // Kiểm tra đã có trong giỏ chưa
      const [existing] = await db.query(
        'SELECT SoLuong FROM GioHangChiTiet WHERE MaTaiKhoan = ? AND MaBienThe = ?',
        [maTaiKhoan, maBienThe]
      );

      if (existing.length > 0) {
        // ✅ Nếu đã tồn tại → kiểm tra tổng số lượng có vượt quá tồn kho
        const newQuantity = existing[0].SoLuong + soLuong;

        if (newQuantity > tonKho) {
          return res.status(400).json({
            success: false,
            message: `Chỉ còn ${tonKho} sản phẩm trong kho (hiện đang có ${existing[0].SoLuong} trong giỏ)`,
          });
        }

        await db.query(
          'UPDATE GioHangChiTiet SET SoLuong = SoLuong + ? WHERE MaTaiKhoan = ? AND MaBienThe = ?',
          [soLuong, maTaiKhoan, maBienThe]
        );
        console.log('✅ Updated quantity in cart');
      } else {
        // ✅ Nếu chưa tồn tại → kiểm tra số lượng có vượt quá tồn kho
        if (soLuong > tonKho) {
          return res.status(400).json({
            success: false,
            message: `Chỉ còn ${tonKho} sản phẩm trong kho`,
          });
        }

        await db.query(
          'INSERT INTO GioHangChiTiet (MaTaiKhoan, MaBienThe, SoLuong, ThoiGianThem) VALUES (?, ?, ?, NOW())',
          [maTaiKhoan, maBienThe, soLuong]
        );
        console.log('✅ Added new item to cart');
      }

      res.json({ success: true, message: 'Đã thêm vào giỏ hàng' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cập nhật số lượng
   */
  async updateQuantity(req, res, next) {
    try {
      const { maTaiKhoan, maBienThe, soLuong } = req.body;

      // ✅ Kiểm tra số lượng > 0
      if (soLuong <= 0) {
        return res
          .status(400)
          .json({ success: false, message: 'Số lượng phải lớn hơn 0' });
      }

      // ✅ Kiểm tra tồn kho trước khi cập nhật
      const [variants] = await db.query(
        'SELECT SoLuongTonKho FROM BienThe WHERE MaBienThe = ?',
        [maBienThe]
      );

      if (variants.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: 'Sản phẩm không tồn tại' });
      }

      if (soLuong > variants[0].SoLuongTonKho) {
        return res.status(400).json({
          success: false,
          message: `Chỉ còn ${variants[0].SoLuongTonKho} sản phẩm trong kho`,
        });
      }

      const [result] = await db.query(
        'UPDATE GioHangChiTiet SET SoLuong = ? WHERE MaTaiKhoan = ? AND MaBienThe = ?',
        [soLuong, maTaiKhoan, maBienThe]
      );

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ success: false, message: 'Không tìm thấy sản phẩm trong giỏ' });
      }

      res.json({ success: true, message: 'Đã cập nhật số lượng' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Xóa sản phẩm khỏi giỏ
   */
  async removeItem(req, res, next) {
    try {
      const { maTaiKhoan, maBienThe } = req.params;

      await db.query(
        'DELETE FROM GioHangChiTiet WHERE MaTaiKhoan = ? AND MaBienThe = ?',
        [maTaiKhoan, maBienThe]
      );

      res.json({ success: true, message: 'Đã xóa khỏi giỏ hàng' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Xóa toàn bộ giỏ hàng
   */
  async clearCart(req, res, next) {
    try {
      const { maTaiKhoan } = req.params;

      await db.query('DELETE FROM GioHangChiTiet WHERE MaTaiKhoan = ?', [
        maTaiKhoan,
      ]);

      res.json({ success: true, message: 'Đã xóa toàn bộ giỏ hàng' });
    } catch (error) {
      next(error);
    }
  }
}

export default new GioHangController();
