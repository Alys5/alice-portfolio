import { fileURLToPath, URL } from 'node:url'
import path from 'path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import viteCompression from 'vite-plugin-compression'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    // Compressione avanzata per Core Web Vitals
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      deleteOriginFile: false,
      threshold: 1024,
      compressionOptions: {
        level: 11, // Massima compressione Brotli
      },
    }),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      deleteOriginFile: false,
      threshold: 1024,
    }),
    // PWA per caching e performance
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 anno
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 anno
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 giorni
              },
            },
          },
        ],
      },
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'Alice Mandelli - Portfolio',
        short_name: 'Alice Portfolio',
        description: 'UI Developer & AI Strategist Portfolio',
        theme_color: '#2048b4',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'favicon.ico',
            sizes: 'any',
            type: 'image/x-icon',
          },
        ],
      },
    }),
    // Analizzatore bundle (solo in build con ANALYZE=true)
    ...(process.env.ANALYZE
      ? [
          visualizer({
            filename: 'dist/stats.html',
            open: true,
            gzipSize: true,
            brotliSize: true,
          }),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@components': path.resolve(__dirname, 'src/components'),
    },
  },
  assetsInclude: ['**/*.md'],
  build: {
    sourcemap: true,
    modulePreload: {
      polyfill: true,
    },
    // Ottimizzazioni per Core Web Vitals
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
      },
    },
    rollupOptions: {
      output: {
        // Code splitting ottimizzato per Core Web Vitals
        manualChunks: (id: string) => {
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('vue-router')) {
              return 'vue-core'
            }
            if (id.includes('pinia')) {
              return 'vue-state'
            }
            if (id.includes('i18n')) {
              return 'i18n'
            }
            return 'vendor'
          }
          if (id.includes('components/ui/')) {
            return 'ui-components'
          }
          if (id.includes('components/sections/')) {
            return 'sections'
          }
          if (
            id.includes('components/ui/BlogCard') ||
            id.includes('components/ui/VMarkdownEditor')
          ) {
            return 'blog'
          }
        },
        // Ottimizzazioni per caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
          if (facadeModuleId) {
            if (facadeModuleId.includes('node_modules')) {
              return 'vendor/[name]-[hash].js'
            }
            if (facadeModuleId.includes('components')) {
              return 'components/[name]-[hash].js'
            }
            if (facadeModuleId.includes('pages')) {
              return 'pages/[name]-[hash].js'
            }
          }
          return 'chunks/[name]-[hash].js'
        },
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name
          if (!name) return 'assets/[name]-[hash].[ext]'

          if (/\.(css)$/.test(name)) {
            return 'assets/css/[name]-[hash].[ext]'
          }
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico|webp)$/i.test(name)) {
            return 'assets/images/[name]-[hash].[ext]'
          }
          return 'assets/[name]-[hash].[ext]'
        },
      },
    },
    // Ottimizzazioni per LCP
    chunkSizeWarningLimit: 1000,
  },
  // Ottimizzazioni per sviluppo
  server: {
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  },
  // Preload critico per LCP
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia'],
    exclude: ['@vueuse/core'],
  },
})
