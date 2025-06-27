# Composables

Questo modulo contiene composables Vue 3 riutilizzabili per la gestione dello stato e della logica di business.

## useMeta

Composable per gestire i meta tag SEO in modo dinamico. Supporta title, description, Open Graph, Twitter Cards e altri meta tag.

### Utilizzo base

```typescript
import { useMeta } from '@/composables/useMeta'

const { setPageMeta } = useMeta()

// Imposta meta tag per una pagina
setPageMeta({
  title: 'Titolo della pagina',
  description: 'Descrizione della pagina',
  keywords: 'keyword1, keyword2',
  ogTitle: 'Titolo per Open Graph',
  ogDescription: 'Descrizione per Open Graph',
  twitterTitle: 'Titolo per Twitter',
  twitterDescription: 'Descrizione per Twitter',
})
```

### Meta tag per post del blog

```typescript
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

### Meta tag predefiniti per pagine specifiche

```typescript
const { setPortfolioMeta, setAboutMeta, setContactMeta } = useMeta()

// Portfolio
setPortfolioMeta()

// About
setAboutMeta()

// Contatti
setContactMeta()
```

### Funzioni disponibili

- `setMeta(config)`: Imposta meta tag personalizzati
- `setPageMeta(config)`: Imposta meta tag per una pagina con URL automatico
- `setBlogPostMeta(post)`: Imposta meta tag per un post del blog
- `setPortfolioMeta()`: Imposta meta tag per la pagina portfolio
- `setAboutMeta()`: Imposta meta tag per la pagina about
- `setContactMeta()`: Imposta meta tag per la pagina contatti
- `resetMeta()`: Resetta ai valori di default
- `setMetaTag(name, content)`: Imposta un singolo meta tag
- `setCanonicalLink(url)`: Imposta il link canonical

## Altri composables

- `useTheme`: Gestione tema chiaro/scuro
- `useBlog`: Gestione blog e post
- `usePerformance`: Monitoraggio performance
- `useScrollProgress`: Gestione scroll progress
- `useIntersectionObserver`: Intersection Observer API
- `useFocusTrap`: Focus trap per modali
- `useAccessibilityAnnouncements`: Annunci per screen reader
- `useUserPreferences`: Preferenze utente
- `useImageUpload`: Upload immagini
- `useProjectsFilter`: Filtri progetti
