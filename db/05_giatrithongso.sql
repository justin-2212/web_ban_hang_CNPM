-- =======================================================
-- FILE: GiaTriThongSo_Full.sql
-- NỘI DUNG: Cấu hình chi tiết cho 52 sản phẩm Apple
-- =======================================================

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE GiaTriThongSo;
SET FOREIGN_KEY_CHECKS = 1;

-- =======================================================
-- PHẦN 1: IPHONE (MaSP 1 -> 15)
-- Thông số: 1=Màn, 2=CN Màn, 3=Chip, 4=CamSau, 5=CamTruoc, 6=Khung, 7=FaceID, 8=IP68
-- =======================================================

INSERT INTO GiaTriThongSo (MaSP, MaThongSoMau, GiaTriHienThi, GiaTriNhap) VALUES
-- 1. iPhone 13 mini
(1, 1, '5.4 inch', '5.4'), (1, 2, 'Super Retina XDR OLED', 'OLED'), (1, 3, 'Apple A15 Bionic', 'A15'), (1, 4, '12 MP + 12 MP', '12'), (1, 5, '12 MP', '12'), (1, 6, 'Nhôm & Kính', 'Nhom'), (1, 7, 'Face ID', 'FaceID'), (1, 8, 'IP68', 'IP68'),

-- 2. iPhone 13
(2, 1, '6.1 inch', '6.1'), (2, 2, 'Super Retina XDR OLED', 'OLED'), (2, 3, 'Apple A15 Bionic', 'A15'), (2, 4, '12 MP + 12 MP', '12'), (2, 5, '12 MP', '12'), (2, 6, 'Nhôm & Kính', 'Nhom'), (2, 7, 'Face ID', 'FaceID'), (2, 8, 'IP68', 'IP68'),

-- 3. iPhone 13 Pro Max
(3, 1, '6.7 inch', '6.7'), (3, 2, 'Super Retina XDR ProMotion 120Hz', 'OLED 120Hz'), (3, 3, 'Apple A15 Bionic (5-core GPU)', 'A15'), (3, 4, '12 MP + 12 MP + 12 MP', '12'), (3, 5, '12 MP', '12'), (3, 6, 'Thép không gỉ', 'Thep'), (3, 7, 'Face ID', 'FaceID'), (3, 8, 'IP68', 'IP68'),

-- 4. iPhone 14 Plus
(4, 1, '6.7 inch', '6.7'), (4, 2, 'Super Retina XDR OLED', 'OLED'), (4, 3, 'Apple A15 Bionic (5-core GPU)', 'A15'), (4, 4, '12 MP + 12 MP', '12'), (4, 5, '12 MP Autofocus', '12'), (4, 6, 'Nhôm & Kính', 'Nhom'), (4, 7, 'Face ID', 'FaceID'), (4, 8, 'IP68', 'IP68'),

-- 5. iPhone 14 Pro
(5, 1, '6.1 inch', '6.1'), (5, 2, 'Dynamic Island, Always-On, 120Hz', 'OLED 120Hz'), (5, 3, 'Apple A16 Bionic', 'A16'), (5, 4, '48 MP + 12 MP + 12 MP', '48'), (5, 5, '12 MP Autofocus', '12'), (5, 6, 'Thép không gỉ', 'Thep'), (5, 7, 'Face ID', 'FaceID'), (5, 8, 'IP68', 'IP68'),

-- 6. iPhone 14 Pro Max
(6, 1, '6.7 inch', '6.7'), (6, 2, 'Dynamic Island, Always-On, 120Hz', 'OLED 120Hz'), (6, 3, 'Apple A16 Bionic', 'A16'), (6, 4, '48 MP + 12 MP + 12 MP', '48'), (6, 5, '12 MP Autofocus', '12'), (6, 6, 'Thép không gỉ', 'Thep'), (6, 7, 'Face ID', 'FaceID'), (6, 8, 'IP68', 'IP68'),

-- 7. iPhone 15
(7, 1, '6.1 inch', '6.1'), (7, 2, 'Dynamic Island, Super Retina XDR', 'OLED'), (7, 3, 'Apple A16 Bionic', 'A16'), (7, 4, '48 MP + 12 MP', '48'), (7, 5, '12 MP', '12'), (7, 6, 'Nhôm & Kính pha màu', 'Nhom'), (7, 7, 'Face ID', 'FaceID'), (7, 8, 'IP68', 'IP68'),

