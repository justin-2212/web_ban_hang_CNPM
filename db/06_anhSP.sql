-- =================================================================================
-- BẢNG: AnhSP (Thư viện ảnh chi tiết - Gallery)
-- TÊN FILE: Tiếng Việt không dấu mô tả chi tiết góc chụp
-- =================================================================================

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE AnhSP;
SET FOREIGN_KEY_CHECKS = 1;

-- =================================================================================
-- PHẦN 1: IPHONE (MaSP 1 -> 15)
-- Path: /assets/products/iphone/...
-- =================================================================================

-- 1. iPhone 13 mini
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(1, '/assets/products/iphone/iphone-13-mini-red.jpg', 1),
(1, '/assets/products/iphone/iphone-13-mini-mat-truoc.jpg', 2),
(1, '/assets/products/iphone/iphone-13-mini-mat-sau-cac-mau.jpg', 3),
(1, '/assets/products/iphone/iphone-13-mini-cam-tren-tay.jpg', 4);

-- 2. iPhone 13
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(2, '/assets/products/iphone/iphone-13-starlight.jpg', 1),
(2, '/assets/products/iphone/iphone-13-cum-camera-kep.jpg', 2),
(2, '/assets/products/iphone/iphone-13-canh-ben-khung-nhom.jpg', 3);

-- 3. iPhone 13 Pro Max
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(3, '/assets/products/iphone/iphone-13-pro-max-alpine-green.jpg', 1),
(3, '/assets/products/iphone/iphone-13-pro-max-mat-truoc.jpg', 2),
(3, '/assets/products/iphone/iphone-13-pro-max-cum-3-camera.jpg', 3),
(3, '/assets/products/iphone/iphone-13-pro-max-khung-vien-thep.jpg', 4);

-- 4. iPhone 14 Plus
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(4, '/assets/products/iphone/iphone-14-plus-purple.jpg', 1),
(4, '/assets/products/iphone/iphone-14-plus-so-sanh-kich-thuoc.jpg', 2),
(4, '/assets/products/iphone/iphone-14-plus-mat-lung-kinh.jpg', 3);

-- 5. iPhone 14 Pro
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(5, '/assets/products/iphone/iphone-14-pro-gold.jpg', 1),
(5, '/assets/products/iphone/iphone-14-pro-man-hinh-dynamic-island.jpg', 2),
(5, '/assets/products/iphone/iphone-14-pro-man-hinh-luon-bat.jpg', 3);

-- 6. iPhone 14 Pro Max
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(6, '/assets/products/iphone/iphone-14-pro-max-deep-purple.jpg', 1),
(6, '/assets/products/iphone/iphone-14-pro-max-chinh-dien.jpg', 2),
(6, '/assets/products/iphone/iphone-14-pro-max-cac-phien-ban-mau.jpg', 3),
(6, '/assets/products/iphone/iphone-14-pro-max-chup-anh-ngoai-troi.jpg', 4);

-- 7. iPhone 15
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(7, '/assets/products/iphone/iphone-15-pink.jpg', 1),
(7, '/assets/products/iphone/iphone-15-giao-dien-dynamic-island.jpg', 2),
(7, '/assets/products/iphone/iphone-15-cong-sac-usb-c.jpg', 3);

-- 8. iPhone 15 Pro
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(8, '/assets/products/iphone/iphone-15-pro-natural-titanium.jpg', 1),
(8, '/assets/products/iphone/iphone-15-pro-nut-tac-vu-moi.jpg', 2),
(8, '/assets/products/iphone/iphone-15-pro-choi-game-chip-a17.jpg', 3);

-- 9. iPhone 15 Pro Max
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(9, '/assets/products/iphone/iphone-15-pro-max-blue.jpg', 1),
(9, '/assets/products/iphone/iphone-15-pro-max-chinh-dien.jpg', 2),
(9, '/assets/products/iphone/iphone-15-pro-max-zoom-quang-5x.jpg', 3),
(9, '/assets/products/iphone/iphone-15-pro-max-cac-mau.jpg', 4);

