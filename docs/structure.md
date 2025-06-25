# Documentazione Struttura e Convenzioni – alice-portfolio

## Indice

- [Panoramica](#panoramica)
- [Struttura delle cartelle](#struttura-delle-cartelle)
- [Naming e convenzioni](#naming-e-convenzioni)
- [Esempi di codice commentato](#esempi-di-codice-commentato)
- [Linee guida per la manutenibilità](#linee-guida-per-la-manutenibilità)
- [Best practice di documentazione](#best-practice-di-documentazione)

---

## Panoramica

Questo documento descrive la struttura, le convenzioni e le best practice adottate nel progetto **alice-portfolio** per garantire chiarezza, scalabilità e facilità di manutenzione.

---

## Struttura delle cartelle

```
src/
├── components/
│   ├── ui/         # Componenti UI atomici e riutilizzabili (es. BaseButton.vue)
│   ├── layout/     # Layout condivisi (header, footer, navigation)
│   └── sections/   # Sezioni di pagina (Hero, About, Portfolio, ecc.)
├── views/          # Vue views (pagine, es. Home.vue)
├── stores/         # Store globali (Pinia)
├── data/           # Dati statici, localizzazione (i18n), costanti
├── assets/
│   ├── styles/     # SCSS globali, variabili, mixin
│   └── images/     # Immagini e asset statici
└── router/         # Configurazione Vue Router
```

### Dettaglio cartelle

- **components/ui/**: Componenti atomici, senza logica di business, altamente riutilizzabili.
- **components/layout/**: Header, Footer, Navigation e altri layout condivisi.
- **components/sections/**: Blocchi/sezioni principali delle pagine (Hero, About, Portfolio, ecc.).
- **views/**: Entry point delle pagine, compongono le sezioni.
- **stores/**: Stato globale (tema, lingua, ruoli, ecc.) tramite Pinia.
- **data/**: File di localizzazione (`i18n.ts`), dati statici, costanti.
- **assets/styles/**: SCSS globali, palette, variabili, mixin. Importa sempre le variabili con `@use`.
- **assets/images/**: Immagini ottimizzate (WebP + fallback).
- **router/**: Configurazione delle rotte dell'applicazione.
- **nightwatch/**: configurazione e test E2E isolati. La reference a `nightwatch/tsconfig.json` è rimossa da `tsconfig.json` per evitare errori di type-check nella build principale.

---

## Naming e convenzioni

- **Componenti Vue**: PascalCase (`HeroSection.vue`, `AppHeader.vue`)
- **File JS/TS**: camelCase o kebab-case per utility/helper
- **Store Pinia**: `useMainStore`, `usePortfolioStore`
- **SCSS**: variabili e mixin in snake-case o kebab-case
- **Test**: `__tests__` per unit test, `tests/e2e/` per E2E

---

## Esempi di codice commentato

### Esempio: componente Vue

```vue
<script setup lang="ts">
// Importa Pinia store per gestire tema e lingua
defineProps<{ msg: string }>()
import { useMainStore } from '@/stores/main'
const mainStore = useMainStore()

// Funzione per cambiare tema (dark/light)
function toggleTheme() {
  mainStore.toggleTheme()
}
</script>
```

### Esempio: funzione TypeScript

```ts
/**
 * Restituisce la lista dei ruoli in base alla lingua selezionata
 * @param locale 'it' | 'en'
 * @returns string[]
 */
function getRoles(locale: 'it' | 'en'): string[] {
  return rolesByLocale[locale]
}
```

### Esempio: SCSS

```scss
// Variabile per colore primario brand
$color-primary: #ffc940;
```

---

## Linee guida per la manutenibilità

- **Commenta funzioni, props e logica complessa** (JSDoc o commenti inline)
- **Evita duplicazione di codice**: estrai utility e componenti riutilizzabili
- **Mantieni le dipendenze aggiornate**
- **Aggiorna la documentazione ad ogni feature/refactor**
- **Usa nomi chiari e consistenti**
- **Scrivi test per ogni componente/feature**
- **Segui le convenzioni di linting e formattazione**
- **Isolamento E2E**: I test Nightwatch sono separati e la loro configurazione non impatta la build della app (vedi tsconfig.json).

---

## Best practice di documentazione

- **README.md**: sempre aggiornato, con struttura, setup, script e flusso di sviluppo
- **Commenti JSDoc** per funzioni, store, utility
- **Commenti inline** solo dove necessario per chiarire logica non ovvia
- **Documenta le props dei componenti**
- **Aggiorna i commenti quando cambi il codice**

---

> Una buona documentazione e commenti chiari sono fondamentali per la manutenibilità e la collaborazione nel tempo. Segui queste linee guida per mantenere il progetto scalabile e accessibile a tutti i dev.
