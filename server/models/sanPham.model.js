import db from '../config/db.js';

const SanPham = {
    // --- SỬA ĐỔI QUAN TRỌNG TẠI ĐÂY ---
    // Lấy tất cả sản phẩm KÈM BIẾN THỂ để Hero.jsx hiển thị ảnh và giá đúng
    getAll: async (filters = {}) => {
        try {
            const { minPrice, maxPrice } = filters;
            
            // 1. Truy vấn SQL: Lấy thông tin SP + Biến thể
            // Sắp xếp theo MaSP giảm dần (sản phẩm mới lên đầu) và ThuTuHienThi biến thể
            let query = `
                SELECT 
                    sp.MaSP, sp.Ten, sp.MoTa, sp.TinhTrangSanPham, sp.MaLoai, 
                    lsp.TenLoai,
                    bt.MaBienThe, bt.TenBienThe, bt.GiaTienBienThe, 
                    bt.DuongDanAnhBienThe, bt.ThuTuHienThi
                FROM SanPham sp 
                LEFT JOIN LoaiSanPham lsp ON sp.MaLoai = lsp.MaLoai
                LEFT JOIN BienThe bt ON sp.MaSP = bt.MaSP AND bt.TinhTrangHoatDong = 1
                WHERE sp.TinhTrangSanPham = 1
            `;

            // Thêm điều kiện lọc giá nếu có
            // Sản phẩm sẽ được giữ lại nếu có ít nhất 1 biến thể trong khoảng giá
            if (minPrice || maxPrice) {
                query += ` AND sp.MaSP IN (
                    SELECT DISTINCT MaSP FROM BienThe 
                    WHERE TinhTrangHoatDong = 1`;
                
                if (minPrice) {
                    query += ` AND GiaTienBienThe >= ${parseFloat(minPrice)}`;
                }
                if (maxPrice) {
                    query += ` AND GiaTienBienThe <= ${parseFloat(maxPrice)}`;
                }
                
                query += `)`;
            }

            query += ` ORDER BY sp.MaSP DESC, bt.ThuTuHienThi ASC`;

            const [rows] = await db.query(query);

            // 2. Xử lý gom nhóm (Grouping)
            // Vì LEFT JOIN sẽ trả về nhiều dòng cho 1 sản phẩm nếu có nhiều biến thể
            // Ta cần gom chúng lại thành 1 object sản phẩm chứa mảng variants
            const productsMap = new Map();

            rows.forEach(row => {
                // Nếu sản phẩm chưa có trong Map, tạo mới
                if (!productsMap.has(row.MaSP)) {
                    productsMap.set(row.MaSP, {
                        MaSP: row.MaSP,
                        Ten: row.Ten,
                        MoTa: row.MoTa,
                        TinhTrangSanPham: row.TinhTrangSanPham,
                        MaLoai: row.MaLoai,
                        TenLoai: row.TenLoai,
                        variants: [], // Khởi tạo mảng variants rỗng
                        // Nếu bạn có bảng AnhSP riêng và muốn lấy thêm thì join tương tự
                        images: [] 
                    });
                }

                // Nếu dòng này có dữ liệu biến thể (MaBienThe không null)
                if (row.MaBienThe) {
                    productsMap.get(row.MaSP).variants.push({
                        MaBienThe: row.MaBienThe,
                        TenBienThe: row.TenBienThe,
                        GiaTienBienThe: row.GiaTienBienThe,
                        DuongDanAnhBienThe: row.DuongDanAnhBienThe,
                        ThuTuHienThi: row.ThuTuHienThi
                    });
                }
            });

            // 3. Chuyển Map thành Array kết quả
            return Array.from(productsMap.values());

        } catch (error) {
            console.error("Lỗi getAll SanPham:", error);
            throw error;
        }
    },

    // Lấy sản phẩm theo ID (cơ bản)
    getById: async (id) => {
        const [rows] = await db.query(`
            SELECT sp.*, lsp.TenLoai 
            FROM SanPham sp 
            LEFT JOIN LoaiSanPham lsp ON sp.MaLoai = lsp.MaLoai
            WHERE sp.MaSP = ? AND sp.TinhTrangSanPham = 1
        `, [id]);
        return rows[0];
    },

    // Lấy sản phẩm theo loại
    getByCategory: async (maLoai, filters = {}) => {
        const { minPrice, maxPrice } = filters;
        
        let query = `
            SELECT sp.MaSP, sp.Ten, sp.MoTa, sp.TinhTrangSanPham, sp.MaLoai, 
                   lsp.TenLoai,
                   MIN(bt.GiaTienBienThe) as GiaThapNhat,
                   MAX(bt.GiaTienBienThe) as GiaCaoNhat
            FROM sanpham sp 
            LEFT JOIN loaisanpham lsp ON sp.MaLoai = lsp.MaLoai
            LEFT JOIN bienthe bt ON sp.MaSP = bt.MaSP AND bt.TinhTrangHoatDong = 1
            WHERE sp.MaLoai = ? AND sp.TinhTrangSanPham = 1
        `;

        // Thêm điều kiện lọc giá nếu có
        if (minPrice || maxPrice) {
            query += ` AND sp.MaSP IN (
                SELECT DISTINCT bt2.MaSP 
                FROM bienthe bt2
                WHERE bt2.TinhTrangHoatDong = 1`;
            
            if (minPrice) {
                query += ` AND bt2.GiaTienBienThe >= ${parseFloat(minPrice)}`;
            }
            if (maxPrice) {
                query += ` AND bt2.GiaTienBienThe <= ${parseFloat(maxPrice)}`;
            }
            
            query += `)`;
        }

        query += ` GROUP BY sp.MaSP ORDER BY sp.MaSP`;

        const [rows] = await db.query(query, [maLoai]);
        return rows;
    },

    // Lấy sản phẩm chi tiết (Biến thể + Ảnh + Thông số)
    getWithVariants: async (maSP) => {
        const [product] = await db.query(`
            SELECT * FROM sanpham WHERE MaSP = ? AND TinhTrangSanPham = 1
        `, [maSP]);

        if (!product.length) return null;

        // 1. Lấy biến thể
        const [variants] = await db.query(`
            SELECT bt.MaBienThe, bt.TenBienThe, bt.SoLuongTonKho, 
                   bt.GiaTienBienThe, bt.ThuTuHienThi, bt.DuongDanAnhBienThe
            FROM bienthe bt
            WHERE bt.MaSP = ? AND bt.TinhTrangHoatDong = 1
            ORDER BY bt.ThuTuHienThi
        `, [maSP]);

        // 2. Lấy ảnh (Gallery)
        const [images] = await db.query(`
            SELECT MaAnh, DuongDanLuuAnh, ThuTuHienThi
            FROM anhsp 
            WHERE MaSP = ? 
            ORDER BY ThuTuHienThi
        `, [maSP]);

        // 3. Lấy thông số kỹ thuật chung
        const [specs] = await db.query(`
            SELECT gts.MaThongSoMau, gts.GiaTriHienThi, gts.GiaTriNhap,
                   tsm.TenThongSo, tsm.DonVi, tsm.ThuTuHienThi
            FROM giatrithongso gts
            JOIN thongsomau tsm ON gts.MaThongSoMau = tsm.MaThongSoMau
            WHERE gts.MaSP = ? AND tsm.TinhTrangThongSoMau = 1
            ORDER BY tsm.ThuTuHienThi
        `, [maSP]);

        // 4.  Lấy thông số chi tiết của biến thể với đầy đủ thông tin
        const [variantSpecs] = await db.query(`
            SELECT bt.MaBienThe,
                   gtvt.MaThongSoBienTheMau as maThongSo, 
                   gtvt.GiaTriHienThi as giaTriHienThi, 
                   gtvt.GiaTriNhap as giaTriNhap,
                   tsbm.TenThongSoBienThe as tenThongSo, 
                   tsbm.DonVi as donVi,
                   tsbm.ThuTuHienThi as thuTuHienThi
            FROM bienthe bt
            LEFT JOIN giatribienthe gtvt ON bt.MaBienThe = gtvt.MaBienThe
            LEFT JOIN thongsobienthemau tsbm ON gtvt.MaThongSoBienTheMau = tsbm.MaThongSoBienTheMau 
                AND tsbm.TinhTrangThongSoBienThe = 1
            WHERE bt.MaSP = ? AND bt.TinhTrangHoatDong = 1
            ORDER BY bt.ThuTuHienThi, tsbm.ThuTuHienThi
        `, [maSP]);

        // Nhóm giá trị biến thể
        const variantSpecsGrouped = {};
        variantSpecs.forEach(spec => {
            if (!variantSpecsGrouped[spec.MaBienThe]) {
                variantSpecsGrouped[spec.MaBienThe] = [];
            }
            if (spec.maThongSo) {
                variantSpecsGrouped[spec.MaBienThe].push({
                    maThongSo: spec.maThongSo,
                    tenThongSo: spec.tenThongSo,
                    giaTriHienThi: spec.giaTriHienThi,
                    giaTriNhap: spec.giaTriNhap,
                    donVi: spec.donVi
                });
            }
        });

        // Gắn thông số vào từng biến thể
        const variantsWithSpecs = variants.map(v => ({
            ...v,
            thongSo: variantSpecsGrouped[v.MaBienThe] || []
        }));

        return {
            ...product[0],
            variants: variantsWithSpecs,
            images,
            specs
        };
    },

    // Tìm kiếm
    search: async (keyword) => {
        const [rows] = await db.query(`
            SELECT sp.MaSP, sp.Ten, sp.MoTa, sp.TinhTrangSanPham, sp.MaLoai, lsp.TenLoai,
                   MIN(bt.GiaTienBienThe) as GiaThapNhat
            FROM SanPham sp 
            LEFT JOIN LoaiSanPham lsp ON sp.MaLoai = lsp.MaLoai
            LEFT JOIN BienThe bt ON sp.MaSP = bt.MaSP AND bt.TinhTrangHoatDong = 1
            WHERE sp.TinhTrangSanPham = 1
            AND (sp.Ten LIKE ? OR sp.MoTa LIKE ? OR lsp.TenLoai LIKE ?)
            GROUP BY sp.MaSP
            ORDER BY sp.Ten
        `, [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`]);
        return rows;
    },

    // Các hàm Create, Update, Delete 
    create: async (data) => {
        const { Ten, MoTa, TinhTrangSanPham, MaLoai } = data;
        const [result] = await db.query(`
            INSERT INTO SanPham (Ten, MoTa, TinhTrangSanPham, MaLoai) 
            VALUES (?, ?, ?, ?)
        `, [Ten, MoTa, TinhTrangSanPham || 1, MaLoai]);
        return result.insertId;
    },

    update: async (id, data) => {
        const { Ten, MoTa, TinhTrangSanPham, MaLoai } = data;
        const [result] = await db.query(`
            UPDATE SanPham SET Ten=?, MoTa=?, TinhTrangSanPham=?, MaLoai=? 
            WHERE MaSP=?
        `, [Ten, MoTa, TinhTrangSanPham, MaLoai, id]);
        return result.affectedRows;
    },

    delete: async (id) => {
        const [result] = await db.query(`
            UPDATE SanPham SET TinhTrangSanPham = 0 WHERE MaSP = ?
        `, [id]);
        return result.affectedRows;
    },

    // Lấy danh sách thông số biến thể (attributes) để hiển thị UI chọn lựa
    getVariantAttributes: async (maSP) => {
        try {
            // Query lấy tất cả thông số biến thể của sản phẩm
            const [rows] = await db.query(`
                SELECT DISTINCT
                    tsbm.MaThongSoBienTheMau as maThongSo,
                    tsbm.TenThongSoBienThe as tenThongSo,
                    tsbm.ThuTuHienThi,
                    gtvt.GiaTriHienThi as giaTriHienThi,
                    gtvt.GiaTriNhap as giaTriNhap
                FROM BienThe bt
                JOIN GiaTriBienThe gtvt ON bt.MaBienThe = gtvt.MaBienThe
                JOIN ThongSoBienTheMau tsbm ON gtvt.MaThongSoBienTheMau = tsbm.MaThongSoBienTheMau
                WHERE bt.MaSP = ? AND bt.TinhTrangHoatDong = 1 AND tsbm.TinhTrangThongSoBienThe = 1
                ORDER BY tsbm.ThuTuHienThi, gtvt.GiaTriHienThi
            `, [maSP]);

            // Nhóm các giá trị theo thông số
            const attributesMap = new Map();

            rows.forEach(row => {
                if (!attributesMap.has(row.maThongSo)) {
                    attributesMap.set(row.maThongSo, {
                        maThongSo: row.maThongSo,
                        tenThongSo: row.tenThongSo,
                        thuTuHienThi: row.ThuTuHienThi,
                        options: []
                    });
                }

                // Thêm option nếu chưa tồn tại (tránh trùng lặp)
                const attribute = attributesMap.get(row.maThongSo);
                const exists = attribute.options.some(
                    opt => opt.giaTriNhap === row.giaTriNhap
                );

                if (!exists) {
                    attribute.options.push({
                        giaTriHienThi: row.giaTriHienThi,
                        giaTriNhap: row.giaTriNhap
                    });
                }
            });

            return Array.from(attributesMap.values());
        } catch (error) {
            console.error("Lỗi getVariantAttributes:", error);
            throw error;
        }
    },

    // mới thêm 
    getProductByCategory: async (maLoai) => {
        const [rows] = await db.query(`
            SELECT 
                sp.MaSP,
                sp.Ten,
                sp.HinhAnh,
                bt.HinhAnh AS BienTheHinhAnh
            FROM SanPham sp
            LEFT JOIN BienThe bt ON bt.MaSP = sp.MaSP
            WHERE sp.MaLoai = ? AND sp.TinhTrangSanPham = 1
            ORDER BY sp.ThuTuHienThi
            LIMIT 1 
        `, [maLoai]);

        return rows[0] || null;
    },

    //LẤY THÔNG SỐ BIẾN THỂ THEO SẢN PHẨM (COMPLETELY REWRITTEN)
    getVariantAttributes: async (maSP) => {
        try {
            // Bước 1: Lấy MaLoai của sản phẩm
            const [productRows] = await db.query(
                'SELECT MaLoai FROM SanPham WHERE MaSP = ?',
                [maSP]
            );

            if (productRows.length === 0) {
                throw new Error('Không tìm thấy sản phẩm');
            }

            const maLoai = productRows[0].MaLoai;

            // Bước 2: Lấy khung thông số biến thể theo MaLoai
            const [attributeRows] = await db.query(
                `SELECT 
                  MaThongSoBienTheMau as maThongSo,
                  TenThongSoBienThe as tenThongSo,
                  DonVi as donVi,
                  ThuTuHienThi as thuTuHienThi
                FROM ThongSoBienTheMau
                WHERE MaLoai = ? AND TinhTrangThongSoBienThe = 1
                ORDER BY ThuTuHienThi ASC`,
                [maLoai]
            );

            // Bước 3: Với mỗi thông số, lấy CHÍNH XÁC các giá trị có trong biến thể
            const attributes = [];

            for (const attr of attributeRows) {
                const [valueRows] = await db.query(
                    `SELECT 
                        gtb.GiaTriNhap as giaTriNhap,
                        MIN(gtb.GiaTriHienThi) as giaTriHienThi,
                        MIN(gtb.ThuTuHienThi) as thuTuHienThi
                      FROM BienThe bt
                      JOIN GiaTriBienThe gtb ON bt.MaBienThe = gtb.MaBienThe
                      WHERE bt.MaSP = ?
                        AND gtb.MaThongSoBienTheMau = ?
                        AND bt.TinhTrangHoatDong = 1
                      GROUP BY gtb.GiaTriNhap
                      ORDER BY MIN(gtb.ThuTuHienThi)`,
                    [maSP, attr.maThongSo]
                );

                //  CHỈ thêm attribute nếu có options
                if (valueRows.length > 0) {
                    attributes.push({
                      ...attr,
                      options: valueRows
                    });
                }
            }

            return attributes;
        } catch (error) {
            console.error('Error in getVariantAttributes:', error);
            throw error;
        }
    },

    // Lấy top 5 sản phẩm bán chạy nhất (dựa trên doanh số)
    getTopSelling: async (limit = 5) => {
        try {
            const [rows] = await db.query(`
                SELECT 
                    sp.MaSP,
                    sp.Ten,
                    sp.MoTa,
                    sp.TinhTrangSanPham,
                    sp.MaLoai,
                    lsp.TenLoai,
                    bt.MaBienThe,
                    bt.TenBienThe,
                    bt.GiaTienBienThe,
                    bt.DuongDanAnhBienThe,
                    bt.ThuTuHienThi,
                    SUM(dhct.SoLuongSanPham * dhct.GiaTienCuaSanPham) AS TongDoanhThu,
                    SUM(dhct.SoLuongSanPham) AS TongSoLuongBan
                FROM SanPham sp
                INNER JOIN LoaiSanPham lsp ON sp.MaLoai = lsp.MaLoai
                INNER JOIN BienThe bt ON sp.MaSP = bt.MaSP AND bt.TinhTrangHoatDong = 1
                INNER JOIN DonHangChiTiet dhct ON bt.MaBienThe = dhct.MaBienThe
                INNER JOIN DonHang dh ON dhct.MaDonHang = dh.MaDonHang 
                    AND dh.TinhTrangDonHang IN (0, 1, 2, 3) -- Chỉ tính đơn hàng không bị hủy (0:Đang xử lý, 1:Đã xác nhận, 2:Đang giao, 3:Đã giao)
                WHERE sp.TinhTrangSanPham = 1
                GROUP BY sp.MaSP, sp.Ten, sp.MoTa, sp.TinhTrangSanPham, sp.MaLoai, 
                         lsp.TenLoai, bt.MaBienThe, bt.TenBienThe, bt.GiaTienBienThe, 
                         bt.DuongDanAnhBienThe, bt.ThuTuHienThi
                ORDER BY TongDoanhThu DESC
            `);

            // Gom nhóm sản phẩm với variants
            const productsMap = new Map();
            const productOrder = []; // Để giữ thứ tự doanh thu

            rows.forEach(row => {
                if (!productsMap.has(row.MaSP)) {
                    productsMap.set(row.MaSP, {
                        MaSP: row.MaSP,
                        Ten: row.Ten,
                        MoTa: row.MoTa,
                        TinhTrangSanPham: row.TinhTrangSanPham,
                        MaLoai: row.MaLoai,
                        TenLoai: row.TenLoai,
                        TongDoanhThu: 0,
                        TongSoLuongBan: 0,
                        variants: []
                    });
                    productOrder.push(row.MaSP);
                }

                const product = productsMap.get(row.MaSP);
                product.TongDoanhThu += parseFloat(row.TongDoanhThu || 0);
                product.TongSoLuongBan += parseInt(row.TongSoLuongBan || 0);

                if (row.MaBienThe) {
                    product.variants.push({
                        MaBienThe: row.MaBienThe,
                        TenBienThe: row.TenBienThe,
                        GiaTienBienThe: row.GiaTienBienThe,
                        DuongDanAnhBienThe: row.DuongDanAnhBienThe,
                        ThuTuHienThi: row.ThuTuHienThi
                    });
                }
            });

            // Sắp xếp theo doanh thu và lấy top
            const topProducts = productOrder
                .map(maSP => productsMap.get(maSP))
                .sort((a, b) => b.TongDoanhThu - a.TongDoanhThu)
                .slice(0, limit);

            return topProducts;
        } catch (error) {
            console.error('Error in getTopSelling:', error);
            throw error;
        }
    },
};

export default SanPham;