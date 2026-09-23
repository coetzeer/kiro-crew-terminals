import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Shared React build: React/ReactDOM are externalized to share the host's React instance.
// xterm and CSS remain bundled/inlined. process.env.NODE_ENV replaced for production.
export default defineConfig({
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/index.jsx',
      formats: ['es'],
      fileName: () => 'index.mjs',
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react-dom/client',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
      ],
      output: {
        // Ensure default export is preserved for React.lazy()
        exports: 'named',
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
});
