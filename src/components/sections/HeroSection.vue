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
        <button class="hero-cta ripple" @click="scrollPortfolio">{{ $t('hero.cta') }}</button>
      </div>
      <!-- Colonna destra: card neomorfica con immagine profilo e floating shapes -->
      <div class="hero-right">
        <div class="profile-card">
          <!-- Sostituisci con <img> reale -->
          <div class="profile-img">AM</div>
        </div>
        <!-- Placeholder per floating shapes/particles -->
        <div class="floating-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useMainStore } from '@/stores/main'

// Store globale per ruoli localizzati e tema
const mainStore = useMainStore()

// Ref per l'elemento typewriter (effetto digitazione)
const typewriter = ref<HTMLElement | null>(null)
// Indici e flag per animazione typewriter
let current = 0 // indice ruolo attuale
let char = 0 // indice carattere attuale
let isDeleting = false // flag cancellazione

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
  setTimeout(typeEffect, isDeleting ? 40 : 80)
}

// Avvia l'effetto typewriter al mount del componente
onMounted(() => {
  typeEffect()
})

// Rilancia l'effetto se cambiano i ruoli (cambio lingua)
watch(
  () => mainStore.roles,
  () => {
    current = 0
    char = 0
    isDeleting = false
    typeEffect()
  },
)

/**
 * Scrolla dolcemente alla sezione Portfolio (id="portfolio")
 */
function scrollPortfolio() {
  const el = document.getElementById('portfolio')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
.hero-section {
  width: 100%;
  padding: var(--space-xl) 0 var(--space-lg) 0;
  background: var(--color-bg);
  display: flex;
  justify-content: center;
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
  background: var(--color-accent-1);
  color: var(--color-white);
  display: inline-block;
  padding: 0.4em 1em;
  border-radius: 2em;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: var(--space-sm);
  box-shadow: var(--shadow-soft);
}
.hero-title {
  font-size: 2.8rem;
  font-family: var(--font-primary);
  font-weight: 800;
  color: var(--color-secondary);
  margin: 0;
}
.hero-typewriter {
  font-size: 1.3rem;
  font-family: var(--font-mono);
  color: var(--color-accent-1);
  min-height: 2.2rem;
}
.hero-desc {
  font-size: 1.1rem;
  color: var(--color-dark-gray);
  margin: 0 0 var(--space-md) 0;
}
.hero-cta {
  background: var(--color-primary);
  color: var(--color-secondary);
  border: none;
  border-radius: 2em;
  font-size: 1.1rem;
  font-weight: 700;
  padding: 0.8em 2.2em;
  box-shadow: var(--shadow-soft);
  cursor: pointer;
  transition:
    box-shadow 0.2s,
    transform 0.2s;
  position: relative;
  overflow: hidden;
}
.hero-cta:hover {
  box-shadow: var(--shadow-medium);
  transform: scale(1.04);
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
  animation: ripple 0.5s linear;
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
}
.profile-card {
  background: var(--color-white);
  box-shadow: var(--shadow-soft);
  border-radius: 2.5em;
  padding: var(--space-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 180px;
  min-height: 180px;
  position: relative;
  z-index: 2;
  transition: box-shadow 0.2s;
}
.profile-card:hover {
  box-shadow: var(--shadow-medium);
}
.profile-img {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: var(--color-accent-2);
  color: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 700;
  box-shadow: var(--shadow-soft);
}
.floating-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}
.shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.18;
  animation: float 4s infinite ease-in-out alternate;
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
  background: var(--color-accent-1);
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
</style>
