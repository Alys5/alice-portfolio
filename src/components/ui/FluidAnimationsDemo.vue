<template>
  <section class="fluid-animations-demo">
    <div class="demo-container">
      <!-- Header -->
      <div class="demo-header" data-animation="fluid-fade">
        <h2 class="demo-title">{{ t('animations.demo.title') }}</h2>
        <p class="demo-subtitle">{{ t('animations.demo.subtitle') }}</p>
      </div>

      <!-- Fluid Fade Demo -->
      <div class="demo-section">
        <h3 class="section-title">{{ t('animations.demo.fluidFade') }}</h3>
        <div class="demo-grid">
          <div
            v-for="(item, index) in fluidItems"
            :key="item.id"
            class="demo-card animate-fluid-fade"
            :class="`animate-delay-${(index + 1) * 100}`"
            data-animation="fluid-fade"
          >
            <div class="card-icon">{{ item.icon }}</div>
            <h4 class="card-title">{{ item.title }}</h4>
            <p class="card-description">{{ item.description }}</p>
          </div>
        </div>
      </div>

      <!-- Morphing Hover Demo -->
      <div class="demo-section">
        <h3 class="section-title">{{ t('animations.demo.morphingHover') }}</h3>
        <div class="demo-grid">
          <div
            v-for="item in morphingItems"
            :key="item.id"
            class="demo-card animate-morphing-hover"
            data-animation="morphing-hover"
            @click="handleCardClick"
          >
            <div class="card-icon">{{ item.icon }}</div>
            <h4 class="card-title">{{ item.title }}</h4>
            <p class="card-description">{{ item.description }}</p>
          </div>
        </div>
      </div>

      <!-- Magnetic Hover Demo -->
      <div class="demo-section">
        <h3 class="section-title">{{ t('animations.demo.magneticHover') }}</h3>
        <div class="demo-grid">
          <button
            v-for="item in magneticItems"
            :key="item.id"
            class="magnetic-button animate-magnetic"
            ref="magneticButtons"
            @click="handleMagneticClick"
          >
            <span class="button-icon">{{ item.icon }}</span>
            <span class="button-text">{{ item.text }}</span>
          </button>
        </div>
      </div>

      <!-- Ripple Effect Demo -->
      <div class="demo-section">
        <h3 class="section-title">{{ t('animations.demo.rippleEffect') }}</h3>
        <div class="demo-grid">
          <button
            v-for="item in rippleItems"
            :key="item.id"
            class="ripple-button animate-ripple"
            @click="handleRippleClick"
          >
            <span class="button-text">{{ item.text }}</span>
          </button>
        </div>
      </div>

      <!-- Liquid Loading Demo -->
      <div class="demo-section">
        <h3 class="section-title">{{ t('animations.demo.liquidLoading') }}</h3>
        <div class="demo-grid">
          <div
            v-for="item in liquidItems"
            :key="item.id"
            class="liquid-card animate-liquid-loading"
            data-animation="liquid-loading"
          >
            <div class="liquid-content">
              <div class="liquid-icon">{{ item.icon }}</div>
              <h4 class="liquid-title">{{ item.title }}</h4>
              <div class="liquid-progress">
                <div class="progress-bar"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Kinetic Text Demo -->
      <div class="demo-section">
        <h3 class="section-title">{{ t('animations.demo.kineticText') }}</h3>
        <div class="kinetic-text-container">
          <h2
            v-for="(text, index) in kineticTexts"
            :key="index"
            class="kinetic-text animate-kinetic-text"
            :class="`animate-delay-${(index + 1) * 200}`"
            data-animation="kinetic-text"
            @click="handleKineticClick"
          >
            {{ text }}
          </h2>
        </div>
      </div>

      <!-- Gradient Shift Demo -->
      <div class="demo-section">
        <h3 class="section-title">{{ t('animations.demo.gradientShift') }}</h3>
        <div class="gradient-container">
          <div
            v-for="item in gradientItems"
            :key="item.id"
            class="gradient-card animate-gradient-shift"
            data-animation="gradient-shift"
          >
            <div class="gradient-content">
              <h4 class="gradient-title">{{ item.title }}</h4>
              <p class="gradient-description">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Floating Elements Demo -->
      <div class="demo-section">
        <h3 class="section-title">{{ t('animations.demo.floatingElements') }}</h3>
        <div class="floating-container">
          <div
            v-for="item in floatingItems"
            :key="item.id"
            class="floating-element animate-floating"
            :class="`animate-delay-${item.delay}`"
            data-animation="floating"
          >
            <div class="floating-icon">{{ item.icon }}</div>
            <span class="floating-text">{{ item.text }}</span>
          </div>
        </div>
      </div>

      <!-- Performance Monitor -->
      <div class="performance-monitor">
        <h3 class="section-title">{{ t('animations.demo.performance') }}</h3>
        <div class="performance-stats">
          <div class="stat-item">
            <span class="stat-label">{{ t('animations.demo.fps') }}</span>
            <span class="stat-value">{{ fps }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">{{ t('animations.demo.frameTime') }}</span>
            <span class="stat-value">{{ frameTime.toFixed(2) }}ms</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import useAnimations, { magneticHover, createRippleEffect } from '@/composables/useAnimations'

// Composables
const { t } = useI18n()
const { useAnimationPerformance } = useAnimations()

// Performance monitoring
const { fps, frameTime } = useAnimationPerformance()

// Template refs
const magneticButtons = ref<HTMLElement[]>([])

// Demo data
const fluidItems = ref([
  { id: 1, icon: '✨', title: 'Fluid Fade', description: 'Smooth entrance with blur effect' },
  { id: 2, icon: '🎯', title: 'Performance', description: 'Hardware accelerated animations' },
  { id: 3, icon: '♿', title: 'Accessible', description: 'Respects reduced motion preferences' },
  { id: 4, icon: '📱', title: 'Responsive', description: 'Optimized for all devices' }
])

const morphingItems = ref([
  { id: 1, icon: '🔄', title: 'Morphing', description: 'Shape-shifting on hover' },
  { id: 2, icon: '🎨', title: 'Dynamic', description: 'Real-time transformations' },
  { id: 3, icon: '⚡', title: 'Smooth', description: 'Buttery smooth transitions' }
])

const magneticItems = ref([
  { id: 1, icon: '🧲', text: 'Magnetic' },
  { id: 2, icon: '🎯', text: 'Interactive' },
  { id: 3, icon: '✨', text: 'Responsive' }
])

const rippleItems = ref([
  { id: 1, text: 'Click me!' },
  { id: 2, text: 'Ripple effect' },
  { id: 3, text: 'Touch feedback' }
])

const liquidItems = ref([
  { id: 1, icon: '💧', title: 'Liquid Loading' },
  { id: 2, icon: '🌊', title: 'Wave Effect' },
  { id: 3, icon: '⚡', title: 'Smooth Flow' }
])

const kineticTexts = ref([
  'Kinetic Typography',
  'Dynamic Text',
  'Interactive Words'
])

const gradientItems = ref([
  { id: 1, title: 'Gradient Shift', description: 'Smooth color transitions' },
  { id: 2, title: 'Color Flow', description: 'Dynamic background changes' },
  { id: 3, title: 'Visual Harmony', description: 'Beautiful color combinations' }
])

const floatingItems = ref([
  { id: 1, icon: '🦋', text: 'Floating', delay: 100 },
  { id: 2, icon: '🌟', text: 'Elements', delay: 300 },
  { id: 3, icon: '🎈', text: 'Dynamic', delay: 500 },
  { id: 4, icon: '☁️', text: 'Motion', delay: 700 }
])

// Event handlers
const handleCardClick = (event: Event) => {
  const target = event.currentTarget as HTMLElement
  target.classList.add('clicked')
  setTimeout(() => {
    target.classList.remove('clicked')
  }, 300)
}

const handleMagneticClick = (event: Event) => {
  const target = event.currentTarget as HTMLElement
  target.classList.add('magnetic-clicked')
  setTimeout(() => {
    target.classList.remove('magnetic-clicked')
  }, 500)
}

const handleRippleClick = (event: MouseEvent) => {
  createRippleEffect(event, {
    color: 'rgba(255, 201, 64, 0.4)',
    duration: 800,
    scale: 3
  })
}

const handleKineticClick = (event: Event) => {
  const target = event.currentTarget as HTMLElement
  target.classList.add('kinetic-clicked')
  setTimeout(() => {
    target.classList.remove('kinetic-clicked')
  }, 600)
}

// Lifecycle
onMounted(async () => {
  await nextTick()

  // Initialize magnetic hover for buttons
  magneticButtons.value.forEach(button => {
    if (button) {
      magneticHover(button, 0.15)
    }
  })
})
</script>

<style scoped lang="scss">
.fluid-animations-demo {
  padding: 4rem 0;
  background: linear-gradient(135deg, var(--ebony-clay), #1a202c);
  min-height: 100vh;
}

.demo-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.demo-header {
  text-align: center;
  margin-bottom: 4rem;
}

.demo-title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 800;
  color: var(--bright-sun);
  margin-bottom: 1rem;
  line-height: 1.2;
}

.demo-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.demo-section {
  margin-bottom: 4rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--bright-sun);
  margin-bottom: 2rem;
  text-align: center;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.demo-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: var(--bright-sun);
    transform: translateY(-4px);
  }

  &.clicked {
    transform: scale(0.95);
  }
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--bright-sun);
  margin-bottom: 0.5rem;
}

