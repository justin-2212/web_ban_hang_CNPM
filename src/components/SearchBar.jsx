import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useSearchHistory } from "../hooks/useSearchHistory";

export default function SearchBar({ onSearch, placeholder = "Tìm kiếm..." }) {
  const [query, setQuery] = useState("");
  const { addSearch } = useSearchHistory();
  const searchRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      addSearch(query);
      onSearch(query);
    }
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto relative"
      ref={searchRef}
    >
      <div className="relative flex items-center">
        {/* Icon Search bên trái */}
        <Search className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-4 bg-white border-2 border-gray-200 rounded-2xl 
                     text-gray-900 placeholder-gray-400 
                     focus:border-blue-500 focus:ring-4 focus:ring-blue-100 
                     transition-all duration-200 outline-none shadow-sm"
        />

        {/* Dấu X bên phải */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-5 top-1/4 -translate-y-1/2 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </form>
  );
}
