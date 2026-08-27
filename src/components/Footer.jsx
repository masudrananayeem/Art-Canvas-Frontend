import React from "react";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";

export default function Footer() {
  const { dark } = useStore();
  return (
    <footer className={`px-6 pt-16 pb-8 ${dark ? "bg-white/5" : "bg-black text-white"}`}>
      <div className="max-w-6xl mx-auto grid sm:grid-cols-3 gap-10 mb-12">
        <div>
          <p className="font-display italic text-xl font-black tracking-tight mb-3">ArtCanvas</p>
          <p className="text-sm opacity-60 max-w-xs">ArtCanvas is a premium studio platform blending fashion, art and design into one collection.</p>
        </div>
        <div>
          <p className="text-xs tracking-widest uppercase opacity-50 mb-3">Quick Links</p>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/shop" className="hover:underline">Shop</Link></li>
            <li><Link to="/about" className="hover:underline">About Us</Link></li>
            <li><Link to="/wishlist" className="hover:underline">Wishlist</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs tracking-widest uppercase opacity-50 mb-3">Connect</p>
          <ul className="space-y-2 text-sm opacity-80">
            <li>Instagram</li>
            <li>Pinterest</li>
            <li>Behance</li>
            <li>Email</li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between text-xs opacity-50 border-t border-white/10 pt-6">
        <span>© 2026 ArtCanvas Studio</span>
        <span>Wearable art meets contemporary design.</span>
      </div>
    </footer>
  );
}
