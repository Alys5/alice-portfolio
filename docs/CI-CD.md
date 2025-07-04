# 🚀 CI/CD Pipeline - Alice Mandelli Portfolio

Sistema completo di Continuous Integration/Continuous Deployment per il portfolio di Alice Mandelli, che automatizza linting, build, commit, push e deploy su Vercel.

## ⚡ Quick Start

```bash
# 1. Installa dipendenze CI/CD
npm install

# 2. Configura Vercel (prima volta)
npx vercel login
npx vercel

# 3. Esegui pipeline completa
./ci-cd.sh
```

## 🏗️ Architettura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Local Dev     │    │  GitHub Actions │    │     Vercel      │
│                 │    │                 │    │                 │
│ • Pre-commit    │───▶│ • Test & Lint   │───▶│ • Auto Deploy   │
│ • Lint-staged   │    │ • Build         │    │ • Production    │
│ • Husky Hooks   │    │ • Deploy        │    │ • CDN           │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Struttura File

```
├── ci-cd.sh                    # Script principale CI/CD
├── .github/workflows/
│   ├── cicd.yml               # Workflow GitHub Actions
│   └── performance.yml        # Analisi performance
├── .husky/pre-commit          # Pre-commit hook
├── vercel.json                # Configurazione Vercel
├── lighthouserc.json          # Configurazione Lighthouse
└── docs/CI-CD-SETUP.md        # Documentazione completa
```

## 🔧 Configurazione

### 1. Variabili d'Ambiente

```bash
# Locale
export VERCEL_TOKEN=vercel_xxxxxxxxxxxxxxxxxxxx

# GitHub Secrets (da configurare)
VERCEL_TOKEN=vercel_xxxxxxxxxxxxxxxxxxxx
VERCEL_ORG_ID=team_xxxxxxxxxxxxxxxxxxxx
VERCEL_PROJECT_ID=prj_xxxxxxxxxxxxxxxxxxxx
```

### 2. GitHub Secrets

Aggiungi questi secrets nel repository GitHub:

- `VERCEL_TOKEN`: Token Vercel per deploy
- `VERCEL_ORG_ID`: ID organizzazione Vercel
- `VERCEL_PROJECT_ID`: ID progetto Vercel

### 3. Branch Protection

Abilita branch protection su `main`:

- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Include administrators

## 🚀 Utilizzo

### Pipeline Locale

```bash
# Pipeline completa
./ci-cd.sh

# Solo linting
npm run lint:fix

# Solo build
npm run ci:build

# Solo deploy
npm run ci:deploy
```

### Pipeline Automatica

Il sistema si attiva automaticamente su:

- **Push** su branch `main`
- **Pull Request** su `main`
- **Schedule** giornaliero (18:00 CET)
- **Trigger manuale** da GitHub Actions

### Pre-commit Hook

Linting automatico prima di ogni commit:

```bash
git add .
git commit -m "feat: new feature"
# ESLint e TypeScript check automatici
```

## 📊 Monitoraggio

### GitHub Actions Dashboard

- 📈 Log dettagliati per ogni step
- 📊 Analisi performance
- 🔍 Debugging avanzato

### Vercel Dashboard

- 🚀 Status deploy
- 📈 Analytics
- 🔧 Environment variables

### Performance Monitoring

- ⚡ Core Web Vitals
- 📦 Bundle analysis
- 🎯 Lighthouse scores

## 🛠️ Script Disponibili

```bash
# Development
npm run dev              # Server di sviluppo
npm run build            # Build di produzione
npm run preview          # Preview build

# Linting
npm run lint             # ESLint con fix
npm run lint:check       # Solo check
npm run lint:fix         # Solo fix

# CI/CD
npm run ci:test          # Test per CI
npm run ci:build         # Build per CI
npm run ci:deploy        # Deploy su Vercel

# TypeScript
npm run type-check       # Verifica TypeScript
```

## 🔍 Troubleshooting

### Errori Comuni

1. **VERCEL_TOKEN non impostato**

   ```bash
   export VERCEL_TOKEN=tuo_token
   ```

2. **ESLint fallisce**

   ```bash
   npm run lint:fix
   # Correggi errori manualmente
   ```

3. **Build fallisce**

   ```bash
   npm run ci:build
   # Controlla log TypeScript
   ```

4. **Deploy fallisce**
   ```bash
   npx vercel --debug
   # Verifica configurazione
   ```

### Debug

```bash
# Modalità debug
VERCEL_TOKEN=xxx DEBUG=1 ./ci-cd.sh

# Log dettagliati GitHub Actions
# Abilita debug logging nelle Actions
```

## 📈 Performance

### Ottimizzazioni Implementate

- ✅ **Bundle splitting** automatico
- ✅ **Tree shaking** con Vite
- ✅ **Compressione** Gzip
- ✅ **Cache** ottimizzato
- ✅ **Preload** risorse critiche

### Core Web Vitals Target

- 🎯 **LCP**: < 2.5s
- 🎯 **FID**: < 100ms
- 🎯 **CLS**: < 0.1
- 🎯 **TTFB**: < 600ms

## 🔒 Sicurezza

### Headers Configurati

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

### Secrets Management

- 🔐 **GitHub Secrets** per token sensibili
- 🔐 **Vercel Environment Variables** per configurazioni
- 🔐 **Local .env** per sviluppo

## 📚 Documentazione

- 📖 [Setup Completo](docs/CI-CD-SETUP.md)
- 📖 [Configurazione Vercel](https://vercel.com/docs)
- 📖 [GitHub Actions](https://docs.github.com/en/actions)
- 📖 [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

## 🤝 Contribuire

1. Fork il repository
2. Crea un branch feature
3. Committa le modifiche
4. Push al branch
5. Crea una Pull Request

## 📞 Supporto

Per problemi o domande:

1. Controlla i log GitHub Actions
2. Verifica configurazione Vercel
3. Consulta documentazione
4. Contatta team di sviluppo

---

**Autore**: Alice Mandelli Portfolio System  
**Versione**: 1.0.0  
**Ultimo aggiornamento**: $(date +'%d/%m/%Y')

## 🎉 Status

![CI/CD Pipeline](https://github.com/username/alice-portfolio/workflows/CI/CD%20Pipeline/badge.svg)
![Performance](https://github.com/username/alice-portfolio/workflows/Performance%20Analysis/badge.svg)
![Lighthouse](https://img.shields.io/badge/Lighthouse-95%2B-brightgreen)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-blue)
