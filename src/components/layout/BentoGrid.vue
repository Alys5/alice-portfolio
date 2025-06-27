@use '@/assets/styles/variables.scss' as *;

<template>
  <section class="bento-grid" :class="gridSize" role="region" aria-label="Bento Grid Layout">
    <slot />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'small' | 'medium' | 'large' | 'comfortable' | 'spacious'
  gap?: 'sm' | 'md' | 'lg'
  padding?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'large',
  gap: 'md',
  padding: 'md',
})

const gridSize = computed(() => `bento-grid--${props.size}`)
</script>

<style scoped lang="scss">
.bento-grid {
  display: grid;
  gap: var(--bento-gap);
  padding: var(--bento-padding);
  width: 100%;
  height: 100%;
  min-height: 400px;

  // Responsive breakpoints
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    gap: var(--space-lg);
  }

  // Large grid layout
  &--large {
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: repeat(8, 100px);

    @media (max-width: 1024px) {
      grid-template-columns: repeat(8, 1fr);
      grid-template-rows: repeat(6, 80px);
    }

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      grid-template-rows: auto;
      gap: var(--space-lg);
    }
  }

  // Medium grid layout
  &--medium {
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: repeat(6, 80px);

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      grid-template-rows: auto;
      gap: var(--space-lg);
    }
  }

  // Small grid layout
  &--small {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    gap: var(--space-lg);
  }

  // Gap variations
  &[data-gap='sm'] {
    gap: var(--space-sm);
  }

  &[data-gap='md'] {
    gap: var(--space-md);
  }

  &[data-gap='lg'] {
    gap: var(--space-lg);
  }

  // Padding variations
  &[data-padding='sm'] {
    padding: var(--space-sm);
  }

  &[data-padding='md'] {
    padding: var(--space-md);
  }

  &[data-padding='lg'] {
    padding: var(--space-lg);
  }
}

// Bento item styles
:deep(.bento-item) {
  position: relative;
  background: var(--neutral-0);
  border-radius: var(--bento-border-radius);
  padding: var(--space-md);
  box-shadow: var(--shadow-md);
  transition: var(--transition-card);
  overflow: hidden;

  // 3D layered shadows
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      var(--color-shadow-layer-1) 0%,
      transparent 50%,
      var(--color-shadow-layer-2) 100%
    );
    opacity: 0;
    transition: opacity var(--transition-duration-normal) var(--easing-smooth);
    pointer-events: none;
    z-index: 1;
  }

  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: var(--shadow-card-hover);

    &::before {
      opacity: 1;
    }
  }

  // Magnetic hover effect
  &:hover::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, var(--color-magnetic) 0%, transparent 70%);
    transform: translate(-50%, -50%) scale(0);
    animation: magnetic-pulse 0.6s var(--easing-bounce);
    pointer-events: none;
    z-index: 2;
  }

  // Scroll-triggered animations
  &.animate-in {
    animation: slide-in-up 0.8s var(--easing-elastic) forwards;
  }

  &.animate-out {
    animation: slide-out-down 0.6s var(--easing-sharp) forwards;
  }

  // UFO elements
  .ufo-element {
    position: absolute;
    border-radius: 50%;
    opacity: 0.1;
    animation: ufo-float var(--ufo-animation-duration) infinite ease-in-out alternate;
    pointer-events: none;
    z-index: 1;

    &--sm {
      width: 20px;
      height: 20px;
    }

    &--md {
      width: 30px;
      height: 30px;
    }

    &--lg {
      width: 40px;
      height: 40px;
    }

    &--primary {
      background: var(--color-primary);
    }

    &--accent {
      background: var(--color-accent-1);
    }

    &--secondary {
      background: var(--color-accent-2);
    }
  }

  // Glass effect
  &.glass {
    background: var(--glass-bg);
    backdrop-filter: var(--blur-glass);
    border: 1px solid var(--color-glass-border);
    box-shadow: var(--shadow-glass);
  }

  // Brutalist style
  &.brutalist {
    background: var(--color-brutalist-bg);
    border: 3px solid var(--color-brutalist-border);
    color: var(--color-brutalist-text);
    box-shadow: var(--shadow-brutalist);
    transform: rotate(-1deg);

    &:hover {
      transform: rotate(1deg) translateY(-2px);
    }
  }
}

// Animations
@keyframes ufo-float {
  0% {
    transform: translateY(0) rotate(0deg);
  }

  50% {
    transform: translateY(-20px) rotate(5deg);
  }

  100% {
    transform: translateY(-40px) rotate(-5deg);
  }
}

@keyframes magnetic-pulse {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }

  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

@keyframes slide-in-up {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes slide-out-down {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  100% {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .bento-item {
    transition: none;

    &:hover {
      transform: none;
    }

    &::before,
    &::after {
      display: none;
    }

    .ufo-element {
      animation: none;
    }
  }

  @keyframes ufo-float {
    from,
    to {
      transform: none;
      opacity: 1;
    }
  }

  @keyframes magnetic-pulse {
    from,
    to {
      transform: none;
      opacity: 1;
    }
  }

  @keyframes slide-in-up {
    from,
    to {
      transform: none;
      opacity: 1;
    }
  }

  @keyframes slide-out-down {
    from,
    to {
      transform: none;
      opacity: 1;
    }
  }
}

// High contrast mode
@media (prefers-contrast: high) {
  .bento-item {
    border: 2px solid currentColor;
    box-shadow: none;

    &:hover {
      box-shadow: 0 0 0 2px currentColor;
    }
  }
}
</style>
