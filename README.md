# alice-portfolio

Portfolio/CV interattivo per **Alice Mandelli** – UI Developer & Designer

> Sviluppato con Vue 3 + TypeScript, Pinia, SCSS, i18n, Nightwatch, Vitest. Architettura moderna, manutenibile e pronta per i trend web 2025.

---

## Indice

- [Descrizione](#descrizione)
- [Struttura del progetto](#struttura-del-progetto)
- [Setup e avvio](#setup-e-avvio)
- [Flusso di sviluppo](#flusso-di-sviluppo)
- [Script principali](#script-principali)
- [Best practice](#best-practice)
- [Testing](#testing)
- [Licenza](#licenza)

---

## Descrizione

Portfolio personale e lead generation per Alice Mandelli, UI/UX Designer & Frontend Developer. Il progetto segue le best practice di modularità, accessibilità, performance e internazionalizzazione, con una struttura pensata per la massima manutenibilità e scalabilità.

---

## Struttura del progetto

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
│   ├── styles/     # SCSS globali, variabili, mixin
│   └── images/     # Immagini e asset statici
└── router/         # Configurazione Vue Router
```

- **components/ui/**: Componenti atomici e riutilizzabili, privi di logica di business.
- **components/layout/**: Componenti di layout condivisi tra le pagine.
- **components/sections/**: Blocchi/sezioni principali delle pagine.
- **views/**: Entry point delle pagine (es. Home.vue).
- **stores/**: Store Pinia per stato globale (tema, lingua, ruoli, ecc.).
- **data/**: File di localizzazione (`i18n.ts`), dati statici, costanti.
- **assets/styles/**: SCSS globali, palette, variabili, mixin.
- **assets/images/**: Immagini ottimizzate (preferibilmente WebP + fallback).
- **router/**: Configurazione delle rotte dell'applicazione.

---

## Setup e avvio

### Prerequisiti

- Node.js >= 18
- npm >= 9

### Installazione

```sh
npm install
```

### Avvio sviluppo

```sh
npm run dev
```

### Build produzione

```sh
npm run build
```

---

## Flusso di sviluppo

1. **Aggiungi una nuova sezione**:
   - Crea il componente in `components/sections/`
   - Aggiungi logica e stili dedicati
   - Inserisci la sezione nella view corrispondente (`views/Home.vue`, ecc.)
2. **Aggiungi una nuova lingua**:
   - Aggiorna `src/data/i18n.ts` con le nuove chiavi
   - Aggiorna lo store Pinia se necessario
3. **Aggiungi un nuovo componente UI**:
   - Crea il file in `components/ui/`
   - Scrivi test unitari in `src/components/ui/__tests__/`

---

## Script principali

- `npm run dev` – Avvia lo sviluppo con hot reload
- `npm run build` – Build di produzione
- `npm run test:unit` – Test unitari (Vitest)
- `npm run test:e2e` – Test end-to-end (Nightwatch)
- `npm run lint` – Linting ESLint + Prettier
- `npm run format` – Formattazione Prettier

---

## Best practice

- **Modularità**: Ogni componente ha una responsabilità chiara e isolata.
- **Separation of Concerns**: Layout, UI, sezioni e logica sono separati.
- **Internazionalizzazione**: Gestita tramite `vue-i18n` e store Pinia.
- **Dark/Light Mode**: Gestita globalmente, con animazioni e persistenza.
- **SCSS moderno**: Palette e variabili centralizzate, uso di `@use`.
- **Testing**: Unit test (Vitest) e E2E (Nightwatch).
- **Linting & Formatting**: ESLint, Prettier, EditorConfig già configurati.
- **Performance**: Lazy loading, code splitting, ottimizzazione immagini.
- **Accessibilità**: Focus visibili, aria-label, WCAG 2.1 AA.

---

## Testing

### Unit Test (Vitest)

```sh
npm run test:unit
```

### End-to-End Test (Nightwatch)

```sh
npm run test:e2e
```

- **Test E2E (Nightwatch)**: la configurazione Nightwatch è isolata e non influisce sul type-check della app principale (vedi tsconfig.json).

> **Nota:** La reference a `nightwatch/tsconfig.json` è stata rimossa da `tsconfig.json` per mantenere la build della app pulita. I test E2E restano eseguibili separatamente.

---

## Licenza

MIT

---

> Documentazione aggiornata secondo le [best practice internazionali](https://www.freecodecamp.org/news/how-to-write-a-good-readme-file/) e [trend architetturali 2025](https://medium.com/@cleverzone/structuring-project-like-a-pro-264cd1124461).
