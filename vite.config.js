import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: {
        administration: 'Resources/app/administration/src/index.js'
      }
    }
  },
  resolve: {
    alias: {
      '@': '/Resources/app/administration/src'
    }
  }
}); 