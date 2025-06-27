<template>
  <!-- Sezione Hero principale: layout asimmetrico 60/40 -->
  <section class="hero-section">
    <div class="hero-content">
      <!-- Colonna sinistra: testo, badge, titolo, typewriter, descrizione, CTA -->
      <div class="hero-left">
        <div class="hero-badge">{{ $t('hero.badge') }}</div>
        <h1 class="hero-title">{{ $t('hero.title') }}</h1>
        <div class="hero-typewriter">
          <span class="static">{{ $t('hero.typewriterPrefix') }}</span>
          <span class="typewriter" ref="typewriter"></span>
        </div>
        <p class="hero-desc">
          {{ $t('hero.desc1') }}<br />
          {{ $t('hero.desc2') }}
        </p>
        <button class="hero-cta ripple" @click="scrollPortfolio" :aria-label="$t('hero.cta')">
          {{ $t('hero.cta') }}
        </button>
      </div>
      <!-- Colonna destra: card neomorfica con immagine profilo e floating shapes -->
      <div class="hero-right">
        <div class="profile-card">
          <!-- Immagine profilo ottimizzata per LCP -->
          <img
            :src="profileImg"
            alt="Alice Mandelli - UI Developer & AI Strategist"
            class="profile-img"
            width="110"
            height="110"
            loading="eager"
            fetchpriority="high"
            decoding="async"
          />
        </div>
        <!-- Floating shapes ottimizzati -->
        <div class="floating-shapes" aria-hidden="true">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, onUnmounted } from 'vue'
import { useMainStore } from '@/stores/main'
import profileImg from '@/assets/images/profile.webp'

// Store globale per ruoli localizzati e tema
const mainStore = useMainStore()

// Ref per l'elemento typewriter (effetto digitazione)
const typewriter = ref<HTMLElement | null>(null)
// Indici e flag per animazione typewriter
let current = 0 // indice ruolo attuale
let char = 0 // indice carattere attuale
let isDeleting = false // flag cancellazione
let typewriterInterval: number | null = null // Per cleanup

/**
 * Effetto typewriter animato per mostrare i ruoli in modo ciclico
 * Usa i ruoli localizzati dallo store Pinia
 */
function typeEffect() {
  if (!typewriter.value) return
  const roles = mainStore.roles
  const role = roles[current]

  if (isDeleting) {
    char--
    if (char <= 0) {
      isDeleting = false
      current = (current + 1) % roles.length
    }
  } else {
    char++
    if (char === role.length) {
      setTimeout(() => (isDeleting = true), 1000)
    }
  }

  typewriter.value.textContent = role.substring(0, char)
  typewriterInterval = setTimeout(typeEffect, isDeleting ? 40 : 80)
}

// Avvia l'effetto typewriter al mount del componente
onMounted(() => {
  // Delay minimo per non interferire con LCP
  setTimeout(typeEffect, 100)
})

// Cleanup per evitare memory leak
onUnmounted(() => {
  if (typewriterInterval) {
    clearTimeout(typewriterInterval)
  }
})

// Rilancia l'effetto se cambiano i ruoli (cambio lingua)
watch(
  () => mainStore.roles,
  () => {
    current = 0
    char = 0
    isDeleting = false
    if (typewriterInterval) {
      clearTimeout(typewriterInterval)
    }
    setTimeout(typeEffect, 100)
  },
)

/**
 * Scrolla dolcemente alla sezione Portfolio (id="portfolio")
 */
function scrollPortfolio() {
  const el = document.getElementById('portfolio')
  if (el) {
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }
}
</script>

<style scoped>
.hero-section {
  width: 100%;
  padding: var(--space-xl) 0 var(--space-lg) 0;
  background: var(--neutral-0);
  display: flex;
  justify-content: center;
  contain: layout style paint; /* Ottimizzazione performance */
}

.hero-content {
  display: flex;
  max-width: 1200px;
  width: 100%;
  gap: var(--space-xxl);
}

.hero-left {
  flex: 0 0 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--space-lg);
}

.hero-badge {
  background: var(--accent-500);
  color: var(--color-white);
  display: inline-block;
  padding: var(--space-1) var(--space-4);
  border-radius: 2em;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: var(--space-sm);
  box-shadow: var(--shadow-md);
  will-change: transform; /* Ottimizzazione per animazioni */
}

