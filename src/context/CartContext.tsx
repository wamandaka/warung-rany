"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { CartItem, Product } from "@/types";

interface CartValidationResult {
  isValid: boolean;
  message?: string;
  staleItems?: string[];
}

interface CartContextType {
  items: CartItem[];
  customerName: string;
  customerNote: string;
  setCustomerName: (name: string) => void;
  setCustomerNote: (note: string) => void;
  addToCart: (product: Product, quantity?: number) => { success: boolean; message?: string };
  updateQuantity: (productId: string, newQuantity: number) => { success: boolean; message?: string };
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  validateCartItems: (currentProducts: Product[]) => CartValidationResult;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "warung_rany_cart";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState<string>("");
  const [customerNote, setCustomerNote] = useState<string>("");
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [items, isLoaded]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (product: Product, quantity: number = 1): { success: boolean; message?: string } => {
    // 1. Check basic availability
    if (!product.isAvailable || product.stock === 0) {
      return {
        success: false,
        message: `${product.name} saat ini sedang habis atau tidak tersedia.`,
      };
    }

    const existingIndex = items.findIndex((i) => i.productId === product.id);
    const currentQty = existingIndex > -1 ? items[existingIndex].quantity : 0;
    const requestedQty = currentQty + quantity;

    // 2. Check stock limit (if limited stock, i.e. stock !== null)
    if (product.stock !== null && requestedQty > product.stock) {
      const remainingAllowed = product.stock - currentQty;
      if (remainingAllowed <= 0) {
        return {
          success: false,
          message: `Stok ${product.name} hanya tersisa ${product.stock}. Anda sudah memasukkan seluruh stok ke keranjang.`,
        };
      }
      return {
        success: false,
        message: `Stok ${product.name} hanya tersisa ${product.stock}. Hanya bisa menambahkan ${remainingAllowed} lagi.`,
      };
    }

    if (existingIndex > -1) {
      const updated = [...items];
      updated[existingIndex].quantity = requestedQty;
      updated[existingIndex].maxStock = product.stock;
      updated[existingIndex].isAvailable = product.isAvailable;
      setItems(updated);
    } else {
      setItems((prev) => [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
          imageUrl: product.imageUrl,
          maxStock: product.stock,
          isAvailable: product.isAvailable,
        },
      ]);
    }

    return {
      success: true,
      message: `${quantity} ${product.name} berhasil ditambahkan ke keranjang.`,
    };
  };

  const updateQuantity = (productId: string, newQuantity: number): { success: boolean; message?: string } => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return { success: true };
    }

    const item = items.find((i) => i.productId === productId);
    if (!item) return { success: false, message: "Item tidak ditemukan di keranjang." };

    if (item.maxStock !== null && newQuantity > item.maxStock) {
      return {
        success: false,
        message: `Stok ${item.name} hanya tersedia ${item.maxStock}.`,
      };
    }

    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity: newQuantity } : i))
    );
    return { success: true };
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const clearCart = () => {
    setItems([]);
    setCustomerNote("");
  };

  // Validate cart against current live products
  const validateCartItems = (currentProducts: Product[]): CartValidationResult => {
    if (items.length === 0) {
      return { isValid: false, message: "Keranjang belanja Anda masih kosong." };
    }

    for (const item of items) {
      const liveProduct = currentProducts.find((p) => p.id === item.productId);
      if (!liveProduct) {
        return {
          isValid: false,
          message: `Produk "${item.name}" sudah tidak tersedia dalam menu. Silakan hapus dari keranjang.`,
          staleItems: [item.productId],
        };
      }
      if (!liveProduct.isAvailable || liveProduct.stock === 0) {
        return {
          isValid: false,
          message: `Produk "${item.name}" saat ini sedang habis. Silakan sesuaikan keranjang Anda.`,
          staleItems: [item.productId],
        };
      }
      if (liveProduct.stock !== null && item.quantity > liveProduct.stock) {
        return {
          isValid: false,
          message: `Jumlah pesanan untuk "${item.name}" melebihi stok yang tersedia (sisa ${liveProduct.stock}).`,
          staleItems: [item.productId],
        };
      }
    }

    return { isValid: true };
  };

  const totalPrice = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        customerName,
        customerNote,
        setCustomerName,
        setCustomerNote,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalPrice,
        totalItems,
        isCartOpen,
        openCart,
        closeCart,
        validateCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
