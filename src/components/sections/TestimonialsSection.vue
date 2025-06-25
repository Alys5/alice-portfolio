<template>
  <section class="testimonials-section">
    <h2>{{ t('testimonials.title') }}</h2>
    <h3>{{ t('testimonials.subtitle') }}</h3>
    <div class="testimonials-list">
      <div v-for="item in testimonials" :key="item.name" class="testimonial-card">
        <strong>{{ item.name }}</strong>
        <span class="testimonial-role">{{ item.role }}</span>
        <blockquote>{{ item.content }}</blockquote>
        <span class="testimonial-rating">{{ '★'.repeat(item.rating) }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t } = useI18n()
const testimonials = computed(
  () =>
    t('testimonials.items') as unknown as {
      name: string
      role: string
      content: string
      rating: number
    }[],
)
</script>

<style scoped>
.testimonials-section {
  padding: var(--space-xl) 0;
  max-width: 900px;
  margin: 0 auto;
}
.testimonials-list {
  display: flex;
  gap: var(--space-lg);
  margin-top: var(--space-md);
}
.testimonial-card {
  background: var(--color-white);
  border-radius: 1.2em;
  box-shadow: var(--shadow-soft);
  padding: var(--space-md);
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  gap: 0.7em;
}
.testimonial-card strong {
  color: var(--color-accent-1);
  font-size: 1.1rem;
}
.testimonial-role {
  color: var(--color-secondary);
  font-size: 0.95rem;
}
.testimonial-rating {
  color: var(--color-primary);
  font-size: 1.2rem;
}
blockquote {
  margin: 0.5em 0;
  font-style: italic;
  color: var(--color-medium-gray);
}
</style>
