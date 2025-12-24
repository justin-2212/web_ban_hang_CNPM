// src/components/admin/CreateProductModal.jsx

import React, { useState, useEffect } from "react";
import { sanPhamAdminAPI } from "../../services/adminAPI";
import { loaiSanPhamAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";

const CreateProductModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    Ten: "",
    MoTa: "",
    MaLoai: "",
    TinhTrangSanPham: 1,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        try {
          const res = await loaiSanPhamAPI.getAll();
          if (res.success) {
            setCategories(res.data);
          }
        } catch (err) {
          console.error("Lỗi lấy danh mục:", err);
        }
      };
      fetchCategories();
      setFormData({ Ten: "", MoTa: "", MaLoai: "", TinhTrangSanPham: 1 });
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));

    setFormData((prev) => ({
      ...prev,
      [name]: name === "TinhTrangSanPham" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.Ten.trim())
      newErrors.Ten = "Tên sản phẩm không được để trống";
    if (!formData.MaLoai) newErrors.MaLoai = "Vui lòng chọn loại sản phẩm";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await sanPhamAdminAPI.create(formData);

      if (res.success) {
        alert("Tạo sản phẩm thành công! Vui lòng thêm ảnh và biến thể.");
        onClose();
        navigate(`/admin/products/${res.data.maSP}`);
      }
    } catch (error) {
      const msg = error.message || "Có lỗi xảy ra";
      alert("Lỗi: " + msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* 1. Backdrop (Lớp phủ mờ) - Nếu muốn trong suốt hoàn toàn thì bỏ bg-black bg-opacity-30 */}
      <div
        className="absolute inset-0 bg-transparent transition-opacity"
        onClick={onClose}
      ></div>

      {/* 2. Container chính định vị bên phải */}
      <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        {/* 3. Panel Drawer */}
        <div className="w-screen max-w-md transform transition ease-in-out duration-500 translate-x-0 bg-white shadow-2xl flex flex-col h-full border-l border-gray-200">
          {/* Header */}
          <div className="px-4 py-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">
              Thêm Sản Phẩm Mới
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Đóng</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Form Content */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto p-6 space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên sản phẩm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="Ten"
                value={formData.Ten}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none ${
                  errors.Ten ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Nhập tên sản phẩm..."
              />
              {errors.Ten && (
                <p className="text-red-500 text-xs mt-1">{errors.Ten}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại sản phẩm <span className="text-red-500">*</span>
              </label>
              <select
                name="MaLoai"
                value={formData.MaLoai}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none ${
                  errors.MaLoai ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">-- Chọn loại --</option>
                {categories.map((cat) => (
                  <option key={cat.MaLoai} value={cat.MaLoai}>
                    {cat.TenLoai}
                  </option>
                ))}
              </select>
              {errors.MaLoai && (
                <p className="text-red-500 text-xs mt-1">{errors.MaLoai}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả
              </label>
              <textarea
                name="MoTa"
                rows="4"
                value={formData.MoTa}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Mô tả chi tiết..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                name="TinhTrangSanPham"
                value={formData.TinhTrangSanPham}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value={1}>Đang kinh doanh</option>
                <option value={0}>Ngừng kinh doanh</option>
              </select>
            </div>
          </form>

          {/* Footer */}
          <div className="border-t border-gray-200 px-4 py-4 bg-gray-50 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Đang tạo..." : "Tạo & Tiếp tục"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProductModal;
