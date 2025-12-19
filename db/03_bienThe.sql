-- =================================================================================
-- BƯỚC 1: LÀM SẠCH VÀ RESET ID
-- =================================================================================
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE BienThe;
SET FOREIGN_KEY_CHECKS = 1;

-- =================================================================================
-- BƯỚC 2: INSERT DỮ LIỆU (THEO THỨ TỰ MASP TĂNG DẦN)
-- =================================================================================

-- ---------------------------------------------------------------------------------
-- [MaSP 1] iPhone 13 mini
-- Màu: Hồng, Xanh, Đen, Trắng, Xanh Lá, Đỏ
-- ---------------------------------------------------------------------------------
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
(1, 'iPhone 13 mini 128GB Hồng', 5, 11490000, 1, 1, '/assets/products/iphone/iphone-13-mini-pink.jpg'),
(1, 'iPhone 13 mini 128GB Xanh', 5, 11490000, 2, 1, '/assets/products/iphone/iphone-13-mini-blue.jpg'),
(1, 'iPhone 13 mini 128GB Đen', 5, 11490000, 3, 1, '/assets/products/iphone/iphone-13-mini-midnight.jpg'),
(1, 'iPhone 13 mini 128GB Trắng', 5, 11490000, 4, 1, '/assets/products/iphone/iphone-13-mini-starlight.jpg'),
(1, 'iPhone 13 mini 128GB Xanh Lá', 5, 11490000, 5, 1, '/assets/products/iphone/iphone-13-mini-green.jpg'),
(1, 'iPhone 13 mini 256GB Hồng', 5, 13990000, 1, 1, '/assets/products/iphone/iphone-13-mini-pink.jpg'),
(1, 'iPhone 13 mini 256GB Xanh', 5, 13990000, 2, 1, '/assets/products/iphone/iphone-13-mini-blue.jpg'),
(1, 'iPhone 13 mini 256GB Đen', 5, 13990000, 3, 1, '/assets/products/iphone/iphone-13-mini-midnight.jpg'),
(1, 'iPhone 13 mini 256GB Trắng', 5, 13990000, 4, 1, '/assets/products/iphone/iphone-13-mini-starlight.jpg'),
(1, 'iPhone 13 mini 256GB Xanh Lá', 5, 13990000, 5, 1, '/assets/products/iphone/iphone-13-mini-green.jpg');

-- ---------------------------------------------------------------------------------
-- [MaSP 2] iPhone 13
-- Màu: Xanh Lá, Hồng, Đen, Trắng, Đỏ, Xanh Dương
-- ---------------------------------------------------------------------------------
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
(2, 'iPhone 13 128GB Hồng', 5, 13490000, 1, 1, '/assets/products/iphone/iphone-13-pink.jpg'),
(2, 'iPhone 13 128GB Xanh', 5, 13490000, 2, 1, '/assets/products/iphone/iphone-13-blue.jpg'),
(2, 'iPhone 13 128GB Đen', 5, 13490000, 3, 1, '/assets/products/iphone/iphone-13-midnight.jpg'),
(2, 'iPhone 13 128GB Trắng', 5, 13490000, 4, 1, '/assets/products/iphone/iphone-13-starlight.jpg'),
(2, 'iPhone 13 128GB Xanh Lá', 5, 13490000, 5, 1, '/assets/products/iphone/iphone-13-green.jpg'),
(2, 'iPhone 13 256GB Hồng', 5, 15990000, 1, 1, '/assets/products/iphone/iphone-13-pink.jpg'),
(2, 'iPhone 13 256GB Xanh', 5, 15990000, 2, 1, '/assets/products/iphone/iphone-13-blue.jpg'),
(2, 'iPhone 13 256GB Đen', 5, 15990000, 3, 1, '/assets/products/iphone/iphone-13-midnight.jpg'),
(2, 'iPhone 13 256GB Trắng', 5, 15990000, 4, 1, '/assets/products/iphone/iphone-13-starlight.jpg'),
(2, 'iPhone 13 256GB Xanh Lá', 5, 15990000, 5, 1, '/assets/products/iphone/iphone-13-green.jpg');

-- ---------------------------------------------------------------------------------
-- [MaSP 3] iPhone 13 Pro Max
-- Màu: Xanh Sierra, Xanh Lá, Vàng, Xám, Bạc
-- ---------------------------------------------------------------------------------
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
-- 128GB
(3, 'iPhone 13 Pro Max 128GB Xanh Sierra', 10, 15490000, 1, 1, '/assets/products/iphone/iphone-13-pro-max-sierra-blue.jpg'),
(3, 'iPhone 13 Pro Max 128GB Xanh Lá', 8, 15490000, 2, 1, '/assets/products/iphone/iphone-13-pro-max-alpine-green.jpg'),
(3, 'iPhone 13 Pro Max 128GB Vàng', 12, 15490000, 3, 1, '/assets/products/iphone/iphone-13-pro-max-gold.jpg'),
(3, 'iPhone 13 Pro Max 128GB Xám', 15, 15490000, 4, 1, '/assets/products/iphone/iphone-13-pro-max-graphite.jpg'),
(3, 'iPhone 13 Pro Max 128GB Bạc', 5, 15490000, 5, 1, '/assets/products/iphone/iphone-13-pro-max-silver.jpg'),

-- 256GB
(3, 'iPhone 13 Pro Max 256GB Xanh Sierra', 7, 17490000, 6, 1, '/assets/products/iphone/iphone-13-pro-max-sierra-blue.jpg'),
(3, 'iPhone 13 Pro Max 256GB Xanh Lá', 6, 17490000, 7, 1, '/assets/products/iphone/iphone-13-pro-max-alpine-green.jpg'),
(3, 'iPhone 13 Pro Max 256GB Vàng', 9, 17490000, 8, 1, '/assets/products/iphone/iphone-13-pro-max-gold.jpg'),
(3, 'iPhone 13 Pro Max 256GB Xám', 11, 17490000, 9, 1, '/assets/products/iphone/iphone-13-pro-max-graphite.jpg'),
(3, 'iPhone 13 Pro Max 256GB Bạc', 4, 17490000, 10, 1, '/assets/products/iphone/iphone-13-pro-max-silver.jpg'),

-- 512GB
(3, 'iPhone 13 Pro Max 512GB Xanh Sierra', 4, 19990000, 11, 1, '/assets/products/iphone/iphone-13-pro-max-sierra-blue.jpg'),
(3, 'iPhone 13 Pro Max 512GB Xanh Lá', 3, 19990000, 12, 1, '/assets/products/iphone/iphone-13-pro-max-alpine-green.jpg'),
(3, 'iPhone 13 Pro Max 512GB Vàng', 3, 19990000, 13, 1, '/assets/products/iphone/iphone-13-pro-max-gold.jpg'),
(3, 'iPhone 13 Pro Max 512GB Xám', 5, 19990000, 14, 1, '/assets/products/iphone/iphone-13-pro-max-graphite.jpg'),
(3, 'iPhone 13 Pro Max 512GB Bạc', 2, 19990000, 15, 1, '/assets/products/iphone/iphone-13-pro-max-silver.jpg');


