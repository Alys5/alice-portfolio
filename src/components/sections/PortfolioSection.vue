<template>
  <section
    class="portfolio-section"
    id="portfolio"
    aria-labelledby="portfolio-title"
  >
    <div class="portfolio-container">
      <!-- Header sezione -->
      <div class="section-header">
        <h2 id="portfolio-title" class="section-title">
          {{ portfolioData.title }}
        </h2>
        <p class="section-subtitle">
          {{ portfolioData.subtitle }}
        </p>
        <p class="section-description">
          {{ portfolioData.description }}
        </p>
      </div>

      <!-- Filtri -->
      <div class="portfolio-filters" v-if="categories.length">
        <button
          v-for="category in categories"
          :key="category.id"
          class="filter-btn"
          :class="{ 'is-active': activeFilter === category.id }"
          @click="setFilter(category.id)"
          :aria-label="`Filtra per ${category.name}`"
        >
          {{ category.name }}
        </button>
      </div>

      <!-- Grid progetti -->
      <div class="portfolio-grid">
        <ProjectCard
          v-for="project in filteredProjects"
          :key="project.id"
          :project="project"
          @select="handleProjectSelect"
        />
      </div>

      <!-- Call to Action -->
      <div class="portfolio-cta">
        <button
          class="btn btn-primary"
          @click="handleViewAllCTA"
          :aria-label="t('common.actions.viewAllProjects')"
        >
          <span class="btn-text">{{ t('common.actions.viewAllProjects') }}</span>
          <span class="btn-icon">→</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ProjectCard from '@/components/ui/ProjectCard.vue'

// Props interface
interface Project {
  id: string
  title: string
  description: string
  category: string
  image: string
  technologies: string[]
  link?: string
  featured?: boolean
}

interface Props {
  projects?: Project[]
  categories?: Array<{
    id: string
    name: string
  }>
}

const props = withDefaults(defineProps<Props>(), {
  projects: () => [
    {
      id: 'snam-easy',
      title: 'SNAM Easy',
      description: 'Piattaforma enterprise per la gestione semplificata dei processi aziendali. Vincitore del Nielsen Norman Award 2021.',
      category: 'enterprise',
      image: '/images/projects/snam-easy.jpg',
      technologies: ['Vue.js', 'TypeScript', 'SCSS', 'REST API'],
      link: 'https://snam-easy.com',
      featured: true
    },
    {
      id: 'paragraph-ai',
      title: 'Paragraph AI Journalist',
      description: 'Interfaccia per sistema di scrittura automatica di articoli con intelligenza artificiale.',
      category: 'ai',
      image: '/images/projects/paragraph-ai.jpg',
      technologies: ['React', 'Node.js', 'OpenAI API', 'MongoDB'],
      link: 'https://paragraph-ai.com',
      featured: true
    },
    {
      id: 'poste-crm',
      title: 'Poste Italiane CRM',
      description: 'Sistema CRM personalizzato per la gestione clienti e servizi postali.',
      category: 'enterprise',
      image: '/images/projects/poste-crm.jpg',
      technologies: ['Vue.js', 'Laravel', 'MySQL', 'Redis'],
      featured: true
    },
    {
      id: 'axa-platform',
      title: 'AXA Insurance Platform',
      description: 'Piattaforma digitale per la gestione polizze assicurative e servizi clienti.',
      category: 'enterprise',
      image: '/images/projects/axa-platform.jpg',
      technologies: ['Angular', 'Java Spring', 'PostgreSQL', 'Docker'],
      featured: false
    },
    {
      id: 'banca-generali',
      title: 'Banca Generali Portal',
      description: 'Portale bancario per la gestione conti e investimenti con interfaccia moderna.',
      category: 'enterprise',
      image: '/images/projects/banca-generali.jpg',
      technologies: ['Vue.js', 'Python', 'PostgreSQL', 'AWS'],
      featured: false
    },
    {
      id: 'marazzi-ceramiche',
      title: 'Marazzi Ceramiche E-commerce',
      description: 'Piattaforma e-commerce per la vendita di ceramiche con catalogo avanzato.',
      category: 'ecommerce',
      image: '/images/projects/marazzi.jpg',
      technologies: ['Vue.js', 'Laravel', 'MySQL', 'Elasticsearch'],
      featured: false
    }
  ],
  categories: () => [
    { id: 'all', name: 'Tutti' },
    { id: 'enterprise', name: 'Enterprise' },
    { id: 'ai', name: 'AI Solutions' },
    { id: 'ecommerce', name: 'E-commerce' }
  ]
})

