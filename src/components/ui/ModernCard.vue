<template>
  <article
    :class="[
      'modern-card',
      `modern-card--${size}`,
      `modern-card--${variant}`,
      { 'modern-card--interactive': interactive },
    ]"
    :style="cardStyles"
    @click="handleClick"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick"
    :tabindex="interactive ? 0 : undefined"
    :aria-label="ariaLabel"
    :role="interactive ? 'button' : 'article'"
  >
    <!-- Ripple Effect Container -->
    <div
      v-if="interactive"
      ref="rippleContainer"
      class="modern-card__ripple-container"
      @mousedown="createRipple"
      @touchstart="createRipple"
    >
      <div
        v-for="ripple in ripples"
        :key="ripple.id"
        class="modern-card__ripple"
        :style="ripple.style"
        @animationend="removeRipple(ripple.id)"
      ></div>
    </div>

    <!-- Magnetic Hover Effect -->
    <div
      v-if="interactive"
      ref="magneticContainer"
      class="modern-card__magnetic"
      @mousemove="handleMagneticHover"
      @mouseleave="resetMagneticHover"
    >
      <div class="modern-card__magnetic-indicator"></div>
    </div>

    <!-- Card Content -->
    <div class="modern-card__content">
      <!-- Header Section -->
      <header v-if="$slots.header || title" class="modern-card__header">
        <slot name="header">
          <h3 v-if="title" class="modern-card__title">{{ title }}</h3>
        </slot>
      </header>

      <!-- Main Content -->
      <div class="modern-card__body">
        <slot></slot>
      </div>

      <!-- Footer Section -->
      <footer v-if="$slots.footer" class="modern-card__footer">
        <slot name="footer"></slot>
      </footer>
    </div>

    <!-- 3D Shadow Layers -->
    <div class="modern-card__shadow modern-card__shadow--layer-1"></div>
    <div class="modern-card__shadow modern-card__shadow--layer-2"></div>
    <div class="modern-card__shadow modern-card__shadow--layer-3"></div>

    <!-- UFO Floating Elements -->
    <div v-if="showUfoElements" class="modern-card__ufo-elements">
      <div class="modern-card__ufo-element modern-card__ufo-element--1"></div>
      <div class="modern-card__ufo-element modern-card__ufo-element--2"></div>
      <div class="modern-card__ufo-element modern-card__ufo-element--3"></div>
    </div>
  </article>
</template>

<script setup lang="ts">
/**
 * @component
 * @name ModernCard
 * @desc Card moderna con animazioni scroll-triggered, effetti magnetici, ripple e UFO elements
 * @prop {String} title - Titolo della card
 * @prop {String} size - Dimensione della card (small, medium, large, xlarge)
 * @prop {String} variant - Variante stilistica (default, elevated, glass, brutalist)
 * @prop {Boolean} interactive - Abilita interazioni (click, hover, ripple)
 * @prop {String} ariaLabel - Label per accessibilità
 * @prop {Boolean} showUfoElements - Mostra elementi UFO fluttuanti
 * @prop {Object} customStyles - Stili personalizzati aggiuntivi
 * @event click - Emesso al click della card (solo se interactive)
 * @slot default - Contenuto principale della card
 * @example
 * <ModernCard title="Titolo Card" variant="elevated" interactive>
 *   Contenuto della card
 * </ModernCard>
 * @example
 * <ModernCard
 *   size="large"
 *   variant="glass"
 *   :showUfoElements="true"
 *   @click="handleCardClick"
 * >
 *   Card con effetti speciali
 * </ModernCard>
 */
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'
import { useAccessibilityAnnouncements } from '@/composables/useAccessibilityAnnouncements'
import { useUserPreferences } from '@/composables/useUserPreferences'

interface Props {
  title?: string
  size?: 'small' | 'medium' | 'large' | 'xlarge'
  variant?: 'default' | 'elevated' | 'glass' | 'brutalist'
  interactive?: boolean
  ariaLabel?: string
  showUfoElements?: boolean
  customStyles?: Record<string, string>
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  variant: 'default',
  interactive: false,
  showUfoElements: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent | KeyboardEvent]
}>()

