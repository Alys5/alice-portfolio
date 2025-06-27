import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Modern Sass module system
        additionalData: `
          @use "@/styles/variables" as vars;
          @use "@/styles/animations" as anim;
        `,
      },
    },
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          animations: ['gsap'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'gsap'],
  },
  server: {
    port: 3000,
    open: true,
  },
})
