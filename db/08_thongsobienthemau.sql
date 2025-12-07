-- ---------------------------------------------------------
-- PHẦN 1: LÀM SẠCH DỮ LIỆU CŨ (RESET)
-- ---------------------------------------------------------

-- Tắt kiểm tra khóa ngoại tạm thời (Để xóa được dù bảng khác đang tham chiếu tới)
-- SET FOREIGN_KEY_CHECKS = 0;

-- -- Xóa sạch dữ liệu và reset ID về 1
-- TRUNCATE TABLE ThongSoBienTheMau;

-- -- Bật lại kiểm tra khóa ngoại
-- SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------
-- PHẦN 2: THÊM DỮ LIỆU MỚI (INSERT)
-- ---------------------------------------------------------

-- --- A. CẤU HÌNH CHO IPHONE (MaLoai = 1) ---
INSERT INTO ThongSoBienTheMau 
(TenThongSoBienThe, DonVi, ThuTuHienThi, TinhTrangThongSoBienThe, MaLoai) 
VALUES 
('Màu sắc', '', 1, 1, 1),       -- Chọn màu trước
('Dung lượng', 'GB', 2, 1, 1);  -- Chọn dung lượng sau

-- --- B. CẤU HÌNH CHO IPAD (MaLoai = 2) ---
INSERT INTO ThongSoBienTheMau 
(TenThongSoBienThe, DonVi, ThuTuHienThi, TinhTrangThongSoBienThe, MaLoai) 
VALUES 
('Màu sắc', '', 1, 1, 2),
('Kết nối', '', 2, 1, 2),       -- Ví dụ: Wifi, 5G
('Dung lượng', 'GB', 3, 1, 2);

-- --- C. CẤU HÌNH CHO MACBOOK (MaLoai = 3) ---
INSERT INTO ThongSoBienTheMau 
(TenThongSoBienThe, DonVi, ThuTuHienThi, TinhTrangThongSoBienThe, MaLoai) 
VALUES 
('RAM', 'GB', 1, 1, 3),         -- RAM quan trọng nhất
('Ổ cứng SSD', 'GB', 2, 1, 3),  -- Đến ổ cứng
('Màu sắc', '', 3, 1, 3);       -- Màu sắc chọn cuối

