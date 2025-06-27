<template>
  <component
    :is="tag"
    :class="buttonClasses"
    :disabled="disabled || loading"
    :aria-label="ariaLabel"
    :aria-describedby="ariaDescribedBy"
    v-bind="linkProps"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @focus="handleFocus"
    @blur="handleBlur"
  >
    <!-- Ripple Effect Container -->
    <span class="button-ripple" ref="rippleContainer" aria-hidden="true"></span>

    <!-- Loading Spinner -->
    <Transition name="spin-fade">
      <span v-if="loading" class="button-loading" aria-hidden="true">
        <svg class="loading-spinner" viewBox="0 0 24 24">
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
            stroke-dasharray="31.416"
            stroke-dashoffset="31.416"
          >
            <animate
              attributeName="stroke-dashoffset"
              dur="2s"
              values="31.416;0;31.416"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke-dasharray"
              dur="2s"
              values="0 31.416;15.708 15.708;0 31.416"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </span>
    </Transition>

    <!-- Icon Slot -->
    <span v-if="$slots.icon && !loading" class="button-icon">
      <slot name="icon" />
    </span>

    <!-- Text Content -->
    <span class="button-text" :class="{ 'sr-only': loading }">
      <slot />
    </span>

    <!-- Magnetic Effect Indicator -->
    <span class="magnetic-indicator" aria-hidden="true"></span>
  </component>
</template>

<script setup lang="ts">
/**
 * @component
 * @name ModernButton
 * @desc Pulsante moderno con varianti, effetti magnetici, ripple e supporto per link/router
 * @prop {String} variant - Variante del pulsante (primary, secondary, ghost, danger, outline)
 * @prop {String} size - Dimensione del pulsante (sm, md, lg, large)
 * @prop {Boolean} loading - Stato di caricamento con spinner
 * @prop {Boolean} disabled - Stato disabilitato
 * @prop {Boolean} fullWidth - Larghezza completa
 * @prop {Boolean} rounded - Bordi arrotondati
 * @prop {String} icon - Icona da mostrare
 * @prop {String} iconPosition - Posizione icona (left, right)
 * @prop {Boolean} ripple - Abilita effetto ripple
 * @prop {Boolean} magnetic - Abilita effetto magnetico
 * @prop {String} href - URL per link esterno
 * @prop {String|Object} to - Route per Vue Router
 * @prop {String} target - Target per link esterno
 * @prop {String} ariaLabel - Label per accessibilità
 * @prop {String} ariaDescribedBy - ID elemento descrittivo
 * @event click - Emesso al click del pulsante
 * @event focus - Emesso al focus del pulsante
 * @event blur - Emesso al blur del pulsante
 * @slot default - Contenuto testuale del pulsante
 * @slot icon - Icona personalizzata
 * @example
 * <ModernButton variant="primary" size="lg" @click="handleClick">
 *   Clicca qui
 * </ModernButton>
 * @example
 * <ModernButton variant="outline" :loading="isLoading" href="/about">
 *   Vai a About
 * </ModernButton>
 */
import { computed, ref } from 'vue'

// Props con validazione TypeScript
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'large'
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  rounded?: boolean
  icon?: string
  iconPosition?: 'left' | 'right'
  ripple?: boolean
  magnetic?: boolean
  onFocus?: (event: FocusEvent) => void
  onBlur?: (event: FocusEvent) => void
  href?: string
  to?: string | object
  target?: string
  ariaLabel?: string
  ariaDescribedBy?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  fullWidth: false,
  rounded: false,
  icon: '',
  iconPosition: 'left',
  ripple: true,
  magnetic: true,
  onFocus: () => {},
  onBlur: () => {},
})

