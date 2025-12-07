
-- Nội dung: Apple Product 2021 - 10/2025

-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE SanPham; -- Xóa sạch và reset ID về 1
-- SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO SanPham (Ten, MoTa, TinhTrangSanPham, MaLoai) VALUES 
-- =======================================================
-- NHÓM 1: IPHONE (MaLoai = 1)
-- =======================================================
('iPhone 13 mini', 'Nhỏ mà có võ. Sức mạnh vượt trội nằm gọn trong lòng bàn tay.', 1, 1),
('iPhone 13', 'Siêu năng lực mới của bạn. Chế độ Điện ảnh (Cinematic Mode) thay đổi cuộc chơi.', 1, 1),
('iPhone 13 Pro Max', 'Pro đến từng chi tiết. Màn hình ProMotion 120Hz mượt mà lần đầu tiên xuất hiện.', 1, 1),
('iPhone 14 Plus', 'Lớn hơn, bền bỉ hơn. Thời lượng pin ấn tượng cho cả ngày dài.', 1, 1),
('iPhone 14 Pro', 'Màu Tím Deep Purple huyền bí. Tái định nghĩa tương tác với Dynamic Island.', 1, 1),
('iPhone 14 Pro Max', 'Camera 48MP đột phá. Sức mạnh chuyên nghiệp trong thiết kế Always-On Display.', 1, 1),
('iPhone 15', 'Thiết kế pha màu mặt lưng kính nhám. Dynamic Island nay đã có trên phiên bản tiêu chuẩn.', 1, 1),
('iPhone 15 Pro', 'Titan. Bền bỉ. Nhẹ tênh. Nút Tác vụ (Action Button) thay thế cần gạt rung truyền thống.', 1, 1),
('iPhone 15 Pro Max', 'Zoom quang học 5x. Khung viền Titan Tự nhiên (Natural Titanium) sang trọng bậc nhất.', 1, 1),
('iPhone 16', 'Nút điều khiển Camera (Camera Control) hoàn toàn mới. Apple Intelligence tích hợp sâu.', 1, 1),
('iPhone 16 Pro', 'Màu Titan Sa mạc (Desert Titanium) rực rỡ. Viền màn hình mỏng nhất lịch sử Apple.', 1, 1),
('iPhone 16 Pro Max', 'Kiệt tác màn hình lớn 6.9 inch. Quay video 4K 120fps chuẩn điện ảnh.', 1, 1),
('iPhone Air', 'Sự trở lại của độ mỏng cực đại. Thiết kế nhôm tái chế siêu nhẹ thay thế dòng Plus.', 1, 1),
('iPhone 17 Pro', 'Chip A19 Bionic 2nm. Face ID ẩn dưới màn hình mang lại trải nghiệm không khiếm khuyết.', 1, 1),
('iPhone 17 Pro Max', 'Màu Cam Vũ Trụ (Cosmic Orange) độc bản. Hệ thống 3 camera 48MP toàn diện.', 1, 1),

-- =======================================================
-- NHÓM 2: IPAD (MaLoai = 2)
-- =======================================================
('iPad mini 6', 'Sức mạnh khổng lồ trong thiết kế nhỏ gọn. Màn hình tràn viền Liquid Retina.', 1, 2),
('iPad Gen 9', 'Chiếc iPad quốc dân. Mạnh mẽ, dễ dùng và linh hoạt cho mọi nhu cầu cơ bản.', 1, 2),
('iPad Air 5 M1', 'Năm màu sắc cá tính. Sức mạnh chip M1 đưa hiệu năng iPad lên tầm cao mới.', 1, 2),
('iPad Gen 10', 'Thiết kế toàn màn hình đầy sắc màu. Loại bỏ nút Home, chuyển sang USB-C.', 1, 2),
('iPad Pro 12.9 M2', 'Trải nghiệm Apple Pencil lơ lửng (Hover). Quay video ProRes chuyên nghiệp.', 1, 2),
('iPad Air 13 M2', 'Lần đầu tiên có phiên bản 13 inch. Màn hình rộng lớn, nhẹ nhàng di chuyển.', 1, 2),
('iPad Pro 13 M4', 'Mỏng không tưởng (Thinpossible). Màn hình Ultra Retina XDR Tandem OLED đẹp nhất thế giới.', 1, 2),
('iPad mini 7', 'Tích hợp Apple Intelligence. Chip A17 Pro cân mọi tựa game AAA.', 1, 2),

