import db from '../config/db.js';

const SanPham = {
    // --- SỬA ĐỔI QUAN TRỌNG TẠI ĐÂY ---
    // Lấy tất cả sản phẩm KÈM BIẾN THỂ để Hero.jsx hiển thị ảnh và giá đúng
    getAll: async () => {
        try {
            // 1. Truy vấn SQL: Lấy thông tin SP + Biến thể
            // Sắp xếp theo MaSP giảm dần (sản phẩm mới lên đầu) và ThuTuHienThi biến thể
            const [rows] = await db.query(`
                SELECT 
                    sp.MaSP, sp.Ten, sp.MoTa, sp.TinhTrangSanPham, sp.MaLoai, 
                    lsp.TenLoai,
                    bt.MaBienThe, bt.TenBienThe, bt.GiaTienBienThe, 
                    bt.DuongDanAnhBienThe, bt.ThuTuHienThi
                FROM SanPham sp 
                LEFT JOIN LoaiSanPham lsp ON sp.MaLoai = lsp.MaLoai
                LEFT JOIN BienThe bt ON sp.MaSP = bt.MaSP AND bt.TinhTrangHoatDong = 1
                WHERE sp.TinhTrangSanPham = 1
                ORDER BY sp.MaSP DESC, bt.ThuTuHienThi ASC
            `);

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
    getByCategory: async (maLoai) => {
        // Hàm này giữ nguyên hoặc sửa logic giống getAll nếu cần
        const [rows] = await db.query(`
            SELECT sp.MaSP, sp.Ten, sp.MoTa, sp.TinhTrangSanPham, sp.MaLoai, 
                   lsp.TenLoai,
                   MIN(bt.GiaTienBienThe) as GiaThapNhat,
                   MAX(bt.GiaTienBienThe) as GiaCaoNhat
            FROM SanPham sp 
            LEFT JOIN LoaiSanPham lsp ON sp.MaLoai = lsp.MaLoai
            LEFT JOIN BienThe bt ON sp.MaSP = bt.MaSP AND bt.TinhTrangHoatDong = 1
            WHERE sp.MaLoai = ? AND sp.TinhTrangSanPham = 1
            GROUP BY sp.MaSP
            ORDER BY sp.MaSP
        `, [maLoai]);
        return rows;
    },

    // Lấy sản phẩm chi tiết (Biến thể + Ảnh + Thông số)
    getWithVariants: async (maSP) => {
        const [product] = await db.query(`
            SELECT * FROM SanPham WHERE MaSP = ? AND TinhTrangSanPham = 1
        `, [maSP]);

        if (!product.length) return null;

        // 1. Lấy biến thể
        const [variants] = await db.query(`
            SELECT bt.MaBienThe, bt.TenBienThe, bt.SoLuongTonKho, 
                   bt.GiaTienBienThe, bt.ThuTuHienThi, bt.DuongDanAnhBienThe
            FROM BienThe bt
            WHERE bt.MaSP = ? AND bt.TinhTrangHoatDong = 1
            ORDER BY bt.ThuTuHienThi
        `, [maSP]);

        // 2. Lấy ảnh (Gallery)
        const [images] = await db.query(`
            SELECT MaAnh, DuongDanLuuAnh, ThuTuHienThi
            FROM AnhSP 
            WHERE MaSP = ? 
            ORDER BY ThuTuHienThi
        `, [maSP]);

        // 3. Lấy thông số kỹ thuật chung
        const [specs] = await db.query(`
            SELECT gts.MaThongSoMau, gts.GiaTriHienThi, gts.GiaTriNhap,
                   tsm.TenThongSo, tsm.DonVi, tsm.ThuTuHienThi
            FROM GiaTriThongSo gts
            JOIN ThongSoMau tsm ON gts.MaThongSoMau = tsm.MaThongSoMau
            WHERE gts.MaSP = ? AND tsm.TinhTrangThongSoMau = 1
            ORDER BY tsm.ThuTuHienThi
        `, [maSP]);

        // 4. ✅ FIX: Lấy thông số chi tiết của biến thể với đầy đủ thông tin
        const [variantSpecs] = await db.query(`
            SELECT bt.MaBienThe,
                   gtvt.MaThongSoBienTheMau as maThongSo, 
                   gtvt.GiaTriHienThi as giaTriHienThi, 
                   gtvt.GiaTriNhap as giaTriNhap,
                   tsbm.TenThongSoBienThe as tenThongSo, 
                   tsbm.DonVi as donVi,
                   tsbm.ThuTuHienThi as thuTuHienThi
            FROM BienThe bt
            LEFT JOIN GiaTriBienThe gtvt ON bt.MaBienThe = gtvt.MaBienThe
            LEFT JOIN ThongSoBienTheMau tsbm ON gtvt.MaThongSoBienTheMau = tsbm.MaThongSoBienTheMau
            WHERE bt.MaSP = ? AND bt.TinhTrangHoatDong = 1 AND tsbm.TinhTrangThongSoBienThe = 1
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

    // ✅ LẤY THÔNG SỐ BIẾN THỂ THEO SẢN PHẨM (COMPLETELY REWRITTEN)
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
                    `SELECT DISTINCT
                        gtb.GiaTriHienThi as giaTriHienThi,
                        gtb.GiaTriNhap as giaTriNhap,
                        MIN(gtb.ThuTuHienThi) as thuTuHienThi
                      FROM BienThe bt
                      JOIN GiaTriBienThe gtb ON bt.MaBienThe = gtb.MaBienThe
                      WHERE bt.MaSP = ?
                        AND gtb.MaThongSoBienTheMau = ?
                        AND bt.TinhTrangHoatDong = 1
                      GROUP BY gtb.GiaTriHienThi, gtb.GiaTriNhap
                      ORDER BY MIN(gtb.ThuTuHienThi)`,
                    [maSP, attr.maThongSo]
                );

                // ✅ CHỈ thêm attribute nếu có options
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
};

export default SanPham;