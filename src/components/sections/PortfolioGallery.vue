<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
// import { useTheme } from '@/composables/useTheme' // non usato
import useCursor from '@/composables/useCursor'

// INTERFACCIA PORTFOLIO ITEM
export interface PortfolioItem {
  id: string
  title: string
  description: string
  category: string
  image: string
  images?: string[]
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  featured: boolean
}

// PROPS
const props = defineProps<{
  items: PortfolioItem[]
  columns?: { desktop?: number; tablet?: number; mobile?: number }
  filterCategories?: string[]
}>()

const emit = defineEmits<{
  (e: 'item-click', item: PortfolioItem): void
  (e: 'filter-change', category: string): void
  (e: 'modal-open', item: PortfolioItem): void
  (e: 'modal-close'): void
}>()

// THEME & CURSOR
const { addMagnetic, removeMagnetic } = useCursor()

// FILTRI
const allCategories = computed(() => [
  'All',
  ...(props.filterCategories?.length
    ? props.filterCategories
    : Array.from(new Set(props.items.map(i => i.category)))
  )
])
const activeCategory = ref('All')
const searchQuery = ref('')
const debouncedQuery = ref('')
const searchTimeout = ref<number | null>(null)

watch(searchQuery, (val) => {
  if (searchTimeout.value) clearTimeout(searchTimeout.value)
  searchTimeout.value = window.setTimeout(() => {
    debouncedQuery.value = val.trim().toLowerCase()
  }, 300)
})

function setCategory(cat: string) {
  activeCategory.value = cat
  emit('filter-change', cat)
  announce(`Filtro attivo: ${cat}`)
  focusFilter(cat)
}

function focusFilter(cat: string) {
  nextTick(() => {
    const btn = document.querySelector(`[data-filter-btn="${cat}"]`) as HTMLElement
    if (btn) btn.focus()
  })
}

// SEARCH
const filteredItems = computed(() => {
  let arr = props.items
  if (activeCategory.value !== 'All') {
    arr = arr.filter(i => i.category === activeCategory.value)
  }
  if (debouncedQuery.value) {
    arr = arr.filter(i =>
      i.title.toLowerCase().includes(debouncedQuery.value) ||
      i.description.toLowerCase().includes(debouncedQuery.value) ||
      i.technologies.some(t => t.toLowerCase().includes(debouncedQuery.value))
    )
  }
  return arr
})

// PAGINATION/INFINITE SCROLL
const page = ref(1)
const pageSize = 12
const paginatedItems = computed(() => filteredItems.value.slice(0, page.value * pageSize))
const hasMore = computed(() => filteredItems.value.length > paginatedItems.value.length)

function loadMore() {
  if (hasMore.value) page.value++
}

// INFINITE SCROLL
const galleryRef = ref<HTMLElement | null>(null)
function onScroll() {
  if (!galleryRef.value || !hasMore.value) return
  const { bottom } = galleryRef.value.getBoundingClientRect()
  if (bottom < window.innerHeight + 200) loadMore()
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})

// MODAL
const showModal = ref(false)
const modalItem = ref<PortfolioItem | null>(null)
const modalImages = computed(() => modalItem.value?.images?.length ? modalItem.value.images : modalItem.value?.image ? [modalItem.value.image] : [])
const modalImageIdx = ref(0)

function openModal(item: PortfolioItem) {
  modalItem.value = item
  showModal.value = true
  modalImageIdx.value = 0
  emit('modal-open', item)
  nextTick(() => {
    const modal = document.getElementById('portfolio-modal')
    if (modal) modal.focus()
  })
}
function closeModal() {
  showModal.value = false
  emit('modal-close')
}
function nextImage() {
  if (!modalImages.value.length) return
  modalImageIdx.value = (modalImageIdx.value + 1) % modalImages.value.length
}
function prevImage() {
  if (!modalImages.value.length) return
  modalImageIdx.value = (modalImageIdx.value - 1 + modalImages.value.length) % modalImages.value.length
}

// KEYBOARD SHORTCUTS
function onKeydown(e: KeyboardEvent) {
  if (showModal.value) {
    if (e.key === 'Escape') closeModal()
    if (e.key === 'ArrowRight') nextImage()
    if (e.key === 'ArrowLeft') prevImage()
  } else {
    // 1-9 per filtri
    if (e.key >= '1' && +e.key <= allCategories.value.length) {
      setCategory(allCategories.value[+e.key - 1])
    }
  }
}
onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

