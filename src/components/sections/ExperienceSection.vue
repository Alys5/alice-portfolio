<template>
  <section class="experience-section">
    <h2>{{ t('experience.title') }}</h2>
    <h3>{{ t('experience.subtitle') }}</h3>
    <div class="experience-list">
      <div v-for="item in items" :key="item.role + item.company" class="experience-card">
        <h4>{{ item.role }}</h4>
        <span class="experience-company">{{ item.company }}</span>
        <span class="experience-period">{{ item.period }}</span>
        <p>{{ item.description }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t } = useI18n()
const items = computed(
  () =>
    t('experience.items') as unknown as {
      role: string
      company: string
      period: string
      description: string
    }[],
)
</script>

<style scoped>
.experience-section {
  padding: var(--space-xl) 0;
  max-width: 900px;
  margin: 0 auto;
}
.experience-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  margin-top: var(--space-md);
}
.experience-card {
  background: var(--color-white);
  border-radius: 1.2em;
  box-shadow: var(--shadow-soft);
  padding: var(--space-md);
}
.experience-card h4 {
  color: var(--color-accent-1);
  font-size: 1.1rem;
}
.experience-company {
  font-weight: 600;
  color: var(--color-secondary);
  margin-right: 1em;
}
.experience-period {
  color: var(--color-medium-gray);
  font-size: 0.95rem;
}
</style>
