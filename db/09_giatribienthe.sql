-- =================================================================================
-- BƯỚC 3: INSERT DỮ LIỆU BẢNG GIATRIBIENTHE (IPHONE - IPAD - MACBOOK)
-- Mapping Thuộc tính: 
-- iPhone: 1=Màu sắc, 2=Dung lượng
-- iPad: 3=Màu sắc, 4=Kết nối, 5=Dung lượng
-- MacBook: 6=RAM, 7=SSD, 8=Màu sắc
-- =================================================================================

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE GiaTriBienThe; 
SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------------------------
-- NHÓM 1: IPHONE (MaSP 1 -> 15)
-- ---------------------------------------------------------------------------------

-- [MaSP 1] iPhone 13 mini (ID 1-10)
INSERT INTO GiaTriBienThe (MaBienThe, MaThongSoBienTheMau, GiaTriHienThi, GiaTriNhap, ThuTuHienThi) VALUES
(1, 1, 'Hồng', 'Pink', 1), (1, 2, '128 GB', '128', 2),
(2, 1, 'Xanh Dương', 'Blue', 1), (2, 2, '128 GB', '128', 2),
(3, 1, 'Đen Midnight', 'Midnight', 1), (3, 2, '128 GB', '128', 2),
(4, 1, 'Trắng Starlight', 'Starlight', 1), (4, 2, '128 GB', '128', 2),
(5, 1, 'Xanh Lá', 'Green', 1), (5, 2, '128 GB', '128', 2),
(6, 1, 'Hồng', 'Pink', 1), (6, 2, '256 GB', '256', 2),
(7, 1, 'Xanh Dương', 'Blue', 1), (7, 2, '256 GB', '256', 2),
(8, 1, 'Đen Midnight', 'Midnight', 1), (8, 2, '256 GB', '256', 2),
(9, 1, 'Trắng Starlight', 'Starlight', 1), (9, 2, '256 GB', '256', 2),
(10, 1, 'Xanh Lá', 'Green', 1), (10, 2, '256 GB', '256', 2);

-- [MaSP 2] iPhone 13 (ID 11-20)
INSERT INTO GiaTriBienThe (MaBienThe, MaThongSoBienTheMau, GiaTriHienThi, GiaTriNhap, ThuTuHienThi) VALUES
(11, 1, 'Hồng', 'Pink', 1), (11, 2, '128 GB', '128', 2),
(12, 1, 'Xanh Dương', 'Blue', 1), (12, 2, '128 GB', '128', 2),
(13, 1, 'Đen Midnight', 'Midnight', 1), (13, 2, '128 GB', '128', 2),
(14, 1, 'Trắng Starlight', 'Starlight', 1), (14, 2, '128 GB', '128', 2),
(15, 1, 'Xanh Lá', 'Green', 1), (15, 2, '128 GB', '128', 2),
(16, 1, 'Hồng', 'Pink', 1), (16, 2, '256 GB', '256', 2),
(17, 1, 'Xanh Dương', 'Blue', 1), (17, 2, '256 GB', '256', 2),
(18, 1, 'Đen Midnight', 'Midnight', 1), (18, 2, '256 GB', '256', 2),
(19, 1, 'Trắng Starlight', 'Starlight', 1), (19, 2, '256 GB', '256', 2),
(20, 1, 'Xanh Lá', 'Green', 1), (20, 2, '256 GB', '256', 2);

-- [MaSP 3] iPhone 13 Pro Max (ID 21-35)
INSERT INTO GiaTriBienThe (MaBienThe, MaThongSoBienTheMau, GiaTriHienThi, GiaTriNhap, ThuTuHienThi) VALUES
(21, 1, 'Xanh Sierra', 'Sierra Blue', 1), (21, 2, '128 GB', '128', 2),
(22, 1, 'Xanh Lá Alpine', 'Alpine Green', 1), (22, 2, '128 GB', '128', 2),
(23, 1, 'Vàng Gold', 'Gold', 1), (23, 2, '128 GB', '128', 2),
(24, 1, 'Xám Graphite', 'Graphite', 1), (24, 2, '128 GB', '128', 2),
(25, 1, 'Bạc Silver', 'Silver', 1), (25, 2, '128 GB', '128', 2),
(26, 1, 'Xanh Sierra', 'Sierra Blue', 1), (26, 2, '256 GB', '256', 2),
(27, 1, 'Xanh Lá Alpine', 'Alpine Green', 1), (27, 2, '256 GB', '256', 2),
(28, 1, 'Vàng Gold', 'Gold', 1), (28, 2, '256 GB', '256', 2),
(29, 1, 'Xám Graphite', 'Graphite', 1), (29, 2, '256 GB', '256', 2),
(30, 1, 'Bạc Silver', 'Silver', 1), (30, 2, '256 GB', '256', 2),
(31, 1, 'Xanh Sierra', 'Sierra Blue', 1), (31, 2, '512 GB', '512', 2),
(32, 1, 'Xanh Lá Alpine', 'Alpine Green', 1), (32, 2, '512 GB', '512', 2),
(33, 1, 'Vàng Gold', 'Gold', 1), (33, 2, '512 GB', '512', 2),
(34, 1, 'Xám Graphite', 'Graphite', 1), (34, 2, '512 GB', '512', 2),
(35, 1, 'Bạc Silver', 'Silver', 1), (35, 2, '512 GB', '512', 2);

