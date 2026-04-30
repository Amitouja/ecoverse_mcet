'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/app/lib/supabase';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: string;
  product_id: number;
  user_id: string;
  quantity: number;
  product?: {
    id: number;
    name: string;
    price: number;
    image_url: string;
    eco_score: number;
    tag: 'ORGANIC' | 'RECYCLED' | 'VEGAN';
  };
}

interface CartContextType {
  cart: CartItem[];
  loading: boolean;
  error: string | null;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch cart from database
  const fetchCart = async () => {
    if (!user) {
      setCart([]);
      return;
    }

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('cart_items')
        .select(
          `
          id,
          product_id,
          user_id,
          quantity,
          products (
            id,
            name,
            price,
            image_url,
            eco_score,
            tag
          )
        `
        )
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;
      setCart(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart when user changes
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [user?.id]);

  const addToCart = async (productId: number, quantity: number) => {
    if (!user) throw new Error('User must be logged in');

    try {
      setLoading(true);

      // Check if item already exists
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single();

      if (existingItem) {
        // Update quantity
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);

        if (updateError) throw updateError;
      } else {
        // Insert new item
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert([
            {
              user_id: user.id,
              product_id: productId,
              quantity,
            },
          ]);

        if (insertError) throw insertError;
      }

      await fetchCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      setLoading(true);
      const { error: deleteError } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      if (deleteError) throw deleteError;
      await fetchCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove from cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    try {
      setLoading(true);
      if (quantity <= 0) {
        await removeFromCart(cartItemId);
      } else {
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('id', cartItemId);

        if (updateError) throw updateError;
        await fetchCart();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update quantity');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { error: deleteError } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;
      setCart([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTotal = (): number => {
    return cart.reduce((total, item) => {
      const price = (item.product?.price || 0) as number;
      return total + price * item.quantity;
    }, 0);
  };

  const getItemCount = (): number => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        fetchCart,
        getTotal,
        getItemCount,
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
