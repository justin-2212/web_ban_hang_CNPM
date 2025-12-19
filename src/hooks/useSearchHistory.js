import { useState, useEffect } from "react";

const STORAGE_KEY = "apple_store_search_history";
const MAX_HISTORY = 10;

export const useSearchHistory = () => {
  const [history, setHistory] = useState([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (err) {
        console.error("Error loading search history:", err);
      }
    }
  }, []);

  // Add query to history
  const addSearch = (query) => {
    if (!query.trim()) return;

    const trimmedQuery = query.trim();
    
    // Remove if already exists (để đặt lại về đầu)
    const filtered = history.filter(
      (item) => item.toLowerCase() !== trimmedQuery.toLowerCase()
    );

    // Thêm query mới vào đầu
    const updated = [trimmedQuery, ...filtered].slice(0, MAX_HISTORY);
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  // Clear all history
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Remove specific item
  const removeItem = (query) => {
    const updated = history.filter(
      (item) => item.toLowerCase() !== query.toLowerCase()
    );
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return { history, addSearch, clearHistory, removeItem };
};
