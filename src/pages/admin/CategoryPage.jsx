// src/pages/admin/CategoryPage.jsx
import React, { useState, useEffect } from "react";
import categoryServiceAdmin from "../../services/categoryServiceAdmin.js";

// Import các component con
import CategoryTable from "../../components/admin/CategoryTable";
import CreateModal from "../../components/admin/CreateModal";
import ConfigDrawer from "../../components/admin/ConfigDrawer";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [configCategory, setConfigCategory] = useState(null);

  // State cho Modal thêm/sửa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null); // Nếu null => Thêm mới, Có dữ liệu => Sửa

  // 1. Hàm load dữ liệu từ Server
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryServiceAdmin.getAll();
      if (res.success) {
        setCategories(res.data);
      }
    } catch (err) {
      setError("Không thể tải danh sách loại sản phẩm");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi mới vào trang
  useEffect(() => {
    fetchCategories();
  }, []);

  // 2. Xử lý khi bấm nút "Thêm mới"
  const handleOpenCreate = () => {
    setEditingCategory(null); // Reset về mode thêm mới
    setIsModalOpen(true);
  };

  // 3. Xử lý khi bấm nút "Sửa" (Gọi từ Table)
  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  // 4. Xử lý khi bấm nút "Xóa" (Gọi từ Table)
  const handleDelete = async (id) => {
    // Bước 1: Tìm đối tượng loại sản phẩm trong danh sách dựa vào ID
    const categoryToDelete = categories.find((cat) => cat.MaLoai === id);
    // Bước 2: Lấy tên (nếu tìm thấy), ngược lại để chuỗi rỗng
    const categoryName = categoryToDelete ? categoryToDelete.TenLoai : "";
    
    if (!confirm(`⚠️ XÓA VĨNH VIỄN loại "${categoryName}"? KHÔNG THỂ KHÔI PHỤC!`)) return;
    
    try {
      await categoryServiceAdmin.delete(id);
      fetchCategories(); // Load lại bảng sau khi xóa
      alert(`Đã xóa "${categoryName}" thành công`);
    } catch (err) {
      alert(
        "Lỗi: " +
          (err.response?.data?.message ||
            "Không thể xóa, mời bạn thử lại")
      );
    }
  };

  // 5. Xử lý khi Form (Modal) submit thành công
  const handleFormSubmitSuccess = () => {
    setIsModalOpen(false);
    fetchCategories(); // Refresh lại dữ liệu
  };

  const handleRestore = async (category) => {
    try {
      // Gọi API Update, set TinhTrangLoaiSanPham = 1
      await categoryServiceAdmin.update(category.MaLoai, {
        ...category, // Giữ nguyên các thông tin khác
        tinhTrang: 1, // Chỉ sửa tình trạng thành 1 (Hiện)
        tenLoai: category.TenLoai, // Map lại đúng tên trường backend cần
        thuTuHienThi: category.ThuTuHienThi,
      });
      const categoryName = category.TenLoai || "loại sản phẩm";
      fetchCategories(); // Load lại bảng
      alert(`Đã kinh doanh "${categoryName}" trở lại`);
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  const handleOpenConfig = (category) => {
    setConfigCategory(category);
    setIsConfigOpen(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý Loại Sản Phẩm
          </h1>
          <p className="text-gray-500 text-sm">
            Quản lý danh mục và cấu hình thông số
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <span>+</span> Thêm mới
        </button>
      </div>

      {/* --- ERROR MESSAGE --- */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      {/* --- TABLE CONTENT --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Đang tải dữ liệu...
          </div>
        ) : (
          <CategoryTable
            data={categories}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRestore={handleRestore}
            onConfig={handleOpenConfig}
          />
        )}
      </div>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <CreateModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={editingCategory}
          onSuccess={handleFormSubmitSuccess}
          existingCategories={categories}
        />
      )}

      {/* 5. GỌI CONFIG DRAWER */}
      {isConfigOpen && configCategory && (
        <ConfigDrawer
          isOpen={isConfigOpen}
          onClose={() => setIsConfigOpen(false)}
          category={configCategory}
        />
      )}
    </div>
  );
};

export default CategoryPage;
