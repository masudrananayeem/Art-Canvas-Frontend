import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useStore } from "../context/StoreContext";

export default function Footer() {
  const { dark } = useStore();
  return (
    <footer className={`site-footer site-footer--clean ${dark ? "site-footer--dark" : ""}`}>
      <div className="footer-clean__top">
        <Link to="/" className="footer-clean__brand" aria-label="ArtCanvas home">
          <img src="/brand/artcanvas-logo.png" alt="ArtCanvas" />
          <span>ArtCanvas</span>
        </Link>
        <Link to="/shop" className="footer-clean__explore">Explore collection <ArrowUpRight size={14} /></Link>
      </div>
      <div className="footer-clean__body">
        <p>Wear. Create. Collect.</p>
        <nav aria-label="Footer navigation">
          <Link to="/shop">Shop</Link>
          <Link to="/shop?category=clothing">Clothing</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/about">About</Link>
          <Link to="/account">Account</Link>
        </nav>
        <span>Dhaka — Worldwide</span>
      </div>
      <div className="footer-clean__bottom">
        <span>© 2026 ArtCanvas</span>
        <span>Independent studio</span>
        <span>Privacy · Terms</span>
      </div>
    </footer>
  );
}
