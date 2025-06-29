<template>
  <section
    class="contact-section"
    id="contact"
    aria-labelledby="contact-title"
  >
    <div class="contact-container">
      <!-- Header sezione -->
      <div class="section-header">
        <h2 id="contact-title" class="section-title">
          {{ contactData.title }}
        </h2>
        <p class="section-subtitle">
          {{ contactData.subtitle }}
        </p>
      </div>

      <!-- Contenuto principale -->
      <div class="contact-content">
        <!-- Informazioni di contatto -->
        <div class="contact-info">
          <h3 class="info-title">{{ t('contact.info.title') }}</h3>

          <div class="info-items">
            <div class="info-item">
              <div class="info-icon">📧</div>
              <div class="info-content">
                <h4 class="info-label">{{ t('contact.info.email.label') }}</h4>
                <a
                  href="mailto:alice.mandelli@example.com"
                  class="info-value"
                  :aria-label="`Invia email a ${t('contact.info.email.value')}`"
                >
                  {{ t('contact.info.email.value') }}
                </a>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon">📱</div>
              <div class="info-content">
                <h4 class="info-label">{{ t('contact.info.phone.label') }}</h4>
                <a
                  href="tel:+393331234567"
                  class="info-value"
                  :aria-label="`Chiama ${t('contact.info.phone.value')}`"
                >
                  {{ t('contact.info.phone.value') }}
                </a>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon">📍</div>
              <div class="info-content">
                <h4 class="info-label">{{ t('contact.info.location.label') }}</h4>
                <p class="info-value">{{ t('contact.info.location.value') }}</p>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon">⏰</div>
              <div class="info-content">
                <h4 class="info-label">{{ t('contact.info.availability.label') }}</h4>
                <p class="info-value">{{ t('contact.info.availability.value') }}</p>
              </div>
            </div>
          </div>

          <!-- Social links -->
          <div class="social-links">
            <h4 class="social-title">{{ t('contact.social.title') }}</h4>
            <div class="social-icons">
              <a
                href="https://linkedin.com/in/alice-mandelli"
                target="_blank"
                rel="noopener noreferrer"
                class="social-link"
                :aria-label="t('contact.social.linkedin')"
              >
                <span class="social-icon">💼</span>
              </a>
              <a
                href="https://github.com/alice-mandelli"
                target="_blank"
                rel="noopener noreferrer"
                class="social-link"
                :aria-label="t('contact.social.github')"
              >
                <span class="social-icon">🐙</span>
              </a>
              <a
                href="https://dribbble.com/alice-mandelli"
                target="_blank"
                rel="noopener noreferrer"
                class="social-link"
                :aria-label="t('contact.social.dribbble')"
              >
                <span class="social-icon">🏀</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Form di contatto -->
        <div class="contact-form-container">
          <ContactForm @submit="handleFormSubmit" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ContactForm from '../ui/ContactForm.vue'

// Types
interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
  privacy: boolean
}

// Emits
const emit = defineEmits<{
  'form-submit': [formData: ContactFormData]
}>()

// Composables
const { t } = useI18n()

// Computed properties
const contactData = computed(() => ({
  title: t('contact.title'),
  subtitle: t('contact.subtitle')
}))

// Event handlers
const handleFormSubmit = (formData: ContactFormData) => {
  emit('form-submit', formData)
}
</script>

<style scoped lang="scss">
.contact-section {
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
    background: radial-gradient(circle at 20% 80%, var(--bright-sun-alpha) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, var(--persian-blue-alpha) 0%, transparent 50%);
    z-index: 1;
  }
}

.contact-container {
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

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

.contact-info {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2.5rem;
}

.info-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--bright-sun);
  margin-bottom: 2rem;
  line-height: 1.3;
}

.info-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.info-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, var(--bright-sun), var(--bright-sun-light));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
  box-shadow: 0 4px 15px rgba(255, 201, 64, 0.3);
}

.info-content {
  flex: 1;
  min-width: 0;
}

.info-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: var(--bright-sun);
  }
}

.social-links {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 2rem;
}

.social-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--bright-sun);
  margin-bottom: 1rem;
}

.social-icons {
  display: flex;
  gap: 1rem;
}

.social-link {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background: var(--bright-sun);
    border-color: var(--bright-sun);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 201, 64, 0.4);
  }

  &:focus {
    outline: 2px solid var(--bright-sun);
    outline-offset: 2px;
  }
}

.social-icon {
  font-size: 1.25rem;
  transition: transform 0.3s ease;

  .social-link:hover & {
    transform: scale(1.1);
  }
}

.contact-form-container {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2.5rem;
}

// Responsive design
@media (max-width: 768px) {
  .contact-section {
    padding: 4rem 0;
  }

  .contact-container {
    padding: 0 1rem;
  }

  .contact-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .contact-info,
  .contact-form-container {
    padding: 2rem;
  }

  .info-items {
    gap: 1rem;
  }

  .info-item {
    gap: 0.75rem;
  }

  .info-icon {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  .social-link {
    width: 45px;
    height: 45px;
  }

  .social-icon {
    font-size: 1.125rem;
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .info-value {
    transition: none;
  }

  .social-link {
    transition: none;

    &:hover {
      transform: none;
    }
  }

  .social-icon {
    transition: none;

    .social-link:hover & {
      transform: none;
    }
  }
}

// High contrast mode
@media (prefers-contrast: high) {
  .contact-info,
  .contact-form-container {
    border-width: 2px;
    border-color: var(--bright-sun);
  }

  .social-link {
    border-width: 2px;

    &:hover {
      border-width: 3px;
    }
  }
}
</style>