-- [MaSP 4] iPhone 14 Plus (ID 36-50)
INSERT INTO GiaTriBienThe (MaBienThe, MaThongSoBienTheMau, GiaTriHienThi, GiaTriNhap, ThuTuHienThi) VALUES
(36, 1, 'Tím', 'Purple', 1), (36, 2, '128 GB', '128', 2),
(37, 1, 'Vàng', 'Yellow', 1), (37, 2, '128 GB', '128', 2),
(38, 1, 'Xanh Dương', 'Blue', 1), (38, 2, '128 GB', '128', 2),
(39, 1, 'Đen Midnight', 'Midnight', 1), (39, 2, '128 GB', '128', 2),
(40, 1, 'Trắng Starlight', 'Starlight', 1), (40, 2, '128 GB', '128', 2),
(41, 1, 'Tím', 'Purple', 1), (41, 2, '256 GB', '256', 2),
(42, 1, 'Vàng', 'Yellow', 1), (42, 2, '256 GB', '256', 2),
(43, 1, 'Xanh Dương', 'Blue', 1), (43, 2, '256 GB', '256', 2),
(44, 1, 'Đen Midnight', 'Midnight', 1), (44, 2, '256 GB', '256', 2),
(45, 1, 'Trắng Starlight', 'Starlight', 1), (45, 2, '256 GB', '256', 2),
(46, 1, 'Tím', 'Purple', 1), (46, 2, '512 GB', '512', 2),
(47, 1, 'Vàng', 'Yellow', 1), (47, 2, '512 GB', '512', 2),
(48, 1, 'Xanh Dương', 'Blue', 1), (48, 2, '512 GB', '512', 2),
(49, 1, 'Đen Midnight', 'Midnight', 1), (49, 2, '512 GB', '512', 2),
(50, 1, 'Trắng Starlight', 'Starlight', 1), (50, 2, '512 GB', '512', 2);

-- [MaSP 5] iPhone 14 Pro (ID 51-66)
INSERT INTO GiaTriBienThe (MaBienThe, MaThongSoBienTheMau, GiaTriHienThi, GiaTriNhap, ThuTuHienThi) VALUES
(51, 1, 'Tím Deep Purple', 'Deep Purple', 1), (51, 2, '128 GB', '128', 2),
(52, 1, 'Đen Space Black', 'Space Black', 1), (52, 2, '128 GB', '128', 2),
(53, 1, 'Vàng Gold', 'Gold', 1), (53, 2, '128 GB', '128', 2),
(54, 1, 'Bạc Silver', 'Silver', 1), (54, 2, '128 GB', '128', 2),
(55, 1, 'Tím Deep Purple', 'Deep Purple', 1), (55, 2, '256 GB', '256', 2),
(56, 1, 'Đen Space Black', 'Space Black', 1), (56, 2, '256 GB', '256', 2),
(57, 1, 'Vàng Gold', 'Gold', 1), (57, 2, '256 GB', '256', 2),
(58, 1, 'Bạc Silver', 'Silver', 1), (58, 2, '256 GB', '256', 2),
(59, 1, 'Tím Deep Purple', 'Deep Purple', 1), (59, 2, '512 GB', '512', 2),
(60, 1, 'Đen Space Black', 'Space Black', 1), (60, 2, '512 GB', '512', 2),
(61, 1, 'Vàng Gold', 'Gold', 1), (61, 2, '512 GB', '512', 2),
(62, 1, 'Bạc Silver', 'Silver', 1), (62, 2, '512 GB', '512', 2),
(63, 1, 'Tím Deep Purple', 'Deep Purple', 1), (63, 2, '1 TB', '1024', 2),
(64, 1, 'Đen Space Black', 'Space Black', 1), (64, 2, '1 TB', '1024', 2),
(65, 1, 'Vàng Gold', 'Gold', 1), (65, 2, '1 TB', '1024', 2),
(66, 1, 'Bạc Silver', 'Silver', 1), (66, 2, '1 TB', '1024', 2);

-- [MaSP 6] iPhone 14 Pro Max (ID 67-82)
INSERT INTO GiaTriBienThe (MaBienThe, MaThongSoBienTheMau, GiaTriHienThi, GiaTriNhap, ThuTuHienThi) VALUES
(67, 1, 'Tím Deep Purple', 'Deep Purple', 1), (67, 2, '128 GB', '128', 2),
(68, 1, 'Đen Space Black', 'Space Black', 1), (68, 2, '128 GB', '128', 2),
(69, 1, 'Vàng Gold', 'Gold', 1), (69, 2, '128 GB', '128', 2),
(70, 1, 'Bạc Silver', 'Silver', 1), (70, 2, '128 GB', '128', 2),
(71, 1, 'Tím Deep Purple', 'Deep Purple', 1), (71, 2, '256 GB', '256', 2),
(72, 1, 'Đen Space Black', 'Space Black', 1), (72, 2, '256 GB', '256', 2),
(73, 1, 'Vàng Gold', 'Gold', 1), (73, 2, '256 GB', '256', 2),
(74, 1, 'Bạc Silver', 'Silver', 1), (74, 2, '256 GB', '256', 2),
(75, 1, 'Tím Deep Purple', 'Deep Purple', 1), (75, 2, '512 GB', '512', 2),
(76, 1, 'Đen Space Black', 'Space Black', 1), (76, 2, '512 GB', '512', 2),
(77, 1, 'Vàng Gold', 'Gold', 1), (77, 2, '512 GB', '512', 2),
(78, 1, 'Bạc Silver', 'Silver', 1), (78, 2, '512 GB', '512', 2),
(79, 1, 'Tím Deep Purple', 'Deep Purple', 1), (79, 2, '1 TB', '1024', 2),
(80, 1, 'Đen Space Black', 'Space Black', 1), (80, 2, '1 TB', '1024', 2),
(81, 1, 'Vàng Gold', 'Gold', 1), (81, 2, '1 TB', '1024', 2),
(82, 1, 'Bạc Silver', 'Silver', 1), (82, 2, '1 TB', '1024', 2);

