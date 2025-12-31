// src/pages/admin/CategoryPage.jsx

import React, { useState, useEffect } from "react";
import { Plus, RotateCcw, Search } from "lucide-react";
import categoryServiceAdmin from "../../services/categoryServiceAdmin.js";
// Import bảng đã tách
import CategoryTable from "../../components/admin/CategoryTable";
import CreateModal from "../../components/admin/CreateModal";
import ConfigDrawer from "../../components/admin/ConfigDrawer";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal & Drawer states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [configCategory, setConfigCategory] = useState(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // ============ FETCH DATA ============
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await categoryServiceAdmin.getAll();
      if (res.success) {
        setCategories(res.data);
      }
    } catch (err) {
      setError("Không thể tải danh sách loại sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ============ FILTER LOGIC ============
  const filteredCategories = categories.filter((cat) => {
    const matchSearch = cat.TenLoai.toLowerCase().includes(
      searchQuery.toLowerCase()
    );
    const matchStatus =
      filterStatus === "" ||
      cat.TinhTrangLoaiSanPham.toString() === filterStatus;
    return matchSearch && matchStatus;
  });

  // ============ HANDLERS ============

  // 1. XỬ LÝ XÓA MỀM (Ngừng kinh doanh - EyeOff)
  const handleSoftDelete = async (id) => {
    const category = categories.find((c) => c.MaLoai === id);
    if (!confirm(`Bạn muốn NGỪNG KINH DOANH loại "${category?.TenLoai}"?`))
      return;

    try {
      // Cập nhật tinhTrang = 0
      await categoryServiceAdmin.update(id, {
        tenLoai: category.TenLoai,
        thuTuHienThi: category.ThuTuHienThi,
        tinhTrang: 0,
      });
      fetchCategories();
      alert(`Đã ngừng kinh doanh "${category.TenLoai}"`);
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  // 2. XỬ LÝ KHÔI PHỤC (Kinh doanh lại - Eye)
  const handleRestore = async (category) => {
    if (!confirm(`Bạn muốn KINH DOANH LẠI loại "${category.TenLoai}"?`)) return;

    try {
      // Cập nhật tinhTrang = 1
      await categoryServiceAdmin.update(category.MaLoai, {
        tenLoai: category.TenLoai,
        thuTuHienThi: category.ThuTuHienThi,
        tinhTrang: 1,
      });
      fetchCategories();
      alert(`Đã kinh doanh lại "${category.TenLoai}"`);
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  // 3. XỬ LÝ XÓA CỨNG (Xóa vĩnh viễn - Trash)
  const handleHardDelete = async (id, tenLoai) => {
    if (
      !confirm(
        `CẢNH BÁO: Bạn muốn XÓA VĨNH VIỄN loại "${tenLoai}"?\nHành động này không thể hoàn tác!`
      )
    )
      return;

    try {
      // Gọi API Delete (Backend controller đã check điều kiện rỗng)
      await categoryServiceAdmin.delete(id);
      fetchCategories();
      alert(`Đã xóa vĩnh viễn "${tenLoai}"`);
    } catch (err) {
      // Hiển thị thông báo lỗi từ backend (ví dụ: đang chứa sản phẩm)
      alert("Không thể xóa: " + (err.response?.data?.message || err.message));
    }
  };

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleOpenConfig = (category) => {
    setConfigCategory(category);
    setIsConfigOpen(true);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setFilterStatus("");
  };

  // ============ RENDER ============
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý Loại Sản Phẩm
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Quản lý danh mục sản phẩm và cấu hình thông số
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Thêm mới
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/*  Ô TÌM KIẾM */}
          {/*  Giữ h-10 cho thẻ cha để làm mốc căn giữa cho icon */}
          <div className="relative md:col-span-2 h-10">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
            <input
              type="text"
              placeholder="Tìm kiếm loại sản phẩm..."
              /* Giữ h-10 để chiều cao bằng 40px */
              className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/*  SELECT TRẠNG THÁI  */}
          <select
            /* Giữ h-10 */
            className="w-full h-10 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="1">Đang kinh doanh</option>
            <option value="0">Ngừng kinh doanh</option>
          </select>

          {/* NÚT ĐẶT LẠI  */}
          <button
            onClick={handleResetFilters}
            className="w-full h-10 px-4 bg-gray-200 text-gray-700 border border-transparent rounded-lg hover:bg-gray-300 flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Đặt lại
          </button>
        </div>
      </div>

      {/* ========== TABLE: SỬ DỤNG COMPONENT CategoryTable ========== */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <CategoryTable
            data={filteredCategories}
            onEdit={handleEdit}
            onConfig={handleOpenConfig}
            // Truyền 3 hàm xử lý riêng biệt
            onSoftDelete={handleSoftDelete}
            onRestore={handleRestore}
            onHardDelete={handleHardDelete}
          />
        )}
      </div>

      {/* Modals */}
      <CreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingCategory}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchCategories();
        }}
        existingCategories={categories}
      />

      <ConfigDrawer
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        category={configCategory}
      />
    </div>
  );
};

export default CategoryPage;
