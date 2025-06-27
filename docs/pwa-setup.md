# Configurazione PWA - Alice Portfolio

## Panoramica

Il portfolio di Alice Mandelli è configurato come Progressive Web App (PWA) con supporto offline completo, caching intelligente e funzionalità native.

## Caratteristiche PWA

### ✅ Funzionalità Implementate

- **Service Worker Avanzato** con strategie di caching multiple
- **Manifest.json** completo con shortcuts e configurazioni moderne
- **Supporto Offline** con fallback intelligenti
- **Precache delle Risorse Critiche** per performance ottimali
- **Background Sync** per operazioni offline
- **Push Notifications** (configurabile)
- **Install Prompt** automatico
- **Aggiornamenti Automatici** con notifiche

### 🔧 Strategie di Caching

1. **Cache First**: Per risorse statiche (CSS, JS, immagini)
2. **Network First**: Per API e contenuti dinamici
3. **Stale While Revalidate**: Per contenuti che possono essere aggiornati in background

## Configurazione

### 1. Variabili d'Ambiente

Crea un file `.env.local` con le seguenti variabili:

```bash
# VAPID Keys per Push Notifications (opzionale)
VITE_VAPID_PUBLIC_KEY=your_vapid_public_key_here

# Analytics (opzionale)
VITE_GA_TRACKING_ID=your_google_analytics_id_here

# API Endpoints
VITE_API_BASE_URL=https://api.alicemandelli.dev
VITE_CONTACT_API_URL=https://api.alicemandelli.dev/contact

# PWA Configuration
VITE_PWA_NAME=Alice Mandelli Portfolio
VITE_PWA_SHORT_NAME=Alice Portfolio
VITE_PWA_DESCRIPTION=Portfolio di Alice Mandelli - UI Developer e AI Strategist
VITE_PWA_THEME_COLOR=#ffc940
VITE_PWA_BACKGROUND_COLOR=#ffffff
```

### 2. Generazione VAPID Keys (Push Notifications)

```bash
# Installa web-push globalmente
npm install -g web-push

# Genera le chiavi VAPID
npx web-push generate-vapid-keys

# Copia le chiavi nel file .env.local
```

### 3. Icone PWA

Assicurati di avere le seguenti icone nella cartella `public/`:

- `icon-192x192.png` - Icona 192x192px
- `icon-512x512.png` - Icona 512x512px
- `apple-touch-icon.png` - Icona Apple 180x180px
- `favicon.ico` - Favicon tradizionale
- `favicon.svg` - Favicon SVG

## Utilizzo

### Composable useServiceWorker

```typescript
import { useServiceWorker } from '@/composables/useServiceWorker'

const { state, installUpdate, getCacheInfo } = useServiceWorker()

// Controlla se c'è un aggiornamento disponibile
if (state.value.isUpdateAvailable) {
  await installUpdate()
}

// Ottieni informazioni sulla cache
const cacheInfo = await getCacheInfo()
```

### Componente PWAStatus

```vue
<template>
  <PWAStatus />
</template>

<script setup>
import PWAStatus from '@/components/ui/PWAStatus.vue'
</script>
```

## Testing PWA

### 1. Lighthouse Audit

```bash
# Esegui audit PWA con Lighthouse
npx lighthouse https://your-domain.com --output=html --output-path=./lighthouse-report.html
```

### 2. Chrome DevTools

1. Apri Chrome DevTools
2. Vai alla tab "Application"
3. Controlla:
   - Service Workers
   - Manifest
   - Storage (Cache)
   - Background Services

### 3. Test Offline

1. Apri l'app in Chrome
2. Vai su DevTools → Network
3. Seleziona "Offline"
4. Ricarica la pagina
5. Verifica che l'app funzioni offline

## Deployment

### 1. Build di Produzione

```bash
npm run build
```

### 2. Verifica PWA

Dopo il build, verifica che:

- `dist/sw.js` sia presente
- `dist/manifest.json` sia configurato correttamente
- Le icone siano nella cartella `dist/`

### 3. HTTPS

**IMPORTANTE**: Le PWA richiedono HTTPS in produzione. Assicurati che:

- Il dominio sia servito su HTTPS
- Il certificato SSL sia valido
- Non ci siano errori di certificato

## Monitoraggio

### 1. Service Worker Logs

I log del service worker sono disponibili in:

- Chrome DevTools → Application → Service Workers
- Console del browser (filtra per "Service Worker")

### 2. Cache Monitoring

```typescript
// Monitora lo stato della cache
const { getCacheInfo } = useServiceWorker()
const cacheInfo = await getCacheInfo()
console.log('Cache info:', cacheInfo)
```

### 3. Performance Monitoring

Il service worker include monitoraggio automatico per:

- Tempo di caricamento delle risorse
- Hit rate della cache
- Errori di rete
- Performance offline

## Troubleshooting

### Problemi Comuni

1. **Service Worker non si registra**

   - Verifica che il file `sw.js` sia nella root
   - Controlla che il server serva il file con MIME type corretto
   - Verifica che non ci siano errori JavaScript

2. **Cache non funziona**

   - Controlla i log del service worker
   - Verifica che le URL delle risorse siano corrette
   - Controlla che il service worker sia attivo

3. **Aggiornamenti non si installano**
   - Verifica che il service worker sia registrato
   - Controlla che la versione sia cambiata
   - Forza l'aggiornamento manualmente

### Debug Mode

In modalità sviluppo, il componente `PWAStatus` mostra informazioni di debug:

- Stato del service worker
- Informazioni sulla cache
- Log degli errori
- Configurazione dell'ambiente

## Best Practices

### 1. Cache Strategy

- Usa **Cache First** per risorse che cambiano raramente
- Usa **Network First** per contenuti che devono essere sempre aggiornati
- Usa **Stale While Revalidate** per contenuti che possono essere aggiornati in background

### 2. Performance

- Precache solo le risorse critiche
- Usa compressione per le risorse
- Implementa lazy loading per contenuti non critici
- Monitora le dimensioni della cache

### 3. User Experience

- Fornisci feedback visivo durante gli aggiornamenti
- Gestisci gracefully gli errori offline
- Mostra indicatori di stato della connessione
- Implementa retry automatico per operazioni fallite

## Risorse Utili

- [MDN - Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev - PWA](https://web.dev/progressive-web-apps/)
- [Lighthouse PWA Audit](https://developers.google.com/web/tools/lighthouse)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
