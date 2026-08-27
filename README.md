# ArtCanvas

A modern fashion + art e-commerce concept — "wearable art meets contemporary design."

## Tech stack

- React 18 + Vite
- React Router (real multi-page routing)
- Framer Motion (page transitions, hover states, scroll-reveal animations)
- Tailwind CSS
- lucide-react (icons)

Product photography is generated deterministically via Picsum seeded URLs, so every image loads reliably with no external API keys needed.

## Run it

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
npm run preview
```

## Pages

- `/` — Home (hero, categories, featured products, testimonials)
- `/shop` — Shop, with sidebar categories, sort, and `?category=` filtering
- `/product/:id` — Product detail page with related products
- `/wishlist` — Saved products
- `/about` — Brand story + core values
- Any unknown route → a styled 404

## Motion & interaction

- Animated loading screen on first load
- Page transitions (fade + slide) between routes
- Scroll-triggered reveals and staggered grid entrances
- Navbar hides on scroll-down, reappears on scroll-up, shrinks on scroll
- Hover states on cards, buttons, and category tiles (scale, lift, image zoom)
- Animated cart drawer and wishlist/cart badge counters
- Respects `prefers-reduced-motion`

## Project structure

```
src/
  main.jsx                # entry point, wraps Router + StoreProvider
  App.jsx                 # layout shell: navbar, routed pages, footer, cart drawer
  context/StoreContext.jsx# cart, wishlist, theme (shared app state)
  data/products.js        # product + category data
  components/             # Navbar, Footer, ProductCard, CartDrawer, Marquee, Reveal, PageTransition
  pages/                  # Home, Shop, ProductDetail, About, Wishlist, NotFound
```

## What's not included (out of scope for this demo)

Frontend-only demo — cart/wishlist state lives in memory and resets on refresh. No real backend/database, authentication, payment processing, admin dashboard, or 3D/WebGL gallery. Happy to add any of these next if useful.
