import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'handlebars-loader',
      transform(code, id) {
        if (id.endsWith('.hba')) {
          // Handlebars-Template als JavaScript-String exportieren
          const escapedCode = code
            .replace(/\\/g, '\\\\')
            .replace(/'/g, "\\'")
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\t/g, '\\t')
          
          return {
            code: `export default function(data) { 
              // Hier würde die Handlebars-Engine das Template rendern
              // Für jetzt geben wir das Template als String zurück
              return \`${escapedCode}\`
            }`,
            map: null
          }
        }
      }
    }
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'Resources/app'),
      '@admin': resolve(__dirname, 'Resources/app/administration/src'),
    },
  },
  build: {
    outDir: 'Resources/public/build',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        administration: resolve(__dirname, 'Resources/app/administration/src/index.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    },
  },
  server: {
    port: 3001,
    host: true,
  },
  css: {
    postcss: './postcss.config.js'
  }
}) 