-- 10. iPhone 16
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(10, '/assets/products/iphone/iphone-16-ultramarine.jpg', 1),
(10, '/assets/products/iphone/iphone-16-camera-xep-doc.jpg', 2),
(10, '/assets/products/iphone/iphone-16-nut-chup-anh-moi.jpg', 3),
(10, '/assets/products/iphone/iphone-16-bo-suu-tap-mau.jpg', 4);

-- 11. iPhone 16 Pro
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(11, '/assets/products/iphone/iphone-16-pro-desert.jpg', 1),
(11, '/assets/products/iphone/iphone-16-pro-mat-truoc.jpg', 2),
(11, '/assets/products/iphone/iphone-16-pro-canh-ben.jpg', 3);

-- 12. iPhone 16 Pro Max
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(12, '/assets/products/iphone/iphone-16-pro-max-desert.jpg', 1),
(12, '/assets/products/iphone/iphone-16-pro-max-mat-sau-sa-mac.jpg', 2),
(12, '/assets/products/iphone/iphone-16-pro-max-quay-video-4k.jpg', 3);

-- 13. iPhone Air 
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(13, '/assets/products/iphone/iphone-air-light-gold.jpg', 1),
(13, '/assets/products/iphone/iphone-air-thiet-ke-sieu-mong.jpg', 2),
(13, '/assets/products/iphone/iphone-air-camera-don.jpg', 3),
(13, '/assets/products/iphone/iphone-air-cac-mau-du-kien.jpg', 4);

-- 14. iPhone 17 Pro 
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(14, '/assets/products/iphone/iphone-17-pro-cosmic-orange.jpg', 1),
(14, '/assets/products/iphone/iphone-17-pro-hero.jpg', 2),
(14, '/assets/products/iphone/iphone-17-pro-mat-truoc-tran-vien.jpg', 3);
-- (14, '/assets/products/iphone/iphone-17-pro-cum-3-camera-moi.jpg', 4);

-- 15. iPhone 17 Pro Max 
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(15, '/assets/products/iphone/iphone-17-pro-max-anh-chinh-dien.jpg', 1),
(15, '/assets/products/iphone/iphone-17-pro-max-mat-sau-cam-vu-tru.jpg', 2),
(15, '/assets/products/iphone/iphone-17-pro-max-hieu-nang-dinh-cao.jpg', 3);


-- =================================================================================
-- PHẦN 2: IPAD (MaSP 16 -> 23)
-- Path: /assets/products/ipad/...
-- =================================================================================

-- 16. iPad mini 6
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(16, '/assets/products/ipad/ipad-mini-6-purple.jpg', 1);
-- (16, '/assets/products/ipad/ipad-mini-6-2.jpg', 2),
-- (16, '/assets/products/ipad/ipad-mini-6-3.jpg', 3);

-- 17. iPad Gen 9
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(17, '/assets/products/ipad/ipad-gen-9-silver.jpg', 1),
(17, '/assets/products/ipad/ipad-gen-9-dung-but-pencil-1.jpg', 2);

-- 18. iPad Air 5 M1
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(18, '/assets/products/ipad/ipad-air-5-blue.jpg', 1),
(18, '/assets/products/ipad/ipad-air-5-gan-ban-phim.jpg', 2);  -- gắn bàn phím

-- 19. iPad Gen 10
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(19, '/assets/products/ipad/ipad-gen-10-yellow.jpg', 1),
(19, '/assets/products/ipad/ipad-gen-10-xoe-quat-mau.jpg', 2),
(19, '/assets/products/ipad/ipad-gen-10-ban-phim-folio.jpg', 3);

-- 20. iPad Pro 12.9 M2
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(20, '/assets/products/ipad/ipad-pro-12-9-m2-silver.jpg', 1),
(20, '/assets/products/ipad/ipad-pro-m2-tinh-nang-hover-but.jpg', 2);

-- 21. iPad Air 13 M2
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(21, '/assets/products/ipad/ipad-air-13-m2-blue.jpg', 1),
(21, '/assets/products/ipad/ipad-air-13-m2-chia-doi-man-hinh.jpg', 2),
(21, '/assets/products/ipad/ipad-air-13-m2-mat-sau.jpg', 3);

