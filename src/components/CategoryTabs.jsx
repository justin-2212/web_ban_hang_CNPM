import React from "react";

// Icon mapping for categories
const categoryIcons = {
  'iPhone': '📱',
  'iPad': '📲',
  'MacBook': '💻',
  'AirPods': '🎧',
  'Phụ kiện': '⌚'
};

export default function CategoryTabs({ categories, selected, onSelect }) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {categories.map((cat) => {
        const isActive = selected === cat.MaLoai;
        const icon = categoryIcons[cat.TenLoai] || '📦';

        return (
          <button
            key={cat.MaLoai}
            onClick={() => onSelect(cat.MaLoai)}
            className={`
              px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200
              flex items-center gap-2 shadow-sm hover:shadow-md
              ${isActive
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white scale-105 shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }
            `}
          >
            <span className="text-lg">{icon}</span>
            <span>{cat.TenLoai}</span>
          </button>
        );
      })}
    </div>
  );
}