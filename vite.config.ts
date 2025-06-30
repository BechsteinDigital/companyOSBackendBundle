import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import symfony from 'vite-plugin-symfony'
import { resolve } from 'path'
import { fileURLToPath, URL } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [
    vue(),
    symfony(),
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
    outDir: '../../../public/build',
    emptyOutDir: true,
    manifest: true,
    // Performance optimizations
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2
      },
      mangle: {
        safari10: true
      }
    },
    rollupOptions: {
      input: {
        app: resolve(__dirname, 'Resources/app/administration/src/index.ts'),
      },
      output: {
        entryFileNames: 'js/[name].[hash].js',
        chunkFileNames: 'js/[name].[hash].js',
        assetFileNames: (assetInfo: any) => {
          const info = assetInfo.name?.split('.') || []
          const ext = info[info.length - 1]
          if (/\.(css)$/.test(assetInfo.name || '')) {
            return `css/[name].[hash].${ext}`
          }
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name || '')) {
            return `images/[name].[hash].${ext}`
          }
          return `assets/[name].[hash].${ext}`
        },
        // Optimize chunk splitting
        manualChunks: (id: string) => {
          if (id.includes('node_modules')) {
            if (id.includes('vue')) return 'vue'
            if (id.includes('@headlessui') || id.includes('@heroicons')) return 'ui'
            return 'vendor'
          }
        }
      }
    },
    // Build optimizations
    chunkSizeWarningLimit: 1000,
    sourcemap: false, // Disable sourcemaps for production
    reportCompressedSize: false, // Faster builds
    cssCodeSplit: true
  },
  server: {
    port: 3001,
    host: true,
    // Hot reload Optimierung
    hmr: {
      overlay: true
    }
  },
  css: {
    postcss: './postcss.config.js',
    // CSS Code Splitting
    devSourcemap: true
  },
  // Optimierungen für Development
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', '@headlessui/vue', '@heroicons/vue'],
    exclude: [],
    // Force pre-bundling
    force: false
  },
  // Performance optimizations
  esbuild: {
    target: 'es2015',
    legalComments: 'none'
  },
  // Cache optimizations
  cacheDir: '.vite-cache',
  // Worker optimizations
  worker: {
    format: 'es'
  }
}) 