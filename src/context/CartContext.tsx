import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Crop } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (crop: Crop, quantity?: number) => void;
  removeFromCart: (cropId: string) => void;
  updateQuantity: (cropId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  estimatedDelivery: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('farmlink_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('farmlink_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (crop: Crop, quantity = 50) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(item => item.crop.id === crop.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(newQty, crop.quantity)
        };
        return updated;
      }
      return [...prev, { crop, quantity: Math.min(quantity, crop.quantity) }];
    });
  };

  const removeFromCart = (cropId: string) => {
    setItems(prev => prev.filter(item => item.crop.id !== cropId));
  };

  const updateQuantity = (cropId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cropId);
      return;
    }
    setItems(prev =>
      prev.map(item => {
        if (item.crop.id === cropId) {
          return {
            ...item,
            quantity: Math.min(quantity, item.crop.quantity)
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.crop.price * item.quantity, 0);
  
  // Logistics estimate: ~₹2.2/kg + base freight
  const totalWeightKg = items.reduce((sum, item) => {
    const factor = item.crop.unit === 'ton' ? 1000 : item.crop.unit === 'quintal' ? 100 : 1;
    return sum + item.quantity * factor;
  }, 0);
  
  const estimatedDelivery = items.length === 0 ? 0 : Math.round(Math.max(450, totalWeightKg * 2.2 + 650));
  const totalAmount = subtotal + estimatedDelivery;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        estimatedDelivery,
        totalAmount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
