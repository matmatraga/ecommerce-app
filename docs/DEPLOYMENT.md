# Deployment Guide

## MongoDB Atlas

1. Create a free cluster at https://www.mongodb.com/atlas
2. Add your IP to the network access list (or `0.0.0.0/0` for demos)
3. Create a database user and copy the connection string into `MONGODB_STRING`

## API (Render example)

1. New Web Service → connect GitHub repo
2. Root directory: `server`
3. Build command: `npm install`
4. Start command: `npm start`
5. Environment variables: `PORT`, `MONGODB_STRING`, `SECRET`, `CLIENT_URL`

## Client (Vercel example)

1. Import repo, set root directory to `client`
2. Framework preset: Vite
3. Environment variable: `VITE_API_URL=https://your-api.onrender.com`
4. Deploy

## Payments (production)

Orders use COD, GCash, and GrabPay. No third-party payment API is required — confirm GCash/GrabPay transfers manually in the admin dashboard and update order status to `paid` when received.
