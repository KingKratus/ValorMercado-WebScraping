import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // Express server runs on 3001
        changeOrigin: true,
        // secure: false, // Optional: Add if backend is not on HTTPS and experiencing issues
        // No rewrite needed as frontend calls /api/* and backend expects /api/*
      },
    },
  },
});