import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const STORAGE_KEY_PREFIX = "apple_store_search_history_";
const MAX_HISTORY = 10;

export const useSearchHistory = () => {
  const { dbUser } = useAuth(); // Lấy thông tin user từ AuthContext
  const [history, setHistory] = useState([]);

  // Tạo key riêng cho từng user, hoặc dùng "guest" nếu chưa đăng nhập
  const getStorageKey = () => {
    if (dbUser?.MaTaiKhoan) {
      return `${STORAGE_KEY_PREFIX}${dbUser.MaTaiKhoan}`;
    }
    return `${STORAGE_KEY_PREFIX}guest`;
  };

  // Load history from localStorage on mount hoặc khi user thay đổi
  useEffect(() => {
    const storageKey = getStorageKey();
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (err) {
        console.error("Error loading search history:", err);
      }
    } else {
      setHistory([]); // Reset nếu không có data
    }
  }, [dbUser?.MaTaiKhoan]); // Re-run khi user đổi

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
    
    const storageKey = getStorageKey();
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  // Clear all history
  const clearHistory = () => {
    setHistory([]);
    const storageKey = getStorageKey();
    localStorage.removeItem(storageKey);
  };

  // Remove specific item
  const removeItem = (query) => {
    const updated = history.filter(
      (item) => item.toLowerCase() !== query.toLowerCase()
    );
    setHistory(updated);
    
    const storageKey = getStorageKey();
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  return { history, addSearch, clearHistory, removeItem };
};
