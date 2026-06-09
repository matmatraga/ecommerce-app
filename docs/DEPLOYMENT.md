# Deployment Guide

The live demo runs on this exact setup: Vercel (client) + Render (API) + MongoDB Atlas + PayMongo test mode.

## MongoDB Atlas

1. Create a free cluster at https://www.mongodb.com/atlas
2. Add your IP to the network access list (or `0.0.0.0/0` for demos)
3. Create a database user and copy the connection string into `MONGODB_STRING`
4. After the API is up, run `npm run seed` (from `server/`) against this database to create the admin account and demo catalog

## API (Render)

1. New Web Service → connect GitHub repo
2. Root directory: `server`
3. Build command: `npm install`
4. Start command: `npm start`
5. Environment variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `MONGODB_STRING` | Atlas connection string | |
| `SECRET` | long random string | JWT signing |
| `NODE_ENV` | `production` | **Required** — switches the auth cookie to `Secure; SameSite=None` so the cross-origin SPA can log in |
| `CLIENT_URL` | `https://your-app.vercel.app` | Exact origin, no trailing slash — used for CORS and PayMongo redirect URLs |
| `PAYMONGO_SECRET_KEY` | `sk_test_...` | Test key until you intend to charge real money |
| `PAYMONGO_WEBHOOK_SECRET` | `whsk_...` | From the webhook you register below |
| `CLOUDINARY_*` | cloud name / key / secret | For admin product image uploads |

The server already sets `trust proxy` so rate limiting works behind Render's reverse proxy.

> **Free-tier note:** Render free instances sleep after idle. The first request (including a webhook delivery) may hit a ~30s cold start. PayMongo retries failed webhook deliveries, so paid orders still reconcile — but for a client production deployment use a paid tier.

## Client (Vercel)

The repo root contains `vercel.json`, which pins the install/build to the `client/` workspace and adds the SPA rewrite — import the repo at the **repo root** (not `client/`).

1. Import repo (framework auto-detected via `vercel.json`)
2. Environment variable: `VITE_API_URL=https://your-api.onrender.com` (build-time — set it **before** deploying)
3. Deploy, then copy the production URL into Render's `CLIENT_URL`

## Payments (PayMongo)

Orders support COD plus PayMongo hosted checkout (GCash, GrabPay, QRPh). Order status flips to `paid` **only** via PayMongo's signed webhook — the client redirect is never trusted.

### Register the webhook (the part everyone gets wrong)

**Webhooks are registered per mode.** A webhook created while the dashboard is in *live* mode will never receive events from *test*-mode payments — checkouts succeed but orders stay `pending` forever, with zero deliveries in the dashboard. Make sure the mode matches your `PAYMONGO_SECRET_KEY`.

Register via API (uses the key's mode automatically, which avoids the dashboard-mode pitfall):

```bash
curl https://api.paymongo.com/v1/webhooks \
  -u sk_test_yourkey: \
  -H "Content-Type: application/json" \
  -d '{"data":{"attributes":{"url":"https://your-api.onrender.com/webhooks/paymongo","events":["checkout_session.payment.paid"]}}}'
```

The response contains `attributes.secret_key` (`whsk_...`) — set it as `PAYMONGO_WEBHOOK_SECRET` on Render and redeploy. Each webhook has its own secret; recreating the webhook means updating the env var.

### Verify the wiring

- `POST https://your-api.onrender.com/webhooks/paymongo` with an empty body should return **401** (route deployed, signature check active). A **404** means the payment code isn't deployed.
- Complete a test checkout; the PayMongo dashboard's webhook **Event Deliveries** tab should show a `200`, and the order should flip to *Paid*.

### Local webhook testing

PayMongo can't reach `localhost` — expose the API with a tunnel (`cloudflared tunnel --url http://localhost:4000` or ngrok) and register a test-mode webhook pointing at `https://<tunnel-url>/webhooks/paymongo`. Quick-tunnel URLs change on every restart, so update the webhook URL each session.

### Going live

Switch `PAYMONGO_SECRET_KEY` to `sk_live_...`, register a **live-mode** webhook for the same URL, and update `PAYMONGO_WEBHOOK_SECRET` to the live webhook's secret. Live QR codes and checkouts charge real money.
