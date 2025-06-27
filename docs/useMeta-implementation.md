# useMeta Composable - Documentazione Implementazione

## Panoramica

Il composable `useMeta` è stato implementato per gestire i meta tag SEO in modo dinamico nelle pagine Vue. Supporta title, description, Open Graph, Twitter Cards e altri meta tag essenziali per l'ottimizzazione SEO.

## Caratteristiche Principali

### ✅ Funzionalità Implementate

1. **Gestione Meta Tag Dinamici**

   - Title del documento
   - Meta description
   - Meta keywords
   - Meta author
   - Meta robots

2. **Open Graph Support**

   - og:title
   - og:description
   - og:image
   - og:url
   - og:type
   - og:locale
   - og:site_name

3. **Twitter Cards Support**

   - twitter:card
   - twitter:title
   - twitter:description
   - twitter:image
   - twitter:url

4. **Funzioni Specializzate**

   - `setPageMeta()` - Meta tag per pagine generiche
   - `setBlogPostMeta()` - Meta tag per post del blog
   - `setPortfolioMeta()` - Meta tag per pagina portfolio
   - `setAboutMeta()` - Meta tag per pagina about
   - `setContactMeta()` - Meta tag per pagina contatti

5. **Gestione Canonical URL**

   - Link canonical automatico
   - URL generazione basata su route

6. **Cache e Performance**
   - Cache dei meta tag esistenti
   - Gestione efficiente del DOM
   - Pulizia automatica al dismount

## Struttura del Codice

### File Principali

```
src/composables/useMeta.ts          # Composable principale
src/examples/useMeta-example.vue     # Esempio di utilizzo
tests/unit/useMeta.test.ts          # Test unitari
docs/useMeta-implementation.md      # Documentazione
```

### Interfacce TypeScript

```typescript
interface MetaConfig {
  title?: string
  description?: string
  keywords?: string
  author?: string
  robots?: string
  ogType?: string
  ogUrl?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogImageWidth?: number
  ogImageHeight?: number
  ogLocale?: string
  ogSiteName?: string
  twitterCard?: string
  twitterUrl?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  canonical?: string
}
```

## Utilizzo nelle Pagine

### Home Page

```typescript
import { useMeta } from '@/composables/useMeta'

const { setPageMeta } = useMeta()

setPageMeta({
  title: 'Alice Mandelli - UI Developer & AI Strategist | Portfolio 2025',
  description:
    'UI Developer e AI Strategist specializzata in esperienze digitali intuitive e intelligenti.',
  keywords: 'UI Developer, UI Designer, AI Strategist, Vue.js, Design Systems',
  ogTitle: 'Alice Mandelli - UI Developer & AI Strategist',
  ogDescription: 'Trasformo idee in esperienze digitali con focus su UI/UX e soluzioni AI.',
})
```

### Blog Post

```typescript
import { useMeta } from '@/composables/useMeta'

const { setBlogPostMeta } = useMeta()

setBlogPostMeta({
  title: 'Titolo del post',
  description: 'Descrizione del post',
  image: 'https://example.com/image.jpg',
  author: 'Alice Mandelli',
  publishedAt: '2025-01-15',
  tags: ['Vue.js', 'Design Systems'],
})
```

### Pagine Predefinite

```typescript
const { setPortfolioMeta, setAboutMeta, setContactMeta } = useMeta()

// Portfolio
setPortfolioMeta()

// About
setAboutMeta()

// Contact
setContactMeta()
```

## Configurazione di Default

Il composable include una configurazione di default completa:

```typescript
const DEFAULT_META: MetaConfig = {
  title: 'Alice Mandelli - UI Developer & AI Strategist | Portfolio 2025',
  description:
    'UI Developer e AI Strategist specializzata in esperienze digitali intuitive e intelligenti.',
  keywords:
    'UI Developer, UI Designer, AI Strategist, UX Designer, Frontend Developer, Vue.js, Design Systems, Artificial Intelligence, User Experience, Interface Design, Alice Mandelli',
  author: 'Alice Mandelli',
  robots: 'index, follow, max-image-preview:large',
  ogType: 'website',
  ogUrl: 'https://alys5.eu/',
  ogTitle: 'Alice Mandelli - UI Developer & AI Strategist',
  ogDescription: 'Trasformo idee in esperienze digitali con focus su UI/UX e soluzioni AI.',
  ogImage: 'https://alys5.eu/og-image.jpg',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogLocale: 'it_IT',
  ogSiteName: 'Alice Mandelli Portfolio',
  twitterCard: 'summary_large_image',
  twitterUrl: 'https://alys5.eu/',
  twitterTitle: 'Alice Mandelli - UI Developer & AI Strategist',
  twitterDescription: 'Trasformo idee in esperienze digitali con focus su UI/UX e soluzioni AI.',
  twitterImage: 'https://alys5.eu/twitter-image.jpg',
}
```

