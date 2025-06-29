<template>
  <div class="animations-example">
    <header class="example-header">
      <h1>Esempi Animazioni Portfolio Alice Mandelli</h1>
      <p>Guida pratica all'utilizzo del sistema di animazioni fluide</p>
    </header>

    <main class="example-content">
      <!-- Sezione 1: Animazioni Base -->
      <section class="example-section">
        <h2>1. Animazioni Base</h2>

        <div class="example-grid">
          <!-- Fluid Fade -->
          <div class="example-card animate-fluid-fade">
            <h3>Fluid Fade</h3>
            <p>Entrata fluida con effetto blur</p>
            <code>.animate-fluid-fade</code>
          </div>

          <!-- Morphing Hover -->
          <div class="example-card animate-morphing-hover">
            <h3>Morphing Hover</h3>
            <p>Cambio di forma al passaggio del mouse</p>
            <code>.animate-morphing-hover</code>
          </div>

          <!-- Magnetic -->
          <div class="example-card animate-magnetic">
            <h3>Magnetic Hover</h3>
            <p>Movimento magnetico al mouse</p>
            <code>.animate-magnetic</code>
          </div>
        </div>
      </section>

      <!-- Sezione 2: Micro-Interazioni -->
      <section class="example-section">
        <h2>2. Micro-Interazioni</h2>

        <div class="example-grid">
          <!-- Ripple Button -->
          <button class="ripple-button animate-ripple" @click="handleRippleClick">
            <span>Ripple Effect</span>
          </button>

          <!-- Liquid Loading -->
          <div class="liquid-card animate-liquid-loading">
            <div class="liquid-content">
              <h3>Liquid Loading</h3>
              <div class="liquid-progress">
                <div class="progress-bar"></div>
              </div>
            </div>
          </div>

          <!-- Kinetic Text -->
          <h2 class="kinetic-text animate-kinetic-text" @click="handleKineticClick">
            Kinetic Typography
          </h2>
        </div>
      </section>

      <!-- Sezione 3: Effetti Avanzati -->
      <section class="example-section">
        <h2>3. Effetti Avanzati</h2>

        <div class="example-grid">
          <!-- Gradient Shift -->
          <div class="gradient-card animate-gradient-shift">
            <h3>Gradient Shift</h3>
            <p>Transizioni fluide tra colori</p>
          </div>

          <!-- Floating Elements -->
          <div class="floating-container">
            <div class="floating-element animate-floating animate-delay-100">
              <span>🦋</span>
              <p>Floating</p>
            </div>
            <div class="floating-element animate-floating animate-delay-300">
              <span>🌟</span>
              <p>Elements</p>
            </div>
            <div class="floating-element animate-floating animate-delay-500">
              <span>🎈</span>
              <p>Dynamic</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Sezione 4: Timing e Staggering -->
      <section class="example-section">
        <h2>4. Timing e Staggering</h2>

        <div class="timing-grid">
          <div class="timing-item animate-fluid-fade animate-delay-100">
            <span>100ms</span>
          </div>
          <div class="timing-item animate-fluid-fade animate-delay-200">
            <span>200ms</span>
          </div>
          <div class="timing-item animate-fluid-fade animate-delay-300">
            <span>300ms</span>
          </div>
          <div class="timing-item animate-fluid-fade animate-delay-500">
            <span>500ms</span>
          </div>
          <div class="timing-item animate-fluid-fade animate-delay-700">
            <span>700ms</span>
          </div>
        </div>
      </section>

      <!-- Sezione 5: Performance Monitor -->
      <section class="example-section">
        <h2>5. Monitoraggio Performance</h2>

        <div class="performance-monitor">
          <div class="performance-stats">
            <div class="stat-item">
              <span class="stat-label">FPS</span>
              <span class="stat-value">{{ fps }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Frame Time</span>
              <span class="stat-value">{{ frameTime.toFixed(2) }}ms</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Reduced Motion</span>
              <span class="stat-value">{{ isReducedMotion ? 'Sì' : 'No' }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Sezione 6: Codice di Esempio -->
      <section class="example-section">
        <h2>6. Codice di Esempio</h2>

        <div class="code-examples">
          <div class="code-block">
            <h4>Vue Template</h4>
            <pre><code>&lt;template&gt;
  &lt;div class="card animate-fluid-fade"&gt;
    &lt;h3 class="kinetic-text animate-kinetic-text"&gt;
      Titolo Animato
    &lt;/h3&gt;
    &lt;button
      class="magnetic-button animate-magnetic"
      @click="handleClick"
    &gt;
      Pulsante Magnetico
    &lt;/button&gt;
  &lt;/div&gt;
&lt;/template&gt;</code></pre>
          </div>

          <div class="code-block">
            <h4>Vue Script</h4>
            <pre><code>&lt;script setup lang="ts"&gt;
import { onMounted } from 'vue'
import {
  magneticHover,
  createRippleEffect,
  useAnimationPerformance
} from '@/composables/useAnimations'

// Performance monitoring
const { fps, frameTime } = useAnimationPerformance()

// Event handlers
const handleClick = (event: MouseEvent) => {
  createRippleEffect(event, {
    color: 'rgba(255, 201, 64, 0.4)',
    duration: 800,
    scale: 3
  })
}

onMounted(() => {
  // Initialize magnetic hover
  const buttons = document.querySelectorAll('.magnetic-button')
  buttons.forEach(button =>
    magneticHover(button as HTMLElement, 0.15)
  )
})
&lt;/script&gt;</code></pre>
          </div>

          <div class="code-block">
            <h4>SCSS Styles</h4>
            <pre><code>.card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: var(--bright-sun);
    transform: translateY(-4px);
  }
}

