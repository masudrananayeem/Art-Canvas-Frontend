import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import { api } from "../lib/api";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [dark, setDark] = useState(false);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState(new Set());
  const [cartOpen, setCartOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  const [firebaseUser, setFirebaseUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    document.body.style.background = dark ? "#0d0d0c" : "#f4f1eb";
    document.body.style.color = dark ? "#EDE7D9" : "#141413";
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
  }, [dark]);

  const refreshProducts = useCallback(async () => {
    try {
      const list = await api.getProducts();
      setProducts(list);
    } catch (e) {
      console.error("Failed to load products", e);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const token = await fbUser.getIdTokenResult(true).catch(() => null);
        setIsAdmin(!!token?.claims?.admin);
      } else {
        setIsAdmin(false);
      }
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  const user = firebaseUser
    ? { uid: firebaseUser.uid, name: firebaseUser.displayName || firebaseUser.email, email: firebaseUser.email }
    : null;

  const clearAuthError = () => setAuthError(null);

  const signUpWithEmail = async (name, email, password) => {
    setAuthError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) await updateProfile(cred.user, { displayName: name });
      return true;
    } catch (e) {
      setAuthError(friendlyAuthError(e));
      return false;
    }
  };

  const signInWithEmail = async (email, password) => {
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (e) {
      setAuthError(friendlyAuthError(e));
      return false;
    }
  };

  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      return true;
    } catch (e) {
      setAuthError(friendlyAuthError(e));
      return false;
    }
  };

  const signOut = () => firebaseSignOut(auth);

  const sendMessage = (text) => {
    if (!user || !text) return;
    setChatMessages((m) => [...m, { from: "user", text }]);
    setTimeout(
      () => setChatMessages((m) => [...m, { from: "studio", text: "Thanks for reaching out — the ArtCanvas studio will reply here shortly." }]),
      700
    );
  };

  const addToBag = (product, qty = 1) => {
    if (product.inStock === false) return;
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

  // Places the order with the backend (validates + decrements real stock),
  // then clears the local cart and refreshes product stock levels.
  const checkout = async (shipping) => {
    if (!user) throw new Error("Sign in to check out.");
    if (cart.length === 0) throw new Error("Your bag is empty.");
    const order = await api.placeOrder(
      cart.map((i) => ({ id: i.id, qty: i.qty })),
      shipping
    );
    setCart([]);
    setCartOpen(false);
    refreshProducts();
    return order;
  };

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
      checkout,

      products,
      productsLoading,
      refreshProducts,

      user,
      isAuthenticated: !!user,
      isAdmin,
      authLoading,
      authError,
      clearAuthError,
      signUpWithEmail,
      signInWithEmail,
      signInWithGoogle,
      signOut,

      chatMessages,
      sendMessage,
    }),
    [dark, cart, wishlist, cartOpen, user, isAdmin, authLoading, authError, chatMessages, products, productsLoading]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

function friendlyAuthError(e) {
  const code = e?.code || "";
  if (code.includes("email-already-in-use")) return "That email already has an account — try signing in instead.";
  if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found")) return "Incorrect email or password.";
  if (code.includes("weak-password")) return "Password should be at least 6 characters.";
  if (code.includes("popup-closed-by-user")) return "Google sign-in was cancelled.";
  return e?.message || "Something went wrong. Please try again.";
}

export const useStore = () => useContext(StoreContext);
