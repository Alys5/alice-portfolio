import MarkdownIt from 'markdown-it'
import matter from 'gray-matter'

// Configurazione markdown-it con plugin comuni
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
})

// Plugin per highlight del codice (opzionale)
// md.use(require('markdown-it-highlightjs'))

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  author: string
  tags: string[]
  image?: string
  content: string
  excerpt: string
}

export interface BlogPostMeta {
  slug: string
  title: string
  description: string
  date: string
  author: string
  tags: string[]
  image?: string
}

/**
 * Processa un file markdown e restituisce i metadati e il contenuto
 */
export function processMarkdown(fileContent: string, slug: string): BlogPost {
  const { data, content } = matter(fileContent)

  // Valida i metadati richiesti
  if (!data.title || !data.description || !data.date || !data.author) {
    throw new Error(`Post ${slug} manca di metadati richiesti`)
  }

  // Genera excerpt dal contenuto (primi 200 caratteri)
  const excerpt =
    content
      .replace(/[#*`]/g, '') // Rimuovi markdown
      .replace(/\n/g, ' ') // Sostituisci newline con spazi
      .trim()
      .substring(0, 200) + (content.length > 200 ? '...' : '')

  // Processa il contenuto markdown in HTML
  const htmlContent = md.render(content)

  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    author: data.author,
    tags: data.tags || [],
    image: data.image,
    content: htmlContent,
    excerpt,
  }
}

/**
 * Estrae solo i metadati da un file markdown
 */
export function extractMeta(fileContent: string, slug: string): BlogPostMeta {
  const { data } = matter(fileContent)

  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    author: data.author,
    tags: data.tags || [],
    image: data.image,
  }
}

/**
 * Formatta una data per la visualizzazione
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Genera slug da titolo
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Rimuovi caratteri speciali
    .replace(/\s+/g, '-') // Sostituisci spazi con trattini
    .replace(/-+/g, '-') // Rimuovi trattini multipli
    .trim()
}
