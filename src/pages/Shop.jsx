import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Shirt, Sparkles, Gift, ChevronDown, X, SlidersHorizontal, ArrowUpRight } from "lucide-react";
import PageTransition from "../components/PageTransition";
import ProductCard from "../components/ProductCard";
import { Stagger } from "../components/Reveal";
import { CATEGORIES, GENDERS, PRODUCTS, img } from "../data/products";
import { useStore } from "../context/StoreContext";

// Art has its own dedicated Gallery experience — Shop stays focused on wearables & objects.
const SHOP_CATEGORIES = CATEGORIES.filter((c) => c.id !== "art");
const SHOP_PRODUCTS = PRODUCTS.filter((p) => p.category !== "art");
const ART_TILE = CATEGORIES.find((c) => c.id === "art");

const ICONS = { clothing: Shirt, objects: Package, accessories: Gift, gifts: Gift };
const SORTS = ["Featured", "Price: Low to High", "Price: High to Low", "Top Rated"];
const MAX_PRICE = Math.max(...SHOP_PRODUCTS.map((p) => p.price));

export default function Shop() {
  const { dark } = useStore();
  const [params, setParams] = useSearchParams();
  const active = params.get("category") || "all";
  const gender = params.get("gender") || "all";
  const [sort, setSort] = useState("Featured");
  const [sortOpen, setSortOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const setActive = (id) => {
    const next = new URLSearchParams(params);
    if (id === "all") next.delete("category");
    else next.set("category", id);
    setParams(next);
  };
  const setGender = (id) => {
    const next = new URLSearchParams(params);
    if (id === "all") next.delete("gender");
    else next.set("gender", id);
    setParams(next);
  };

  const filtered = useMemo(() => {
    let list = active === "all" ? SHOP_PRODUCTS : SHOP_PRODUCTS.filter((p) => p.category === active);
    if (gender !== "all") list = list.filter((p) => p.gender === gender || p.gender === "unisex");
    list = list.filter((p) => p.price <= maxPrice);
    list = [...list];
    if (sort === "Price: Low to High") list.sort((a, b) => a.price - b.price);
    if (sort === "Price: High to Low") list.sort((a, b) => b.price - a.price);
    if (sort === "Top Rated") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [active, gender, sort, maxPrice]);

  const activeFilterCount = (active !== "all" ? 1 : 0) + (gender !== "all" ? 1 : 0) + (maxPrice < MAX_PRICE ? 1 : 0);
  const clearFilters = () => {
    setParams({});
    setMaxPrice(MAX_PRICE);
  };

  const SidebarContent = (
    <>
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
            <span className="text-[10px] opacity-70">{SHOP_PRODUCTS.length}</span>
          </button>
          {SHOP_CATEGORIES.map((c) => {
            const Icon = ICONS[c.id];
            const count = SHOP_PRODUCTS.filter((p) => p.category === c.id).length;
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

      <div>
        <p className="text-xs tracking-widest uppercase opacity-50 mb-3">Shop For</p>
        <div className="flex flex-wrap gap-2">
          {GENDERS.map((g) => (
            <button
              key={g.id}
              onClick={() => setGender(g.id)}
              className={`px-3 py-1.5 rounded-full text-xs border transition ${
                gender === g.id
                  ? dark
                    ? "bg-[#EDE7D9] text-black border-[#EDE7D9]"
                    : "bg-black text-white border-black"
                  : dark
                  ? "border-white/15 hover:bg-white/5"
                  : "border-black/15 hover:bg-black/5"
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs tracking-widest uppercase opacity-50 mb-3">Max Price: ${maxPrice}</p>
        <input
          type="range"
          min={0}
          max={MAX_PRICE}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[#A8431E]"
        />
      </div>

      <div className={`h-px ${dark ? "bg-white/10" : "bg-black/10"}`} />

      {/* Art callout — points to the dedicated Gallery, kept separate from wearables */}
      <Link
        to="/gallery"
        className={`group block rounded-2xl overflow-hidden relative aspect-[4/3] ${dark ? "bg-white/5" : "bg-black"}`}
      >
        <img src={img(ART_TILE.seed, 400, 300)} alt="Art" className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <p className="text-xs tracking-[0.2em] uppercase opacity-80 mb-1">Looking for Art?</p>
          <span className="text-sm font-semibold flex items-center gap-1">
            Visit the Gallery <ArrowUpRight size={13} />
          </span>
        </div>
      </Link>

      <div className="text-xs opacity-60 leading-relaxed">
        Every piece is studio-made in small batches. Limited editions are numbered on arrival.
      </div>
    </>
  );

  return (
    <PageTransition>
      <section className="px-6 pt-16 pb-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs tracking-[0.25em] uppercase opacity-50 mb-2">Give All You Need</p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">THE COLLECTION</h1>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[240px_1fr] gap-8">
          {/* Sidebar — desktop */}
          <aside className="space-y-6 hidden md:block">{SidebarContent}</aside>

          {/* Mobile filter bar */}
          <div className="md:hidden space-y-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-6 px-6 no-scrollbar">
              <button
                onClick={() => setActive("all")}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs border ${active === "all" ? (dark ? "bg-[#EDE7D9] text-black border-[#EDE7D9]" : "bg-black text-white border-black") : dark ? "border-white/15" : "border-black/15"}`}
              >
                All
              </button>
              {SHOP_CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActive(c.id)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs border ${active === c.id ? (dark ? "bg-[#EDE7D9] text-black border-[#EDE7D9]" : "bg-black text-white border-black") : dark ? "border-white/15" : "border-black/15"}`}
                >
                  {c.name}
                </button>
              ))}
              <Link to="/gallery" className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs border flex items-center gap-1 ${dark ? "border-white/15" : "border-black/15"}`}>
                <Sparkles size={11} /> Art
              </Link>
            </div>
            <button
              onClick={() => setFiltersOpen((o) => !o)}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full text-xs border ${dark ? "border-white/15" : "border-black/15"}`}
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal size={13} /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </span>
              <ChevronDown size={13} className={`transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {filtersOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`overflow-hidden rounded-2xl border p-4 space-y-6 ${dark ? "border-white/10 bg-white/5" : "border-black/10 bg-white"}`}
                >
                  <div>
                    <p className="text-xs tracking-widest uppercase opacity-50 mb-3">Shop For</p>
                    <div className="flex flex-wrap gap-2">
                      {GENDERS.map((g) => (
                        <button
                          key={g.id}
                          onClick={() => setGender(g.id)}
                          className={`px-3 py-1.5 rounded-full text-xs border transition ${
                            gender === g.id ? (dark ? "bg-[#EDE7D9] text-black border-[#EDE7D9]" : "bg-black text-white border-black") : dark ? "border-white/15" : "border-black/15"
                          }`}
                        >
                          {g.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs tracking-widest uppercase opacity-50 mb-3">Max Price: ${maxPrice}</p>
                    <input type="range" min={0} max={MAX_PRICE} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-[#A8431E]" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Grid */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <p className="text-sm opacity-60">{filtered.length} pieces</p>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="flex items-center gap-1 text-xs opacity-60 hover:opacity-100 underline underline-offset-4">
                    <X size={11} /> Clear filters
                  </button>
                )}
              </div>
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
              <Stagger key={active + sort + gender + maxPrice} className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {filtered.map((p) => (
                  <ProductCard key={p.id} p={p} />
                ))}
              </Stagger>
            </AnimatePresence>

            {filtered.length === 0 && <p className="text-sm opacity-60 mt-10 text-center">No pieces found. Try adjusting your filters.</p>}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
