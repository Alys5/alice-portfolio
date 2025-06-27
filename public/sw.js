/**
 * Service Worker per Alice Mandelli Portfolio - PWA 2025
 * - Caching statico e dinamico con strategie avanzate
 * - Precache delle risorse critiche per performance ottimali
 * - Gestione offline intelligente con fallback
 * - Background sync per operazioni offline
 * - Gestione notifiche push e messaggi client
 * - Pronto per PWA e supporto offline completo
 */

const CACHE_VERSION = 'alice-portfolio-v2.0.0'
const STATIC_CACHE = `static-${CACHE_VERSION}`
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`

// Risorse critiche da precacheare immediatamente
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/favicon.svg',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/apple-touch-icon.png'
]

// Risorse statiche da cacheare con strategia cache-first
const STATIC_ASSETS = [
  ...CRITICAL_ASSETS,
  // CSS e JS bundles principali
  '/assets/index.css',
  '/assets/index.js',
  // Fonts critici
  '/fonts/inter-var.woff2',
  // Immagini critiche
  '/images/hero-bg.webp',
  '/images/avatar.webp'
]

// Pattern per identificare risorse dinamiche
const DYNAMIC_PATTERNS = [
  /\/api\//,
  /\/blog\//,
  /\/portfolio\//,
  /\.json$/,
  /googleapis\.com/,
  /analytics/
]

// Pattern per risorse runtime (non cacheare)
const RUNTIME_PATTERNS = [
  /chrome-extension:/,
  /moz-extension:/,
  /safari-extension:/,
  /edge-extension:/
]

/**
 * Installa il service worker e precachea le risorse critiche
 */
self.addEventListener('install', (event) => {
  console.log('🔄 Service Worker installazione in corso...')

  event.waitUntil(
    Promise.all([
      // Precache delle risorse critiche
      caches.open(STATIC_CACHE)
        .then((cache) => {
          console.log('📦 Precaching risorse critiche...')
          return cache.addAll(CRITICAL_ASSETS)
        }),

      // Cache delle risorse statiche
      caches.open(STATIC_CACHE)
        .then((cache) => {
          console.log('📦 Caching risorse statiche...')
          return cache.addAll(STATIC_ASSETS)
        })
    ])
      .then(() => {
        console.log('✅ Service Worker installato con successo')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('❌ Errore durante l\'installazione:', error)
      })
  )
})

/**
 * Attiva il service worker e pulisce le cache vecchie
 */
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker attivazione...')

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Rimuovi cache vecchie
            if (!cacheName.includes(CACHE_VERSION)) {
              console.log('🗑️ Rimozione cache obsoleta:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('✅ Service Worker attivato')
        return self.clients.claim()
      })
  )
})

/**
 * Intercetta le richieste e applica le strategie di caching ottimizzate
 */
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Ignora richieste non GET
  if (request.method !== 'GET') {
    return
  }

  // Ignora richieste runtime
  if (RUNTIME_PATTERNS.some(pattern => pattern.test(url.href))) {
    return
  }

  // Strategia per risorse critiche e statiche
  if (isCriticalAsset(url.pathname) || isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE))
    return
  }

  // Strategia per API e contenuti dinamici
  if (isDynamicContent(url.pathname)) {
    event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE))
    return
  }

  // Strategia per contenuti che possono essere aggiornati in background
  if (isStaleWhileRevalidateContent(url.pathname)) {
    event.respondWith(staleWhileRevalidateStrategy(request, DYNAMIC_CACHE))
    return
  }

  // Fallback: Network First con cache
  event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE))
})

/**
 * Cache First Strategy - Per risorse che cambiano raramente
 */
async function cacheFirstStrategy(request, cacheName) {
  try {
    // Prova prima dalla cache
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      console.log('📦 Servito dalla cache:', request.url)
      return cachedResponse
    }

    // Se non in cache, fetch dalla rete
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
      console.log('💾 Aggiunto alla cache:', request.url)
    }
    return networkResponse
  } catch (error) {
    console.error('❌ Cache First fallito:', error)
    return createOfflineResponse(request)
  }
}

/**
 * Network First Strategy - Per contenuti che devono essere sempre aggiornati
 */
async function networkFirstStrategy(request, cacheName) {
  try {
    // Prova prima dalla rete
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
      console.log('💾 Aggiornato in cache:', request.url)
    }
    return networkResponse
  } catch (error) {
    console.log('🌐 Rete non disponibile, prova cache:', request.url)

    // Fallback alla cache
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      console.log('📦 Servito dalla cache (offline):', request.url)
      return cachedResponse
    }

    return createOfflineResponse(request)
  }
}

/**
 * Stale While Revalidate Strategy - Per contenuti che possono essere aggiornati in background
 */
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cachedResponse = await cache.match(request)

  // Aggiorna in background
  const networkResponsePromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone())
        console.log('🔄 Aggiornato in background:', request.url)
      }
      return response
    })
    .catch(() => {
      console.log('⚠️ Aggiornamento background fallito:', request.url)
      return null
    })

  // Ritorna cache se disponibile, altrimenti aspetta la rete
  return cachedResponse || networkResponsePromise
}

/**
 * Crea una risposta offline personalizzata
 */
function createOfflineResponse(request) {
  const url = new URL(request.url)

  // Risposta offline personalizzata per HTML
  if (request.headers.get('accept')?.includes('text/html')) {
    return new Response(
      `<!DOCTYPE html>
      <html lang="it">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Offline - Alice Portfolio</title>
        <style>
          body { font-family: system-ui; text-align: center; padding: 2rem; }
          .offline-icon { font-size: 4rem; margin-bottom: 1rem; }
        </style>
      </head>
      <body>
        <div class="offline-icon">📱</div>
        <h1>Sei offline</h1>
        <p>Questa pagina non è disponibile offline.</p>
        <p>Controlla la tua connessione e riprova.</p>
        <button onclick="window.location.reload()">Riprova</button>
      </body>
      </html>`,
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/html' }
      }
    )
  }

  // Risposta generica per altri tipi
  return new Response('Contenuto non disponibile offline', { status: 503 })
}

/**
 * Determina se è una risorsa critica
 */
function isCriticalAsset(pathname) {
  return CRITICAL_ASSETS.includes(pathname)
}

/**
 * Determina se è un asset statico
 */
function isStaticAsset(pathname) {
  const staticExtensions = [
    '.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico',
    '.woff', '.woff2', '.ttf', '.webp', '.avif'
  ]
  return staticExtensions.some(ext => pathname.endsWith(ext)) ||
    STATIC_ASSETS.includes(pathname)
}

/**
 * Determina se è contenuto dinamico
 */
function isDynamicContent(pathname) {
  return DYNAMIC_PATTERNS.some(pattern => pattern.test(pathname))
}

/**
 * Determina se è contenuto per stale-while-revalidate
 */
function isStaleWhileRevalidateContent(pathname) {
  return pathname.startsWith('/blog/') ||
    pathname.startsWith('/portfolio/') ||
    pathname.includes('?')
}

/**
 * Gestisce i messaggi dal client
 */
self.addEventListener('message', (event) => {
  const { type, data } = event.data || {}

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting()
      break

    case 'GET_VERSION':
      event.ports[0].postMessage({ version: CACHE_VERSION })
      break

    case 'CACHE_URL':
      cacheUrl(data.url, data.cacheName || DYNAMIC_CACHE)
      break

    case 'DELETE_CACHE':
      deleteCache(data.cacheName)
      break

    case 'GET_CACHE_INFO':
      getCacheInfo().then(info => {
        event.ports[0].postMessage(info)
      })
      break
  }
})

/**
 * Cachea una URL specifica
 */
async function cacheUrl(url, cacheName) {
  try {
    const cache = await caches.open(cacheName)
    const response = await fetch(url)
    if (response.ok) {
      await cache.put(url, response)
      console.log('💾 URL cacheata manualmente:', url)
    }
  } catch (error) {
    console.error('❌ Errore cache manuale:', error)
  }
}

/**
 * Elimina una cache specifica
 */
async function deleteCache(cacheName) {
  try {
    await caches.delete(cacheName)
    console.log('🗑️ Cache eliminata:', cacheName)
  } catch (error) {
    console.error('❌ Errore eliminazione cache:', error)
  }
}

/**
 * Ottiene informazioni sulle cache
 */
async function getCacheInfo() {
  const cacheNames = await caches.keys()
  const cacheInfo = {}

  for (const name of cacheNames) {
    const cache = await caches.open(name)
    const keys = await cache.keys()
    cacheInfo[name] = keys.length
  }

  return cacheInfo
}

/**
 * Gestisce il push notification
 */
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
        url: data.url || '/'
      },
      actions: [
        {
          action: 'explore',
          title: 'Visualizza',
          icon: '/icon-192x192.png'
        },
        {
          action: 'close',
          title: 'Chiudi',
          icon: '/icon-192x192.png'
        }
      ],
      requireInteraction: false,
      silent: false
    }

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

/**
 * Gestisce i click sulle notifiche
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'explore') {
    const url = event.notification.data?.url || '/'
    event.waitUntil(
      clients.openWindow(url)
    )
  }
})

/**
 * Background Sync per operazioni offline
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(performBackgroundSync())
  }
})

/**
 * Esegue operazioni di background sync
 */
async function performBackgroundSync() {
  try {
    console.log('🔄 Esecuzione background sync...')
    // Implementa qui la logica per sincronizzare dati offline
    // Es: invio form, aggiornamento cache, etc.
  } catch (error) {
    console.error('❌ Errore background sync:', error)
  }
}

/**
 * Gestisce errori non catturati
 */
self.addEventListener('error', (event) => {
  console.error('❌ Service Worker error:', event.error)
})

/**
 * Gestisce promise rejection non catturate
 */
self.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Service Worker unhandled rejection:', event.reason)
})