// ANNOUNCEMENTS (screen reader)
const announcement = ref('')
function announce(msg: string) {
  announcement.value = msg
  setTimeout(() => (announcement.value = ''), 1200)
}

// LAZY LOADING IMAGES
const loadedImages = ref<Record<string, boolean>>({})
function onImageLoad(id: string) {
  loadedImages.value[id] = true
}
function onImageError(id: string) {
  loadedImages.value[id] = false
}

// SKELETON LOADING
const isLoading = ref(true)
onMounted(() => {
  setTimeout(() => (isLoading.value = false), 1200)
})

// MASONRY GRID RESPONSIVE
function onResize() {
  // Forza il ricalcolo della griglia
}
onMounted(() => {
  window.addEventListener('resize', onResize)
})

// SOCIAL SHARING
function shareProject(item: PortfolioItem) {
  if (navigator.share) {
    navigator.share({
      title: item.title,
      text: item.description,
      url: item.liveUrl || window.location.href
    })
  } else {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(item.title + ' ' + (item.liveUrl || ''))}`)
  }
}

// VIRTUAL SCROLLING (semplificato per demo)
const visibleItems = computed(() => paginatedItems.value)

// EMIT SU CLICK
function onItemClick(item: PortfolioItem) {
  emit('item-click', item)
  openModal(item)
}
</script>

<template>
  <section class="portfolio-gallery-section">
    <!-- Annunci accessibilità -->
    <div aria-live="polite" aria-atomic="true" class="sr-only">{{ announcement }}</div>

    <!-- Filter Tabs Bar -->
    <nav class="gallery-filters glass-bar" aria-label="Filtri categorie portfolio">
      <button
        v-for="cat in allCategories"
        :key="cat"
        class="filter-btn"
        :class="{ active: activeCategory === cat }"
        :aria-pressed="activeCategory === cat"
        :data-filter-btn="cat"
        @click="setCategory(cat)"
        :tabindex="0"
      >
        <span class="filter-label">{{ cat }}</span>
        <span class="filter-count">{{ cat === 'All' ? props.items.length : props.items.filter(i => i.category === cat).length }}</span>
      </button>
    </nav>

    <!-- Search Input -->
    <div class="gallery-search glass-bar">
      <input
        v-model="searchQuery"
        type="search"
        class="search-input"
        :placeholder="'Cerca progetti...'"
        aria-label="Cerca progetti"
        :style="{ '--focus-color': 'var(--bright-sun)' }"
      />
    </div>

    <!-- Gallery Grid -->
    <div
      class="gallery-grid"
      :style="{ '--gallery-gap': 'clamp(1rem, 3vw, 2rem)', '--card-radius': '24px', '--hover-scale': '1.03' }"
      ref="galleryRef"
      role="list"
    >
      <template v-if="isLoading">
        <div v-for="n in 8" :key="n" class="gallery-card skeleton">
          <div class="skeleton-img shimmer" />
          <div class="skeleton-lines">
            <div class="skeleton-line" />
            <div class="skeleton-line short" />
          </div>
        </div>
      </template>
      <template v-else-if="visibleItems.length">
        <div
          v-for="item in visibleItems"
          :key="item.id"
          class="gallery-card glass-card"
          :tabindex="0"
          @click="onItemClick(item)"
          @keydown.enter="onItemClick(item)"
          @mouseenter="addMagnetic($event.currentTarget as HTMLElement)"
          @mouseleave="removeMagnetic($event.currentTarget as HTMLElement)"
          :aria-label="item.title"
          role="listitem"
        >
          <div class="card-image-wrapper">
            <img
              v-if="item.image"
              :src="item.image"
              :alt="item.title"
              class="card-image"
              loading="lazy"
              @load="onImageLoad(item.id)"
              @error="onImageError(item.id)"
              :class="{ loaded: loadedImages[item.id] }"
            />
            <div class="card-image-overlay" />
            <span class="card-category-badge">{{ item.category }}</span>
          </div>
          <div class="card-content">
            <h3 class="card-title">{{ item.title }}</h3>
            <p class="card-desc">{{ item.description }}</p>
            <div class="card-tech">
              <span v-for="tech in item.technologies" :key="tech" class="card-tech-tag">{{ tech }}</span>
            </div>
            <div class="card-cta">
              <button class="cta-btn" @click.stop="onItemClick(item)">Dettagli</button>
              <a v-if="item.liveUrl" :href="item.liveUrl" target="_blank" rel="noopener" class="cta-btn alt">Live</a>
              <a v-if="item.githubUrl" :href="item.githubUrl" target="_blank" rel="noopener" class="cta-btn alt">GitHub</a>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="gallery-empty">
          <img src="/images/empty-state.svg" alt="Nessun progetto trovato" class="empty-illustration" />
          <p>Nessun progetto trovato. Prova a cambiare filtro o ricerca.</p>
        </div>
      </template>
    </div>
    <!-- Infinite Scroll Loader -->
    <div v-if="hasMore && !isLoading" class="gallery-infinite-loader">
      <span class="loader-dot" v-for="n in 3" :key="n" />
    </div>

    <!-- Modal Lightbox -->
    <transition name="modal-fade">
      <div
        v-if="showModal && modalItem"
        class="portfolio-modal-overlay"
        :style="{ '--modal-backdrop': 'rgba(41,53,63,0.9)' }"
        tabindex="-1"
        id="portfolio-modal"
        @keydown.esc="closeModal"
        @click.self="closeModal"
        aria-modal="true"
        role="dialog"
      >
        <div class="portfolio-modal-card glass-card">
          <button class="modal-close" @click="closeModal" aria-label="Chiudi modal">×</button>
          <div class="modal-carousel">
            <button v-if="modalImages.length > 1" class="carousel-arrow left" @click="prevImage" aria-label="Immagine precedente">‹</button>
            <img
              :src="modalImages[modalImageIdx]"
              :alt="modalItem.title + ' immagine ' + (modalImageIdx+1)"
              class="modal-image"
              loading="eager"
            />
            <button v-if="modalImages.length > 1" class="carousel-arrow right" @click="nextImage" aria-label="Immagine successiva">›</button>
          </div>
          <div class="modal-content">
            <h2 class="modal-title">{{ modalItem.title }}</h2>
            <p class="modal-desc">{{ modalItem.description }}</p>
            <div class="modal-tech">
              <span v-for="tech in modalItem.technologies" :key="tech" class="modal-tech-tag">{{ tech }}</span>
            </div>
            <div class="modal-actions">
              <a v-if="modalItem.liveUrl" :href="modalItem.liveUrl" target="_blank" rel="noopener" class="cta-btn">Live Demo</a>
              <a v-if="modalItem.githubUrl" :href="modalItem.githubUrl" target="_blank" rel="noopener" class="cta-btn alt">GitHub</a>
              <button class="cta-btn share" @click="shareProject(modalItem)">Condividi</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<style scoped lang="scss">
.portfolio-gallery-section {
  width: 100%;
  margin: 0 auto;
  padding: 2rem 0 4rem 0;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  border: 0;
}
// Filter bar
.glass-bar {
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(18px) saturate(160%);
  -webkit-backdrop-filter: blur(18px) saturate(160%);
  border-radius: 18px;
  box-shadow: 0 2px 8px 0 var(--bright-sun-alpha);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1.2rem;
}
.gallery-filters {
  flex-wrap: wrap;
  justify-content: flex-start;
  .filter-btn {
    background: transparent;
    border: none;
    outline: none;
    border-radius: 14px;
    padding: 0.5rem 1.2rem;
    font-weight: 700;
    font-size: 1.05rem;
    color: var(--persian-blue);
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
    cursor: pointer;
    transition: background 0.22s, color 0.22s, box-shadow 0.22s;
    position: relative;
    &.active {
      background: var(--bright-sun);
      color: var(--ebony-clay);
      box-shadow: 0 0 8px 2px var(--bright-sun);
    }
    &:hover, &:focus-visible {
      background: var(--persian-blue);
      color: #fff;
      box-shadow: 0 0 8px 2px var(--persian-blue);
    }
    .filter-count {
      background: var(--picton-blue);
      color: #fff;
      border-radius: 8px;
      font-size: 0.92em;
      padding: 0.1em 0.6em;
      margin-left: 0.5em;
      font-weight: 600;
    }
  }
}
// Search
.gallery-search {
  margin-bottom: 2rem;
  .search-input {
    width: 100%;
    padding: 0.7rem 1.2rem;
    border-radius: 14px;
    border: 1.5px solid rgba(255,255,255,0.18);
    background: rgba(255,255,255,0.13);
    font-size: 1.08rem;
    color: var(--ebony-clay);
    outline: none;
    transition: border 0.18s, box-shadow 0.18s;
    &:focus {
      border: 1.5px solid var(--bright-sun);
      box-shadow: 0 0 8px 2px var(--bright-sun);
    }
  }
}
// Gallery Grid
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--gallery-gap, 1.5rem);
  width: 100%;
  margin: 0 auto;
  align-items: start;
}
.gallery-card {
  background: rgba(255,255,255,0.10);
  border: 1px solid rgba(255,255,255,0.20);
  border-radius: var(--card-radius, 24px);
  box-shadow: 0 8px 32px rgba(31,38,135,0.18);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  overflow: hidden;
  position: relative;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.32s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.32s, background 0.22s;
  will-change: transform, box-shadow;
  &:hover, &:focus-visible {
    transform: scale(var(--hover-scale, 1.03));
    box-shadow: 0 0 32px 0 var(--persian-blue);
    z-index: 10;
  }
}
.card-image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 4/3;
  overflow: hidden;
  .card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94), filter 0.3s;
    filter: blur(8px);
    opacity: 0.7;
    &.loaded {
      filter: blur(0);
      opacity: 1;
      transform: scale(1.1);
    }
    &:hover {
      transform: scale(1.13);
    }
  }
  .card-image-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, var(--ebony-clay) 0%, transparent 80%);
    opacity: 0.55;
    pointer-events: none;
  }
  .card-category-badge {
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: var(--bright-sun);
    color: var(--ebony-clay);
    border-radius: 12px;
    padding: 0.3em 1em;
    font-size: 0.98em;
    font-weight: 700;
    box-shadow: 0 2px 8px 0 var(--bright-sun-alpha);
    z-index: 2;
  }
}
.card-content {
  padding: 1.2rem 1.2rem 1.5rem 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  flex: 1 1 0;
}
.card-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--persian-blue);
  margin-bottom: 0.2rem;
}
.card-desc {
  font-size: 1.05rem;
  color: var(--ebony-clay);
  opacity: 0.85;
  margin-bottom: 0.3rem;
}
.card-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  .card-tech-tag {
    background: var(--picton-blue);
    color: #fff;
    border-radius: 8px;
    font-size: 0.92em;
    padding: 0.2em 0.8em;
    font-weight: 600;
    transition: background 0.18s;
    &:hover {
      background: var(--bright-sun);
      color: var(--ebony-clay);
    }
  }
}
.card-cta {
  display: flex;
  gap: 0.7rem;
  margin-top: auto;
  .cta-btn {
    background: var(--bright-sun);
    color: var(--ebony-clay);
    border: none;
    border-radius: 10px;
    padding: 0.5rem 1.2rem;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.22s, color 0.22s, box-shadow 0.22s, transform 0.22s;
    box-shadow: 0 2px 8px 0 var(--bright-sun-alpha);
    &:hover, &:focus-visible {
      background: var(--picton-blue);
      color: #fff;
      box-shadow: 0 0 16px 4px var(--picton-blue);
      transform: scale(1.06);
    }
    &.alt {
      background: var(--persian-blue);
      color: #fff;
      &:hover, &:focus-visible {
        background: var(--bright-sun);
        color: var(--ebony-clay);
      }
    }
    &.share {
      background: var(--picton-blue);
      color: #fff;
      &:hover, &:focus-visible {
        background: var(--bright-sun);
        color: var(--ebony-clay);
      }
    }
  }
}
// Skeleton loading
.skeleton {
  background: rgba(255,255,255,0.10);
  border-radius: var(--card-radius, 24px);
  min-height: 320px;
  display: flex;
  flex-direction: column;
  .skeleton-img {
    width: 100%;
    aspect-ratio: 4/3;
    background: var(--bright-sun-alpha);
    border-radius: 18px 18px 0 0;
    margin-bottom: 1rem;
  }
  .skeleton-lines {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    .skeleton-line {
      height: 18px;
      background: var(--bright-sun-alpha);
      border-radius: 8px;
      &.short { width: 60%; }
    }
  }
  .shimmer {
    animation: shimmer 1.2s linear infinite alternate;
    background: linear-gradient(90deg, var(--bright-sun-alpha), var(--picton-blue-alpha), var(--bright-sun-alpha));
    background-size: 200% 100%;
  }
}
@keyframes shimmer {
  0% { background-position: 0 0; }
  100% { background-position: 100vw 0; }
}
// Empty state
.gallery-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 320px;
  .empty-illustration {
    width: 180px;
    margin-bottom: 1.2rem;
  }
  p {
    color: var(--persian-blue);
    font-size: 1.1rem;
    font-weight: 600;
  }
}
// Infinite loader
.gallery-infinite-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.7rem;
  margin: 2rem 0;
  .loader-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--bright-sun);
    animation: loader-bounce 1.2s infinite alternate;
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
}
@keyframes loader-bounce {
  0% { transform: translateY(0); opacity: 0.7; }
  100% { transform: translateY(-18px); opacity: 1; }
}
// Modal
.portfolio-modal-overlay {
  position: fixed;
  inset: 0;
  background: var(--modal-backdrop, rgba(41,53,63,0.9));
  z-index: 4000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: modal-fade-in 0.32s cubic-bezier(0.25,0.46,0.45,0.94);
}
@keyframes modal-fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
.portfolio-modal-card {
  background: rgba(255,255,255,0.13);
  border-radius: 32px;
  box-shadow: 0 8px 32px rgba(31,38,135,0.18);
  backdrop-filter: blur(32px);
  -webkit-backdrop-filter: blur(32px);
  padding: 2.5rem 2rem 2rem 2rem;
  max-width: 700px;
  width: 96vw;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: modal-scale-in 0.32s cubic-bezier(0.25,0.46,0.45,0.94);
}
@keyframes modal-scale-in {
  0% { transform: scale(0.85); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
.modal-close {
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  background: var(--bright-sun);
  color: var(--ebony-clay);
  border: none;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  font-size: 1.6rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 8px 0 var(--bright-sun-alpha);
  transition: background 0.22s, color 0.22s;
  &:hover, &:focus-visible {
    background: var(--persian-blue);
    color: #fff;
  }
}
.modal-carousel {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 1.5rem;
  .modal-image {
    width: 100%;
    max-height: 340px;
    object-fit: contain;
    border-radius: 18px;
    box-shadow: 0 2px 8px 0 var(--picton-blue-alpha);
    background: #fff;
  }
  .carousel-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: var(--bright-sun);
    color: var(--ebony-clay);
    border: none;
    border-radius: 50%;
    width: 38px;
    height: 38px;
    font-size: 2rem;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 2px 8px 0 var(--bright-sun-alpha);
    transition: background 0.22s, color 0.22s;
    z-index: 2;
    &.left { left: -1.5rem; }
    &.right { right: -1.5rem; }
    &:hover, &:focus-visible {
      background: var(--persian-blue);
      color: #fff;
    }
  }
}
.modal-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.7rem;
}
.modal-title {
  font-size: 1.7rem;
  font-weight: 800;
  color: var(--persian-blue);
  margin-bottom: 0.2rem;
}
.modal-desc {
  font-size: 1.1rem;
  color: var(--ebony-clay);
  opacity: 0.88;
  margin-bottom: 0.3rem;
}
.modal-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  .modal-tech-tag {
    background: var(--picton-blue);
    color: #fff;
    border-radius: 8px;
    font-size: 0.98em;
    padding: 0.2em 0.8em;
    font-weight: 600;
    transition: background 0.18s;
    &:hover {
      background: var(--bright-sun);
      color: var(--ebony-clay);
    }
  }
}
.modal-actions {
  display: flex;
  gap: 0.7rem;
  margin-top: 0.7rem;
  .cta-btn {
    background: var(--bright-sun);
    color: var(--ebony-clay);
    border: none;
    border-radius: 10px;
    padding: 0.5rem 1.2rem;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.22s, color 0.22s, box-shadow 0.22s, transform 0.22s;
    box-shadow: 0 2px 8px 0 var(--bright-sun-alpha);
    &:hover, &:focus-visible {
      background: var(--picton-blue);
      color: #fff;
      box-shadow: 0 0 16px 4px var(--picton-blue);
      transform: scale(1.06);
    }
    &.alt {
      background: var(--persian-blue);
      color: #fff;
      &:hover, &:focus-visible {
        background: var(--bright-sun);
        color: var(--ebony-clay);
      }
    }
    &.share {
      background: var(--picton-blue);
      color: #fff;
      &:hover, &:focus-visible {
        background: var(--bright-sun);
        color: var(--ebony-clay);
      }
    }
  }
}
// Modal fade
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.32s cubic-bezier(0.25,0.46,0.45,0.94);
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-to, .modal-fade-leave-from {
  opacity: 1;
}
// Responsive
@media (max-width: 1023px) {
  .gallery-grid {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.2rem;
  }
  .portfolio-modal-card {
    max-width: 98vw;
    padding: 1.2rem 0.5rem 1.2rem 0.5rem;
  }
}
@media (max-width: 767px) {
  .gallery-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  .portfolio-modal-card {
    max-width: 100vw;
    padding: 0.5rem;
    border-radius: 18px;
  }
}
</style>
