<template>
  <section
    class="neumorphic-hero-section"
    aria-labelledby="hero-title"
    role="banner"
  >
    <!-- Skip link per accessibilità -->
    <a href="#main-content" class="skip-link">
      {{ t('accessibility.skipToContent') }}
    </a>

    <div class="hero-container">
      <!-- Badge premio neumorphic -->
      <div class="neumorphic-badge" v-if="heroData.badge">
        <span class="badge-text">{{ heroData.badge }}</span>
      </div>

      <!-- Contenuto principale neumorphic -->
      <div class="neumorphic-hero-card">
        <div class="hero-content">
          <h1
            id="hero-title"
            class="hero-title"
            ref="titleRef"
          >
            {{ heroData.title }}
          </h1>

          <!-- Typewriter effect neumorphic -->
          <div class="typewriter-container neumorphic-typewriter">
            <span class="typewriter-prefix">{{ heroData.typewriterPrefix }}</span>
            <span
              class="typewriter-text"
              ref="typewriterRef"
              aria-live="polite"
            ></span>
            <span class="typewriter-cursor">|</span>
          </div>

          <!-- Descrizioni -->
          <div class="hero-descriptions">
            <p class="hero-desc primary">{{ heroData.desc1 }}</p>
            <p class="hero-desc secondary">{{ heroData.desc2 }}</p>
          </div>

          <!-- Call to Action neumorphic -->
          <div class="hero-actions">
            <button
              class="neumorphic-button primary"
              @click="handlePrimaryCTA"
              :aria-label="heroData.cta"
            >
              <span class="btn-text">{{ heroData.cta }}</span>
              <span class="btn-icon">→</span>
            </button>

            <button
              class="neumorphic-button secondary"
              @click="handleSecondaryCTA"
              :aria-label="heroData.ctaSecondary"
            >
              <span class="btn-text">{{ heroData.ctaSecondary }}</span>
              <span class="btn-icon">↓</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Skills preview neumorphic -->
      <div class="neumorphic-skills-preview">
        <div
          v-for="skill in skills"
          :key="skill.id"
          class="neumorphic-skill-item"
          @mouseenter="handleSkillHover(skill.id)"
        >
          <div class="skill-icon neumorphic-icon">
            <component :is="skill.icon" />
          </div>
          <span class="skill-name">{{ skill.name }}</span>
        </div>
      </div>

      <!-- Elementi decorativi fluttuanti -->
      <div class="floating-elements">
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
        <div class="floating-shape shape-4"></div>
      </div>
    </div>

    <!-- Scroll indicator neumorphic -->
    <div class="neumorphic-scroll-indicator" aria-hidden="true">
      <div class="scroll-line neumorphic-progress">
        <div class="progress-bar"></div>
      </div>
      <span class="scroll-text">Scroll</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

// Props interface
interface Props {
  typewriterTerms?: string[]
  typewriterSpeed?: number
  typewriterDelay?: number
}

const props = withDefaults(defineProps<Props>(), {
  typewriterTerms: () => ['enterprise', 'startup', 'AI', 'innovation'],
  typewriterSpeed: 100,
  typewriterDelay: 2000
})

// Emits
const emit = defineEmits<{
  'primary-cta': []
  'secondary-cta': []
  'skill-hover': [skillId: string]
}>()

// Composables
const { t } = useI18n()

// Template refs
const titleRef = ref<HTMLElement>()
const typewriterRef = ref<HTMLElement>()

// Skills data
const skills = ref([
  { id: 'vue', name: 'Vue.js', icon: 'VueIcon' },
  { id: 'react', name: 'React', icon: 'ReactIcon' },
  { id: 'ai', name: 'AI/ML', icon: 'AIIcon' },
  { id: 'ux', name: 'UX Design', icon: 'UXIcon' }
])

// Computed properties
const heroData = computed(() => ({
  badge: t('pages.home.hero.badge'),
  title: t('pages.home.hero.title'),
  typewriterPrefix: t('pages.home.hero.typewriterPrefix'),
  desc1: t('pages.home.hero.desc1'),
  desc2: t('pages.home.hero.desc2'),
  cta: t('pages.home.hero.cta'),
  ctaSecondary: t('pages.home.hero.ctaSecondary')
}))

// Typewriter effect
let typewriterInterval: number | null = null
let currentTermIndex = 0
let currentCharIndex = 0
let isDeleting = false

const typewriterEffect = () => {
  if (!typewriterRef.value) return

  const currentTerm = props.typewriterTerms[currentTermIndex]

  if (isDeleting) {
    // Deleting effect
    typewriterRef.value.textContent = currentTerm.substring(0, currentCharIndex - 1)
    currentCharIndex--

    if (currentCharIndex === 0) {
      isDeleting = false
      currentTermIndex = (currentTermIndex + 1) % props.typewriterTerms.length
    }
  } else {
    // Typing effect
    typewriterRef.value.textContent = currentTerm.substring(0, currentCharIndex + 1)
    currentCharIndex++

    if (currentCharIndex === currentTerm.length) {
      isDeleting = true
      setTimeout(() => {
        typewriterEffect()
      }, props.typewriterDelay)
      return
    }
  }

  typewriterInterval = setTimeout(typewriterEffect, props.typewriterSpeed)
}

// Event handlers
const handlePrimaryCTA = () => {
  emit('primary-cta')
}

const handleSecondaryCTA = () => {
  emit('secondary-cta')
}

const handleSkillHover = (skillId: string) => {
  emit('skill-hover', skillId)
}

