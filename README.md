# ShopNest — React Frontend

Premium e-commerce frontend built with React 18, Vite, Bootstrap 5.3 (react-bootstrap), Framer Motion, React Router, Context API and Axios.

## Quick start
```bash
npm install
cp .env.example .env     # set VITE_API_URL to your Phase 4 backend
npm run dev              # http://localhost:5173
npm run build            # production build in /dist
```

## Features
- **Routing** — `/`, `/products`, `/products/:id` (useParams), `/cart`, `/contact`, 404 page, animated page transitions
- **Global cart** — Context API + useReducer; add, remove, quantity +/–, persisted in localStorage, no prop drilling; slide-out mini cart drawer
- **API** — Axios + useEffect with AbortController, spinner + shimmer skeletons while loading, friendly error with retry
- **Components** — Navbar, ProductCard, ProductGrid, CartItem, CategoryFilter, MiniCart, Toast, Rating, Spinner, ErrorState
- **Design** — Bootstrap 5.3 grid and components with a custom midnight/gold theme, dark and light mode toggle (saved)
- **Animation** — hero word reveal and mouse parallax, floating tiles, count-up stats, marquee ticker, 3D card tilt, staggered scroll reveals, animated filter pill, image zoom, animated cart totals, scroll progress bar, success checkmark draw
- **UX** — search, sort and category filter stored in the URL, add-to-cart toast, free-delivery progress, related products, back-to-top, keyboard focus, reduced-motion support

## Connecting the Phase 4 backend
Set `VITE_API_URL` to the backend base URL. It must expose `GET /products` and `GET /products/:id`.
`src/api/client.js` maps common field names (`id`/`_id`, `title`/`name`, `image`/`imageUrl`) so most response shapes work unchanged. Enable CORS for your Netlify domain on the backend.
Without the variable, the app uses the public Fake Store API so you can demo it immediately.

## Deploy to Netlify
1. Push the project to GitHub.
2. Netlify → **Add new site → Import from Git**. Build command `npm run build`, publish directory `dist` (already in `netlify.toml`).
3. Add `VITE_API_URL` under **Site settings → Environment variables**, then deploy.
4. Submit the live `https://<your-site>.netlify.app` URL.

SPA refresh/deep-link routing is handled by `netlify.toml` and `public/_redirects`.
