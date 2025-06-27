---
layout: home
hero:
  name: Alice Portfolio
  text: Documentazione Tecnica
  tagline: Portfolio moderno con Vue 3, TypeScript e design system accessibile
  actions:
    - theme: brand
      text: Inizia
      link: /components/
    - theme: alt
      text: Composables
      link: /composables/
    - theme: alt
      text: Guide
      link: /guides/

features:
  - icon: 🎨
    title: Design System Moderno
    details: Componenti UI riutilizzabili con supporto per temi, animazioni e accessibilità WCAG 2.2+
  - icon: ⚡
    title: Performance Ottimizzate
    details: Core Web Vitals, lazy loading, code splitting e PWA con service worker
  - icon: ♿
    title: Accessibilità Completa
    details: Screen reader support, navigazione tastiera, reduced motion e high contrast
  - icon: 🔧
    title: TypeScript First
    details: Type safety completo con composables tipizzati e contract validation
  - icon: 🌍
    title: Internazionalizzazione
    details: Supporto multi-lingua con Vue I18n e gestione dinamica delle traduzioni
  - icon: 🧪
    title: Testing Completo
    details: Unit tests con Vitest, E2E con Cypress e test di accessibilità automatici
---

## 🚀 Quick Start

```bash
# Installa dipendenze
npm install

# Avvia sviluppo
npm run dev

# Genera documentazione
npm run docs:generate

# Avvia docs
npm run docs:dev
```

## 📚 Struttura Progetto

```
src/
├── components/          # Componenti Vue
│   ├── ui/             # Componenti UI atomici
│   ├── layout/         # Componenti di layout
│   └── sections/       # Sezioni della pagina
├── composables/        # Composables Vue 3
├── stores/            # Store Pinia
├── pages/             # Pagine dell'applicazione
├── assets/            # Risorse statiche
└── data/              # Dati e traduzioni
```

## 🎯 Caratteristiche Principali

### Componenti UI

- **ModernButton**: Pulsante con varianti, effetti magnetici e ripple
- **ModernCard**: Card con animazioni scroll-triggered e UFO elements
- **VMarkdownEditor**: Editor markdown completo con preview
- **ContactForm**: Form accessibile con validazione e annunci screen reader

### Composables

- **useTheme**: Gestione temi con transizioni fluide
- **usePerformance**: Monitoraggio Core Web Vitals
- **useAccessibilityAnnouncements**: Annunci per screen reader
- **useIntersectionObserver**: Animazioni scroll-triggered

### Accessibilità

- ✅ Navigazione tastiera completa
- ✅ Screen reader support (NVDA, VoiceOver)
- ✅ Reduced motion support
- ✅ High contrast mode
- ✅ Focus management
- ✅ ARIA labels e live regions

### Performance

- 🚀 LCP < 2.5s
- 🎯 CLS < 0.1
- ⚡ INP < 200ms
- 📱 PWA con offline support
- 🔄 Code splitting automatico

## 🔗 Link Utili

- [Componenti UI](/components/)
- [Composables](/composables/)
- [Guide](/guides/)
- [GitHub Repository](https://github.com/alicemandelli/portfolio)
- [Demo Live](https://alicemandelli.dev)

---

<div class="vp-raw">
  <div class="demo-container">
    <h3>Demo Interattiva</h3>
    <p>Esplora i componenti direttamente nella documentazione!</p>
  </div>
</div>
