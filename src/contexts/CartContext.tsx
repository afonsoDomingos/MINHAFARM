'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartItem {
  pharmacyId: string;
  pharmacyName: string;
  medicineId: string;
  medicineName: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (medicineId: string) => void;
  updateQuantity: (medicineId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  getPharmacyGroupedItems: () => { [pharmacyId: string]: CartItem[] };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    console.log('addToCart called with:', item);
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (i) => i.medicineId === item.medicineId && i.pharmacyId === item.pharmacyId
      );

      if (existingItem) {
        console.log('Item exists, updating quantity');
        return prevItems.map((i) =>
          i.medicineId === item.medicineId && i.pharmacyId === item.pharmacyId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      console.log('Adding new item');
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (medicineId: string) => {
    setItems((prevItems) => prevItems.filter((i) => i.medicineId !== medicineId));
  };

  const updateQuantity = (medicineId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(medicineId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((i) => (i.medicineId === medicineId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const getPharmacyGroupedItems = () => {
    return items.reduce((acc, item) => {
      if (!acc[item.pharmacyId]) {
        acc[item.pharmacyId] = [];
      }
      acc[item.pharmacyId].push(item);
      return acc;
    }, {} as { [pharmacyId: string]: CartItem[] });
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        getPharmacyGroupedItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