-- [MaSP 7] iPhone 15 (ID 83-97)
INSERT INTO GiaTriBienThe (MaBienThe, MaThongSoBienTheMau, GiaTriHienThi, GiaTriNhap, ThuTuHienThi) VALUES
(83, 1, 'Hồng', 'Pink', 1), (83, 2, '128 GB', '128', 2),
(84, 1, 'Xanh Lá', 'Green', 1), (84, 2, '128 GB', '128', 2),
(85, 1, 'Xanh Dương', 'Blue', 1), (85, 2, '128 GB', '128', 2),
(86, 1, 'Vàng', 'Yellow', 1), (86, 2, '128 GB', '128', 2),
(87, 1, 'Đen', 'Black', 1), (87, 2, '128 GB', '128', 2),
(88, 1, 'Hồng', 'Pink', 1), (88, 2, '256 GB', '256', 2),
(89, 1, 'Xanh Lá', 'Green', 1), (89, 2, '256 GB', '256', 2),
(90, 1, 'Xanh Dương', 'Blue', 1), (90, 2, '256 GB', '256', 2),
(91, 1, 'Vàng', 'Yellow', 1), (91, 2, '256 GB', '256', 2),
(92, 1, 'Đen', 'Black', 1), (92, 2, '256 GB', '256', 2),
(93, 1, 'Hồng', 'Pink', 1), (93, 2, '512 GB', '512', 2),
(94, 1, 'Xanh Lá', 'Green', 1), (94, 2, '512 GB', '512', 2),
(95, 1, 'Xanh Dương', 'Blue', 1), (95, 2, '512 GB', '512', 2),
(96, 1, 'Vàng', 'Yellow', 1), (96, 2, '512 GB', '512', 2),
(97, 1, 'Đen', 'Black', 1), (97, 2, '512 GB', '512', 2);

-- [MaSP 8] iPhone 15 Pro (ID 98-113)
INSERT INTO GiaTriBienThe (MaBienThe, MaThongSoBienTheMau, GiaTriHienThi, GiaTriNhap, ThuTuHienThi) VALUES
(98, 1, 'Titan Tự Nhiên', 'Natural Titanium', 1), (98, 2, '128 GB', '128', 2),
(99, 1, 'Titan Xanh', 'Blue Titanium', 1), (99, 2, '128 GB', '128', 2),
(100, 1, 'Titan Trắng', 'White Titanium', 1), (100, 2, '128 GB', '128', 2),
(101, 1, 'Titan Đen', 'Black Titanium', 1), (101, 2, '128 GB', '128', 2),
(102, 1, 'Titan Tự Nhiên', 'Natural Titanium', 1), (102, 2, '256 GB', '256', 2),
(103, 1, 'Titan Xanh', 'Blue Titanium', 1), (103, 2, '256 GB', '256', 2),
(104, 1, 'Titan Trắng', 'White Titanium', 1), (104, 2, '256 GB', '256', 2),
(105, 1, 'Titan Đen', 'Black Titanium', 1), (105, 2, '256 GB', '256', 2),
(106, 1, 'Titan Tự Nhiên', 'Natural Titanium', 1), (106, 2, '512 GB', '512', 2),
(107, 1, 'Titan Xanh', 'Blue Titanium', 1), (107, 2, '512 GB', '512', 2),
(108, 1, 'Titan Trắng', 'White Titanium', 1), (108, 2, '512 GB', '512', 2),
(109, 1, 'Titan Đen', 'Black Titanium', 1), (109, 2, '512 GB', '512', 2),
(110, 1, 'Titan Tự Nhiên', 'Natural Titanium', 1), (110, 2, '1 TB', '1024', 2),
(111, 1, 'Titan Xanh', 'Blue Titanium', 1), (111, 2, '1 TB', '1024', 2),
(112, 1, 'Titan Trắng', 'White Titanium', 1), (112, 2, '1 TB', '1024', 2),
(113, 1, 'Titan Đen', 'Black Titanium', 1), (113, 2, '1 TB', '1024', 2);

