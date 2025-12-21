// src/components/admin/SpecManager.jsx
import React, { useState } from "react";

// 1. Thêm prop onRestore
const SpecManager = ({
  data,
  onAdd,
  onDelete,
  onRestore,
  onUpdate,
  loading,
  type,
}) => {
  // State lưu ID đang sửa (null = thêm mới, có ID = đang sửa)
  const [editingId, setEditingId] = useState(null);
  // 1. Lưu trữ lỗi của các trường
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    ten: "",
    donVi: "",
    thuTu: 0,
    tinhTrang: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    setFormData((prev) => {
      if (name === "thuTu") {
        if (value === "") return { ...prev, [name]: "" };
        if (value === "-") return { ...prev, [name]: "-" };
        return { ...prev, [name]: parseInt(value) };
      }
      // Các trường khác xử lý bình thường
      return {
        ...prev,
        [name]: name === "tinhTrang" ? parseInt(value) : value,
      };
    });
  };

  const handleStartEdit = (item) => {
    const id = type === "tech" ? item.MaThongSoMau : item.MaThongSoBienTheMau;
    const ten = type === "tech" ? item.TenThongSo : item.TenThongSoBienThe;
    const status =
      type === "tech" ? item.TinhTrangThongSoMau : item.TinhTrangThongSoBienThe;

    // Đẩy dữ liệu lên form
    setEditingId(id);
    setErrors({}); // Reset lỗi khi bấm sửa dòng khác
    setFormData({
      ten: ten,
      donVi: item.DonVi || "",
      thuTu: item.ThuTuHienThi || 0,
      tinhTrang: status,
    });
  };

  // Hàm Hủy sửa -> Quay về thêm mới
  const handleCancelEdit = () => {
    setEditingId(null);
    setErrors({}); // Reset lỗi khi hủy
    setFormData({ ten: "", donVi: "", thuTu: 0, tinhTrang: 1 });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Tạo object chứa lỗi mới
    const newErrors = {};

    // 2. VALIDATION (Kiểm tra dữ liệu)

    // Kiểm tra tên
    if (!formData.ten.trim()) {
      newErrors.ten = "Tên không được để trống";
    }

    // Kiểm tra thứ tự (Rỗng, dấu -, hoặc số âm)
    let orderToCheck = 0;
    if (formData.thuTu === "" || formData.thuTu === "-") {
      newErrors.thuTu = "Không được bỏ trống"; // Lỗi 1: Bỏ trống
    } else {
      orderToCheck = parseInt(formData.thuTu);
      if (orderToCheck < 0) {
        newErrors.thuTu = "Phải là số không âm"; // Lỗi 2: Số âm
      }
    }

    // Nếu có lỗi -> Set state errors và dừng lại
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 3. KIỂM TRA TRÙNG LẶP (Logic cũ)
    const isDuplicate = data.some((item) => {
      const itemId =
        type === "tech" ? item.MaThongSoMau : item.MaThongSoBienTheMau;
      const itemOrder = item.ThuTuHienThi;

      if (editingId && itemId === editingId) return false;
      return itemOrder === orderToCheck;
    });

    if (isDuplicate) {
      const maxOrder =
        data.length > 0 ? Math.max(...data.map((c) => c.ThuTuHienThi)) : 0;
      // Vẫn dùng alert cho lỗi Logic trùng lặp (hoặc có thể đưa vào setErrors nếu muốn)
      alert(
        `Thứ tự "${orderToCheck}" đã trùng! Số lớn nhất hiện tại: ${maxOrder}`
      );
      return;
    }

    // Gửi dữ liệu đi
    const payload = { ...formData, thuTu: orderToCheck };

    if (editingId) {
      onUpdate(editingId, payload);
      handleCancelEdit();
    } else {
      onAdd(payload);
      setFormData({ ten: "", donVi: "", thuTu: 0, tinhTrang: 1 });
      setErrors({}); // Reset lỗi sau khi thêm thành công
    }
  };

  return (
    <div className="space-y-6">
      <div
        className={`p-4 rounded-lg border ${
          editingId
            ? "bg-blue-50 border-blue-200"
            : "bg-gray-50 border-gray-200"
        } transition-colors`}
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold text-gray-700 uppercase">
            {editingId
              ? "Cập nhật thông số"
              : `Thêm ${
                  type === "tech" ? "Thông số kỹ thuật" : "Thuộc tính biến thể"
                } mới`}
          </h3>
          {editingId && (
            <button
              onClick={handleCancelEdit}
              className="text-xs text-red-500 hover:underline"
            >
              Hủy chỉnh sửa
            </button>
          )}
        </div>

        {/* Sửa className: items-end -> items-start để thông báo lỗi không làm lệch hàng */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 items-start"
        >
          <div className="flex-1 w-full">
            <label className="text-xs text-gray-500 mb-1 block">
              Tên thông số <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="ten"
              value={formData.ten}
              onChange={handleChange}
              // Thêm logic viền đỏ khi có lỗi
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                errors.ten
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              }`}
            />
            {/* Hiển thị lỗi Tên */}
            {errors.ten && (
              <p className="text-red-500 text-xs mt-1">{errors.ten}</p>
            )}
          </div>

          <div className="w-24">
            <label className="text-xs text-gray-500 mb-1 block">Đơn vị</label>
            <input
              type="text"
              name="donVi"
              value={formData.donVi}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Ô THỨ TỰ (Có hiển thị lỗi) */}
          <div className="w-24">
            <label className="text-xs text-gray-500 mb-1 block">Thứ tự</label>
            <input
              type="number"
              name="thuTu"
              value={formData.thuTu}
              onChange={handleChange}
              // Thêm logic viền đỏ
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                errors.thuTu
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              }`}
            />
            {/* 3. HIỂN THỊ DÒNG LỖI BÊN DƯỚI */}
            {errors.thuTu && (
              <p className="text-red-500 text-[10px] mt-1 leading-tight">
                {errors.thuTu}
              </p>
            )}
          </div>

          <div className="w-32">
            <label className="text-xs text-gray-500 mb-1 block">
              Tình trạng
            </label>
            <select
              name="tinhTrang"
              value={formData.tinhTrang}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value={1}>Hoạt động</option>
              <option value={0}>Tạm ẩn</option>
            </select>
          </div>

          {/* Wrapper button để canh chỉnh vertical center với input */}
          <div className="h-[62px] flex items-center pt-6">
            <button
              type="submit"
              disabled={loading}
              className={`${
                editingId
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white px-4 py-2 rounded text-sm font-medium disabled:bg-gray-300 whitespace-nowrap transition-colors`}
            >
              {loading ? "Lưu..." : editingId ? "Cập nhật" : "Thêm"}
            </button>
          </div>
        </form>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 font-medium">
            <tr>
              <th className="p-3">Tên thông số</th>
              <th className="p-3">Đơn vị</th>
              <th className="p-3 text-center">Thứ tự</th>
              <th className="p-3 text-center">Trạng thái</th>
              <th className="p-3 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="p-4 text-center text-gray-400 italic"
                >
                  Chưa có thông số nào.
                </td>
              </tr>
            ) : (
              data.map((item) => {
                const status =
                  type === "tech"
                    ? item.TinhTrangThongSoMau
                    : item.TinhTrangThongSoBienThe;
                const id =
                  type === "tech"
                    ? item.MaThongSoMau
                    : item.MaThongSoBienTheMau;

                return (
                  <tr
                    key={id}
                    className={`hover:bg-gray-50 ${
                      editingId === id ? "bg-blue-50" : ""
                    }`}
                  >
                    <td className="p-3 font-medium text-gray-800">
                      {item.TenThongSo || item.TenThongSoBienThe}
                    </td>
                    <td className="p-3 text-gray-500">{item.DonVi || "-"}</td>
                    <td className="p-3 text-center">{item.ThuTuHienThi}</td>
                    <td className="p-3 text-center">
                      {status === 1 ? (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                          Hiện
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">
                          Ẩn
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleStartEdit(item)}
                        className="text-blue-500 hover:bg-blue-50 p-1.5 rounded"
                        title="Sửa"
                      >
                        ✏️
                      </button>
                      {status === 1 ? (
                        <button
                          onClick={() => onDelete(id)}
                          className="text-red-500 hover:bg-red-50 p-1.5 rounded"
                          title="Xóa"
                        >
                          🗑️
                        </button>
                      ) : (
                        <button
                          onClick={() => onRestore(id)}
                          className="text-yellow-600 hover:bg-yellow-50 p-1.5 rounded"
                          title="Khôi phục"
                        >
                          🔄
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpecManager;