-- 22. iPad Pro 13 M4
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(22, '/assets/products/ipad/ipad-pro-13-m4-black.jpg', 1),
(22, '/assets/products/ipad/ipad-pro-m4-do-mong-canh-ben.jpg', 2), -- độ mỏng cạnh bên
(22, '/assets/products/ipad/ipad-pro-m4-ban-phim-magic-moi.jpg', 3),
(22, '/assets/products/ipad/ipad-pro-m4-but-pencil-pro.jpg', 4);

-- 23. iPad mini 7
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(23, '/assets/products/ipad/ipad-mini-7-blue.jpg', 1),
(23, '/assets/products/ipad/ipad-mini-7-tinh-nang-ai.jpg', 2);


-- =================================================================================
-- PHẦN 3: MACBOOK (MaSP 24 -> 30)
-- Path: /assets/products/macbook/...
-- =================================================================================

-- 24. MacBook Air M1
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(24, '/assets/products/macbook/mba-m1-mat-truoc.jpg', 1),
(24, '/assets/products/macbook/mba-m1-canh-ben.jpg', 2),
(24, '/assets/products/macbook/mba-m1-mau-vang-gold.jpg', 3);

-- 25. MacBook Air M2
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(25, '/assets/products/macbook/mba-m2-anh-chinh.jpg', 1),
(25, '/assets/products/macbook/mba-m2-canh-ben-vuong.jpg', 2),
(25, '/assets/products/macbook/mba-m2-day-sac-magsafe.jpg', 3);

-- 26. MacBook Pro 14 M2
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(26, '/assets/products/macbook/mbp-14-m2-anh-chinh.jpg', 1),
(26, '/assets/products/macbook/mbp-14-m2-cong-ket-noi.jpg', 2),
(26, '/assets/products/macbook/mbp-14-m2-man-hinh.jpg', 3); 

-- 27. MacBook Pro 16 M3
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(27, '/assets/products/macbook/mbp-16-m3-den-space-black.jpg', 1),
(27, '/assets/products/macbook/mbp-16-m3-be-mat-chong-van-tay.jpg', 2),
(27, '/assets/products/macbook/mbp-16-m3-hieu-nang.jpg', 3);

-- 28. MacBook Air 15 M3
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(28, '/assets/products/macbook/mba-15-m3-anh-chinh.jpg', 1),
(28, '/assets/products/macbook/mba-15-m3-da-nhiem.jpg', 2),
(28, '/assets/products/macbook/mba-15-m3-mong-nhe.jpg', 3);

-- 29. MacBook Pro 14 M4
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(29, '/assets/products/macbook/mbp-14-m4-man-hinh-nano.jpg', 1),
(29, '/assets/products/macbook/mbp-14-m4-camera-center-stage.jpg', 2), 
(29, '/assets/products/macbook/mbp-14-m4-cong-thunderbolt-5.jpg', 3);

-- 30. MacBook Pro 16 M4
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(30, '/assets/products/macbook/mbp-16-m4-anh-chinh.jpg', 1),
(30, '/assets/products/macbook/mbp-16-m4-render-do-hoa.jpg', 2),
(30, '/assets/products/macbook/mbp-16-m4-thoi-luong-pin.jpg', 3), 
(30, '/assets/products/macbook/mbp-16-m4-ban-phim-den.jpg', 4); 


-- =================================================================================
-- PHẦN 4: AIRPODS (MaSP 31 -> 35)
-- Path: /assets/products/airpods/...
-- =================================================================================

-- 31. AirPods 3
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(31, '/assets/products/airpods/airpods-3-anh-chinh.jpg', 1),
(31, '/assets/products/airpods/airpods-3-mo-hop.jpg', 2),
(31, '/assets/products/airpods/airpods-3-deo-tren-tai.jpg', 3);

-- 32. AirPods Pro 2
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(32, '/assets/products/airpods/airpods-pro-2-anh-chinh.jpg', 1),
(32, '/assets/products/airpods/airpods-pro-2-dem-tai-silicone.jpg', 2),
(32, '/assets/products/airpods/airpods-pro-2-hop-sac-loa.jpg', 3);

-- 33. AirPods 4
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(33, '/assets/products/airpods/airpods-4-thiet-ke-mo.jpg', 1),
(33, '/assets/products/airpods/airpods-4-hop-sac-usb-c.jpg', 2),
(33, '/assets/products/airpods/airpods-4-than-tai-nghe.jpg', 3);

