<template>
  <div class="portfolio-page">
    <!-- Header della pagina -->
    <header class="page-header">
      <div class="container">
        <h1 class="page-title">{{ t('portfolio.title') }}</h1>
        <p class="page-subtitle">{{ t('portfolio.subtitle') }}</p>
      </div>
    </header>

    <!-- Contenuto principale -->
    <main class="page-content">
      <div class="container">
        <PortfolioSection />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import PortfolioSection from '@/components/sections/PortfolioSection.vue'
import { useMeta } from '@/composables/useMeta'

defineOptions({ name: 'PortfolioPage' })

const { t } = useI18n()

// Imposto i meta tag per la pagina Portfolio
const { setPageMeta } = useMeta()

setPageMeta({
  title: 'Portfolio - Alice Mandelli | UI Developer & AI Strategist',
  description:
    'Portfolio di progetti UI/UX, Design Systems e strategie AI. Progetti per Volkswagen, ŠKODA e design innovativo.',
  keywords:
    'Portfolio, UI Projects, UX Design, Design Systems, AI Strategy, Volkswagen, ŠKODA, Case Studies',
  ogTitle: 'Portfolio - Alice Mandelli | UI Developer & AI Strategist',
  ogDescription:
    'Portfolio di progetti UI/UX, Design Systems e strategie AI. Progetti per Volkswagen, ŠKODA e design innovativo.',
  twitterTitle: 'Portfolio - Alice Mandelli | UI Developer & AI Strategist',
  twitterDescription:
    'Portfolio di progetti UI/UX, Design Systems e strategie AI. Progetti per Volkswagen, ŠKODA e design innovativo.',
})
</script>

<style scoped lang="scss">
.portfolio-page {
  min-height: 100vh;
  background: var(--color-background);
}

.page-header {
  background: var(--gradient-primary);
  padding: var(--space-2xl) 0;
  text-align: center;
  color: var(--color-white);

  .page-title {
    font-size: var(--font-size-3xl);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--space-md);
    line-height: 1.2;
  }

  .page-subtitle {
    font-size: var(--font-size-lg);
    opacity: 0.9;
    max-width: 600px;
    margin: 0 auto;
  }
}

.page-content {
  padding: var(--space-2xl) 0;
}

.container {
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: 0 var(--space-lg);
}

// Responsive
@media (max-width: 768px) {
  .page-header {
    padding: var(--space-xl) 0;

    .page-title {
      font-size: var(--font-size-2xl);
    }

    .page-subtitle {
      font-size: var(--font-size-base);
    }
  }

  .page-content {
    padding: var(--space-xl) 0;
  }

  .container {
    padding: 0 var(--space-md);
  }
}
</style>
