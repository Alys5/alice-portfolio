// Service Worker per Portfolio Alice Mandelli
// Cache name
const CACHE_NAME = 'alice-mandelli-portfolio-v1.0.0'

// Files to cache
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.ts',
  '/src/App.vue',
  '/src/views/HomeView.vue',
  '/src/components/layout/ProfessionalNavbar.vue',
  '/src/components/layout/FooterSection.vue',
  '/src/components/sections/HeroSection.vue',
  '/src/components/sections/AboutSection.vue',
  '/src/components/sections/PortfolioSection.vue',
  '/src/components/sections/ContactSection.vue',
  '/src/styles/main.scss',
  '/src/styles/variables.scss',
  '/src/i18n/locales/it.json',
  '/src/i18n/locales/en.json',
  '/src/i18n/locales/es.json'
]

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache')
        return cache.addAll(urlsToCache)
      })
      .catch((error) => {
        console.error('Cache installation failed:', error)
      })
  )
})

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
      })
      .catch(() => {
        // Fallback for offline
        if (event.request.destination === 'document') {
          return caches.match('/index.html')
        }
      })
  )
})

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Skip waiting for immediate activation
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