// Emits
const emit = defineEmits<{
  click: [event: MouseEvent]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

// Refs
const rippleContainer = ref<HTMLElement>()

// Computed per tag dinamico
const tag = computed(() => {
  if (props.href) return 'a'
  if (props.to) return 'RouterLink'
  return 'button'
})

// Props per link
const linkProps = computed(() => {
  if (props.href) {
    return {
      href: props.href,
      target: props.target,
      rel: props.target === '_blank' ? 'noopener noreferrer' : undefined,
    }
  }
  if (props.to) {
    return { to: props.to }
  }
  return { type: 'button' }
})

// Classi dinamiche
const buttonClasses = computed(() => [
  'modern-button',
  `button-${props.variant}`,
  `button-${props.size}`,
  {
    'button-loading': props.loading,
    'button-disabled': props.disabled,
    'button-magnetic': props.magnetic,
  },
])

// Ripple Effect Implementation
const createRipple = (event: MouseEvent) => {
  if (!props.ripple || !rippleContainer.value) return

  const button = event.currentTarget as HTMLElement
  const rect = button.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2

  const ripple = document.createElement('span')
  ripple.classList.add('ripple-effect')
  ripple.style.width = ripple.style.height = `${size}px`
  ripple.style.left = `${x}px`
  ripple.style.top = `${y}px`

  rippleContainer.value.appendChild(ripple)

  // Rimuovi ripple dopo animazione
  setTimeout(() => {
    ripple.remove()
  }, 600)
}

// Event Handlers
const handleClick = (event: MouseEvent) => {
  if (props.loading || props.disabled) return

  createRipple(event)
  emit('click', event)
}

const handleMouseEnter = () => {
  // Trigger magnetic effect via CSS
}

const handleMouseLeave = () => {
  // Reset magnetic effect
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

/* Base Button Styles */
.modern-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  border: none;
  border-radius: var(--radius-lg);
  font-family: var(--font-primary);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-kinetic);
  overflow: hidden;
  isolation: isolate;

  /* Focus styles per accessibilità */
  &:focus-visible {
    outline: 3px solid var(--color-accent-1);
    outline-offset: 2px;
  }

  /* Disabled state */
  &.button-disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }
}

/* Variants */
.button-primary {
  background: var(--gradient-primary);
  color: var(--color-secondary);
  box-shadow: var(--shadow-primary);

  &:hover:not(.button-disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-3d-medium);
  }
}

.button-secondary {
  background: var(--color-secondary);
  color: var(--color-white);
  box-shadow: var(--shadow-soft);

  &:hover:not(.button-disabled) {
    background: var(--color-secondary-light);
    transform: translateY(-1px);
  }
}

.button-ghost {
  background: transparent;
  color: var(--color-text);
  border: 2px solid var(--color-border);

  &:hover:not(.button-disabled) {
    background: var(--color-light-gray);
    border-color: var(--color-accent-1);
  }
}

.button-danger {
  background: var(--color-error);
  color: var(--color-white);

  &:hover:not(.button-disabled) {
    background: var(--color-danger-hover);
    transform: translateY(-1px);
  }
}

/* Sizes */
.button-sm {
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-sm);
}

.button-md {
  padding: var(--space-3) var(--space-6);
  font-size: var(--font-size-base);
}

.button-lg {
  padding: var(--space-4) var(--space-8);
  font-size: var(--font-size-lg);
}

/* Ripple Effect */
.button-ripple {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.ripple-effect {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: scale(0);
  animation: ripple-animation 0.6s linear;
}

@keyframes ripple-animation {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

/* Loading State */
.button-loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Magnetic Effect */
.button-magnetic {
  &:hover {
    transform: translateY(-2px) scale(1.02);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }
}

/* Transitions */
.spin-fade-enter-active,
.spin-fade-leave-active {
  transition: opacity var(--duration-fast) var(--ease-smooth);
}

.spin-fade-enter-from,
.spin-fade-leave-to {
  opacity: 0;
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .modern-button {
    transition: none;
  }

  .ripple-effect {
    animation: none;
  }

  .loading-spinner {
    animation: none;
  }
}
</style>
