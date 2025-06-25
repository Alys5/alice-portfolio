<template>
  <section class="about-section">
    <h2>{{ t('about.title') }}</h2>
    <h3>{{ t('about.subtitle') }}</h3>
    <p>{{ t('about.description') }}</p>
    <div class="about-stats">
      <div v-for="stat in stats" :key="stat.label" class="about-stat">
        <span class="stat-number">{{ stat.number }}</span>
        <span class="stat-label">{{ stat.label }}</span>
      </div>
    </div>
    <div class="about-values">
      <div v-for="value in values" :key="value.title" class="about-value">
        <strong>{{ value.title }}</strong>
        <span>{{ value.description }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t } = useI18n()
const stats = computed(() => t('about.stats') as unknown as { number: string; label: string }[])
const values = computed(
  () => t('about.values') as unknown as { title: string; description: string }[],
)
</script>

<style scoped>
.about-section {
  padding: var(--space-xl) 0;
  max-width: 900px;
  margin: 0 auto;
}
.about-stats {
  display: flex;
  gap: var(--space-lg);
  margin: var(--space-md) 0;
}
.about-stat {
  background: var(--color-light-gray);
  border-radius: 1.5em;
  padding: var(--space-sm) var(--space-lg);
  box-shadow: var(--shadow-soft);
  text-align: center;
}
.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
}
.stat-label {
  display: block;
  font-size: 1rem;
  color: var(--color-secondary);
}
.about-values {
  display: flex;
  gap: var(--space-lg);
  margin-top: var(--space-md);
}
.about-value {
  background: var(--color-white);
  border-radius: 1.2em;
  box-shadow: var(--shadow-soft);
  padding: var(--space-md);
  flex: 1 1 0;
}
.about-value strong {
  color: var(--color-accent-1);
  font-size: 1.1rem;
}
</style>
