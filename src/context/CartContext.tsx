import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Product, CartItem, Coupon } from '../types';
import { initialCoupons } from '../lib/seedData';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  coupon: Coupon | null;
  couponError: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  itemCount: number;
  subtotal: number;
  mrpTotal: number;
  mrpDiscount: number;
  couponDiscount: number;
  shippingFee: number;
  freeShippingThreshold: number;
  finalTotal: number;
  amountToFreeShipping: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'little_sprout_cart_v1';
const FREE_SHIPPING_THRESHOLD = 1499;
const STANDARD_SHIPPING_FEE = 99;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error('Failed to persist cart:', err);
    }
  }, [items]);

  const addToCart = (product: Product, quantity: number = 1, selectedColor?: string) => {
    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(i => i.product.id === product.id);
      if (existingIndex > -1) {
        const next = [...prevItems];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }
      return [...prevItems, { product, quantity, selectedColor }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev =>
      prev.map(item => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const itemCount = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [items]);

  const mrpTotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.product.mrp * item.quantity, 0);
  }, [items]);

  const mrpDiscount = useMemo(() => {
    return Math.max(0, mrpTotal - subtotal);
  }, [mrpTotal, subtotal]);

  const shippingFee = useMemo(() => {
    if (subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
    return STANDARD_SHIPPING_FEE;
  }, [subtotal]);

  const amountToFreeShipping = useMemo(() => {
    return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  }, [subtotal]);

  const applyCoupon = (code: string): boolean => {
    setCouponError(null);
    const cleanCode = code.trim().toUpperCase();
    const found = initialCoupons.find(c => c.code.toUpperCase() === cleanCode && c.isActive);

    if (!found) {
      setCouponError('Invalid or expired coupon code.');
      return false;
    }

    if (subtotal < found.minCartValue) {
      setCouponError(`Minimum cart value of ₹${found.minCartValue} required for this coupon.`);
      return false;
    }

    setCoupon(found);
    return true;
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponError(null);
  };

  const couponDiscount = useMemo(() => {
    if (!coupon) return 0;
    if (coupon.discountType === 'percent') {
      return Math.round((subtotal * coupon.discountValue) / 100);
    }
    return Math.min(subtotal, coupon.discountValue);
  }, [coupon, subtotal]);

  const finalTotal = useMemo(() => {
    return Math.max(0, subtotal - couponDiscount + shippingFee);
  }, [subtotal, couponDiscount, shippingFee]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        coupon,
        couponError,
        applyCoupon,
        removeCoupon,
        itemCount,
        subtotal,
        mrpTotal,
        mrpDiscount,
        couponDiscount,
        shippingFee,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        finalTotal,
        amountToFreeShipping,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
