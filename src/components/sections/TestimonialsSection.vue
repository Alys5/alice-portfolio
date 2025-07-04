<template>
  <section
    class="testimonials-section"
    id="testimonials"
    aria-labelledby="testimonials-title"
  >
    <div class="testimonials-container">
      <!-- Header sezione -->
      <div class="section-header">
        <h2 id="testimonials-title" class="section-title">
          {{ testimonialsData.title }}
        </h2>
        <p class="section-subtitle">
          {{ testimonialsData.subtitle }}
        </p>
      </div>

      <!-- Carousel testimonial -->
      <div class="testimonials-carousel">
        <div
          class="carousel-container"
          :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
        >
          <TestimonialCard
            v-for="testimonial in testimonials"
            :key="testimonial.id"
            :testimonial="testimonial"
            class="carousel-item"
          />
        </div>

        <!-- Controlli carousel -->
        <div class="carousel-controls">
          <button
            class="control-btn prev"
            @click="previousTestimonial"
            :aria-label="t('testimonials.controls.previous')"
            :disabled="currentIndex === 0"
          >
            <span class="control-icon">←</span>
          </button>

          <div class="carousel-indicators">
            <button
              v-for="(testimonial, index) in testimonials"
              :key="testimonial.id"
              class="indicator"
              :class="{ 'is-active': index === currentIndex }"
              @click="goToTestimonial(index)"
              :aria-label="`${t('testimonials.controls.previous')} ${index + 1}`"
            ></button>
          </div>

          <button
            class="control-btn next"
            @click="nextTestimonial"
            :aria-label="t('testimonials.controls.next')"
            :disabled="currentIndex === testimonials.length - 1"
          >
            <span class="control-icon">→</span>
          </button>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="testimonials-cta">
        <button
          class="btn btn-primary"
          @click="handleContactCTA"
          :aria-label="t('testimonials.cta.button')"
        >
          <span class="btn-text">{{ t('testimonials.cta.button') }}</span>
          <span class="btn-icon">→</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import TestimonialCard from '@/components/ui/TestimonialCard.vue'

// Props interface
interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  rating: number
  avatar?: string
}

interface Props {
  testimonials?: Testimonial[]
  autoPlay?: boolean
  interval?: number
}

const props = withDefaults(defineProps<Props>(), {
  testimonials: () => [
    {
      id: 'marco-rossi',
      name: 'Marco Rossi',
      role: 'Product Manager',
      company: 'SNAM',
      content: 'Alice ha trasformato completamente la nostra piattaforma enterprise. La sua attenzione ai dettagli e la capacità di comprendere le esigenze aziendali hanno reso il progetto un successo. L\'interfaccia è ora più intuitiva e performante.',
      rating: 5,
      avatar: '/images/testimonials/marco-rossi.jpg'
    },
    {
      id: 'sara-bianchi',
      name: 'Sara Bianchi',
      role: 'UX Director',
      company: 'Paragraph AI',
      content: 'Collaborare con Alice è stata un\'esperienza straordinaria. La sua competenza tecnica e la sensibilità per il design hanno permesso di creare interfacce AI che sono sia funzionali che esteticamente belle. Un vero professionista.',
      rating: 5,
      avatar: '/images/testimonials/sara-bianchi.jpg'
    },
    {
      id: 'luca-verdi',
      name: 'Luca Verdi',
      role: 'CTO',
      company: 'Poste Italiane',
      content: 'Alice ha dimostrato una grande capacità di adattarsi ai nostri processi aziendali complessi. Il sistema CRM che ha sviluppato ha migliorato significativamente l\'efficienza del nostro team. Altamente raccomandata.',
      rating: 5,
      avatar: '/images/testimonials/luca-verdi.jpg'
    }
  ],
  autoPlay: true,
  interval: 5000
})

// Emits
const emit = defineEmits<{
  'contact-cta': []
}>()

// Composables
const { t } = useI18n()

// Reactive state
const currentIndex = ref(0)
let autoPlayInterval: number | null = null

// Computed properties
const testimonialsData = computed(() => ({
  title: t('testimonials.title'),
  subtitle: t('testimonials.subtitle')
}))

// Event handlers
const nextTestimonial = () => {
  if (currentIndex.value < props.testimonials.length - 1) {
    currentIndex.value++
  } else {
    currentIndex.value = 0
  }
}

const previousTestimonial = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  } else {
    currentIndex.value = props.testimonials.length - 1
  }
}

const goToTestimonial = (index: number) => {
  currentIndex.value = index
}

const handleContactCTA = () => {
  emit('contact-cta')
}

// Auto-play functionality
const startAutoPlay = () => {
  if (props.autoPlay) {
    autoPlayInterval = window.setInterval(() => {
      nextTestimonial()
    }, props.interval)
  }
}

const stopAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
    autoPlayInterval = null
  }
}

// Lifecycle
onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<style scoped lang="scss">
.testimonials-section {
  padding: 6rem 0;
  background: linear-gradient(135deg, var(--ebony-clay), #1a202c);
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
    background: radial-gradient(circle at 50% 30%, var(--bright-sun-alpha) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, var(--picton-blue-alpha) 0%, transparent 50%);
    z-index: 1;
  }
}

.testimonials-container {
  position: relative;
  z-index: 2;
  max-width: 1000px;
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

.testimonials-carousel {
  position: relative;
  margin-bottom: 4rem;
  overflow: hidden;
}

.carousel-container {
  display: flex;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.carousel-item {
  flex: 0 0 100%;
  width: 100%;
}

.carousel-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
}

.control-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover:not(:disabled) {
    background: var(--bright-sun);
    color: var(--ebony-clay);
    border-color: var(--bright-sun);
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  &:focus {
    outline: 2px solid var(--bright-sun);
    outline-offset: 2px;
  }
}

.control-icon {
  font-size: 1.25rem;
  font-weight: 700;
}

.carousel-indicators {
  display: flex;
  gap: 0.5rem;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.5);
  }

  &.is-active {
    background: var(--bright-sun);
    border-color: var(--bright-sun);
    transform: scale(1.2);
  }

  &:focus {
    outline: 2px solid var(--bright-sun);
    outline-offset: 2px;
  }
}

.testimonials-cta {
  text-align: center;
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
  .testimonials-section {
    padding: 4rem 0;
  }

  .testimonials-container {
    padding: 0 1rem;
  }

  .carousel-controls {
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .control-btn {
    width: 40px;
    height: 40px;
  }

  .control-icon {
    font-size: 1rem;
  }

  .indicator {
    width: 10px;
    height: 10px;
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .carousel-container {
    transition: none;
  }

  .control-btn {
    transition: none;

    &:hover:not(:disabled) {
      transform: none;
    }
  }

  .indicator {
    transition: none;

    &.is-active {
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
}

// High contrast mode
@media (prefers-contrast: high) {
  .control-btn {
    border-width: 2px;

    &:hover:not(:disabled) {
      border-width: 3px;
    }
  }

  .indicator {
    border-width: 2px;
  }

  .btn-primary {
    border: 2px solid var(--ebony-clay);
  }
}
</style>
