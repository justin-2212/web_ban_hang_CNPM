import React from "react";

const categoryIcons = {
  'iPhone': '📱',
  'iPad': '📲',
  'MacBook': '💻',
  'AirPods': '🎧',
  'Phụ kiện': '⌚'
};

export default function Sidebar({ categories, selected, onSelect }) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <aside className="hidden lg:block w-56 sticky top-24 h-fit">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Danh mục</h3>
        <nav className="space-y-2">
          {categories.map((cat) => {
            const isActive = selected === cat.MaLoai;

            return (
              <button
                key={cat.MaLoai}
                onClick={() => onSelect(cat.MaLoai)}
                className={`w-full text-center px-4 py-3 rounded-xl font-medium transition-all duration-200
                  flex items-center justify-center gap-3
                  ${isActive
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <span>{cat.TenLoai}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
