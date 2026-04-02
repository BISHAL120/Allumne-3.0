"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type IdLike = string | number;

type ProductInput = {
  id: IdLike;
  title: string;
  price: number;
  thumbnail?: string;
  artist?: string;
  size?: string;
  stock?: number;
  options?: Record<string, string | number>;
};

type CartItem = {
  productId: string;
  title: string;
  price: number;
  thumbnail?: string;
  artist?: string;
  size?: string;
  stock?: number;
  options?: Record<string, string | number>;
  quantity: number;
};

type Coupon = {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
};

type CartState = {
  items: CartItem[];
  shippingFee: number;
  taxRate: number;
  coupon?: Coupon;
  addToCart: (product: ProductInput, quantity?: number) => void;
  removeFromCart: (product: ProductInput) => void;
  clearCart: () => void;
  incrementItem: (product: ProductInput, amount?: number) => void;
  decrementItem: (product: ProductInput, amount?: number) => void;
  setItemQuantity: (product: ProductInput, quantity: number) => void;
  hasItem: (product: ProductInput) => boolean;
  getItemQuantity: (product: ProductInput) => number;
  setShippingFee: (fee: number) => void;
  setTaxRate: (rate: number) => void;
  setCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  getSubtotal: () => number;
  getDiscountTotal: () => number;
  getTaxTotal: () => number;
  getCartTotal: () => number;
  getCartItemCount: () => number;
};

function isSameOptions(a?: Record<string, string | number>, b?: Record<string, string | number>) {
  if (!a && !b) return true;
  if (!a || !b) return false;
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  for (const key of aKeys) {
    if (a[key] !== b[key]) return false;
  }
  return true;
}

function matchItem(i: CartItem, input: ProductInput) {
  return (
    i.productId === String(input.id) &&
    i.size === input.size &&
    isSameOptions(i.options, input.options)
  );
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      shippingFee: 0,
      taxRate: 0,
      coupon: undefined,
      addToCart: (product, quantity = 1) => {
        const id = String(product.id);
        const size = product.size;
        const items = get().items.slice();
        const index = items.findIndex((i) => matchItem(i, product));
        if (index > -1) {
          items[index] = { ...items[index], quantity: items[index].quantity + quantity };
        } else {
          items.push({
            productId: id,
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail,
            artist: product.artist,
            size,
            stock: product.stock,
            options: product.options,
            quantity,
          });
        }
        set({ items });
      },
      removeFromCart: (product) => {
        const items = get().items.filter((i) => !matchItem(i, product));
        set({ items });
      },
      clearCart: () => {
        set({ items: [] });
      },
      incrementItem: (product, amount = 1) => {
        const items = get().items.map((i) =>
          matchItem(i, product) ? { ...i, quantity: i.quantity + amount } : i
        );
        set({ items });
      },
      decrementItem: (product, amount = 1) => {
        const items = get().items
          .map((i) => (matchItem(i, product) ? { ...i, quantity: i.quantity - amount } : i))
          .filter((i) => i.quantity > 0);
        set({ items });
      },
      setItemQuantity: (product, quantity) => {
        const items = get().items
          .map((i) => (matchItem(i, product) ? { ...i, quantity } : i))
          .filter((i) => i.quantity > 0);
        set({ items });
      },
      hasItem: (product) => {
        return get().items.some((i) => matchItem(i, product));
      },
      getItemQuantity: (product) => {
        const found = get().items.find((i) => matchItem(i, product));
        return found ? found.quantity : 0;
      },
      setShippingFee: (fee) => {
        set({ shippingFee: Math.max(0, fee) });
      },
      setTaxRate: (rate) => {
        set({ taxRate: Math.max(0, rate) });
      },
      setCoupon: (coupon) => {
        set({ coupon });
      },
      removeCoupon: () => {
        set({ coupon: undefined });
      },
      getSubtotal: () => {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      },
      getDiscountTotal: () => {
        const coupon = get().coupon;
        const subtotal = get().getSubtotal();
        if (!coupon) return 0;
        if (coupon.discountAmount && coupon.discountAmount > 0) {
          return Math.min(coupon.discountAmount, subtotal);
        }
        if (coupon.discountPercent && coupon.discountPercent > 0) {
          return Math.min(subtotal * (coupon.discountPercent / 100), subtotal);
        }
        return 0;
      },
      getTaxTotal: () => {
        const taxRate = get().taxRate;
        const taxable = Math.max(get().getSubtotal() - get().getDiscountTotal(), 0);
        return taxable * (taxRate / 100);
      },
      getCartTotal: () => {
        return (
          Math.max(get().getSubtotal() - get().getDiscountTotal(), 0) +
          get().getTaxTotal() +
          get().shippingFee
        );
      },
      getCartItemCount: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },
    }),
    {
      name: "cart-store",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (state) => ({
        items: state.items,
        shippingFee: state.shippingFee,
        taxRate: state.taxRate,
        coupon: state.coupon,
      }),
    }
  )
);

