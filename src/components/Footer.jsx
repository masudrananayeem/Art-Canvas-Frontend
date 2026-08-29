import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Mail } from "lucide-react";
import { useStore } from "../context/StoreContext";

export default function Footer() {
  const { dark } = useStore();
  return (
    <footer className={`site-footer site-footer--minimal ${dark ? "site-footer--dark" : ""}`}>
      <div className="site-footer__minimal-top">
        <Link to="/" className="site-footer__logo-link" aria-label="ArtCanvas home">
          <img src="/brand/artcanvas-logo.png" alt="ArtCanvas" className="site-footer__logo" />
        </Link>
        <div className="site-footer__brand-copy">
          <span>ArtCanvas</span>
          <p>Wear. Create. Collect.</p>
        </div>
        <Link to="/shop" className="site-footer__minimal-cta">Explore <ArrowUpRight size={15} /></Link>
      </div>

      <div className="site-footer__minimal-grid">
        <div>
          <p className="site-footer__kicker">Explore</p>
          <Link to="/shop">Shop all</Link>
          <Link to="/shop?category=clothing">Clothing</Link>
          <Link to="/gallery">Gallery</Link>
        </div>
        <div>
          <p className="site-footer__kicker">Studio</p>
          <Link to="/about">About</Link>
          <Link to="/account">Account</Link>
          <a href="mailto:studio@artcanvas.local"><Mail size={13} /> Contact</a>
        </div>
        <div>
          <p className="site-footer__kicker">Follow</p>
          <a href="https://instagram.com" target="_blank" rel="noreferrer"><span className="footer-instagram-mark">@</span> Instagram</a>
          <span>Dhaka — Worldwide</span>
        </div>
      </div>

      <div className="site-footer__minimal-bottom">
        <span>© 2026 ArtCanvas</span>
        <span>Independent studio / Dhaka</span>
        <span>Privacy · Terms</span>
      </div>
    </footer>
  );
}
