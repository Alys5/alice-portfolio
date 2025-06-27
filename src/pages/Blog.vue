<template>
  <div class="blog-page">
    <div class="container">
      <!-- Header del blog -->
      <header class="blog-header">
        <h1 class="blog-title">Blog</h1>
        <p class="blog-description">
          Condivido esperienze, tutorial e riflessioni su design e sviluppo web
        </p>
      </header>

      <!-- Filtri e ricerca -->
      <div class="blog-filters">
        <div class="search-container">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cerca nei post..."
            class="search-input"
            aria-label="Cerca nei post del blog"
          />
        </div>

        <div class="tags-filter" v-if="allTags.length > 0">
          <button
            v-for="tag in allTags"
            :key="tag"
            @click="toggleTag(tag)"
            :class="['tag-button', { active: selectedTags.includes(tag) }]"
            :aria-pressed="selectedTags.includes(tag)"
          >
            {{ tag }}
          </button>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner" aria-label="Caricamento post in corso" />
        <p>Caricamento post...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="error-container">
        <p class="error-message">{{ error }}</p>
        <button @click="retryLoad" class="retry-button">Riprova</button>
      </div>

      <!-- Posts grid -->
      <div v-else-if="filteredPosts.length > 0" class="posts-grid">
        <BlogCard v-for="post in filteredPosts" :key="post.slug" :post="post" />
      </div>

      <!-- Empty state -->
      <div v-else class="empty-state">
        <p>Nessun post trovato.</p>
        <button @click="clearFilters" class="clear-filters-button">Rimuovi filtri</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useBlog } from '@/composables/useBlog'
import { useMeta } from '@/composables/useMeta'
import BlogCard from '@/components/ui/BlogCard.vue'
import type { BlogPostMeta } from '@/utils/markdown'

// Component name
defineOptions({
  name: 'BlogPage',
})

// Composables
const { loading, error, getAllPosts, getAllTags } = useBlog()
const { setPageMeta } = useMeta()

// State
const posts = ref<BlogPostMeta[]>([])
const searchQuery = ref('')
const selectedTags = ref<string[]>([])

// Computed
const allTags = computed(() => getAllTags.value)

const filteredPosts = computed(() => {
  let filtered = posts.value

  // Filtra per ricerca
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query)),
    )
  }

  // Filtra per tag
  if (selectedTags.value.length > 0) {
    filtered = filtered.filter((post) => selectedTags.value.some((tag) => post.tags.includes(tag)))
  }

  return filtered
})

// Methods
const loadPosts = async () => {
  try {
    posts.value = await getAllPosts.value
  } catch (err) {
    console.error('Errore nel caricamento dei post:', err)
  }
}

const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedTags.value = []
}

const retryLoad = () => {
  loadPosts()
}

// Lifecycle
onMounted(() => {
  loadPosts()

  // Imposto i meta tag per la pagina blog
  setPageMeta({
    title: 'Blog | Alice Mandelli - UI Developer & AI Strategist',
    description:
      'Condivido esperienze, tutorial e riflessioni su design e sviluppo web. Articoli su UI/UX, Vue.js, design systems e strategie AI.',
    keywords:
      'Blog, UI Design, UX Design, Vue.js, Design Systems, Tutorial, Alice Mandelli, Web Development, Frontend',
    ogTitle: 'Blog - Alice Mandelli UI Developer & AI Strategist',
    ogDescription:
      'Condivido esperienze, tutorial e riflessioni su design e sviluppo web. Articoli su UI/UX, Vue.js, design systems e strategie AI.',
    twitterTitle: 'Blog - Alice Mandelli UI Developer & AI Strategist',
    twitterDescription:
      'Condivido esperienze, tutorial e riflessioni su design e sviluppo web. Articoli su UI/UX, Vue.js, design systems e strategie AI.',
  })
})

// Watch per debounce della ricerca
let searchTimeout: number
watch(searchQuery, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    // La ricerca è reattiva, non serve fare nulla qui
  }, 300)
})
</script>

<style scoped lang="scss">
.blog-page {
  min-height: 100vh;
  padding: var(--spacing-xl) 0;
  background: var(--color-surface);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.blog-header {
  text-align: center;
  margin-bottom: var(--spacing-xxl);
}

.blog-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--spacing-md);
}

.blog-description {
  font-size: var(--font-size-lg);
  color: var(--color-text-muted);
  max-width: 600px;
  margin: 0 auto;
}

.blog-filters {
  margin-bottom: var(--spacing-xl);
}

.search-container {
  margin-bottom: var(--spacing-lg);
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: var(--spacing-md);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  background: var(--color-surface);
  color: var(--color-text);
  transition: border-color var(--duration-sm) var(--easing-smooth);

  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }

  &::placeholder {
    color: var(--color-text-muted);
  }
}

.tags-filter {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.tag-button {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-full);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--duration-sm) var(--easing-smooth);

  &:hover {
    border-color: var(--color-primary);
    background: var(--color-primary);
    color: white;
  }

  &.active {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: white;
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
}

.loading-container,
.error-container,
.empty-state {
  text-align: center;
  padding: var(--spacing-xxl) 0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto var(--spacing-md);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-message {
  color: var(--color-danger);
  margin-bottom: var(--spacing-md);
}

.retry-button,
.clear-filters-button {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--font-size-base);
  transition: background-color var(--duration-sm) var(--easing-smooth);

  &:hover {
    background: var(--color-primary-hover);
  }
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-xl);
}

// Responsive
@media (max-width: 768px) {
  .posts-grid {
    grid-template-columns: 1fr;
  }

  .blog-filters {
    flex-direction: column;
    gap: var(--spacing-md);
  }
}

// Reduced motion
@media (prefers-reduced-motion: reduce) {
  .tag-button {
    transition: none;
  }

  .loading-spinner {
    animation: none;
  }
}
</style>
