// src/components/admin/CategoryTable.jsx

import React from "react";
import { Edit, Eye, EyeOff, Settings, Trash2 } from "lucide-react";

const CategoryTable = ({
  data,
  onEdit,
  onSoftDelete,
  onHardDelete,
  onConfig,
  onRestore,
}) => {
  return (
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
          {data.length === 0 ? (
            <tr>
              <td colSpan="5" className="p-6 text-center text-gray-400">
                Chưa có dữ liệu loại sản phẩm nào.
              </td>
            </tr>
          ) : (
            data.map((category) => (
              <tr key={category.MaLoai} className="hover:bg-gray-50 transition">
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
                    {/* 1. Nút Cấu hình (Tím) */}
                    <button
                      onClick={() => onConfig(category)}
                      title="Cấu hình thông số & biến thể"
                      className="p-2 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition"
                    >
                      <Settings className="w-4 h-4" />
                    </button>

                    {/* 2. Nút Chỉnh sửa (Xanh dương) */}
                    <button
                      onClick={() => onEdit(category)}
                      title="Chỉnh sửa"
                      className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    {/* 3. Logic Nút Trạng thái (Mắt) */}
                    {category.TinhTrangLoaiSanPham === 1 ? (
                      // Nếu đang Hiện -> Nút Ẩn (Xóa mềm - Cam)
                      <button
                        onClick={() => onSoftDelete(category.MaLoai)}
                        title="Ngừng kinh doanh (Ẩn tạm thời)"
                        className="p-2 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition"
                      >
                        <EyeOff className="w-4 h-4" />
                      </button>
                    ) : (
                      // Nếu đang Ẩn -> Nút Hiện (Khôi phục - Xanh lá)
                      <button
                        onClick={() => onRestore(category)}
                        title="Kinh doanh lại"
                        className="p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}

                    {/* 4. Nút Xóa cứng (Thùng rác - Đỏ) */}
                    <button
                      onClick={() =>
                        onHardDelete(category.MaLoai, category.TenLoai)
                      }
                      title="Xóa vĩnh viễn (Chỉ khi rỗng)"
                      className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {!data.length && (
        <div className="text-center py-12 text-gray-500 border-t">
          Không tìm thấy loại sản phẩm nào
        </div>
      )}
    </div>
  );
};

export default CategoryTable;