-- 34. AirPods 4 ANC
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(34, '/assets/products/airpods/airpods-4-anc-anh-chinh.jpg', 1),
(34, '/assets/products/airpods/airpods-4-anc-so-sanh.jpg', 2),
(34, '/assets/products/airpods/airpods-4-anc-sac-khong-day.jpg', 3);

-- 35. AirPods Max 2024
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(35, '/assets/products/airpods/airpods-max-2024-1.jpg', 1),
(35, '/assets/products/airpods/airpods-max-2024-2.jpg', 2),
(35, '/assets/products/airpods/airpods-max-2024-3.jpg', 3);

-- =================================================================================
-- PHẦN 5: PHỤ KIỆN (MaSP 36 -> 52)
-- Path: /assets/products/accessories/...
-- =================================================================================

-- 36. Sport Band (Dây đeo)
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(36, '/assets/products/accessories/day-deo-the-thao-1.jpg', 1),
(36, '/assets/products/accessories/day-deo-the-thao-2.jpg', 2);

-- 37. Milanese Loop
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(37, '/assets/products/accessories/day-deo-thep-den.jpg', 1);
-- 38. Alpine Loop
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(38, '/assets/products/accessories/day-deo-alpine-den.jpg', 1);

-- 39. Ocean Band
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(39, '/assets/products/accessories/day-deo-bien-midnight.jpg', 1);

-- 40. Silicone Case MagSafe
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(40, '/assets/products/accessories/op-lung-silicone-vong-magsafe.jpg', 1);

-- 41. Clear Case MagSafe
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(41, '/assets/products/accessories/op-lung-trong-suot.jpg', 1),
(41, '/assets/products/accessories/op-lung-trong-suot-lap-may.jpg', 2);

-- 42. Smart Folio iPad
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(42, '/assets/products/accessories/bao-da-ipad-mo-nap.jpg', 1),
(42, '/assets/products/accessories/bao-da-ipad-dung.jpg', 2);

-- 43. Magic Keyboard iPad
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(43, '/assets/products/accessories/ban-phim-ipad-dang-lo-lung.jpg', 1),
(43, '/assets/products/accessories/ban-phim-ipad-gap-lai.jpg', 2);

-- 44. 20W USB-C Adapter
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(44, '/assets/products/accessories/cu-sac-20w.jpg', 1),
(44, '/assets/products/accessories/cu-sac-20w-chan-cam.jpg', 2);

-- 45. 35W Dual USB-C
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(45, '/assets/products/accessories/cu-sac-35w-kep.jpg', 1),
(45, '/assets/products/accessories/cu-sac-35w-cong-cam.jpg', 2);

-- 46. 70W USB-C Adapter
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(46, '/assets/products/accessories/cu-sac-70w.jpg', 1);

-- 47. MagSafe Charger
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(47, '/assets/products/accessories/sac-khong-day-magsafe.jpg', 1),
(47, '/assets/products/accessories/sac-magsafe-gan-may.jpg', 2);

-- 48. Cáp sạc USB-C 60W
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(48, '/assets/products/accessories/cap-sac-usb-c-du.jpg', 1),
(48, '/assets/products/accessories/cap-sac-usb-c-dau-cam.jpg', 2);

-- 49. Cáp MagSafe 3
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(49, '/assets/products/accessories/cap-magsafe-3.jpg', 1),
(49, '/assets/products/accessories/cap-magsafe-3-den-led.jpg', 2);

-- 50. Cáp Thunderbolt 4 Pro
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(50, '/assets/products/accessories/cap-thunderbolt-4.jpg', 1);

-- 51. Apple Pencil Pro
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(51, '/assets/products/accessories/but-pencil-pro.jpg', 1),
(51, '/assets/products/accessories/but-pencil-pro-tinh-nang.jpg', 2),
(51, '/assets/products/accessories/but-pencil-pro-sac.jpg', 3);

-- 52. AirTag
INSERT INTO AnhSP (MaSP, DuongDanLuuAnh, ThuTuHienThi) VALUES
(52, '/assets/products/accessories/airtag-mat-truoc.jpg', 1),
(52, '/assets/products/accessories/airtag-moc-khoa.jpg', 2),
(52, '/assets/products/accessories/airtag-tim-kiem.jpg', 3);