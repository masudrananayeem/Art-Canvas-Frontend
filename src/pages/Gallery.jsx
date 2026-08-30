import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useStore } from "../context/StoreContext";
import PageTransition from "../components/PageTransition";

import womenOuterwear from "../assets/clothing/women-outerwear.jpg";
import womenTop from "../assets/clothing/women-top.jpg";
import womenKnit from "../assets/clothing/women-knit.jpg";
import menShirt from "../assets/clothing/men-shirt.jpg";
import unisexEditorial from "../assets/clothing/unisex-editorial.jpg";
import kidsEditorial from "../assets/clothing/kids-editorial.jpg";

const STORIES = [
  {
    image: womenOuterwear,
    eyebrow: "WOMEN / OUTERWEAR",
    title: "The quiet structure of winter.",
    note: "Tailored layers, soft light and a wardrobe built to stay.",
    className: "gallery-story gallery-story--tall",
    href: "/shop?category=clothing&gender=women",
  },
  {
    image: womenTop,
    eyebrow: "WOMEN / ESSENTIALS",
    title: "A softer everyday.",
    note: "Simple silhouettes with room to move.",
    className: "gallery-story gallery-story--wide",
    href: "/shop?category=clothing&gender=women",
  },
  {
    image: menShirt,
    eyebrow: "MEN / SHIRTS",
    title: "Clean lines, considered layers.",
    note: "A modern uniform without the uniformity.",
    className: "gallery-story gallery-story--standard",
    href: "/shop?category=clothing&gender=men",
  },
  {
    image: womenKnit,
    eyebrow: "TEXTURE / KNIT",
    title: "Made for slower days.",
    note: "Texture, proportion and understated colour.",
    className: "gallery-story gallery-story--standard",
    href: "/shop?category=clothing&gender=women",
  },
  {
    image: unisexEditorial,
    eyebrow: "UNISEX / EDIT",
    title: "Between dressed and undone.",
    note: "An easy study in shape and movement.",
    className: "gallery-story gallery-story--wide",
    href: "/shop?category=clothing",
  },
  {
    image: kidsEditorial,
    eyebrow: "CHILDREN / PLAY",
    title: "Small clothes, big character.",
    note: "Comfort-first pieces with a little personality.",
    className: "gallery-story gallery-story--standard",
    href: "/shop?category=clothing&gender=kids",
  },
];

export default function Gallery() {
  const { dark } = useStore();

  return (
    <PageTransition>
      <main className={`gallery-page ${dark ? "gallery-page--dark" : ""}`}>
        <section className="gallery-hero">
          <img src={womenOuterwear} alt="ArtCanvas clothing editorial" />
          <div className="gallery-hero__shade" />
          <div className="gallery-hero__content">
            <p>ARTCANVAS / VISUAL JOURNAL</p>
            <h1>Clothing,<br /><em>in context.</em></h1>
            <span>Campaigns, textures and everyday pieces from the current edit.</span>
          </div>
          <div className="gallery-hero__index">01 — 06</div>
        </section>

        <section className="gallery-intro">
          <div>
            <p className="gallery-kicker">THE GALLERY</p>
            <h2>More than a product.<br />A point of view.</h2>
          </div>
          <p className="gallery-intro__copy">
            A visual collection of the people, clothes and details that shape ArtCanvas.
            Browse the current stories, then step into the collection.
          </p>
        </section>

        <section className="gallery-grid" aria-label="ArtCanvas fashion gallery">
          {STORIES.map((story, i) => (
            <motion.article
              key={`${story.title}-${i}`}
              className={story.className}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.65, delay: (i % 3) * 0.06 }}
            >
              <Link to={story.href} className="gallery-story__link">
                <div className="gallery-story__media">
                  <img src={story.image} alt={story.title} loading={i < 2 ? "eager" : "lazy"} />
                  <div className="gallery-story__veil" />
                  <span className="gallery-story__open"><ArrowUpRight size={16} /></span>
                  <div className="gallery-story__caption">
                    <p>{story.eyebrow}</p>
                    <h3>{story.title}</h3>
                    <span>{story.note}</span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </section>

        <section className="gallery-cta">
          <div>
            <p className="gallery-kicker">THE CURRENT EDIT</p>
            <h2>See what is<br /><em>available now.</em></h2>
          </div>
          <Link to="/shop" className="gallery-cta__button">
            Explore all pieces <ArrowUpRight size={16} />
          </Link>
        </section>
      </main>
    </PageTransition>
  );
}
