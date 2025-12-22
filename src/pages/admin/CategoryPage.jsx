import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Eye,
  EyeOff,
  Settings,
  RotateCcw,
  Search,
} from "lucide-react";
import categoryServiceAdmin from "../../services/categoryServiceAdmin.js";
import CategoryTable from "../../components/admin/CategoryTable";
import CreateModal from "../../components/admin/CreateModal";
import ConfigDrawer from "../../components/admin/ConfigDrawer";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Config Drawer states
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [configCategory, setConfigCategory] = useState(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState(""); // "" = tất cả, "1" = hoạt động, "0" = ngừng

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
      console.error(err);
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
  const handleOpenCreate = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const categoryToDelete = categories.find((cat) => cat.MaLoai === id);
    const categoryName = categoryToDelete?.TenLoai || "loại sản phẩm";

    if (!confirm(`Bạn có chắc muốn ngừng kinh doanh "${categoryName}"?`)) {
      return;
    }

    try {
      await categoryServiceAdmin.delete(id);
      fetchCategories();
      alert(`Đã ngừng kinh doanh "${categoryName}"`);
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  const handleRestore = async (category) => {
    if (!confirm(`Bạn có chắc muốn kinh doanh lại "${category.TenLoai}"?`)) {
      return;
    }

    try {
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

  const handleOpenConfig = (category) => {
    setConfigCategory(category);
    setIsConfigOpen(true);
  };

  const handleFormSubmitSuccess = () => {
    setIsModalOpen(false);
    fetchCategories();
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setFilterStatus("");
  };

  // ============ RENDER ============
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* ========== HEADER ========== */}
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

      {/* ========== ERROR MESSAGE ========== */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* ========== FILTERS ========== */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm loại sản phẩm..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="1">Đang kinh doanh</option>
            <option value="0">Ngừng kinh doanh</option>
          </select>
        </div>

        {/* Reset Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Đặt lại
          </button>
        </div>
      </div>

      {/* ========== TABLE ========== */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>Không tìm thấy loại sản phẩm nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên loại
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thứ tự
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategories.map((category) => (
                  <tr
                    key={category.MaLoai}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{category.MaLoai}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {category.TenLoai}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                      {category.ThuTuHienThi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          category.TinhTrangLoaiSanPham === 1
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {category.TinhTrangLoaiSanPham === 1
                          ? "Đang kinh doanh"
                          : "Ngừng kinh doanh"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-3">
                        {/* Config Button */}
                        <button
                          onClick={() => handleOpenConfig(category)}
                          title="Cấu hình thông số & biến thể"
                          className="p-2 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition"
                        >
                          <Settings className="w-4 h-4" />
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => handleEdit(category)}
                          title="Chỉnh sửa"
                          className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Delete/Restore Button */}
                        {category.TinhTrangLoaiSanPham === 1 ? (
                          <button
                            onClick={() => handleDelete(category.MaLoai)}
                            title="Ngừng kinh doanh"
                            className="p-2 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition"
                          >
                            <EyeOff className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRestore(category)}
                            title="Kinh doanh lại"
                            className="p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Summary */}
        {!loading && filteredCategories.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
            Hiển thị{" "}
            <span className="font-semibold">{filteredCategories.length}</span>{" "}
            trong <span className="font-semibold">{categories.length}</span>{" "}
            loại sản phẩm
          </div>
        )}
      </div>

      {/* ========== MODALS ========== */}
      <CreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingCategory}
        onSuccess={handleFormSubmitSuccess}
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
