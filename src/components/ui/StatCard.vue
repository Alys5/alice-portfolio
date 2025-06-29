<template>
  <div
    class="stat-card"
    :class="{ 'is-visible': isVisible }"
    :style="{ '--accent-color': color }"
  >
    <div class="stat-icon" v-if="icon">
      <span class="icon">{{ icon }}</span>
    </div>

    <div class="stat-content">
      <div class="stat-value" ref="valueRef">
        {{ displayValue }}
      </div>
      <div class="stat-label">
        {{ label }}
      </div>
    </div>

    <!-- Elemento decorativo -->
    <div class="stat-decoration"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

// Props interface
interface Props {
  value: string | number
  label: string
  icon?: string
  color?: string
  animate?: boolean
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  color: 'var(--bright-sun)',
  animate: true,
  duration: 2000
})

// Template refs
const valueRef = ref<HTMLElement>()

// Reactive state
const isVisible = ref(false)
const currentValue = ref(0)

// Computed properties
const displayValue = computed(() => {
  if (typeof props.value === 'string') {
    return props.value
  }

  if (props.animate && isVisible.value) {
    return Math.floor(currentValue.value)
  }

  return 0
})

// Animation logic
const animateValue = () => {
  if (typeof props.value !== 'number' || !props.animate) {
    currentValue.value = props.value as number
    return
  }

  const targetValue = props.value
  const startTime = Date.now()
  const startValue = 0

  const updateValue = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / props.duration, 1)

    // Easing function (ease-out)
    const easeProgress = 1 - Math.pow(1 - progress, 3)

    currentValue.value = startValue + (targetValue - startValue) * easeProgress

    if (progress < 1) {
      requestAnimationFrame(updateValue)
    } else {
      currentValue.value = targetValue
    }
  }

  requestAnimationFrame(updateValue)
}

// Lifecycle
onMounted(() => {
  // Trigger visibility animation
  setTimeout(() => {
    isVisible.value = true
    if (props.animate) {
      animateValue()
    }
  }, 100)
})

// Watch for value changes
watch(() => props.value, (newValue) => {
  if (typeof newValue === 'number' && props.animate) {
    animateValue()
  }
})
</script>

<style scoped lang="scss">
.stat-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  opacity: 0;
  transform: translateY(30px);

  &.is-visible {
    opacity: 1;
    transform: translateY(0);
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    border-color: var(--accent-color);

    .stat-decoration {
      transform: scale(1.2);
      opacity: 0.3;
    }
  }
}

.stat-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, var(--accent-color), var(--bright-sun-light));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(255, 201, 64, 0.3);
  transition: all 0.3s ease;

  .icon {
    font-size: 1.5rem;
  }

  .stat-card:hover & {
    transform: scale(1.1);
    box-shadow: 0 12px 35px rgba(255, 201, 64, 0.4);
  }
}

.stat-content {
  position: relative;
  z-index: 2;
}

.stat-value {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  color: var(--accent-color);
  margin-bottom: 0.5rem;
  line-height: 1;
  text-shadow: 0 0 20px rgba(255, 201, 64, 0.3);
  transition: all 0.3s ease;

  .stat-card:hover & {
    transform: scale(1.05);
  }
}

.stat-label {
  font-size: 1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
}

.stat-decoration {
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, var(--accent-color) 0%, transparent 70%);
  opacity: 0.1;
  border-radius: 50%;
  transition: all 0.4s ease;
  pointer-events: none;
}

// Responsive design
@media (max-width: 768px) {
  .stat-card {
    padding: 1.5rem;
  }

  .stat-icon {
    width: 50px;
    height: 50px;
    margin-bottom: 1rem;

    .icon {
      font-size: 1.25rem;
    }
  }

  .stat-value {
    font-size: 2rem;
  }

  .stat-label {
    font-size: 0.875rem;
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .stat-card {
    transition: none;
    opacity: 1;
    transform: none;

    &:hover {
      transform: none;
    }
  }

  .stat-icon {
    transition: none;

    .stat-card:hover & {
      transform: none;
    }
  }

  .stat-value {
    transition: none;

    .stat-card:hover & {
      transform: none;
    }
  }

  .stat-decoration {
    transition: none;

    .stat-card:hover & {
      transform: none;
    }
  }
}

// High contrast mode
@media (prefers-contrast: high) {
  .stat-card {
    border-width: 2px;
    border-color: var(--accent-color);
  }

  .stat-value {
    text-shadow: 2px 2px 0 var(--ebony-clay);
  }
}
</style>