-- 8. iPhone 15 Pro
(8, 1, '6.1 inch', '6.1'), (8, 2, 'ProMotion 120Hz, Always-On', 'OLED 120Hz'), (8, 3, 'Apple A17 Pro', 'A17 Pro'), (8, 4, '48 MP + 12 MP + 12 MP', '48'), (8, 5, '12 MP', '12'), (8, 6, 'Titanium Grade 5', 'Titan'), (8, 7, 'Face ID', 'FaceID'), (8, 8, 'IP68', 'IP68'),

-- 9. iPhone 15 Pro Max
(9, 1, '6.7 inch', '6.7'), (9, 2, 'ProMotion 120Hz, Always-On', 'OLED 120Hz'), (9, 3, 'Apple A17 Pro', 'A17 Pro'), (9, 4, '48 MP + 12 MP (Periscope 5x) + 12 MP', '48'), (9, 5, '12 MP', '12'), (9, 6, 'Titanium Grade 5', 'Titan'), (9, 7, 'Face ID', 'FaceID'), (9, 8, 'IP68', 'IP68'),

-- 10. iPhone 16
(10, 1, '6.1 inch', '6.1'), (10, 2, 'Super Retina XDR, Camera Control', 'OLED'), (10, 3, 'Apple A18', 'A18'), (10, 4, '48 MP Fusion + 12 MP', '48'), (10, 5, '12 MP', '12'), (10, 6, 'Nhôm vũ trụ', 'Nhom'), (10, 7, 'Face ID', 'FaceID'), (10, 8, 'IP68', 'IP68'),

-- 11. iPhone 16 Pro
(11, 1, '6.3 inch', '6.3'), (11, 2, 'ProMotion 120Hz, Viền siêu mỏng', 'OLED 120Hz'), (11, 3, 'Apple A18 Pro', 'A18 Pro'), (11, 4, '48 MP Fusion + 48 MP Ultra Wide', '48'), (11, 5, '12 MP', '12'), (11, 6, 'Titanium Grade 5 (Phun cát)', 'Titan'), (11, 7, 'Face ID', 'FaceID'), (11, 8, 'IP68', 'IP68'),

-- 12. iPhone 16 Pro Max
(12, 1, '6.9 inch', '6.9'), (12, 2, 'ProMotion 120Hz, Viền siêu mỏng', 'OLED 120Hz'), (12, 3, 'Apple A18 Pro', 'A18 Pro'), (12, 4, '48 MP Fusion + 48 MP Ultra Wide', '48'), (12, 5, '12 MP', '12'), (12, 6, 'Titanium Grade 5 (Phun cát)', 'Titan'), (12, 7, 'Face ID', 'FaceID'), (12, 8, 'IP68', 'IP68'),

-- 13. iPhone 17 Air (Dự đoán)
(13, 1, '6.6 inch', '6.6'), (13, 2, 'OLED 120Hz Slim', 'OLED 120Hz'), (13, 3, 'Apple A19', 'A19'), (13, 4, '48 MP Single', '48'), (13, 5, '24 MP', '24'), (13, 6, 'Nhôm tái chế siêu nhẹ', 'Nhom'), (13, 7, 'Face ID', 'FaceID'), (13, 8, 'IP68', 'IP68'),

-- 14. iPhone 17 Pro (Dự đoán)
(14, 1, '6.3 inch', '6.3'), (14, 2, 'ProMotion 120Hz, Under-display FaceID', 'OLED 120Hz'), (14, 3, 'Apple A19 Pro (2nm)', 'A19 Pro'), (14, 4, '48 MP Triple Camera', '48'), (14, 5, '24 MP', '24'), (14, 6, 'Titanium', 'Titan'), (14, 7, 'Face ID ẩn', 'FaceID'), (14, 8, 'IP68', 'IP68'),

-- 15. iPhone 17 Pro Max (Dự đoán)
(15, 1, '6.9 inch', '6.9'), (15, 2, 'ProMotion 120Hz, Under-display FaceID', 'OLED 120Hz'), (15, 3, 'Apple A19 Pro (2nm)', 'A19 Pro'), (15, 4, '48 MP Triple Camera', '48'), (15, 5, '24 MP', '24'), (15, 6, 'Titanium', 'Titan'), (15, 7, 'Face ID ẩn', 'FaceID'), (15, 8, 'IP68', 'IP68');


