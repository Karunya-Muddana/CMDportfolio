import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'motion-vendor': ['motion'],
        },
      },
    },
  },
  
  server: {
    port: 3000,
    open: true,
  },
  
  preview: {
    port: 4173,
    open: true,
  },
  
  optimizeDeps: {
    include: ['react', 'react-dom', 'motion'],
  },
});
