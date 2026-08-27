import React from "react";
import { Stagger } from "./Reveal";
import ProductCard from "./ProductCard";

// 2 = spans two columns (big card, "lg" variant), 1 = single column (compact card)
const DEFAULT_PATTERN = [2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1];

export default function BentoGrid({ products, pattern = DEFAULT_PATTERN, className = "" }) {
  return (
    <Stagger className={`grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 ${className}`}>
      {products.map((p, i) => {
        const span = pattern[i % pattern.length];
        return (
          <div key={p.id} className={span === 2 ? "col-span-2" : "col-span-1"}>
            <ProductCard p={p} size={span === 2 ? "lg" : "md"} />
          </div>
        );
      })}
    </Stagger>
  );
}
