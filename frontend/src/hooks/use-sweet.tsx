import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { CartItem, Sweet } from '../types';
import { sweetsAPI } from '../lib/api';


interface SweetContextType {
  sweets: Sweet[];
  cart: CartItem[];
  loading: boolean;
  error: string | null;
  addSweet: (sweet: Omit<Sweet, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateSweet: (id: string, sweet: Partial<Sweet>) => Promise<void>;
  deleteSweet: (id: string) => Promise<void>;
  addToCart: (sweet: Sweet, quantity: number) => void;
  removeFromCart: (sweetId: string) => void;
  updateCartQuantity: (sweetId: string, quantity: number) => void;
  clearCart: () => void;
  purchaseCart: () => Promise<void>;
  refreshSweets: () => Promise<void>;
}

const SweetContext = createContext<SweetContextType | undefined>(undefined);

export const SweetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load sweets from API on component mount
  useEffect(() => {
    refreshSweets();
  }, []);

  const refreshSweets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await sweetsAPI.getAll();
      setSweets(response.sweets);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sweets');
      console.error('Error loading sweets:', err);
    } finally {
      setLoading(false);
    }
  };

  const addSweet = async (sweetData: Omit<Sweet, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await sweetsAPI.create(sweetData);
      setSweets(prev => [...prev, response.sweet]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add sweet');
      console.error('Error adding sweet:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSweet = async (id: string, sweetData: Partial<Sweet>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await sweetsAPI.update(id, sweetData);
      setSweets(prev => prev.map(sweet => 
        sweet.id === id ? response.sweet : sweet
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update sweet');
      console.error('Error updating sweet:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSweet = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await sweetsAPI.delete(id);
      setSweets(prev => prev.filter(sweet => sweet.id !== id));
      setCart(prev => prev.filter(item => item.sweet.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete sweet');
      console.error('Error deleting sweet:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (sweet: Sweet, quantity: number) => {
    if (sweet.quantity < quantity) return;
    
    setCart(prev => {
      const existingItem = prev.find(item => item.sweet.id === sweet.id);
      if (existingItem) {
        return prev.map(item =>
          item.sweet.id === sweet.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { sweet, quantity }];
    });
  };

  const removeFromCart = (sweetId: string) => {
    setCart(prev => prev.filter(item => item.sweet.id !== sweetId));
  };

  const updateCartQuantity = (sweetId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(sweetId);
      return;
    }
    
    setCart(prev => prev.map(item =>
      item.sweet.id === sweetId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const purchaseCart = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Process each cart item purchase
      for (const item of cart) {
        await sweetsAPI.purchase(item.sweet.id, item.quantity);
      }
      
      // Refresh sweets to get updated quantities
      await refreshSweets();
      clearCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete purchase');
      console.error('Error purchasing cart:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <SweetContext.Provider value={{
      sweets,
      cart,
      loading,
      error,
      addSweet,
      updateSweet,
      deleteSweet,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      purchaseCart,
      refreshSweets
    }}>
      {children}
    </SweetContext.Provider>
  );
};

export const useSweets = () => {
  const context = useContext(SweetContext);
  if (context === undefined) {
    throw new Error('useSweets must be used within a SweetProvider');
  }
  return context;
};