-- [MaSP 9] iPhone 15 Pro Max (ID 114-125)
INSERT INTO GiaTriBienThe (MaBienThe, MaThongSoBienTheMau, GiaTriHienThi, GiaTriNhap, ThuTuHienThi) VALUES
(114, 1, 'Titan Tự Nhiên', 'Natural Titanium', 1), (114, 2, '256 GB', '256', 2),
(115, 1, 'Titan Xanh', 'Blue Titanium', 1), (115, 2, '256 GB', '256', 2),
(116, 1, 'Titan Trắng', 'White Titanium', 1), (116, 2, '256 GB', '256', 2),
(117, 1, 'Titan Đen', 'Black Titanium', 1), (117, 2, '256 GB', '256', 2),
(118, 1, 'Titan Tự Nhiên', 'Natural Titanium', 1), (118, 2, '512 GB', '512', 2),
(119, 1, 'Titan Xanh', 'Blue Titanium', 1), (119, 2, '512 GB', '512', 2),
(120, 1, 'Titan Trắng', 'White Titanium', 1), (120, 2, '512 GB', '512', 2),
(121, 1, 'Titan Đen', 'Black Titanium', 1), (121, 2, '512 GB', '512', 2),
(122, 1, 'Titan Tự Nhiên', 'Natural Titanium', 1), (122, 2, '1 TB', '1024', 2),
(123, 1, 'Titan Xanh', 'Blue Titanium', 1), (123, 2, '1 TB', '1024', 2),
(124, 1, 'Titan Trắng', 'White Titanium', 1), (124, 2, '1 TB', '1024', 2),
(125, 1, 'Titan Đen', 'Black Titanium', 1), (125, 2, '1 TB', '1024', 2);

-- [MaSP 10] iPhone 16 (ID 126-135)
INSERT INTO GiaTriBienThe (MaBienThe, MaThongSoBienTheMau, GiaTriHienThi, GiaTriNhap, ThuTuHienThi) VALUES
(126, 1, 'Xanh Lưu Ly', 'Ultramarine', 1), (126, 2, '128 GB', '128', 2),
(127, 1, 'Xanh Mòng Két', 'Teal', 1), (127, 2, '128 GB', '128', 2),
(128, 1, 'Hồng', 'Pink', 1), (128, 2, '128 GB', '128', 2),
(129, 1, 'Trắng', 'White', 1), (129, 2, '128 GB', '128', 2),
(130, 1, 'Đen', 'Black', 1), (130, 2, '128 GB', '128', 2),
(131, 1, 'Xanh Lưu Ly', 'Ultramarine', 1), (131, 2, '256 GB', '256', 2),
(132, 1, 'Xanh Mòng Két', 'Teal', 1), (132, 2, '256 GB', '256', 2),
(133, 1, 'Hồng', 'Pink', 1), (133, 2, '256 GB', '256', 2),
(134, 1, 'Trắng', 'White', 1), (134, 2, '256 GB', '256', 2),
(135, 1, 'Đen', 'Black', 1), (135, 2, '256 GB', '256', 2);

-- [MaSP 11] iPhone 16 Pro (ID 136-147)
INSERT INTO GiaTriBienThe (MaBienThe, MaThongSoBienTheMau, GiaTriHienThi, GiaTriNhap, ThuTuHienThi) VALUES
(136, 1, 'Titan Sa Mạc', 'Desert Titanium', 1), (136, 2, '128 GB', '128', 2),
(137, 1, 'Titan Tự Nhiên', 'Natural Titanium', 1), (137, 2, '128 GB', '128', 2),
(138, 1, 'Titan Trắng', 'White Titanium', 1), (138, 2, '128 GB', '128', 2),
(139, 1, 'Titan Đen', 'Black Titanium', 1), (139, 2, '128 GB', '128', 2),
(140, 1, 'Titan Sa Mạc', 'Desert Titanium', 1), (140, 2, '256 GB', '256', 2),
(141, 1, 'Titan Tự Nhiên', 'Natural Titanium', 1), (141, 2, '256 GB', '256', 2),
(142, 1, 'Titan Trắng', 'White Titanium', 1), (142, 2, '256 GB', '256', 2),
(143, 1, 'Titan Đen', 'Black Titanium', 1), (143, 2, '256 GB', '256', 2),
(144, 1, 'Titan Sa Mạc', 'Desert Titanium', 1), (144, 2, '1 TB', '1024', 2),
(145, 1, 'Titan Tự Nhiên', 'Natural Titanium', 1), (145, 2, '1 TB', '1024', 2),
(146, 1, 'Titan Trắng', 'White Titanium', 1), (146, 2, '1 TB', '1024', 2),
(147, 1, 'Titan Đen', 'Black Titanium', 1), (147, 2, '1 TB', '1024', 2);

-- [MaSP 12] iPhone 16 Pro Max (ID 148-159)
INSERT INTO GiaTriBienThe (MaBienThe, MaThongSoBienTheMau, GiaTriHienThi, GiaTriNhap, ThuTuHienThi) VALUES
(148, 1, 'Titan Sa Mạc', 'Desert Titanium', 1), (148, 2, '256 GB', '256', 2),
(149, 1, 'Titan Tự Nhiên', 'Natural Titanium', 1), (149, 2, '256 GB', '256', 2),
(150, 1, 'Titan Trắng', 'White Titanium', 1), (150, 2, '256 GB', '256', 2),
(151, 1, 'Titan Đen', 'Black Titanium', 1), (151, 2, '256 GB', '256', 2),
(152, 1, 'Titan Sa Mạc', 'Desert Titanium', 1), (152, 2, '512 GB', '512', 2),
(153, 1, 'Titan Tự Nhiên', 'Natural Titanium', 1), (153, 2, '512 GB', '512', 2),
(154, 1, 'Titan Trắng', 'White Titanium', 1), (154, 2, '512 GB', '512', 2),
(155, 1, 'Titan Đen', 'Black Titanium', 1), (155, 2, '512 GB', '512', 2),
(156, 1, 'Titan Sa Mạc', 'Desert Titanium', 1), (156, 2, '1 TB', '1024', 2),
(157, 1, 'Titan Tự Nhiên', 'Natural Titanium', 1), (157, 2, '1 TB', '1024', 2),
(158, 1, 'Titan Trắng', 'White Titanium', 1), (158, 2, '1 TB', '1024', 2),
(159, 1, 'Titan Đen', 'Black Titanium', 1), (159, 2, '1 TB', '1024', 2);