-- ---------------------------------------------------------------------------------
-- [MaSP 4] iPhone 14 Plus
-- Màu: Tím, Vàng, Xanh, Đen
-- ---------------------------------------------------------------------------------
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
-- 128GB
(4, 'iPhone 14 Plus 128GB Tím', 15, 15490000, 1, 1, '/assets/products/iphone/iphone-14-plus-purple.jpg'),
(4, 'iPhone 14 Plus 128GB Vàng', 10, 15490000, 2, 1, '/assets/products/iphone/iphone-14-plus-yellow.jpg'),
(4, 'iPhone 14 Plus 128GB Xanh', 12, 15490000, 3, 1, '/assets/products/iphone/iphone-14-plus-blue.jpg'),
(4, 'iPhone 14 Plus 128GB Đen', 14, 15490000, 4, 1, '/assets/products/iphone/iphone-14-plus-midnight.jpg'),
(4, 'iPhone 14 Plus 128GB Trắng', 9, 15490000, 5, 1, '/assets/products/iphone/iphone-14-plus-starlight.jpg'),

-- 256GB
(4, 'iPhone 14 Plus 256GB Tím', 8, 16990000, 6, 1, '/assets/products/iphone/iphone-14-plus-purple.jpg'),
(4, 'iPhone 14 Plus 256GB Vàng', 6, 16990000, 7, 1, '/assets/products/iphone/iphone-14-plus-yellow.jpg'),
(4, 'iPhone 14 Plus 256GB Xanh', 7, 16990000, 8, 1, '/assets/products/iphone/iphone-14-plus-blue.jpg'),
(4, 'iPhone 14 Plus 256GB Đen', 5, 16990000, 9, 1, '/assets/products/iphone/iphone-14-plus-midnight.jpg'),
(4, 'iPhone 14 Plus 256GB Trắng', 4, 16990000, 10, 1, '/assets/products/iphone/iphone-14-plus-starlight.jpg'),

-- 512GB
(4, 'iPhone 14 Plus 512GB Tím', 4, 18490000, 11, 1, '/assets/products/iphone/iphone-14-plus-purple.jpg'),
(4, 'iPhone 14 Plus 512GB Vàng', 3, 18490000, 12, 1, '/assets/products/iphone/iphone-14-plus-yellow.jpg'),
(4, 'iPhone 14 Plus 512GB Xanh', 3, 18490000, 13, 1, '/assets/products/iphone/iphone-14-plus-blue.jpg'),
(4, 'iPhone 14 Plus 512GB Đen', 4, 18490000, 14, 1, '/assets/products/iphone/iphone-14-plus-midnight.jpg'),
(4, 'iPhone 14 Plus 512GB Trắng', 2, 18490000, 15, 1, '/assets/products/iphone/iphone-14-plus-starlight.jpg');

-- ---------------------------------------------------------------------------------
-- [MaSP 5] iPhone 14 Pro
-- Màu: Tím Deep Purple, Đen Space Black, Vàng Gold
-- ---------------------------------------------------------------------------------
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
-- 128GB
(5, 'iPhone 14 Pro 128GB Tím Deep Purple', 20, 17490000, 1, 1, '/assets/products/iphone/iphone-14-pro-deep-purple.jpg'),
(5, 'iPhone 14 Pro 128GB Đen Space Black', 15, 17490000, 2, 1, '/assets/products/iphone/iphone-14-pro-space-black.jpg'),
(5, 'iPhone 14 Pro 128GB Vàng Gold', 12, 17490000, 3, 1, '/assets/products/iphone/iphone-14-pro-gold.jpg'),
(5, 'iPhone 14 Pro 128GB Bạc Silver', 10, 17490000, 4, 1, '/assets/products/iphone/iphone-14-pro-silver.jpg'),

-- 256GB
(5, 'iPhone 14 Pro 256GB Tím Deep Purple', 10, 19990000, 5, 1, '/assets/products/iphone/iphone-14-pro-deep-purple.jpg'),
(5, 'iPhone 14 Pro 256GB Đen Space Black', 8, 19990000, 6, 1, '/assets/products/iphone/iphone-14-pro-space-black.jpg'),
(5, 'iPhone 14 Pro 256GB Vàng Gold', 7, 19990000, 7, 1, '/assets/products/iphone/iphone-14-pro-gold.jpg'),
(5, 'iPhone 14 Pro 256GB Bạc Silver', 6, 19990000, 8, 1, '/assets/products/iphone/iphone-14-pro-silver.jpg'),

-- 512GB
(5, 'iPhone 14 Pro 512GB Tím Deep Purple', 6, 22490000, 9, 1, '/assets/products/iphone/iphone-14-pro-deep-purple.jpg'),
(5, 'iPhone 14 Pro 512GB Đen Space Black', 5, 22490000, 10, 1, '/assets/products/iphone/iphone-14-pro-space-black.jpg'),
(5, 'iPhone 14 Pro 512GB Vàng Gold', 4, 22490000, 11, 1, '/assets/products/iphone/iphone-14-pro-gold.jpg'),
(5, 'iPhone 14 Pro 512GB Bạc Silver', 3, 22490000, 12, 1, '/assets/products/iphone/iphone-14-pro-silver.jpg'),

-- 1TB
(5, 'iPhone 14 Pro 1TB Tím Deep Purple', 3, 24990000, 13, 1, '/assets/products/iphone/iphone-14-pro-deep-purple.jpg'),
(5, 'iPhone 14 Pro 1TB Đen Space Black', 2, 24990000, 14, 1, '/assets/products/iphone/iphone-14-pro-space-black.jpg'),
(5, 'iPhone 14 Pro 1TB Vàng Gold', 2, 24990000, 15, 1, '/assets/products/iphone/iphone-14-pro-gold.jpg'),
(5, 'iPhone 14 Pro 1TB Bạc Silver', 1, 24990000, 16, 1, '/assets/products/iphone/iphone-14-pro-silver.jpg');

-- ---------------------------------------------------------------------------------
-- [MaSP 6] iPhone 14 Pro Max
-- Màu: Tím Deep Purple, Vàng Gold, Đen Space Black, Bạc Silver
-- ---------------------------------------------------------------------------------
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
-- 128GB
(6, 'iPhone 14 Pro Max 128GB Tím Deep Purple', 25, 18990000, 1, 1, '/assets/products/iphone/iphone-14-pro-max-deep-purple.jpg'),
(6, 'iPhone 14 Pro Max 128GB Đen Space Black', 18, 18990000, 2, 1, '/assets/products/iphone/iphone-14-pro-max-space-black.jpg'),
(6, 'iPhone 14 Pro Max 128GB Vàng Gold', 15, 18990000, 3, 1, '/assets/products/iphone/iphone-14-pro-max-gold.jpg'),
(6, 'iPhone 14 Pro Max 128GB Bạc Silver', 12, 18990000, 4, 1, '/assets/products/iphone/iphone-14-pro-max-silver.jpg'),

-- 256GB
(6, 'iPhone 14 Pro Max 256GB Tím Deep Purple', 16, 21490000, 5, 1, '/assets/products/iphone/iphone-14-pro-max-deep-purple.jpg'),
(6, 'iPhone 14 Pro Max 256GB Đen Space Black', 12, 21490000, 6, 1, '/assets/products/iphone/iphone-14-pro-max-space-black.jpg'),
(6, 'iPhone 14 Pro Max 256GB Vàng Gold', 10, 21490000, 7, 1, '/assets/products/iphone/iphone-14-pro-max-gold.jpg'),
(6, 'iPhone 14 Pro Max 256GB Bạc Silver', 8, 21490000, 8, 1, '/assets/products/iphone/iphone-14-pro-max-silver.jpg'),

