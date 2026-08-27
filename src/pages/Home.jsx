import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Truck, PackageCheck, ShieldCheck, Lock, Star, ArrowRight, ArrowUpRight } from "lucide-react";
import PageTransition from "../components/PageTransition";
import Marquee from "../components/Marquee";
import BentoGrid from "../components/BentoGrid";
import Reveal, { Stagger, StaggerItem } from "../components/Reveal";
import FeatureSpotlight from "../components/FeatureSpotlight";
import { CATEGORIES, PRODUCTS, img } from "../data/products";
import { useStore } from "../context/StoreContext";

const TESTIMONIALS = [
  ["The quality is unmatched. Fabrics feel premium and the fit is perfect — ArtCanvas is my go-to now.", "Sarah J.", "Fashion Enthusiast"],
  ["I was looking for something versatile and artistic, and the new drop exceeded expectations. Fast shipping too.", "Michael T.", "Verified Buyer"],
  ["Obsessed with the attention to detail. Every piece looks exactly like the photos, if not better.", "Emily R.", "Style Blogger"],
];

// Bento tile spans for the category grid — 2x2, 1x2, 1x1 mixed on a 4-col / 6-row canvas.
const CAT_TILES = {
  clothing: "sm:col-span-2 sm:row-span-2 aspect-square sm:aspect-auto",
  art: "sm:col-span-2 aspect-[3/2] sm:aspect-auto",
  objects: "aspect-square",
  accessories: "aspect-square",
  gifts: "sm:col-span-2 aspect-[3/2] sm:aspect-auto",
};

export default function Home() {
  const { dark } = useStore();
  const featured = PRODUCTS.slice(0, 10);

  return (
    <PageTransition>
      <Marquee />

      {/* Hero — asymmetric bento composition */}
      <section className="px-6 pt-10 sm:pt-14 pb-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 sm:grid-rows-2 gap-4 sm:h-[560px]">
          {/* Big image tile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative sm:col-span-2 sm:row-span-2 rounded-3xl overflow-hidden aspect-[4/5] sm:aspect-auto"
          >
            <img src={img("ac-hero-main", 900, 1100)} alt="Studio look" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/10" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <p className="text-white/70 text-xs tracking-[0.25em] uppercase mb-3">New Season · Studio Drop</p>
              <h1 className="font-display italic text-white text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[0.95] mb-4">
                Wear the
                <br />
                Unexpected
              </h1>
              <div className="flex flex-wrap gap-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                  <Link to="/shop" className="inline-block px-6 py-3 rounded-full text-xs font-semibold tracking-wider uppercase bg-white text-black">
                    Shop Now
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                  <Link to="/gallery" className="inline-block px-6 py-3 rounded-full text-xs font-semibold tracking-wider uppercase border border-white/50 text-white">
                    Enter the Gallery
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Manifesto tile */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className={`rounded-3xl p-6 flex flex-col justify-between ${dark ? "bg-white/5" : "bg-black text-white"}`}
          >
            <p className="font-display italic text-xl sm:text-2xl leading-snug">
              "We don't make products. We make pieces of identity."
            </p>
            <Link to="/about" className="inline-flex items-center gap-1 text-xs font-semibold tracking-wide uppercase underline underline-offset-4 mt-4">
              Our story <ArrowUpRight size={12} />
            </Link>
          </motion.div>

          {/* Drop stat tile */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className={`relative rounded-3xl overflow-hidden ${dark ? "bg-white/5" : "bg-[#EDE0CC]"}`}
          >
            <img src={img("ac-hero-drop", 500, 400)} alt="Drop 001" className="w-full h-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <p className="font-semibold text-sm">Drop 001</p>
              <p className="opacity-80 text-xs">Only 12 remaining</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Studio Spotlight — scroll-triggered reveal */}
      <FeatureSpotlight products={PRODUCTS.slice(2, 6)} />

      {/* Trust bar */}
      <section className={`px-6 py-6 ${dark ? "bg-white/5" : "bg-black text-white"}`}>
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
          {[
            [Truck, "Fast Delivery", "Quick & safe shipping"],
            [PackageCheck, "Easy Returns", "Within 15 days"],
            [ShieldCheck, "Quality Assured", "Studio-checked pieces"],
            [Lock, "Secure Payment", "100% secure checkout"],
          ].map(([Icon, t, s], i) => (
            <Reveal key={i} delay={i * 0.06} className="flex items-center gap-3">
              <Icon size={20} className="shrink-0 opacity-80" />
              <div>
                <p className="font-semibold">{t}</p>
                <p className="opacity-60">{s}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Categories — bento tiles, mixed sizes */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <h2 className="font-display italic text-3xl sm:text-4xl font-black tracking-tight mb-6">Shop by Category</h2>
          </Reveal>
          <Stagger className="grid grid-cols-2 sm:grid-cols-4 sm:auto-rows-[130px] gap-4">
            {CATEGORIES.map((c) => (
              <StaggerItem key={c.id} className={CAT_TILES[c.id] || "aspect-square"}>
                <Link to={c.id === "art" ? "/gallery" : `/shop?category=${c.id}`} className="relative group block w-full h-full rounded-3xl overflow-hidden">
                  <motion.img whileHover={{ scale: 1.08 }} transition={{ duration: 0.6 }} src={img(c.seed, 500, 500)} alt={c.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 text-white">
                    <p className="font-display italic text-lg sm:text-xl font-bold">{c.name}</p>
                    <p className="text-[11px] opacity-70 mb-1 hidden sm:block">{c.desc}</p>
                    <span className="text-[10px] font-semibold underline underline-offset-4 inline-flex items-center gap-1">
                      Shop {c.name} <ArrowRight size={10} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Featured products — bento grid */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <Reveal>
              <h2 className="font-display italic text-4xl font-black tracking-tight">Featured</h2>
            </Reveal>
            <Link to="/shop" className="text-xs font-semibold tracking-wide uppercase underline underline-offset-4 hidden sm:inline">
              View all
            </Link>
          </div>
          <BentoGrid products={featured} />
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto text-center">
          <Reveal>
            <p className="text-xs tracking-[0.25em] uppercase opacity-50 mb-2">Social Proof</p>
            <h2 className="font-display italic text-3xl sm:text-4xl font-black tracking-tight mb-10">What Our Customers Say</h2>
          </Reveal>
          <Stagger className="grid sm:grid-cols-3 gap-6 text-left">
            {TESTIMONIALS.map(([quote, name, role], i) => (
              <StaggerItem key={i}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className={`p-6 rounded-3xl border h-full ${dark ? "border-white/10 bg-white/5" : "border-black/10 bg-white"}`}
                >
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} size={14} className="fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-sm italic opacity-80 mb-4">"{quote}"</p>
                  <p className="text-sm font-semibold">{name}</p>
                  <p className="text-xs opacity-50">{role}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Manifesto CTA */}
      <section className="px-6 py-20 text-center border-t border-current/10">
        <Reveal>
          <p className="text-xs tracking-[0.25em] uppercase opacity-50 mb-4">Our Philosophy</p>
          <h2 className="font-display italic text-3xl sm:text-4xl font-black tracking-tight max-w-2xl mx-auto leading-snug">
            We don't make products. We make pieces of identity.
          </h2>
          <Link to="/about" className="inline-block mt-6 text-xs font-semibold tracking-wide uppercase underline underline-offset-4">
            Read our story
          </Link>
        </Reveal>
      </section>
    </PageTransition>
  );
}
