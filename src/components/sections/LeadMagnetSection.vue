<template>
  <section
    class="lead-magnet-section"
    aria-labelledby="lead-magnet-title"
  >
    <div class="container">
      <div class="lead-magnet-content glass-card">
        <div class="content-left">
          <div class="section-header">
            <h2 id="lead-magnet-title" class="section-title">
              {{ t('leadMagnet.title') }}
            </h2>
            <p class="section-subtitle">
              {{ t('leadMagnet.subtitle') }}
            </p>
          </div>

          <div class="benefits-list">
            <div
              v-for="(benefit, index) in benefits"
              :key="index"
              class="benefit-item animate-fluid-fade"
              :class="`animate-delay-${(index + 1) * 100}`"
            >
              <div class="benefit-icon">✓</div>
              <span class="benefit-text">{{ t(`leadMagnet.benefits.benefit${index + 1}`) }}</span>
            </div>
          </div>

          <div class="testimonial animate-fluid-fade animate-delay-500">
            <blockquote class="testimonial-text">
              "{{ t('leadMagnet.testimonial') }}"
            </blockquote>
            <div class="testimonial-author">
              <strong>{{ t('leadMagnet.author') }}</strong>
              <span>{{ t('leadMagnet.authorRole') }}</span>
            </div>
          </div>
        </div>

        <div class="content-right">
          <div class="form-container neumorphic-card">
            <h3 class="form-title">{{ t('leadMagnet.form.title') }}</h3>
            <p class="form-subtitle">{{ t('leadMagnet.form.subtitle') }}</p>

            <form @submit.prevent="handleSubmit" class="lead-form">
              <div class="form-group">
                <label for="firstName" class="form-label">
                  {{ t('leadMagnet.form.firstName') }}
                </label>
                <input
                  id="firstName"
                  v-model="formData.firstName"
                  type="text"
                  class="form-input neumorphic-input"
                  :placeholder="t('leadMagnet.form.firstNamePlaceholder')"
                  required
                />
              </div>

              <div class="form-group">
                <label for="email" class="form-label">
                  {{ t('leadMagnet.form.email') }}
                </label>
                <input
                  id="email"
                  v-model="formData.email"
                  type="email"
                  class="form-input neumorphic-input"
                  :placeholder="formatEmail('leadMagnet.form.emailPlaceholder')"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label">
                  {{ t('leadMagnet.form.interests') }}
                </label>
                <div class="interests-grid">
                  <label
                    v-for="interest in interests"
                    :key="interest.value"
                    class="interest-checkbox"
                  >
                    <input
                      v-model="formData.interests"
                      type="checkbox"
                      :value="interest.value"
                      class="checkbox-input"
                    />
                    <span class="checkbox-custom"></span>
                    <span class="interest-label">{{ interest.label }}</span>
                  </label>
                </div>
              </div>

              <div class="form-group">
                <label class="privacy-checkbox">
                  <input
                    v-model="formData.privacy"
                    type="checkbox"
                    required
                    class="checkbox-input"
                  />
                  <span class="checkbox-custom"></span>
                  <span class="privacy-text">
                    {{ t('leadMagnet.form.privacy') }}
                    <a href="/privacy" class="privacy-link">
                      {{ t('leadMagnet.form.privacyLink') }}
                    </a>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                class="submit-btn neumorphic-button"
                :disabled="isSubmitting"
              >
                <span v-if="!isSubmitting">
                  {{ t('leadMagnet.form.submit') }}
                </span>
                <span v-else class="loading-text">
                  {{ t('leadMagnet.form.submitting') }}
                </span>
              </button>
            </form>

            <div class="trust-indicators">
              <div class="trust-item">
                <span class="trust-icon">🔒</span>
                <span class="trust-text">{{ t('leadMagnet.trust.privacy') }}</span>
              </div>
              <div class="trust-item">
                <span class="trust-icon">📧</span>
                <span class="trust-text">{{ t('leadMagnet.trust.noSpam') }}</span>
              </div>
              <div class="trust-item">
                <span class="trust-icon">↩️</span>
                <span class="trust-text">{{ t('leadMagnet.trust.unsubscribe') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTranslation } from '@/composables/useI18n'
import useAnimations from '@/composables/useAnimations'

const { t } = useI18n()
const { formatEmail } = useTranslation()
const { staggerIn } = useAnimations()

// Form data
const formData = ref({
  firstName: '',
  email: '',
  interests: [] as string[],
  privacy: false
})

const isSubmitting = ref(false)

// Benefits list
const benefits = ref([
  'benefit1',
  'benefit2',
  'benefit3',
  'benefit4'
])

// Interests options
const interests = ref([
  { value: 'ui-ux', label: 'UI/UX Design' },
  { value: 'ai', label: 'AI & Machine Learning' },
  { value: 'frontend', label: 'Frontend Development' },
  { value: 'accessibility', label: 'Accessibility' },
  { value: 'performance', label: 'Performance Optimization' },
  { value: 'trends', label: 'Design Trends' }
])

// Event handlers
const handleSubmit = async () => {
  if (formData.value.interests.length > 3) {
    alert('Seleziona massimo 3 interessi')
    return
  }

  isSubmitting.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Success handling
    console.log('Form submitted:', formData.value)

    // Reset form
    formData.value = {
      firstName: '',
      email: '',
      interests: [],
      privacy: false
    }

    // Show success message
    alert('Grazie! La guida è stata inviata alla tua email.')

  } catch (error) {
    console.error('Error submitting form:', error)
    alert('Errore nell\'invio. Riprova più tardi.')
  } finally {
    isSubmitting.value = false
  }
}