.hero-title {
  font-size: clamp(2rem, 5vw, 2.8rem); /* Responsive typography */
  font-family: var(--font-sans);
  font-weight: 800;
  color: var(--color-secondary);
  margin: 0;
  line-height: 1.1;
  contain: layout; /* Ottimizzazione performance */
}

.hero-typewriter {
  font-size: clamp(1rem, 3vw, 1.3rem);
  font-family: var(--font-mono);
  color: var(--accent-500);
  min-height: 2.2rem;
  contain: layout; /* Ottimizzazione performance */
}

.hero-desc {
  font-size: clamp(0.9rem, 2.5vw, 1.1rem);
  color: var(--color-dark-gray);
  margin: 0 0 var(--space-md) 0;
  line-height: 1.6;
  contain: layout; /* Ottimizzazione performance */
}

.hero-cta {
  background: var(--color-primary);
  color: var(--color-secondary);
  border: none;
  border-radius: 2em;
  font-size: 1.1rem;
  font-weight: 700;
  padding: var(--space-3) var(--space-8);
  box-shadow: var(--shadow-md);
  cursor: pointer;
  transition:
    box-shadow 0.2s var(--ease-out),
    transform 0.2s var(--ease-out);
  position: relative;
  overflow: hidden;
  will-change: transform; /* Ottimizzazione per animazioni */
  contain: layout; /* Ottimizzazione performance */
}

.hero-cta:hover {
  box-shadow: var(--shadow-medium);
  transform: scale(1.04);
}

.hero-cta:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.ripple:active::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 120%;
  height: 120%;
  background: rgba(32, 72, 180, 0.15);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  animation: ripple 0.5s var(--ease-out);
  pointer-events: none;
}

@keyframes ripple {
  to {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
  }
}

.hero-right {
  flex: 0 0 40%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  contain: layout; /* Ottimizzazione performance */
}

.profile-card {
  background: var(--color-white);
  box-shadow: var(--shadow-md);
  border-radius: 2.5em;
  padding: var(--space-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 180px;
  min-height: 180px;
  position: relative;
  z-index: 2;
  transition: box-shadow 0.2s var(--ease-out);
  contain: layout; /* Ottimizzazione performance */
}

.profile-card:hover {
  box-shadow: var(--shadow-medium);
}

.profile-img {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: var(--shadow-md);
  contain: layout; /* Ottimizzazione performance */
}

.floating-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  contain: layout; /* Ottimizzazione performance */
}

.shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.18;
  animation: float 4s infinite var(--ease-in-out) alternate;
  will-change: transform; /* Ottimizzazione per animazioni */
}

.shape-1 {
  width: 60px;
  height: 60px;
  background: var(--color-primary);
  left: 10%;
  top: 20%;
  animation-delay: 0s;
}

.shape-2 {
  width: 40px;
  height: 40px;
  background: var(--accent-500);
  right: 15%;
  bottom: 10%;
  animation-delay: 1.2s;
}

@keyframes float {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-18px);
  }
}

/* Responsive design ottimizzato */
@media (max-width: 900px) {
  .hero-content {
    flex-direction: column;
    gap: var(--space-lg);
  }

  .hero-left,
  .hero-right {
    flex: 1 1 100%;
  }

  .hero-section {
    padding: var(--space-lg) 0;
  }
}

@media (max-width: 640px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-typewriter {
    font-size: 1rem;
  }

  .hero-desc {
    font-size: 0.9rem;
  }

  .hero-cta {
    font-size: 1rem;
    padding: var(--space-2) var(--space-6);
  }
}

/* Reduced motion per accessibilità */
@media (prefers-reduced-motion: reduce) {
  .hero-cta {
    transition: none;
  }

  .ripple:active::after {
    animation: none;
  }

  .shape {
    animation: none;
  }

  .typewriter {
    animation: none;
  }
}

/* High contrast per accessibilità */
@media (prefers-contrast: high) {
  .hero-badge {
    background: #000;
    color: #fff;
  }

  .hero-cta {
    background: #000;
    color: #fff;
    border: 2px solid #000;
  }
}
</style>
