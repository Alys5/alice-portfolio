<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import useCursor from '@/composables/useCursor'

const { cursorPosition, cursorState, isVisible } = useCursor()

const cursorRef = ref<HTMLDivElement | null>(null)
const cursorDotRef = ref<HTMLDivElement | null>(null)

onMounted(() => {
  if (cursorRef.value && cursorDotRef.value) {
    // Inizializza cursor
  }
})

onUnmounted(() => {
  // Cleanup
})
</script>

<template>
  <div
    v-if="isVisible"
    ref="cursorRef"
    class="custom-cursor"
    :class="cursorState"
    :style="{
      '--cursor-x': `${cursorPosition.x}px`,
      '--cursor-y': `${cursorPosition.y}px`
    }"
    aria-hidden="true"
  >
    <div ref="cursorDotRef" class="cursor-dot" />
    <div class="cursor-ring" />
  </div>
</template>

<style lang="scss" scoped>
.custom-cursor {
  position: fixed;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  pointer-events: none;
  z-index: 9999;
  transform: translate(var(--cursor-x), var(--cursor-y));
  transition: transform 0.1s ease-out;
  mix-blend-mode: difference;

  &.hover {
    .cursor-dot {
      transform: scale(2);
      background: var(--bright-sun);
    }

    .cursor-ring {
      transform: scale(1.5);
      opacity: 0.5;
    }
  }

  &.click {
    .cursor-dot {
      transform: scale(0.8);
    }

    .cursor-ring {
      transform: scale(2);
      opacity: 0.3;
    }
  }

  &.magnetic {
    .cursor-dot {
      transform: scale(1.5);
      background: var(--picton-blue);
    }
  }
}

.cursor-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background: #fff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.cursor-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@media (prefers-reduced-motion: reduce) {
  .custom-cursor {
    display: none;
  }
}

@media (max-width: 768px) {
  .custom-cursor {
    display: none;
  }
}
</style>
