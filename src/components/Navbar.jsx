import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, ShoppingBag, Moon, Sun, Menu, ChevronDown, UserRound } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { SUBCATEGORIES } from "../data/products";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
];
const people = [
  ["Women", "women", "Dresses · Outerwear · Tops"],
  ["Men", "men", "Shirts · Outerwear · Trousers"],
  ["Children", "kids", "Tees · Outerwear · Sets"],
];

export default function Navbar({ onMenu }) {
  const { dark, setDark, cartCount, wishlist, setCartOpen } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [clothingOpen, setClothingOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const shopFor = (gender, sub) => navigate(`/shop?category=clothing&gender=${gender}&sub=${encodeURIComponent(sub)}`);

  return (
    <header className="sticky top-0 z-50 px-3 sm:px-5 pt-3">
      <div className={`max-w-7xl mx-auto border-b transition-all duration-300 ${dark ? (scrolled ? "bg-[#151513]/94 border-white/10 text-[#F4EEE3]" : "bg-transparent border-transparent text-[#F4EEE3]") : (scrolled ? "bg-[#FBF8F2]/94 border-black/10 text-[#171715]" : "bg-transparent border-transparent text-[#171715]")} ${scrolled ? "py-2" : "py-4"}`}>
        <div className="px-3 sm:px-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 lg:w-1/3">
            <button className="lg:hidden p-2 rounded-xl hover:bg-current/5" onClick={onMenu} aria-label="Open menu"><Menu size={19} /></button>
          </div>

          <div className="desktop-nav hidden lg:grid">
            <nav className="desktop-nav__side desktop-nav__side--left text-[11px] uppercase tracking-[0.18em] font-semibold">
              <NavLink to="/" className="nav-pill">Home</NavLink>
              <div className="relative" onMouseEnter={() => setClothingOpen(true)} onMouseLeave={() => setClothingOpen(false)}>
                <button className="nav-pill flex items-center gap-1" onClick={() => navigate("/shop?category=clothing")}>Clothing <ChevronDown size={13} /></button>
                <AnimatePresence>
                  {clothingOpen && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className={`absolute left-0 top-full mt-3 w-[680px] rounded-[22px] border p-4 shadow-2xl grid grid-cols-3 gap-3 ${dark ? "bg-[#191917] border-white/10" : "bg-[#fffdf8] border-black/10"}`}>
                      {people.map(([label, id, desc]) => (
                        <div key={id} className={`rounded-2xl p-4 border ${dark ? "border-white/10 bg-white/[.03]" : "border-black/5 bg-black/[.025]"}`}>
                          <div className="flex items-start justify-between mb-3"><div><p className="text-base font-display italic font-bold normal-case tracking-normal">{label}</p><p className="text-[10px] opacity-50 mt-1 normal-case tracking-normal">{desc}</p></div><span className="mini-number">0{id === "women" ? 1 : id === "men" ? 2 : 3}</span></div>
                          <div className="space-y-1">
                            <NavLink to={`/shop?category=clothing&gender=${id}`} className="menu-link">All {label}</NavLink>
                            {SUBCATEGORIES[id].map((sub) => <button key={sub} onClick={() => shopFor(id, sub)} className="menu-link text-left w-full">{sub}</button>)}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <NavLink to="/shop" className="nav-pill">Shop</NavLink>
            </nav>
            <NavLink to="/" className="brand-mark desktop-nav__brand">Art<span>Canvas</span></NavLink>
            <nav className="desktop-nav__side desktop-nav__side--right text-[11px] uppercase tracking-[0.18em] font-semibold">
              <NavLink to="/gallery" className="nav-pill">Gallery</NavLink>
              <NavLink to="/about" className="nav-pill">About</NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-1.5 lg:w-1/3 justify-end">
            <button className="icon-btn hidden sm:flex" onClick={() => navigate("/shop")} aria-label="Search"><Search size={16} /></button>
            <button className="icon-btn" onClick={() => navigate("/account")} aria-label="Account"><UserRound size={16} /></button>
            <button className="icon-btn relative" onClick={() => navigate("/wishlist")} aria-label="Wishlist"><Heart size={16} />{wishlist.size > 0 && <span className="count-dot">{wishlist.size}</span>}</button>
            <button className="icon-btn relative" onClick={() => setCartOpen(true)} aria-label="Bag"><ShoppingBag size={16} />{cartCount > 0 && <span className="count-dot">{cartCount}</span>}</button>
            <motion.button whileTap={{ scale: .88, rotate: 180 }} onClick={() => setDark((d) => !d)} className="icon-btn border" aria-label="Toggle theme">{dark ? <Sun size={14} /> : <Moon size={14} />}</motion.button>
          </div>
        </div>
      </div>
    </header>
  );
}
