<template>
  <section class="services-section">
    <h2>{{ t('services.title') }}</h2>
    <h3>{{ t('services.subtitle') }}</h3>
    <div class="services-list">
      <div v-for="item in items" :key="item.title" class="service-card">
        <h4>{{ item.title }}</h4>
        <p>{{ item.description }}</p>
        <ul>
          <li v-for="feature in item.features" :key="feature">{{ feature }}</li>
        </ul>
        <span class="service-price">{{ item.price }}</span>
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
    t('services.items') as unknown as {
      title: string
      description: string
      features: string[]
      price: string
    }[],
)
</script>

<style scoped>
.services-section {
  padding: var(--space-xl) 0;
  max-width: 1100px;
  margin: 0 auto;
}
.services-list {
  display: flex;
  gap: var(--space-lg);
  margin-top: var(--space-md);
}
.service-card {
  background: var(--neutral-0);
  border-radius: 1.2em;
  box-shadow: var(--shadow-md);
  padding: var(--space-md);
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  gap: 0.7em;
}
.service-card h4 {
  color: var(--accent-500);
  font-size: 1.1rem;
}
.service-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.service-card li {
  margin-bottom: 0.5em;
  color: var(--color-secondary);
}
.service-price {
  margin-top: auto;
  font-weight: 700;
  color: var(--color-primary);
}
</style>
