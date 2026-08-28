import React, { createContext, useContext, useState, useMemo, useEffect } from "react";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [dark, setDark] = useState(false);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState(new Set());
  const [cartOpen, setCartOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    document.body.style.background = dark ? "#0d0d0c" : "#f4f1eb";
    document.body.style.color = dark ? "#EDE7D9" : "#141413";
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
  }, [dark]);

  const signIn = (profile) => setUser(profile || { name: "ArtCanvas member", email: "member@artcanvas.local" });
  const signOut = () => setUser(null);
  const sendMessage = (text) => { if (!user || !text) return; setChatMessages((m) => [...m, { from: "user", text }]); setTimeout(() => setChatMessages((m) => [...m, { from: "studio", text: "Thanks for reaching out — the ArtCanvas studio will reply here shortly." }]), 700); };

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
      user, isAuthenticated: !!user, signIn, signOut, chatMessages, sendMessage,
      subtotal: cart.reduce((s, i) => s + i.price * i.qty, 0),
    }),
    [dark, cart, wishlist, cartOpen, user, chatMessages]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
