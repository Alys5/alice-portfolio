# Setup - Alice Mandelli Portfolio

## Prerequisiti

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Git** per versioning

## Installazione

### 1. Clona il Repository

```bash
git clone [repository-url]
cd alice-portfolio
```

### 2. Installa Dipendenze

```bash
npm install
```

### 3. Configurazione Ambiente

Copia il file di esempio delle variabili d'ambiente:

```bash
cp .env.example .env.local
```

### 4. Avvia Sviluppo

```bash
npm run dev
```

Il progetto sarà disponibile su `http://localhost:5173`

## Configurazione IDE

### VSCode (Consigliato)

Installare le seguenti estensioni:

- **Volar** - Vue 3 support
- **TypeScript Vue Plugin** - TypeScript per Vue
- **Prettier** - Formattazione codice
- **ESLint** - Linting
- **Auto Rename Tag** - Auto-rename HTML tags
- **Bracket Pair Colorizer** - Evidenziazione parentesi

### Configurazione VSCode

Crea `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "vue.codeActions.enabled": true
}
```

## Struttura Progetto

```
alice-portfolio/
├── docs/                    # Documentazione
├── public/                  # Asset pubblici
├── src/
│   ├── assets/             # Asset statici
│   ├── components/         # Componenti Vue
│   │   ├── examples/       # Esempi componenti
│   ├── composables/        # Composables Vue
│   ├── i18n/              # Internazionalizzazione
│   ├── router/            # Vue Router
│   ├── styles/            # Stili SCSS
│   └── views/             # Pagine Vue
├── .husky/                 # Git hooks
├── .github/workflows/      # GitHub Actions
└── [file di configurazione]
```

## Variabili d'Ambiente

### Sviluppo (.env.local)

```env
VITE_APP_TITLE=Alice Mandelli Portfolio
VITE_APP_DESCRIPTION=Portfolio professionale moderno
VITE_MAINTENANCE_MODE=false
```

### Produzione

```env
VITE_APP_TITLE=Alice Mandelli Portfolio
VITE_APP_DESCRIPTION=Portfolio professionale moderno
VITE_MAINTENANCE_MODE=false
NODE_ENV=production
```

## Comandi Utili

### Sviluppo

```bash
npm run dev          # Avvia server sviluppo
npm run build        # Build produzione
npm run preview      # Preview build
```

### Qualità Codice

```bash
npm run lint         # Linting con fix
npm run lint:check   # Solo controllo lint
npm run type-check   # Verifica TypeScript
```

### Deploy

```bash
npm run deploy:normal      # Deploy normale
npm run deploy:maintenance # Deploy manutenzione
```

## Troubleshooting

### Problemi Comuni

#### Errori di Build

```bash
# Pulisci cache
npm run clean

# Reinstalla dipendenze
rm -rf node_modules package-lock.json
npm install
```

#### Errori TypeScript

```bash
# Verifica configurazione
npm run type-check

# Ricompila TypeScript
rm -rf node_modules/.vite
npm run dev
```

#### Errori ESLint

```bash
# Fix automatico
npm run lint:fix

# Verifica regole
npm run lint:check
```

### Performance

#### Ottimizzazione Build

```bash
# Analizza bundle
npm run build -- --analyze

# Build ottimizzato
npm run build-only
```

#### Core Web Vitals

- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1
- **TTFB**: < 600ms

## Supporto

Per problemi o domande:

1. Controlla la [documentazione](README.md)
2. Verifica [issues](https://github.com/username/repo/issues)
3. Crea nuova issue con dettagli completi

## Contribuire

Vedi [CONTRIBUTING.md](CONTRIBUTING.md) per linee guida dettagliate.
