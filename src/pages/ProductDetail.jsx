import React, { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Star, Plus, Minus, Share2, Truck } from "lucide-react";
import PageTransition from "../components/PageTransition";
import BentoGrid from "../components/BentoGrid";
import Reveal from "../components/Reveal";
import { img } from "../data/products";
import { useStore } from "../context/StoreContext";

export default function ProductDetail() {
  const { id } = useParams();
  const { dark, wishlist, toggleWishlist, addToBag, products, productsLoading } = useStore();
  const product = products.find((p) => p.id === id);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setQty(1);
  }, [id]);

  if (!product) {
    if (productsLoading) return <main className="px-6 py-32 text-center text-sm opacity-60">Loading…</main>;
    return <Navigate to="/shop" replace />;
  }

  const wished = wishlist.has(product.id);
  const relatedItems = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);

  return (
    <PageTransition>
      <section className="px-6 pt-10 pb-20">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs opacity-50 mb-8">
            <Link to="/shop" className="hover:underline">Shop</Link> / <Link to={`/shop?category=${product.category}`} className="hover:underline capitalize">{product.category}</Link> / <span className="opacity-80">{product.name}</span>
          </p>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl"
            >
              <img src={product.image || img(product.seed, 800, 1000)} alt={product.name} className="w-full h-full object-cover" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
              <p className="text-xs tracking-[0.25em] uppercase opacity-50 mb-2">{product.category}</p>
              <h1 className="font-display italic text-3xl sm:text-4xl font-black tracking-tight mb-3">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className={i < Math.round(product.rating) ? "fill-amber-500 text-amber-500" : "opacity-30"} />
                  ))}
                </div>
                <span className="text-xs opacity-60">{product.rating} ({product.reviews} reviews)</span>
              </div>
              <p className="font-mono text-2xl mb-1">${product.price.toFixed(2)}</p>
              {product.edition && <p className="text-xs font-mono opacity-60 mb-4">Edition {product.edition}</p>}
              <p className="text-sm opacity-75 leading-relaxed mb-6 max-w-md">{product.story}</p>

              <div className="space-y-2 text-xs opacity-70 mb-6 max-w-md">
                <div className="flex justify-between border-t border-current/10 py-2"><span>Material</span><span>{product.material}</span></div>
                <div className="flex justify-between border-t border-current/10 py-2"><span>Size</span><span>{product.size}</span></div>
                <div className="flex justify-between border-t border-current/10 py-2 border-b"><span className="flex items-center gap-1"><Truck size={12}/> Shipping</span><span>5–8 business days</span></div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center border border-current/20 rounded-full overflow-hidden">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-current/5"><Minus size={13} /></button>
                  <span className="w-8 text-center text-sm">{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-current/5"><Plus size={13} /></button>
                </div>
                <motion.button
                  whileHover={{ scale: product.inStock === false ? 1 : 1.03 }}
                  whileTap={{ scale: product.inStock === false ? 1 : 0.97 }}
                  onClick={() => product.inStock !== false && addToBag(product, qty)}
                  disabled={product.inStock === false}
                  className={`flex-1 h-11 rounded-full text-xs tracking-[0.2em] uppercase font-semibold ${product.inStock === false ? "opacity-40 cursor-not-allowed" : ""} ${dark ? "bg-[#EDE7D9] text-black" : "bg-black text-white"}`}
                >
                  {product.inStock === false ? "Out of Stock" : "Add to Bag"}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => toggleWishlist(product.id)}
                  className={`w-11 h-11 rounded-full flex items-center justify-center border ${dark ? "border-white/20" : "border-black/15"}`}
                >
                  <Heart size={16} className={wished ? "fill-[#A8431E] text-[#A8431E]" : ""} />
                </motion.button>
                <button className={`w-11 h-11 rounded-full flex items-center justify-center border ${dark ? "border-white/20" : "border-black/15"}`}>
                  <Share2 size={16} />
                </button>
              </div>
            </motion.div>
          </div>

          {relatedItems.length > 0 && (
            <div className="mt-24">
              <Reveal>
                <h2 className="font-display italic text-2xl font-black tracking-tight mb-6">You might also like</h2>
              </Reveal>
              <BentoGrid products={relatedItems} pattern={[1, 1, 1, 1]} />
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
