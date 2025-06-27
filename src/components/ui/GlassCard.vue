<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  content?: string
  accentColor?: 'bright-sun' | 'ebony-clay' | 'persian-blue' | 'picton-blue'
  blurLevel?: number
  padding?: string
  borderRadius?: string
}>(), {
  title: '',
  content: '',
  accentColor: 'bright-sun',
  blurLevel: 20,
  padding: '1.5rem',
  borderRadius: 'clamp(12px, 2vw, 24px)'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const cardStyle = computed(() => ({
  '--blur-level': `${props.blurLevel}px`,
  '--card-padding': props.padding,
  '--card-radius': props.borderRadius
}))

const handleClick = (event: MouseEvent) => {
  emit('click', event)
}
</script>

<template>
  <div
    class="glass-card"
    :class="`accent-${accentColor}`"
    :style="cardStyle"
    @click="handleClick"
    role="button"
    tabindex="0"
    :aria-label="title"
  >
    <div class="card-content">
      <h3 v-if="title" class="card-title">{{ title }}</h3>
      <p v-if="content" class="card-text">{{ content }}</p>
      <slot />
    </div>
    <div class="card-accent" />
  </div>
</template>

<style lang="scss" scoped>
.glass-card {
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(var(--blur-level));
  -webkit-backdrop-filter: blur(var(--blur-level));
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--card-radius);
  padding: var(--card-padding);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.18);

  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 12px 48px rgba(31, 38, 135, 0.25);
  }

  &:focus-visible {
    outline: 2px solid vars.$bright-sun;
    outline-offset: 2px;
  }

  &.accent-bright-sun {
    .card-accent {
      background: vars.$bright-sun;
    }
  }

  &.accent-ebony-clay {
    .card-accent {
      background: vars.$ebony-clay;
    }
  }

  &.accent-persian-blue {
    .card-accent {
      background: vars.$persian-blue;
    }
  }

  &.accent-picton-blue {
    .card-accent {
      background: vars.$picton-blue;
    }
  }
}

.card-content {
  position: relative;
  z-index: 2;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.card-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
}

.card-accent {
  position: absolute;
  top: 0;
  right: 0;
  width: 60px;
  height: 60px;
  border-radius: 0 var(--card-radius) 0 0;
  opacity: 0.3;
  transition: opacity 0.3s ease;
}

.glass-card:hover .card-accent {
  opacity: 0.6;
}

@media (prefers-reduced-motion: reduce) {
  .glass-card {
    transition: none;

    &:hover {
      transform: none;
    }
  }
}
</style>
