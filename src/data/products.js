export const img = (seed, w = 600, h = 800) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const CATEGORIES = [
  { id: "clothing", name: "Clothing", desc: "Structured essentials, made to last.", seed: "ac-cat-clothing" },
  { id: "art", name: "Art", desc: "Original works & limited prints.", seed: "ac-cat-art" },
  { id: "objects", name: "Objects", desc: "Sculpture, ceramics, desk pieces.", seed: "ac-cat-objects" },
  { id: "accessories", name: "Accessories", desc: "Bags, jewelry, small leather goods.", seed: "ac-cat-accessories" },
  { id: "gifts", name: "Gifts", desc: "Curated boxes for the discerning.", seed: "ac-cat-gifts" },
];

const NAMES = {
  clothing: ["Fragment Overcoat", "Oxide Trouser", "Linen Field Shirt", "Raw Edge Hoodie", "Sculpted Blazer", "Ash Denim Jacket"],
  art: ["Study in Ochre No.3", "Quiet Fracture Print", "Untitled (Terrain)", "Interior Weather", "Slow Erosion", "Marginalia I"],
  objects: ["Poured Ceramic Vessel", "Desk Monolith", "Ash Bowl Set", "Ribbed Candlestick", "Stone Tray"],
  accessories: ["Folded Leather Bag", "Signet Ring", "Oxide Leather Belt", "Woven Card Case", "Brass Cuff"],
  gifts: ["The Maker's Box", "Small Works Print Set", "Studio Candle Duo", "Print & Paper Set"],
};

function buildProducts() {
  const out = [];
  let id = 1;
  Object.entries(NAMES).forEach(([cat, names]) => {
    names.forEach((name, i) => {
      const isArt = cat === "art";
      out.push({
        id: id++,
        name,
        category: cat,
        price: isArt ? 220 + i * 65 : cat === "objects" ? 90 + i * 30 : 38 + i * 18,
        rating: (4.3 + ((i * 7) % 6) / 10).toFixed(1),
        reviews: 40 + ((i * 37) % 200),
        edition: isArt || cat === "objects" ? `${(i + 3) * 3}/${(i + 4) * 20}` : null,
        seed: `ac-${cat}-${i}`,
        material: isArt ? "Graphite & gouache on cotton paper" : cat === "objects" ? "Stoneware, hand-thrown" : "Brushed cotton twill",
        size: isArt ? "50 × 65 cm" : cat === "accessories" ? "One size" : "XS – XL",
        story:
          "Made in small batches in our studio — sketched, tested and finished by hand before it ever reaches a shelf. No two runs are ever quite identical.",
      });
    });
  });
  return out;
}

export const PRODUCTS = buildProducts();
export const getProduct = (id) => PRODUCTS.find((p) => String(p.id) === String(id));
export const related = (product, count = 4) =>
  PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, count);