.card-description {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
}

.magnetic-button {
  background: linear-gradient(135deg, var(--persian-blue), var(--picton-blue));
  border: none;
  border-radius: 50px;
  padding: 1rem 2rem;
  color: white;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 25px rgba(32, 72, 180, 0.4);
  }

  &.magnetic-clicked {
    transform: scale(0.95);
  }
}

.button-icon {
  font-size: 1.25rem;
}

.ripple-button {
  background: var(--bright-sun);
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  color: var(--ebony-clay);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #ffd166;
    transform: translateY(-2px);
  }
}

.liquid-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.liquid-content {
  position: relative;
  z-index: 2;
}

.liquid-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.liquid-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--bright-sun);
  margin-bottom: 1rem;
}

.liquid-progress {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, var(--bright-sun), var(--persian-blue));
  animation: liquidProgress 2s ease-in-out infinite;
}

.kinetic-text-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
}

.kinetic-text {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  color: var(--bright-sun);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: var(--picton-blue);
  }

  &.kinetic-clicked {
    animation: kineticText 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
}

.gradient-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.gradient-card {
  background: linear-gradient(-45deg,
    var(--bright-sun),
    var(--persian-blue),
    var(--picton-blue),
    var(--bright-sun)
  );
  background-size: 400% 400%;
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  color: white;
}