-- =======================================================
-- PHẦN 2: IPAD (MaSP 16 -> 23)
-- Thông số: 9=Chip, 10=Màn, 11=CN Màn, 12=Bút, 13=Phím, 14=Cổng, 15=CamSau
-- =======================================================

INSERT INTO GiaTriThongSo (MaSP, MaThongSoMau, GiaTriHienThi, GiaTriNhap) VALUES
-- 16. iPad mini 6
(16, 9, 'Apple A15 Bionic', 'A15'), (16, 10, '8.3 inch', '8.3'), (16, 11, 'Liquid Retina IPS', 'IPS'), (16, 12, 'Apple Pencil 2', 'Pencil 2'), (16, 13, 'Bluetooth Keyboards', 'Bluetooth'), (16, 14, 'USB-C', 'USB-C'), (16, 15, '12 MP', '12'),

-- 17. iPad Gen 9
(17, 9, 'Apple A13 Bionic', 'A13'), (17, 10, '10.2 inch', '10.2'), (17, 11, 'Retina IPS', 'IPS'), (17, 12, 'Apple Pencil 1', 'Pencil 1'), (17, 13, 'Smart Keyboard', 'Smart Keyboard'), (17, 14, 'Lightning', 'Lightning'), (17, 15, '8 MP', '8'),

-- 18. iPad Air 5 M1
(18, 9, 'Apple M1', 'M1'), (18, 10, '10.9 inch', '10.9'), (18, 11, 'Liquid Retina IPS', 'IPS'), (18, 12, 'Apple Pencil 2', 'Pencil 2'), (18, 13, 'Magic Keyboard', 'Magic Keyboard'), (18, 14, 'USB-C', 'USB-C'), (18, 15, '12 MP', '12'),

-- 19. iPad Gen 10
(19, 9, 'Apple A14 Bionic', 'A14'), (19, 10, '10.9 inch', '10.9'), (19, 11, 'Liquid Retina IPS', 'IPS'), (19, 12, 'Apple Pencil (USB-C)', 'Pencil USB-C'), (19, 13, 'Magic Keyboard Folio', 'Folio'), (19, 14, 'USB-C', 'USB-C'), (19, 15, '12 MP', '12'),

-- 20. iPad Pro 12.9 M2
(20, 9, 'Apple M2', 'M2'), (20, 10, '12.9 inch', '12.9'), (20, 11, 'Liquid Retina XDR (Mini-LED)', 'Mini-LED'), (20, 12, 'Apple Pencil 2 (Hover)', 'Pencil 2'), (20, 13, 'Magic Keyboard', 'Magic Keyboard'), (20, 14, 'Thunderbolt / USB 4', 'Thunderbolt'), (20, 15, '12 MP + 10 MP Ultra Wide', '12'),

-- 21. iPad Air 13 M2
(21, 9, 'Apple M2', 'M2'), (21, 10, '13 inch', '13'), (21, 11, 'Liquid Retina IPS', 'IPS'), (21, 12, 'Apple Pencil Pro', 'Pencil Pro'), (21, 13, 'Magic Keyboard', 'Magic Keyboard'), (21, 14, 'USB-C', 'USB-C'), (21, 15, '12 MP', '12'),

-- 22. iPad Pro 13 M4
(22, 9, 'Apple M4 (9-core/10-core)', 'M4'), (22, 10, '13 inch', '13'), (22, 11, 'Ultra Retina XDR (Tandem OLED)', 'OLED'), (22, 12, 'Apple Pencil Pro', 'Pencil Pro'), (22, 13, 'Magic Keyboard for iPad Pro M4', 'Magic M4'), (22, 14, 'Thunderbolt / USB 4', 'Thunderbolt'), (22, 15, '12 MP (LiDAR)', '12'),

-- 23. iPad mini 7
(23, 9, 'Apple A17 Pro', 'A17 Pro'), (23, 10, '8.3 inch', '8.3'), (23, 11, 'Liquid Retina IPS', 'IPS'), (23, 12, 'Apple Pencil Pro', 'Pencil Pro'), (23, 13, 'Bluetooth Keyboards', 'Bluetooth'), (23, 14, 'USB-C (10Gbps)', 'USB-C'), (23, 15, '12 MP Smart HDR 4', '12');


-- =======================================================
-- PHẦN 3: MACBOOK (MaSP 24 -> 30)
-- Thông số: 16=Chip, 17=Core, 18=RAM, 19=SSD, 20=Màn, 21=Pin, 22=Cổng, 23=Nặng
-- =======================================================

