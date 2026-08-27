import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { img } from "../data/products";
import { useStore } from "../context/StoreContext";
import { StaggerItem } from "./Reveal";

const VARIANTS = {
  sm: { aspect: "aspect-[3/4]", radius: "rounded-xl", title: "text-xs", price: "text-xs", pad: "p-2.5", btn: "w-7 h-7" },
  md: { aspect: "aspect-[3/4]", radius: "rounded-2xl", title: "text-sm", price: "text-sm", pad: "p-3", btn: "w-8 h-8" },
  lg: { aspect: "aspect-[4/5]", radius: "rounded-3xl", title: "text-base sm:text-lg", price: "text-base", pad: "p-4 sm:p-5", btn: "w-9 h-9" },
};

export default function ProductCard({ p, size = "md" }) {
  const { dark, wishlist, toggleWishlist, addToBag } = useStore();
  const wished = wishlist.has(p.id);
  const v = VARIANTS[size] || VARIANTS.md;

  return (
    <StaggerItem className="h-full">
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={`group border ${v.radius} overflow-hidden flex flex-col h-full ${dark ? "border-white/10 bg-white/[0.03]" : "border-black/10 bg-white"}`}
      >
        <Link to={`/product/${p.id}`} className={`relative ${v.aspect} overflow-hidden block`}>
          <motion.img
            src={img(p.seed)}
            alt={p.name}
            loading="lazy"
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
          {p.edition && (
            <span className={`absolute top-3 left-3 text-[10px] tracking-widest uppercase px-2 py-1 rounded-full ${dark ? "bg-black/70 text-[#EDE7D9]" : "bg-white/90 text-black"}`}>
              Ed. {p.edition}
            </span>
          )}
          <motion.button
            onClick={(e) => { e.preventDefault(); toggleWishlist(p.id); }}
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.12 }}
            className={`absolute top-3 right-3 ${v.btn} rounded-full flex items-center justify-center ${dark ? "bg-black/50" : "bg-white/85"}`}
          >
            <Heart size={size === "lg" ? 16 : 14} className={wished ? "fill-[#A8431E] text-[#A8431E]" : ""} />
          </motion.button>
          <div className={`absolute inset-x-0 bottom-0 h-1/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t ${dark ? "from-black/60" : "from-black/20"} to-transparent`} />
          {size === "lg" && (
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden sm:block">
              <span className="text-white text-xs tracking-[0.2em] uppercase font-semibold">View Piece →</span>
            </div>
          )}
        </Link>
        <div className={`${v.pad} flex flex-col gap-1 flex-1`}>
          <p className="text-[10px] tracking-[0.15em] uppercase opacity-50">{p.category}{p.subcategory ? ` · ${p.subcategory}` : ""}</p>
          <Link to={`/product/${p.id}`} className={`${v.title} font-medium leading-tight hover:underline underline-offset-4`}>
            {p.name}
          </Link>
          <div className="flex items-center gap-1 text-[11px] opacity-70">
            <Star size={12} className="fill-amber-500 text-amber-500" />
            <span>{p.rating}</span>
          </div>
          <div className="flex items-center justify-between mt-auto pt-1">
            <span className={`font-mono ${v.price}`}>${p.price.toFixed(2)}</span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.08 }}
              onClick={() => addToBag(p, 1)}
              className={`${v.btn} rounded-full flex items-center justify-center ${dark ? "bg-[#EDE7D9] text-black" : "bg-black text-[#EDE7D9]"}`}
            >
              <ShoppingBag size={size === "lg" ? 15 : 13} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </StaggerItem>
  );
}