-- 512GB
(6, 'iPhone 14 Pro Max 512GB Tím Deep Purple', 7, 23990000, 9, 1, '/assets/products/iphone/iphone-14-pro-max-deep-purple.jpg'),
(6, 'iPhone 14 Pro Max 512GB Đen Space Black', 6, 23990000, 10, 1, '/assets/products/iphone/iphone-14-pro-max-space-black.jpg'),
(6, 'iPhone 14 Pro Max 512GB Vàng Gold', 5, 23990000, 11, 1, '/assets/products/iphone/iphone-14-pro-max-gold.jpg'),
(6, 'iPhone 14 Pro Max 512GB Bạc Silver', 5, 23990000, 12, 1, '/assets/products/iphone/iphone-14-pro-max-silver.jpg'),

-- 1TB
(6, 'iPhone 14 Pro Max 1TB Tím Deep Purple', 4, 26490000, 13, 1, '/assets/products/iphone/iphone-14-pro-max-deep-purple.jpg'),
(6, 'iPhone 14 Pro Max 1TB Đen Space Black', 3, 26490000, 14, 1, '/assets/products/iphone/iphone-14-pro-max-space-black.jpg'),
(6, 'iPhone 14 Pro Max 1TB Vàng Gold', 2, 26490000, 15, 1, '/assets/products/iphone/iphone-14-pro-max-gold.jpg'),
(6, 'iPhone 14 Pro Max 1TB Bạc Silver', 2, 26490000, 16, 1, '/assets/products/iphone/iphone-14-pro-max-silver.jpg');



-- ---------------------------------------------------------------------------------
-- [MaSP 7] iPhone 15
-- Màu: Hồng, Xanh Lá, Xanh Dương, Vàng, Đen
-- ---------------------------------------------------------------------------------
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
-- 128GB
(7, 'iPhone 15 128GB Hồng', 30, 17490000, 1, 1, '/assets/products/iphone/iphone-15-pink.jpg'),
(7, 'iPhone 15 128GB Xanh Lá', 20, 17490000, 2, 1, '/assets/products/iphone/iphone-15-green.jpg'),
(7, 'iPhone 15 128GB Xanh Dương', 20, 17490000, 3, 1, '/assets/products/iphone/iphone-15-blue.jpg'),
(7, 'iPhone 15 128GB Vàng', 15, 17490000, 4, 1, '/assets/products/iphone/iphone-15-yellow.jpg'),
(7, 'iPhone 15 128GB Đen', 18, 17490000, 5, 1, '/assets/products/iphone/iphone-15-black.jpg'),

-- 256GB
(7, 'iPhone 15 256GB Hồng', 10, 18990000, 6, 1, '/assets/products/iphone/iphone-15-pink.jpg'),
(7, 'iPhone 15 256GB Xanh Lá', 9, 18990000, 7, 1, '/assets/products/iphone/iphone-15-green.jpg'),
(7, 'iPhone 15 256GB Xanh Dương', 10, 18990000, 8, 1, '/assets/products/iphone/iphone-15-blue.jpg'),
(7, 'iPhone 15 256GB Vàng', 8, 18990000, 9, 1, '/assets/products/iphone/iphone-15-yellow.jpg'),
(7, 'iPhone 15 256GB Đen', 7, 18990000, 10, 1, '/assets/products/iphone/iphone-15-black.jpg'),

-- 512GB
(7, 'iPhone 15 512GB Hồng', 5, 20490000, 11, 1, '/assets/products/iphone/iphone-15-pink.jpg'),
(7, 'iPhone 15 512GB Xanh Lá', 4, 20490000, 12, 1, '/assets/products/iphone/iphone-15-green.jpg'),
(7, 'iPhone 15 512GB Xanh Dương', 4, 20490000, 13, 1, '/assets/products/iphone/iphone-15-blue.jpg'),
(7, 'iPhone 15 512GB Vàng', 3, 20490000, 14, 1, '/assets/products/iphone/iphone-15-yellow.jpg'),
(7, 'iPhone 15 512GB Đen', 5, 20490000, 15, 1, '/assets/products/iphone/iphone-15-black.jpg');


-- ---------------------------------------------------------------------------------
-- [MaSP 8] iPhone 15 Pro
-- Màu: Tự Nhiên, Xanh, Trắng, Đen
-- ---------------------------------------------------------------------------------
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
-- 128GB
(8, 'iPhone 15 Pro 128GB Titan Tự Nhiên', 20, 23490000, 1, 1, '/assets/products/iphone/iphone-15-pro-natural-titanium.jpg'),
(8, 'iPhone 15 Pro 128GB Titan Xanh', 15, 23490000, 2, 1, '/assets/products/iphone/iphone-15-pro-blue-titanium.jpg'),
(8, 'iPhone 15 Pro 128GB Titan Trắng', 10, 23490000, 3, 1, '/assets/products/iphone/iphone-15-pro-white-titanium.jpg'),
(8, 'iPhone 15 Pro 128GB Titan Đen', 12, 23490000, 4, 1, '/assets/products/iphone/iphone-15-pro-black-titanium.jpg'),

-- 256GB
(8, 'iPhone 15 Pro 256GB Titan Tự Nhiên', 12, 25990000, 5, 1, '/assets/products/iphone/iphone-15-pro-natural-titanium.jpg'),
(8, 'iPhone 15 Pro 256GB Titan Xanh', 11, 25990000, 6, 1, '/assets/products/iphone/iphone-15-pro-blue-titanium.jpg'),
(8, 'iPhone 15 Pro 256GB Titan Trắng', 9, 25990000, 7, 1, '/assets/products/iphone/iphone-15-pro-white-titanium.jpg'),
(8, 'iPhone 15 Pro 256GB Titan Đen', 8, 25990000, 8, 1, '/assets/products/iphone/iphone-15-pro-black-titanium.jpg'),

-- 512GB
(8, 'iPhone 15 Pro 512GB Titan Tự Nhiên', 6, 28490000, 9, 1, '/assets/products/iphone/iphone-15-pro-natural-titanium.jpg'),
(8, 'iPhone 15 Pro 512GB Titan Xanh', 5, 28490000, 10, 1, '/assets/products/iphone/iphone-15-pro-blue-titanium.jpg'),
(8, 'iPhone 15 Pro 512GB Titan Trắng', 5, 28490000, 11, 1, '/assets/products/iphone/iphone-15-pro-white-titanium.jpg'),
(8, 'iPhone 15 Pro 512GB Titan Đen', 4, 28490000, 12, 1, '/assets/products/iphone/iphone-15-pro-black-titanium.jpg'),

-- 1TB
(8, 'iPhone 15 Pro 1TB Titan Tự Nhiên', 3, 30990000, 13, 1, '/assets/products/iphone/iphone-15-pro-natural-titanium.jpg'),
(8, 'iPhone 15 Pro 1TB Titan Xanh', 3, 30990000, 14, 1, '/assets/products/iphone/iphone-15-pro-blue-titanium.jpg'),
(8, 'iPhone 15 Pro 1TB Titan Trắng', 2, 30990000, 15, 1, '/assets/products/iphone/iphone-15-pro-white-titanium.jpg'),
(8, 'iPhone 15 Pro 1TB Titan Đen', 2, 30990000, 16, 1, '/assets/products/iphone/iphone-15-pro-black-titanium.jpg');