INSERT INTO GiaTriThongSo (MaSP, MaThongSoMau, GiaTriHienThi, GiaTriNhap) VALUES
-- 24. MacBook Air M1
(24, 16, 'Apple M1', 'M1'), (24, 17, '8-core CPU, 7-core GPU', '15'), (24, 18, '8GB / 16GB', '8'), (24, 19, '256GB / 512GB', '0.256'), (24, 20, '13.3 inch Retina', '13.3'), (24, 21, '18 giờ', '18'), (24, 22, '2x Thunderbolt / USB 4', 'Thunderbolt'), (24, 23, '1.29 kg', '1.29'),

-- 25. MacBook Air M2
(25, 16, 'Apple M2', 'M2'), (25, 17, '8-core CPU, 8/10-core GPU', '18'), (25, 18, '8GB / 16GB / 24GB', '8'), (25, 19, '256GB -> 2TB', '0.256'), (25, 20, '13.6 inch Liquid Retina', '13.6'), (25, 21, '18 giờ', '18'), (25, 22, 'MagSafe 3, 2x Thunderbolt', 'MagSafe'), (25, 23, '1.24 kg', '1.24'),

-- 26. MacBook Pro 14 M2
(26, 16, 'Apple M2 Pro / M2 Max', 'M2 Pro'), (26, 17, '10/12-core CPU, 16-30 core GPU', '42'), (26, 18, '16GB -> 96GB', '16'), (26, 19, '512GB -> 8TB', '0.512'), (26, 20, '14.2 inch Liquid Retina XDR', '14.2'), (26, 21, '18 giờ', '18'), (26, 22, 'HDMI, SDXC, MagSafe, 3x TB4', 'Thunderbolt'), (26, 23, '1.6 kg', '1.6'),

-- 27. MacBook Pro 16 M3
(27, 16, 'Apple M3 Pro / M3 Max', 'M3 Max'), (27, 17, '14/16-core CPU, 30/40 core GPU', '56'), (27, 18, '18GB -> 128GB', '18'), (27, 19, '512GB -> 8TB', '0.512'), (27, 20, '16.2 inch Liquid Retina XDR', '16.2'), (27, 21, '22 giờ', '22'), (27, 22, 'HDMI, SDXC, MagSafe, 3x TB4', 'Thunderbolt'), (27, 23, '2.14 kg', '2.14'),

-- 28. MacBook Air 15 M3
(28, 16, 'Apple M3', 'M3'), (28, 17, '8-core CPU, 10-core GPU', '18'), (28, 18, '8GB / 16GB / 24GB', '8'), (28, 19, '256GB -> 2TB', '0.256'), (28, 20, '15.3 inch Liquid Retina', '15.3'), (28, 21, '18 giờ', '18'), (28, 22, 'MagSafe 3, 2x Thunderbolt', 'MagSafe'), (28, 23, '1.51 kg', '1.51'),

-- 29. MacBook Pro 14 M4
(29, 16, 'Apple M4 / M4 Pro / M4 Max', 'M4'), (29, 17, '10-core CPU, 10-core GPU', '20'), (29, 18, '16GB -> 32GB', '16'), (29, 19, '512GB -> 2TB', '0.512'), (29, 20, '14.2 inch Liquid Retina XDR (Nano)', '14.2'), (29, 21, '24 giờ', '24'), (29, 22, '3x Thunderbolt 4/5', 'Thunderbolt'), (29, 23, '1.55 kg', '1.55'),

-- 30. MacBook Pro 16 M4
(30, 16, 'Apple M4 Pro / M4 Max', 'M4 Max'), (30, 17, '16-core CPU, 40-core GPU', '56'), (30, 18, '24GB -> 128GB', '24'), (30, 19, '512GB -> 8TB', '0.512'), (30, 20, '16.2 inch Liquid Retina XDR (Nano)', '16.2'), (30, 21, '24 giờ', '24'), (30, 22, '3x Thunderbolt 5, HDMI, MagSafe', 'Thunderbolt'), (30, 23, '2.14 kg', '2.14');


-- =======================================================
-- PHẦN 4: AIRPODS (MaSP 31 -> 35)
-- Thông số: 24=Chip, 25=Pin, 26=ANC, 27=Tech, 28=Cổng, 29=Nước
-- =======================================================

