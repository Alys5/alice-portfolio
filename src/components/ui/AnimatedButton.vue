<script setup lang="ts">
import { ref, computed, defineProps, defineEmits, onMounted, onUnmounted, watch } from 'vue'
import gsap from 'gsap'

const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonRef = ref<HTMLElement | null>(null)
const rippleActive = ref(false)
const rippleStyle = ref<{ left: string; top: string } | null>(null)
const isActive = ref(false)
const isFocused = ref(false)
const mouseX = ref(0)
const mouseY = ref(0)
const magnetic = ref(false)
const isPressed = ref(false)

const buttonClasses = computed(() => [
  'animated-button',
  `variant-${props.variant}`,
  `size-${props.size}`,
  { 'is-disabled': props.disabled, 'is-loading': props.loading, 'is-pressed': isPressed.value }
])

// ARIA
const ariaAttrs = computed(() => ({
  'aria-disabled': Boolean(props.disabled || props.loading),
  'aria-busy': Boolean(props.loading),
  tabindex: props.disabled ? -1 : 0,
  role: 'button',
}))

const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) return
  triggerRipple(event)
  emit('click', event)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (props.disabled || props.loading) return
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    emit('click', event as unknown as MouseEvent)
  }
}

function handleFocus() {
  isFocused.value = true
}
function handleBlur() {
  isFocused.value = false
}
function handlePointerDown() {
  isActive.value = true
}
function handlePointerUp() {
  isActive.value = false
}

function triggerRipple(e: MouseEvent | KeyboardEvent) {
  if (!(buttonRef.value && e instanceof MouseEvent)) return
  const rect = buttonRef.value.getBoundingClientRect()
  rippleStyle.value = {
    left: `${e.clientX - rect.left}px`,
    top: `${e.clientY - rect.top}px`
  }
  rippleActive.value = false
  void buttonRef.value.offsetWidth // force reflow
  rippleActive.value = true
  setTimeout(() => (rippleActive.value = false), 500)
}

// Magnetic effect
function onMouseMove(ev: MouseEvent) {
  if (!buttonRef.value || props.disabled) return
  const rect = buttonRef.value.getBoundingClientRect()
  const x = ev.clientX - (rect.left + rect.width / 2)
  const y = ev.clientY - (rect.top + rect.height / 2)
  const dist = Math.sqrt(x * x + y * y)
  if (dist < rect.width * 0.8) {
    magnetic.value = true
    mouseX.value = x * 0.18
    mouseY.value = y * 0.18
    gsap.to(buttonRef.value, {
      x: mouseX.value,
      y: mouseY.value,
      scale: 1.05,
      boxShadow: '0 0 32px 0 var(--persian-blue)',
      duration: 0.35,
      ease: 'expo.out',
    })
  } else {
    resetMagnetic()
  }
}
function resetMagnetic() {
  if (!buttonRef.value) return
  magnetic.value = false
  gsap.to(buttonRef.value, {
    x: 0,
    y: 0,
    scale: 1,
    boxShadow: '',
    duration: 0.5,
    ease: 'elastic.out(1,0.4)',
  })
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseout', resetMagnetic)
})
onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseout', resetMagnetic)
})

watch(() => props.disabled, (val) => {
  if (val) resetMagnetic()
})

const handleMouseDown = () => {
  if (!props.disabled && !props.loading) {
    isPressed.value = true
  }
}

const handleMouseUp = () => {
  isPressed.value = false
}

const handleMouseLeave = () => {
  isPressed.value = false
}
</script>

<template>
  <button
    ref="buttonRef"
    :class="buttonClasses"
    v-bind="ariaAttrs"
    :disabled="disabled || loading"
    @click="handleClick"
    @keydown="handleKeydown"
    @focus="handleFocus"
    @blur="handleBlur"
    @pointerdown="handlePointerDown"
    @pointerup="handlePointerUp"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseLeave"
  >
    <span class="btn-content" v-if="!loading">
      <slot />
    </span>
    <span class="btn-spinner" v-if="loading" aria-live="polite" aria-busy="true">
      <svg width="24" height="24" viewBox="0 0 24 24" class="spinner-svg" focusable="false" aria-hidden="true">
        <circle class="spinner-bg" cx="12" cy="12" r="10" fill="none" stroke="rgba(32,72,180,0.15)" stroke-width="4" />
        <circle class="spinner-fg" cx="12" cy="12" r="10" fill="none" stroke="var(--bright-sun)" stroke-width="4" stroke-linecap="round" />
      </svg>
    </span>
    <span
      v-if="rippleActive"
      class="btn-ripple"
      :style="rippleStyle"
      aria-hidden="true"
    ></span>
  </button>
