import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import VueDevTools from 'vite-plugin-vue-devtools'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'

  return {
    plugins: [
      vue(),
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // 1 anno
                }
              }
            }
          ]
        },
        manifest: {
          name: 'Alice Mandelli - Portfolio',
          short_name: 'Alice Portfolio',
          description: 'Portfolio professionale di Alice Mandelli - UI Developer & Designer',
          theme_color: '#ffc940',
          background_color: '#29353f',
          display: 'standalone',
          icons: [
            {
              src: '/favicon.ico',
              sizes: '64x64',
              type: 'image/x-icon'
            }
          ]
        }
      }),
      VueDevTools()
    ],

    // Alias per import
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },

    // Ottimizzazioni per produzione
    build: {
      target: 'es2015',
      minify: 'terser',
      sourcemap: !isProduction,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router', 'pinia'],
            animations: ['gsap', '@vueuse/motion'],
            utils: ['web-vitals']
          }
        }
      },
      // Analisi bundle per CI/CD
      ...(process.env.ANALYZE && {
        rollupOptions: {
          plugins: [
            // Aggiungi analisi bundle se richiesto
            {
              name: 'bundle-analyzer',
              generateBundle(options, bundle) {
                const sizes: Record<string, number> = {}
                for (const fileName in bundle) {
                  const file = bundle[fileName]
                  if (file.type === 'chunk') {
                    sizes[fileName] = file.code.length
                  }
                }
                console.log('📊 Bundle Analysis:', sizes)
              }
            }
          ]
        }
      })
    },

    // Ottimizzazioni per sviluppo
    server: {
      port: 3000,
      host: true,
      open: true
    },

    // Preload critico
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia', 'gsap']
    },

    // CSS optimization
    css: {
      devSourcemap: !isProduction
    },

    // Environment variables
    define: {
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: !isProduction
    }
  }
})
