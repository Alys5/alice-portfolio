<template>
  <section
    class="experience-section"
    id="experience"
    aria-labelledby="experience-title"
  >
    <div class="experience-container">
      <!-- Header sezione -->
      <div class="section-header">
        <h2 id="experience-title" class="section-title">
          {{ experienceData.title }}
        </h2>
        <p class="section-subtitle">
          {{ experienceData.subtitle }}
        </p>
      </div>

      <!-- Timeline esperienze -->
      <div class="experience-timeline">
        <div
          v-for="(experience, index) in experiences"
          :key="experience.id"
          class="timeline-item"
          :class="{ 'is-visible': isVisible }"
        >
          <!-- Timeline marker -->
          <div class="timeline-marker">
            <div class="marker-dot"></div>
            <div class="marker-line" v-if="index < experiences.length - 1"></div>
          </div>

          <!-- Contenuto esperienza -->
          <div class="experience-content">
            <div class="experience-header">
              <h3 class="experience-title">{{ experience.title }}</h3>
              <div class="experience-meta">
                <span class="company">{{ experience.company }}</span>
                <span class="period">{{ experience.period }}</span>
              </div>
            </div>

            <p class="experience-description">
              {{ experience.description }}
            </p>

            <!-- Tecnologie utilizzate -->
            <div class="experience-technologies" v-if="experience.technologies.length">
              <div class="tech-tags">
                <span
                  v-for="tech in experience.technologies"
                  :key="tech"
                  class="tech-tag"
                >
                  {{ tech }}
                </span>
              </div>
            </div>

            <!-- Achievements -->
            <div class="experience-achievements" v-if="experience.achievements.length">
              <h4 class="achievements-title">Risultati principali:</h4>
              <ul class="achievements-list">
                <li
                  v-for="achievement in experience.achievements"
                  :key="achievement"
                  class="achievement-item"
                >
                  <span class="achievement-icon">✓</span>
                  <span class="achievement-text">{{ achievement }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="experience-cta">
        <button
          class="btn btn-primary"
          @click="handleDownloadCV"
          :aria-label="t('experience.cta.downloadCV')"
        >
          <span class="btn-text">{{ t('experience.cta.downloadCV') }}</span>
          <span class="btn-icon">↓</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

// Props interface
interface Experience {
  id: string
  title: string
  company: string
  period: string
  description: string
  technologies: string[]
  achievements: string[]
}

interface Props {
  experiences?: Experience[]
}

const props = withDefaults(defineProps<Props>(), {
  experiences: () => [
    {
      id: 'snam-2023',
      title: 'Senior UI Developer',
      company: 'SNAM',
      period: '2023 - Presente',
      description: 'Sviluppo di interfacce enterprise per la gestione di infrastrutture energetiche. Focus su UX/UI design e ottimizzazione performance.',
      technologies: ['Vue.js', 'TypeScript', 'SCSS', 'REST API', 'Docker'],
      achievements: [
        'Riduzione del 40% del tempo di caricamento delle interfacce',
        'Implementazione di design system scalabile',
        'Miglioramento dell\'accessibilità WCAG 2.2'
      ]
    },
    {
      id: 'paragraph-2022',
      title: 'Frontend Developer',
      company: 'Paragraph AI',
      period: '2022 - 2023',
      description: 'Sviluppo di interfacce per sistemi di intelligenza artificiale. Progettazione di workflow per la generazione automatica di contenuti.',
      technologies: ['React', 'Node.js', 'OpenAI API', 'MongoDB', 'AWS'],
      achievements: [
        'Interfaccia per sistema di scrittura automatica',
        'Integrazione con API di terze parti',
        'Ottimizzazione per dispositivi mobili'
      ]
    },
    {
      id: 'poste-2021',
      title: 'UI Developer',
      company: 'Poste Italiane',
      period: '2021 - 2022',
      description: 'Sviluppo di sistemi CRM per la gestione clienti e servizi postali. Focus su user experience e processi aziendali.',
      technologies: ['Vue.js', 'Laravel', 'MySQL', 'Redis', 'Git'],
      achievements: [
        'Sistema CRM personalizzato per servizi postali',
        'Miglioramento dei processi di gestione clienti',
        'Formazione team su best practices frontend'
      ]
    },
    {
      id: 'freelance-2020',
      title: 'Freelance Developer',
      company: 'Progetti Indipendenti',
      period: '2020 - 2021',
      description: 'Sviluppo di progetti web per clienti diversi. Specializzazione in e-commerce e applicazioni web moderne.',
      technologies: ['Vue.js', 'React', 'Laravel', 'WordPress', 'SCSS'],
      achievements: [
        'Portfolio di 15+ progetti completati',
        'Specializzazione in e-commerce',
        'Collaborazioni con agenzie creative'
      ]
    }
  ]
})

// Emits
const emit = defineEmits<{
  'download-cv': []
}>()

// Composables
const { t } = useI18n()

// Reactive state
const isVisible = ref(false)

// Computed properties
const experienceData = computed(() => ({
  title: t('experience.title'),
  subtitle: t('experience.subtitle')
}))

const experiences = computed(() => props.experiences)

// Event handlers
const handleDownloadCV = () => {
  emit('download-cv')
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
.experience-section {
  padding: 6rem 0;
  background: linear-gradient(135deg, #1a202c, var(--ebony-clay));
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
    background: radial-gradient(circle at 30% 20%, var(--persian-blue-alpha) 0%, transparent 50%),
                radial-gradient(circle at 70% 80%, var(--picton-blue-alpha) 0%, transparent 50%);
    z-index: 1;
  }
}

.experience-container {
  position: relative;
  z-index: 2;
  max-width: 1000px;
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

.experience-timeline {
  position: relative;
  margin-bottom: 4rem;
}

.timeline-item {
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
  opacity: 0;
  transform: translateX(-30px);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);

  &.is-visible {
    opacity: 1;
    transform: translateX(0);
  }

  &:nth-child(even) {
    flex-direction: row-reverse;
    transform: translateX(30px);

    &.is-visible {
      transform: translateX(0);
    }
  }
}

.timeline-marker {
  position: relative;
  flex-shrink: 0;
  width: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.marker-dot {
  width: 20px;
  height: 20px;
  background: var(--bright-sun);
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(255, 201, 64, 0.5);
  z-index: 2;
  position: relative;
}

.marker-line {
  width: 2px;
  height: 100px;
  background: linear-gradient(to bottom, var(--bright-sun), transparent);
  margin-top: 1rem;
}

.experience-content {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--bright-sun);
    transform: translateY(-4px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  }
}

.experience-header {
  margin-bottom: 1rem;
}

.experience-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--bright-sun);
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.experience-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.company {
  font-size: 1rem;
  font-weight: 600;
  color: var(--persian-blue);
}

.period {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
}

.experience-description {
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1.5rem;
}

.experience-technologies {
  margin-bottom: 1.5rem;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  background: rgba(255, 201, 64, 0.1);
  color: var(--bright-sun);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid rgba(255, 201, 64, 0.2);
}

.experience-achievements {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
}

.achievements-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--bright-sun);
  margin-bottom: 0.75rem;
}