// Emits
const emit = defineEmits<{
  'project-select': [projectId: string]
  'view-all': []
}>()

// Composables
const { t } = useI18n()

// Reactive state
const activeFilter = ref('all')

// Computed properties
const portfolioData = computed(() => ({
  title: t('pages.home.portfolio.title'),
  subtitle: t('pages.home.portfolio.subtitle'),
  description: t('pages.home.portfolio.description')
}))

const filteredProjects = computed(() => {
  if (activeFilter.value === 'all') {
    return props.projects
  }
  return props.projects.filter(project => project.category === activeFilter.value)
})

// Event handlers
const setFilter = (categoryId: string) => {
  activeFilter.value = categoryId
}

const handleProjectSelect = (projectId: string) => {
  emit('project-select', projectId)
}

const handleViewAllCTA = () => {
  emit('view-all')
}
</script>

<style scoped lang="scss">
.portfolio-section {
  padding: 6rem 0;
  background: linear-gradient(135deg, var(--ebony-clay), #1a202c);
  position: relative;
  overflow: hidden;

  // Glassmorphism overlay
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 70% 30%, var(--bright-sun-alpha) 0%, transparent 50%),
                radial-gradient(circle at 30% 70%, var(--picton-blue-alpha) 0%, transparent 50%);
    z-index: 1;
  }
}

.portfolio-container {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: clamp(2.5rem, 6vw, 3.5rem);
  font-weight: 800;
  color: var(--bright-sun);
  margin-bottom: 1rem;
  line-height: 1.2;
}

.section-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1rem;
  line-height: 1.6;
}

.section-description {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.portfolio-filters {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.filter-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 201, 64, 0.1);
    border-color: var(--bright-sun);
    color: var(--bright-sun);
    transform: translateY(-2px);
  }

  &.is-active {
    background: var(--bright-sun);
    border-color: var(--bright-sun);
    color: var(--ebony-clay);
    box-shadow: 0 4px 15px rgba(255, 201, 64, 0.3);
  }

  &:focus {
    outline: 2px solid var(--bright-sun);
    outline-offset: 2px;
  }
}

.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.portfolio-cta {
  text-align: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 201, 64, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
}

.btn-primary {
  background: var(--bright-sun);
  color: var(--ebony-clay);

  &:hover {
    background: #ffd166;
  }
}

.btn-icon {
  transition: transform 0.3s ease;
}

.btn:hover .btn-icon {
  transform: translateX(4px);
}

// Responsive design
@media (max-width: 768px) {
  .portfolio-section {
    padding: 4rem 0;
  }

  .portfolio-container {
    padding: 0 1rem;
  }

  .portfolio-filters {
    gap: 0.5rem;
    margin-bottom: 2rem;
  }

  .filter-btn {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
  }

  .portfolio-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .filter-btn {
    transition: none;

    &:hover {
      transform: none;
    }
  }

  .btn {
    transition: none;

    &:hover {
      transform: none;
    }
  }

  .btn-icon {
    transition: none;

    &:hover {
      transform: none;
    }
  }
}

// High contrast mode
@media (prefers-contrast: high) {
  .filter-btn {
    border-width: 2px;

    &.is-active {
      border-width: 3px;
    }
  }

  .btn-primary {
    border: 2px solid var(--ebony-clay);
  }
}
</style>
