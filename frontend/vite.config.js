import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/** Dev proxy so /api and /uploads hit the Express server (see README). */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:5000', changeOrigin: true },
      '/uploads': { target: 'http://localhost:5000', changeOrigin: true },
    },
  },
});
