# Sistema Blog

Questo sistema gestisce i post del blog utilizzando file markdown con frontmatter.

## Struttura

```
src/content/blog/
├── README.md (questa documentazione)
├── benvenuto-nel-mio-blog.md
├── design-system-moderni.md
└── [altri-post].md
```

## Formato dei Post

Ogni post deve avere:

### Frontmatter (obbligatorio)

```yaml
---
title: 'Titolo del post'
description: 'Breve descrizione del post'
date: 'YYYY-MM-DD'
author: 'Nome Autore'
tags: ['tag1', 'tag2', 'tag3']
image: '/path/to/image.jpg' # opzionale
---
```

### Contenuto

Il contenuto del post va scritto in markdown standard.

## Funzionalità

- **Caricamento dinamico**: I post vengono caricati automaticamente dalla directory
- **Ricerca**: Ricerca per titolo, descrizione e tag
- **Filtri per tag**: Filtraggio dei post per tag
- **SEO friendly**: Meta tag automatici per ogni post
- **Accessibilità**: Supporto completo per screen reader e navigazione tastiera
- **Performance**: Lazy loading delle immagini e caching dei post

## Utilizzo

### Aggiungere un nuovo post

1. Crea un nuovo file `.md` nella directory `src/content/blog/`
2. Aggiungi il frontmatter con tutti i metadati richiesti
3. Scrivi il contenuto in markdown
4. Il post apparirà automaticamente nel blog

### Esempio di post

````markdown
---
title: 'Il mio nuovo post'
description: 'Una descrizione interessante del post'
date: '2025-01-25'
author: 'Alice Mandelli'
tags: ['web-design', 'tutorial', 'vue']
image: '/images/blog/mio-post.jpg'
---

# Il mio nuovo post

Contenuto del post in markdown...

## Sezione

- Punto 1
- Punto 2

### Codice

```javascript
console.log('Hello World!')
```
````

## Conclusione

Fine del post.

```

## Routing

- `/blog` - Lista di tutti i post
- `/blog/:slug` - Singolo post (slug basato sul nome del file)

## Componenti

- `BlogPage.vue` - Pagina principale del blog
- `BlogPost.vue` - Pagina del singolo post
- `BlogCard.vue` - Card per visualizzare i post nella lista

## Composable

- `useBlog.ts` - Gestisce il caricamento e la ricerca dei post

## Stili

I post utilizzano le variabili CSS del design system per mantenere la coerenza visiva.
```
