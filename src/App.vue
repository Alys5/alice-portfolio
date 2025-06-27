<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { ref, onMounted, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useScrollProgress } from '@/composables/useScrollProgress'
import { usePerformanceOptimization } from '@/composables/usePerformanceOptimization'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'

// Composables per funzionalità avanzate
const { t } = useI18n()
const { scrollProgress, isScrolling } = useScrollProgress()
const { metrics, isOptimized, evaluatePerformance } = usePerformanceOptimization()
const route = useRoute()

// Live regions per screen reader
const liveRegion = ref('')

// Computed per development mode
const isDevelopment = ref(import.meta.env.DEV)

/**
 * Annuncia cambiamenti per screen reader
 */
const announceToScreenReader = (message: string) => {
  // Pulire annunci precedenti
  liveRegion.value = ''
  nextTick(() => {
    liveRegion.value = message
    setTimeout(() => {
      liveRegion.value = ''
    }, 1000)
  })
}

// Monitora performance al mount
onMounted(() => {
  // Annuncia caricamento completato
  nextTick(() => {
    announceToScreenReader(t('accessibility.pageLoaded'))
  })

  // Valuta performance dopo 3 secondi
  setTimeout(() => {
    const performance = evaluatePerformance()
    if (isDevelopment.value) {
      console.log('Performance Evaluation:', performance)
    }
  }, 3000)
})

// Watch per annunciare cambiamenti di navigazione
watch(
  () => route.path,
  (newPath) => {
    const pageNames: Record<string, string> = {
      '/': t('accessibility.pages.home'),
      '/about': t('accessibility.pages.about'),
      '/portfolio': t('accessibility.pages.portfolio'),
      '/contact': t('accessibility.pages.contact'),
    }

    const pageName = pageNames[newPath] || t('accessibility.pages.newPage')
    announceToScreenReader(t('accessibility.navigatedTo', { page: pageName }))
  },
)
</script>

<template>
  <div id="app" class="app-wrapper">
    <!-- Skip Links per Accessibilità -->
    <a href="#main-content" class="skip-link">{{ t('accessibility.skipToMain') }}</a>
    <a href="#navigation" class="skip-link">{{ t('accessibility.skipToNavigation') }}</a>

    <!-- Live Region per Screen Reader -->
    <div aria-live="polite" aria-atomic="true" class="sr-only" :aria-label="liveRegion">
      {{ liveRegion }}
    </div>

    <!-- Scroll Progress Indicator -->
    <div
      v-if="scrollProgress > 0"
      class="scroll-progress"
      :style="{ width: `${scrollProgress}%` }"
      :class="{ 'scroll-progress--scrolling': isScrolling }"
      aria-hidden="true"
    />

    <!-- Header con Navigation -->
    <AppHeader id="navigation" />

    <!-- Main Content -->
    <main id="main-content" class="main-content">
      <RouterView :key="$route.path" v-slot="{ Component, route }">
        <component :is="Component" :key="route.path" class="page-component" />
      </RouterView>
    </main>

    <!-- Footer -->
    <AppFooter />

    <!-- Performance Metrics (solo in development) -->
    <div v-if="isDevelopment" class="performance-debug">
      <details>
        <summary>{{ t('ui.performance.title') }}</summary>
        <ul>
          <li>LCP: {{ metrics.lcp.toFixed(2) }}ms</li>
          <li>FID: {{ metrics.fid.toFixed(2) }}ms</li>
          <li>CLS: {{ metrics.cls.toFixed(3) }}</li>
          <li>INP: {{ metrics.inp.toFixed(2) }}ms</li>
          <li>FCP: {{ metrics.fcp.toFixed(2) }}ms</li>
          <li>Status: {{ isOptimized ? '🟢 Optimized' : '🟡 Needs Improvement' }}</li>
        </ul>
      </details>
    </div>
  </div>
</template>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  contain: layout; /* Ottimizzazione performance */
}

.main-content {
  flex: 1;
  min-height: 70vh;
  padding: var(--space-lg) 0;
  position: relative;
  contain: layout; /* Ottimizzazione performance */
}

/* Scroll Progress Indicator */
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: var(--gradient-primary);
  z-index: var(--z-toast);
  transition: width 0.1s var(--ease-smooth);
  will-change: width; /* Ottimizzazione per animazioni */
}

/*
  NOTE: Per evitare warning di CSS nesting (vite/esbuild), la classe
  .scroll-progress--scrolling viene gestita con :global().
  Questo garantisce compatibilità tra SCSS, CSS moderno e build tool.
*/
:global(.scroll-progress--scrolling) {
  transition: width 0.05s var(--ease-smooth);
}

.page-component {
  min-height: 100%;
  contain: layout; /* Ottimizzazione performance */
}

/* Performance Debug (solo development) */
.performance-debug {
  position: fixed;
  bottom: var(--space-md);
  right: var(--space-md);
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--bento-border-radius);
  padding: var(--space-sm);
  font-size: 0.875rem;
  box-shadow: var(--shadow-medium);
  z-index: var(--z-tooltip);
  contain: layout; /* Ottimizzazione performance */

  details {
    summary {
      cursor: pointer;
      font-weight: var(--font-weight-semibold);
      color: var(--color-accent-1);
    }

    ul {
      margin-top: var(--space-xs);
      padding-left: var(--space-sm);
    }

    li {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--color-text-muted);
    }
  }
}

/* Responsive */
@media (max-width: 640px) {
  .main-content {
    padding: var(--space-md) 0;
  }

  .performance-debug {
    bottom: var(--space-sm);
    right: var(--space-sm);
    font-size: 0.75rem;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .scroll-progress {
    transition: none;
  }
}
</style>
