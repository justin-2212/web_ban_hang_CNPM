-- 1. Tạo Database (nếu chưa có)
CREATE DATABASE IF NOT EXISTS BanHangDB;
USE BanHangDB;

-- 2. Tạo bảng TaiKhoan
CREATE TABLE TaiKhoan (
    MaTaiKhoan INT AUTO_INCREMENT PRIMARY KEY,
    Gmail VARCHAR(100) NOT NULL,
    ClerkID VARCHAR(200),
    TenDayDu VARCHAR(100),
    SoDienThoai VARCHAR(13),
    DiaChi VARCHAR(255),
    Quyen SMALLINT,
    TinhTrangTaiKhoan SMALLINT
);

-- 3. Tạo bảng LoaiSanPham
CREATE TABLE LoaiSanPham (
    MaLoai INT AUTO_INCREMENT PRIMARY KEY,
    TenLoai VARCHAR(100),
    ThuTuHienThi INT,
    TinhTrangLoaiSanPham SMALLINT
);

-- 4. Tạo bảng SanPham
CREATE TABLE SanPham (
    MaSP INT AUTO_INCREMENT PRIMARY KEY,
    Ten VARCHAR(100),
    MoTa VARCHAR(255),
    TinhTrangSanPham SMALLINT,
    MaLoai INT,
    FOREIGN KEY (MaLoai) REFERENCES LoaiSanPham(MaLoai)
);

-- 5. Tạo bảng ThongSoMau
CREATE TABLE ThongSoMau (
    MaThongSoMau INT AUTO_INCREMENT PRIMARY KEY,
    TenThongSo VARCHAR(100),
    DonVi VARCHAR(10),
    ThuTuHienThi INT,
    TinhTrangThongSoMau SMALLINT,
    MaLoai INT,
    FOREIGN KEY (MaLoai) REFERENCES LoaiSanPham(MaLoai)
);

-- 6. Tạo bảng GiaTriThongSo
CREATE TABLE GiaTriThongSo (
    MaSP INT,
    MaThongSoMau INT,
    GiaTriHienThi VARCHAR(60),
    GiaTriNhap VARCHAR(50),
    PRIMARY KEY (MaSP, MaThongSoMau),
    FOREIGN KEY (MaSP) REFERENCES SanPham(MaSP),
    FOREIGN KEY (MaThongSoMau) REFERENCES ThongSoMau(MaThongSoMau)
);

-- 7. Tạo bảng BienThe
CREATE TABLE BienThe (
    MaBienThe INT AUTO_INCREMENT PRIMARY KEY,
    TenBienThe VARCHAR(100),
    SoLuongTonKho INT,
    GiaTienBienThe DECIMAL(13,2),
    ThuTuHienThi INT,
    TinhTrangHoatDong SMALLINT,
    DuongDanAnhBienThe VARCHAR(250),
    MaSP INT,
    FOREIGN KEY (MaSP) REFERENCES SanPham(MaSP)
);

-- 8. Tạo bảng ThongSoBienTheMau
CREATE TABLE ThongSoBienTheMau (
    MaThongSoBienTheMau INT AUTO_INCREMENT PRIMARY KEY,
    TenThongSoBienThe VARCHAR(100),
    DonVi VARCHAR(10),
    ThuTuHienThi INT,
    TinhTrangThongSoBienThe SMALLINT,
    MaLoai INT,
    FOREIGN KEY (MaLoai) REFERENCES LoaiSanPham(MaLoai)
);

-- 9. Tạo bảng GiaTriBienThe
CREATE TABLE GiaTriBienThe (
    MaBienThe INT,
    MaThongSoBienTheMau INT,
    GiaTriHienThi VARCHAR(60),
    GiaTriNhap VARCHAR(50),
    ThuTuHienThi INT,
    PRIMARY KEY (MaBienThe, MaThongSoBienTheMau),
    FOREIGN KEY (MaBienThe) REFERENCES BienThe(MaBienThe),
    FOREIGN KEY (MaThongSoBienTheMau) REFERENCES ThongSoBienTheMau(MaThongSoBienTheMau)
);

-- 10. Tạo bảng AnhSP
CREATE TABLE AnhSP (
    MaAnh INT AUTO_INCREMENT PRIMARY KEY,
    DuongDanLuuAnh VARCHAR(250),
    ThuTuHienThi INT,
    MaSP INT,
    FOREIGN KEY (MaSP) REFERENCES SanPham(MaSP)
);

-- 11. Tạo bảng GioHangChiTiet
CREATE TABLE GioHangChiTiet (
    MaTaiKhoan INT,
    MaBienThe INT,
    SoLuong INT,
    ThoiGianThem DATETIME,
    PRIMARY KEY (MaTaiKhoan, MaBienThe),
    FOREIGN KEY (MaTaiKhoan) REFERENCES TaiKhoan(MaTaiKhoan),
    FOREIGN KEY (MaBienThe) REFERENCES BienThe(MaBienThe)
);

-- 12. Tạo bảng DonHang
CREATE TABLE DonHang (
    MaDonHang INT AUTO_INCREMENT PRIMARY KEY,
    MaTaiKhoan INT,
    NgayDat DATETIME,
    TinhTrangDonHang SMALLINT,
    TongTien DECIMAL(13,2),
    PhuongThucThanhToan VARCHAR(50),
    TinhTrangThanhToan SMALLINT,
    FOREIGN KEY (MaTaiKhoan) REFERENCES TaiKhoan(MaTaiKhoan)
);

-- 13. Tạo bảng DonHangChiTiet
CREATE TABLE DonHangChiTiet (
    MaDonHangChiTiet INT AUTO_INCREMENT PRIMARY KEY,
    MaDonHang INT,
    MaBienThe INT,
    SoLuongSanPham INT,
    GiaTienCuaSanPham DECIMAL(13,2),
    FOREIGN KEY (MaDonHang) REFERENCES DonHang(MaDonHang),
    FOREIGN KEY (MaBienThe) REFERENCES BienThe(MaBienThe)
);

-- 14. Tạo bảng ThongTinThanhToanOnline
CREATE TABLE ThongTinThanhToanOnline (
    MaThongTinThanhToanOnline INT AUTO_INCREMENT PRIMARY KEY,
    MaDonHang INT,
    SoTienThanhToan DECIMAL(13,2),
    TinhTrangThanhToan SMALLINT,
    MaGiaoDich VARCHAR(100),
    ThoiDiemThanhToan DATETIME,
    FOREIGN KEY (MaDonHang) REFERENCES DonHang(MaDonHang)
);