import React, { useState } from "react";
import { Edit, Eye, EyeOff } from "lucide-react";

const SpecManager = ({
  type,
  data,
  onAdd,
  onDelete,
  onRestore,
  onUpdate,
  loading,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    ten: "",
    donVi: "",
    thuTu: 0,
    tinhTrang: 1,
  });

  // ============ HANDLERS ============
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    setFormData((prev) => {
      if (name === "thuTu") {
        if (value === "") return { ...prev, [name]: "" };
        return { ...prev, [name]: parseInt(value) };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleStartEdit = (item) => {
    const status =
      type === "tech"
        ? item.TinhTrangThongSoMau
        : item.TinhTrangThongSoBienThe;
    setEditingId(
      type === "tech" ? item.MaThongSoMau : item.MaThongSoBienTheMau
    );
    setErrors({});
    setFormData({
      ten: type === "tech" ? item.TenThongSo : item.TenThongSoBienThe,
      donVi: item.DonVi || "",
      thuTu: item.ThuTuHienThi || 0,
      tinhTrang: status,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setErrors({});
    setFormData({ ten: "", donVi: "", thuTu: 0, tinhTrang: 1 });
  };

  // ============ KIỂM TRA TRÙNG LẶP TÊN ============
  const checkDuplicateName = (tenMoi, idDangSua = null) => {
    return data.some((item) => {
      const tenItemHienTai =
        type === "tech" ? item.TenThongSo : item.TenThongSoBienThe;
      const idItem =
        type === "tech" ? item.MaThongSoMau : item.MaThongSoBienTheMau;

      // Nếu đang sửa, bỏ qua item hiện tại
      if (idDangSua && idItem === idDangSua) {
        return false;
      }

      // So sánh tên (không phân biệt hoa/thường, loại bỏ khoảng trắng)
      return (
        tenItemHienTai.trim().toLowerCase() ===
        tenMoi.trim().toLowerCase()
      );
    });
  };

  // ============ KIỂM TRA TRÙNG THỨ TỰ ============
  const checkDuplicateOrder = (thuTuMoi, idDangSua = null) => {
    return data.some((item) => {
      const thuTuItem = item.ThuTuHienThi;
      const idItem =
        type === "tech" ? item.MaThongSoMau : item.MaThongSoBienTheMau;

      // Nếu đang sửa, bỏ qua item hiện tại
      if (idDangSua && idItem === idDangSua) {
        return false;
      }

      return thuTuItem === thuTuMoi;
    });
  };

  // ============ TÍNH TOÁN SỐ THỨ TỰ GỢI Ý ============
  const getNextAvailableOrder = () => {
    if (data.length === 0) return 0;
    return Math.max(...data.map((item) => item.ThuTuHienThi)) + 1;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validation: Tên không được để trống
    if (!formData.ten.trim()) {
      newErrors.ten = "Tên không được để trống";
    }

    //  KIỂM TRA TRÙNG TÊN
    if (formData.ten.trim()) {
      if (checkDuplicateName(formData.ten, editingId)) {
        newErrors.ten = `Thông số "${formData.ten.trim()}" đã tồn tại`;
      }
    }

    // Validation: Thứ tự
    if (formData.thuTu === "" || formData.thuTu === "-") {
      newErrors.thuTu = "Không được bỏ trống";
    } else {
      const orderToCheck = parseInt(formData.thuTu);
      if (orderToCheck < 0) {
        newErrors.thuTu = "Phải là số không âm";
      }

      //  KIỂM TRA TRÙNG THỨ TỰ
      if (orderToCheck >= 0 && checkDuplicateOrder(orderToCheck, editingId)) {
        const nextOrder = getNextAvailableOrder();
        newErrors.thuTu = `Thứ tự ${orderToCheck} đã tồn tại! Gợi ý: ${nextOrder}`;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      ten: formData.ten.trim(),
      donVi: formData.donVi.trim(),
      thuTu: formData.thuTu || 0,
      tinhTrang: formData.tinhTrang,
    };

    if (editingId) {
      onUpdate(editingId, payload);
    } else {
      onAdd(payload);
    }

    handleCancelEdit();
  };

  // ============ RENDER ============
  return (
    <div className="space-y-6">
      {/* ========== FORM THÊM/SỬA ========== */}
      <div
        className={`p-4 rounded-lg border transition-colors ${
          editingId
            ? "bg-orange-50 border-orange-200"
            : "bg-gray-50 border-gray-200"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-gray-700 uppercase">
            {editingId ? "✏️ Cập nhật thông số" : "➕ Thêm thông số mới"}
          </h3>
          {editingId && (
            <button
              onClick={handleCancelEdit}
              className="text-xs text-red-500 hover:text-red-700 font-medium"
            >
              Hủy chỉnh sửa
            </button>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 items-start"
        >
          {/* Tên */}
          <div className="flex-1 w-full">
            <label className="text-xs text-gray-500 mb-1 block">
              Tên thông số <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="ten"
              value={formData.ten}
              onChange={handleChange}
              placeholder="vd: RAM, Màu sắc, Kích thước"
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                errors.ten
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              }`}
            />
            {errors.ten && (
              <p className="text-red-500 text-xs mt-1">{errors.ten}</p>
            )}
          </div>

          {/* Đơn vị */}
          <div className="w-24">
            <label className="text-xs text-gray-500 mb-1 block">Đơn vị</label>
            <input
              type="text"
              name="donVi"
              value={formData.donVi}
              onChange={handleChange}
              placeholder="vd: GB, inch"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Thứ tự */}
          <div className="w-24">
            <label className="text-xs text-gray-500 mb-1 block">Thứ tự</label>
            <input
              type="number"
              name="thuTu"
              value={formData.thuTu}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                errors.thuTu
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              }`}
            />
            {errors.thuTu && (
              <p className="text-red-500 text-[10px] mt-1">{errors.thuTu}</p>
            )}
          </div>

          {/* Trạng thái */}
          <div className="w-32">
            <label className="text-xs text-gray-500 mb-1 block">
              Trạng thái
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

          {/* Nút Submit */}
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

      {/* ========== BẢNG HIỂN THỊ ========== */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 font-medium uppercase text-xs">
            <tr>
              <th className="p-3">Tên thông số</th>
              <th className="p-3">Đơn vị</th>
              <th className="p-3 text-center">Thứ tự</th>
              <th className="p-3 text-center">Trạng thái</th>
              <th className="p-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="p-4 text-center text-gray-400 italic"
                >
                  Chưa có thông số nào
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
                const tenThongSo =
                  type === "tech" ? item.TenThongSo : item.TenThongSoBienThe;

                return (
                  <tr
                    key={id}
                    className={`hover:bg-gray-50 transition ${
                      editingId === id ? "bg-orange-50" : ""
                    }`}
                  >
                    <td className="p-3 font-medium text-gray-900">
                      {tenThongSo}
                    </td>
                    <td className="p-3 text-gray-600">{item.DonVi || "-"}</td>
                    <td className="p-3 text-center text-gray-600">
                      {item.ThuTuHienThi}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          status === 1
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {status === 1 ? "Hoạt động" : "Ẩn"}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Nút Edit */}
                        <button
                          onClick={() => handleStartEdit(item)}
                          title="Chỉnh sửa"
                          className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Nút Delete/Restore */}
                        {status === 1 ? (
                          <button
                            onClick={() => onDelete(id)}
                            title="Ẩn"
                            disabled={loading}
                            className="p-2 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition disabled:opacity-50"
                          >
                            <EyeOff className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => onRestore(id)}
                            title="Hiển thị"
                            disabled={loading}
                            className="p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition disabled:opacity-50"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                      </div>
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