-- =======================================================
-- NHÓM 3: MACBOOK (MaLoai = 3)
-- =======================================================
('MacBook Air M1', 'Chiếc MacBook thay đổi tất cả. Pin cả ngày, không quạt tản nhiệt, im lặng tuyệt đối.', 1, 3),
('MacBook Air M2', 'Thiết kế phẳng hoàn toàn mới. Màu Midnight (Xanh đêm) tuyệt đẹp.', 1, 3),
('MacBook Pro 14 M2', 'Sức mạnh để chinh phục mọi quy trình làm việc (Workflow) chuyên nghiệp nhất.', 1, 3),
('MacBook Pro 16 M3', 'Nhanh đáng sợ (Scary fast). Màu Space Black (Đen không gian) chống bám vân tay.', 1, 3),
('MacBook Air 15 M3', 'Chiếc laptop 15 inch mỏng nhất thế giới. Hiệu năng AI vượt trội.', 1, 3),
('MacBook Pro 14 M4', 'Sức mạnh AI tối thượng. Màn hình phủ nano chống chói lần đầu xuất hiện trên MacBook.', 1, 3),
('MacBook Pro 16 M4', 'Chip M4 Max thách thức mọi giới hạn đồ họa. Thời lượng pin lên đến 24 giờ.', 1, 3),

-- =======================================================
-- NHÓM 4: AIRPOD (MaLoai = 4)
-- =======================================================
('AirPods 3', 'Âm thanh không gian (Spatial Audio) đưa âm nhạc bao trùm quanh bạn.', 1, 4),
('AirPods Pro 2', 'Chủ động khử tiếng ồn gấp 2 lần. Tính năng Nhận biết cuộc hội thoại thông minh.', 1, 4),
('AirPods 4', 'Thiết kế mở (Open-ear) vừa vặn nhất từ trước đến nay.', 1, 4),
('AirPods 4 ANC', 'Lần đầu tiên dòng tai nghe mở có Chống ồn chủ động (ANC).', 1, 4),
('AirPods Max 2024', 'Âm thanh độ phân giải cao. Cổng sạc USB-C và các màu sắc tươi mới.', 1, 4),

-- =======================================================
-- NHÓM 5: PHỤ KIỆN (MaLoai = 5)
-- =======================================================
-- Dây đeo Apple Watch (Bands)
('Sport Band', 'Bền bỉ. Mềm mại. Chất liệu Fluoroelastomer hiệu suất cao.', 1, 5),
('Milanese Loop', 'Thiết kế dạng lưới thép không gỉ phong cách Ý. Hít từ tính tinh tế.', 1, 5),
('Alpine Loop', 'Dành cho những nhà thám hiểm. Hai lớp dệt cùng móc khóa G-titan chắc chắn.', 1, 5),
('Ocean Band', 'Cấu trúc hình ống co giãn. Hoàn hảo cho các môn thể thao dưới nước.', 1, 5),

-- Ốp lưng (Cases)
('Silicone Case MagSafe', 'Cảm giác mượt mà êm ái. Tích hợp nam châm căn chỉnh hoàn hảo cho iPhone.', 1, 5),
('Clear Case MagSafe', 'Khoe trọn vẻ đẹp màu máy. Lớp phủ chống ố vàng và trầy xước tối ưu.', 1, 5),
('Smart Folio iPad', 'Tự động tắt mở màn hình. Gấp lại thành chân đế tiện dụng.', 1, 5),
('Magic Keyboard iPad', 'Trải nghiệm gõ phím tuyệt vời. Thiết kế lơ lửng và bàn di chuột tích hợp.', 1, 5),

-- Củ sạc (Power Adapters)
('20W USB-C Adapter', 'Nhỏ gọn nhưng mạnh mẽ. Sạc nhanh 50% pin iPhone chỉ trong 30 phút.', 1, 5),
('35W Dual USB-C', 'Sạc cùng lúc hai thiết bị. Thiết kế chân gập nhỏ gọn dễ dàng mang theo.', 1, 5),
('70W USB-C Adapter', 'Năng lượng cho MacBook. Sạc nhanh hiệu quả tại nhà hay văn phòng.', 1, 5),
('MagSafe Charger', 'Sạc không dây nhanh hơn. Hít là sạc.', 1, 5),

-- Cáp sạc (Cables) & Khác
('Cáp sạc USB-C 60W', 'Thiết kế bọc dù (Woven) bền bỉ. Hỗ trợ sạc và truyền dữ liệu tiêu chuẩn.', 1, 5),
('Cáp MagSafe 3', 'Sự trở lại của huyền thoại trên MacBook. Đèn LED báo trạng thái pin tiện lợi.', 1, 5),
('Cáp Thunderbolt 4 Pro', 'Tốc độ truyền dữ liệu siêu thanh 40Gb/s. Đỉnh cao kết nối.', 1, 5),
('Apple Pencil Pro', 'Bóp, xoay và cảm nhận. Phản hồi xúc giác (Haptic) chân thực cho nhà sáng tạo.', 1, 5),
('AirTag', 'Mất là tìm thấy. Định vị chính xác từng cm với công nghệ Ultra Wideband.', 1, 5);