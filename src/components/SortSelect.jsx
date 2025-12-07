import React from "react";
import { ArrowUpDown } from "lucide-react";

export default function SortSelect({ value, onChange }) {
  return (
    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200">
      <ArrowUpDown className="w-4 h-4 text-gray-500" />
      <label className="text-sm text-gray-600 font-medium">Sắp xếp:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-1.5 bg-transparent border-none text-sm font-medium text-gray-900 
                   focus:outline-none focus:ring-0 cursor-pointer"
      >
        <option value="default">Mặc định</option>
        <option value="name-asc">Tên: A → Z</option>
        <option value="name-desc">Tên: Z → A</option>
        <option value="price-asc">Giá: Thấp → Cao</option>
        <option value="price-desc">Giá: Cao → Thấp</option>
      </select>
    </div>
  );
}