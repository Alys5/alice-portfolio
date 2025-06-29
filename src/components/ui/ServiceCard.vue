<template>
  <div
    class="service-card"
    :class="{ 'is-visible': isVisible, 'is-expanded': isExpanded }"
    :style="{ '--accent-color': props.color }"
    @click="toggleExpand"
    @keydown.enter="toggleExpand"
    @keydown.space.prevent="toggleExpand"
    tabindex="0"
    role="button"
    :aria-expanded="isExpanded"
    :aria-label="`${props.title} - ${props.description}`"
  >
    <!-- Header card -->
    <div class="card-header">
      <div class="service-icon">
        <span class="icon">{{ props.icon }}</span>
      </div>

      <div class="service-info">
        <h3 class="service-title">{{ props.title }}</h3>
        <p class="service-price">{{ props.price }}</p>
      </div>

      <button
        class="expand-button"
        :aria-label="isExpanded ? 'Comprimi dettagli' : 'Espandi dettagli'"
        @click.stop="toggleExpand"
      >
        <span class="expand-icon" :class="{ 'is-expanded': isExpanded }">
          {{ isExpanded ? '−' : '+' }}
        </span>
      </button>
    </div>

    <!-- Descrizione -->
    <div class="service-description">
      <p>{{ props.description }}</p>
    </div>

    <!-- Features (espandibili) -->
    <div
      class="service-features"
      :class="{ 'is-visible': isExpanded }"
      :aria-hidden="!isExpanded"
    >
      <h4 class="features-title">Cosa include:</h4>
      <ul class="features-list">
        <li
          v-for="(feature, index) in props.features"
          :key="index"
          class="feature-item"
        >
          <span class="feature-icon">✓</span>
          <span class="feature-text">{{ feature }}</span>
        </li>
      </ul>
    </div>

    <!-- Call to Action -->
    <div class="service-cta">
      <button
        class="btn btn-primary"
        @click.stop="handleSelect"
        :aria-label="`Seleziona servizio ${props.title}`"
      >
        <span class="btn-text">Richiedi Preventivo</span>
        <span class="btn-icon">→</span>
      </button>
    </div>

    <!-- Elemento decorativo -->
    <div class="card-decoration"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Props interface
interface Props {
  title: string
  description: string
  price: string
  icon: string
  features: string[]
  color?: string
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'select': []
}>()

// Reactive state
const isVisible = ref(false)
const isExpanded = ref(false)

// Event handlers
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

const handleSelect = () => {
  emit('select')
}

// Lifecycle
onMounted(() => {
  // Trigger visibility animation
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})
</script>

<style scoped lang="scss">
.service-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  cursor: pointer;
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

    .card-decoration {
      transform: scale(1.2);
      opacity: 0.3;
    }
  }

  &.is-expanded {
    transform: translateY(-8px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);

    .expand-icon {
      transform: rotate(180deg);
    }
  }

  &:focus {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
  }
}

.card-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.service-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--accent-color), var(--bright-sun-light));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(255, 201, 64, 0.3);
  transition: all 0.3s ease;
  flex-shrink: 0;

  .icon {
    font-size: 1.5rem;
  }

  .service-card:hover & {
    transform: scale(1.1);
    box-shadow: 0 12px 35px rgba(255, 201, 64, 0.4);
  }
}

.service-info {
  flex: 1;
  min-width: 0;
}

.service-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--accent-color);
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.service-price {
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
}

.expand-button {
  background: none;
  border: none;
  color: var(--accent-color);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 201, 64, 0.1);
  }

  &:focus {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
  }
}

.expand-icon {
  font-size: 1.25rem;
  font-weight: 700;
  transition: transform 0.3s ease;
  display: block;

  &.is-expanded {
    transform: rotate(180deg);
  }
}

.service-description {
  margin-bottom: 1.5rem;

  p {
    font-size: 1rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.8);
  }
}

.service-features {
  max-height: 0;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  margin-bottom: 1.5rem;

  &.is-visible {
    max-height: 500px;
  }
}

.features-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--accent-color);
  margin-bottom: 1rem;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 201, 64, 0.1);
    transform: translateX(4px);
  }
}

.feature-icon {
  color: var(--accent-color);
  font-weight: 700;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.feature-text {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
}

.service-cta {
  text-align: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 201, 64, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
}

.btn-primary {
  background: var(--accent-color);
  color: var(--ebony-clay);

  &:hover {
    background: #ffd166;
  }
}

.btn-icon {
  transition: transform 0.3s ease;
}

.btn:hover .btn-icon {
  transform: translateX(4px);
}

.card-decoration {
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
  .service-card {
    padding: 1.5rem;
  }

  .card-header {
    gap: 0.75rem;
  }

  .service-icon {
    width: 50px;
    height: 50px;

    .icon {
      font-size: 1.25rem;
    }
  }

  .service-title {
    font-size: 1.125rem;
  }

  .service-price {
    font-size: 0.875rem;
  }

  .expand-icon {
    font-size: 1rem;
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .service-card {
    transition: none;
    opacity: 1;
    transform: none;

    &:hover {
      transform: none;
    }

    &.is-expanded {
      transform: none;
    }
  }

  .service-icon {
    transition: none;

    .service-card:hover & {
      transform: none;
    }
  }

  .expand-icon {
    transition: none;
  }

  .service-features {
    transition: none;
  }

  .feature-item {
    transition: none;

    &:hover {
      transform: none;
    }
  }

  .btn {
    transition: none;

    &:hover {
      transform: none;
    }
  }

  .btn-icon {
    transition: none;

    &:hover {
      transform: none;
    }
  }

  .card-decoration {
    transition: none;

    .service-card:hover & {
      transform: none;
    }
  }
}

// High contrast mode
@media (prefers-contrast: high) {
  .service-card {
    border-width: 2px;
    border-color: var(--accent-color);
  }

  .btn-primary {
    border: 2px solid var(--ebony-clay);
  }

  .expand-button {
    border: 1px solid var(--accent-color);
  }
}
</style>
