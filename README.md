# alice-portfolio

Portfolio/CV interattivo per **Alice Mandelli** – UI Developer & Designer

> Sviluppato con Vue 3 + TypeScript, Pinia, SCSS, i18n, **Cypress**, Vitest. Architettura moderna, manutenibile e pronta per i trend web 2025.

---

## 🚀 Setup progetto

### Prerequisiti

- **Node.js** >= 18
- **npm** >= 9

### Installazione

```bash
npm install
```

### Avvio sviluppo

```bash
npm run dev
```

### Build produzione

```bash
npm run build
```

---

## 🛠️ Comandi principali

| Comando                      | Descrizione                        |
| ---------------------------- | ---------------------------------- |
| `npm run dev`                | Avvia lo sviluppo con hot reload   |
| `npm run build`              | Build di produzione (PWA ready)    |
| `npm run preview`            | Anteprima build di produzione      |
| `npm run test:unit`          | Test unitari (Vitest)              |
| `npm run test:e2e`           | Test end-to-end (Cypress)          |
| `npm run lint`               | Linting ESLint + Prettier + Oxlint |
| `npm run format`             | Formattazione Prettier             |
| `npm run test:accessibility` | Test accessibilità (axe-core)      |
| `npm run test:lighthouse`    | Test Lighthouse CI                 |

---

## 📱 PWA (Progressive Web App)

Il portfolio è configurato come **PWA completa** con supporto offline e funzionalità native.

### ✅ Funzionalità PWA

- **Service Worker Avanzato** (`public/sw.js`) con strategie di caching multiple
- **Manifest.json** completo con shortcuts e configurazioni moderne
- **Supporto Offline** con fallback intelligenti
- **Precache delle Risorse Critiche** per performance ottimali
- **Background Sync** per operazioni offline
- **Push Notifications** (configurabile)
- **Install Prompt** automatico
- **Aggiornamenti Automatici** con notifiche

### 🔧 File PWA Generati

- `public/manifest.json` - Configurazione PWA con shortcuts e metadati
- `public/sw.js` - Service Worker con caching intelligente
- `src/composables/useServiceWorker.ts` - Composable per gestione PWA
- `src/components/ui/PWAStatus.vue` - Componente per monitoraggio stato PWA

### 📋 Strategie di Caching

1. **Cache First**: Per risorse statiche (CSS, JS, immagini)
2. **Network First**: Per API e contenuti dinamici
3. **Stale While Revalidate**: Per contenuti aggiornabili in background

### 🚀 Utilizzo PWA

```typescript
// Importa il composable
import { useServiceWorker } from '@/composables/useServiceWorker'

// Usa le funzionalità PWA
const { state, installUpdate, getCacheInfo } = useServiceWorker()

// Controlla aggiornamenti
if (state.value.isUpdateAvailable) {
  await installUpdate()
}
```

📖 **Documentazione completa**: [docs/pwa-setup.md](docs/pwa-setup.md)

---

## 📁 Struttura cartelle

```
src/
├── components/
│   ├── ui/         # Componenti UI atomici e riutilizzabili (Button, Input, ecc.)
│   ├── layout/     # Componenti di layout condivisi (Header, Footer, Navigation)
│   └── sections/   # Sezioni principali delle pagine (Hero, About, Portfolio, ecc.)
├── views/          # Vue views (pagine, es. Home.vue)
├── stores/         # Store globali (Pinia)
├── data/           # Dati statici, localizzazione (i18n), costanti
├── assets/
│   ├── styles/     # SCSS globali, palette, variabili, mixin
│   └── images/     # Immagini e asset statici
├── composables/    # Composables Vue 3 (useServiceWorker, useTheme, ecc.)
└── router/         # Configurazione Vue Router
```

- **components/ui/**: Componenti atomici e riutilizzabili, privi di logica di business.
- **components/layout/**: Componenti di layout condivisi tra le pagine.
- **components/sections/**: Blocchi/sezioni principali delle pagine.
- **views/**: Entry point delle pagine (es. Home.vue).
- **stores/**: Store Pinia per stato globale (tema, lingua, ruoli, ecc.).
- **data/**: File di localizzazione (`i18n.ts`), dati statici, costanti.
- **composables/**: Composables Vue 3 per logica riutilizzabile (PWA, tema, performance).
- **assets/styles/**: SCSS globali, palette, variabili, mixin.
- **assets/images/**: Immagini ottimizzate (preferibilmente WebP + fallback).
- **router/**: Configurazione delle rotte dell'applicazione.

---

## Novità 2025

- **PWA**: Manifest, service worker, caching avanzato, supporto offline
- **Accessibilità**: Skip links, live region, high contrast, reduced motion, WCAG 2.2+
- **Preferenze utente**: Composable per motion, contrasto, low light, font size, color scheme
- **Performance**: Core Web Vitals monitoring, lazy loading, code splitting
- **Bento Grid & UFO Elements**: Layout e micro-animazioni trend 2025
- **Testing**: Unit (Vitest) e E2E (Cypress)

---

## Indice

- [Descrizione](#descrizione)
- [Flusso di sviluppo](#flusso-di-sviluppo)
- [Script principali](#script-principali)
- [Best practice](#best-practice)
- [Testing](#testing)
- [Licenza](#licenza)

---

## Descrizione

Portfolio personale e lead generation per Alice Mandelli, UI/UX Designer & Frontend Developer. Il progetto segue le best practice di modularità, accessibilità, performance e internazionalizzazione, con una struttura pensata per la massima manutenibilità e scalabilità.

---

## Flusso di sviluppo

1. **Aggiungi una nuova sezione**:

````

---

## ♿ Test di Accessibilità

Il progetto implementa test automatici di accessibilità che garantiscono il rispetto degli standard **WCAG 2.2 AA** con un punteggio minimo del **95%**.

### 🛠️ Strumenti

- **axe-core 4.9.3**: Test automatici su HTML statico
- **Lighthouse CI**: Test completi (accessibilità, performance, SEO)
- **GitHub Actions**: Esecuzione automatica su push/PR

### 📊 Criteri di Successo

| Categoria | Punteggio Minimo | Standard |
|-----------|------------------|----------|
| **Accessibilità** | 95% | WCAG 2.2 AA |
| Performance | 90% | Core Web Vitals |
| Best Practices | 90% | Web Standards |
| SEO | 90% | Search Optimization |

### 🚀 Esecuzione Test

```bash
# Test locale
npm run test:accessibility

# Test completi (CI)
npm run test:accessibility:ci

# Solo Lighthouse
npm run test:lighthouse
````

### 📋 Workflow CI/CD

- **Trigger**: Push su main/master, Pull Request
- **Azioni**: Build → Preview → Test axe-core → Test Lighthouse → Commento PR
- **Fallimento**: Se accessibilità < 95% (blocca deploy)

📖 **Documentazione completa**: [docs/accessibility-testing.md](docs/accessibility-testing.md)

---

## Licenza

[MIT](LICENSE)
