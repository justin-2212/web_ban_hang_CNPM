// src/components/admin/TopSellingTable.jsx

import React from "react";
import { TrendingUp } from "lucide-react";

const TopSellingTable = ({ data = [] }) => {
  // Helper format tiền tệ (được chuyển vào trong component để dùng nội bộ)
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value || 0);
  };

  // Logic: Lấy đúng 5 sản phẩm đầu tiên
  const topProducts = data ? data.slice(0, 5) : [];

  if (topProducts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center text-gray-500">
        Chưa có dữ liệu bán hàng
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 h-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        Top 5 sản phẩm bán chạy
      </h3>
      
      <div className="space-y-3">
        {topProducts.map((product, index) => (
          <div
            key={product.MaBienThe || index}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
          >
            {/* Vòng tròn số thứ tự */}
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                index === 0
                  ? "bg-yellow-100 text-yellow-700" // Top 1 màu vàng
                  : index === 1
                  ? "bg-gray-100 text-gray-700"     // Top 2 màu bạc
                  : index === 2
                  ? "bg-orange-100 text-orange-800" // Top 3 màu đồng
                  : "bg-blue-50 text-blue-600"      // Còn lại màu xanh
              }`}
            >
              <span className="text-sm font-bold">{index + 1}</span>
            </div>

            {/* Thông tin sản phẩm */}
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium text-gray-900 truncate"
                title={`${product.TenSanPham} - ${product.TenBienThe}`}
              >
                {product.TenSanPham} <span className="text-gray-500">- {product.TenBienThe}</span>
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Đã bán: <span className="font-medium text-gray-700">{product.TongSoLuong}</span>
              </p>
            </div>

            {/* Doanh thu */}
            <div className="text-right">
              <p className="text-sm font-semibold text-green-600">
                {formatCurrency(product.TongDoanhThu)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSellingTable;