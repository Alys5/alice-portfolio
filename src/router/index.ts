import { createRouter, createWebHistory } from 'vue-router'
import { useMeta } from '@/composables/useMeta'
import { defineAsyncComponent } from 'vue'

// Estendi Window interface per gtag
declare global {
  interface Window {
    gtag?: (command: string, targetId: string, config?: Record<string, any>) => void
  }
}

// Lazy loading per tutte le pagine per ottimizzare Core Web Vitals
const Home = defineAsyncComponent(() => import('@/pages/Home.vue'))
const About = defineAsyncComponent(() => import('@/pages/About.vue'))
const Portfolio = defineAsyncComponent(() => import('@/pages/Portfolio.vue'))
const Contact = defineAsyncComponent(() => import('@/pages/Contact.vue'))
const Blog = defineAsyncComponent(() => import('@/pages/Blog.vue'))
const BlogPost = defineAsyncComponent(() => import('@/pages/BlogPost.vue'))
const BlogEditor = defineAsyncComponent(() => import('@/pages/BlogEditor.vue'))

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      title: 'Alice Mandelli - UI Developer & AI Strategist',
      description:
        'Portfolio di Alice Mandelli, UI Developer e AI Strategist specializzata in esperienze digitali intuitive e intelligenti.',
      preload: true, // Preload critico per LCP
    },
  },
  {
    path: '/about',
    name: 'about',
    component: About,
    meta: {
      title: 'Chi Sono - Alice Mandelli',
      description:
        'Scopri la mia storia, esperienze e competenze come UI Developer e AI Strategist.',
    },
  },
  {
    path: '/portfolio',
    name: 'portfolio',
    component: Portfolio,
    meta: {
      title: 'Portfolio - Alice Mandelli',
      description: 'Esplora i miei progetti di UI/UX design e sviluppo frontend.',
    },
  },
  {
    path: '/contact',
    name: 'contact',
    component: Contact,
    meta: {
      title: 'Contatti - Alice Mandelli',
      description: 'Contattami per collaborazioni e progetti di UI/UX design.',
    },
  },
  {
    path: '/blog',
    name: 'blog',
    component: Blog,
    meta: {
      title: 'Blog - Alice Mandelli',
      description: 'Articoli su UI/UX design, sviluppo frontend e strategie AI.',
    },
  },
  {
    path: '/blog/:slug',
    name: 'blog-post',
    component: BlogPost,
    meta: {
      title: 'Blog Post - Alice Mandelli',
      description: 'Leggi i miei articoli su design e tecnologia.',
    },
  },
  {
    path: '/blog/editor',
    name: 'blog-editor',
    component: BlogEditor,
    meta: {
      title: 'Editor Blog - Alice Mandelli',
      description: 'Editor per la creazione di articoli del blog.',
      requiresAuth: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // Scroll behavior ottimizzato per Core Web Vitals
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  },
})

// Navigation guards per preloading intelligente
router.beforeEach((to, from, next) => {
  // Preload pagine critiche per LCP
  if (to.meta.preload) {
    // Preload già fatto dal defineAsyncComponent
  }

  // Preload pagine adiacenti per migliorare UX
  const adjacentRoutes = router
    .getRoutes()
    .filter((route) => route.path !== to.path && !route.path.includes('*'))

  // Preload solo le prime 2 pagine adiacenti per non sovraccaricare
  adjacentRoutes.slice(0, 2).forEach((route) => {
    if (route.components && typeof route.components.default === 'function') {
      route.components.default()
    }
  })

  // Imposta il titolo della pagina
  if (to.meta?.title) {
    document.title = to.meta.title as string
  }

  // Gestione meta tag SEO tramite composable
  const { setPageMeta } = useMeta()

  if (to.meta) {
    setPageMeta({
      title: to.meta.title as string,
      description: to.meta.description as string,
      keywords: to.meta.keywords as string,
      robots: to.meta.robots as string,
    })
  }

  // Annuncia navigazione per screen reader
  if (to.name && to.name !== from.name) {
    const pageNames: Record<string, string> = {
      home: 'Home',
      portfolio: 'Portfolio',
      about: 'Chi sono',
      contact: 'Contatti',
      blog: 'Blog',
    }

    const pageName = pageNames[to.name as string] || 'Nuova pagina'
    setTimeout(() => {
      // Annuncio per screen reader tramite live region
      const liveRegion = document.querySelector('[aria-live="polite"]')
      if (liveRegion) {
        liveRegion.textContent = `Navigato a ${pageName}`
      }
    }, 100)
  }

  next()
})

// Navigation guard post-navigazione per analytics e monitoring
router.afterEach((to, from) => {
  // Track navigazione per analytics (se disponibile)
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: to.path,
      page_title: to.meta?.title || to.name,
    })
  }

  // Log navigazione in development
  if (import.meta.env.DEV) {
    console.log(`🚀 Navigazione: ${from.path} → ${to.path}`)
  }
})

export default router