.gradient-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.gradient-description {
  opacity: 0.9;
  line-height: 1.5;
}

.floating-container {
  position: relative;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.floating-element {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--bright-sun);

  &:nth-child(1) { top: 20%; left: 20%; }
  &:nth-child(2) { top: 30%; right: 25%; }
  &:nth-child(3) { bottom: 30%; left: 30%; }
  &:nth-child(4) { bottom: 20%; right: 20%; }
}

.floating-icon {
  font-size: 2rem;
}

.floating-text {
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
}

.performance-monitor {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  margin-top: 4rem;
}

.performance-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--bright-sun);
}

// Responsive design
@media (max-width: 768px) {
  .demo-container {
    padding: 0 1rem;
  }

  .demo-grid {
    grid-template-columns: 1fr;
  }

  .performance-stats {
    flex-direction: column;
    gap: 1rem;
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .demo-card,
  .magnetic-button,
  .ripple-button,
  .liquid-card,
  .kinetic-text,
  .gradient-card,
  .floating-element {
    animation: none !important;
    transition: none !important;
  }

  .demo-card:hover,
  .magnetic-button:hover,
  .ripple-button:hover {
    transform: none !important;
  }
}

// High contrast mode
@media (prefers-contrast: high) {
  .demo-card,
  .liquid-card,
  .performance-monitor {
    border-width: 2px;
  }

  .magnetic-button,
  .ripple-button {
    border: 2px solid var(--bright-sun);
  }
}
</style>
