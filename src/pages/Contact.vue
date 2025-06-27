<template>
  <div class="contact-page">
    <!-- Header della pagina -->
    <header class="page-header">
      <div class="container">
        <h1 class="page-title">{{ t('contact.title') }}</h1>
        <p class="page-subtitle">{{ t('contact.subtitle') }}</p>
      </div>
    </header>

    <!-- Contenuto principale -->
    <main class="page-content">
      <div class="container">
        <ContactSection />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ContactSection from '@/components/sections/ContactSection.vue'
import { useMeta } from '@/composables/useMeta'

defineOptions({ name: 'ContactPage' })

const { t } = useI18n()

// Imposto i meta tag per la pagina Contact
const { setPageMeta } = useMeta()

setPageMeta({
  title: 'Contatti - Alice Mandelli | UI Developer & AI Strategist',
  description:
    'Contatta Alice Mandelli per progetti di UI Development, Design Systems e strategie AI. Collaborazioni e consulenze.',
  keywords: 'Contatti, Alice Mandelli, UI Development, AI Strategy, Collaborazioni, Consulenze',
  ogTitle: 'Contatti - Alice Mandelli | UI Developer & AI Strategist',
  ogDescription:
    'Contatta Alice Mandelli per progetti di UI Development, Design Systems e strategie AI. Collaborazioni e consulenze.',
  twitterTitle: 'Contatti - Alice Mandelli | UI Developer & AI Strategist',
  twitterDescription:
    'Contatta Alice Mandelli per progetti di UI Development, Design Systems e strategie AI. Collaborazioni e consulenze.',
})
</script>

<style scoped lang="scss">
.contact-page {
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
