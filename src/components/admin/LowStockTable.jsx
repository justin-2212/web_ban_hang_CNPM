// src/components/admin/LowStockTable.jsx

import React from "react";
import { AlertTriangle } from "lucide-react";

const LowStockTable = ({ data = [] }) => {
  // [UPDATE] Không cần filter ở đây nữa vì Backend đã trả về đúng danh sách < 5 rồi
  const lowStockItems = data;

  // Nếu không có dữ liệu thì ẩn bảng
  if (!lowStockItems || lowStockItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-red-600" />
        Cảnh báo tồn kho thấp (từ 10 trở xuống)
      </h3>
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Sản phẩm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Biến thể
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Tồn kho
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {lowStockItems.map((item) => (
              <tr key={item.MaBienThe}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.TenSanPham}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.TenBienThe}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {/* [UI] Tô đỏ đậm số lượng để gây chú ý */}
                  <span className="text-sm font-bold text-red-600">
                    {item.SoLuongTonKho}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                    Cần nhập hàng
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LowStockTable;