-- ---------------------------------------------------------------------------------
-- [MaSP 9] iPhone 15 Pro Max
-- Màu: Tự Nhiên, Xanh, Trắng, Đen (Bắt đầu từ 256GB)
-- ---------------------------------------------------------------------------------
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
-- 256GB
(9, 'iPhone 15 Pro Max 256GB Titan Tự Nhiên', 40, 25990000, 1, 1, '/assets/products/iphone/iphone-15-pro-max-natural.jpg'),
(9, 'iPhone 15 Pro Max 256GB Titan Xanh', 20, 25990000, 2, 1, '/assets/products/iphone/iphone-15-pro-max-blue.jpg'),
(9, 'iPhone 15 Pro Max 256GB Titan Trắng', 20, 25990000, 3, 1, '/assets/products/iphone/iphone-15-pro-max-white.jpg'),
(9, 'iPhone 15 Pro Max 256GB Titan Đen', 20, 25990000, 4, 1, '/assets/products/iphone/iphone-15-pro-max-black.jpg'),

-- 512GB
(9, 'iPhone 15 Pro Max 512GB Titan Tự Nhiên', 10, 28490000, 5, 1, '/assets/products/iphone/iphone-15-pro-max-natural.jpg'),
(9, 'iPhone 15 Pro Max 512GB Titan Xanh', 8, 28490000, 6, 1, '/assets/products/iphone/iphone-15-pro-max-blue.jpg'),
(9, 'iPhone 15 Pro Max 512GB Titan Trắng', 8, 28490000, 7, 1, '/assets/products/iphone/iphone-15-pro-max-white.jpg'),
(9, 'iPhone 15 Pro Max 512GB Titan Đen', 8, 28490000, 8, 1, '/assets/products/iphone/iphone-15-pro-max-black.jpg'),

-- 1TB
(9, 'iPhone 15 Pro Max 1TB Titan Tự Nhiên', 5, 30990000, 9, 1, '/assets/products/iphone/iphone-15-pro-max-natural.jpg'),
(9, 'iPhone 15 Pro Max 1TB Titan Xanh', 5, 30990000, 10, 1, '/assets/products/iphone/iphone-15-pro-max-blue.jpg'),
(9, 'iPhone 15 Pro Max 1TB Titan Trắng', 5, 30990000, 11, 1, '/assets/products/iphone/iphone-15-pro-max-white.jpg'),
(9, 'iPhone 15 Pro Max 1TB Titan Đen', 5, 30990000, 12, 1, '/assets/products/iphone/iphone-15-pro-max-black.jpg');

-- ---------------------------------------------------------------------------------
-- [MaSP 10] iPhone 16
-- Màu: Xanh Lưu Ly, Xanh Mòng Két, Hồng, Trắng, Đen
-- ---------------------------------------------------------------------------------
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
-- 128GB
(10, 'iPhone 16 128GB Xanh Lưu Ly', 30, 23490000, 1, 1, '/assets/products/iphone/iphone-16-ultramarine.jpg'),
(10, 'iPhone 16 128GB Xanh Mòng Két', 25, 23490000, 2, 1, '/assets/products/iphone/iphone-16-teal.jpg'),
(10, 'iPhone 16 128GB Hồng', 20, 23490000, 3, 1, '/assets/products/iphone/iphone-16-pink.jpg'),
(10, 'iPhone 16 128GB Trắng', 15, 23490000, 4, 1, '/assets/products/iphone/iphone-16-white.jpg'),
(10, 'iPhone 16 128GB Đen', 15, 23490000, 5, 1, '/assets/products/iphone/iphone-16-black.jpg'),

-- 256GB
(10, 'iPhone 16 256GB Xanh Lưu Ly', 10, 24990000, 6, 1, '/assets/products/iphone/iphone-16-ultramarine.jpg'),
(10, 'iPhone 16 256GB Xanh Mòng Két', 8, 24990000, 7, 1, '/assets/products/iphone/iphone-16-teal.jpg'),
(10, 'iPhone 16 256GB Hồng', 8, 24990000, 8, 1, '/assets/products/iphone/iphone-16-pink.jpg'),
(10, 'iPhone 16 256GB Trắng', 6, 24990000, 9, 1, '/assets/products/iphone/iphone-16-white.jpg'),
(10, 'iPhone 16 256GB Đen', 6, 24990000, 10, 1, '/assets/products/iphone/iphone-16-black.jpg');

-- ---------------------------------------------------------------------------------
-- [MaSP 11] iPhone 16 Pro
-- Màu: Sa Mạc, Tự Nhiên, Trắng, Đen
-- ---------------------------------------------------------------------------------
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
-- 128GB
(11, 'iPhone 16 Pro 128GB Titan Sa Mạc', 20, 25990000, 1, 1, '/assets/products/iphone/iphone-16-pro-desert.jpg'),
(11, 'iPhone 16 Pro 128GB Titan Tự Nhiên', 20, 25990000, 2, 1, '/assets/products/iphone/iphone-16-pro-natural.jpg'),
(11, 'iPhone 16 Pro 128GB Titan Trắng', 15, 25990000, 3, 1, '/assets/products/iphone/iphone-16-pro-white.jpg'),
(11, 'iPhone 16 Pro 128GB Titan Đen', 15, 25990000, 4, 1, '/assets/products/iphone/iphone-16-pro-black.jpg'),

-- 256GB
(11, 'iPhone 16 Pro 256GB Titan Sa Mạc', 10, 27990000, 5, 1, '/assets/products/iphone/iphone-16-pro-desert.jpg'),
(11, 'iPhone 16 Pro 256GB Titan Tự Nhiên', 10, 27990000, 6, 1, '/assets/products/iphone/iphone-16-pro-natural.jpg'),
(11, 'iPhone 16 Pro 256GB Titan Trắng', 8, 27990000, 7, 1, '/assets/products/iphone/iphone-16-pro-white.jpg'),
(11, 'iPhone 16 Pro 256GB Titan Đen', 8, 27990000, 8, 1, '/assets/products/iphone/iphone-16-pro-black.jpg'),

-- 1TB
(11, 'iPhone 16 Pro 1TB Titan Sa Mạc', 3, 31990000, 9, 1, '/assets/products/iphone/iphone-16-pro-desert.jpg'),
(11, 'iPhone 16 Pro 1TB Titan Tự Nhiên', 3, 31990000, 10, 1, '/assets/products/iphone/iphone-16-pro-natural.jpg'),
(11, 'iPhone 16 Pro 1TB Titan Trắng', 2, 31990000, 11, 1, '/assets/products/iphone/iphone-16-pro-white.jpg'),
(11, 'iPhone 16 Pro 1TB Titan Đen', 2, 31990000, 12, 1, '/assets/products/iphone/iphone-16-pro-black.jpg');

-- ---------------------------------------------------------------------------------
-- [MaSP 12] iPhone 16 Pro Max
-- Màu: Sa Mạc, Tự Nhiên, Trắng, Đen
-- ---------------------------------------------------------------------------------
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
-- 256GB
(12, 'iPhone 16 Pro Max 256GB Titan Sa Mạc', 50, 27490000, 1, 1, '/assets/products/iphone/iphone-16-pro-max-desert.jpg'),
(12, 'iPhone 16 Pro Max 256GB Titan Tự Nhiên', 35, 27490000, 2, 1, '/assets/products/iphone/iphone-16-pro-max-natural.jpg'),
(12, 'iPhone 16 Pro Max 256GB Titan Trắng', 30, 27490000, 3, 1, '/assets/products/iphone/iphone-16-pro-max-white.jpg'),
(12, 'iPhone 16 Pro Max 256GB Titan Đen', 30, 27490000, 4, 1, '/assets/products/iphone/iphone-16-pro-max-black.jpg'),

