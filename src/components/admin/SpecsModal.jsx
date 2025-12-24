// src/components/admin/SpecsModal.jsx

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { giaTriThongSoAPI } from "../../services/adminAPI";

const SpecsModal = ({
  isOpen,
  onClose,
  productId,
  specsList = [],
  existingValues = {},
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [specValues, setSpecValues] = useState({});

  useEffect(() => {
    if (isOpen) {
      setSpecValues(existingValues);
    }
  }, [isOpen, existingValues]);

  const handleChange = (maThongSo, field, value) => {
    setSpecValues((prev) => ({
      ...prev,
      [maThongSo]: {
        ...prev[maThongSo],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const entriesToSave = [];
      for (const [maThongSo, val] of Object.entries(specValues)) {
        if (val.giaTriHienThi || val.giaTriNhap) {
          entriesToSave.push({
            maSP: productId,
            maThongSoMau: parseInt(maThongSo),
            giaTriHienThi: val.giaTriHienThi || "",
            giaTriNhap: val.giaTriNhap || "",
          });
        }
      }

      for (const entry of entriesToSave) {
        await giaTriThongSoAPI.upsert(entry);
      }

      alert("Cập nhật thông số kỹ thuật thành công!");
      onSuccess();
      onClose();
    } catch (err) {
      alert("Lỗi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* 1. Backdrop */}
      <div
        className="absolute inset-0 bg-transparent transition-opacity"
        onClick={onClose}
      ></div>

      {/* 2. Container chính định vị bên phải */}
      <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        {/* 3. Panel Drawer */}
        <div className="w-screen max-w-2xl transform transition ease-in-out duration-500 translate-x-0 bg-white shadow-2xl flex flex-col h-full border-l border-gray-200">
          {/* Header */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-start flex-shrink-0">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Thông số kỹ thuật
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Nhập thông tin chi tiết cho sản phẩm
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {specsList.length === 0 ? (
              <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-lg border border-dashed">
                <p>Chưa có thông số mẫu nào cho loại sản phẩm này.</p>
                <p className="text-sm mt-2">
                  Vui lòng cấu hình ở trang Quản lý Loại Sản Phẩm.
                </p>
              </div>
            ) : (
              specsList.map((spec) => (
                <div
                  key={spec.MaThongSoMau}
                  className="border p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <label className="font-semibold text-gray-800 block mb-3">
                    {spec.TenThongSo} {spec.DonVi ? `(${spec.DonVi})` : ""}
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        placeholder={`Hiển thị (vd: 6.7 ${spec.DonVi || ""})`}
                        value={
                          specValues[spec.MaThongSoMau]?.giaTriHienThi || ""
                        }
                        onChange={(e) =>
                          handleChange(
                            spec.MaThongSoMau,
                            "giaTriHienThi",
                            e.target.value
                          )
                        }
                      />
                      <span className="text-xs text-gray-500 mt-1.5 block">
                        Hiển thị cho khách hàng
                      </span>
                    </div>
                    <div>
                      <input
                        type="text"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        placeholder="Giá trị nhập (vd: 6.7)"
                        value={specValues[spec.MaThongSoMau]?.giaTriNhap || ""}
                        onChange={(e) =>
                          handleChange(
                            spec.MaThongSoMau,
                            "giaTriNhap",
                            e.target.value
                          )
                        }
                      />
                      <span className="text-xs text-gray-500 mt-1.5 block">
                        Dùng để so sánh/tìm kiếm
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3 flex-shrink-0">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium shadow-sm"
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecsModal;
