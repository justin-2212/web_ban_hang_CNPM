// src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Component tự động scroll lên đầu trang khi route thay đổi
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll lên đầu trang mỗi khi pathname thay đổi
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // Component này không render gì cả
};

export default ScrollToTop;