-- 512GB
(12, 'iPhone 16 Pro Max 512GB Titan Sa Mạc', 20, 29990000, 5, 1, '/assets/products/iphone/iphone-16-pro-max-desert.jpg'),
(12, 'iPhone 16 Pro Max 512GB Titan Tự Nhiên', 15, 29990000, 6, 1, '/assets/products/iphone/iphone-16-pro-max-natural.jpg'),
(12, 'iPhone 16 Pro Max 512GB Titan Trắng', 12, 29990000, 7, 1, '/assets/products/iphone/iphone-16-pro-max-white.jpg'),
(12, 'iPhone 16 Pro Max 512GB Titan Đen', 12, 29990000, 8, 1, '/assets/products/iphone/iphone-16-pro-max-black.jpg'),

-- 1TB
(12, 'iPhone 16 Pro Max 1TB Titan Sa Mạc', 5, 32490000, 9, 1, '/assets/products/iphone/iphone-16-pro-max-desert.jpg'),
(12, 'iPhone 16 Pro Max 1TB Titan Tự Nhiên', 4, 32490000, 10, 1, '/assets/products/iphone/iphone-16-pro-max-natural.jpg'),
(12, 'iPhone 16 Pro Max 1TB Titan Trắng', 3, 32490000, 11, 1, '/assets/products/iphone/iphone-16-pro-max-white.jpg'),
(12, 'iPhone 16 Pro Max 1TB Titan Đen', 5, 32490000, 12, 1, '/assets/products/iphone/iphone-16-pro-max-black.jpg');


