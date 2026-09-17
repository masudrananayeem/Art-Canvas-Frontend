import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star, ArrowUpRight } from "lucide-react";
import { img } from "../data/products";
import { useStore } from "../context/StoreContext";
import { StaggerItem } from "./Reveal";

const VARIANTS = {
  sm: { aspect: "aspect-[4/5]", radius: "rounded-2xl", title: "text-xs", price: "text-xs", pad: "p-3", btn: "w-8 h-8" },
  md: { aspect: "aspect-[4/5]", radius: "rounded-[22px]", title: "text-sm", price: "text-sm", pad: "p-3.5", btn: "w-8 h-8" },
  lg: { aspect: "aspect-[5/6]", radius: "rounded-[26px]", title: "text-base sm:text-lg", price: "text-base", pad: "p-4 sm:p-5", btn: "w-9 h-9" },
};

export default function ProductCard({ p, size = "md" }) {
  const { dark, wishlist, toggleWishlist, addToBag } = useStore();
  const wished = wishlist.has(p.id);
  const v = VARIANTS[size] || VARIANTS.md;
  return (
    <StaggerItem className="h-full">
      <motion.article whileHover={{ y: -5 }} transition={{ duration: .25 }} className={`group h-full overflow-hidden border ${v.radius} ${dark ? "border-white/10 bg-[#1a1a17]" : "border-black/8 bg-white"}`}>
        <Link to={`/product/${p.id}`} className={`relative ${v.aspect} overflow-hidden block bg-[#ece7df]`}>
          <motion.img src={p.image || img(p.seed)} alt={p.name} loading="lazy" className="w-full h-full object-cover" whileHover={{ scale: 1.055 }} transition={{ duration: .55 }} />
          {p.inStock === false && <div className="absolute inset-0 flex items-center justify-center bg-black/40"><span className="micro-tag !bg-black/80 !text-white">Out of Stock</span></div>}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className="micro-tag">{p.category === "clothing" ? p.gender : p.category}</span>
            {p.subcategory && <span className="micro-tag">{p.subcategory}</span>}
          </div>
          <button onClick={(e) => { e.preventDefault(); toggleWishlist(p.id); }} className={`absolute top-3 right-3 ${v.btn} rounded-full flex items-center justify-center backdrop-blur ${dark ? "bg-black/45 text-white" : "bg-white/85"}`} aria-label="Save item"><Heart size={14} className={wished ? "fill-[#A8431E] text-[#A8431E]" : ""} /></button>
          <div className="absolute bottom-3 right-3 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all hidden sm:flex"><span className="circle-action"><ArrowUpRight size={14} /></span></div>
        </Link>
        <div className={`${v.pad} flex flex-col gap-1`}>
          <Link to={`/product/${p.id}`} className={`${v.title} font-semibold leading-tight hover:underline underline-offset-4`}>{p.name}</Link>
          <div className="flex items-center gap-1 text-[10px] opacity-55"><Star size={11} className="fill-current" /><span>{p.rating} · {p.reviews} reviews</span></div>
          <div className="mt-auto pt-2 flex items-center justify-between gap-3"><span className={`font-mono ${v.price}`}>${p.price.toFixed(2)}</span><button disabled={p.inStock === false} onClick={() => p.inStock !== false && addToBag(p)} className={`${v.btn} rounded-full flex items-center justify-center transition-transform hover:scale-105 ${p.inStock === false ? "opacity-30 cursor-not-allowed" : ""} ${dark ? "bg-[#F4EEE3] text-black" : "bg-[#171715] text-white"}`} aria-label="Add to bag"><ShoppingBag size={14} /></button></div>
        </div>
      </motion.article>
    </StaggerItem>
  );
}
