import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowUpRight, ArrowRight, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import PageTransition from "../components/PageTransition";
import Reveal, { Stagger, StaggerItem } from "../components/Reveal";
import { PRODUCTS, SUBCATEGORIES, img } from "../data/products";

const PEOPLE = [
  { id: "women", name: "Women", index: "01", line: "Soft structure / sharp attitude", seed: "ac-women-editorial" },
  { id: "men", name: "Men", index: "02", line: "Quiet tailoring / everyday form", seed: "ac-men-editorial" },
  { id: "kids", name: "Children", index: "03", line: "Playful proportions / easy movement", seed: "ac-kids-editorial" },
];

const EDIT = PRODUCTS.filter((p) => p.category === "clothing").slice(0, 6);

function SplitLine({ children, delay = 0 }) {
  return (
    <span className="split-line"><motion.span initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: .9, delay, ease: [0.16, 1, 0.3, 1] }}>{children}</motion.span></span>
  );
}

function MagneticLink({ children, className = "", to }) {
  const ref = useRef(null);
  const x = useSpring(0, { stiffness: 280, damping: 18 });
  const y = useSpring(0, { stiffness: 280, damping: 18 });
  return (
    <motion.div ref={ref} style={{ x, y }} onMouseMove={(e) => {
      const r = ref.current?.getBoundingClientRect(); if (!r) return;
      x.set((e.clientX - (r.left + r.width / 2)) * .12); y.set((e.clientY - (r.top + r.height / 2)) * .12);
    }} onMouseLeave={() => { x.set(0); y.set(0); }}>
      <Link to={to} className={className}>{children}</Link>
    </motion.div>
  );
}

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const opacity = useTransform(scrollYProgress, [0, .7], [1, 0]);
  return (
    <section ref={ref} className="hero-editorial">
      <motion.img style={{ y: imageY, scale: 1.08 }} src={img("ac-hero-new", 1800, 1200)} alt="ArtCanvas latest collection" className="hero-editorial__image" />
      <div className="hero-editorial__shade" />
      <div className="hero-editorial__grid" />
      <motion.div style={{ opacity }} className="hero-editorial__top"><p>ARTCANVAS / NEW SEASON</p><p>DROP 04 — 2026</p></motion.div>
      <motion.div style={{ opacity }} className="hero-editorial__side"><span>SCROLL</span><i /><span>01 — 04</span></motion.div>
      <motion.div style={{ y: titleY }} className="hero-editorial__content">
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15 }} className="eyebrow-light">A STUDY IN EVERYDAY FORM</motion.p>
        <h1><SplitLine delay={.22}>Wear the</SplitLine><SplitLine delay={.34}><em>unfamiliar.</em></SplitLine></h1>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .5 }} className="hero-editorial__actions">
          <MagneticLink to="/shop?category=clothing" className="hero-cta">Explore the collection <ArrowUpRight size={15} /></MagneticLink>
          <span>Designed in small runs.<br />Made to be kept.</span>
        </motion.div>
      </motion.div>
      <div className="hero-editorial__bottom"><span>01</span><div className="hero-categories"><Link to="/shop?category=clothing">Clothing</Link><Link to="/gallery">Art</Link><Link to="/shop?category=objects">Objects</Link><Link to="/shop?category=accessories">Accessories</Link></div><span>EST. 2026</span></div>
      <motion.div className="hero-scroll-pulse" animate={{ y: [0, 9, 0], opacity: [.35, 1, .35] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} />
    </section>
  );
}

