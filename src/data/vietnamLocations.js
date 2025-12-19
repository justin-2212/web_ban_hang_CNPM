export const provinces = [
  { id: 1, name: "Hà Nội" },
  { id: 2, name: "Hồ Chí Minh" },
  { id: 3, name: "Đà Nẵng" },
  { id: 4, name: "Hải Phòng" },
  { id: 5, name: "Cần Thơ" },
  { id: 6, name: "An Giang" },
  { id: 7, name: "Bà Rịa - Vũng Tàu" },
  { id: 8, name: "Bắc Giang" },
  { id: 9, name: "Bắc Kạn" },
  { id: 10, name: "Bạc Liêu" },
  { id: 11, name: "Bắc Ninh" },
  { id: 12, name: "Bến Tre" },
  { id: 13, name: "Bình Định" }, // Sửa từ Biên Hòa
  { id: 14, name: "Bình Dương" },
  { id: 15, name: "Bình Phước" },
  { id: 16, name: "Bình Thuận" },
  { id: 17, name: "Cà Mau" },
  { id: 18, name: "Cao Bằng" },
  { id: 19, name: "Đắk Lắk" },
  { id: 20, name: "Đắk Nông" },
  { id: 21, name: "Điện Biên" },
  { id: 22, name: "Đồng Nai" },
  { id: 23, name: "Đồng Tháp" },
  { id: 24, name: "Gia Lai" },
  { id: 25, name: "Hà Giang" },
  { id: 26, name: "Hà Nam" },
  { id: 27, name: "Hà Tĩnh" },
  { id: 28, name: "Hải Dương" },
  { id: 29, name: "Hậu Giang" },
  { id: 30, name: "Hòa Bình" },
  { id: 31, name: "Hưng Yên" },
  { id: 32, name: "Khánh Hòa" },
  { id: 33, name: "Kiên Giang" },
  { id: 34, name: "Kon Tum" },
  { id: 35, name: "Lai Châu" },
  { id: 36, name: "Lâm Đồng" },
  { id: 37, name: "Lạng Sơn" },
  { id: 38, name: "Lào Cai" },
  { id: 39, name: "Long An" },
  { id: 40, name: "Nam Định" },
  { id: 41, name: "Nghệ An" },
  { id: 42, name: "Ninh Bình" },
  { id: 43, name: "Ninh Thuận" },
  { id: 44, name: "Phú Thọ" },
  { id: 45, name: "Phú Yên" },
  { id: 46, name: "Quảng Bình" },
  { id: 47, name: "Quảng Nam" },
  { id: 48, name: "Quảng Ngãi" },
  { id: 49, name: "Quảng Ninh" },
  { id: 50, name: "Quảng Trị" },
  { id: 51, name: "Sóc Trăng" },
  { id: 52, name: "Sơn La" },
  { id: 53, name: "Tây Ninh" },
  { id: 54, name: "Thái Bình" },
  { id: 55, name: "Thái Nguyên" },
  { id: 56, name: "Thanh Hóa" },
  { id: 57, name: "Thừa Thiên Huế" },
  { id: 58, name: "Tiền Giang" },
  { id: 59, name: "Trà Vinh" },
  { id: 60, name: "Tuyên Quang" },
  { id: 61, name: "Vĩnh Long" },
  { id: 62, name: "Vĩnh Phúc" },
  { id: 63, name: "Yên Bái" },
];

export const districts = {
  1: [ // Hà Nội
    { id: 1, name: "Hoàn Kiếm" }, { id: 2, name: "Ba Đình" }, { id: 3, name: "Hai Bà Trưng" },
    { id: 4, name: "Đống Đa" }, { id: 5, name: "Tây Hồ" }, { id: 6, name: "Cầu Giấy" },
    { id: 7, name: "Thanh Xuân" }, { id: 8, name: "Hoàng Mai" }, { id: 9, name: "Long Biên" },
    { id: 10, name: "Nam Từ Liêm" }, { id: 11, name: "Bắc Từ Liêm" }, { id: 12, name: "Hà Đông" },
    { id: 13, name: "Sơn Tây" }, { id: 14, name: "Gia Lâm" }, { id: 15, name: "Đông Anh" }
  ],
  2: [ // Hồ Chí Minh
    { id: 1, name: "Quận 1" }, { id: 2, name: "Quận 3" }, { id: 3, name: "Quận 4" },
    { id: 4, name: "Quận 5" }, { id: 5, name: "Quận 6" }, { id: 6, name: "Quận 7" },
    { id: 7, name: "Quận 8" }, { id: 8, name: "Quận 10" }, { id: 9, name: "Quận 11" },
    { id: 10, name: "Quận 12" }, { id: 11, name: "Quận Tân Bình" }, { id: 12, name: "Quận Bình Tân" },
    { id: 13, name: "Quận Bình Thạnh" }, { id: 14, name: "Quận Tân Phú" }, { id: 15, name: "Quận Gò Vấp" },
    { id: 16, name: "Thành phố Thủ Đức" }, { id: 17, name: "Huyện Hóc Môn" }, { id: 18, name: "Huyện Củ Chi" }
  ],
  // ... (Tương tự cho các tỉnh khác)
};

export const wards = {
  "1-1": [ // Hà Nội - Hoàn Kiếm
    { id: 1, name: "Phường Chương Dương" }, { id: 2, name: "Phường Cửa Đông" },
    { id: 3, name: "Phường Cửa Nam" }, { id: 4, name: "Phường Đồng Xuân" },
    { id: 5, name: "Phường Hàng Bạc" }, { id: 6, name: "Phường Hàng Bài" },
    { id: 7, name: "Phường Hàng Bồ" }, { id: 8, name: "Phường Hàng Bông" }
  ],
  "2-16": [ // HCM - Thủ Đức
    { id: 1, name: "Phường Thảo Điền" }, { id: 2, name: "Phường An Phú" },
    { id: 3, name: "Phường Bình Trưng Đông" }, { id: 4, name: "Phường Hiệp Bình Chánh" }
  ]
};