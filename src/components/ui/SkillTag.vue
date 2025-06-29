<template>
  <div
    class="skill-tag"
    :class="{ 'is-visible': isVisible }"
    :style="{ '--accent-color': props.color }"
    :aria-label="`${props.name} - Livello ${props.level}/5`"
  >
    <span class="skill-name">{{ props.name }}</span>
    <div class="skill-level">
      <div
        v-for="i in 5"
        :key="i"
        class="level-dot"
        :class="{ 'is-filled': i <= props.level }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Props interface
interface Props {
  name: string
  level: number // 1-5
  color?: string
}

const props = defineProps<Props>()

// Reactive state
const isVisible = ref(false)

// Lifecycle
onMounted(() => {
  // Trigger visibility animation
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})
</script>

<style scoped lang="scss">
.skill-tag {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  opacity: 0;
  transform: translateY(10px);
  cursor: default;

  &.is-visible {
    opacity: 1;
    transform: translateY(0);
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: var(--accent-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
}

.skill-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  white-space: nowrap;
}

.skill-level {
  display: flex;
  gap: 0.25rem;
  align-items: center;
}

.level-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;

  &.is-filled {
    background: var(--accent-color);
    border-color: var(--accent-color);
    box-shadow: 0 0 8px rgba(255, 201, 64, 0.5);
  }
}

// Responsive design
@media (max-width: 768px) {
  .skill-tag {
    padding: 0.5rem 0.75rem;
    gap: 0.5rem;
  }

  .skill-name {
    font-size: 0.8rem;
  }

  .level-dot {
    width: 6px;
    height: 6px;
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .skill-tag {
    transition: none;
    opacity: 1;
    transform: none;

    &:hover {
      transform: none;
    }
  }

  .level-dot {
    transition: none;
  }
}

// High contrast mode
@media (prefers-contrast: high) {
  .skill-tag {
    border-width: 2px;

    &:hover {
      border-width: 3px;
    }
  }

  .level-dot {
    border-width: 2px;
  }
}
</style>