## Funzioni Disponibili

### Funzioni Principali

| Funzione                | Descrizione                                    | Parametri             |
| ----------------------- | ---------------------------------------------- | --------------------- |
| `setMeta(config)`       | Imposta meta tag personalizzati                | `Partial<MetaConfig>` |
| `setPageMeta(config)`   | Imposta meta tag per pagina con URL automatico | `Partial<MetaConfig>` |
| `setBlogPostMeta(post)` | Imposta meta tag per post del blog             | `BlogPost`            |
| `setPortfolioMeta()`    | Imposta meta tag per portfolio                 | Nessuno               |
| `setAboutMeta()`        | Imposta meta tag per about                     | Nessuno               |
| `setContactMeta()`      | Imposta meta tag per contatti                  | Nessuno               |
| `resetMeta()`           | Resetta ai valori di default                   | Nessuno               |

### Funzioni Utility

| Funzione                    | Descrizione                 | Parametri         |
| --------------------------- | --------------------------- | ----------------- |
| `setMetaTag(name, content)` | Imposta un singolo meta tag | `string, string?` |
| `setCanonicalLink(url)`     | Imposta il link canonical   | `string`          |

## Integrazione con Vue Router

Il composable si integra automaticamente con Vue Router per:

- Generazione automatica degli URL per og:url e twitter:url
- Gestione dei parametri di route per post del blog
- Canonical URL basati sulla route corrente

## Gestione degli Errori

Il composable include gestione robusta degli errori:

- Controllo dell'esistenza dei meta tag prima della modifica
- Creazione automatica di meta tag mancanti
- Gestione di valori undefined/null
- Cache per evitare query DOM ripetute

## Performance

Ottimizzazioni implementate:

- **Cache dei meta tag**: Evita query DOM ripetute
- **Gestione efficiente**: Solo aggiornamenti necessari
- **Cleanup automatico**: Pulizia della cache al dismount
- **Lazy creation**: Creazione meta tag solo quando necessario

## Test Coverage

Test unitari implementati per:

- ✅ Inizializzazione con valori di default
- ✅ Impostazione title del documento
- ✅ Meta tag standard (description, keywords, author, robots)
- ✅ Meta tag Open Graph
- ✅ Meta tag Twitter
- ✅ Link canonical
- ✅ Generazione URL automatici
- ✅ Meta tag per post del blog
- ✅ Reset ai valori di default
- ✅ Gestione valori vuoti

## Esempi di Utilizzo Avanzato

### Meta Tag Dinamici per E-commerce

```typescript
const { setPageMeta } = useMeta()

// Per una pagina prodotto
setPageMeta({
  title: `${product.name} | ${product.brand}`,
  description: product.description,
  ogType: 'product',
  ogImage: product.images[0],
  ogTitle: product.name,
  ogDescription: product.description,
})
```

### Meta Tag per Pagine di Ricerca

```typescript
const { setPageMeta } = useMeta()

// Per una pagina di ricerca
setPageMeta({
  title: `Risultati per "${searchQuery}" | Blog`,
  description: `Risultati della ricerca per "${searchQuery}" nel blog di Alice Mandelli`,
  robots: 'noindex, follow', // Non indicizzare pagine di ricerca
  ogTitle: `Risultati per "${searchQuery}"`,
  ogDescription: `Risultati della ricerca per "${searchQuery}"`,
})
```

## Best Practices Implementate

1. **SEO Best Practices**

   - Title unici per ogni pagina
   - Description ottimizzate (150-160 caratteri)
   - Keywords rilevanti
   - Open Graph completi
   - Twitter Cards ottimizzate

2. **Accessibilità**

   - Meta tag robots appropriati
   - Canonical URL per evitare contenuto duplicato
   - Locale specificato (it_IT)

3. **Performance**

   - Cache efficiente
   - Cleanup automatico
   - Gestione DOM ottimizzata

4. **Manutenibilità**
   - TypeScript completo
   - Interfacce ben definite
   - Documentazione dettagliata
   - Test coverage completo

## Prossimi Sviluppi

Possibili miglioramenti futuri:

- [ ] Supporto per JSON-LD structured data
- [ ] Meta tag per pagine AMP
- [ ] Integrazione con analytics
- [ ] Meta tag per pagine di errore
- [ ] Supporto per meta tag personalizzati
- [ ] Cache persistente tra navigazioni
- [ ] Validazione automatica dei meta tag

## Conclusione

Il composable `useMeta` fornisce una soluzione completa e robusta per la gestione dei meta tag SEO in Vue 3. Con la sua API intuitiva, gestione automatica degli URL e supporto completo per Open Graph e Twitter Cards, migliora significativamente l'ottimizzazione SEO del portfolio di Alice Mandelli.
