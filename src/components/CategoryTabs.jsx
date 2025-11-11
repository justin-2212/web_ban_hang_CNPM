// src/components/CategoryTabs.jsx
import React from "react";

export default function CategoryTabs({ categories, selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-3 justify-center mb-6">
      {categories.map((c) => (
        <button
          key={c}
          onClick={() => onSelect(c)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            selected === c
              ? "bg-black text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