// Lifecycle
onMounted(() => {
  // Animate elements on mount
  const animatedElements = document.querySelectorAll('[class*="animate-"]')
  staggerIn(Array.from(animatedElements), { delay: 200, stagger: 100 })
})
</script>

<style lang="scss" scoped>
// @use "@/styles/variables" as vars;
@use "sass:color";
.lead-magnet-section {
  padding: var(--space-20) 0;
  background: linear-gradient(135deg, var(--ebony-clay), var(--charcoal));
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 70%, var(--bright-sun-alpha) 0%, transparent 50%),
                radial-gradient(circle at 70% 30%, var(--persian-blue-alpha) 0%, transparent 50%);
    z-index: 1;
  }
}

.container {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.lead-magnet-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-12);
  align-items: start;
  background: var(--glass-light);
  border-radius: var(--border-radius-2xl);
  padding: var(--space-12);
  backdrop-filter: blur(20px);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-8);
    padding: var(--space-8);
  }
}

.content-left {
  .section-header {
    margin-bottom: var(--space-8);
  }

  .section-title {
    font-size: var(--font-size-3xl);
    font-weight: 800;
    color: var(--bright-sun);
    margin-bottom: var(--space-4);
    line-height: 1.2;
  }

  .section-subtitle {
    font-size: var(--font-size-lg);
    color: var(--slate-gray);
    line-height: 1.6;
  }
}

.benefits-list {
  margin-bottom: var(--space-8);
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
  padding: var(--space-3);
  background: var(--glass-ultra-light);
  border-radius: var(--border-radius-lg);
  transition: all 0.3s ease;

  &:hover {
    background: var(--glass-light);
    transform: translateX(4px);
  }

  .benefit-icon {
    width: 24px;
    height: 24px;
    background: var(--bright-sun);
    color: var(--ebony-clay);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: var(--font-size-sm);
  }

  .benefit-text {
    color: var(--slate-gray);
    font-weight: 500;
  }
}

.testimonial {
  background: var(--glass-medium);
  border-radius: var(--border-radius-xl);
  padding: var(--space-6);
  border-left: 4px solid var(--bright-sun);

  .testimonial-text {
    font-style: italic;
    color: var(--slate-gray);
    font-size: var(--font-size-lg);
    line-height: 1.6;
    margin-bottom: var(--space-4);
  }

  .testimonial-author {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);

    strong {
      color: var(--bright-sun);
      font-weight: 600;
    }

    span {
      color: var(--slate-gray);
      font-size: var(--font-size-sm);
    }
  }
}

