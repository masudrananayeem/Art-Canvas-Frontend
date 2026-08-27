import React, { createContext, useContext, useState, useMemo } from "react";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [dark, setDark] = useState(false);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState(new Set());
  const [cartOpen, setCartOpen] = useState(false);

  const addToBag = (product, qty = 1) => {
    setCart((c) => {
      const existing = c.find((i) => i.id === product.id);
      if (existing) return c.map((i) => (i.id === product.id ? { ...i, qty: i.qty + qty } : i));
      return [...c, { ...product, qty }];
    });
    setCartOpen(true);
  };
  const removeFromCart = (id) => setCart((c) => c.filter((i) => i.id !== id));
  const updateQty = (id, qty) => setCart((c) => c.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)));
  const toggleWishlist = (id) =>
    setWishlist((w) => {
      const n = new Set(w);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const value = useMemo(
    () => ({
      dark,
      setDark,
      cart,
      addToBag,
      removeFromCart,
      updateQty,
      wishlist,
      toggleWishlist,
      cartOpen,
      setCartOpen,
      cartCount: cart.reduce((s, i) => s + i.qty, 0),
      subtotal: cart.reduce((s, i) => s + i.price * i.qty, 0),
    }),
    [dark, cart, wishlist, cartOpen]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
