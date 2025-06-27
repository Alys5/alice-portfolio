# Test di Accessibilità - Documentazione

## Panoramica

Questo progetto implementa test automatici di accessibilità che garantiscono il rispetto degli standard WCAG 2.2 AA con un punteggio minimo del 95%.

## Strumenti Utilizzati

### 1. axe-core

- **Versione**: 4.9.3
- **Scopo**: Test automatici di accessibilità su HTML statico
- **Configurazione**: WCAG 2.2 AA compliance
- **Soglia**: Punteggio ≥ 95%

### 2. Lighthouse CI

- **Versione**: Latest
- **Scopo**: Test completi di accessibilità, performance, best practices e SEO
- **Configurazione**: Desktop, 3 runs per pagina
- **Soglia**: Accessibilità ≥ 95%, altri ≥ 90%

## Configurazione

### Script NPM

```bash
# Test axe-core su build statico
npm run test:accessibility

# Test Lighthouse CI
npm run test:lighthouse

# Test completi (CI)
npm run test:accessibility:ci
```

### Configurazione Lighthouse CI

File: `lighthouserc.js`

```javascript
// Soglie di accessibilità
'categories:accessibility': ['error', { minScore: 0.95 }]

// Regole specifiche WCAG 2.2
'accessibility/color-contrast': 'warn',
'accessibility/document-title': 'error',
'accessibility/html-has-lang': 'error',
// ... altre regole
```

## Workflow CI/CD

### GitHub Actions

- **File**: `.github/workflows/accessibility-tests.yml`
- **Trigger**: Push su main/master, Pull Request
- **Azioni**:
  1. Build dell'applicazione
  2. Avvio server preview
  3. Test axe-core
  4. Test Lighthouse CI
  5. Commento automatico su PR
  6. Fallimento se accessibilità < 95%

### Integrazione Build

- **File**: `.github/workflows/build-deploy.yml`
- **Posizione**: Dopo build, prima deploy
- **Blocca deploy** se test falliscono

## Pagine Testate

1. **Home** (`/`) - Pagina principale
2. **Blog** (`/blog`) - Sezione blog
3. **Portfolio** (`/portfolio`) - Progetti
4. **Contact** (`/contact`) - Contatti

## Criteri di Successo

### Accessibilità (WCAG 2.2 AA)

- **Punteggio minimo**: 95%
- **Regole critiche**:
  - Contrasto colori ≥ 4.5:1
  - Navigazione tastiera completa
  - Screen reader support
  - Focus management
  - ARIA labels corretti

### Performance

- **Punteggio minimo**: 90%
- **Metriche**:
  - LCP < 2.5s
  - CLS < 0.1
  - INP < 200ms

### Best Practices

- **Punteggio minimo**: 90%
- **Criteri**:
  - HTTPS obbligatorio
  - No document.write
  - Event listeners passivi
  - Meta tags corretti

### SEO

- **Punteggio minimo**: 90%
- **Criteri**:
  - Meta description
  - Alt text immagini
  - Heading structure
  - Link text descrittivo

## Risoluzione Problemi

### Errori Comuni

#### 1. Contrasto Colori

```css
/* ❌ Contrasto insufficiente */
.text {
  color: #666;
  background: #fff;
}

/* ✅ Contrasto WCAG AA */
.text {
  color: #595959;
  background: #fff;
}
```

#### 2. Focus Indicator

```css
/* ❌ Focus non visibile */
.button:focus {
  outline: none;
}

/* ✅ Focus visibile */
.button:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
```

#### 3. Alt Text Mancante

```html
<!-- ❌ Immagine senza alt -->
<img src="hero.jpg" />

<!-- ✅ Alt text descrittivo -->
<img src="hero.jpg" alt="Alice Mandelli - Web Designer UI/UX" />
```

#### 4. Heading Structure

```html
<!-- ❌ Struttura heading saltata -->
<h1>Title</h1>
<h3>Subtitle</h3>

<!-- ✅ Struttura sequenziale -->
<h1>Title</h1>
<h2>Subtitle</h2>
```

### Debug Locale

#### Test axe-core

```bash
# Build e test
npm run build
npm run test:accessibility
```

#### Test Lighthouse

```bash
# Install Lighthouse CI
npm install -g @lhci/cli

# Test locale
lhci autorun
```

## Monitoraggio

### Dashboard Lighthouse

- **URL**: https://googlechrome.github.io/lighthouse-ci/viewer/
- **Funzionalità**: Storico test, trend, confronti

### GitHub Actions

- **Logs**: Disponibili in Actions tab
- **Artifacts**: Risultati scaricabili
- **Comments**: Automatici su PR

## Best Practices Sviluppo

### 1. Test Continuo

```bash
# Durante sviluppo
npm run dev
# Test manuali con browser dev tools
```

### 2. Pre-commit

```bash
# Prima del commit
npm run test:accessibility
```

### 3. Code Review

- Controllare commenti automatici su PR
- Verificare screenshot Lighthouse
- Testare con screen reader

### 4. Strumenti Browser

- **Chrome DevTools**: Lighthouse tab
- **Firefox**: Accessibility panel
- **Safari**: Web Inspector

## Risorse

### Documentazione

- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [axe-core Documentation](https://dequeuniversity.com/rules/axe/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

### Strumenti

- [axe DevTools](https://www.deque.com/axe/browser-extensions/)
- [WAVE](https://wave.webaim.org/)
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)

### Testing

- [NVDA](https://www.nvaccess.org/) (Windows)
- [VoiceOver](https://www.apple.com/accessibility/vision/) (macOS)
- [JAWS](https://www.freedomscientific.com/products/software/jaws/) (Windows)

## Contatti

Per problemi o domande sui test di accessibilità:

- **Issues**: GitHub repository
- **Documentazione**: `/docs/accessibility-testing.md`
- **Configurazione**: `lighthouserc.js`, `scripts/axe-test.js`
