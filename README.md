# ASTER E-Commerce

Full-stack MERN e-commerce application built as a freelance portfolio project. Features product catalog, cart, JWT auth with admin RBAC, Philippine payment options (COD plus PayMongo GCash, GrabPay, QRPh), order management, reviews, and search.

## Stack

- **Frontend:** React 18, Vite, React Router, TanStack Query, Bootstrap
- **Backend:** Node.js, Express, Mongoose, JWT
- **Database:** MongoDB
- **Payments:** Cash on Delivery plus PayMongo hosted checkout (GCash, GrabPay, QRPh)

## Project structure

```
ecommerce-app/
├── client/          # Vite React app (port 5173)
├── server/          # Express API (port 4000)
└── package.json     # Run both with `npm run dev`
```

## Quick start

### Prerequisites

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure environment

**server/.env** (copy from `server/.env.example`):

```env
PORT=4000
MONGODB_STRING=mongodb://127.0.0.1:27017/aster-ecommerce
SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
SEED_ADMIN_EMAIL=admin@aster.dev
SEED_ADMIN_PASSWORD=Admin1234!
```

**client/.env** (copy from `client/.env.example`):

```env
# Leave empty in development — the Vite dev server proxies API paths to the
# backend so the httpOnly auth cookie stays same-origin. Set to the production
# API origin only when the client is served from a different domain.
VITE_API_URL=
```

### 3. Seed admin user

Creates the admin account only. Add products through the Admin Dashboard after logging in.

```bash
npm run seed
```

### 4. Run development

```bash
npm run dev
```

- Storefront: http://localhost:5173
- API: http://localhost:4000/health

## Checkout flow

All orders go through `POST /orders` with a chosen payment method:

- **COD** — order is placed as `pending`; pay on delivery
- **GCash / GrabPay / QRPh** — order is placed as `pending`, then the shopper is redirected to a PayMongo hosted checkout (`POST /payments/checkout`). PayMongo notifies the server via webhook (`POST /webhooks/paymongo`), which marks the order `paid`

Online payments require `PAYMONGO_SECRET_KEY` and `PAYMONGO_WEBHOOK_SECRET` (use test keys first). Without them, only Cash on Delivery is available. Webhooks need a public URL — use a tunnel such as ngrok pointing to `/webhooks/paymongo` for local testing.

## Security

- **httpOnly cookie auth** — the JWT is set as an `httpOnly`, `SameSite=Lax` cookie on login (never stored in `localStorage`), so it is not reachable from JavaScript. It is sent automatically with same-origin requests and cleared by `POST /users/logout`. In production (`NODE_ENV=production`) the cookie is also `Secure` (HTTPS only).
- **Helmet** sets hardened HTTP response headers.
- **CORS** is restricted to `CLIENT_URL` with credentials enabled.
- **Rate limiting** — a global limit plus stricter limits on auth endpoints (`/users/login`, `/users/register`) and order creation (`POST /orders`).
- The Vite dev server proxies API paths to the backend so cookies remain same-origin during local development.

## API overview

| Resource | Endpoints |
|----------|-----------|
| Users | `POST /users/register`, `POST /users/login`, `POST /users/logout`, `GET /users/details` |
| Products | `GET /products`, `GET /products/all`, `PATCH /products/:id/archive` |
| Cart | `GET/POST /carts`, `PUT /carts/quantity`, `PATCH /carts/clear` |
| Orders | `POST /orders`, `GET /orders/authenticatedorder`, `PATCH /orders/:id/cancel` |
| Payments | `POST /payments/checkout`, `POST /webhooks/paymongo` |

## Deployment

| Service | Suggested host |
|---------|----------------|
| Client (static) | Vercel / Netlify — set `VITE_API_URL` to production API |
| API | Render / Railway / Fly.io |
| Database | MongoDB Atlas |

Build client: `cd client && npm run build`

## Testing

```bash
npm test
```

## Portfolio highlights

- Reconciled legacy API with modern Vite + TanStack Query client
- Stock validation on cart and checkout
- Philippine-focused payments: COD plus PayMongo hosted checkout (GCash, GrabPay, QRPh)
- Admin order status management
- Product search, filters, and reviews

## License

MIT
