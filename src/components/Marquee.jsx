import React from "react";
import { useStore } from "../context/StoreContext";

const ITEMS = ["NEW ARRIVALS", "ARTIST DROPS", "FREE SHIPPING $150+", "LIMITED EDITIONS", "STUDIO MADE"];

export default function Marquee() {
  const { dark } = useStore();
  return (
    <div className={`overflow-hidden border-y ${dark ? "border-white/10 bg-white/5" : "border-black/10 bg-black text-white"} py-2`}>
      <div className="flex whitespace-nowrap animate-[marquee_22s_linear_infinite]">
        {[...ITEMS, ...ITEMS, ...ITEMS].map((m, i) => (
          <span key={i} className="mx-6 text-xs tracking-[0.25em] uppercase flex items-center gap-6">
            {m} <span className="opacity-50">+</span>
          </span>
        ))}
      </div>
    </div>
  );
}