-- [MaSP 13] iPhone 17 Air (ID 160-167)
INSERT INTO GiaTriBienThe (MaBienThe, MaThongSoBienTheMau, GiaTriHienThi, GiaTriNhap, ThuTuHienThi) VALUES
(160, 1, 'Xanh Da Trời', 'Sky Blue', 1), (160, 2, '256 GB', '256', 2),
(161, 1, 'Vàng Nhạt', 'Light Gold', 1), (161, 2, '256 GB', '256', 2),
(162, 1, 'Trắng Mây', 'Cloud White', 1), (162, 2, '256 GB', '256', 2),
(163, 1, 'Đen Không Gian', 'Space Black', 1), (163, 2, '256 GB', '256', 2),
(164, 1, 'Xanh Da Trời', 'Sky Blue', 1), (164, 2, '512 GB', '512', 2),
(165, 1, 'Vàng Nhạt', 'Light Gold', 1), (165, 2, '512 GB', '512', 2),
(166, 1, 'Trắng Mây', 'Cloud White', 1), (166, 2, '512 GB', '512', 2),
(167, 1, 'Đen Không Gian', 'Space Black', 1), (167, 2, '512 GB', '512', 2);

-- [MaSP 14] iPhone 17 Pro (ID 168-176)
INSERT INTO GiaTriBienThe (MaBienThe, MaThongSoBienTheMau, GiaTriHienThi, GiaTriNhap, ThuTuHienThi) VALUES
(168, 1, 'Cam Vũ Trụ', 'Cosmic Orange', 1), (168, 2, '256 GB', '256', 2),
(169, 1, 'Xanh Đậm', 'Deep Blue', 1), (169, 2, '256 GB', '256', 2),
(170, 1, 'Bạc', 'Silver', 1), (170, 2, '256 GB', '256', 2),
(171, 1, 'Cam Vũ Trụ', 'Cosmic Orange', 1), (171, 2, '512 GB', '512', 2),
(172, 1, 'Xanh Đậm', 'Deep Blue', 1), (172, 2, '512 GB', '512', 2),
(173, 1, 'Bạc', 'Silver', 1), (173, 2, '512 GB', '512', 2),
(174, 1, 'Cam Vũ Trụ', 'Cosmic Orange', 1), (174, 2, '1 TB', '1024', 2),
(175, 1, 'Xanh Đậm', 'Deep Blue', 1), (175, 2, '1 TB', '1024', 2),
(176, 1, 'Bạc', 'Silver', 1), (176, 2, '1 TB', '1024', 2);

-- [MaSP 15] iPhone 17 Pro Max (ID 177-185)
INSERT INTO GiaTriBienThe (MaBienThe, MaThongSoBienTheMau, GiaTriHienThi, GiaTriNhap, ThuTuHienThi) VALUES
(177, 1, 'Cam Vũ Trụ', 'Cosmic Orange', 1), (177, 2, '256 GB', '256', 2),
(178, 1, 'Xanh Đậm', 'Deep Blue', 1), (178, 2, '256 GB', '256', 2),
(179, 1, 'Bạc', 'Silver', 1), (179, 2, '256 GB', '256', 2),
(180, 1, 'Cam Vũ Trụ', 'Cosmic Orange', 1), (180, 2, '512 GB', '512', 2),
(181, 1, 'Xanh Đậm', 'Deep Blue', 1), (181, 2, '512 GB', '512', 2),
(182, 1, 'Bạc', 'Silver', 1), (182, 2, '512 GB', '512', 2),
(183, 1, 'Cam Vũ Trụ', 'Cosmic Orange', 1), (183, 2, '1 TB', '1024', 2),
(184, 1, 'Xanh Đậm', 'Deep Blue', 1), (184, 2, '1 TB', '1024', 2),
(185, 1, 'Bạc', 'Silver', 1), (185, 2, '1 TB', '1024', 2);

-- ---------------------------------------------------------------------------------
-- NHÓM 2: IPAD (MaSP 16 -> 23)
-- ---------------------------------------------------------------------------------

-- [MaSP 16] iPad mini 6 (ID 186-192)
INSERT INTO GiaTriBienThe (MaBienThe, MaThongSoBienTheMau, GiaTriHienThi, GiaTriNhap, ThuTuHienThi) VALUES
(186, 3, 'Tím', 'Purple', 1), (186, 4, 'WiFi', 'WiFi', 2), (186, 5, '64 GB', '64', 3),
(187, 3, 'Xám', 'Space Gray', 1), (187, 4, 'WiFi', 'WiFi', 2), (187, 5, '64 GB', '64', 3),
(188, 3, 'Hồng', 'Pink', 1), (188, 4, 'WiFi', 'WiFi', 2), (188, 5, '64 GB', '64', 3),
(189, 3, 'Trắng', 'Starlight', 1), (189, 4, 'WiFi', 'WiFi', 2), (189, 5, '64 GB', '64', 3),
(190, 3, 'Tím', 'Purple', 1), (190, 4, 'WiFi', 'WiFi', 2), (190, 5, '256 GB', '256', 3),
(191, 3, 'Xám', 'Space Gray', 1), (191, 4, 'WiFi', 'WiFi', 2), (191, 5, '256 GB', '256', 3),
(192, 3, 'Hồng', 'Pink', 1), (192, 4, 'WiFi', 'WiFi', 2), (192, 5, '256 GB', '256', 3);

