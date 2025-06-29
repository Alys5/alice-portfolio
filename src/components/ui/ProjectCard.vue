<template>
  <div
    class="project-card"
    :class="{ 'is-visible': isVisible, 'is-featured': props.project.featured }"
    @click="handleSelect"
    @keydown.enter="handleSelect"
    @keydown.space.prevent="handleSelect"
    tabindex="0"
    role="button"
    :aria-label="`Progetto ${props.project.title} - ${props.project.description}`"
  >
    <!-- Immagine progetto -->
    <div class="project-image">
      <img
        :src="props.project.image"
        :alt="`Screenshot del progetto ${props.project.title}`"
        loading="lazy"
        @error="handleImageError"
      />

      <!-- Overlay hover -->
      <div class="image-overlay">
        <div class="overlay-content">
          <span class="view-project">Visualizza Progetto</span>
          <span class="overlay-icon">→</span>
        </div>
      </div>

      <!-- Badge featured -->
      <div v-if="props.project.featured" class="featured-badge">
        <span class="badge-text">Featured</span>
      </div>
    </div>

    <!-- Contenuto progetto -->
    <div class="project-content">
      <h3 class="project-title">{{ props.project.title }}</h3>
      <p class="project-description">{{ props.project.description }}</p>

      <!-- Tecnologie -->
      <div class="project-technologies" v-if="props.project.technologies.length">
        <div class="tech-tags">
          <span
            v-for="tech in props.project.technologies.slice(0, 4)"
            :key="tech"
            class="tech-tag"
          >
            {{ tech }}
          </span>
          <span
            v-if="props.project.technologies.length > 4"
            class="tech-tag more"
          >
            +{{ props.project.technologies.length - 4 }}
          </span>
        </div>
      </div>

      <!-- Categoria -->
      <div class="project-category">
        <span class="category-badge">{{ getCategoryName(props.project.category) }}</span>
      </div>
    </div>

    <!-- Elemento decorativo -->
    <div class="card-decoration"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Interfaces
interface Project {
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
  category: string
  featured?: boolean
}

// Props
interface Props {
  project: Project
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'select': [projectId: string]
}>()

// Reactive state
const isVisible = ref(false)

// Event handlers
const handleSelect = () => {
  emit('select', props.project.id)
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = '/images/placeholder-project.jpg'
}

// Helper functions
const getCategoryName = (category: string): string => {
  const categoryMap: Record<string, string> = {
    'enterprise': 'Enterprise',
    'ai': 'AI Solutions',
    'ecommerce': 'E-commerce',
    'web': 'Web App',
    'mobile': 'Mobile App'
  }
  return categoryMap[category] || category
}

// Lifecycle
onMounted(() => {
  // Trigger visibility animation
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})
</script>

<style scoped lang="scss">
.project-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  opacity: 0;
  transform: translateY(30px);

  &.is-visible {
    opacity: 1;
    transform: translateY(0);
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    border-color: var(--bright-sun);

    .image-overlay {
      opacity: 1;
    }

    .card-decoration {
      transform: scale(1.2);
      opacity: 0.3;
    }
  }

  &.is-featured {
    border-color: var(--bright-sun);
    box-shadow: 0 8px 25px rgba(255, 201, 64, 0.2);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--bright-sun), var(--persian-blue));
      z-index: 2;
    }
  }

  &:focus {
    outline: 2px solid var(--bright-sun);
    outline-offset: 2px;
  }
}

.project-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }

  .project-card:hover & img {
    transform: scale(1.05);
  }
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.overlay-content {
  text-align: center;
  color: white;
}

.view-project {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.overlay-icon {
  font-size: 1.5rem;
  color: var(--bright-sun);
}

.featured-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--bright-sun);
  color: var(--ebony-clay);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  z-index: 2;
}

.project-content {
  padding: 1.5rem;
}

.project-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--bright-sun);
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.project-description {
  font-size: 0.875rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-technologies {
  margin-bottom: 1rem;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  background: rgba(255, 201, 64, 0.1);
  color: var(--bright-sun);
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid rgba(255, 201, 64, 0.2);

  &.more {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.6);
    border-color: rgba(255, 255, 255, 0.2);
  }
}

.project-category {
  display: flex;
  justify-content: flex-end;
}

.category-badge {
  background: var(--persian-blue);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.card-decoration {
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, var(--bright-sun) 0%, transparent 70%);
  opacity: 0.1;
  border-radius: 50%;
  transition: all 0.4s ease;
  pointer-events: none;
}

// Responsive design
@media (max-width: 768px) {
  .project-image {
    height: 180px;
  }

  .project-content {
    padding: 1rem;
  }

  .project-title {
    font-size: 1.125rem;
  }

  .project-description {
    font-size: 0.8rem;
  }

  .tech-tag {
    font-size: 0.7rem;
    padding: 0.2rem 0.4rem;
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .project-card {
    transition: none;
    opacity: 1;
    transform: none;

    &:hover {
      transform: none;
    }
  }

  .project-image img {
    transition: none;

    .project-card:hover & {
      transform: none;
    }
  }

  .image-overlay {
    transition: none;
  }

  .card-decoration {
    transition: none;

    .project-card:hover & {
      transform: none;
    }
  }
}

// High contrast mode
@media (prefers-contrast: high) {
  .project-card {
    border-width: 2px;

    &.is-featured {
      border-width: 3px;
    }
  }

  .tech-tag {
    border-width: 2px;
  }
}
</style>
