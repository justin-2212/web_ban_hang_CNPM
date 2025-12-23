// src/components/admin/ConfigDrawer.jsx
import React, { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import thongSoServiceAdmin from "../../services/thongSoServiceAdmin";
import SpecManager from "./SpecManager";

const ConfigDrawer = ({ isOpen, onClose, category }) => {
  const [activeTab, setActiveTab] = useState("tech");
  const [specs, setSpecs] = useState([]);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ============ FETCH DATA ============
  useEffect(() => {
    if (isOpen && category) {
      fetchData();
    }
  }, [isOpen, category]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [specRes, variantRes] = await Promise.all([
        thongSoServiceAdmin.getSpecs(category.MaLoai),
        thongSoServiceAdmin.getVariants(category.MaLoai),
      ]);
      setSpecs(specRes.data || []);
      setVariants(variantRes.data || []);
    } catch (err) {
      setError("Không thể tải cấu hình. Vui lòng thử lại.");
      console.error("Error loading specs:", err);
    } finally {
      setLoading(false);
    }
  };

  // ============ HANDLERS ============
  const handleAdd = async (formData) => {
    setLoading(true);
    try {
      const payload = { ...formData, maLoai: category.MaLoai };

      if (activeTab === "tech") {
        await thongSoServiceAdmin.createSpec(payload);
        //  THÔNG BÁO THÊM THÀNH CÔNG (Tech Spec)
        alert(`Đã thêm thông số "${formData.ten}" thành công!`);
      } else {
        await thongSoServiceAdmin.createVariant(payload);
        //  THÔNG BÁO THÊM THÀNH CÔNG (Variant)
        alert(`Đã thêm thuộc tính biến thể "${formData.ten}" thành công!`);
      }

      await fetchData();
    } catch (error) {
      //  THÔNG BÁO LỖI THÊM
      const errorMessage =
        error.response?.data?.message || error.message || "Có lỗi xảy ra";
      alert(` Lỗi thêm mới: ${errorMessage}`);
      console.error("Error adding:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có muốn ẩn thông số này?")) return;

    setLoading(true);
    try {
      if (activeTab === "tech") {
        await thongSoServiceAdmin.deleteSpec(id);
      } else {
        await thongSoServiceAdmin.deleteVariant(id);
      }
      await fetchData();
    } catch (error) {
      //  THÔNG BÁO LỖI XÓA
      const errorMessage =
        error.response?.data?.message || error.message || "Có lỗi xảy ra";
      alert(` Lỗi ẩn: ${errorMessage}`);
      console.error("Error deleting:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id) => {
    if (!window.confirm("Bạn có muốn khôi phục thông số này?")) return;

    setLoading(true);
    try {
      if (activeTab === "tech") {
        await thongSoServiceAdmin.restoreSpec(id);
      } else {
        await thongSoServiceAdmin.restoreVariant(id);
      }
      await fetchData();
      //  THÔNG BÁO KHÔI PHỤC THÀNH CÔNG
      alert("Đã khôi phục thông số thành công!");
    } catch (error) {
      //  THÔNG BÁO LỖI KHÔI PHỤC
      const errorMessage =
        error.response?.data?.message || error.message || "Có lỗi xảy ra";
      alert(`Lỗi khôi phục: ${errorMessage}`);
      console.error("Error restoring:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, formData) => {
    setLoading(true);
    try {
      if (activeTab === "tech") {
        await thongSoServiceAdmin.updateSpec(id, formData);
        // THÔNG BÁO CẬP NHẬT THÀNH CÔNG (Tech Spec)
        alert(`Đã cập nhật thông số "${formData.ten}" thành công!`);
      } else {
        await thongSoServiceAdmin.updateVariant(id, formData);
        // THÔNG BÁO CẬP NHẬT THÀNH CÔNG (Variant)
        alert(`Đã cập nhật thuộc tính biến thể "${formData.ten}" thành công!`);
      }
      await fetchData();
    } catch (error) {
      // THÔNG BÁO LỖI CẬP NHẬT
      const errorMessage =
        error.response?.data?.message || error.message || "Có lỗi xảy ra";
      alert(`Lỗi cập nhật: ${errorMessage}`);
      console.error("Error updating:", error);
    } finally {
      setLoading(false);
    }
  };

  // === [MỚI] XỬ LÝ XÓA CỨNG ===
  const handleHardDelete = async (id, ten) => {
    if (
      !window.confirm(
        `CẢNH BÁO: Bạn muốn XÓA VĨNH VIỄN "${ten}"?\nHành động này không thể hoàn tác!`
      )
    )
      return;

    setLoading(true);
    try {
      if (activeTab === "tech") {
        await thongSoServiceAdmin.hardDeleteSpec(id);
      } else {
        await thongSoServiceAdmin.hardDeleteVariant(id);
      }
      await fetchData(); // Load lại dữ liệu
      alert(`Đã xóa vĩnh viễn "${ten}" thành công!`);
    } catch (error) {
      // Thông báo lỗi từ Backend (ví dụ: đang có dữ liệu phụ thuộc)
      const errorMessage =
        error.response?.data?.message || error.message || "Có lỗi xảy ra";
      alert(`Không thể xóa: ${errorMessage}`);
      console.error("Error hard deleting:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-transparent transition-opacity"
        onClick={onClose}
      ></div>

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        <div className="w-screen max-w-3xl transform transition ease-in-out duration-500 translate-x-0 bg-white shadow-2xl flex flex-col h-full">
          {/* ========== HEADER ========== */}
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 flex justify-between items-start">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Cấu hình: {category?.TenLoai}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Quản lý thông số kỹ thuật và thuộc tính biến thể
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* ========== TABS ========== */}
          <div className="flex border-b border-gray-200 bg-white">
            <button
              onClick={() => setActiveTab("tech")}
              className={`flex-1 py-3 px-4 text-sm font-medium text-center border-b-2 transition-all ${
                activeTab === "tech"
                  ? "border-blue-600 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              📋 Thông số kỹ thuật
            </button>
            <button
              onClick={() => setActiveTab("variant")}
              className={`flex-1 py-3 px-4 text-sm font-medium text-center border-b-2 transition-all ${
                activeTab === "variant"
                  ? "border-purple-600 text-purple-600 bg-purple-50"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              🎨 Thuộc tính biến thể
            </button>
          </div>

          {/* ========== ERROR MESSAGE ========== */}
          {error && (
            <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* ========== CONTENT ========== */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading &&
            Object.keys(specs).length === 0 &&
            Object.keys(variants).length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <SpecManager
                type={activeTab}
                data={activeTab === "tech" ? specs : variants}
                onAdd={handleAdd}
                onDelete={handleDelete}
                onRestore={handleRestore}
                onHardDelete={handleHardDelete}
                onUpdate={handleUpdate}
                loading={loading}
              />
            )}
          </div>

          {/* ========== FOOTER ========== */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full px-4 py-2.5 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors font-medium text-sm"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigDrawer;
