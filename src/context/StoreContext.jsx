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

const EMPTY_SITE_CONTENT = { heroImage: "", manifestoImage: "", heroHeadline: "", heroTagline: "", heroTopLeft: "ARTCANVAS / NEW SEASON", heroTopRight: "DROP 04 — 2026", heroCtaLabel: "Explore the collection", heroCtaLink: "/shop?category=clothing", heroCtaNote: "Designed in small runs.\nMade to be kept.", heroBottomLeft: "01", heroBottomRight: "EST. 2026", filmTitle: "Clothing in motion.", filmDescription: "A moving study of fabric, proportion and everyday gesture.", filmVideoUrl: "", showWhatsNew: true, showFilm: true, showManifesto: true, showAnnouncement: false, announcementText: "", featuredTitle: "Currently interesting.", featuredDescription: "", whatsNewTitle: "What’s new.", whatsNewDescription: "Fresh pieces, new proportions and objects worth noticing." };

export function StoreProvider({ children }) {
  const [dark, setDark] = useState(false);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState(new Set());
  const [cartOpen, setCartOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState(null);

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  const [siteContent, setSiteContent] = useState(EMPTY_SITE_CONTENT);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({ women: [], men: [], kids: [] });

  const [firebaseUser, setFirebaseUser] = useState(null);
  const [profile, setProfile] = useState(null); // { name, phone, photoURL, address, admin }
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

  const refreshSiteContent = useCallback(async () => {
    try {
      const content = await api.getSiteContent();
      setSiteContent({ ...EMPTY_SITE_CONTENT, ...content });
    } catch (e) {
      console.error("Failed to load site content", e);
    }
  }, []);

  const refreshCategories = useCallback(async () => {
    try {
      const list = await api.getCategories();
      setCategories(list);
    } catch (e) {
      console.error("Failed to load categories", e);
    }
  }, []);

  const refreshSubcategories = useCallback(async () => {
    try {
      const detailed = await api.getSubcategories();
      const flat = {};
      for (const gender of Object.keys(detailed)) flat[gender] = detailed[gender].map((s) => s.name);
      setSubcategories(flat);
    } catch (e) {
      console.error("Failed to load sub-categories", e);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
    refreshSiteContent();
    refreshCategories();
    refreshSubcategories();
  }, [refreshProducts, refreshSiteContent, refreshCategories, refreshSubcategories]);

  const refreshMyProfile = useCallback(async () => {
    try {
      const me = await api.me();
      setProfile(me);
      setIsAdmin(!!me.admin);
    } catch (e) {
      console.error("Failed to load profile", e);
    }
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const token = await fbUser.getIdTokenResult(true).catch(() => null);
        setIsAdmin(!!token?.claims?.admin);
        refreshMyProfile();
      } else {
        setIsAdmin(false);
        setProfile(null);
      }
      setAuthLoading(false);
    });
    return unsub;
  }, [refreshMyProfile]);

  const user = firebaseUser
    ? {
        uid: firebaseUser.uid,
        name: profile?.name || firebaseUser.displayName || firebaseUser.email,
        email: firebaseUser.email,
        phone: profile?.phone || "",
        photoURL: profile?.photoURL || firebaseUser.photoURL || "",
        address: profile?.address || null,
      }
    : null;

  const updateMyProfile = async (patch) => {
    const saved = await api.updateMe(patch);
    setProfile(saved);
    if (patch.name && firebaseUser) {
      updateProfile(firebaseUser, { displayName: patch.name }).catch(() => {});
    }
    return saved;
  };

  const clearAuthError = () => setAuthError(null);

  const signUpWithEmail = async (name, email, password) => {
    setAuthError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) await updateProfile(cred.user, { displayName: name });
      if (name) await api.updateMe({ name }).catch(() => {});
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

  // Real messaging, backed by the /api/messages endpoints. The client's whole
  // conversation with the studio lives in Firestore, keyed by their uid, so
  // an admin can find and reply to it from the Messages tab.
  const refreshMessages = useCallback(async () => {
    if (!auth.currentUser) return;
    try {
      const list = await api.myMessages();
      setChatMessages(Array.isArray(list) ? list : []);
      setChatError(null);
    } catch (e) {
      // Do not make a temporary Firestore quota/rate-limit error look like a
      // broken chat. The next refresh will retry automatically.
      const message = String(e?.message || "");
      if (/429|quota exceeded|resource_exhausted/i.test(message)) {
        setChatError("Messages are temporarily rate-limited. Please try again in a moment.");
      } else {
        setChatError(message || "Could not load messages.");
      }
    }
  }, []);

  const sendMessage = async (text) => {
    if (!user || !text) return;
    setChatError(null);
    // Optimistic bubble so the studio chat feels instant.
    const optimistic = { from: "user", text, createdAt: new Date().toISOString(), _pending: true };
    setChatMessages((m) => [...m, optimistic]);
    try {
      await api.sendMessage(text);
      await refreshMessages();
    } catch (e) {
      setChatError(e.message || "Could not send your message. Please try again.");
      setChatMessages((m) => m.filter((msg) => msg !== optimistic));
    }
  };

  // Messages are intentionally loaded only when the chat is opened.
  // Continuous background polling can exhaust Firestore read/query quota and
  // cause a cascade of 429 errors. ChatWidget performs the on-demand refresh.
  useEffect(() => {
    if (!user) {
      setChatMessages([]);
      setChatError(null);
    }
  }, [user]);

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
  const checkout = async (shipping, paymentMethod, paymentRef) => {
    if (!user) throw new Error("Sign in to check out.");
    if (cart.length === 0) throw new Error("Your bag is empty.");
    const order = await api.placeOrder(
      cart.map((i) => ({ id: i.id, qty: i.qty })),
      shipping,
      paymentMethod,
      paymentRef
    );
    setCart([]);
    setCartOpen(false);
    // Keep the customer's latest delivery details in their profile for the next order.
    updateMyProfile({
      name: shipping.fullName,
      phone: shipping.phone,
      address: { ...shipping },
    }).catch(() => {});
    await refreshProducts();
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

      siteContent,
      refreshSiteContent,

      categories,
      refreshCategories,

      subcategories,
      refreshSubcategories,

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
      updateMyProfile,
      refreshMyProfile,

      chatMessages,
      chatLoading,
      chatError,
      sendMessage,
      refreshMessages,
    }),
    [dark, cart, wishlist, cartOpen, user, isAdmin, authLoading, authError, chatMessages, chatLoading, chatError, products, productsLoading, siteContent, categories, subcategories]
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
