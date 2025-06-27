<template>
  <section class="skills-section">
    <h2>{{ t('skills.title') }}</h2>
    <div class="skills-categories">
      <div v-for="cat in categories" :key="cat.title" class="skills-category">
        <h3>{{ cat.title }}</h3>
        <ul>
          <li v-for="skill in cat.skills" :key="skill">{{ skill }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t } = useI18n()
const categories = computed(
  () => t('skills.categories') as unknown as { title: string; skills: string[] }[],
)
</script>

<style scoped>
.skills-section {
  padding: var(--space-xl) 0;
  max-width: 900px;
  margin: 0 auto;
}
.skills-categories {
  display: flex;
  gap: var(--space-lg);
  margin-top: var(--space-md);
}
.skills-category {
  background: var(--neutral-0);
  border-radius: 1.2em;
  box-shadow: var(--shadow-md);
  padding: var(--space-md);
  flex: 1 1 0;
}
.skills-category h3 {
  color: var(--accent-500);
  font-size: 1.1rem;
}
.skills-category ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.skills-category li {
  margin-bottom: 0.5em;
  color: var(--color-secondary);
}
</style>
