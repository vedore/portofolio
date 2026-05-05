import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          'three-core': ['three'],
          fiber: ['@react-three/fiber'],
          drei: ['@react-three/drei'],
        },
      },
    },
  },
});
