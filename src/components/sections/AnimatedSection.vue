<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{
  animation?: 'fadeIn' | 'slideUp' | 'scaleIn' | 'stagger'
  threshold?: number
  delay?: number
  duration?: number
}>(), {
  animation: 'fadeIn',
  threshold: 0.1,
  delay: 0,
  duration: 0.6
})

const sectionRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)

onMounted(() => {
  if (!sectionRef.value) return

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true
        observer.disconnect()
      }
    },
    { threshold: props.threshold }
  )

  observer.observe(sectionRef.value)

  onUnmounted(() => {
    observer.disconnect()
  })
})
</script>

<template>
  <section
    ref="sectionRef"
    class="animated-section"
    :class="[`animation-${animation}`, { 'is-visible': isVisible }]"
    :style="{
      '--animation-delay': `${delay}s`,
      '--animation-duration': `${duration}s`
    }"
  >
    <slot />
  </section>
</template>

<style lang="scss" scoped>
.animated-section {
  opacity: 0;
  transform: translateY(40px);
  transition: all var(--animation-duration) cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-delay: var(--animation-delay);

  &.is-visible {
    opacity: 1;
    transform: none;
  }

  &.animation-fadeIn {
    transform: translateY(40px);

    &.is-visible {
      transform: none;
    }
  }

  &.animation-slideUp {
    transform: translateY(60px);

    &.is-visible {
      transform: none;
    }
  }

  &.animation-scaleIn {
    transform: scale(0.9) translateY(20px);

    &.is-visible {
      transform: scale(1) translateY(0);
    }
  }

  &.animation-stagger {
    transform: translateY(40px);

    &.is-visible {
      transform: none;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .animated-section {
    transition: none;
    opacity: 1;
    transform: none;
  }
}
</style>
