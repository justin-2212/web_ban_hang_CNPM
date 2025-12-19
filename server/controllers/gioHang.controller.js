import db from '../config/db.js';

class GioHangController {
  /**
   * Lấy giỏ hàng của user
   */
  async getCart(req, res, next) {
    try {
      const { maTaiKhoan } = req.params;

    //   console.log('📦 Fetching cart for user:', maTaiKhoan);

      const [items] = await db.query(
        `SELECT 
          GioHangChiTiet.MaBienThe,
          GioHangChiTiet.SoLuong,
          BienThe.TenBienThe,
          BienThe.GiaTienBienThe,
          BienThe.DuongDanAnhBienThe,
          BienThe.SoLuongTonKho,
          SanPham.MaSP,
          SanPham.Ten AS TenSanPham
        FROM GioHangChiTiet
        JOIN BienThe ON GioHangChiTiet.MaBienThe = BienThe.MaBienThe
        JOIN SanPham ON BienThe.MaSP = SanPham.MaSP
        WHERE GioHangChiTiet.MaTaiKhoan = ?`,
        [maTaiKhoan]
      );

    //   console.log('✅ Cart items found:', items.length);

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

      // Kiểm tra tồn kho
      const [variants] = await db.query(
        'SELECT SoLuongTonKho FROM BienThe WHERE MaBienThe = ?',
        [maBienThe]
      );

      if (variants.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: 'Sản phẩm không tồn tại' });
      }

      if (variants[0].SoLuongTonKho < soLuong) {
        return res
          .status(400)
          .json({ success: false, message: 'Không đủ hàng trong kho' });
      }

      // Kiểm tra đã có trong giỏ chưa
      const [existing] = await db.query(
        'SELECT * FROM GioHangChiTiet WHERE MaTaiKhoan = ? AND MaBienThe = ?',
        [maTaiKhoan, maBienThe]
      );

      if (existing.length > 0) {
        await db.query(
          'UPDATE GioHangChiTiet SET SoLuong = SoLuong + ? WHERE MaTaiKhoan = ? AND MaBienThe = ?',
          [soLuong, maTaiKhoan, maBienThe]
        );
        // console.log('✅ Updated quantity');
      } else {
        await db.query(
          'INSERT INTO GioHangChiTiet (MaTaiKhoan, MaBienThe, SoLuong) VALUES (?, ?, ?)',
          [maTaiKhoan, maBienThe, soLuong]
        );
        // console.log('✅ Added new item');
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

      if (soLuong <= 0) {
        return res
          .status(400)
          .json({ success: false, message: 'Số lượng phải lớn hơn 0' });
      }

      await db.query(
        'UPDATE GioHangChiTiet SET SoLuong = ? WHERE MaTaiKhoan = ? AND MaBienThe = ?',
        [soLuong, maTaiKhoan, maBienThe]
      );

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
