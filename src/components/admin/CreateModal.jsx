// src/components/admin/CreateModal.jsx

import React, { useState, useEffect } from "react";

import categoryService from "../../services/categoryService";

const CreateModal = ({
  isOpen,
  onClose,
  initialData,
  onSuccess,
  existingCategories = [],
}) => {
  const [formData, setFormData] = useState({
    tenLoai: "",
    thuTuHienThi: 0,
    tinhTrang: 1,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        tenLoai: initialData.TenLoai,
        thuTuHienThi: initialData.ThuTuHienThi,
        tinhTrang: initialData.TinhTrangLoaiSanPham,
      });
    } else {
      setFormData({ tenLoai: "", thuTuHienThi: 0, tinhTrang: 1 });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "tenLoai" ? value : parseInt(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // --- LOGIC KIỂM TRA TRÙNG THỨ TỰ ---
    const orderToCheck = parseInt(formData.thuTuHienThi);

    // Tìm xem có loại nào đã dùng số thứ tự này chưa
    const isDuplicate = existingCategories.some((cat) => {
      // Nếu đang Sửa (Edit mode), phải bỏ qua chính nó (không so sánh với chính mình)
      if (initialData && cat.MaLoai === initialData.MaLoai) {
        return false;
      }
      // So sánh thứ tự
      return cat.ThuTuHienThi === orderToCheck;
    });

    if (isDuplicate) {
      // 1. Tìm số thứ tự lớn nhất hiện có trong danh sách
      // Nếu danh sách rỗng thì mặc định là 0
      const maxOrder =
        existingCategories.length > 0
          ? Math.max(...existingCategories.map((c) => c.ThuTuHienThi))
          : 0;

      // 2. Hiển thị thông báo kèm gợi ý số lớn nhất
      alert(
        `Thứ tự hiển thị "${orderToCheck}" đã tồn tại! Vui lòng chọn số khác.\nSố thứ tự lớn nhất hiện tại là: ${maxOrder}`
      );

      setLoading(false);
      return;
    }

    try {
      if (initialData) {
        await categoryService.update(initialData.MaLoai, formData);
      } else {
        await categoryService.create(formData);
      }
      onSuccess();
      alert(initialData ? "Cập nhật thành công!" : "Thêm mới thành công!");
    } catch (error) {
      console.error(error);
      alert(
        "Có lỗi xảy ra: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">

      {/* Container của Drawer - Cố định bên phải */}
      <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        {/* Nội dung chính của Form */}
        <div className="w-screen max-w-md transform transition ease-in-out duration-500 sm:duration-700 translate-x-0 bg-white shadow-2xl flex flex-col h-full border-l border-gray-200">
          {/* HEADER Drawer */}
          <div className="px-4 py-6 bg-gray-50 border-b border-gray-200 sm:px-6 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              {initialData
                ? "Cập nhật Loại Sản Phẩm"
                : "Thêm Loại Sản Phẩm Mới"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <span className="sr-only">Đóng</span>
              {/* Icon X lớn hơn một chút */}
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* BODY Drawer - Có thanh cuộn nếu nội dung dài */}
          <div className="flex-1 h-full overflow-y-auto p-6">
            <form
              id="drawer-form"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Tên loại */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên loại <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="tenLoai"
                  value={formData.tenLoai}
                  onChange={handleChange}
                  placeholder="VD: Điện thoại, Laptop..."
                  required
                  className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Thứ tự hiển thị */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thứ tự hiển thị
                </label>
                <input
                  type="number"
                  name="thuTuHienThi"
                  value={formData.thuTuHienThi}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Số nhỏ hiển thị trước. Không được trùng nhau.
                </p>
              </div>

              {/* Tình trạng */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tình trạng kinh doanh
                </label>
                <select
                  name="tinhTrang"
                  value={formData.tinhTrang}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={1}>Đang kinh doanh</option>
                  <option value={0}>Ngừng kinh doanh</option>
                </select>
              </div>
            </form>
          </div>

          {/* FOOTER Drawer - Cố định ở đáy */}
          <div className="border-t border-gray-200 px-4 py-4 sm:px-6 bg-gray-50 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
              Hủy
            </button>
            <button
              type="submit"
              form="drawer-form" // Link button này với form ở trên
              disabled={loading}
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none disabled:bg-blue-300"
            >
              {loading ? "Đang lưu..." : initialData ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateModal;
