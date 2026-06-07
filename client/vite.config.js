import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const API_TARGET = process.env.VITE_API_URL || 'http://localhost:4000';
const proxy = ['/users', '/products', '/orders', '/carts', '/upload', '/health'].reduce(
  (acc, path) => ({ ...acc, [path]: { target: API_TARGET, changeOrigin: true } }),
  {}
);

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy,
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
