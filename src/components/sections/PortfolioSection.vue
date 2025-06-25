<template>
  <section class="portfolio-section">
    <h2>{{ t('portfolio.title') }}</h2>
    <h3>{{ t('portfolio.subtitle') }}</h3>
    <div class="portfolio-categories">
      <span v-for="cat in categories" :key="cat" class="portfolio-category">{{ cat }}</span>
    </div>
    <div class="portfolio-featured">
      <div v-for="proj in featured" :key="proj.title" class="portfolio-card">
        <h4>{{ proj.title }}</h4>
        <span class="portfolio-category">{{ proj.category }}</span>
        <p>{{ proj.description }}</p>
        <ul>
          <li v-for="tech in proj.technologies" :key="tech">{{ tech }}</li>
        </ul>
        <span class="portfolio-results">{{ proj.results }}</span>
      </div>
    </div>
    <button class="portfolio-viewall">{{ t('portfolio.viewAll') }}</button>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t } = useI18n()
const categories = computed(() => t('portfolio.categories') as unknown as string[])
const featured = computed(
  () =>
    t('portfolio.featured') as unknown as {
      title: string
      category: string
      description: string
      technologies: string[]
      results: string
    }[],
)
</script>

<style scoped>
.portfolio-section {
  padding: var(--space-xl) 0;
  max-width: 1100px;
  margin: 0 auto;
}
.portfolio-categories {
  display: flex;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
}
.portfolio-category {
  background: var(--color-light-gray);
  color: var(--color-accent-1);
  border-radius: 1em;
  padding: 0.3em 1em;
  font-size: 1rem;
  font-weight: 500;
}
.portfolio-featured {
  display: flex;
  gap: var(--space-lg);
  margin-bottom: var(--space-md);
}
.portfolio-card {
  background: var(--color-white);
  border-radius: 1.2em;
  box-shadow: var(--shadow-soft);
  padding: var(--space-md);
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  gap: 0.7em;
}
.portfolio-card h4 {
  color: var(--color-accent-1);
  font-size: 1.1rem;
}
.portfolio-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.portfolio-card li {
  margin-bottom: 0.5em;
  color: var(--color-secondary);
}
.portfolio-results {
  margin-top: auto;
  font-weight: 700;
  color: var(--color-primary);
}
.portfolio-viewall {
  background: var(--color-primary);
  color: var(--color-secondary);
  border: none;
  border-radius: 2em;
  font-size: 1.1rem;
  font-weight: 700;
  padding: 0.7em 2em;
  box-shadow: var(--shadow-soft);
  cursor: pointer;
  transition:
    box-shadow 0.2s,
    transform 0.2s;
}
.portfolio-viewall:hover {
  box-shadow: var(--shadow-medium);
  transform: scale(1.04);
}
</style>
