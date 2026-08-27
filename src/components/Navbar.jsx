import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, ShoppingBag, X, Moon, Sun, Menu } from "lucide-react";
import { useStore } from "../context/StoreContext";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/wishlist", label: "Wishlist" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const { dark, setDark, cartCount, wishlist, setCartOpen } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      setHidden(y > lastY && y > 140);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        animate={{ y: hidden ? -110 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-4 inset-x-0 z-50 flex justify-center px-4"
      >
        <nav
          className={`w-full max-w-6xl flex items-center justify-between rounded-full px-5 border backdrop-blur-md transition-all duration-300 ${
            scrolled ? "py-2 shadow-lg" : "py-3"
          } ${dark ? "bg-[#111110]/85 border-white/10 text-[#EDE7D9]" : "bg-white/90 border-black/10 text-[#111110]"}`}
        >
          <div className="hidden md:flex items-center gap-6 text-xs tracking-[0.12em] uppercase font-medium">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) => `pb-0.5 border-b transition-colors ${isActive ? "border-current" : "border-transparent opacity-70 hover:opacity-100"}`}
              >
                {l.label}
              </NavLink>
            ))}
          </div>
          <button className="md:hidden" onClick={() => setMobileMenu(true)}>
            <Menu size={18} />
          </button>
          <NavLink to="/" className="text-lg font-bold tracking-tight">
            ARTCANVAS
          </NavLink>
          <div className="flex items-center gap-3 sm:gap-4">
            <Search size={16} className="hidden sm:block cursor-pointer opacity-80 hover:opacity-100 transition" onClick={() => navigate("/shop")} />
            <button className="relative" onClick={() => navigate("/wishlist")}>
              <Heart size={16} />
              <AnimatePresence>
                {wishlist.size > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 text-[9px] w-4 h-4 rounded-full bg-[#A8431E] text-white flex items-center justify-center"
                  >
                    {wishlist.size}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <button className="relative" onClick={() => setCartOpen(true)}>
              <ShoppingBag size={16} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 text-[9px] w-4 h-4 rounded-full bg-[#A8431E] text-white flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <span className="hidden sm:inline text-xs font-medium cursor-pointer">Login</span>
            <button className={`hidden sm:inline-flex px-4 py-1.5 rounded-full text-xs font-semibold ${dark ? "bg-[#EDE7D9] text-black" : "bg-black text-white"}`}>
              Sign Up
            </button>
            <motion.button
              whileTap={{ scale: 0.85, rotate: 180 }}
              onClick={() => setDark((d) => !d)}
              className={`w-8 h-8 rounded-full flex items-center justify-center border ${dark ? "border-white/20" : "border-black/15"}`}
            >
              {dark ? <Sun size={14} /> : <Moon size={14} />}
            </motion.button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed inset-0 z-[110] flex flex-col items-center justify-center gap-8 text-3xl font-semibold ${dark ? "bg-[#111110] text-[#EDE7D9]" : "bg-[#FAF7F1] text-[#111110]"}`}
          >
            <button className="absolute top-6 right-6" onClick={() => setMobileMenu(false)}>
              <X size={24} />
            </button>
            {LINKS.map((l, i) => (
              <motion.div key={l.to} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}>
                <NavLink to={l.to} onClick={() => setMobileMenu(false)}>
                  {l.label}
                </NavLink>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
