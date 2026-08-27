import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Shirt, Sparkles, Baby, Gift, ChevronDown } from "lucide-react";
import PageTransition from "../components/PageTransition";
import ProductCard from "../components/ProductCard";
import { Stagger } from "../components/Reveal";
import { CATEGORIES, PRODUCTS } from "../data/products";
import { useStore } from "../context/StoreContext";

const ICONS = { clothing: Shirt, art: Sparkles, objects: Package, accessories: Gift, gifts: Gift };
const SORTS = ["Featured", "Price: Low to High", "Price: High to Low", "Top Rated"];

export default function Shop() {
  const { dark } = useStore();
  const [params, setParams] = useSearchParams();
  const active = params.get("category") || "all";
  const [sort, setSort] = useState("Featured");
  const [sortOpen, setSortOpen] = useState(false);

  const setActive = (id) => {
    if (id === "all") setParams({});
    else setParams({ category: id });
  };

  const filtered = useMemo(() => {
    let list = active === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === active);
    list = [...list];
    if (sort === "Price: Low to High") list.sort((a, b) => a.price - b.price);
    if (sort === "Price: High to Low") list.sort((a, b) => b.price - a.price);
    if (sort === "Top Rated") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [active, sort]);

  return (
    <PageTransition>
      <section className="px-6 pt-16 pb-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs tracking-[0.25em] uppercase opacity-50 mb-2">Give All You Need</p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">THE COLLECTION</h1>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[220px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="space-y-6">
            <div>
              <p className="text-xs tracking-widest uppercase opacity-50 mb-3">Category</p>
              <div className="space-y-1">
                <button
                  onClick={() => setActive("all")}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-full text-sm transition ${
                    active === "all" ? (dark ? "bg-[#EDE7D9] text-black" : "bg-black text-white") : "hover:bg-current/5"
                  }`}
                >
                  <span className="flex items-center gap-2"><Package size={14} /> All Product</span>
                  <span className="text-[10px] opacity-70">{PRODUCTS.length}</span>
                </button>
                {CATEGORIES.map((c) => {
                  const Icon = ICONS[c.id];
                  const count = PRODUCTS.filter((p) => p.category === c.id).length;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setActive(c.id)}
                      className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-full text-sm transition ${
                        active === c.id ? (dark ? "bg-[#EDE7D9] text-black" : "bg-black text-white") : "hover:bg-current/5"
                      }`}
                    >
                      <span className="flex items-center gap-2"><Icon size={14} /> {c.name}</span>
                      <span className="text-[10px] opacity-70">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className={`h-px ${dark ? "bg-white/10" : "bg-black/10"}`} />
            <div className="text-xs opacity-60 leading-relaxed">
              Every piece is studio-made in small batches. Limited editions are numbered on arrival.
            </div>
          </aside>

          {/* Grid */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm opacity-60">{filtered.length} pieces</p>
              <div className="relative">
                <button
                  onClick={() => setSortOpen((s) => !s)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs border ${dark ? "border-white/15" : "border-black/15"}`}
                >
                  {sort} <ChevronDown size={12} className={`transition-transform ${sortOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {sortOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className={`absolute right-0 mt-2 w-48 rounded-xl border shadow-lg overflow-hidden z-10 ${dark ? "bg-[#1c1c1a] border-white/10" : "bg-white border-black/10"}`}
                    >
                      {SORTS.map((s) => (
                        <button
                          key={s}
                          onClick={() => { setSort(s); setSortOpen(false); }}
                          className={`block w-full text-left px-4 py-2 text-xs hover:bg-current/5 ${sort === s ? "font-semibold" : ""}`}
                        >
                          {s}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <Stagger key={active + sort} className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {filtered.map((p) => (
                  <ProductCard key={p.id} p={p} />
                ))}
              </Stagger>
            </AnimatePresence>

            {filtered.length === 0 && <p className="text-sm opacity-60 mt-10 text-center">No pieces found in this category yet.</p>}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