-- [MaSP 17] iPad Gen 9 (ID 193-196)
INSERT INTO GiaTriBienThe (MaBienThe, MaThongSoBienTheMau, GiaTriHienThi, GiaTriNhap, ThuTuHienThi) VALUES
(193, 3, 'Bạc', 'Silver', 1), (193, 4, 'WiFi', 'WiFi', 2), (193, 5, '64 GB', '64', 3),
(194, 3, 'Xám', 'Space Gray', 1), (194, 4, 'WiFi', 'WiFi', 2), (194, 5, '64 GB', '64', 3),
(195, 3, 'Bạc', 'Silver', 1), (195, 4, 'WiFi', 'WiFi', 2), (195, 5, '256 GB', '256', 3),
(196, 3, 'Xám', 'Space Gray', 1), (196, 4, 'WiFi', 'WiFi', 2), (196, 5, '256 GB', '256', 3);

-- [MaSP 18] iPad Air 5 (ID 197-201)
INSERT INTO GiaTriBienThe (MaBienThe, MaThongSoBienTheMau, GiaTriHienThi, GiaTriNhap, ThuTuHienThi) VALUES
(197, 3, 'Xanh Dương', 'Blue', 1), (197, 4, 'WiFi', 'WiFi', 2), (197, 5, '64 GB', '64', 3),
(198, 3, 'Tím', 'Purple', 1), (198, 4, 'WiFi', 'WiFi', 2), (198, 5, '64 GB', '64', 3),
(199, 3, 'Xám', 'Space Gray', 1), (199, 4, 'WiFi', 'WiFi', 2), (199, 5, '64 GB', '64', 3),
(200, 3, 'Xanh Dương', 'Blue', 1), (200, 4, 'WiFi', 'WiFi', 2), (200, 5, '256 GB', '256', 3),
(201, 3, 'Tím', 'Purple', 1), (201, 4, 'WiFi', 'WiFi', 2), (201, 5, '256 GB', '256', 3);

-- [MaSP 19] iPad Gen 10 (ID 202-207)
INSERT INTO GiaTriBienThe (MaBienThe, MaThongSoBienTheMau, GiaTriHienThi, GiaTriNhap, ThuTuHienThi) VALUES
(202, 3, 'Vàng', 'Yellow', 1), (202, 4, 'WiFi', 'WiFi', 2), (202, 5, '64 GB', '64', 3),
(203, 3, 'Xanh', 'Blue', 1), (203, 4, 'WiFi', 'WiFi', 2), (203, 5, '64 GB', '64', 3),
(204, 3, 'Hồng', 'Pink', 1), (204, 4, 'WiFi', 'WiFi', 2), (204, 5, '64 GB', '64', 3),
(205, 3, 'Bạc', 'Silver', 1), (205, 4, 'WiFi', 'WiFi', 2), (205, 5, '256 GB', '256', 3),
(206, 3, 'Vàng', 'Yellow', 1), (206, 4, 'WiFi', 'WiFi', 2), (206, 5, '256 GB', '256', 3),
(207, 3, 'Hồng', 'Pink', 1), (207, 4, 'WiFi', 'WiFi', 2), (207, 5, '256 GB', '256', 3);

-- [MaSP 20] iPad Pro 12.9 M2 (ID 208-211)
INSERT INTO GiaTriBienThe (MaBienThe, MaThongSoBienTheMau, GiaTriHienThi, GiaTriNhap, ThuTuHienThi) VALUES
(208, 3, 'Xám', 'Space Gray', 1), (208, 4, 'WiFi', 'WiFi', 2), (208, 5, '128 GB', '128', 3),
(209, 3, 'Bạc', 'Silver', 1), (209, 4, 'WiFi', 'WiFi', 2), (209, 5, '256 GB', '256', 3),
(210, 3, 'Xám', 'Space Gray', 1), (210, 4, 'WiFi', 'WiFi', 2), (210, 5, '512 GB', '512', 3),
(211, 3, 'Bạc', 'Silver', 1), (211, 4, 'WiFi', 'WiFi', 2), (211, 5, '512 GB', '512', 3);

-- [MaSP 21] iPad Air 13 M2 (ID 212-217)
INSERT INTO GiaTriBienThe (MaBienThe, MaThongSoBienTheMau, GiaTriHienThi, GiaTriNhap, ThuTuHienThi) VALUES
(212, 3, 'Xanh Biển', 'Blue', 1), (212, 4, 'WiFi', 'WiFi', 2), (212, 5, '128 GB', '128', 3),
(213, 3, 'Xám Không Gian', 'Space Gray', 1), (213, 4, 'WiFi', 'WiFi', 2), (213, 5, '128 GB', '128', 3),
(214, 3, 'Tím', 'Purple', 1), (214, 4, 'WiFi', 'WiFi', 2), (214, 5, '256 GB', '256', 3),
(215, 3, 'Trắng Sao', 'Starlight', 1), (215, 4, 'WiFi', 'WiFi', 2), (215, 5, '512 GB', '512', 3),
(216, 3, 'Xanh Biển', 'Blue', 1), (216, 4, 'WiFi', 'WiFi', 2), (216, 5, '256 GB', '256', 3),
(217, 3, 'Xám Không Gian', 'Space Gray', 1), (217, 4, 'WiFi', 'WiFi', 2), (217, 5, '512 GB', '512', 3);

