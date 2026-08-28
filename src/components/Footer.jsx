import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Instagram, Mail, ArrowRight } from "lucide-react";
import { useStore } from "../context/StoreContext";

export default function Footer() {
  const { dark } = useStore();
  return (
    <footer className={`site-footer ${dark ? "site-footer--dark" : ""}`}>
      <div className="site-footer__top">
        <div className="site-footer__brand-block">
          <Link to="/" className="site-footer__brand" aria-label="ArtCanvas home"><span>Art</span><b>Canvas</b></Link>
          <p>Clothing, objects and visual culture — carefully selected, quietly made.</p>
          <Link to="/shop" className="site-footer__arrow-link">Explore the collection <ArrowUpRight size={15} /></Link>
        </div>
        <div className="site-footer__newsletter">
          <p className="site-footer__kicker">STAY IN THE LOOP</p>
          <h2>Notes from<br /><em>the studio.</em></h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <input aria-label="Email address" type="email" placeholder="Your email address" />
            <button aria-label="Subscribe" type="submit"><ArrowRight size={17} /></button>
          </form>
          <small>No noise. Just new work, studio notes and occasional releases.</small>
        </div>
      </div>
      <div className="site-footer__grid">
        <div><p className="site-footer__kicker">NAVIGATE</p><Link to="/">Home</Link><Link to="/shop">Shop</Link><Link to="/gallery">Gallery</Link><Link to="/about">About</Link></div>
        <div><p className="site-footer__kicker">COLLECTIONS</p><Link to="/shop?category=clothing&gender=women">Women</Link><Link to="/shop?category=clothing&gender=men">Men</Link><Link to="/shop?category=clothing&gender=kids">Children</Link><Link to="/shop?category=art">Art & Objects</Link></div>
        <div><p className="site-footer__kicker">FOLLOW</p><a href="https://instagram.com" target="_blank" rel="noreferrer"><Instagram size={14} /> Instagram</a><a href="mailto:studio@artcanvas.local"><Mail size={14} /> studio@artcanvas.local</a></div>
        <div><p className="site-footer__kicker">SERVICE</p><Link to="/account">Account</Link><Link to="/wishlist">Wishlist</Link><Link to="/shop">Shipping & returns</Link><Link to="/about">Contact studio</Link></div>
      </div>
      <div className="site-footer__bottom"><span>© 2026 ArtCanvas Studio</span><span>Made with intention / kept for longer</span><span>Dhaka — Worldwide</span></div>
    </footer>
  );
}