// Lifecycle
onMounted(() => {
  // Start typewriter effect
  setTimeout(typewriterEffect, 1000)

  // Add entrance animations
  if (titleRef.value) {
    titleRef.value.style.opacity = '0'
    titleRef.value.style.transform = 'translateY(30px)'

    setTimeout(() => {
      if (titleRef.value) {
        titleRef.value.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
        titleRef.value.style.opacity = '1'
        titleRef.value.style.transform = 'translateY(0)'
      }
    }, 300)
  }
})

onUnmounted(() => {
  if (typewriterInterval) {
    clearTimeout(typewriterInterval)
  }
})
</script>

<style scoped lang="scss">
.neumorphic-hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: linear-gradient(135deg, var(--charcoal) 0%, var(--ebony-clay) 50%, var(--persian-blue) 100%);
  overflow: hidden;
  padding: var(--space-8) var(--space-4);

  // Neumorphic overlay
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center,
      rgba(255, 201, 64, 0.05) 0%,
      transparent 70%
    );
    z-index: 1;
  }
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--bright-sun);
  color: var(--ebony-clay);
  padding: 8px 16px;
  text-decoration: none;
  border-radius: var(--radius-neumorphic-medium);
  font-weight: 600;
  z-index: 1000;
  transition: top 0.3s ease;

  &:focus {
    top: 6px;
  }
}

.hero-container {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  width: 100%;
}

.neumorphic-badge {
  margin-bottom: var(--space-8);

  .badge-text {
    display: inline-block;
    @include neumorphic-style(var(--bright-sun), 'light', 'raised');
    color: var(--ebony-clay);
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-neumorphic-round);
    font-size: var(--font-size-sm);
    font-weight: 600;
    animation: badgeFloat 3s ease-in-out infinite;
  }
}

.neumorphic-hero-card {
  @include neumorphic-style(var(--ebony-clay), 'heavy', 'raised');
  max-width: 900px;
  margin: 0 auto var(--space-16);
  padding: var(--space-12);
  text-align: center;

  @include neumorphic-hover('heavy');
}

.hero-content {
  .hero-title {
    font-size: var(--font-size-hero);
    font-weight: 800;
    background: linear-gradient(135deg, var(--bright-sun), var(--emerald));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: var(--space-6);
    line-height: 1.1;
    text-shadow: 0 0 20px rgba(255, 201, 64, 0.3);
  }
}

.neumorphic-typewriter {
  @include neumorphic-style(var(--charcoal), 'light', 'pressed');
  font-size: var(--font-size-xl);
  color: white;
  margin-bottom: var(--space-8);
  min-height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  flex-wrap: wrap;
  padding: var(--space-4);
  border-radius: var(--radius-neumorphic-medium);
}

.typewriter-prefix {
  color: rgba(255, 255, 255, 0.8);
}

.typewriter-text {
  color: var(--bright-sun);
  font-weight: 600;
  min-width: 200px;
  text-align: left;
}

.typewriter-cursor {
  color: var(--bright-sun);
  animation: blink 1s infinite;
  font-weight: 600;
}

.hero-descriptions {
  max-width: 800px;
  margin: 0 auto var(--space-8);
}

.hero-desc {
  font-size: var(--font-size-lg);
  line-height: 1.6;
  margin-bottom: var(--space-4);

  &.primary {
    color: white;
    font-weight: 500;
  }

  &.secondary {
    color: rgba(255, 255, 255, 0.8);
    font-size: var(--font-size-base);
  }
}

.hero-actions {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: var(--space-8);
}

.neumorphic-skills-preview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--space-6);
  max-width: 600px;
  margin: 0 auto;
}

.neumorphic-skill-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }

  .skill-name {
    font-size: var(--font-size-sm);
    color: var(--bright-sun);
    font-weight: 500;
  }
}

.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  background: var(--bright-sun-alpha);
  animation: float 6s ease-in-out infinite;

  &.shape-1 {
    width: 80px;
    height: 80px;
    top: 15%;
    left: 8%;
    animation-delay: 0s;
  }

  &.shape-2 {
    width: 50px;
    height: 50px;
    top: 70%;
    right: 12%;
    animation-delay: 2s;
  }

  &.shape-3 {
    width: 60px;
    height: 60px;
    bottom: 25%;
    left: 15%;
    animation-delay: 4s;
  }

  &.shape-4 {
    width: 40px;
    height: 40px;
    top: 40%;
    right: 25%;
    animation-delay: 1s;
  }
}

.neumorphic-scroll-indicator {
  position: absolute;
  bottom: var(--space-8);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  color: rgba(255, 255, 255, 0.6);
  z-index: 2;
}

.scroll-line {
  width: 3px;
  height: 50px;
  border-radius: var(--radius-neumorphic-round);

  .progress-bar {
    height: 100%;
    background: linear-gradient(to bottom, transparent, var(--bright-sun));
    border-radius: inherit;
    animation: scrollPulse 2s ease-in-out infinite;
  }
}

.scroll-text {
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 500;
}

// Animations
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

@keyframes badgeFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(180deg); }
}

@keyframes scrollPulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

// Responsive design
@media (max-width: 768px) {
  .neumorphic-hero-section {
    padding: var(--space-4) var(--space-2);
  }

  .neumorphic-hero-card {
    padding: var(--space-8);
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .neumorphic-typewriter {
    flex-direction: column;
    gap: var(--space-1);
  }

  .typewriter-text {
    min-width: auto;
    text-align: center;
  }

  .neumorphic-skills-preview {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .hero-title,
  .floating-shape,
  .badge-text,
  .scroll-line .progress-bar {
    animation: none;
    transition: none;
  }

  .neumorphic-skill-item:hover {
    transform: none;
  }
}

// High contrast mode
@media (prefers-contrast: high) {
  .hero-title {
    text-shadow: 2px 2px 0 var(--ebony-clay);
  }

  .neumorphic-button {
    border: 2px solid var(--ebony-clay);
  }
}
</style>
