// src/pages/admin/ProductsManagement.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sanPhamAdminAPI } from "../../services/adminAPI";
import { loaiSanPhamAPI } from "../../services/api";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  X,
} from "lucide-react";

import CreateProductModal from "../../components/admin/CreateProductModal";

const ProductsManagement = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    maLoai: "",
    tinhTrang: "",
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        sanPhamAdminAPI.getAll(filters),
        loaiSanPhamAPI.getAll(),
      ]);

      if (productsRes.success) setProducts(productsRes.data);
      if (categoriesRes.success) setCategories(categoriesRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    if (!confirm("Bạn có chắc muốn thay đổi trạng thái sản phẩm này?")) return;

    try {
      const response = await sanPhamAdminAPI.toggleStatus(id);
      if (response.success) {
        alert("Cập nhật trạng thái thành công");
        fetchData();
      }
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (
      !confirm(
        "Bạn có chắc muốn XÓA VĨNH VIỄN sản phẩm này? Hành động này KHÔNG THỂ KHÔI PHỤC!"
      )
    )
      return;

    try {
      const response = await sanPhamAdminAPI.delete(id);
      if (response.success) {
        alert("Xóa sản phẩm thành công");
        fetchData();
      }
    } catch (err) {
      alert("Không thể xóa: " + err.message);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value || 0);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Sản phẩm</h1>
          <p className="text-gray-600 mt-1">Quản lý danh sách sản phẩm</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-5 h-5" />
          Thêm sản phẩm
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Search */}
          {/* Thêm 'h-10' cho thẻ cha */}
          <div className="relative h-10">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              /* Thêm 'h-10' */
              className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </div>

          {/* Category Filter */}
          <select
            /*  Thêm 'h-10' */
            className="w-full h-10 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.maLoai}
            onChange={(e) => setFilters({ ...filters, maLoai: e.target.value })}
          >
            <option value="">Tất cả loại</option>
            {categories.map((cat) => (
              <option key={cat.MaLoai} value={cat.MaLoai}>
                {cat.TenLoai}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            /* Thêm 'h-10' */
            className="w-full h-10 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.tinhTrang}
            onChange={(e) =>
              setFilters({ ...filters, tinhTrang: e.target.value })
            }
          >
            <option value="">Tất cả trạng thái</option>
            <option value="1">Đang kinh doanh</option>
            <option value="0">Ngừng kinh doanh</option>
          </select>

          {/* Reset Button */}
          <button
            /*  Thêm 'h-10' và 'border border-transparent' */
            className="w-full h-10 px-4 bg-gray-200 text-gray-700 border border-transparent rounded-lg hover:bg-gray-300 flex items-center justify-center"
            onClick={() =>
              setFilters({ search: "", maLoai: "", tinhTrang: "" })
            }
          >
            Đặt lại
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse table-auto">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                <tr>
                  {/* Mã SP: Rất nhỏ */}
                  <th className="px-3 py-3 w-12 text-center">Mã</th>

                  {/* Tên SP: Chiếm phần lớn khoảng trống */}
                  <th className="px-3 py-3">Tên sản phẩm</th>

                  {/* Loại: Giới hạn độ rộng */}
                  <th className="px-3 py-3 w-28">Loại</th>

                  {/*  Biến thể: Thu gọn text header */}
                  <th className="px-2 py-3 w-20 text-center">Biến thể</th>

                  {/*  Giá: Căn phải */}
                  <th className="px-3 py-3 w-32 text-center">Giá</th>

                  {/* Tồn kho */}
                  <th className="px-2 py-3 w-20 text-center">Tồn kho</th>

                  {/*  Trạng thái */}
                  <th className="px-2 py-3 w-32 text-center">Trạng thái</th>

                  {/*  Thao tác */}
                  <th className="px-2 py-3 w-24 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.MaSP} className="hover:bg-gray-50 text-sm">
                    {/* Mã SP */}
                    <td className="px-3 py-3 text-center font-medium text-gray-900">
                      #{product.MaSP}
                    </td>

                    {/* Tên SP */}
                    <td className="px-3 py-3">
                      <div className="max-w-[180px] lg:max-w-xs">
                        <p
                          className="font-medium text-gray-900 line-clamp-1"
                          title={product.Ten}
                        >
                          {product.Ten}
                        </p>
                        <p className="text-gray-500 text-xs truncate max-w-[180px]">
                          {product.MoTa}
                        </p>
                      </div>
                    </td>

                    {/* Loại */}
                    <td
                      className="px-3 py-3 text-gray-600 truncate max-w-[100px]"
                      title={product.TenLoai}
                    >
                      {product.TenLoai}
                    </td>

                    {/* Số lượng biến thể */}
                    <td className="px-2 py-3 text-center text-gray-900">
                      {product.SoLuongBienThe || 0}
                    </td>

                    {/* Giá */}
                    <td className="px-3 py-3 text-right">
                      <div className="font-medium text-gray-900">
                        {formatCurrency(product.GiaThapNhat)}
                      </div>
                      {product.GiaCaoNhat &&
                        product.GiaCaoNhat !== product.GiaThapNhat && (
                          <div className="text-gray-500 text-xs">
                            - {formatCurrency(product.GiaCaoNhat)}
                          </div>
                        )}
                    </td>

                    {/* Tồn kho */}
                    <td className="px-2 py-3 text-center">
                      <span
                        className={`font-bold ${
                          product.TongTonKho <= 10
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {product.TongTonKho || 0}
                      </span>
                    </td>

                    {/* Trạng thái - Dùng Badge nhỏ gọn hơn */}
                    <td className="px-2 py-3 text-center">
                      <span
                        className={`px-2 py-1 text-[10px] font-bold rounded-full border ${
                          product.TinhTrangSanPham === 1
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {product.TinhTrangSanPham === 1
                          ? "Đang kinh doanh"
                          : "Ngừng kinh doanh"}
                      </span>
                    </td>

                    {/* Thao tác - Group chặt hơn */}
                    <td className="px-2 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() =>
                            navigate(`/admin/products/${product.MaSP}`)
                          }
                          className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition"
                          title="Sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(product.MaSP)}
                          className={`p-1.5 rounded-md transition ${
                            product.TinhTrangSanPham === 1
                              ? "text-orange-600 hover:bg-orange-100"
                              : "text-green-600 hover:bg-green-100"
                          }`}
                          title="Đổi trạng thái"
                        >
                          {product.TinhTrangSanPham === 1 ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(product.MaSP)}
                          className="p-1.5 text-red-600 hover:bg-red-100 rounded-md transition"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!loading && products.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500 text-sm">
                  Không tìm thấy sản phẩm nào
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      <CreateProductModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default ProductsManagement;
