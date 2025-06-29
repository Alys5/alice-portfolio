<template>
  <section
    class="about-section"
    id="about"
    aria-labelledby="about-title"
  >
    <div class="about-container">
      <!-- Header sezione -->
      <div class="section-header">
        <h2 id="about-title" class="section-title">
          {{ aboutData.title }}
        </h2>
        <p class="section-subtitle">
          {{ aboutData.subtitle }}
        </p>
      </div>

      <!-- Contenuto principale -->
      <div class="about-content">
        <!-- Descrizione -->
        <div class="about-description">
          <p class="description-text">
            {{ aboutData.description }}
          </p>
        </div>

        <!-- Statistiche -->
        <div class="stats-grid" v-if="stats.length">
          <StatCard
            v-for="stat in stats"
            :key="stat.id"
            :value="stat.value"
            :label="stat.label"
            :icon="stat.icon"
            :color="stat.color"
          />
        </div>

        <!-- Valori personali -->
        <div class="values-section" v-if="values.length">
          <h3 class="values-title">
            {{ t('about.values.title') }}
          </h3>
          <div class="values-grid">
            <div
              v-for="value in values"
              :key="value.id"
              class="value-card"
              :class="{ 'is-visible': isVisible }"
            >
              <div class="value-icon">
                <span class="icon">{{ value.icon }}</span>
              </div>
              <h4 class="value-title">{{ value.title }}</h4>
              <p class="value-description">{{ value.description }}</p>
            </div>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="about-cta">
          <button
            class="btn btn-primary"
            @click="handleContactCTA"
            :aria-label="t('common.actions.startProject')"
          >
            <span class="btn-text">{{ t('common.actions.startProject') }}</span>
            <span class="btn-icon">→</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import StatCard from '../ui/StatCard.vue'

// Props interface
interface Stat {
  id: string
  value: string | number
  label: string
  icon?: string
  color?: string
}

interface Value {
  id: string
  title: string
  description: string
  icon: string
}

interface Props {
  stats?: Stat[]
  values?: Value[]
}

const props = withDefaults(defineProps<Props>(), {
  stats: () => [
    {
      id: 'projects',
      value: '50+',
      label: 'Progetti Completati',
      icon: '🚀',
      color: 'var(--bright-sun)'
    },
    {
      id: 'experience',
      value: '5+',
      label: 'Anni di Esperienza',
      icon: '⏱️',
      color: 'var(--persian-blue)'
    },
    {
      id: 'clients',
      value: '30+',
      label: 'Clienti Soddisfatti',
      icon: '👥',
      color: 'var(--picton-blue)'
    }
  ],
  values: () => [
    {
      id: 'innovation',
      title: 'Innovazione',
      description: 'Sempre alla ricerca delle ultime tecnologie e trend del design.',
      icon: '💡'
    },
    {
      id: 'quality',
      title: 'Qualità',
      description: 'Codice pulito, design elegante e performance ottimali.',
      icon: '✨'
    },
    {
      id: 'collaboration',
      title: 'Collaborazione',
      description: 'Lavoro a stretto contatto con i clienti per risultati eccellenti.',
      icon: '🤝'
    }
  ]
})

// Emits
const emit = defineEmits<{
  'contact-cta': []
}>()

// Composables
const { t } = useI18n()

// Reactive state
const isVisible = ref(false)

// Computed properties
const aboutData = computed(() => ({
  title: t('pages.home.about.title'),
  subtitle: t('pages.home.about.subtitle'),
  description: t('pages.home.about.description')
}))

const stats = computed(() => props.stats)
const values = computed(() => props.values)

// Event handlers
const handleContactCTA = () => {
  emit('contact-cta')
}

// Lifecycle
onMounted(() => {
  // Trigger visibility animation
  setTimeout(() => {
    isVisible.value = true
  }, 300)
})
</script>

<style scoped lang="scss">
.about-section {
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
    background: radial-gradient(circle at 30% 20%, var(--bright-sun-alpha) 0%, transparent 50%),
                radial-gradient(circle at 70% 80%, var(--picton-blue-alpha) 0%, transparent 50%);
    z-index: 1;
  }
}

.about-container {
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
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.about-content {
  display: grid;
  gap: 4rem;
}

.about-description {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.description-text {
  font-size: 1.125rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
}

.values-section {
  margin-top: 4rem;
}

.values-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--bright-sun);
  text-align: center;
  margin-bottom: 3rem;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.value-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
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
    border-color: var(--bright-sun-alpha);
  }

  // Staggered animation
  @for $i from 1 through 4 {
    &:nth-child(#{$i}) {
      transition-delay: #{$i * 0.1}s;
    }
  }
}

.value-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, var(--bright-sun), var(--persian-blue));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(255, 201, 64, 0.3);

  .icon {
    font-size: 2rem;
  }
}

.value-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--bright-sun);
  margin-bottom: 1rem;
}

.value-description {
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
}

.about-cta {
  text-align: center;
  margin-top: 3rem;
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
  .about-section {
    padding: 4rem 0;
  }

  .about-container {
    padding: 0 1rem;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .values-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .value-card {
    padding: 1.5rem;
  }

  .value-icon {
    width: 60px;
    height: 60px;

    .icon {
      font-size: 1.5rem;
    }
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .value-card {
    transition: none;
    opacity: 1;
    transform: none;

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
  .value-card {
    border-width: 2px;
    border-color: var(--bright-sun);
  }

  .btn-primary {
    border: 2px solid var(--ebony-clay);
  }
}
</style>
