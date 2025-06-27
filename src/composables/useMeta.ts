import { ref, watch, onMounted, onUnmounted, readonly } from 'vue'
import { useRoute } from 'vue-router'

// Interfacce per i meta tag
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

// Configurazione di default
const DEFAULT_META: MetaConfig = {
  title: 'Alice Mandelli - UI Developer & AI Strategist | Portfolio 2025',
  description:
    'UI Developer e AI Strategist specializzata in esperienze digitali intuitive e intelligenti. Portfolio con progetti Volkswagen, ŠKODA e design innovativo.',
  keywords:
    'UI Developer, UI Designer, AI Strategist, UX Designer, Frontend Developer, Vue.js, Design Systems, Artificial Intelligence, User Experience, Interface Design, Alice Mandelli',
  author: 'Alice Mandelli',
  robots: 'index, follow, max-image-preview:large',
  ogType: 'website',
  ogUrl: 'https://alys5.eu/',
  ogTitle: 'Alice Mandelli - UI Developer & AI Strategist',
  ogDescription:
    'Trasformo idee in esperienze digitali con focus su UI/UX e soluzioni AI. Specializzata in design di interfacce, sviluppo frontend e strategie AI.',
  ogImage: 'https://alys5.eu/og-image.jpg',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogLocale: 'it_IT',
  ogSiteName: 'Alice Mandelli Portfolio',
  twitterCard: 'summary_large_image',
  twitterUrl: 'https://alys5.eu/',
  twitterTitle: 'Alice Mandelli - UI Developer & AI Strategist',
  twitterDescription:
    'Trasformo idee in esperienze digitali con focus su UI/UX e soluzioni AI. Specializzata in design di interfacce, sviluppo frontend e strategie AI.',
  twitterImage: 'https://alys5.eu/twitter-image.jpg',
}

// Cache per i meta tag esistenti
const metaCache = new Map<string, HTMLMetaElement>()

/**
 * Composable per gestire i meta tag SEO in modo dinamico
 * Supporta title, description, Open Graph, Twitter Cards e altri meta tag
 */
