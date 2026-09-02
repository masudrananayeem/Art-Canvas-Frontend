import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Heart, ShoppingBag, Moon, Sun, Menu, ChevronDown, UserRound, ShieldCheck } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { SUBCATEGORIES } from "../data/products";

const people = [
  ["Women", "women", "Dresses · Outerwear · Tops"],
  ["Men", "men", "Shirts · Outerwear · Trousers"],
  ["Children", "kids", "Tees · Outerwear · Sets"],
];

const navClass = ({ isActive }) => `nav-link ${isActive ? "is-active" : ""}`;

export default function Navbar({ onMenu }) {
  const { dark, setDark, cartCount, wishlist, setCartOpen, isAdmin } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [clothingOpen, setClothingOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const shopFor = (gender, sub) => navigate(`/shop?category=clothing&gender=${gender}&sub=${encodeURIComponent(sub)}`);
  const tone = dark ? "nav-surface nav-surface--dark" : "nav-surface";

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className={tone}>
        <div className="nav-layout">
          <div className="nav-mobile-trigger">
            <button className="nav-icon" onClick={onMenu} aria-label="Open menu"><Menu size={19} /></button>
          </div>

          <nav className="nav-primary" aria-label="Primary navigation">
            <NavLink to="/" className={navClass}>Home</NavLink>
            <div className="nav-dropdown-wrap" onMouseEnter={() => setClothingOpen(true)} onMouseLeave={() => setClothingOpen(false)}>
              <button className={`nav-link nav-link--button ${clothingOpen ? "is-open" : ""}`} onClick={() => navigate("/shop?category=clothing")}>
                Clothing <ChevronDown size={12} />
              </button>
              <AnimatePresence>
                {clothingOpen && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: .22 }} className={`clothing-menu ${dark ? "clothing-menu--dark" : ""}`}>
                    {people.map(([label, id, desc], index) => (
                      <div key={id} className="clothing-menu__group">
                        <div className="clothing-menu__heading">
                          <div><strong>{label}</strong><span>{desc}</span></div>
                          <small>0{index + 1}</small>
                        </div>
                        <NavLink to={`/shop?category=clothing&gender=${id}`} className="clothing-menu__all">All {label}</NavLink>
                        {SUBCATEGORIES[id].map((sub) => <button key={sub} onClick={() => shopFor(id, sub)}>{sub}</button>)}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <NavLink to="/shop" className={navClass}>Shop</NavLink>
          </nav>

          <NavLink to="/" className="brand-lockup" aria-label="ArtCanvas home">
            <span>Art</span><b>Canvas</b>
          </NavLink>

          <div className="nav-right">
            <nav className="nav-secondary" aria-label="Secondary navigation">
              <NavLink to="/gallery" className={navClass}>Gallery</NavLink>
              <NavLink to="/about" className={navClass}>About</NavLink>
            </nav>
            <div className="nav-actions">
              <button className="nav-icon nav-search" onClick={() => navigate("/shop")} aria-label="Search"><Search size={17} /></button>
              {isAdmin && <button className="nav-icon" onClick={() => navigate("/admin")} aria-label="Admin dashboard"><ShieldCheck size={17} /></button>}
              <button className="nav-icon" onClick={() => navigate("/account")} aria-label="Account"><UserRound size={17} /></button>
              <button className="nav-icon nav-badge" onClick={() => navigate("/wishlist")} aria-label="Wishlist"><Heart size={17} />{wishlist.size > 0 && <span>{wishlist.size}</span>}</button>
              <button className="nav-icon nav-badge" onClick={() => setCartOpen(true)} aria-label="Bag"><ShoppingBag size={17} />{cartCount > 0 && <span>{cartCount}</span>}</button>
              <motion.button whileTap={{ scale: .88, rotate: 180 }} className="nav-icon nav-theme" onClick={() => setDark((d) => !d)} aria-label="Toggle theme">{dark ? <Sun size={15} /> : <Moon size={15} />}</motion.button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
