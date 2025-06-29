<template>
  <section
    class="skills-section"
    id="skills"
    aria-labelledby="skills-title"
  >
    <div class="skills-container">
      <!-- Header sezione -->
      <div class="section-header">
        <h2 id="skills-title" class="section-title">
          {{ skillsData.title }}
        </h2>
        <p class="section-subtitle">
          {{ skillsData.subtitle }}
        </p>
      </div>

      <!-- Grid categorie competenze -->
      <div class="skills-grid">
        <div
          v-for="category in skillCategories"
          :key="category.id"
          class="skill-category"
          :class="{ 'is-visible': isVisible }"
        >
          <!-- Header categoria -->
          <div class="category-header">
            <div class="category-icon">
              <span class="icon">{{ category.icon }}</span>
            </div>
            <h3 class="category-title">{{ category.title }}</h3>
            <p class="category-description">{{ category.description }}</p>
          </div>

          <!-- Skills della categoria -->
          <div class="skills-list">
            <SkillTag
              v-for="skill in category.skills"
              :key="skill.name"
              :name="skill.name"
              :level="skill.level"
              :color="category.color"
            />
          </div>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="skills-cta">
        <p class="cta-text">
          {{ t('skills.cta.text') }}
        </p>
        <button
          class="btn btn-primary"
          @click="handleContactCTA"
          :aria-label="t('skills.cta.button')"
        >
          <span class="btn-text">{{ t('skills.cta.button') }}</span>
          <span class="btn-icon">→</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import SkillTag from '@/components/ui/SkillTag.vue'

// Props interface
interface Skill {
  name: string
  level: number // 1-5
}

interface SkillCategory {
  id: string
  title: string
  description: string
  icon: string
  color: string
  skills: Skill[]
}

interface Props {
  categories?: SkillCategory[]
}

const props = withDefaults(defineProps<Props>(), {
  categories: () => [
    {
      id: 'frontend',
      title: 'Frontend Development',
      description: 'Sviluppo di interfacce moderne e responsive con framework JavaScript avanzati.',
      icon: '🎨',
      color: 'var(--bright-sun)',
      skills: [
        { name: 'Vue.js', level: 5 },
        { name: 'React', level: 4 },
        { name: 'TypeScript', level: 5 },
        { name: 'SCSS/Sass', level: 5 },
        { name: 'HTML5/CSS3', level: 5 },
        { name: 'JavaScript ES6+', level: 5 },
        { name: 'Angular', level: 3 },
        { name: 'Tailwind CSS', level: 4 }
      ]
    },
    {
      id: 'backend',
      title: 'Backend & DevOps',
      description: 'Sviluppo backend e gestione infrastrutture cloud per applicazioni scalabili.',
      icon: '⚙️',
      color: 'var(--persian-blue)',
      skills: [
        { name: 'Node.js', level: 4 },
        { name: 'Laravel', level: 4 },
        { name: 'Docker', level: 3 },
        { name: 'AWS', level: 3 },
        { name: 'MySQL', level: 4 },
        { name: 'MongoDB', level: 3 },
        { name: 'REST API', level: 5 },
        { name: 'Git', level: 5 }
      ]
    },
    {
      id: 'design',
      title: 'UI/UX Design',
      description: 'Progettazione di esperienze utente intuitive e design system scalabili.',
      icon: '🎯',
      color: 'var(--picton-blue)',
      skills: [
        { name: 'Figma', level: 5 },
        { name: 'Adobe XD', level: 4 },
        { name: 'Design System', level: 5 },
        { name: 'Prototyping', level: 4 },
        { name: 'User Research', level: 3 },
        { name: 'Accessibility', level: 5 },
        { name: 'Responsive Design', level: 5 },
        { name: 'Animation', level: 4 }
      ]
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
const skillsData = computed(() => ({
  title: t('skills.title'),
  subtitle: t('skills.subtitle')
}))

const skillCategories = computed(() => props.categories)

// Event handlers
const handleContactCTA = () => {
  emit('contact-cta')
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
.skills-section {
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
    background: radial-gradient(circle at 20% 70%, var(--bright-sun-alpha) 0%, transparent 50%),
                radial-gradient(circle at 80% 30%, var(--persian-blue-alpha) 0%, transparent 50%);
    z-index: 1;
  }
}

.skills-container {
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

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.skill-category {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  opacity: 0;
  transform: translateY(30px);

  &.is-visible {
    opacity: 1;
    transform: translateY(0);
  }

  &:hover {
    border-color: var(--accent-color);
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }
}

.category-header {
  text-align: center;
  margin-bottom: 2rem;
}

.category-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--accent-color), var(--bright-sun-light));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  box-shadow: 0 8px 25px rgba(255, 201, 64, 0.3);
  transition: all 0.3s ease;

  .icon {
    font-size: 2rem;
  }

  .skill-category:hover & {
    transform: scale(1.1);
    box-shadow: 0 12px 35px rgba(255, 201, 64, 0.4);
  }
}

.category-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-color);
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.category-description {
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.skills-cta {
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 3rem 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.cta-text {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  line-height: 1.6;
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
  .skills-section {
    padding: 4rem 0;
  }

  .skills-container {
    padding: 0 1rem;
  }

  .skills-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .skill-category {
    padding: 1.5rem;
  }

  .category-icon {
    width: 60px;
    height: 60px;

    .icon {
      font-size: 1.5rem;
    }
  }

  .category-title {
    font-size: 1.25rem;
  }

  .skills-cta {
    padding: 2rem 1.5rem;
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .skill-category {
    transition: none;
    opacity: 1;
    transform: none;

    &:hover {
      transform: none;
    }
  }

  .category-icon {
    transition: none;

    .skill-category:hover & {
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
  .skill-category {
    border-width: 2px;

    &:hover {
      border-width: 3px;
    }
  }

  .skills-cta {
    border-width: 2px;
    border-color: var(--bright-sun);
  }

  .btn-primary {
    border: 2px solid var(--ebony-clay);
  }
}
</style>
