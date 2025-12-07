-- =======================================================
-- PHẦN 1: LÀM SẠCH VÀ RESET BẢNG (Chạy dòng này trước)
-- =======================================================
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE ThongSoMau;
-- SET FOREIGN_KEY_CHECKS = 1;

-- =======================================================
-- PHẦN 2: THÊM DỮ LIỆU MẪU (INSERT)
-- =======================================================

-- -------------------------------------------------------
-- 1. THÔNG SỐ KỸ THUẬT CHO IPHONE (MaLoai = 1)
-- -------------------------------------------------------
-- Tập trung vào: Màn hình, Camera, Chip, Chất liệu, Pin
INSERT INTO ThongSoMau (TenThongSo, DonVi, ThuTuHienThi, TinhTrangThongSoMau, MaLoai) VALUES 
('Kích thước màn hình', 'inch', 1, 1, 1),
('Công nghệ màn hình', '', 2, 1, 1),       -- VD: Super Retina XDR, ProMotion 120Hz
('Chip xử lý (CPU)', '', 3, 1, 1),         -- VD: A17 Pro, A18
('Camera sau', 'MP', 4, 1, 1),             -- VD: 48MP Chính + 12MP Ultra Wide
('Camera trước', 'MP', 5, 1, 1),           -- VD: 12MP TrueDepth
('Chất liệu khung viền', '', 6, 1, 1),     -- VD: Titan cấp 5, Nhôm tái chế
('Công nghệ bảo mật', '', 7, 1, 1),        -- VD: Face ID
('Chuẩn kháng nước', '', 8, 1, 1);         -- VD: IP68

-- -------------------------------------------------------
-- 2. THÔNG SỐ KỸ THUẬT CHO IPAD (MaLoai = 2)
-- -------------------------------------------------------
-- Tập trung vào: Chip, Màn hình, Hỗ trợ bút/phím
INSERT INTO ThongSoMau (TenThongSo, DonVi, ThuTuHienThi, TinhTrangThongSoMau, MaLoai) VALUES 
('Chip xử lý', '', 1, 1, 2),               -- VD: M4, M2, A17 Pro
('Kích thước màn hình', 'inch', 2, 1, 2),
('Công nghệ màn hình', '', 3, 1, 2),       -- VD: Ultra Retina XDR Tandem OLED
('Tương thích Apple Pencil', '', 4, 1, 2), -- VD: Pencil Pro, Pencil 2
('Tương thích Bàn phím', '', 5, 1, 2),     -- VD: Magic Keyboard mới
('Cổng kết nối', '', 6, 1, 2),             -- VD: Thunderbolt / USB 4
('Camera sau', 'MP', 7, 1, 2);

-- -------------------------------------------------------
-- 3. THÔNG SỐ KỸ THUẬT CHO MACBOOK (MaLoai = 3)
-- -------------------------------------------------------
-- Tập trung vào: Chip, RAM/SSD (cơ bản), Cổng, Pin
INSERT INTO ThongSoMau (TenThongSo, DonVi, ThuTuHienThi, TinhTrangThongSoMau, MaLoai) VALUES 
('Chip xử lý', '', 1, 1, 3),               -- VD: M4 Max, M3
('Số nhân CPU/GPU', 'core', 2, 1, 3),      -- VD: 12 CPU - 18 GPU
('Bộ nhớ thống nhất (RAM)', 'GB', 3, 1, 3),-- VD: Hỗ trợ tới 128GB
('Ổ cứng SSD tối đa', 'TB', 4, 1, 3),      -- VD: Hỗ trợ tới 8TB
('Kích thước màn hình', 'inch', 5, 1, 3),
('Thời lượng pin tối đa', 'giờ', 6, 1, 3), -- VD: 22 giờ
('Cổng kết nối', '', 7, 1, 3),             -- VD: MagSafe 3, HDMI, SD Card
('Trọng lượng', 'kg', 8, 1, 3);

-- -------------------------------------------------------
-- 4. THÔNG SỐ KỸ THUẬT CHO AIRPODS (MaLoai = 4)
-- -------------------------------------------------------
-- Tập trung vào: Âm thanh, Pin, Chip, Kháng nước
INSERT INTO ThongSoMau (TenThongSo, DonVi, ThuTuHienThi, TinhTrangThongSoMau, MaLoai) VALUES 
('Chip xử lý âm thanh', '', 1, 1, 4),      -- VD: H2
('Thời lượng nghe', 'giờ', 2, 1, 4),       -- VD: 6 giờ (30 giờ với hộp sạc)
('Chống ồn chủ động (ANC)', '', 3, 1, 4),  -- VD: Có / Không
('Công nghệ âm thanh', '', 4, 1, 4),       -- VD: Spatial Audio, Adaptive EQ
('Cổng sạc', '', 5, 1, 4),                 -- VD: USB-C, MagSafe
('Kháng nước', '', 6, 1, 4);               -- VD: IP54

-- -------------------------------------------------------
-- 5. THÔNG SỐ KỸ THUẬT CHO PHỤ KIỆN (MaLoai = 5)
-- -------------------------------------------------------
-- Vì phụ kiện rất đa dạng (Sạc, Cáp, Ốp, Dây đeo), ta dùng các thông số chung nhất
INSERT INTO ThongSoMau (TenThongSo, DonVi, ThuTuHienThi, TinhTrangThongSoMau, MaLoai) VALUES 
('Loại phụ kiện', '', 1, 1, 5),            -- VD: Củ sạc, Cáp, Ốp lưng
('Tương thích thiết bị', '', 2, 1, 5),     -- VD: iPhone 15 Series, iPad Pro
('Chất liệu', '', 3, 1, 5),                -- VD: Silicone, Dù (Woven), Fluoroelastomer
('Cổng kết nối / Đầu ra', '', 4, 1, 5),    -- VD: USB-C, Lightning, MagSafe
('Công suất tối đa', 'W', 5, 1, 5),        -- VD: 20W, 70W, 140W (Dành cho củ sạc)
('Chiều dài dây', 'm', 6, 1, 5);           -- VD: 1m, 2m (Dành cho cáp)