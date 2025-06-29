<template>
  <section
    class="services-section"
    id="services"
    aria-labelledby="services-title"
  >
    <div class="services-container">
      <!-- Header sezione -->
      <div class="section-header">
        <h2 id="services-title" class="section-title">
          {{ servicesData.title }}
        </h2>
        <p class="section-subtitle">
          {{ servicesData.subtitle }}
        </p>
      </div>

      <!-- Grid servizi -->
      <div class="services-grid">
        <ServiceCard
          v-for="service in servicesData.services"
          :key="service.id"
          :title="service.title"
          :description="service.description"
          :price="service.price"
          :icon="service.icon"
          :features="service.features"
          :color="service.color"
          @select="handleServiceSelect"
        />
      </div>

      <!-- Call to Action -->
      <div class="services-cta">
        <p class="cta-text">
          {{ t('services.cta.text') }}
        </p>
        <button
          class="btn btn-primary"
          @click="handleContactCTA"
          :aria-label="t('services.cta.button')"
        >
          <span class="btn-text">{{ t('services.cta.button') }}</span>
          <span class="btn-icon">→</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ServiceCard from '../ui/ServiceCard.vue'

// Composables
const { t } = useI18n()

// Computed properties
const servicesData = computed(() => ({
  title: t('services.title'),
  subtitle: t('services.subtitle'),
  services: [
    {
      id: 'ui-development',
      title: t('services.uiDevelopment.title'),
      description: t('services.uiDevelopment.description'),
      price: t('services.uiDevelopment.price'),
      icon: '🎨',
      features: [
        t('services.uiDevelopment.feature1'),
        t('services.uiDevelopment.feature2'),
        t('services.uiDevelopment.feature3')
      ],
      color: 'var(--bright-sun)'
    },
    {
      id: 'ai-solutions',
      title: t('services.aiSolutions.title'),
      description: t('services.aiSolutions.description'),
      price: t('services.aiSolutions.price'),
      icon: '🤖',
      features: [
        t('services.aiSolutions.feature1'),
        t('services.aiSolutions.feature2'),
        t('services.aiSolutions.feature3')
      ],
      color: 'var(--persian-blue)'
    },
    {
      id: 'consulting',
      title: t('services.consulting.title'),
      description: t('services.consulting.description'),
      price: t('services.consulting.price'),
      icon: '💼',
      features: [
        t('services.consulting.feature1'),
        t('services.consulting.feature2'),
        t('services.consulting.feature3')
      ],
      color: 'var(--picton-blue)'
    }
  ]
}))

// Event handlers
const handleServiceSelect = () => {
  // Implementation
}

const handleContactCTA = () => {
  // Implementation of handleContactCTA
}
</script>

<style scoped lang="scss">
.services-section {
  padding: 6rem 0;
  background: linear-gradient(135deg, #1a202c, var(--ebony-clay));
  position: relative;
  overflow: hidden;

  // Glassmorphism overlay
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 30%, var(--persian-blue-alpha) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, var(--picton-blue-alpha) 0%, transparent 50%);
    z-index: 1;
  }
}

.services-container {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: clamp(2.5rem, 6vw, 3.5rem);
  font-weight: 800;
  color: var(--bright-sun);
  margin-bottom: 1rem;
  line-height: 1.2;
}

.section-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.services-cta {
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 3rem 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.cta-text {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
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
  background: var(--bright-sun);
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

// Responsive design
@media (max-width: 768px) {
  .services-section {
    padding: 4rem 0;
  }

  .services-container {
    padding: 0 1rem;
  }

  .services-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .services-cta {
    padding: 2rem 1.5rem;
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
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
}

// High contrast mode
@media (prefers-contrast: high) {
  .services-cta {
    border-width: 2px;
    border-color: var(--bright-sun);
  }

  .btn-primary {
    border: 2px solid var(--ebony-clay);
  }
}
</style>