</template>

<style scoped lang="scss">
.animated-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  font-weight: 700;
  border: none;
  outline: none;
  cursor: pointer;
  user-select: none;
  overflow: hidden;
  border-radius: var(--radius-lg, 24px);
  transition: background 0.3s cubic-bezier(0.25,0.46,0.45,0.94),
    color 0.3s cubic-bezier(0.25,0.46,0.45,0.94),
    box-shadow 0.3s cubic-bezier(0.25,0.46,0.45,0.94),
    transform 0.18s cubic-bezier(0.68,-0.55,0.265,1.55);
  will-change: transform, box-shadow;
  z-index: 1;
  min-width: 120px;
  min-height: 48px;
  font-size: 1.1rem;

  &.btn-sm { font-size: 0.95rem; padding: 0.5rem 1.2rem; min-height: 38px; }
  &.btn-md { font-size: 1.1rem; padding: 0.8rem 2rem; min-height: 48px; }
  &.btn-lg { font-size: 1.3rem; padding: 1.1rem 2.8rem; min-height: 60px; }

  // Variants
  &.variant-primary {
    background: linear-gradient(135deg, vars.$bright-sun, vars.$persian-blue);
    color: vars.$ebony-clay;
    box-shadow: 0 4px 15px rgba(255, 201, 64, 0.3);
    &:hover:not(.is-disabled):not(.is-loading) {
      box-shadow: 0 8px 25px rgba(255, 201, 64, 0.4);
    }
  }
  &.variant-secondary {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    &:hover:not(.is-disabled):not(.is-loading) {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.3);
    }
  }
  &.variant-ghost {
    background: transparent;
    color: vars.$bright-sun;
    &:hover:not(.is-disabled):not(.is-loading) {
      background: rgba(255, 201, 64, 0.1);
    }
  }
  &.variant-outline {
    background: transparent;
    color: vars.$bright-sun;
    border: 2px solid vars.$bright-sun;
    &:hover:not(.is-disabled):not(.is-loading) {
      background: vars.$bright-sun;
      color: vars.$ebony-clay;
    }
  }

  // Active
  &.is-pressed {
    transform: scale(0.98);
  }

  // Focus
  &.focused {
    outline: 2px solid vars.$bright-sun;
    outline-offset: 2px;
    box-shadow: 0 0 0 4px vars.$bright-sun-alpha;
    filter: blur(0.5px);
  }

  // Disabled
  &.is-disabled, &[aria-disabled="true"] {
    opacity: 0.6;
    pointer-events: none;
    filter: grayscale(0.2);
    cursor: not-allowed;
  }

  // Loading
  &.is-loading {
    pointer-events: none;
    .btn-content { opacity: 0.3; }
    .btn-spinner { opacity: 1; }
  }
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.btn-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  opacity: 1;
  pointer-events: none;
}
.spinner-svg {
  width: 2em;
  height: 2em;
  animation: spinner-rotate 1s linear infinite;
}
.spinner-fg {
  stroke-dasharray: 80;
  stroke-dashoffset: 60;
  animation: spinner-dash 1.2s ease-in-out infinite;
}
@keyframes spinner-rotate {
  100% { transform: rotate(360deg); }
}
@keyframes spinner-dash {
  0% { stroke-dasharray: 1, 200; stroke-dashoffset: 0; }
  50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
  100% { stroke-dasharray: 80, 200; stroke-dashoffset: -124; }
}

.btn-ripple {
  position: absolute;
  width: 120px;
  height: 120px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 10;
  border-radius: 50%;
  background: vars.$bright-sun;
  opacity: 0.25;
  animation: ripple 0.5s cubic-bezier(0.4,0,0.2,1) both;
}
@keyframes ripple {
  0% { transform: translate(-50%, -50%) scale(0); opacity: 0.5; }
  80% { transform: translate(-50%, -50%) scale(2.5); opacity: 0.25; }
  100% { transform: translate(-50%, -50%) scale(3.5); opacity: 0; }
}

.animated-button:active .btn-ripple {
  width: 300px;
  height: 300px;
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .animated-button {
    transition: none;

    &:hover:not(.is-disabled):not(.is-loading) {
      transform: none;
    }

    &.is-pressed {
      transform: none;
    }
  }

  .spinner-svg {
    animation: none;
  }

  .btn-ripple {
    transition: none;
  }
}
</style>