function People() {
  const railRef = useRef(null);
  const newest = PRODUCTS.slice(0, 10);

  const move = (direction) => {
    railRef.current?.scrollBy({ left: direction * Math.min(520, railRef.current.clientWidth * .72), behavior: "smooth" });
  };

  return (
    <section className="whats-new section-shell">
      <Reveal className="section-heading-line whats-new__heading">
        <div>
          <p className="section-kicker">03 — WHAT'S NEW / THE EDIT</p>
          <h2>What’s<br /><em>new.</em></h2>
        </div>
        <div className="whats-new__intro">
          <p className="section-note">Fresh pieces, new proportions<br />and objects worth noticing.</p>
          <Link to="/shop" className="text-link">See everything <ArrowRight size={15} /></Link>
        </div>
      </Reveal>

      <div className="whats-new__rail-wrap">
        <div className="whats-new__controls" aria-label="What's new carousel controls">
          <button type="button" onClick={() => move(-1)} aria-label="Previous pieces"><ChevronLeft size={20} /></button>
          <button type="button" onClick={() => move(1)} aria-label="Next pieces"><ChevronRight size={20} /></button>
        </div>
        <div ref={railRef} className="whats-new__rail no-scrollbar">
          {newest.map((product, index) => (
            <motion.article
              key={product.id}
              className={`new-piece new-piece--${index % 4}`}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: .18 }}
              transition={{ duration: .7, delay: Math.min(index, 5) * .05, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link to={`/product/${product.id}`} className="new-piece__link">
                <div className="new-piece__image">
                  <img src={img(product.seed, 760, 900)} alt={product.name} />
                  <span className="new-piece__index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="new-piece__tag">NEW</span>
                  <span className="new-piece__view">View piece <ArrowUpRight size={13} /></span>
                </div>
                <div className="new-piece__meta"><span>{product.subcategory || product.category}</span><span>${product.price}</span></div>
                <h3>{product.name}</h3>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductRail() {
  return (
    <section className="edit-editorial section-shell">
      <Reveal className="section-heading-line">
        <div>
          <p className="section-kicker">04 — THE EDIT</p>
          <h2>Currently<br /><em>interesting.</em></h2>
        </div>
        <MagneticLink to="/shop" className="text-link">View all pieces <ArrowRight size={15} /></MagneticLink>
      </Reveal>
      <div className="product-rail">
        {EDIT.map((product, i) => (
          <motion.div
            key={product.id}
            className={`rail-product rail-product--${i % 3}`}
            initial={{ opacity: 0, y: 55 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: .15 }}
            transition={{ duration: .7, delay: (i % 3) * .08, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link to={`/product/${product.id}`}>
              <div className="rail-product__image">
                <motion.img
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: .7, ease: [0.22, 1, 0.36, 1] }}
                  src={img(product.seed, 650, 820)}
                  alt={product.name}
                />
                <span>{String(i + 1).padStart(2, "0")}</span>
                <button aria-label="Add to wishlist" onClick={(e) => e.preventDefault()}><Plus size={16} /></button>
                <div className="rail-product__reveal">View piece <ArrowUpRight size={13} /></div>
              </div>
              <div className="rail-product__meta">
                <span>{product.subcategory || "Object"}</span>
                <span>${product.price}</span>
              </div>
              <h3>{product.name}</h3>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function WearingStory() {
  const sectionRef = useRef(null);
  const [active, setActive] = React.useState(0);
  const story = [
    { id: 'women', number: '01', title: 'Women', serif: 'The art of wearing.', line: 'Fluid lines / considered layers', seed: 'ac-wearing-women', sub: 'Dresses · Outerwear · Tops', link: '/shop?category=clothing&gender=women' },
    { id: 'men', number: '02', title: 'Men', serif: 'The art of wearing.', line: 'Quiet tailoring / everyday form', seed: 'ac-wearing-men', sub: 'Shirts · Outerwear · Trousers', link: '/shop?category=clothing&gender=men' },
    { id: 'kids', number: '03', title: 'Children', serif: 'The art of wearing.', line: 'Playful proportions / easy movement', seed: 'ac-wearing-kids', sub: 'Tees · Outerwear · Sets', link: '/shop?category=clothing&gender=kids' },
  ];

  React.useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let raf = 0;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progress = Math.max(0, Math.min(1, -rect.top / travel));
      const next = Math.min(story.length - 1, Math.floor(progress * story.length));
      setActive((value) => value === next ? value : next);
      raf = 0;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const current = story[active];
  return (
    <section ref={sectionRef} className="wearing-editorial section-shell">
      <div className="wearing-editorial__sticky">
        <div className="wearing-editorial__intro">
          <span className="intro-editorial__number">02</span>
          <div>
            <p className="section-kicker">THE ART OF WEARING</p>
            <h2>Not a trend.<br /><em>A point of view.</em></h2>
            <p className="wearing-editorial__body">ArtCanvas brings clothing, objects and visual culture into one considered space — less catalogue, more curation.</p>
            <Link className="wearing-editorial__intro-link" to="/shop?category=clothing">Enter the collection <ArrowUpRight size={14} /></Link>
          </div>
        </div>

        <div className="wearing-editorial__visual" aria-live="polite">
          {story.map((item, index) => (
            <motion.div key={item.id} className="wearing-frame" initial={false} animate={{ opacity: active === index ? 1 : 0, scale: active === index ? 1 : 1.035, x: active === index ? 0 : index < active ? -20 : 20 }} transition={{ duration: .8, ease: [0.16, 1, 0.3, 1] }}>
              <img src={img(item.seed, 1100, 1320)} alt={`${item.title} clothing editorial`} />
              <div className="wearing-frame__veil" />
              <div className="wearing-frame__top"><span>{item.number} / 03</span><span>ARTCANVAS / CLOTHING</span></div>
              <div className="wearing-frame__caption"><span>{item.line}</span><strong>{item.title}</strong></div>
            </motion.div>
          ))}
          <div className="wearing-editorial__scanline" />
        </div>

        <div className="wearing-editorial__info">
          <AnimatePresence mode="wait">
            <motion.div key={current.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: .45 }}>
              <p className="section-kicker">{current.number} — {current.title}</p>
              <h3>{current.serif}</h3>
              <p>{current.sub}</p>
              <Link to={current.link}>Explore {current.title} <ArrowUpRight size={14} /></Link>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="wearing-editorial__progress" aria-hidden="true">
          {story.map((item, index) => <span key={item.id} className={active === index ? 'is-active' : ''}><i />{item.number}</span>)}
        </div>
        <div className="wearing-editorial__scroll-label"><span>SCROLL TO MOVE</span><i /></div>
      </div>
      <div className="wearing-editorial__steps" aria-hidden="true">
        {story.map((item, index) => <article key={item.id} className={`wearing-step ${active === index ? 'is-active' : ''}`}><span>{item.number}</span><div><p>{item.title}</p><small>{item.line}</small></div></article>)}
      </div>
    </section>
  );
}
export default function Home() {
  return <PageTransition><main className="home-page"><Hero /><WearingStory /><People /><ProductRail /><section className="manifesto-editorial"><motion.img initial={{ scale: 1.08 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.2 }} src={img("ac-side-studio", 1800, 1050)} alt="ArtCanvas studio" /><div className="manifesto-editorial__shade" /><motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .3 }} transition={{ duration: .8 }} className="manifesto-editorial__content"><p className="section-kicker light">05 — THE STUDIO</p><h2>Objects with<br /><em>a pulse.</em></h2><p>Small runs. Strong materials. A little friction between the familiar and the new.</p><MagneticLink to="/gallery" className="manifesto-link">Enter the visual archive <ArrowUpRight size={15} /></MagneticLink></motion.div></section></main></PageTransition>;
}