-- [MaSP 22] iPad Pro 13 M4 (ID 218-223)
INSERT INTO GiaTriBienThe (MaBienThe, MaThongSoBienTheMau, GiaTriHienThi, GiaTriNhap, ThuTuHienThi) VALUES
(218, 3, 'Đen Space Black', 'Black', 1), (218, 4, 'WiFi', 'WiFi', 2), (218, 5, '256 GB', '256', 3),
(219, 3, 'Bạc Silver', 'Silver', 1), (219, 4, 'WiFi', 'WiFi', 2), (219, 5, '256 GB', '256', 3),
(220, 3, 'Đen Space Black', 'Black', 1), (220, 4, 'WiFi', 'WiFi', 2), (220, 5, '512 GB', '512', 3),
(221, 3, 'Bạc Silver', 'Silver', 1), (221, 4, 'WiFi', 'WiFi', 2), (221, 5, '1 TB', '1024', 3),
(222, 3, 'Bạc Silver', 'Silver', 1), (222, 4, 'WiFi', 'WiFi', 2), (222, 5, '512 GB', '512', 3),
(223, 3, 'Đen Space Black', 'Black', 1), (223, 4, 'WiFi', 'WiFi', 2), (223, 5, '1 TB', '1024', 3);

-- [MaSP 23] iPad mini 7 (ID 224-229)
INSERT INTO GiaTriBienThe (MaBienThe, MaThongSoBienTheMau, GiaTriHienThi, GiaTriNhap, ThuTuHienThi) VALUES
(224, 3, 'Xanh Blue', 'Blue', 1), (224, 4, 'WiFi', 'WiFi', 2), (224, 5, '128 GB', '128', 3),
(225, 3, 'Tím Purple', 'Purple', 1), (225, 4, 'WiFi', 'WiFi', 2), (225, 5, '128 GB', '128', 3),
(226, 3, 'Trắng Starlight', 'Starlight', 1), (226, 4, 'WiFi', 'WiFi', 2), (226, 5, '256 GB', '256', 3),
(227, 3, 'Xám Space Gray', 'Space Gray', 1), (227, 4, 'WiFi', 'WiFi', 2), (227, 5, '512 GB', '512', 3),
(228, 3, 'Trắng Starlight', 'Starlight', 1), (228, 4, 'WiFi', 'WiFi', 2), (228, 5, '128 GB', '128', 3),
(229, 3, 'Tím Purple', 'Purple', 1), (229, 4, 'WiFi', 'WiFi', 2), (229, 5, '256 GB', '256', 3);

-- ---------------------------------------------------------------------------------
-- NHÓM 3: MACBOOK (MaSP 24 -> 30)
-- ---------------------------------------------------------------------------------

-- [MaSP 24] MacBook Air M1 (ID 230-234)
INSERT INTO GiaTriBienThe (MaBienThe, MaThongSoBienTheMau, GiaTriHienThi, GiaTriNhap, ThuTuHienThi) VALUES
(230, 6, '8 GB', '8', 1), (230, 7, '256 GB', '256', 2), (230, 8, 'Vàng Gold', 'Gold', 3),
(231, 6, '8 GB', '8', 1), (231, 7, '256 GB', '256', 2), (231, 8, 'Xám Space Gray', 'Space Gray', 3),
(232, 6, '8 GB', '8', 1), (232, 7, '256 GB', '256', 2), (232, 8, 'Bạc Silver', 'Silver', 3),
(233, 6, '16 GB', '16', 1), (233, 7, '512 GB', '512', 2), (233, 8, 'Vàng Gold', 'Gold', 3),
(234, 6, '16 GB', '16', 1), (234, 7, '512 GB', '512', 2), (234, 8, 'Xám Space Gray', 'Space Gray', 3);

-- [MaSP 25] MacBook Air M2 (ID 235-240)
INSERT INTO GiaTriBienThe (MaBienThe, MaThongSoBienTheMau, GiaTriHienThi, GiaTriNhap, ThuTuHienThi) VALUES
(235, 6, '8 GB', '8', 1), (235, 7, '256 GB', '256', 2), (235, 8, 'Xanh Midnight', 'Midnight', 3),
(236, 6, '8 GB', '8', 1), (236, 7, '256 GB', '256', 2), (236, 8, 'Vàng Starlight', 'Starlight', 3),
(237, 6, '8 GB', '8', 1), (237, 7, '256 GB', '256', 2), (237, 8, 'Xám Space Gray', 'Space Gray', 3),
(238, 6, '8 GB', '8', 1), (238, 7, '256 GB', '256', 2), (238, 8, 'Bạc Silver', 'Silver', 3),
(239, 6, '16 GB', '16', 1), (239, 7, '512 GB', '512', 2), (239, 8, 'Xanh Midnight', 'Midnight', 3),
(240, 6, '16 GB', '16', 1), (240, 7, '512 GB', '512', 2), (240, 8, 'Bạc Silver', 'Silver', 3);

