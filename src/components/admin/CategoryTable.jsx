// src/components/admin/CategoryTable.jsx

import React from "react";

const CategoryTable = ({ data, onEdit, onDelete, onConfig, onRestore }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
            <th className="p-4 border-b font-semibold">ID</th>
            <th className="p-4 border-b font-semibold">Tên loại</th>
            <th className="p-4 border-b font-semibold text-center">Thứ tự</th>
            <th className="p-4 border-b font-semibold text-center">
              Tinh trạng
            </th>
            <th className="p-4 border-b font-semibold text-right">Hành động</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm">
          {data.length === 0 ? (
            <tr>
              <td colSpan="5" className="p-6 text-center text-gray-400">
                Chưa có dữ liệu loại sản phẩm nào.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={item.MaLoai}
                className="hover:bg-blue-50 transition border-b last:border-0"
              >
                <td className="p-4 font-medium">#{item.MaLoai}</td>
                <td className="p-4 font-semibold text-gray-800">
                  {item.TenLoai}
                </td>
                <td className="p-4 text-center">{item.ThuTuHienThi}</td>
                <td className="p-4 text-center">
                  {item.TinhTrangLoaiSanPham === 1 ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                      Đang kinh doanh
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                      Ngừng kinh doanh
                    </span>
                  )}
                </td>
                <td className="p-4 text-right space-x-2">
                  {/* Nút Cấu hình (Setting) - Quan trọng */}
                  <button
                    onClick={() => onConfig(item)}
                    title="Cấu hình thông số & biến thể"
                    className="p-2 bg-purple-100 text-purple-600 rounded hover:bg-purple-200 transition"
                  >
                    ⚙️
                  </button>

                  {/* Nút Sửa */}
                  <button
                    onClick={() => onEdit(item)}
                    title="Chỉnh sửa thông tin"
                    className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition"
                  >
                    ✏️
                  </button>

                  {/* Nút Xóa */}
                  {item.TinhTrangLoaiSanPham === 1 ? (
                    // TRƯỜNG HỢP 1: Đang hiện -> Hiển thị nút XÓA (Ngừng kinh doanh)
                    <button
                      onClick={() => onDelete(item.MaLoai)}
                      title="Ngừng kinh doanh"
                      className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                    >
                      🗑️
                    </button>
                  ) : (
                    // TRƯỜNG HỢP 2: Đang ẩn -> Hiển thị nút KHÔI PHỤC (Kinh doanh lại)
                    <button
                      onClick={() => onRestore(item)} // Gọi hàm onRestore (cần thêm prop này)
                      title="Kinh doanh trở lại"
                      className="p-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition"
                    >
                      🔄
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;