.magnetic-button {
  background: linear-gradient(135deg,
    var(--persian-blue),
    var(--picton-blue)
  );
  border: none;
  border-radius: 50px;
  padding: 1rem 2rem;
  color: white;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    box-shadow: 0 8px 25px rgba(32, 72, 180, 0.4);
  }
}</code></pre>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  magneticHover,
  createRippleEffect,
  useAnimationPerformance,
  checkReducedMotion
} from '@/composables/useAnimations'

// Performance monitoring
const { fps, frameTime } = useAnimationPerformance()

// Reduced motion state
const isReducedMotion = ref(checkReducedMotion())

// Event handlers
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
onMounted(() => {
  // Initialize magnetic hover for all magnetic elements
  const magneticElements = document.querySelectorAll('.animate-magnetic')
  magneticElements.forEach(element => {
    magneticHover(element as HTMLElement, 0.15)
  })
})
</script>

<style scoped lang="scss">
.animations-example {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--ebony-clay), #1a202c);
  color: white;
  padding: 2rem;
}

.example-header {
  text-align: center;
  margin-bottom: 4rem;

  h1 {
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 800;
    color: var(--bright-sun);
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.25rem;
    color: rgba(255, 255, 255, 0.8);
  }
}

.example-content {
  max-width: 1200px;
  margin: 0 auto;
}

.example-section {
  margin-bottom: 4rem;

  h2 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--bright-sun);
    margin-bottom: 2rem;
    text-align: center;
  }
}

.example-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.example-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;

  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--bright-sun);
    margin-bottom: 1rem;
  }

  p {
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 1rem;
  }

  code {
    background: rgba(255, 255, 255, 0.1);
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-family: 'Fira Code', monospace;
    font-size: 0.875rem;
  }
}

.ripple-button {
  background: var(--bright-sun);
  border: none;
  border-radius: 12px;
  padding: 1.5rem 2rem;
  color: var(--ebony-clay);
  font-weight: 600;
  font-size: 1.125rem;
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

  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--bright-sun);
    margin-bottom: 1rem;
  }
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

.kinetic-text {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  color: var(--bright-sun);
  cursor: pointer;
  text-align: center;

  &:hover {
    color: var(--picton-blue);
  }

  &.kinetic-clicked {
    animation: kineticText 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
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

  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  p {
    opacity: 0.9;
  }
}

.floating-container {
  position: relative;
  height: 200px;
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

  span {
    font-size: 2rem;
  }

  p {
    font-size: 0.875rem;
    font-weight: 600;
    text-align: center;
  }
}

.timing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.timing-item {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem 1rem;
  text-align: center;
  cursor: pointer;

  span {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--bright-sun);
  }
}

.performance-monitor {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
}

.performance-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
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

.code-examples {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.code-block {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 1.5rem;

  h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--bright-sun);
    margin-bottom: 1rem;
  }

  pre {
    background: rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    padding: 1rem;
    overflow-x: auto;

    code {
      font-family: 'Fira Code', monospace;
      font-size: 0.875rem;
      line-height: 1.5;
      color: #e2e8f0;
    }
  }
}

// Responsive design
@media (max-width: 768px) {
  .animations-example {
    padding: 1rem;
  }

  .example-grid,
  .timing-grid,
  .performance-stats,
  .code-examples {
    grid-template-columns: 1fr;
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .example-card,
  .ripple-button,
  .liquid-card,
  .kinetic-text,
  .gradient-card,
  .floating-element,
  .timing-item {
    animation: none !important;
    transition: none !important;
  }

  .example-card:hover,
  .ripple-button:hover {
    transform: none !important;
  }
}

// High contrast mode
@media (prefers-contrast: high) {
  .example-card,
  .liquid-card,
  .performance-monitor {
    border-width: 2px;
  }

  .ripple-button {
    border: 2px solid var(--bright-sun);
  }
}
</style>
