# Alice Mandelli Portfolio

Portfolio professionale moderno con Vue 3, TypeScript e design system avanzato.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 📚 Documentazione

- [Setup](docs/SETUP.md) - Configurazione iniziale
- [Architettura](docs/ARCHITECTURE.md) - Struttura del progetto
- [Animazioni](docs/ANIMATIONS.md) - Sistema animazioni fluide
- [CI/CD](docs/CI-CD.md) - Pipeline deployment
- [Localizzazione](docs/LOCALIZATION.md) - Sistema i18n
- [Manutenzione](docs/MAINTENANCE.md) - Modalità manutenzione

## 🛠️ Script Disponibili

- `npm run dev` - Sviluppo locale
- `npm run build` - Build produzione
- `npm run preview` - Preview build
- `npm run lint` - Controllo codice
- `npm run type-check` - Verifica TypeScript
- `npm run deploy:normal` - Deploy normale
- `npm run deploy:maintenance` - Deploy manutenzione
- `npm run clean` - Pulizia cache

## 🎨 Design System

### Palette Colori Signature

- **Bright Sun** (#ffc940) - Giallo brillante, colore principale
- **Ebony Clay** (#29353f) - Grigio scuro elegante
- **Persian Blue** (#2048b4) - Blu profondo per CTA
- **Picton Blue** (#48a9f8) - Blu chiaro per accenti

### Trend 2025 Implementati

- Glassmorphism avanzato
- Bento Grid layouts
- Micro-animazioni fluide
- Dark mode con neon accents
- Scroll-triggered animations
- Magnetic hover effects

## 🏗️ Architettura

### Stack Tecnologico

- **Vue 3** - Composition API
- **TypeScript** - Type safety
- **Vite** - Build tool moderno
- **SCSS** - Styling avanzato
- **Vue Router** - Navigazione
- **Vue i18n** - Internazionalizzazione
- **GSAP** - Animazioni avanzate

### Struttura Progetto

```
src/
├── components/          # Componenti Vue
│   ├── examples/        # Esempi componenti
│   ├── layout/          # Layout components
│   ├── sections/        # Sezioni pagina
│   └── ui/             # UI components
├── composables/         # Composables Vue
├── i18n/               # Internazionalizzazione
├── router/             # Vue Router
├── styles/             # Stili SCSS
└── views/              # Pagine Vue
```

## 🚀 Deploy

### Vercel

Il progetto è configurato per deploy automatico su Vercel con:

- Build ottimizzato per produzione
- PWA support
- Service worker per cache
- Core Web Vitals ottimizzati

### Modalità Manutenzione

```bash
npm run build:maintenance
npm run deploy:maintenance
```

## 📊 Performance

### Core Web Vitals Target

- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1
- **TTFB**: < 600ms

### Ottimizzazioni Implementate

- Lazy loading componenti
- Code splitting automatico
- Image optimization
- CSS purging
- Bundle analysis

## ♿ Accessibilità

### WCAG 2.2+ Compliance

- Skip links per navigazione tastiera
- Focus management avanzato
- Screen reader support
- High contrast mode
- Reduced motion support
- Live regions per annunci dinamici

## 🌍 Internazionalizzazione

### Lingue Supportate

- 🇮🇹 Italiano (default)
- 🇬🇧 Inglese
- 🇪🇸 Spagnolo

### Gestione Traduzioni

```bash
# Aggiungi nuova chiave
t('section.subsection.key')

# Pluralizzazione
t('items', { count: 5 })
```

## 🔧 Sviluppo

### IDE Setup Consigliato

- **VSCode** + **Volar** extension
- **Prettier** per formattazione
- **ESLint** per linting
- **TypeScript** per type checking

### Git Hooks

- Pre-commit linting automatico
- Type checking prima del commit
- Formattazione automatica

## 📈 Monitoring

### Analytics Integrati

- Web Vitals tracking
- Performance monitoring
- Error tracking
- User behavior analytics

## 🤝 Contribuire

1. Fork il repository
2. Crea feature branch (`git checkout -b feature/amazing-feature`)
3. Committa le modifiche (`git commit -m 'Add amazing feature'`)
4. Push al branch (`git push origin feature/amazing-feature`)
5. Apri Pull Request

## 📄 Licenza

Questo progetto è sotto licenza MIT. Vedi [LICENSE](LICENSE) per dettagli.

---

**Creato con ❤️ per Alice Mandelli Portfolio**

### UI Developer & Designer con specializzazione AI
