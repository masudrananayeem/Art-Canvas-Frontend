import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Truck, PackageCheck, ShieldCheck, Lock, Star, ArrowRight } from "lucide-react";
import PageTransition from "../components/PageTransition";
import Marquee from "../components/Marquee";
import ProductCard from "../components/ProductCard";
import Reveal, { Stagger, StaggerItem } from "../components/Reveal";
import { CATEGORIES, PRODUCTS, img } from "../data/products";
import { useStore } from "../context/StoreContext";

const TESTIMONIALS = [
  ["The quality is unmatched. Fabrics feel premium and the fit is perfect — ArtCanvas is my go-to now.", "Sarah J.", "Fashion Enthusiast"],
  ["I was looking for something versatile and artistic, and the new drop exceeded expectations. Fast shipping too.", "Michael T.", "Verified Buyer"],
  ["Obsessed with the attention to detail. Every piece looks exactly like the photos, if not better.", "Emily R.", "Style Blogger"],
];

export default function Home() {
  const { dark } = useStore();
  const featured = PRODUCTS.slice(0, 8);

  return (
    <PageTransition>
      <Marquee />

      {/* Hero */}
      <section className="relative px-6 pt-16 pb-6 overflow-hidden">
        <div className="max-w-6xl mx-auto relative">
          {/* Oversized wordmark behind hero image */}
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="pointer-events-none select-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-[16vw] sm:text-[9vw] font-black tracking-tighter opacity-[0.06] leading-none"
          >
            ARTCANVAS
          </motion.h2>

          <div className="relative grid md:grid-cols-2 gap-10 items-center min-h-[70vh]">
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
              className="order-2 md:order-1"
            >
              <motion.p
                variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                className="text-xs tracking-[0.25em] uppercase opacity-60 mb-4"
              >
                New Season · Studio Drop
              </motion.p>
              <motion.h1
                variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="text-6xl sm:text-7xl font-black tracking-tight leading-[0.95] mb-6"
              >
                WEAR THE
                <br />
                UNEXPECTED
              </motion.h1>
              <motion.p variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="max-w-sm opacity-70 mb-8 text-sm sm:text-base">
                Clothing, original art and studio objects — made in small numbered batches for people who don't follow ordinary.
              </motion.p>
              <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="flex flex-wrap gap-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                  <Link to="/shop" className={`inline-block px-6 py-3 rounded-full text-xs font-semibold tracking-wider uppercase ${dark ? "bg-[#EDE7D9] text-black" : "bg-black text-white"}`}>
                    Shop Now
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                  <Link to="/shop?category=art" className="inline-block px-6 py-3 rounded-full text-xs font-semibold tracking-wider uppercase border border-current/25">
                    Enter the Gallery
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="order-1 md:order-2 relative"
            >
              <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.4 }} className="aspect-[4/5] w-full max-w-md mx-auto overflow-hidden rounded-2xl shadow-2xl">
                <img src={img("ac-hero-main", 700, 900)} alt="Studio look" className="w-full h-full object-cover" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className={`absolute -bottom-4 -left-4 sm:-left-8 px-4 py-3 rounded-xl shadow-lg text-xs ${dark ? "bg-[#1c1c1a]" : "bg-white"}`}
              >
                <p className="font-semibold">Drop 001</p>
                <p className="opacity-60">Only 12 remaining</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

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

      {/* Categories */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <h2 className="text-3xl font-black tracking-tight mb-6">SHOP BY CATEGORY</h2>
          </Reveal>
          <Stagger className={`grid sm:grid-cols-5 gap-4 p-6 rounded-2xl ${dark ? "bg-white/5" : "bg-black text-white"}`}>
            {CATEGORIES.map((c) => (
              <StaggerItem key={c.id}>
                <Link to={`/shop?category=${c.id}`} className="text-left group block">
                  <div className="aspect-[3/4] overflow-hidden rounded-xl mb-3">
                    <motion.img whileHover={{ scale: 1.08 }} transition={{ duration: 0.5 }} src={img(c.seed, 300, 400)} alt={c.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-sm font-semibold">{c.name}</p>
                  <p className="text-xs opacity-60 mb-1">{c.desc}</p>
                  <span className="text-[11px] font-semibold underline underline-offset-4 inline-flex items-center gap-1">
                    Shop {c.name} <ArrowRight size={11} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Featured products */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <Reveal>
              <h2 className="text-4xl font-black tracking-tight">FEATURED</h2>
            </Reveal>
            <Link to="/shop" className="text-xs font-semibold tracking-wide uppercase underline underline-offset-4 hidden sm:inline">
              View all
            </Link>
          </div>
          <Stagger className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {featured.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </Stagger>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto text-center">
          <Reveal>
            <p className="text-xs tracking-[0.25em] uppercase opacity-50 mb-2">Social Proof</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-10">WHAT OUR CUSTOMERS SAY</h2>
          </Reveal>
          <Stagger className="grid sm:grid-cols-3 gap-6 text-left">
            {TESTIMONIALS.map(([quote, name, role], i) => (
              <StaggerItem key={i}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className={`p-6 rounded-2xl border h-full ${dark ? "border-white/10 bg-white/5" : "border-black/10 bg-white"}`}
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
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight max-w-2xl mx-auto leading-snug">
            WE DON'T MAKE PRODUCTS. WE MAKE PIECES OF IDENTITY.
          </h2>
          <Link to="/about" className="inline-block mt-6 text-xs font-semibold tracking-wide uppercase underline underline-offset-4">
            Read our story
          </Link>
        </Reveal>
      </section>
    </PageTransition>
  );
}
