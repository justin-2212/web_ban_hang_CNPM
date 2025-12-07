import React, { useState } from "react";
import { Search, X } from "lucide-react";

export default function SearchBar({ onSearch, placeholder = "Tìm kiếm..." }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        
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

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Optional: Search suggestions can be added here */}
    </form>
  );
}