// src/components/SortSelect.jsx
import React from "react";

export default function SortSelect({ value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm text-gray-600">Sắp xếp:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 bg-white border rounded-md text-sm"
      >
        <option value="default">Mặc định</option>
        <option value="price-asc">Giá: Tăng dần</option>
        <option value="price-desc">Giá: Giảm dần</option>
      </select>
    </div>
  );
}
