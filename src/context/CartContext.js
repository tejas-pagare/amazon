"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { fetchApi } from "../lib/api";
import { useToast } from "./ToastContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const [cart, setCart] = useState({ items: [], subtotal: "0.00" });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  const fetchCart = useCallback(async () => {
    if (!currentUser) {
      setCart({ items: [], subtotal: "0.00" });
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const data = await fetchApi(`/cart?user_id=${currentUser.id}`);
      setCart({ items: data.items || [], subtotal: data.subtotal || "0.00" });
    } catch (err) {
      console.error("Failed to fetch cart", err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!currentUser) {
      addToast("Please sign in first!", "error");
      return false;
    }
    
    setActionLoading(prev => ({ ...prev, [productId]: true }));
    try {
      await fetchApi("/cart", {
        method: "POST",
        body: JSON.stringify({ user_id: currentUser.id, productId: Number(productId), quantity }),
      });
      await fetchCart();
      addToast("Added to cart successfully!");
      return true;
    } catch (err) {
      addToast(err.message || "Failed to add to cart.", "error");
      return false;
    } finally {
      setActionLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  return (
    <CartContext.Provider value={{ cart, loading, fetchCart, addToCart, actionLoading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
