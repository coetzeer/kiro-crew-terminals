import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Self-contained build: no dependency on @kirocrew/app-sdk at build time.
// The UI talks to the backend via the gateway reverse-proxy at
// /apps/kiro-herdr-views/api/*, which the gateway authenticates for the
// signed-in dashboard session.
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/index.jsx',
      formats: ['es'],
      fileName: () => 'index.mjs',
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
});