// Refs
const cardRef = ref<HTMLElement>()
const rippleContainer = ref<HTMLElement>()
const magneticContainer = ref<HTMLElement>()

// State
const ripples = ref<Array<{ id: number; style: Record<string, string> }>>([])
const rippleId = ref(0)
const magneticOffset = ref({ x: 0, y: 0 })

// Composables
const { announceToScreenReader } = useAccessibilityAnnouncements()
const { preferences } = useUserPreferences()
const prefersReducedMotion = computed(() => preferences.value.reducedMotion)

// Intersection Observer per animazioni scroll-triggered
const { observe, unobserve } = useIntersectionObserver(
  (entries) => {
    const entry = entries[0]
    if (entry.isIntersecting) {
      cardRef.value?.classList.add('animate-in')
      announceToScreenReader('Card visibile')
    }
  },
  {
    threshold: 0.1,
    rootMargin: '0px 0px -10% 0px',
  },
)

// Computed
const cardStyles = computed(() => ({
  ...props.customStyles,
  '--magnetic-offset-x': `${magneticOffset.value.x}px`,
  '--magnetic-offset-y': `${magneticOffset.value.y}px`,
}))

// Methods
const handleClick = (event: MouseEvent | KeyboardEvent) => {
  if (!props.interactive) return

  emit('click', event)

  // Accessibility announcement
  if (props.ariaLabel) {
    announceToScreenReader(`${props.ariaLabel} selezionato`)
  }
}

const createRipple = (event: MouseEvent | TouchEvent) => {
  if (prefersReducedMotion.value) return

  const rect = rippleContainer.value?.getBoundingClientRect()
  if (!rect) return

  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
  const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY

  const x = clientX - rect.left
  const y = clientY - rect.top

  const ripple = {
    id: rippleId.value++,
    style: {
      left: `${x}px`,
      top: `${y}px`,
    },
  }

  ripples.value.push(ripple)
}

const removeRipple = (id: number) => {
  ripples.value = ripples.value.filter((ripple) => ripple.id !== id)
}

const handleMagneticHover = (event: MouseEvent) => {
  if (prefersReducedMotion.value) return

  const rect = magneticContainer.value?.getBoundingClientRect()
  if (!rect) return

  const centerX = rect.width / 2
  const centerY = rect.height / 2

  const x = event.clientX - rect.left - centerX
  const y = event.clientY - rect.top - centerY

  magneticOffset.value = {
    x: x * 0.1,
    y: y * 0.1,
  }
}

const resetMagneticHover = () => {
  magneticOffset.value = { x: 0, y: 0 }
}

// Lifecycle
onMounted(async () => {
  await nextTick()

  if (cardRef.value) {
    observe(cardRef.value)
  }
})

