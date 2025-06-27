<script setup lang="ts">
import { computed } from 'vue'

export interface BentoItem {
  id: number
  area: string
  accent: 'bright-sun' | 'ebony-clay' | 'persian-blue' | 'picton-blue'
  title: string
  desc: string
}

const props = withDefaults(defineProps<{
  items: BentoItem[]
  columns?: {
    mobile?: number
    tablet?: number
    desktop?: number
  }
  gap?: string
}>(), {
  columns: () => ({ mobile: 1, tablet: 2, desktop: 4 }),
  gap: '1rem'
})

const emit = defineEmits<{
  'item-click': [item: BentoItem]
}>()

const gridTemplateAreas = computed(() => {
  const areas = props.items.map(item => `"${item.area}"`).join(' ')
  return areas
})

const handleItemClick = (item: BentoItem) => {
  emit('item-click', item)
}
</script>

<template>
  <section class="bento-grid-section">
    <div
      class="bento-grid"
      :style="{
        '--grid-gap': gap,
        'grid-template-areas': gridTemplateAreas
      }"
    >
      <div
        v-for="item in items"
        :key="item.id"
        :class="['bento-item', `accent-${item.accent}`]"
        :style="{ 'grid-area': item.area }"
        @click="handleItemClick(item)"
        role="button"
        tabindex="0"
        :aria-label="`${item.title}: ${item.desc}`"
      >
        <div class="item-content">
          <h3 class="item-title">{{ item.title }}</h3>
          <p class="item-desc">{{ item.desc }}</p>
        </div>
        <div class="item-accent" />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.bento-grid-section {
  padding: 2rem 0;
  max-width: 1200px;
  margin: 0 auto;
}

.bento-grid {
  display: grid;
  gap: var(--grid-gap);
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  grid-auto-rows: minmax(200px, auto);
  padding: 0 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.bento-item {
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: clamp(12px, 2vw, 24px);
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  }

  &:focus-visible {
    outline: 2px solid var(--bright-sun);
    outline-offset: 2px;
  }

  &.accent-bright-sun {
    .item-accent {
      background: var(--bright-sun);
    }
  }

  &.accent-ebony-clay {
    .item-accent {
      background: var(--ebony-clay);
    }
  }

  &.accent-persian-blue {
    .item-accent {
      background: var(--persian-blue);
    }
  }

  &.accent-picton-blue {
    .item-accent {
      background: var(--picton-blue);
    }
  }
}

.item-content {
  z-index: 2;
  position: relative;
}

.item-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.item-desc {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
}

.item-accent {
  position: absolute;
  top: 0;
  right: 0;
  width: 60px;
  height: 60px;
  border-radius: 0 clamp(12px, 2vw, 24px) 0 0;
  opacity: 0.3;
  transition: opacity 0.3s ease;
}

.bento-item:hover .item-accent {
  opacity: 0.6;
}

@media (prefers-reduced-motion: reduce) {
  .bento-item {
    transition: none;

    &:hover {
      transform: none;
    }
  }
}
</style>
