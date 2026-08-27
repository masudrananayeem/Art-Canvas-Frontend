import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import PageTransition from "../components/PageTransition";
import ProductCard from "../components/ProductCard";
import { Stagger } from "../components/Reveal";
import { PRODUCTS } from "../data/products";
import { useStore } from "../context/StoreContext";

export default function Wishlist() {
  const { wishlist } = useStore();
  const items = PRODUCTS.filter((p) => wishlist.has(p.id));

  return (
    <PageTransition>
      <section className="px-6 pt-16 pb-24">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-black tracking-tight mb-2">YOUR WISHLIST</h1>
          <p className="text-sm opacity-60 mb-10">{items.length} saved piece{items.length !== 1 ? "s" : ""}</p>

          {items.length === 0 ? (
            <div className="text-center py-24">
              <Heart size={40} className="mx-auto mb-4 opacity-30" />
              <p className="opacity-60 mb-6">Nothing saved yet — tap the heart on any piece to keep it here.</p>
              <Link to="/shop" className="inline-block px-6 py-3 rounded-full text-xs font-semibold tracking-wider uppercase bg-black text-white">
                Browse the Shop
              </Link>
            </div>
          ) : (
            <Stagger className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {items.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </Stagger>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
