import { useState, useEffect, useCallback } from 'react';
import { gioHangAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook quản lý giỏ hàng
 * Tái sử dụng logic fetch cart trong nhiều components
 */
export const useCart = () => {
  const { dbUser, loadingUser } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    if (!dbUser?.MaTaiKhoan) {
      setCart([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await gioHangAPI.get(dbUser.MaTaiKhoan);
      setCart(res.data?.items || []);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError(err.message);
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, [dbUser?.MaTaiKhoan]);

  useEffect(() => {
    if (!loadingUser && dbUser?.MaTaiKhoan) {
      fetchCart();
    }
  }, [loadingUser, dbUser?.MaTaiKhoan, fetchCart]);

  // Listen for cart updates
  useEffect(() => {
    const handleCartUpdate = () => fetchCart();
    window.addEventListener('cartServerUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartServerUpdated', handleCartUpdate);
  }, [fetchCart]);

  const totalItems = cart.reduce((sum, item) => sum + item.SoLuong, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.GiaTienBienThe * item.SoLuong, 0);

  return {
    cart,
    loading,
    error,
    totalItems,
    totalPrice,
    refreshCart: fetchCart,
  };
};
