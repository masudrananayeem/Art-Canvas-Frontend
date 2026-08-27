import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { img } from "../data/products";
import { useStore } from "../context/StoreContext";
import { StaggerItem } from "./Reveal";

export default function ProductCard({ p }) {
  const { dark, wishlist, toggleWishlist, addToBag } = useStore();
  const wished = wishlist.has(p.id);

  return (
    <StaggerItem>
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={`group border rounded-2xl overflow-hidden flex flex-col ${dark ? "border-white/10 bg-white/[0.03]" : "border-black/10 bg-white"}`}
      >
        <Link to={`/product/${p.id}`} className="relative aspect-[3/4] overflow-hidden block">
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
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center ${dark ? "bg-black/50" : "bg-white/85"}`}
          >
            <Heart size={14} className={wished ? "fill-[#A8431E] text-[#A8431E]" : ""} />
          </motion.button>
          <div className={`absolute inset-x-0 bottom-0 h-1/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t ${dark ? "from-black/60" : "from-black/20"} to-transparent`} />
        </Link>
        <div className="p-3 flex flex-col gap-1">
          <p className="text-[10px] tracking-[0.15em] uppercase opacity-50">{p.category}</p>
          <Link to={`/product/${p.id}`} className="text-sm font-medium leading-tight hover:underline underline-offset-4">
            {p.name}
          </Link>
          <div className="flex items-center gap-1 text-[11px] opacity-70">
            <Star size={12} className="fill-amber-500 text-amber-500" />
            <span>{p.rating}</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="font-mono text-sm">${p.price.toFixed(2)}</span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.08 }}
              onClick={() => addToBag(p, 1)}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${dark ? "bg-[#EDE7D9] text-black" : "bg-black text-[#EDE7D9]"}`}
            >
              <ShoppingBag size={13} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </StaggerItem>
  );
}
