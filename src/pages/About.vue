<template>
  <div class="about-page">
    <!-- Header della pagina -->
    <header class="page-header">
      <div class="container">
        <h1 class="page-title">{{ t('about.title') }}</h1>
        <p class="page-subtitle">{{ t('about.subtitle') }}</p>
      </div>
    </header>

    <!-- Contenuto principale -->
    <main class="page-content">
      <div class="container">
        <AboutSection />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AboutSection from '@/components/sections/AboutSection.vue'
import { useMeta } from '@/composables/useMeta'

defineOptions({ name: 'AboutPage' })

const { t } = useI18n()

// Imposto i meta tag per la pagina About
const { setPageMeta } = useMeta()

setPageMeta({
  title: 'Chi sono - Alice Mandelli | UI Developer & AI Strategist',
  description:
    'Alice Mandelli: UI Developer e AI Strategist con 10+ anni di esperienza. Specializzata in interfacce intuitive e strategie AI.',
  keywords: 'Alice Mandelli, UI Developer, AI Strategist, About, Experience, Skills, Background',
  ogTitle: 'Chi sono - Alice Mandelli | UI Developer & AI Strategist',
  ogDescription:
    'Alice Mandelli: UI Developer e AI Strategist con 10+ anni di esperienza. Specializzata in interfacce intuitive e strategie AI.',
  twitterTitle: 'Chi sono - Alice Mandelli | UI Developer & AI Strategist',
  twitterDescription:
    'Alice Mandelli: UI Developer e AI Strategist con 10+ anni di esperienza. Specializzata in interfacce intuitive e strategie AI.',
})
</script>

<style scoped lang="scss">
.about-page {
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
