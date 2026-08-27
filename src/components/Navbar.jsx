import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, ShoppingBag, Moon, Sun, Menu } from "lucide-react";
import { useStore } from "../context/StoreContext";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/gallery", label: "Gallery" },
  { to: "/wishlist", label: "Wishlist" },
  { to: "/about", label: "About" },
];

export default function Navbar({ onMenu }) {
  const { dark, setDark, cartCount, wishlist, setCartOpen } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* utility strip */}
      <div className={`text-center text-[10px] sm:text-[11px] tracking-[0.2em] uppercase py-1.5 ${dark ? "bg-[#EDE7D9] text-black" : "bg-black text-white"}`}>
        Free studio shipping on orders over $150
      </div>

      {/* main row */}
      <div
        className={`border-b backdrop-blur-md transition-all duration-300 ${
          dark ? "bg-[#111110]/90 border-white/10 text-[#EDE7D9]" : "bg-[#FAF7F1]/90 border-black/10 text-[#111110]"
        } ${scrolled ? "py-2.5" : "py-4"}`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button className="lg:hidden -ml-1 p-1" onClick={onMenu} aria-label="Open menu">
              <Menu size={20} />
            </button>
            <NavLink to="/" className="font-display font-black tracking-tight text-xl sm:text-2xl italic">
              ArtCanvas
            </NavLink>
          </div>

          <nav className="hidden lg:flex items-center gap-7 text-[11px] tracking-[0.18em] uppercase font-semibold">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) => `pb-1 border-b-2 transition-colors ${isActive ? "border-current" : "border-transparent opacity-60 hover:opacity-100"}`}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full hover:bg-current/5 transition" onClick={() => navigate("/shop")} aria-label="Search">
              <Search size={16} />
            </button>
            <button className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-current/5 transition" onClick={() => navigate("/wishlist")} aria-label="Wishlist">
              <Heart size={16} />
              <AnimatePresence>
                {wishlist.size > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-0.5 right-0.5 text-[9px] w-4 h-4 rounded-full bg-[#A8431E] text-white flex items-center justify-center"
                  >
                    {wishlist.size}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <button className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-current/5 transition" onClick={() => setCartOpen(true)} aria-label="Bag">
              <ShoppingBag size={16} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-0.5 right-0.5 text-[9px] w-4 h-4 rounded-full bg-[#A8431E] text-white flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <motion.button
              whileTap={{ scale: 0.85, rotate: 180 }}
              onClick={() => setDark((d) => !d)}
              className={`w-9 h-9 rounded-full flex items-center justify-center border ${dark ? "border-white/20" : "border-black/15"}`}
              aria-label="Toggle theme"
            >
              {dark ? <Sun size={14} /> : <Moon size={14} />}
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
}
