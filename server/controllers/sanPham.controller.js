// server/controllers/sanPham.controller.js
import SanPham from '../models/sanPham.model.js';

const SanPhamController = {
    // API: /api/san-pham
    getAll: async (req, res) => {
        try {
            // 1. Lấy tham số từ URL (VD: ?sort=price&order=asc)
            const { sort, order, q } = req.query;

            // 2. Nếu có từ khóa tìm kiếm (q), gọi hàm search
            if (q) {
                const results = await SanPham.search(q);
                return res.status(200).json({ data: results });
            }

            // 3. Gọi model lấy danh sách có sắp xếp
            const products = await SanPham.getAll({ sort, order });
            
            res.status(200).json({ 
                message: "Lấy danh sách thành công",
                data: products 
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi Server", error: error.message });
        }
    },

    // API: /api/san-pham/loai/:maLoai
    getByCategory: async (req, res) => {
        try {
            const { maLoai } = req.params;
            const { sort, order } = req.query;

            const products = await SanPham.getByCategory(maLoai, { sort, order });

            res.status(200).json({ 
                message: "Lấy danh sách theo loại thành công",
                data: products 
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi Server", error: error.message });
        }
    },

    // API: /api/san-pham/:id
    getDetail: async (req, res) => {
        try {
            const { id } = req.params;
            const product = await SanPham.getWithVariants(id);
            
            if (!product) {
                return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
            }

            res.status(200).json({ data: product });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi Server", error: error.message });
        }
    }
};

export default SanPhamController;