// src/components/admin/ConfigDrawer.jsx
import React, { useState, useEffect } from "react";
import thongSoServiceAdmin from "../../services/thongSoServiceAdmin"; // Import service mới
import SpecManager from "./SpecManager";

const ConfigDrawer = ({ isOpen, onClose, category }) => {
  const [activeTab, setActiveTab] = useState("tech"); // 'tech' | 'variant'
  const [specs, setSpecs] = useState([]); // Dữ liệu Tab 1
  const [variants, setVariants] = useState([]); // Dữ liệu Tab 2
  const [loading, setLoading] = useState(false);

  // Load dữ liệu khi mở Drawer hoặc đổi loại sản phẩm
  useEffect(() => {
    if (isOpen && category) {
      fetchData();
    }
  }, [isOpen, category]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Gọi song song cả 2 API để lấy dữ liệu cho 2 tabs
      const [specRes, variantRes] = await Promise.all([
        thongSoServiceAdmin.getSpecs(category.MaLoai),
        thongSoServiceAdmin.getVariants(category.MaLoai),
      ]);
      setSpecs(specRes.data || []);
      setVariants(variantRes.data || []);
    } catch (error) {
      console.error("Lỗi tải thông số:", error);
      alert("Không thể tải cấu hình. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý Thêm
  const handleAdd = async (formData) => {
    setLoading(true);
    try {
      const payload = { ...formData, maLoai: category.MaLoai };

      if (activeTab === "tech") {
        await thongSoServiceAdmin.createSpec(payload);
      } else {
        await thongSoServiceAdmin.createVariant(payload);
      }

      await fetchData(); // Refresh lại list
    } catch (error) {
      alert(
        "Lỗi thêm mới: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý Xóa
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
      alert("Lỗi xóa: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // ---  HÀM XỬ LÝ KHÔI PHỤC ---
  const handleRestore = async (id) => {
    if (!window.confirm("Bạn muốn khôi phục thông số này hoạt động trở lại?"))
      return;

    setLoading(true);
    try {
      if (activeTab === "tech") {
        await thongSoServiceAdmin.restoreSpec(id);
      } else {
        await thongSoServiceAdmin.restoreVariant(id);
      }
      await fetchData(); // Refresh lại danh sách
    } catch (error) {
      alert(
        "Lỗi khôi phục: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };
  // --- THÊM HÀM XỬ LÝ UPDATE ---
  const handleUpdate = async (id, formData) => {
    setLoading(true);
    try {
      if (activeTab === "tech") {
        await thongSoServiceAdmin.updateSpec(id, formData);
      } else {
        await thongSoServiceAdmin.updateVariant(id, formData);
      }
      await fetchData(); // Refresh lại danh sách
    } catch (error) {
      alert(
        "Lỗi cập nhật: " + (error.response?.data?.message || error.message)
      );
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
        <div className="w-screen max-w-2xl transform transition ease-in-out duration-500 translate-x-0 bg-white shadow-2xl flex flex-col h-full">
          {/* HEADER */}
          <div className="px-6 py-4 bg-gray-50 border-b flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Cấu hình: {category?.TenLoai}
              </h2>
              <p className="text-sm text-gray-500">
                Quản lý thông số kỹ thuật & biến thể
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* TABS BUTTONS */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("tech")}
              className={`flex-1 py-3 text-sm font-medium text-center border-b-2 transition-colors ${
                activeTab === "tech"
                  ? "border-blue-600 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              📋 Thông số kỹ thuật (thông số chung của loại)
            </button>
            <button
              onClick={() => setActiveTab("variant")}
              className={`flex-1 py-3 text-sm font-medium text-center border-b-2 transition-colors ${
                activeTab === "variant"
                  ? "border-purple-600 text-purple-600 bg-purple-50"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              🎨 Thuộc tính biến thể (thông số riêng của từng biến thể)
            </button>
          </div>

          {/* BODY CONTENT */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === "tech" ? (
              <SpecManager
                type="tech"
                data={specs}
                onAdd={handleAdd}
                onDelete={handleDelete}
                onRestore={handleRestore}
                onUpdate={handleUpdate}
                loading={loading}
              />
            ) : (
              <SpecManager
                type="variant"
                data={variants}
                onAdd={handleAdd}
                onDelete={handleDelete}
                onRestore={handleRestore}
                onUpdate={handleUpdate}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigDrawer;