-- ---------------------------------------------------------------------------------
-- [MaSP 13] iPhone Air 
-- Màu: Xanh Da Trời, Vàng Nhạt, Trắng Mây, Đen Không Gian
-- ---------------------------------------------------------------------------------
INSERT INTO BienThe 
(MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
-- 128GB (không có 128gb)

-- 256GB
(13, 'iPhone Air 256GB Sky Blue', 15, 26490000, 5, 1, '/assets/products/iphone/iphone-air-sky-blue.jpg'),
(13, 'iPhone Air 256GB Light Gold', 15, 26490000, 6, 1, '/assets/products/iphone/iphone-air-light-gold.jpg'),
(13, 'iPhone Air 256GB Cloud White', 15, 26490000, 7, 1, '/assets/products/iphone/iphone-air-cloud-white.jpg'),
(13, 'iPhone Air 256GB Space Black', 15, 26490000, 8, 1, '/assets/products/iphone/iphone-air-space-black.jpg'),

-- 512GB
(13, 'iPhone Air 512GB Sky Blue', 5, 29990000, 9, 1, '/assets/products/iphone/iphone-air-sky-blue.jpg'),
(13, 'iPhone Air 512GB Light Gold', 5, 29990000, 10, 1, '/assets/products/iphone/iphone-air-light-gold.jpg'),
(13, 'iPhone Air 512GB Cloud White', 5, 29990000, 11, 1, '/assets/products/iphone/iphone-air-cloud-white.jpg'),
(13, 'iPhone Air 512GB Space Black', 5, 29990000, 12, 1, '/assets/products/iphone/iphone-air-space-black.jpg');


-- ---------------------------------------------------------------------------------
-- [MaSP 14] iPhone 17 Pro 
-- Màu: Cam Vũ Trụ, Xanh Đậm, Bạc
-- ---------------------------------------------------------------------------------
INSERT INTO BienThe 
(MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
-- 256GB
(14, 'iPhone 17 Pro 256GB Cam Vũ Trụ', 10, 29990000, 1, 1, '/assets/products/iphone/iphone-17-pro-cosmic-orange.jpg'),
(14, 'iPhone 17 Pro 256GB Xanh Đậm', 10, 29990000, 2, 1, '/assets/products/iphone/iphone-17-pro-deep-blue.jpg'),
(14, 'iPhone 17 Pro 256GB Bạc', 10, 29990000, 3, 1, '/assets/products/iphone/iphone-17-pro-silver.jpg'),

-- 512GB
(14, 'iPhone 17 Pro 512GB Cam Vũ Trụ', 5, 32990000, 4, 1, '/assets/products/iphone/iphone-17-pro-cosmic-orange.jpg'),
(14, 'iPhone 17 Pro 512GB Xanh Đậm', 5, 32990000, 5, 1, '/assets/products/iphone/iphone-17-pro-deep-blue.jpg'),
(14, 'iPhone 17 Pro 512GB Bạc', 5, 32990000, 6, 1, '/assets/products/iphone/iphone-17-pro-silver.jpg'),

-- 1TB
(14, 'iPhone 17 Pro 1TB Cam Vũ Trụ', 2, 36990000, 7, 1, '/assets/products/iphone/iphone-17-pro-cosmic-orange.jpg'),
(14, 'iPhone 17 Pro 1TB Xanh Đậm', 2, 36990000, 8, 1, '/assets/products/iphone/iphone-17-pro-deep-blue.jpg'),
(14, 'iPhone 17 Pro 1TB Bạc', 2, 36990000, 9, 1, '/assets/products/iphone/iphone-17-pro-silver.jpg');


-- ---------------------------------------------------------------------------------
-- [MaSP 15] iPhone 17 Pro Max 
-- Màu: Cam Vũ Trụ, Xanh Đậm, Bạc
-- ---------------------------------------------------------------------------------
INSERT INTO BienThe 
(MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
-- 256GB
(15, 'iPhone 17 Pro Max 256GB Cam Vũ Trụ', 10, 36990000, 1, 1, '/assets/products/iphone/iphone-17-pro-max-cosmic-orange.jpg'),
(15, 'iPhone 17 Pro Max 256GB Xanh Đậm', 10, 36990000, 2, 1, '/assets/products/iphone/iphone-17-pro-max-deep-blue.jpg'),
(15, 'iPhone 17 Pro Max 256GB Bạc', 10, 36990000, 3, 1, '/assets/products/iphone/iphone-17-pro-max-silver.jpg'),

-- 512GB
(15, 'iPhone 17 Pro Max 512GB Cam Vũ Trụ', 5, 40990000, 4, 1, '/assets/products/iphone/iphone-17-pro-max-cosmic-orange.jpg'),
(15, 'iPhone 17 Pro Max 512GB Xanh Đậm', 5, 40900000, 5, 1, '/assets/products/iphone/iphone-17-pro-max-deep-blue.jpg'),
(15, 'iPhone 17 Pro Max 512GB Bạc', 5, 40990000, 6, 1, '/assets/products/iphone/iphone-17-pro-max-silver.jpg'),

-- 1TB
(15, 'iPhone 17 Pro Max 1TB Cam Vũ Trụ', 2, 45990000, 7, 1, '/assets/products/iphone/iphone-17-pro-max-cosmic-orange.jpg'),
(15, 'iPhone 17 Pro Max 1TB Xanh Đậm', 2, 45990000, 8, 1, '/assets/products/iphone/iphone-17-pro-max-deep-blue.jpg'),
(15, 'iPhone 17 Pro Max 1TB Bạc', 2, 45990000, 9, 1, '/assets/products/iphone/iphone-17-pro-max-silver.jpg');


-- ---------------------------------------------------------------------------------
-- [MaSP 16] iPad mini 6
-- Màu: Tím, Xám, Hồng, Trắng
-- ---------------------------------------------------------------------------------
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
(16, 'iPad mini 6 64GB WiFi Tím', 10, 12990000, 1, 1, '/assets/products/ipad/ipad-mini-6-purple.jpg'),
(16, 'iPad mini 6 64GB WiFi Xám', 15, 12990000, 2, 1, '/assets/products/ipad/ipad-mini-6-space-gray.jpg'),
(16, 'iPad mini 6 64GB WiFi Hồng', 8, 12990000, 3, 1, '/assets/products/ipad/ipad-mini-6-pink.jpg'),
(16, 'iPad mini 6 64GB WiFi Trắng', 10, 12990000, 4, 1, '/assets/products/ipad/ipad-mini-6-starlight.jpg'),
(16, 'iPad mini 6 256GB WiFi Tím', 5, 16990000, 5, 1, '/assets/products/ipad/ipad-mini-6-purple.jpg'),
(16, 'iPad mini 6 256GB WiFi Xám', 4, 16990000, 6, 1, '/assets/products/ipad/ipad-mini-6-space-gray.jpg'),
(16, 'iPad mini 6 256GB WiFi Hồng', 3, 16990000, 7, 1, '/assets/products/ipad/ipad-mini-6-pink.jpg');
-- ---------------------------------------------------------------------------------
-- [MaSP 17] iPad Gen 9
-- Màu: Bạc, Xám
-- ---------------------------------------------------------------------------------
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
(17, 'iPad Gen 9 64GB WiFi Bạc', 50, 6990000, 1, 1, '/assets/products/ipad/ipad-gen-9-silver.jpg'),
(17, 'iPad Gen 9 64GB WiFi Xám', 45, 6990000, 2, 1, '/assets/products/ipad/ipad-gen-9-space-gray.jpg'),
(17, 'iPad Gen 9 256GB WiFi Bạc', 20, 9990000, 3, 1, '/assets/products/ipad/ipad-gen-9-silver.jpg'),
(17, 'iPad Gen 9 256GB WiFi Xám', 10, 9990000, 4, 1, '/assets/products/ipad/ipad-gen-9-space-gray.jpg');

-- ---------------------------------------------------------------------------------
-- [MaSP 18] iPad Air 5 M1
-- Màu: Xanh Dương, Tím, Xám
-- ---------------------------------------------------------------------------------
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
(18, 'iPad Air 5 64GB WiFi Xanh Dương', 15, 14990000, 1, 1, '/assets/products/ipad/ipad-air-5-blue.jpg'),
(18, 'iPad Air 5 64GB WiFi Tím', 10, 14990000, 2, 1, '/assets/products/ipad/ipad-air-5-purple.jpg'),
(18, 'iPad Air 5 64GB WiFi Xám', 12, 14990000, 3, 1, '/assets/products/ipad/ipad-air-5-space-gray.jpg'),
(18, 'iPad Air 5 256GB WiFi Xanh Dương', 5, 18990000, 4, 1, '/assets/products/ipad/ipad-air-5-blue.jpg'),
(18, 'iPad Air 5 256GB WiFi Tím', 4, 18990000, 5, 1, '/assets/products/ipad/ipad-air-5-purple.jpg');

-- ---------------------------------------------------------------------------------
-- [MaSP 19] iPad Gen 10
-- Màu: Vàng, Xanh, Hồng, Bạc
-- ---------------------------------------------------------------------------------
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
(19, 'iPad Gen 10 64GB WiFi Vàng', 20, 9490000, 1, 1, '/assets/products/ipad/ipad-gen-10-yellow.jpg'),
(19, 'iPad Gen 10 64GB WiFi Xanh', 18, 9490000, 2, 1, '/assets/products/ipad/ipad-gen-10-blue.jpg'),
(19, 'iPad Gen 10 64GB WiFi Hồng', 15, 9490000, 3, 1, '/assets/products/ipad/ipad-gen-10-pink.jpg'),
(19, 'iPad Gen 10 256GB WiFi Bạc', 10, 13490000, 4, 1, '/assets/products/ipad/ipad-gen-10-silver.jpg'),
(19, 'iPad Gen 10 256GB WiFi Vàng', 5, 13490000, 5, 1, '/assets/products/ipad/ipad-gen-10-yellow.jpg'),
(19, 'iPad Gen 10 256GB WiFi Hồng', 3, 13490000, 6, 1, '/assets/products/ipad/ipad-gen-10-pink.jpg');

-- ---------------------------------------------------------------------------------
-- [MaSP 20] iPad Pro 12.9 M2
-- Màu: Xám, Bạc
-- ---------------------------------------------------------------------------------
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
(20, 'iPad Pro 12.9 M2 128GB WiFi Xám', 5, 26990000, 1, 1, '/assets/products/ipad/ipad-pro-12-9-m2-space-gray.jpg'),
(20, 'iPad Pro 12.9 M2 256GB WiFi Bạc', 3, 29990000, 2, 1, '/assets/products/ipad/ipad-pro-12-9-m2-silver.jpg'),
(20, 'iPad Pro 12.9 M2 512GB WiFi Xám', 2, 35990000, 3, 1, '/assets/products/ipad/ipad-pro-12-9-m2-space-gray.jpg'),
(20, 'iPad Pro 12.9 M2 512GB WiFi Bạc', 2, 35990000, 4, 1, '/assets/products/ipad/ipad-pro-12-9-m2-silver.jpg');

-- ---------------------------------------------------------------------------------
-- [MaSP 21] iPad Air 13 M2
-- Màu: Xanh Biển, Xám, Tím, Trắng Sao
-- ---------------------------------------------------------------------------------
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
(21, 'iPad Air 13 M2 128GB WiFi Xanh Biển', 10, 21990000, 1, 1, '/assets/products/ipad/ipad-air-13-m2-blue.jpg'),
(21, 'iPad Air 13 M2 128GB WiFi Xám Không Gian', 8, 21990000, 2, 1, '/assets/products/ipad/ipad-air-13-m2-space-gray.jpg'),
(21, 'iPad Air 13 M2 256GB WiFi Tím', 5, 24990000, 3, 1, '/assets/products/ipad/ipad-air-13-m2-purple.jpg'),
(21, 'iPad Air 13 M2 512GB WiFi Trắng Sao', 3, 30990000, 4, 1, '/assets/products/ipad/ipad-air-13-m2-starlight.jpg'),
(21, 'iPad Air 13 M2 256GB WiFi Xanh Biển', 4, 24990000, 5, 1, '/assets/products/ipad/ipad-air-13-m2-blue.jpg'),
(21, 'iPad Air 13 M2 512GB WiFi Xám Không Gian', 2, 30990000, 6, 1, '/assets/products/ipad/ipad-air-13-m2-space-gray.jpg');

-- ---------------------------------------------------------------------------------
-- [MaSP 22] iPad Pro 13 M4
-- Màu: Đen Space Black, Bạc Silver
-- ---------------------------------------------------------------------------------
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
(22, 'iPad Pro 13 M4 256GB WiFi Đen Space Black', 15, 37990000, 1, 1, '/assets/products/ipad/ipad-pro-13-m4-black.jpg'),
(22, 'iPad Pro 13 M4 256GB WiFi Bạc Silver', 10, 37990000, 2, 1, '/assets/products/ipad/ipad-pro-13-m4-silver.jpg'),
(22, 'iPad Pro 13 M4 512GB WiFi Đen Space Black', 8, 43990000, 3, 1, '/assets/products/ipad/ipad-pro-13-m4-black.jpg'),
(22, 'iPad Pro 13 M4 1TB WiFi Bạc Silver', 2, 57990000, 4, 1, '/assets/products/ipad/ipad-pro-13-m4-silver.jpg'),
(22, 'iPad Pro 13 M4 512GB WiFi Bạc Silver', 4, 43990000, 5, 1, '/assets/products/ipad/ipad-pro-13-m4-silver.jpg'),
(22, 'iPad Pro 13 M4 1TB WiFi Đen Space Black', 2, 57990000, 6, 1, '/assets/products/ipad/ipad-pro-13-m4-black.jpg');

-- ---------------------------------------------------------------------------------
-- [MaSP 23] iPad mini 7
-- Màu: Xanh Blue, Tím Purple, Trắng Starlight, Xám Space Gray
-- ---------------------------------------------------------------------------------
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
(23, 'iPad mini 7 128GB WiFi Xanh Blue', 20, 14990000, 1, 1, '/assets/products/ipad/ipad-mini-7-blue.jpg'),
(23, 'iPad mini 7 128GB WiFi Tím Purple', 15, 14990000, 2, 1, '/assets/products/ipad/ipad-mini-7-purple.jpg'),
(23, 'iPad mini 7 256GB WiFi Trắng Starlight', 8, 17990000, 3, 1, '/assets/products/ipad/ipad-mini-7-starlight.jpg'),
(23, 'iPad mini 7 512GB WiFi Xám Space Gray', 5, 23990000, 4, 1, '/assets/products/ipad/ipad-mini-7-space-gray.jpg'),
(23, 'iPad mini 7 128GB WiFi Trắng Starlight', 10, 14990000, 5, 1, '/assets/products/ipad/ipad-mini-7-starlight.jpg'),
(23, 'iPad mini 7 256GB WiFi Tím Purple', 6, 17990000, 6, 1, '/assets/products/ipad/ipad-mini-7-purple.jpg');

-- ---------------------------------------------------------------------------------
-- [MaSP 24] MacBook Air M1
-- Màu: Vàng Gold, Xám Space Gray, Bạc Silver
-- ---------------------------------------------------------------------------------
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
(24, 'MacBook Air M1 8GB/256GB Vàng Gold', 30, 15990000, 1, 1, '/assets/products/macbook/macbook-air-m1-gold.jpg'),
(24, 'MacBook Air M1 8GB/256GB Xám Space Gray', 40, 15990000, 2, 1, '/assets/products/macbook/macbook-air-m1-space-gray.jpg'),
(24, 'MacBook Air M1 8GB/256GB Bạc Silver', 20, 15990000, 3, 1, '/assets/products/macbook/macbook-air-m1-silver.jpg'),
(24, 'MacBook Air M1 16GB/512GB Vàng Gold', 5, 23990000, 4, 1, '/assets/products/macbook/macbook-air-m1-gold.jpg'),
(24, 'MacBook Air M1 16GB/512GB Xám Space Gray', 8, 23990000, 5, 1, '/assets/products/macbook/macbook-air-m1-space-gray.jpg');

-- ---------------------------------------------------------------------------------
-- [MaSP 25] MacBook Air M2
-- Màu: Midnight, Starlight, Space Gray, Silver
-- ---------------------------------------------------------------------------------
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
(25, 'MacBook Air M2 8GB/256GB Xanh Midnight', 25, 22990000, 1, 1, '/assets/products/macbook/macbook-air-m2-midnight.jpg'),
(25, 'MacBook Air M2 8GB/256GB Vàng Starlight', 20, 22990000, 2, 1, '/assets/products/macbook/macbook-air-m2-starlight.jpg'),
(25, 'MacBook Air M2 8GB/256GB Xám Space Gray', 15, 22990000, 3, 1, '/assets/products/macbook/macbook-air-m2-space-gray.jpg'),
(25, 'MacBook Air M2 8GB/256GB Bạc Silver', 10, 22990000, 4, 1, '/assets/products/macbook/macbook-air-m2-silver.jpg'),
(25, 'MacBook Air M2 16GB/512GB Xanh Midnight', 5, 31990000, 5, 1, '/assets/products/macbook/macbook-air-m2-midnight.jpg'),
(25, 'MacBook Air M2 16GB/512GB Bạc Silver', 4, 31990000, 7, 1, '/assets/products/macbook/macbook-air-m2-silver.jpg');

-- ---------------------------------------------------------------------------------
-- [MaSP 26] MacBook Pro 14 M2
-- Màu: Xám, Bạc
-- ---------------------------------------------------------------------------------
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
(26, 'MacBook Pro 14 M2 Pro 16GB/512GB Xám', 5, 42990000, 1, 1, '/assets/products/macbook/macbook-pro-14-m2-space-gray.jpg'),
(26, 'MacBook Pro 14 M2 Pro 16GB/512GB Bạc', 3, 42990000, 2, 1, '/assets/products/macbook/macbook-pro-14-m2-silver.jpg'),
(26, 'MacBook Pro 14 M2 Max 32GB/1TB Xám', 2, 59990000, 3, 1, '/assets/products/macbook/macbook-pro-14-m2-space-gray.jpg'),
(26, 'MacBook Pro 14 M2 Max 32GB/1TB Bạc', 2, 59990000, 4, 1, '/assets/products/macbook/macbook-pro-14-m2-silver.jpg');

-- ---------------------------------------------------------------------------------
-- [MaSP 27] MacBook Pro 16 M3
-- Màu: Space Black, Silver
-- ---------------------------------------------------------------------------------
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
(27, 'MacBook Pro 16 M3 Pro 18GB/512GB Space Black', 10, 59990000, 1, 1, '/assets/products/macbook/macbook-pro-16-m3-space-black.jpg'),
(27, 'MacBook Pro 16 M3 Pro 36GB/512GB Space Black', 8, 69990000, 2, 1, '/assets/products/macbook/macbook-pro-16-m3-space-black.jpg'),
(27, 'MacBook Pro 16 M3 Max 36GB/1TB Silver', 5, 89990000, 3, 1, '/assets/products/macbook/macbook-pro-16-m3-silver.jpg'),
(27, 'MacBook Pro 16 M3 Max 36GB/1TB Space Black', 3, 89990000, 4, 1, '/assets/products/macbook/macbook-pro-16-m3-space-black.jpg');

-- ---------------------------------------------------------------------------------
-- [MaSP 28] MacBook Air 15 M3
-- Màu: Midnight, Starlight, Silver, Space Gray
-- ---------------------------------------------------------------------------------
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
(28, 'MacBook Air 15 M3 8GB/256GB Midnight', 15, 31990000, 1, 1, '/assets/products/macbook/mba-15-m3-midnight.jpg'),
(28, 'MacBook Air 15 M3 8GB/256GB Starlight', 12, 31990000, 2, 1, '/assets/products/macbook/mba-15-m3-starlight.jpg'),
(28, 'MacBook Air 15 M3 8GB/256GB Silver', 10, 31990000, 3, 1, '/assets/products/macbook/mba-15-m3-silver.jpg'),
(28, 'MacBook Air 15 M3 8GB/256GB Space Gray', 10, 31990000, 4, 1, '/assets/products/macbook/mba-15-m3-space-gray.jpg'),
(28, 'MacBook Air 15 M3 16GB/512GB Midnight', 5, 41990000, 5, 1, '/assets/products/macbook/mba-15-m3-midnight.jpg'),
(28, 'MacBook Air 15 M3 16GB/512GB Starlight', 5, 41990000, 6, 1, '/assets/products/macbook/mba-15-m3-starlight.jpg'),
(28, 'MacBook Air 15 M3 16GB/512GB Silver', 4, 41990000, 7, 1, '/assets/products/macbook/mba-15-m3-silver.jpg'),
(28, 'MacBook Air 15 M3 16GB/512GB Space Gray', 3, 41990000, 8, 1, '/assets/products/macbook/mba-15-m3-space-gray.jpg');

-- ---------------------------------------------------------------------------------
-- [MaSP 29] MacBook Pro 14 M4
-- Màu: Space Black, Silver
-- ---------------------------------------------------------------------------------
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
(29, 'MacBook Pro 14 M4 16GB/512GB Space Black', 20, 39990000, 1, 1, '/assets/products/macbook/mbp-14-m4-black.jpg'),
(29, 'MacBook Pro 14 M4 16GB/512GB Silver', 15, 39990000, 2, 1, '/assets/products/macbook/mbp-14-m4-silver.jpg'),
(29, 'MacBook Pro 14 M4 16GB/1TB Space Black', 10, 44990000, 3, 1, '/assets/products/macbook/mbp-14-m4-black.jpg'),
(29, 'MacBook Pro 14 M4 24GB/1TB Space Black', 8, 49990000, 4, 1, '/assets/products/macbook/mbp-14-m4-black.jpg'),
(29, 'MacBook Pro 14 M4 32GB/1TB Silver', 5, 49990000, 5, 1, '/assets/products/macbook/mbp-14-m4-silver.jpg');

-- ---------------------------------------------------------------------------------
-- [MaSP 30] MacBook Pro 16 M4
-- Màu: Space Black, Silver
-- ---------------------------------------------------------------------------------
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
(30, 'MacBook Pro 16 M4 Pro 24GB/512GB Space Black', 15, 64990000, 1, 1, '/assets/products/macbook/mbp-16-m4-black.jpg'),
(30, 'MacBook Pro 16 M4 Pro 48GB/512GB Silver', 8, 74990000, 2, 1, '/assets/products/macbook/mbp-16-m4-silver.jpg'),
(30, 'MacBook Pro 16 M4 Max 36GB/1TB Space Black', 5, 89990000, 3, 1, '/assets/products/macbook/mbp-16-m4-black.jpg'),
(30, 'MacBook Pro 16 M4 Max 128GB/8TB Space Black', 1, 149990000, 4, 1, '/assets/products/macbook/mbp-16-m4-black.jpg'),
(30, 'MacBook Pro 16 M4 Pro 48GB/1TB Silver', 4, 74990000, 5, 1, '/assets/products/macbook/mbp-16-m4-silver.jpg');

-- =================================================================================
-- BỔ SUNG DỮ LIỆU BIẾN THỂ CHO AIRPODS VÀ PHỤ KIỆN
-- =================================================================================

-- ---------------------------------------------------------------------------------
-- PHẦN 4: AIRPODS (MaSP 31 -> 35)
-- Ảnh lấy từ dòng đầu tiên trong bảng AnhSP
-- ---------------------------------------------------------------------------------

-- 31. AirPods 3
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
(31, 'AirPods 3', 50, 4290000, 1, 1, '/assets/products/airpods/airpods-3-anh-chinh.jpg');

-- 32. AirPods Pro 2
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
(32, 'AirPods Pro 2', 50, 5990000, 1, 1, '/assets/products/airpods/airpods-pro-2-anh-chinh.jpg');

-- 33. AirPods 4
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
(33, 'AirPods 4', 50, 3490000, 1, 1, '/assets/products/airpods/airpods-4-thiet-ke-mo.jpg');

-- 34. AirPods 4 ANC
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
(34, 'AirPods 4 ANC', 50, 4790000, 1, 1, '/assets/products/airpods/airpods-4-anc-anh-chinh.jpg');

-- 35. AirPods Max 2024
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
(35, 'AirPods Max 2024', 20, 13990000, 1, 1, '/assets/products/airpods/airpods-max-2024-1.jpg');


-- ---------------------------------------------------------------------------------
-- PHẦN 5: PHỤ KIỆN (MaSP 36 -> 52)
-- Ảnh lấy từ dòng đầu tiên trong bảng AnhSP
-- ---------------------------------------------------------------------------------

-- 36. Sport Band
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
(36, 'Dây đeo Sport Band Cao su', 100, 1290000, 1, 1, '/assets/products/accessories/day-deo-the-thao-1.jpg');

-- 37. Milanese Loop
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
(37, 'Dây đeo Milanese Loop Thép', 50, 2590000, 1, 1, '/assets/products/accessories/day-deo-thep-den.jpg');

-- 38. Alpine Loop
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
(38, 'Dây đeo Alpine Loop', 50, 2590000, 1, 1, '/assets/products/accessories/day-deo-alpine-den.jpg');

-- 39. Ocean Band
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
(39, 'Dây đeo Ocean Band', 50, 2590000, 1, 1, '/assets/products/accessories/day-deo-bien-midnight.jpg');

-- 40. Silicone Case MagSafe
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
(40, 'Ốp lưng Silicone MagSafe', 100, 1190000, 1, 1, '/assets/products/accessories/op-lung-silicone-vong-magsafe.jpg');

-- 41. Clear Case MagSafe
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
(41, 'Ốp lưng Trong suốt MagSafe', 100, 1190000, 1, 1, '/assets/products/accessories/op-lung-trong-suot.jpg');

-- 42. Smart Folio iPad
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
(42, 'Bao da Smart Folio iPad', 50, 2190000, 1, 1, '/assets/products/accessories/bao-da-ipad-mo-nap.jpg');

-- 43. Magic Keyboard iPad
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
(43, 'Bàn phím Magic Keyboard iPad', 30, 7990000, 1, 1, '/assets/products/accessories/ban-phim-ipad-dang-lo-lung.jpg');

-- 44. 20W USB-C Adapter
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
(44, 'Củ sạc 20W USB-C', 200, 529000, 1, 1, '/assets/products/accessories/cu-sac-20w.jpg');

-- 45. 35W Dual USB-C
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
(45, 'Củ sạc 35W Dual USB-C', 100, 1390000, 1, 1, '/assets/products/accessories/cu-sac-35w-kep.jpg');

-- 46. 70W USB-C Adapter
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
(46, '70W USB-C Adapter', 50, 1790000, 1, 1, '/assets/products/accessories/cu-sac-70w.jpg');

-- 47. MagSafe Charger
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
(47, 'Sạc không dây MagSafe', 150, 990000, 1, 1, '/assets/products/accessories/sac-khong-day-magsafe.jpg');

-- 48. Cáp sạc USB-C 60W
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
(48, 'Cáp sạc USB-C 60W', 200, 539000, 1, 1, '/assets/products/accessories/cap-sac-usb-c-du.jpg');

-- 49. Cáp MagSafe 3
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
(49, 'Cáp MagSafe 3', 50, 1290000, 1, 1, '/assets/products/accessories/cap-magsafe-3.jpg');

-- 50. Cáp Thunderbolt 4 Pro
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
(50, 'Cáp Thunderbolt 4 Pro', 30, 3290000, 1, 1, '/assets/products/accessories/cap-thunderbolt-4.jpg');

-- 51. Apple Pencil Pro
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
(51, 'Apple Pencil Pro', 50, 3490000, 1, 1, '/assets/products/accessories/but-pencil-pro.jpg');

-- 52. AirTag
INSERT INTO BienThe (MaSP, TenBienThe, SoLuongTonKho, GiaTienBienThe, ThuTuHienThi, TinhTrangHoatDong, DuongDanAnhBienThe) VALUES 
(52, 'AirTag (1 Pack)', 100, 790000, 1, 1, '/assets/products/accessories/airtag-mat-truoc.jpg');