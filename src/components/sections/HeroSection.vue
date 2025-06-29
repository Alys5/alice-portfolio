<template>
  <section
    class="hero-section"
    aria-labelledby="hero-title"
    role="banner"
  >
    <!-- Skip link per accessibilità -->
    <a href="#main-content" class="skip-link">
      {{ t('accessibility.skipToContent') }}
    </a>

    <div class="hero-container">
      <!-- Badge premio -->
      <div class="hero-badge" v-if="heroData.badge">
        <span class="badge-text">{{ heroData.badge }}</span>
      </div>

      <!-- Contenuto principale -->
      <div class="hero-content">
        <h1
          id="hero-title"
          class="hero-title"
          ref="titleRef"
        >
          {{ heroData.title }}
        </h1>

        <!-- Typewriter effect -->
        <div class="typewriter-container">
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

        <!-- Call to Action -->
        <div class="hero-actions">
          <button
            class="btn btn-primary"
            @click="handlePrimaryCTA"
            :aria-label="heroData.cta"
          >
            <span class="btn-text">{{ heroData.cta }}</span>
            <span class="btn-icon">→</span>
          </button>

          <button
            class="btn btn-secondary"
            @click="handleSecondaryCTA"
            :aria-label="heroData.ctaSecondary"
          >
            <span class="btn-text">{{ heroData.ctaSecondary }}</span>
            <span class="btn-icon">↓</span>
          </button>
        </div>
      </div>

      <!-- Elementi decorativi -->
      <div class="hero-decoration">
        <div class="floating-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="scroll-indicator" aria-hidden="true">
      <div class="scroll-line"></div>
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
}>()

// Composables
const { t } = useI18n()

// Template refs
const titleRef = ref<HTMLElement>()
const typewriterRef = ref<HTMLElement>()

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
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: linear-gradient(135deg, var(--persian-blue), var(--picton-blue));
  overflow: hidden;

  // Glassmorphism overlay
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
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
  border-radius: 4px;
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
  padding: 0 2rem;
  text-align: center;
}

.hero-badge {
  margin-bottom: 2rem;

  .badge-text {
    display: inline-block;
    background: var(--bright-sun);
    color: var(--ebony-clay);
    padding: 0.5rem 1rem;
    border-radius: 50px;
    font-size: 0.875rem;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(255, 201, 64, 0.3);
    animation: badgeFloat 3s ease-in-out infinite;
  }
}

.hero-content {
  margin-bottom: 3rem;
}

.hero-title {
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 800;
  color: var(--bright-sun);
  margin-bottom: 1.5rem;
  line-height: 1.1;
  text-shadow: 0 0 20px rgba(255, 201, 64, 0.3);
}

.typewriter-container {
  font-size: clamp(1.25rem, 4vw, 2rem);
  color: white;
  margin-bottom: 2rem;
  min-height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
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
  margin: 0 auto 3rem;
}

.hero-desc {
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 1rem;

  &.primary {
    color: white;
    font-weight: 500;
  }

  &.secondary {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1rem;
  }
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
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
  text-decoration: none;
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
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
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
    box-shadow: 0 8px 25px rgba(255, 201, 64, 0.4);
  }
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
  }
}

.btn-icon {
  transition: transform 0.3s ease;
}

.btn:hover .btn-icon {
  transform: translateX(4px);
}

.hero-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.floating-shapes {
  position: relative;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: var(--bright-sun-alpha);
  animation: float 6s ease-in-out infinite;

  &.shape-1 {
    width: 100px;
    height: 100px;
    top: 20%;
    left: 10%;
    animation-delay: 0s;
  }

  &.shape-2 {
    width: 60px;
    height: 60px;
    top: 60%;
    right: 15%;
    animation-delay: 2s;
  }

  &.shape-3 {
    width: 80px;
    height: 80px;
    bottom: 20%;
    left: 20%;
    animation-delay: 4s;
  }
}

.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.6);
  z-index: 2;
}

.scroll-line {
  width: 2px;
  height: 40px;
  background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.6));
  animation: scrollPulse 2s ease-in-out infinite;
}

.scroll-text {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 2px;
}

// Animations
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

@keyframes badgeFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

@keyframes scrollPulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

// Responsive design
@media (max-width: 768px) {
  .hero-container {
    padding: 0 1rem;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .btn {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }

  .typewriter-container {
    flex-direction: column;
    gap: 0.25rem;
  }

  .typewriter-text {
    min-width: auto;
    text-align: center;
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .hero-title,
  .btn,
  .shape,
  .badge-text,
  .scroll-line {
    animation: none;
    transition: none;
  }

  .btn:hover {
    transform: none;
  }
}

// High contrast mode
@media (prefers-contrast: high) {
  .hero-title {
    text-shadow: 2px 2px 0 var(--ebony-clay);
  }

  .btn-primary {
    border: 2px solid var(--ebony-clay);
  }

  .btn-secondary {
    border-width: 3px;
  }
}
</style>
