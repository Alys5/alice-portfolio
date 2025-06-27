import { ref, computed, onMounted, readonly } from 'vue'
import type { BlogPost, BlogPostMeta } from '@/utils/markdown'
import { processMarkdown, extractMeta, formatDate } from '@/utils/markdown'

// Cache per i post caricati
const postsCache = ref<Map<string, BlogPost>>(new Map())
const postsMetaCache = ref<BlogPostMeta[]>([])

/**
 * Composable per gestire i post del blog
 */
export function useBlog() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Carica tutti i metadati dei post
   */
  const loadPostsMeta = async (): Promise<BlogPostMeta[]> => {
    if (postsMetaCache.value.length > 0) {
      return postsMetaCache.value
    }

    loading.value = true
    error.value = null

    try {
      // Importa tutti i file markdown dalla directory blog
      const posts = import.meta.glob('@/content/blog/*.md', { eager: true })

      const postsMeta: BlogPostMeta[] = []

      for (const [path, post] of Object.entries(posts)) {
        const slug = path.split('/').pop()?.replace('.md', '') || ''
        const fileContent = String((post as { default?: string } & string).default || post)

        try {
          const meta = extractMeta(fileContent, slug)
          postsMeta.push(meta)
        } catch (err) {
          console.warn(`Errore nel processare il post ${slug}:`, err)
        }
      }

      // Ordina per data (più recenti prima)
      postsMeta.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      postsMetaCache.value = postsMeta
      return postsMeta
    } catch (err) {
      error.value = 'Errore nel caricamento dei post'
      console.error('Errore nel caricamento dei post:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * Carica un singolo post per slug
   */
  const loadPost = async (slug: string): Promise<BlogPost | null> => {
    // Controlla cache
    if (postsCache.value.has(slug)) {
      return postsCache.value.get(slug)!
    }

    loading.value = true
    error.value = null

    try {
      // Importa il file specifico
      const postPath = `@/content/blog/${slug}.md`
      const post = await import(postPath)
      const fileContent = String(post.default || post)

      const blogPost = processMarkdown(fileContent, slug)
      postsCache.value.set(slug, blogPost)

      return blogPost
    } catch (err) {
      error.value = `Post "${slug}" non trovato`
      console.error(`Errore nel caricamento del post ${slug}:`, err)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Ottiene tutti i post con metadati
   */
  const getAllPosts = computed(async () => {
    return await loadPostsMeta()
  })

  /**
   * Ottiene post filtrati per tag
   */
  const getPostsByTag = computed(() => {
    return (tag: string) => {
      return postsMetaCache.value.filter((post) => post.tags.includes(tag))
    }
  })

  /**
   * Ottiene post di ricerca
   */
  const searchPosts = computed(() => {
    return (query: string) => {
      const searchTerm = query.toLowerCase()
      return postsMetaCache.value.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm) ||
          post.description.toLowerCase().includes(searchTerm) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
      )
    }
  })

  /**
   * Ottiene tutti i tag unici
   */
  const getAllTags = computed(() => {
    const tags = new Set<string>()
    postsMetaCache.value.forEach((post) => {
      post.tags.forEach((tag) => tags.add(tag))
    })
    return Array.from(tags).sort()
  })

  /**
   * Inizializza il caricamento dei metadati
   */
  const initialize = async () => {
    await loadPostsMeta()
  }

  return {
    // State
    loading: readonly(loading),
    error: readonly(error),

    // Actions
    loadPost,
    loadPostsMeta,
    initialize,

    // Computed
    getAllPosts,
    getPostsByTag,
    searchPosts,
    getAllTags,

    // Utils
    formatDate,
  }
}
