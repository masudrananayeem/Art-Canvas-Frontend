import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Shirt, Sparkles, Gift, Palette, ChevronDown, X, SlidersHorizontal, ArrowUpRight, Users } from "lucide-react";
import PageTransition from "../components/PageTransition";
import ProductCard from "../components/ProductCard";
import { CATEGORIES, GENDERS, SUBCATEGORIES, PRODUCTS, img } from "../data/products";
import { useStore } from "../context/StoreContext";

const SHOP_CATEGORIES = CATEGORIES;
const SHOP_PRODUCTS = PRODUCTS;

const ICONS = { clothing: Shirt, art: Palette, objects: Package, accessories: Gift, gifts: Gift };
const SORTS = ["Featured", "Price: Low to High", "Price: High to Low", "Top Rated"];
const MAX_PRICE = Math.max(...SHOP_PRODUCTS.map((p) => p.price));

export default function Shop() {
  const { dark } = useStore();
  const [params, setParams] = useSearchParams();
  const active = params.get("category") || "all";
  const gender = params.get("gender") || "all";
  const sub = params.get("sub") || "all";
  const [sort, setSort] = useState("Featured");
  const [sortOpen, setSortOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const setActive = (id) => {
    const next = new URLSearchParams(params);
    if (id === "all") next.delete("category");
    else next.set("category", id);
    next.delete("sub");
    if (id !== "clothing") next.delete("gender");
    setParams(next);
  };
  const setGender = (id) => {
    const next = new URLSearchParams(params);
    if (id === "all") next.delete("gender");
    else next.set("gender", id);
    next.delete("sub");
    setParams(next);
  };
  const setSub = (id) => {
    const next = new URLSearchParams(params);
    if (id === "all") next.delete("sub");
    else next.set("sub", id);
    setParams(next);
  };

  const availableSubs = gender !== "all" ? SUBCATEGORIES[gender] || [] : [];

  const filtered = useMemo(() => {
    let list = active === "all" ? SHOP_PRODUCTS : active === "new" ? [...SHOP_PRODUCTS].sort((a, b) => b.id - a.id).slice(0, 8) : SHOP_PRODUCTS.filter((p) => p.category === active);
    if (gender !== "all") list = list.filter((p) => p.gender === gender || p.gender === "unisex");
    if (sub !== "all") list = list.filter((p) => p.subcategory === sub);
    list = list.filter((p) => p.price <= maxPrice);
    list = [...list];
    if (sort === "Price: Low to High") list.sort((a, b) => a.price - b.price);
    if (sort === "Price: High to Low") list.sort((a, b) => b.price - a.price);
    if (sort === "Top Rated") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [active, gender, sub, sort, maxPrice]);

  const activeFilterCount = (active !== "all" ? 1 : 0) + (gender !== "all" ? 1 : 0) + (sub !== "all" ? 1 : 0) + (maxPrice < MAX_PRICE ? 1 : 0);
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
        <AnimatePresence>
          {availableSubs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <p className="text-xs tracking-widest uppercase opacity-40 mt-4 mb-2">Sub-category</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSub("all")}
                  className={`px-3 py-1 rounded-full text-[11px] border transition ${sub === "all" ? (dark ? "bg-white/15 border-white/30" : "bg-black/10 border-black/20") : dark ? "border-white/10 opacity-70" : "border-black/10 opacity-70"}`}
                >
                  All
                </button>
                {availableSubs.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSub(s)}
                    className={`px-3 py-1 rounded-full text-[11px] border transition ${sub === s ? (dark ? "bg-white/15 border-white/30" : "bg-black/10 border-black/20") : dark ? "border-white/10 opacity-70" : "border-black/10 opacity-70"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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

      <Link to="/gallery" className={`group block border p-4 rounded-2xl transition ${dark ? "border-white/10 bg-white/[.03]" : "border-black/10 bg-white"}`}>
        <p className="text-[9px] tracking-[.2em] uppercase opacity-45 mb-2">Also in the studio</p>
        <div className="flex items-end justify-between gap-4"><span className="font-display italic text-2xl">Original art & editions</span><ArrowUpRight size={16} className="shrink-0 opacity-60 group-hover:translate-x-1 group-hover:-translate-y-1 transition" /></div>
      </Link>

      <div className="text-xs opacity-60 leading-relaxed">
        Every piece is studio-made in small batches. Limited editions are numbered on arrival.
      </div>
    </>
  );

  return (
    <PageTransition>
      <section className="px-6 pt-10 pb-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-[9px] tracking-[0.25em] uppercase opacity-50 mb-2">04 — The collection</p>
          <h1 className="font-display italic text-4xl sm:text-6xl font-black tracking-[-.04em]">The Collection</h1>
          <p className="max-w-2xl mt-4 text-sm opacity-55 leading-relaxed">Clothing is organized into <b>Women, Men and Children</b>, with dedicated sub-categories. Pick a person, then narrow the silhouette.</p>
        </div>
      </section>

      <section className="shop-category-strip px-6 pb-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between gap-5 mb-4"><div><p className="text-[9px] tracking-[.25em] uppercase opacity-45">Browse the world</p><h2 className="font-display italic text-2xl sm:text-3xl font-bold mt-1">Shop by category</h2></div><span className="hidden sm:block text-[10px] opacity-45">{SHOP_PRODUCTS.length} pieces / {SHOP_CATEGORIES.length} categories</span></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            <button onClick={() => setActive("all")} className={`shop-category-tile ${active === "all" ? "is-active" : ""}`}><span className="shop-category-tile__number">00</span><span>All pieces</span></button>
            <button onClick={() => setActive("new")} className={`shop-category-tile ${active === "new" ? "is-active" : ""}`}><img src={img("ac-new-in", 260, 180)} alt="New in" /><span>New in</span></button>
            {SHOP_CATEGORIES.map((c) => <button key={c.id} onClick={() => setActive(c.id)} className={`shop-category-tile ${active === c.id ? "is-active" : ""}`}><img src={img(c.seed, 260, 180)} alt="" /><span>{c.name}</span></button>)}
          </div>
        </div>
      </section>

      {active === "clothing" && (
        <section className="px-6 pb-8">
          <div className="max-w-6xl mx-auto border-y border-current/10 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div><p className="text-[9px] tracking-[.25em] uppercase opacity-45">Clothing / Browse by</p><p className="font-display italic text-2xl font-bold mt-1">Women · Men · Children</p></div>
            <div className="flex flex-wrap gap-2">
              {GENDERS.filter(g => g.id !== "all").map(g => <Link key={g.id} to={`/shop?category=clothing&gender=${g.id}`} className="px-3 py-1.5 rounded-full border border-current/15 text-[10px] uppercase tracking-wider hover:bg-current/5 transition">{g.name}</Link>)}
            </div>
          </div>
        </section>
      )}

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
                    {availableSubs.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        <button
                          onClick={() => setSub("all")}
                          className={`px-3 py-1 rounded-full text-[11px] border ${sub === "all" ? (dark ? "bg-white/15 border-white/30" : "bg-black/10 border-black/20") : dark ? "border-white/10 opacity-70" : "border-black/10 opacity-70"}`}
                        >
                          All
                        </button>
                        {availableSubs.map((s) => (
                          <button
                            key={s}
                            onClick={() => setSub(s)}
                            className={`px-3 py-1 rounded-full text-[11px] border ${sub === s ? (dark ? "bg-white/15 border-white/30" : "bg-black/10 border-black/20") : dark ? "border-white/10 opacity-70" : "border-black/10 opacity-70"}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
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
              <motion.div
                key={active + sort + gender + sub + maxPrice}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: .35 }}
                className="grid grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-12 items-start"
              >
                {filtered.map((p, i) => (
                  <motion.div key={p.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .42, delay: Math.min(i * .035, .25) }}>
                    <ProductCard p={p} size="md" />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {filtered.length === 0 && <p className="text-sm opacity-60 mt-10 text-center">No pieces found. Try adjusting your filters.</p>}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
