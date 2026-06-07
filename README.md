# ASTER E-Commerce

Full-stack MERN e-commerce application built as a freelance portfolio project. Features product catalog, cart, JWT auth with admin RBAC, Philippine payment options (COD, GCash, GrabPay), order management, reviews, and search.

## Stack

- **Frontend:** React 18, Vite, React Router, TanStack Query, Bootstrap
- **Backend:** Node.js, Express, Mongoose, JWT
- **Database:** MongoDB
- **Payments:** Cash on Delivery, GCash, GrabPay (manual confirmation)

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
SEED_ADMIN_EMAIL=admin@aster.dev
SEED_ADMIN_PASSWORD=Admin1234!
```

**client/.env** (copy from `client/.env.example`):

```env
VITE_API_URL=http://localhost:4000
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
- **GCash / GrabPay** — order is placed as `pending`; admin confirms payment manually

## API overview

| Resource | Endpoints |
|----------|-----------|
| Users | `POST /users/register`, `POST /users/login`, `GET /users/details` |
| Products | `GET /products`, `GET /products/all`, `PATCH /products/:id/archive` |
| Cart | `GET/POST /carts`, `PUT /carts/quantity`, `PATCH /carts/clear` |
| Orders | `POST /orders`, `GET /orders/authenticatedorder`, `PATCH /orders/:id/cancel` |

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
- Philippine-focused payment options (COD, GCash, GrabPay)
- Admin order status management
- Product search, filters, and reviews

## License

MIT