export function useMeta() {
  const route = useRoute()
  const currentMeta = ref<MetaConfig>({ ...DEFAULT_META })

  /**
   * Imposta i meta tag nel documento
   */
  const setMeta = (config: Partial<MetaConfig>) => {
    // Aggiorna la configurazione corrente
    Object.assign(currentMeta.value, config)

    // Imposta il title
    if (config.title) {
      document.title = config.title
    }

    // Imposta i meta tag standard
    setMetaTag('description', config.description)
    setMetaTag('keywords', config.keywords)
    setMetaTag('author', config.author)
    setMetaTag('robots', config.robots)

    // Imposta i meta tag Open Graph
    setMetaTag('og:type', config.ogType)
    setMetaTag('og:url', config.ogUrl)
    setMetaTag('og:title', config.ogTitle)
    setMetaTag('og:description', config.ogDescription)
    setMetaTag('og:image', config.ogImage)
    setMetaTag('og:image:width', config.ogImageWidth?.toString())
    setMetaTag('og:image:height', config.ogImageHeight?.toString())
    setMetaTag('og:locale', config.ogLocale)
    setMetaTag('og:site_name', config.ogSiteName)

    // Imposta i meta tag Twitter
    setMetaTag('twitter:card', config.twitterCard)
    setMetaTag('twitter:url', config.twitterUrl)
    setMetaTag('twitter:title', config.twitterTitle)
    setMetaTag('twitter:description', config.twitterDescription)
    setMetaTag('twitter:image', config.twitterImage)

    // Imposta il canonical link
    if (config.canonical) {
      setCanonicalLink(config.canonical)
    }
  }

  /**
   * Imposta un singolo meta tag
   */
  const setMetaTag = (name: string, content?: string) => {
    if (!content) return

    let meta = metaCache.get(name)

    if (!meta) {
      meta = document.querySelector(
        `meta[name="${name}"], meta[property="${name}"]`,
      ) as HTMLMetaElement
      if (!meta) {
        meta = document.createElement('meta')
        if (name.startsWith('og:') || name.startsWith('twitter:')) {
          meta.setAttribute('property', name)
        } else {
          meta.setAttribute('name', name)
        }
        document.head.appendChild(meta)
      }
      metaCache.set(name, meta)
    }

    meta.setAttribute('content', content)
  }

  /**
   * Imposta il link canonical
   */
  const setCanonicalLink = (url: string) => {
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement

    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }

    canonical.setAttribute('href', url)
  }

  /**
   * Resetta i meta tag ai valori di default
   */
  const resetMeta = () => {
    setMeta(DEFAULT_META)
  }

  /**
   * Imposta meta tag per una pagina specifica
   */
  const setPageMeta = (pageConfig: Partial<MetaConfig>) => {
    const baseUrl = 'https://alys5.eu'
    const currentUrl = `${baseUrl}${route.path}`

    const config: Partial<MetaConfig> = {
      ogUrl: currentUrl,
      twitterUrl: currentUrl,
      canonical: currentUrl,
      ...pageConfig,
    }

    // Se non è specificato un og:title, usa il title
    if (config.title && !config.ogTitle) {
      config.ogTitle = config.title
    }

    // Se non è specificato un twitter:title, usa il title
    if (config.title && !config.twitterTitle) {
      config.twitterTitle = config.title
    }

    // Se non è specificata una og:description, usa la description
    if (config.description && !config.ogDescription) {
      config.ogDescription = config.description
    }

    // Se non è specificata una twitter:description, usa la description
    if (config.description && !config.twitterDescription) {
      config.twitterDescription = config.description
    }

    setMeta(config)
  }

  /**
   * Imposta meta tag per un post del blog
   */
  const setBlogPostMeta = (post: {
    title: string
    description: string
    image?: string
    author?: string
    publishedAt?: string
    tags?: string[]
  }) => {
    const baseUrl = 'https://alys5.eu'
    const postUrl = `${baseUrl}/blog/${route.params.slug}`

    const keywords = post.tags?.join(', ') || ''

    setPageMeta({
      title: `${post.title} | Alice Mandelli Blog`,
      description: post.description,
      keywords: keywords,
      author: post.author || 'Alice Mandelli',
      ogType: 'article',
      ogUrl: postUrl,
      ogTitle: post.title,
      ogDescription: post.description,
      ogImage: post.image || DEFAULT_META.ogImage,
      twitterCard: 'summary_large_image',
      twitterUrl: postUrl,
      twitterTitle: post.title,
      twitterDescription: post.description,
      twitterImage: post.image || DEFAULT_META.twitterImage,
      canonical: postUrl,
    })

    // Aggiungi meta tag specifici per articoli
    if (post.publishedAt) {
      setMetaTag('article:published_time', post.publishedAt)
    }

    if (post.author) {
      setMetaTag('article:author', post.author)
    }

    if (post.tags) {
      post.tags.forEach((tag) => {
        setMetaTag('article:tag', tag)
      })
    }
  }

  /**
   * Imposta meta tag per la pagina portfolio
   */
  const setPortfolioMeta = () => {
    setPageMeta({
      title: 'Portfolio | Alice Mandelli - UI Developer & AI Strategist',
      description:
        'Esplora i progetti di UI/UX design e sviluppo frontend. Portfolio con esperienze in Volkswagen, ŠKODA e design di interfacce innovative.',
      keywords:
        'Portfolio, UI Design, UX Design, Frontend Development, Vue.js, Design Systems, Alice Mandelli, Progetti',
      ogTitle: 'Portfolio - Alice Mandelli UI Developer & AI Strategist',
      ogDescription:
        'Esplora i progetti di UI/UX design e sviluppo frontend. Portfolio con esperienze in Volkswagen, ŠKODA e design di interfacce innovative.',
      twitterTitle: 'Portfolio - Alice Mandelli UI Developer & AI Strategist',
      twitterDescription:
        'Esplora i progetti di UI/UX design e sviluppo frontend. Portfolio con esperienze in Volkswagen, ŠKODA e design di interfacce innovative.',
    })
  }

  /**
   * Imposta meta tag per la pagina about
   */
  const setAboutMeta = () => {
    setPageMeta({
      title: 'Chi sono | Alice Mandelli - UI Developer & AI Strategist',
      description:
        'Scopri la mia storia, esperienze e competenze in UI/UX design e strategie AI. Alice Mandelli, specialista in esperienze digitali innovative.',
      keywords:
        'Chi sono, About, Alice Mandelli, UI Developer, AI Strategist, Esperienze, Competenze, Storia',
      ogTitle: 'Chi sono - Alice Mandelli UI Developer & AI Strategist',
      ogDescription:
        'Scopri la mia storia, esperienze e competenze in UI/UX design e strategie AI. Alice Mandelli, specialista in esperienze digitali innovative.',
      twitterTitle: 'Chi sono - Alice Mandelli UI Developer & AI Strategist',
      twitterDescription:
        'Scopri la mia storia, esperienze e competenze in UI/UX design e strategie AI. Alice Mandelli, specialista in esperienze digitali innovative.',
    })
  }

  /**
   * Imposta meta tag per la pagina contatti
   */
  const setContactMeta = () => {
    setPageMeta({
      title: 'Contatti | Alice Mandelli - UI Developer & AI Strategist',
      description:
        'Contattami per collaborazioni, progetti o consulenze in UI/UX design e strategie AI. Alice Mandelli, disponibile per nuove opportunità.',
      keywords:
        'Contatti, Contact, Alice Mandelli, Collaborazioni, Progetti, Consulenze, UI/UX Design, AI Strategy',
      ogTitle: 'Contatti - Alice Mandelli UI Developer & AI Strategist',
      ogDescription:
        'Contattami per collaborazioni, progetti o consulenze in UI/UX design e strategie AI. Alice Mandelli, disponibile per nuove opportunità.',
      twitterTitle: 'Contatti - Alice Mandelli UI Developer & AI Strategist',
      twitterDescription:
        'Contattami per collaborazioni, progetti o consulenze in UI/UX design e strategie AI. Alice Mandelli, disponibile per nuove opportunità.',
    })
  }

  // Inizializza i meta tag al mount
  onMounted(() => {
    setMeta(DEFAULT_META)
  })

  // Pulisci la cache al dismount
  onUnmounted(() => {
    metaCache.clear()
  })

  return {
    currentMeta: readonly(currentMeta),
    setMeta,
    setPageMeta,
    setBlogPostMeta,
    setPortfolioMeta,
    setAboutMeta,
    setContactMeta,
    resetMeta,
    setMetaTag,
    setCanonicalLink,
  }
}
