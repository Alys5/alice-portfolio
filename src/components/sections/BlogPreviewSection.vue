<template>
  <section
    class="blog-preview-section"
    id="blog"
    aria-labelledby="blog-title"
  >
    <div class="container">
      <!-- Header sezione -->
      <div class="section-header">
        <h2 id="blog-title" class="section-title">
          {{ t('blog.title') }}
        </h2>
        <p class="section-subtitle">
          {{ t('blog.subtitle') }}
        </p>
      </div>

      <!-- Grid articoli -->
      <div class="blog-grid">
        <article
          v-for="(post, index) in blogPosts"
          :key="post.id"
          class="blog-card glass-card animate-fluid-fade"
          :class="`animate-delay-${(index + 1) * 100}`"
          @mouseenter="handleCardHover(index)"
          @mouseleave="handleCardLeave(index)"
        >
          <!-- Immagine articolo -->
          <div class="blog-image">
            <img
              :src="post.image"
              :alt="post.title"
              loading="lazy"
              class="post-image"
            />
            <div class="blog-overlay">
              <span class="blog-category">{{ post.category }}</span>
            </div>
          </div>

          <!-- Contenuto articolo -->
          <div class="blog-content">
            <div class="blog-meta">
              <time :datetime="post.date" class="blog-date">{{ formatDate(post.date) }}</time>
              <span class="blog-read-time">{{ post.readTime }} min read</span>
            </div>

            <h3 class="blog-title">
              <a :href="post.url" class="blog-link">
                {{ post.title }}
              </a>
            </h3>

            <p class="blog-excerpt">
              {{ post.excerpt }}
            </p>

            <!-- Tags -->
            <div class="post-tags" v-if="post.tags.length">
              <span
                v-for="tag in post.tags.slice(0, 3)"
                :key="tag"
                class="tag"
              >
                {{ tag }}
              </span>
            </div>

            <!-- CTA -->
            <div class="blog-actions">
              <button
                class="read-more-btn neumorphic-button"
                :aria-label="`Leggi l'articolo: ${post.title}`"
              >
                {{ t('blog.readMore') }}
                <span class="btn-icon">→</span>
              </button>
            </div>
          </div>
        </article>
      </div>

      <!-- Call to Action -->
      <div class="blog-cta">
        <div class="cta-content glass-card">
          <h3 class="cta-title">{{ t('blog.cta.title') }}</h3>
          <p class="cta-description">{{ t('blog.cta.description') }}</p>
          <div class="cta-actions">
            <button
              class="cta-btn primary neumorphic-button"
              @click="handleViewAllPosts"
              :aria-label="t('blog.cta.viewAll')"
            >
              {{ t('blog.cta.viewAll') }}
            </button>
            <button
              class="cta-btn secondary neumorphic-button"
              @click="handleNewsletterSignup"
              :aria-label="t('blog.cta.newsletter')"
            >
              {{ t('blog.cta.newsletter') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import useAnimations from '@/composables/useAnimations'

// Props interface
interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  image: string
  url: string
  date: string
  readTime: string
  category: string
  tags: string[]
  featured: boolean
}

interface Props {
  posts?: BlogPost[]
}

const props = withDefaults(defineProps<Props>(), {
  posts: () => [
    {
      id: 'ai-ux-trends-2025',
      title: 'AI UX Trends 2025: Come l\'Intelligenza Artificiale sta rivoluzionando il design delle interfacce',
      excerpt: 'Esploriamo le tendenze più innovative nell\'integrazione AI-UX, dai chatbot conversazionali alle interfacce predittive che anticipano le esigenze degli utenti.',
      content: 'Contenuto completo dell\'articolo...',
      image: '/images/blog/ai-ux-trends-2025.jpg',
      url: '/blog/ai-ux-trends-2025',
      date: '2025-01-15',
      readTime: '8 min',
      category: 'AI & UX',
      tags: ['AI', 'UX Design', 'Trends 2025', 'Interface Design'],
      featured: true
    },
    {
      id: 'vue3-performance',
      title: 'Ottimizzazione Performance Vue 3: Tecniche avanzate per applicazioni enterprise',
      excerpt: 'Guida pratica per ottimizzare le performance delle applicazioni Vue 3, dal code splitting al lazy loading intelligente.',
      content: 'Contenuto completo dell\'articolo...',
      image: '/images/blog/vue3-performance.jpg',
      url: '/blog/vue3-performance',
      date: '2025-01-10',
      readTime: '12 min',
      category: 'Development',
      tags: ['Vue.js', 'Performance', 'Enterprise', 'Optimization'],
      featured: false
    },
    {
      id: 'glassmorphism-design',
      title: 'Glassmorphism 2025: Dal trend estetico alla soluzione funzionale',
      excerpt: 'Come trasformare il glassmorphism da semplice effetto visivo a elemento funzionale che migliora l\'usabilità.',
      content: 'Contenuto completo dell\'articolo...',
      image: '/images/blog/glassmorphism-2025.jpg',
      url: '/blog/glassmorphism-design',
      date: '2025-01-05',
      readTime: '6 min',
      category: 'Design',
      tags: ['Glassmorphism', 'UI Design', 'Modern Design', 'Accessibility'],
      featured: false
    }
  ]
})

// Emits
const emit = defineEmits<{
  'contact-cta': []
  'view-all-posts': []
  'newsletter-signup': []
}>()

// Composables
const { t } = useI18n()
const { staggerIn } = useAnimations()

// Blog posts data
const blogPosts = ref(props.posts)

// Event handlers
const handleCardHover = (index: number) => {
  const card = document.querySelector(`.blog-card:nth-child(${index + 1})`) as HTMLElement
  if (card) {
    card.style.transform = 'translateY(-8px) scale(1.02)'
  }
}

const handleCardLeave = (index: number) => {
  const card = document.querySelector(`.blog-card:nth-child(${index + 1})`) as HTMLElement
  if (card) {
    card.style.transform = 'translateY(0) scale(1)'
  }
}

const handleViewAllPosts = () => {
  emit('view-all-posts')
}

const handleNewsletterSignup = () => {
  emit('newsletter-signup')
}

// Utility functions
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Lifecycle
onMounted(() => {
  // Animate blog cards on mount
  const cards = document.querySelectorAll('.blog-card')
  staggerIn(Array.from(cards), { delay: 200, stagger: 150 })
})
</script>

<style lang="scss" scoped>
@use "sass:color";
// @use "@/styles/variables" as vars;
.blog-preview-section {
  padding: var(--space-20) 0;
  background: var(--ebony-clay);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.section-header {
  text-align: center;
  margin-bottom: var(--space-16);
}

.section-title {
  font-size: var(--font-size-3xl);
  font-weight: 800;
  color: var(--bright-sun);
  margin-bottom: var(--space-4);
}

.section-subtitle {
  font-size: var(--font-size-lg);
  color: var(--slate-gray);
  max-width: 600px;
  margin: 0 auto;
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--space-8);
  margin-bottom: var(--space-16);
}

.blog-card {
  background: var(--glass-light);
  border-radius: var(--border-radius-xl);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  cursor: pointer;

  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-xl);
  }
}

