// src/components/admin/VariantModal.jsx

import React, { useState, useEffect, useRef } from "react";
import { Upload, X } from "lucide-react";
import {
  bienTheAdminAPI,
  giaTriBienTheAPI,
  uploadAPI,
} from "../../services/adminAPI";

const VariantModal = ({
  isOpen,
  onClose,
  productId,
  variant,
  variantSpecs = [],
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    TenBienThe: "",
    SoLuongTonKho: 0,
    GiaTienBienThe: 0,
    DuongDanAnhBienThe: "",
    ThuTuHienThi: 1,
    TinhTrangHoatDong: 1,
    attributes: {},
  });

  useEffect(() => {
    if (isOpen) {
      if (variant) {
        setFormData({
          TenBienThe: variant.TenBienThe,
          SoLuongTonKho: variant.SoLuongTonKho,
          GiaTienBienThe: variant.GiaTienBienThe,
          DuongDanAnhBienThe: variant.DuongDanAnhBienThe || "",
          ThuTuHienThi: variant.ThuTuHienThi,
          TinhTrangHoatDong: variant.TinhTrangHoatDong,
          attributes: {},
        });
        loadAttributes(variant.MaBienThe);
      } else {
        setFormData({
          TenBienThe: "",
          SoLuongTonKho: 0,
          GiaTienBienThe: 0,
          DuongDanAnhBienThe: "",
          ThuTuHienThi: 1,
          TinhTrangHoatDong: 1,
          attributes: {},
        });
      }
    }
  }, [isOpen, variant]);

  const loadAttributes = async (maBienThe) => {
    try {
      const res = await giaTriBienTheAPI.getByVariant(maBienThe);
      if (res.success) {
        const attrs = {};
        res.data.forEach((attr) => {
          attrs[attr.MaThongSoBienTheMau] = {
            giaTriHienThi: attr.GiaTriHienThi,
            giaTriNhap: attr.GiaTriNhap,
          };
        });
        setFormData((prev) => ({ ...prev, attributes: attrs }));
      }
    } catch (err) {
      console.error("Lỗi load thuộc tính:", err);
    }
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!variant) {
      alert("Vui lòng LƯU biến thể trước khi upload ảnh!");
      return;
    }

    try {
      setUploading(true);
      const res = await uploadAPI.uploadAnhBienThe(file, variant.MaBienThe);
      if (res.success) {
        alert("Upload ảnh thành công!");
        setFormData((prev) => ({
          ...prev,
          DuongDanAnhBienThe: res.data.duongDanAnhBienThe,
        }));
      }
    } catch (err) {
      alert("Lỗi upload: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.TenBienThe || !formData.GiaTienBienThe) {
      alert("Vui lòng nhập tên và giá tiền");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        maSP: productId,
        tenBienThe: formData.TenBienThe,
        soLuongTonKho: formData.SoLuongTonKho,
        giaTienBienThe: formData.GiaTienBienThe,
        duongDanAnhBienThe: formData.DuongDanAnhBienThe,
        thuTuHienThi: formData.ThuTuHienThi,
        tinhTrangHoatDong: formData.TinhTrangHoatDong,
      };

      let variantId;
      if (variant) {
        await bienTheAdminAPI.update(variant.MaBienThe, payload);
        variantId = variant.MaBienThe;
      } else {
        const res = await bienTheAdminAPI.create(payload);
        variantId = res.data.maBienThe;
      }

      for (const [maThongSo, val] of Object.entries(formData.attributes)) {
        if (val.giaTriHienThi && val.giaTriNhap) {
          await giaTriBienTheAPI.create({
            maBienThe: variantId,
            maThongSoBienTheMau: parseInt(maThongSo),
            giaTriHienThi: val.giaTriHienThi,
            giaTriNhap: val.giaTriNhap,
            thuTuHienThi: 1,
          });
        }
      }

      alert(variant ? "Cập nhật thành công!" : "Thêm mới thành công!");
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
        {/* 3. Panel Drawer - Tăng max-w lên 3xl cho variant vì nhiều field */}
        <div className="w-screen max-w-3xl transform transition ease-in-out duration-500 translate-x-0 bg-white shadow-2xl flex flex-col h-full border-l border-gray-200">
          {/* Header */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
            <h2 className="text-xl font-bold text-gray-900">
              {variant ? "Chỉnh sửa biến thể" : "Thêm biến thể mới"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto p-6 space-y-6"
          >
            {/* Tên biến thể */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên biến thể <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.TenBienThe}
                onChange={(e) =>
                  setFormData({ ...formData, TenBienThe: e.target.value })
                }
                required
                placeholder="Ví dụ: Màu Đỏ - 128GB"
              />
            </div>

            {/* Giá & Tồn kho */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá tiền <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.GiaTienBienThe}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      GiaTienBienThe: parseInt(e.target.value) || 0,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tồn kho
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.SoLuongTonKho}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      SoLuongTonKho: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            {/* Ảnh biến thể */}
            <div className="border p-4 rounded-lg bg-gray-50 border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Ảnh biến thể
              </label>
              <div className="flex items-center gap-4">
                {formData.DuongDanAnhBienThe ? (
                  <img
                    src={formData.DuongDanAnhBienThe}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-lg border border-gray-300 bg-white"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleUploadImage}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!variant || uploading}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    {uploading ? "Đang upload..." : "Chọn ảnh"}
                  </button>
                  {!variant && (
                    <span className="text-xs text-amber-600 font-medium">
                      Lưu biến thể trước khi upload ảnh
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Thuộc tính biến thể */}
            {variantSpecs.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-800 mb-4 pb-2 border-b">
                  Thuộc tính biến thể
                </h3>
                <div className="space-y-5">
                  {variantSpecs.map((spec) => {
                    const isColor =
                      spec.TenThongSoBienThe.toLowerCase().includes("màu");
                    return (
                      <div key={spec.MaThongSoBienTheMau}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {spec.TenThongSoBienThe}{" "}
                          {spec.DonVi ? `(${spec.DonVi})` : ""}
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder={
                              isColor
                                ? "Tên màu (Đỏ)"
                                : "Giá trị hiển thị (256GB)"
                            }
                            value={
                              formData.attributes[spec.MaThongSoBienTheMau]
                                ?.giaTriHienThi || ""
                            }
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                attributes: {
                                  ...prev.attributes,
                                  [spec.MaThongSoBienTheMau]: {
                                    ...prev.attributes[
                                      spec.MaThongSoBienTheMau
                                    ],
                                    giaTriHienThi: e.target.value,
                                  },
                                },
                              }))
                            }
                          />
                          <input
                            type={isColor ? "color" : "text"}
                            className={`px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                              isColor
                                ? "h-[42px] w-full p-1 cursor-pointer"
                                : ""
                            }`}
                            placeholder={isColor ? "" : "Giá trị nhập (256)"}
                            value={
                              formData.attributes[spec.MaThongSoBienTheMau]
                                ?.giaTriNhap || (isColor ? "#000000" : "")
                            }
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                attributes: {
                                  ...prev.attributes,
                                  [spec.MaThongSoBienTheMau]: {
                                    ...prev.attributes[
                                      spec.MaThongSoBienTheMau
                                    ],
                                    giaTriNhap: e.target.value,
                                  },
                                },
                              }))
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium shadow-sm"
            >
              {loading ? "Đang lưu..." : variant ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VariantModal;