INSERT INTO GiaTriThongSo (MaSP, MaThongSoMau, GiaTriHienThi, GiaTriNhap) VALUES
-- 31. AirPods 3
(31, 24, 'Apple H1', 'H1'), (31, 25, '6 giờ (30h hộp sạc)', '6'), (31, 26, 'Không', '0'), (31, 27, 'Spatial Audio', 'Spatial'), (31, 28, 'Lightning / MagSafe', 'Lightning'), (31, 29, 'IPX4', 'IPX4'),

-- 32. AirPods Pro 2
(32, 24, 'Apple H2', 'H2'), (32, 25, '6 giờ (30h hộp sạc)', '6'), (32, 26, 'Có (Chủ động khử ồn 2x)', '1'), (32, 27, 'Adaptive Audio, Conversation Awareness', 'Adaptive'), (32, 28, 'USB-C / MagSafe', 'USB-C'), (32, 29, 'IP54', 'IP54'),

-- 33. AirPods 4
(33, 24, 'Apple H2', 'H2'), (33, 25, '5 giờ (30h hộp sạc)', '5'), (33, 26, 'Không', '0'), (33, 27, 'Spatial Audio, Voice Isolation', 'Spatial'), (33, 28, 'USB-C', 'USB-C'), (33, 29, 'IP54', 'IP54'),

-- 34. AirPods 4 ANC
(34, 24, 'Apple H2', 'H2'), (34, 25, '4 giờ (ANC on) / 20h hộp', '4'), (34, 26, 'Có (Chủ động khử ồn)', '1'), (34, 27, 'Adaptive Audio, Transparency', 'Adaptive'), (34, 28, 'USB-C / Sạc không dây', 'USB-C'), (34, 29, 'IP54', 'IP54'),

-- 35. AirPods Max 2024
(35, 24, 'Apple H1 (mỗi bên)', 'H1'), (35, 25, '20 giờ', '20'), (35, 26, 'Có (Chống ồn chủ động)', '1'), (35, 27, 'Spatial Audio', 'Spatial'), (35, 28, 'USB-C', 'USB-C'), (35, 29, 'Không', '0');


-- =======================================================
-- PHẦN 5: PHỤ KIỆN (MaSP 36 -> 52)
-- Thông số: 30=Loại, 31=Compat, 32=Chất liệu, 33=Cổng, 34=Watt, 35=Dài
-- =======================================================

INSERT INTO GiaTriThongSo (MaSP, MaThongSoMau, GiaTriHienThi, GiaTriNhap) VALUES
-- 36. Sport Band
(36, 30, 'Dây đeo Apple Watch', 'Band'), (36, 31, 'Mọi Apple Watch', 'Watch'), (36, 32, 'Fluoroelastomer', 'CaoSu'), (36, 33, 'N/A', '0'), (36, 34, 'N/A', '0'), (36, 35, 'S/M hoặc M/L', '0'),

-- 37. Milanese Loop
(37, 30, 'Dây đeo Apple Watch', 'Band'), (37, 31, 'Mọi Apple Watch', 'Watch'), (37, 32, 'Thép không gỉ', 'Thep'), (37, 33, 'N/A', '0'), (37, 34, 'N/A', '0'), (37, 35, 'Freesize (Nam châm)', '0'),

-- 38. Alpine Loop
(38, 30, 'Dây đeo Apple Watch Ultra', 'Band'), (38, 31, '44mm, 45mm, 49mm', 'Watch Ultra'), (38, 32, 'Polyester hai lớp', 'Vai'), (38, 33, 'Móc khóa G-Titan', 'Titan'), (38, 34, 'N/A', '0'), (38, 35, 'S, M, L', '0'),

-- 39. Ocean Band
(39, 30, 'Dây đeo Apple Watch Ultra', 'Band'), (39, 31, '44mm, 45mm, 49mm', 'Watch Ultra'), (39, 32, 'Elastomer hiệu suất cao', 'CaoSu'), (39, 33, 'Khóa Titan', 'Titan'), (39, 34, 'N/A', '0'), (39, 35, 'Freesize', '0'),

-- 40. Silicone Case MagSafe
(40, 30, 'Ốp lưng (Case)', 'Case'), (40, 31, 'iPhone Series', 'iPhone'), (40, 32, 'Silicone', 'Silicone'), (40, 33, 'MagSafe', 'MagSafe'), (40, 34, 'N/A', '0'), (40, 35, 'N/A', '0'),

-- 41. Clear Case MagSafe
(41, 30, 'Ốp lưng (Case)', 'Case'), (41, 31, 'iPhone Series', 'iPhone'), (41, 32, 'Polycarbonate trong suốt', 'Nhua'), (41, 33, 'MagSafe', 'MagSafe'), (41, 34, 'N/A', '0'), (41, 35, 'N/A', '0'),