onUnmounted(() => {
  if (cardRef.value) {
    unobserve(cardRef.value)
  }
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.modern-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--neutral-0);
  border-radius: var(--border-radius-card);
  overflow: hidden;
  transition: all var(--transition-duration-smooth) var(--easing-kinetic);
  transform: translateZ(0);
  will-change: transform, box-shadow;

  // Visibility animation - spostato prima delle regole annidate
  opacity: 0;
  transform: translateY(30px);

  // Size variants
  &--small {
    padding: var(--spacing-md);
    min-height: 120px;
  }

  &--medium {
    padding: var(--spacing-lg);
    min-height: 160px;
  }

  &--large {
    padding: var(--spacing-xl);
    min-height: 200px;
  }

  &--xlarge {
    padding: var(--spacing-2xl);
    min-height: 280px;
  }

  // Variant styles
  &--default {
    border: 1px solid var(--color-border-subtle);
    box-shadow: var(--shadow-md);
  }

  &--elevated {
    border: none;
    box-shadow: var(--shadow-card-elevated);
  }

  &--glass {
    background: var(--glass-bg);
    backdrop-filter: blur(var(--blur-glass));
    border: 1px solid var(--color-glass-border);
    box-shadow: var(--shadow-glass);
  }

  &--brutalist {
    background: var(--color-brutalist-bg);
    border: 3px solid var(--color-brutalist-border);
    border-radius: 0;
    box-shadow: var(--shadow-brutalist);
    transform: rotate(-1deg);

    &:hover {
      transform: rotate(0deg) scale(1.02);
    }
  }

  // Interactive states
  &--interactive {
    cursor: pointer;
    user-select: none;

    &:hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow: var(--shadow-card-hover);
    }

    &:focus-visible {
      outline: 2px solid var(--color-focus);
      outline-offset: 2px;
    }

    &:active {
      transform: translateY(-2px) scale(1.01);
    }
  }

  // Visibility state
  &--visible {
    opacity: 1;
    transform: translateY(0);
  }

  // Content structure
  &__content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  &__header {
    margin-bottom: var(--spacing-md);
  }

  &__title {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary);
    margin: 0;
    line-height: var(--line-height-tight);
  }

  &__body {
    flex: 1;
    color: var(--color-text-secondary);
  }

  &__footer {
    margin-top: var(--spacing-md);
    padding-top: var(--spacing-md);
    border-top: 1px solid var(--color-border-subtle);
  }

  // Ripple effect
  &__ripple-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    overflow: hidden;
    pointer-events: none;
    z-index: 1;
  }

  &__ripple {
    position: absolute;
    border-radius: 50%;
    background: var(--color-ripple);
    transform: scale(0);
    animation: ripple-animation 0.6s var(--easing-kinetic);
    pointer-events: none;
  }

  // Magnetic hover
  &__magnetic {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 1;
  }

  &__magnetic-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, var(--color-magnetic) 0%, transparent 70%);
    border-radius: 50%;
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
    transition: all 0.3s var(--easing-kinetic);
    pointer-events: none;
  }

  &:hover &__magnetic-indicator {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.1;
  }

  // 3D Shadow layers
  &__shadow {
    position: absolute;
    border-radius: inherit;
    pointer-events: none;
    z-index: 0;

    &--layer-1 {
      top: 2px;
      left: 2px;
      right: -2px;
      bottom: -2px;
      background: var(--color-shadow-layer-1);
      filter: blur(4px);
    }

    &--layer-2 {
      top: 4px;
      left: 4px;
      right: -4px;
      bottom: -4px;
      background: var(--color-shadow-layer-2);
      filter: blur(8px);
    }

    &--layer-3 {
      top: 8px;
      left: 8px;
      right: -8px;
      bottom: -8px;
      background: var(--color-shadow-layer-3);
      filter: blur(16px);
    }
  }

  // UFO Elements
  &__ufo-elements {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 1;
  }

  &__ufo-element {
    position: absolute;
    border-radius: 50%;
    background: var(--color-ufo);
    opacity: 0.3;
    animation: ufo-float 8s infinite ease-in-out;

    &--1 {
      width: 8px;
      height: 8px;
      top: 20%;
      left: 10%;
      animation-delay: 0s;
    }

    &--2 {
      width: 12px;
      height: 12px;
      top: 60%;
      right: 15%;
      animation-delay: 2s;
    }

    &--3 {
      width: 6px;
      height: 6px;
      bottom: 30%;
      left: 20%;
      animation-delay: 4s;
    }
  }
}

// Animations
@keyframes ripple-animation {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

@keyframes ufo-float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-10px) rotate(90deg);
  }
  50% {
    transform: translateY(-5px) rotate(180deg);
  }
  75% {
    transform: translateY(-15px) rotate(270deg);
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .modern-card {
    transition: none;

    &__ripple {
      animation: none;
    }

    &__ufo-element {
      animation: none;
    }
  }
}

// High contrast mode
@media (prefers-contrast: high) {
  .modern-card {
    border-width: 2px;

    &--interactive:focus-visible {
      outline-width: 3px;
    }
  }
}

// Print styles
@media print {
  .modern-card {
    box-shadow: none;
    border: 1px solid var(--color-print-border);

    &__shadow,
    &__ufo-elements,
    &__ripple-container,
    &__magnetic {
      display: none;
    }
  }
}
</style>
