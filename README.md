# ArtCanvas Frontend Monorepo

ArtCanvas frontend is organized as two independent applications in one repository. The backend is intentionally kept in a separate repository and is consumed through its API URL.

## Structure

```text
artcanvas-frontend/
├── apps/
│   ├── client/   # ArtCanvas customer storefront
│   └── admin/    # ArtCanvas Studio Admin (Boisetu-style dashboard UI)
└── package.json  # npm workspaces
```

## Client

`apps/client` contains the existing ArtCanvas storefront and its existing customer features: product browsing, search, cart persistence, checkout, account/profile, order tracking, purchase history, wishlist, messaging, homepage controls, multiple product images, dark/light mode, and responsive UI.

## Admin

`apps/admin` contains the separate ArtCanvas Studio Admin application using the Boisetu-inspired dashboard architecture and theme system. Existing ArtCanvas admin capabilities are connected to the same ArtCanvas backend API: products, multiple images, categories, subcategories, orders, messages, homepage/site content, Cloudinary uploads, and authentication.

## Backend

The backend is **not part of this repository**. Keep your existing ArtCanvas Hono/Cloudflare backend in its own repository/deployment.

Set the admin API URL with `NEXT_PUBLIC_ARTCANVAS_API_URL`, for example:

```env
NEXT_PUBLIC_ARTCANVAS_API_URL=http://localhost:8787
```

The client uses its existing `VITE_API_BASE_URL` configuration.

## Local development

From the repository root:

```bash
npm install

# Terminal 1
npm run dev:client

# Terminal 2
npm run dev:admin
```

Client: `http://localhost:5173`
Admin: `http://localhost:3000/admin/login`
Backend: run separately from your backend repository on `http://127.0.0.1:8787`.

### Environment files

Create these from the examples (do not commit the local files):

- `apps/client/.env.local` → use `VITE_*` variables.
- `apps/admin/.env.local` → use `NEXT_PUBLIC_*` variables.

The Firebase public configuration can be the same in both apps. The API URL should point to the separate backend (`http://localhost:8787` locally).

### React duplicate fix

This monorepo intentionally uses one React/React DOM version (`19.2.8`) across both workspaces. The child `package-lock.json` files are intentionally removed; install dependencies once from the monorepo root so npm workspaces can resolve a single React instance.

## Important

Do not duplicate Firestore data or backend logic inside either frontend app. Both apps should communicate with the separate ArtCanvas backend API. This keeps the frontend monorepo clean and allows the backend to evolve independently.
