import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const userId = 'user123'; // Mock user ID for this assignment

  const fetchCart = async () => {
    try {
      const response = await API.get(`/cart/${userId}`);
      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (itemId, quantity = 1) => {
    try {
      const response = await API.post(`/cart/${userId}/items`, { itemId, quantity });
      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const response = await API.put(`/cart/${userId}/items/${itemId}`, { quantity });
      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await API.delete(`/cart/${userId}/items/${itemId}`);
      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const clearCart = async () => {
    try {
      const response = await API.delete(`/cart/${userId}`);
      if (response.data.success) {
        setCart({ items: [], totalAmount: 0 });
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