.blog-image {
  position: relative;
  height: 200px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }

  .blog-overlay {
    position: absolute;
    top: var(--space-4);
    left: var(--space-4);
  }

  .blog-category {
    background: var(--bright-sun);
    color: var(--ebony-clay);
    padding: var(--space-1) var(--space-3);
    border-radius: var(--border-radius-full);
    font-size: var(--font-size-sm);
    font-weight: 600;
  }
}

.post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.blog-card:hover .post-image {
  transform: scale(1.05);
}

.blog-content {
  padding: var(--space-6);
}

.blog-meta {
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
  font-size: var(--font-size-sm);
  color: var(--slate-gray);
}

.blog-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: var(--space-4);
  line-height: 1.3;

  .blog-link {
    color: var(--bright-sun);
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: var(--picton-blue);
    }
  }
}

.blog-excerpt {
  color: var(--slate-gray);
  line-height: 1.6;
  margin-bottom: var(--space-6);
}

.post-tags {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.tag {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  font-size: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.blog-actions {
  display: flex;
  justify-content: flex-end;
}

.read-more-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  background: var(--persian-blue);
  color: white;
  border: none;
  border-radius: var(--border-radius-lg);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--picton-blue);
    transform: translateX(4px);
  }

  .btn-icon {
    transition: transform 0.3s ease;
  }

  &:hover .btn-icon {
    transform: translateX(4px);
  }
}

.blog-cta {
  text-align: center;
}

.cta-content {
  max-width: 600px;
  margin: 0 auto;
  padding: var(--space-12);
  text-align: center;
}

.cta-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--bright-sun);
  margin-bottom: var(--space-4);
}

.cta-description {
  color: var(--slate-gray);
  margin-bottom: var(--space-8);
  line-height: 1.6;
}

.cta-actions {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  flex-wrap: wrap;
}

.cta-btn {
  padding: var(--space-4) var(--space-8);
  border: none;
  border-radius: var(--border-radius-lg);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &.primary {
    background: var(--bright-sun);
    color: var(--ebony-clay);

    &:hover {
      background: var(--bright-sun-light);
      transform: translateY(-2px);
    }
  }

  &.secondary {
    background: transparent;
    color: var(--bright-sun);
    border: 2px solid var(--bright-sun);

    &:hover {
      background: var(--bright-sun);
      color: var(--ebony-clay);
    }
  }
}

// Responsive design
@media (max-width: 768px) {
  .blog-grid {
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }

  .cta-actions {
    flex-direction: column;
    align-items: center;
  }

  .cta-btn {
    width: 100%;
    max-width: 300px;
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .blog-card,
  .read-more-btn,
  .cta-btn {
    transition: none;
  }

  .blog-card:hover {
    transform: none;
  }
}
</style>