-- [MaSP 26] MacBook Pro 14 M2 (ID 241-244)
INSERT INTO GiaTriBienThe (MaBienThe, MaThongSoBienTheMau, GiaTriHienThi, GiaTriNhap, ThuTuHienThi) VALUES
(241, 6, '16 GB', '16', 1), (241, 7, '512 GB', '512', 2), (241, 8, 'Xám', 'Space Gray', 3),
(242, 6, '16 GB', '16', 1), (242, 7, '512 GB', '512', 2), (242, 8, 'Bạc', 'Silver', 3),
(243, 6, '32 GB', '32', 1), (243, 7, '1 TB', '1024', 2), (243, 8, 'Xám', 'Space Gray', 3),
(244, 6, '32 GB', '32', 1), (244, 7, '1 TB', '1024', 2), (244, 8, 'Bạc', 'Silver', 3);

-- [MaSP 27] MacBook Pro 16 M3 (ID 245-248)
INSERT INTO GiaTriBienThe (MaBienThe, MaThongSoBienTheMau, GiaTriHienThi, GiaTriNhap, ThuTuHienThi) VALUES
(245, 6, '18 GB', '18', 1), (245, 7, '512 GB', '512', 2), (245, 8, 'Space Black', 'Black', 3),
(246, 6, '36 GB', '36', 1), (246, 7, '512 GB', '512', 2), (246, 8, 'Space Black', 'Black', 3),
(247, 6, '36 GB', '36', 1), (247, 7, '1 TB', '1024', 2), (247, 8, 'Silver', 'Silver', 3),
(248, 6, '36 GB', '36', 1), (248, 7, '1 TB', '1024', 2), (248, 8, 'Space Black', 'Black', 3);

-- [MaSP 28] MacBook Air 15 M3 (ID 249-256)
INSERT INTO GiaTriBienThe (MaBienThe, MaThongSoBienTheMau, GiaTriHienThi, GiaTriNhap, ThuTuHienThi) VALUES
(249, 6, '8 GB', '8', 1), (249, 7, '256 GB', '256', 2), (249, 8, 'Midnight', 'Midnight', 3),
(250, 6, '8 GB', '8', 1), (250, 7, '256 GB', '256', 2), (250, 8, 'Starlight', 'Starlight', 3),
(251, 6, '8 GB', '8', 1), (251, 7, '256 GB', '256', 2), (251, 8, 'Silver', 'Silver', 3),
(252, 6, '8 GB', '8', 1), (252, 7, '256 GB', '256', 2), (252, 8, 'Space Gray', 'Space Gray', 3),
(253, 6, '16 GB', '16', 1), (253, 7, '512 GB', '512', 2), (253, 8, 'Midnight', 'Midnight', 3),
(254, 6, '16 GB', '16', 1), (254, 7, '512 GB', '512', 2), (254, 8, 'Starlight', 'Starlight', 3),
(255, 6, '16 GB', '16', 1), (255, 7, '512 GB', '512', 2), (255, 8, 'Silver', 'Silver', 3),
(256, 6, '16 GB', '16', 1), (256, 7, '512 GB', '512', 2), (256, 8, 'Space Gray', 'Space Gray', 3);

-- [MaSP 29] MacBook Pro 14 M4 (ID 257-261)
INSERT INTO GiaTriBienThe (MaBienThe, MaThongSoBienTheMau, GiaTriHienThi, GiaTriNhap, ThuTuHienThi) VALUES
(257, 6, '16 GB', '16', 1), (257, 7, '512 GB', '512', 2), (257, 8, 'Space Black', 'Black', 3),
(258, 6, '16 GB', '16', 1), (258, 7, '512 GB', '512', 2), (258, 8, 'Silver', 'Silver', 3),
(259, 6, '16 GB', '16', 1), (259, 7, '1 TB', '1024', 2), (259, 8, 'Space Black', 'Black', 3),
(260, 6, '24 GB', '24', 1), (260, 7, '1 TB', '1024', 2), (260, 8, 'Space Black', 'Black', 3),
(261, 6, '32 GB', '32', 1), (261, 7, '1 TB', '1024', 2), (261, 8, 'Silver', 'Silver', 3);

-- [MaSP 30] MacBook Pro 16 M4 (ID 262-266)
INSERT INTO GiaTriBienThe (MaBienThe, MaThongSoBienTheMau, GiaTriHienThi, GiaTriNhap, ThuTuHienThi) VALUES
(262, 6, '24 GB', '24', 1), (262, 7, '512 GB', '512', 2), (262, 8, 'Space Black', 'Black', 3),
(263, 6, '48 GB', '48', 1), (263, 7, '512 GB', '512', 2), (263, 8, 'Silver', 'Silver', 3),
(264, 6, '36 GB', '36', 1), (264, 7, '1 TB', '1024', 2), (264, 8, 'Space Black', 'Black', 3),
(265, 6, '128 GB', '128', 1), (265, 7, '8 TB', '8192', 2), (265, 8, 'Space Black', 'Black', 3),
(266, 6, '48 GB', '48', 1), (266, 7, '1 TB', '1024', 2), (266, 8, 'Silver', 'Silver', 3);