-- 42. Smart Folio iPad
(42, 30, 'Bao da (Folio)', 'Case'), (42, 31, 'iPad Air, iPad Pro', 'iPad'), (42, 32, 'Polyurethane', 'Da'), (42, 33, 'Nam châm hít', 'Magnet'), (42, 34, 'N/A', '0'), (42, 35, 'N/A', '0'),

-- 43. Magic Keyboard iPad
(43, 30, 'Bàn phím kiêm ốp', 'Keyboard'), (43, 31, 'iPad Pro, iPad Air', 'iPad'), (43, 32, 'Nhựa & Phím cắt kéo', 'Nhua'), (43, 33, 'Smart Connector', 'Smart'), (43, 34, 'N/A', '0'), (43, 35, 'N/A', '0'),

-- 44. 20W USB-C Adapter
(44, 30, 'Củ sạc (Adapter)', 'Adapter'), (44, 31, 'iPhone, iPad', 'Universal'), (44, 32, 'Nhựa', 'Nhua'), (44, 33, 'USB-C', 'USB-C'), (44, 34, '20 W', '20'), (44, 35, 'N/A', '0'),

-- 45. 35W Dual USB-C
(45, 30, 'Củ sạc (Adapter)', 'Adapter'), (45, 31, 'iPhone, iPad, MacBook Air', 'Universal'), (45, 32, 'Nhựa', 'Nhua'), (45, 33, '2x USB-C', 'USB-C'), (45, 34, '35 W', '35'), (45, 35, 'N/A', '0'),

-- 46. 70W USB-C Adapter
(46, 30, 'Củ sạc (Adapter)', 'Adapter'), (46, 31, 'MacBook Pro/Air', 'MacBook'), (46, 32, 'Nhựa', 'Nhua'), (46, 33, 'USB-C', 'USB-C'), (46, 34, '70 W', '70'), (46, 35, 'N/A', '0'),

-- 47. MagSafe Charger
(47, 30, 'Sạc không dây', 'Wireless'), (47, 31, 'iPhone 12 trở lên', 'iPhone'), (47, 32, 'Nhôm & Nhựa', 'Nhom'), (47, 33, 'USB-C (đầu vào)', 'USB-C'), (47, 34, '15 W', '15'), (47, 35, '1 m', '1'),

-- 48. Cáp sạc USB-C 60W
(48, 30, 'Cáp sạc', 'Cable'), (48, 31, 'iPhone 15/16, iPad, Mac', 'Universal'), (48, 32, 'Dù (Woven)', 'Du'), (48, 33, 'USB-C to USB-C', 'USB-C'), (48, 34, '60 W', '60'), (48, 35, '1 m', '1'),

-- 49. Cáp MagSafe 3
(49, 30, 'Cáp sạc MacBook', 'Cable'), (49, 31, 'MacBook Pro/Air M1-M4', 'MacBook'), (49, 32, 'Dù (Woven)', 'Du'), (49, 33, 'USB-C to MagSafe 3', 'MagSafe'), (49, 34, '140 W (Max)', '140'), (49, 35, '2 m', '2'),

-- 50. Cáp Thunderbolt 4 Pro
(50, 30, 'Cáp truyền dữ liệu', 'Cable'), (50, 31, 'Mac, iPad Pro, Display', 'Pro'), (50, 32, 'Dù đen (Braided)', 'Du'), (50, 33, 'USB-C (Thunderbolt)', 'Thunderbolt'), (50, 34, '100 W', '100'), (50, 35, '1.8 m', '1.8'),

-- 51. Apple Pencil Pro
(51, 30, 'Bút cảm ứng', 'Stylus'), (51, 31, 'iPad Pro M4, Air M2', 'iPad'), (51, 32, 'Nhựa nhám', 'Nhua'), (51, 33, 'Sạc từ tính', 'Wireless'), (51, 34, 'N/A', '0'), (51, 35, '166 mm', '0.166'),

-- 52. AirTag
(52, 30, 'Thiết bị định vị', 'Tracker'), (52, 31, 'iPhone (Find My)', 'iPhone'), (52, 32, 'Thép & Nhựa', 'Thep'), (52, 33, 'Pin CR2032', 'Battery'), (52, 34, '1 năm (Pin)', '1'), (52, 35, 'N/A', '0');