.achievements-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.achievement-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.25rem 0;
}

.achievement-icon {
  color: var(--bright-sun);
  font-weight: 700;
  font-size: 0.75rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.achievement-text {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
}

.experience-cta {
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
  transform: translateY(2px);
}

// Responsive design
@media (max-width: 768px) {
  .experience-section {
    padding: 4rem 0;
  }

  .experience-container {
    padding: 0 1rem;
  }

  .timeline-item {
    flex-direction: column !important;
    gap: 1rem;
    transform: translateY(30px) !important;

    &.is-visible {
      transform: translateY(0) !important;
    }
  }

  .timeline-marker {
    width: 100%;
    flex-direction: row;
    justify-content: center;
  }

  .marker-line {
    width: 100px;
    height: 2px;
    margin-top: 0;
    margin-left: 1rem;
  }

  .experience-content {
    padding: 1.5rem;
  }

  .experience-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .timeline-item {
    transition: none;
    opacity: 1;
    transform: none !important;

    &.is-visible {
      transform: none !important;
    }
  }

  .experience-content {
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
  .experience-content {
    border-width: 2px;

    &:hover {
      border-width: 3px;
    }
  }

  .tech-tag {
    border-width: 2px;
  }

  .btn-primary {
    border: 2px solid var(--ebony-clay);
  }
}
</style>
