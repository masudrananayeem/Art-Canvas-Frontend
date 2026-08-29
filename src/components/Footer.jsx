import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, ArrowRight } from "lucide-react";
import { useStore } from "../context/StoreContext";
export default function Footer(){ const {dark}=useStore(); return <footer className={`site-footer site-footer--editorial ${dark?"site-footer--dark":""}`}>
  <div className="footer-flag"><span>ARTCANVAS / 2026</span><span>INDEPENDENT EDITORIAL STORE</span></div>
  <div className="footer-main">
    <div className="footer-brand"><Link to="/" className="site-footer__brand"><img src="/brand/artcanvas-logo.png" alt="ArtCanvas" className="site-footer__logo" /><span>ArtCanvas</span></Link><p>Clothing, objects and visual culture — carefully selected, quietly made, and meant to stay in rotation.</p><Link to="/shop" className="site-footer__arrow-link">Explore the collection <ArrowUpRight size={15}/></Link></div>
    <div className="footer-letter"><p className="site-footer__kicker">THE STUDIO LETTER</p><h2>Good things<br/><em>take time.</em></h2><form onSubmit={e=>e.preventDefault()}><input type="email" placeholder="Your email address" aria-label="Email address"/><button type="submit" aria-label="Subscribe"><ArrowRight size={18}/></button></form><small>New arrivals, studio notes and occasional releases. No noise.</small></div>
  </div>
  <div className="footer-links">
    <div><p className="site-footer__kicker">EXPLORE</p><Link to="/">Home</Link><Link to="/shop">Shop all</Link><Link to="/gallery">Gallery</Link><Link to="/about">The studio</Link></div>
    <div><p className="site-footer__kicker">CLOTHING</p><Link to="/shop?category=clothing&gender=women">Women</Link><Link to="/shop?category=clothing&gender=men">Men</Link><Link to="/shop?category=clothing&gender=kids">Children</Link><Link to="/shop?category=accessories">Accessories</Link></div>
    <div><p className="site-footer__kicker">SERVICE</p><Link to="/account">Account</Link><Link to="/wishlist">Wishlist</Link><Link to="/shop">Shipping & returns</Link><Link to="/about">Contact studio</Link></div>
    <div><p className="site-footer__kicker">FOLLOW</p><a href="https://instagram.com" target="_blank" rel="noreferrer"><span aria-hidden="true" style={{fontSize:14,fontWeight:700,lineHeight:1}}>@</span> Instagram</a><a href="mailto:studio@artcanvas.local"><Mail size={14}/> studio@artcanvas.local</a><span className="footer-place">DHAKA — WORLDWIDE</span></div>
  </div>
  <div className="footer-bottom"><span>© 2026 ARTCANVAS</span><span>CONSIDERED / INDEPENDENT / KEPT</span><span>PRIVACY · TERMS</span></div>
</footer>}