.content-right {
  .form-container {
    background: var(--glass-medium);
    border-radius: var(--border-radius-xl);
    padding: var(--space-8);
  }

  .form-title {
    font-size: var(--font-size-2xl);
    font-weight: 700;
    color: var(--bright-sun);
    margin-bottom: var(--space-2);
    text-align: center;
  }

  .form-subtitle {
    color: var(--slate-gray);
    text-align: center;
    margin-bottom: var(--space-8);
  }
}

.lead-form {
  .form-group {
    margin-bottom: var(--space-6);
  }

  .form-label {
    display: block;
    color: var(--bright-sun);
    font-weight: 600;
    margin-bottom: var(--space-2);
  }

  .form-input {
    width: 100%;
    padding: var(--space-4);
    background: var(--glass-light);
    border: 1px solid var(--glass-medium);
    border-radius: var(--border-radius-lg);
    color: var(--slate-gray);
    font-size: var(--font-size-base);
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: var(--bright-sun);
      background: var(--glass-medium);
    }

    &::placeholder {
      color: var(--slate-gray);
      opacity: 0.7;
    }
  }
}

.interests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--space-3);
}

.interest-checkbox {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
  padding: var(--space-2);
  border-radius: var(--border-radius-md);
  transition: background 0.3s ease;

  &:hover {
    background: var(--glass-light);
  }

  .checkbox-input {
    display: none;
  }

  .checkbox-custom {
    width: 18px;
    height: 18px;
    border: 2px solid var(--bright-sun);
    border-radius: var(--border-radius-sm);
    position: relative;
    transition: all 0.3s ease;
  }

  .checkbox-input:checked + .checkbox-custom {
    background: var(--bright-sun);

    &::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: var(--ebony-clay);
      font-size: var(--font-size-sm);
      font-weight: 700;
    }
  }

  .interest-label {
    color: var(--slate-gray);
    font-size: var(--font-size-sm);
  }
}

.privacy-checkbox {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  cursor: pointer;

  .checkbox-input {
    display: none;
  }

  .checkbox-custom {
    width: 20px;
    height: 20px;
    border: 2px solid var(--bright-sun);
    border-radius: var(--border-radius-sm);
    position: relative;
    flex-shrink: 0;
    margin-top: 2px;
    transition: all 0.3s ease;
  }

  .checkbox-input:checked + .checkbox-custom {
    background: var(--bright-sun);

    &::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: var(--ebony-clay);
      font-size: var(--font-size-sm);
      font-weight: 700;
    }
  }

  .privacy-text {
    color: var(--slate-gray);
    font-size: var(--font-size-sm);
    line-height: 1.5;

    .privacy-link {
      color: var(--bright-sun);
      text-decoration: none;
      font-weight: 600;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.submit-btn {
  width: 100%;
  padding: var(--space-4) var(--space-8);
  background: linear-gradient(135deg, var(--bright-sun), var(--bright-sun-light));
  color: var(--ebony-clay);
  border: none;
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-lg);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: var(--space-6);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  .loading-text {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);

    &::after {
      content: '';
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  }
}

.trust-indicators {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.trust-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2);
  background: var(--glass-ultra-light);
  border-radius: var(--border-radius-md);

  .trust-icon {
    font-size: var(--font-size-lg);
  }

  .trust-text {
    color: var(--slate-gray);
    font-size: var(--font-size-sm);
    font-weight: 500;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

// Responsive design
@media (max-width: 768px) {
  .lead-magnet-content {
    padding: var(--space-6);
  }

  .interests-grid {
    grid-template-columns: 1fr;
  }

  .trust-indicators {
    flex-direction: column;
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .benefit-item,
  .submit-btn,
  .form-input {
    transition: none;
  }

  .benefit-item:hover {
    transform: none;
  }

  .submit-btn:hover {
    transform: none;
  }
}

// High contrast mode
@media (prefers-contrast: high) {
  .form-input {
    border-width: 2px;
  }

  .checkbox-custom {
    border-width: 2px;
  }

  .submit-btn {
    border: 2px solid var(--ebony-clay);
  }
}
</style>
