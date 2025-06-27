<template>
  <article
    class="project-card"
    :tabindex="interactive ? 0 : undefined"
    :aria-label="ariaLabel"
    :role="interactive ? 'button' : 'article'"
    ref="cardRef"
    @click="handleClick"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick"
  >
    <!-- Ripple Effect -->
    <div
      v-if="interactive"
      ref="rippleContainer"
      class="project-card__ripple-container"
      @mousedown="createRipple"
      @touchstart="createRipple"
    >
      <div
        v-for="ripple in ripples"
        :key="ripple.id"
        class="project-card__ripple"
        :style="ripple.style"
        @animationend="removeRipple(ripple.id)"
      ></div>
    </div>

    <!-- Magnetic Hover Effect -->
    <div
      v-if="interactive"
      ref="magneticContainer"
      class="project-card__magnetic"
      @mousemove="handleMagneticHover"
      @mouseleave="resetMagneticHover"
    >
      <div class="project-card__magnetic-indicator"></div>
    </div>

    <!-- Immagine Lazy Loaded -->
    <div class="project-card__image-wrapper">
      <img
        v-if="imageVisible"
        :src="imgSrc"
        :alt="imgAlt"
        class="project-card__image"
        :style="imageStyle"
      />
      <div v-else class="project-card__image-skeleton" aria-hidden="true"></div>
    </div>

    <!-- Contenuto -->
    <div class="project-card__content">
      <header v-if="title || $slots.header" class="project-card__header">
        <slot name="header">
          <h3 v-if="title" class="project-card__title">{{ title }}</h3>
        </slot>
      </header>
      <div class="project-card__body">
        <slot></slot>
      </div>
      <footer v-if="$slots.footer" class="project-card__footer">
        <slot name="footer"></slot>
      </footer>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'
import { useUserPreferences } from '@/composables/useUserPreferences'

interface Props {
  title?: string
  imgSrc: string
  imgAlt?: string
  interactive?: boolean
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  interactive: false,
  imgAlt: '',
})

const emit = defineEmits<{
  click: [event: MouseEvent | KeyboardEvent]
}>()

// Refs
const cardRef = ref<HTMLElement>()
const rippleContainer = ref<HTMLElement>()
const magneticContainer = ref<HTMLElement>()

// Ripple State
const ripples = ref<Array<{ id: number; style: Record<string, string> }>>([])
const rippleId = ref(0)

// Magnetic State
const magneticOffset = ref({ x: 0, y: 0 })

// Lazy Loading State
const imageVisible = ref(false)

// User Preferences
const { preferences } = useUserPreferences()
const prefersReducedMotion = computed(() => preferences.value.reducedMotion)

// Intersection Observer per lazy loading immagine
const { observe, unobserve } = useIntersectionObserver(
  (entries) => {
    const entry = entries[0]
    if (entry.isIntersecting) {
      imageVisible.value = true
      if (cardRef.value) unobserve(cardRef.value)
    }
  },
  { threshold: 0.2 },
)

onMounted(async () => {
  await nextTick()
  if (cardRef.value) observe(cardRef.value)
})

onUnmounted(() => {
  if (cardRef.value) unobserve(cardRef.value)
})

// Ripple Effect
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

// Magnetic Hover
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

// Click handler
const handleClick = (event: MouseEvent | KeyboardEvent) => {
  if (!props.interactive) return
  emit('click', event)
}

// Computed style per immagine (magnetic offset)
const imageStyle = computed(() => ({
  transform: `translate(${magneticOffset.value.x}px, ${magneticOffset.value.y}px)`,
}))
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.project-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--color-card-bg);
  border-radius: var(--border-radius-card);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition:
    box-shadow var(--duration-normal) var(--ease-kinetic),
    transform var(--duration-normal) var(--ease-kinetic);
  will-change: transform, box-shadow;
  cursor: pointer;
  outline: none;

  &:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 2px;
  }

  &:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px) scale(1.02);
  }
}

.project-card__ripple-container {
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

.project-card__ripple {
  position: absolute;
  border-radius: 50%;
  background: var(--color-ripple, rgba(99, 102, 241, 0.15));
  transform: scale(0);
  animation: ripple-animation 0.6s var(--ease-kinetic);
  pointer-events: none;
}

@keyframes ripple-animation {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

.project-card__magnetic {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 2;
}

.project-card__magnetic-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, var(--color-magnetic) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
  transition: all 0.3s var(--ease-kinetic);
  pointer-events: none;
}

.project-card:hover .project-card__magnetic-indicator {
  transform: translate(-50%, -50%) scale(1);
  opacity: 0.1;
}

.project-card__image-wrapper {
  width: 100%;
  aspect-ratio: 16/9;
  background: var(--color-bg-secondary);
  position: relative;
  overflow: hidden;
}

.project-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 0;
  transition: transform var(--duration-normal) var(--ease-kinetic);
}

.project-card__image-skeleton {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--color-bg-secondary) 25%,
    var(--color-bg-tertiary) 50%,
    var(--color-bg-secondary) 75%
  );
  animation: skeleton-shimmer 1.5s infinite linear;
}

@keyframes skeleton-shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: 200px 0;
  }
}

.project-card__content {
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  flex: 1;
}

.project-card__header {
  margin-bottom: var(--spacing-md);
}

.project-card__title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
  line-height: var(--line-height-tight);
}

.project-card__body {
  flex: 1;
  color: var(--color-text-secondary);
}

.project-card__footer {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border-subtle);
}

@media (prefers-reduced-motion: reduce) {
  .project-card {
    transition: none;
  }
  .project-card__ripple {
    animation: none;
  }
}

@media (prefers-contrast: high) {
  .project-card {
    border-width: 2px;
    outline-width: 3px;
  }
}
</style>
