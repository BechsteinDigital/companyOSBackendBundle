import { defineConfig } from 'vite'
import symfonyPlugin from '@symfony/vite-plugin'

export default defineConfig({
  plugins: [
    symfonyPlugin(),
  ],
  build: {
    rollupOptions: {
      input: {
        admin: './src/index.ts'
      }
    },
    outDir: 'dist',
    manifest: true
  },
  server: {
    port: 5173,
    host: '0.0.0.0'
  }
}) 