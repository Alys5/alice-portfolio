<template>
  <button
    @click="toggleTheme"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    class="theme-toggle"
    :class="{ 'theme-toggle--transitioning': isTransitioning }"
    :aria-label="getThemeAriaLabel()"
    type="button"
    :title="$t('ui.theme.toggle')"
  >
    <div class="theme-toggle__container">
      <!-- Icona Sole -->
      <svg
        class="theme-toggle__icon theme-toggle__icon--sun"
        :class="{ 'theme-toggle__icon--active': !isDark }"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          class="theme-toggle__sun-circle"
          cx="12"
          cy="12"
          r="4"
          stroke="currentColor"
          stroke-width="2"
          fill="none"
        />
        <g class="theme-toggle__sun-rays">
          <line
            x1="12"
            y1="1"
            x2="12"
            y2="3"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
          <line
            x1="12"
            y1="21"
            x2="12"
            y2="23"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
          <line
            x1="4.22"
            y1="4.22"
            x2="5.64"
            y2="5.64"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
          <line
            x1="18.36"
            y1="18.36"
            x2="19.78"
            y2="19.78"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
          <line
            x1="1"
            y1="12"
            x2="3"
            y2="12"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
          <line
            x1="21"
            y1="12"
            x2="23"
            y2="12"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
          <line
            x1="4.22"
            y1="19.78"
            x2="5.64"
            y2="18.36"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
          <line
            x1="18.36"
            y1="5.64"
            x2="19.78"
            y2="4.22"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </g>
      </svg>

      <!-- Icona Luna -->
      <svg
        class="theme-toggle__icon theme-toggle__icon--moon"
        :class="{ 'theme-toggle__icon--active': isDark }"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          class="theme-toggle__moon-path"
          d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
          stroke="currentColor"
          stroke-width="2"
          fill="none"
        />
      </svg>
    </div>

    <!-- Tooltip per tema automatico -->
    <div
      v-if="currentTheme === 'auto'"
      class="theme-toggle__tooltip"
      :class="{ 'theme-toggle__tooltip--visible': showTooltip }"
    >
      <span class="theme-toggle__tooltip-text">
        {{ getThemeText() }}
      </span>
    </div>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useTheme } from '@/composables/useTheme'

// Props
interface Props {
  showTooltipOnHover?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showTooltipOnHover: true,
})

// Composables
const { currentTheme, isDark, isTransitioning, toggleTheme, getThemeText, getThemeAriaLabel } =
  useTheme()

// State
const showTooltip = ref(false)
let tooltipTimeout: number | null = null

// Methods
const handleMouseEnter = () => {
  if (props.showTooltipOnHover && currentTheme.value === 'auto') {
    showTooltip.value = true
  }
}

const handleMouseLeave = () => {
  if (tooltipTimeout) {
    clearTimeout(tooltipTimeout)
  }

  tooltipTimeout = setTimeout(() => {
    showTooltip.value = false
  }, 200)
}

// Lifecycle
onMounted(() => {
  // Cleanup
  onUnmounted(() => {
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout)
    }
  })
})
</script>

<style scoped lang="scss">
.theme-toggle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background: var(--color-glass-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--color-glass-border);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all 0.3s var(--ease-out-expo);
  overflow: hidden;

  &:hover {
    transform: scale(1.05);
    background: var(--color-hover);
    box-shadow: var(--shadow-md);
  }

  &:active {
    transform: scale(0.95);
  }

  &:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 2px;
  }

  &--transitioning {
    pointer-events: none;
  }

  &__container {
    position: relative;
    width: 24px;
    height: 24px;
  }

  &__icon {
    position: absolute;
    top: 0;
    left: 0;
    width: 24px;
    height: 24px;
    transition: all 0.5s var(--ease-out-expo);
    opacity: 0;
    transform: scale(0.8) rotate(-90deg);

    &--active {
      opacity: 1;
      transform: scale(1) rotate(0deg);
    }

    &--sun {
      color: var(--color-warning);
    }

    &--moon {
      color: var(--color-accent-400);
    }
  }

  &__sun-circle {
    transition: all 0.3s var(--ease-out-expo);
  }

  &__sun-rays {
    transition: all 0.3s var(--ease-out-expo);
    transform-origin: center;
  }

  &__moon-path {
    transition: all 0.3s var(--ease-out-expo);
    stroke-dasharray: 40;
    stroke-dashoffset: 0;
  }

  &__tooltip {
    position: absolute;
    bottom: -40px;
    left: 50%;
    transform: translateX(-50%) translateY(10px);
    background: var(--color-bg-elevated);
    border: 1px solid var(--color-border-primary);
    border-radius: var(--radius-md);
    padding: var(--space-2) var(--space-3);
    font-size: 0.875rem;
    color: var(--color-text-primary);
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s var(--ease-out-expo);
    box-shadow: var(--shadow-lg);
    z-index: 1000;

    &--visible {
      opacity: 1;
      visibility: visible;
      transform: translateX(-50%) translateY(0);
    }

    &::before {
      content: '';
      position: absolute;
      top: -6px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-bottom: 6px solid var(--color-bg-elevated);
    }
  }

  &__tooltip-text {
    font-weight: 500;
  }
}

// Animazioni per il cambio tema
.theme-toggle--transitioning {
  .theme-toggle__icon {
    transition-duration: 0.2s;
  }

  .theme-toggle__sun-rays {
    animation: sunRaysSpin 0.5s var(--ease-out-expo);
  }

  .theme-toggle__moon-path {
    animation: moonPathDraw 0.5s var(--ease-out-expo);
  }
}

// Keyframes
@keyframes sunRaysSpin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(180deg);
  }
}

@keyframes moonPathDraw {
  0% {
    stroke-dashoffset: 40;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

// Dark theme specific styles
[data-theme='dark'] {
  .theme-toggle {
    background: var(--color-glass-bg);
    border-color: var(--color-glass-border);

    &:hover {
      background: var(--color-hover);
    }
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .theme-toggle {
    transition: none;

    &__icon {
      transition: none;
    }

    &__sun-rays,
    &__moon-path {
      transition: none;
    }
  }

  .theme-toggle--transitioning {
    .theme-toggle__sun-rays,
    .theme-toggle__moon-path {
      animation: none;
    }
  }
}

// High contrast support
@media (prefers-contrast: high) {
  .theme-toggle {
    border-width: 2px;
    border-color: var(--color-text-primary);

    &:focus-visible {
      outline-width: 3px;
    }
  }
}
</style>
