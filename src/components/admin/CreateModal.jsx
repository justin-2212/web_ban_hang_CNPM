import React, { useState, useEffect } from "react";
import categoryServiceAdmin from "../../services/categoryServiceAdmin";

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

  const [errors, setErrors] = useState({});
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
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Xóa error khi user bắt đầu sửa
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    setFormData((prev) => {
      if (name === "thuTuHienThi") {
        if (value === "") return { ...prev, [name]: "" };
        return { ...prev, [name]: parseInt(value) };
      }
      return { ...prev, [name]: value };
    });
  };

  // ============ KIỂM TRA TRÙNG TÊN ============
  const checkDuplicateName = (tenMoi, idDangSua = null) => {
    return existingCategories.some((cat) => {
      // Nếu đang sửa, bỏ qua item hiện tại
      if (idDangSua && cat.MaLoai === idDangSua) {
        return false;
      }
      // So sánh tên (không phân biệt hoa/thường, loại bỏ khoảng trắng)
      return cat.TenLoai.trim().toLowerCase() === tenMoi.trim().toLowerCase();
    });
  };

  // ============ KIỂM TRA TRÙNG THỨ TỰ ============
  const checkDuplicateOrder = (thuTuMoi, idDangSua = null) => {
    return existingCategories.some((cat) => {
      // Nếu đang sửa, bỏ qua item hiện tại
      if (idDangSua && cat.MaLoai === idDangSua) {
        return false;
      }
      return cat.ThuTuHienThi === thuTuMoi;
    });
  };

  // ============ TÍNH TOÁN SỐ THỨ TỰ GỢI Ý ============
  const getNextAvailableOrder = () => {
    if (existingCategories.length === 0) return 0;
    return Math.max(...existingCategories.map((cat) => cat.ThuTuHienThi)) + 1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ---  VALIDATION (Kiểm tra dữ liệu trước) ---
    const newErrors = {};

    // Kiểm tra tên
    if (!formData.tenLoai.trim()) {
      newErrors.tenLoai = "Tên loại không được để trống";
    }

    // KIỂM TRA TRÙNG TÊN
    if (formData.tenLoai.trim()) {
      if (checkDuplicateName(formData.tenLoai, initialData?.MaLoai)) {
        newErrors.tenLoai = `Loại sản phẩm "${formData.tenLoai.trim()}" đã tồn tại`;
      }
    }

    // Kiểm tra thứ tự
    let orderToCheck = 0;
    if (formData.thuTuHienThi === "" || formData.thuTuHienThi === "-") {
      newErrors.thuTuHienThi = "Không được bỏ trống";
    } else {
      orderToCheck = parseInt(formData.thuTuHienThi);
      if (orderToCheck < 0) {
        newErrors.thuTuHienThi = "Thứ tự phải là số không âm (>= 0)";
      }
    }

    //  KIỂM TRA TRÙNG THỨ TỰ
    if (
      orderToCheck >= 0 &&
      checkDuplicateOrder(orderToCheck, initialData?.MaLoai)
    ) {
      const nextOrder = getNextAvailableOrder();
      newErrors.thuTuHienThi = `Thứ tự ${orderToCheck} đã tồn tại! Gợi ý: ${nextOrder}`;
    }

    // Nếu có lỗi thì dừng lại, không gửi server
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // ----------------------------------------------

    setLoading(true);

    try {
      // Chuẩn bị payload (đảm bảo thứ tự là số chuẩn)
      const payload = { ...formData, thuTuHienThi: orderToCheck };

      if (initialData) {
        await categoryServiceAdmin.update(initialData.MaLoai, payload);
        alert(`Đã cập nhật loại sản phẩm "${formData.tenLoai}" thành công!`);
      } else {
        await categoryServiceAdmin.create(payload);
        alert(`Đã thêm loại sản phẩm "${formData.tenLoai}" thành công!`);
      }
      onSuccess();
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response?.data?.message || error.message || "Có lỗi xảy ra";
      alert(
        `${initialData ? "Lỗi cập nhật" : "Lỗi thêm mới"}: ${errorMessage}`
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

          {/* FORM */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
            <div className="space-y-6 px-4 py-6 sm:px-6">
              {/* Tên loại sản phẩm */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên loại sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="tenLoai"
                  value={formData.tenLoai}
                  onChange={handleChange}
                  placeholder="vd: iPhone, iPad, MacBook"
                  className={`w-full border rounded-md shadow-sm px-4 py-3 focus:outline-none focus:ring-2 ${
                    errors.tenLoai
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
                {/*  HIỂN THỊ LỖI TÊN DƯỚI INPUT */}
                {errors.tenLoai && (
                  <p className="text-red-500 text-xs mt-1">{errors.tenLoai}</p>
                )}
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
                  className={`w-full border rounded-md shadow-sm px-4 py-3 focus:outline-none focus:ring-2 ${
                    errors.thuTuHienThi
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
                {/*  HIỂN THỊ LỖI THỨ TỰ DƯỚI INPUT */}
                {errors.thuTuHienThi ? (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.thuTuHienThi}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 mt-2">
                    Số nhỏ hiển thị trước. Không được trùng nhau.
                  </p>
                )}
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
            </div>
          </form>

          {/* FOOTER Drawer - Cố định ở đáy */}
          <div className="border-t border-gray-200 px-4 py-4 sm:px-6 bg-gray-50 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? initialData
                  ? "Đang cập nhật..."
                  : "Đang thêm..."
                : initialData
                ? "Cập nhật"
                : "Thêm mới"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateModal;
