<template>
  <div class="neumorphic-contact-form">
    <div class="form-container neumorphic-card">
      <div class="form-header">
        <h2 class="form-title">{{ t('forms.contact.title') }}</h2>
        <p class="form-subtitle">{{ t('forms.contact.subtitle') }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="contact-form">
        <div class="form-grid">
          <div class="form-group">
            <label for="name" class="form-label">
              {{ t('forms.contact.name') }}
            </label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              class="form-input neumorphic-input"
              :placeholder="t('forms.contact.namePlaceholder')"
              required
            />
            <span v-if="errors.name" class="error-message">
              {{ errors.name }}
            </span>
          </div>

          <div class="form-group">
            <label for="email" class="form-label">
              {{ t('forms.contact.email') }}
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              class="form-input neumorphic-input"
              :placeholder="formatEmail('forms.contact.emailPlaceholder')"
              required
            />
            <span v-if="errors.email" class="error-message">
              {{ errors.email }}
            </span>
          </div>

          <div class="form-group">
            <label for="company" class="form-label">
              {{ t('forms.contact.company') }}
            </label>
            <input
              id="company"
              v-model="formData.company"
              type="text"
              class="form-input neumorphic-input"
              :placeholder="t('forms.contact.companyPlaceholder')"
            />
            <small class="help-text">{{ t('forms.contact.companyHelp') }}</small>
          </div>

          <div class="form-group">
            <label for="budget" class="form-label">
              {{ t('forms.contact.budget') }}
            </label>
            <select
              id="budget"
              v-model="formData.budget"
              class="form-select neumorphic-input"
              required
            >
              <option value="">{{ t('forms.contact.budgetPlaceholder') }}</option>
              <option value="small">{{ t('forms.contact.budgetSmall') }}</option>
              <option value="medium">{{ t('forms.contact.budgetMedium') }}</option>
              <option value="large">{{ t('forms.contact.budgetLarge') }}</option>
              <option value="enterprise">{{ t('forms.contact.budgetEnterprise') }}</option>
            </select>
          </div>

          <div class="form-group full-width">
            <label for="message" class="form-label">
              {{ t('forms.contact.message') }}
            </label>
            <textarea
              id="message"
              v-model="formData.message"
              class="form-textarea neumorphic-input"
              :placeholder="t('forms.contact.messagePlaceholder')"
              rows="6"
              required
            />
            <span v-if="errors.message" class="error-message">
              {{ errors.message }}
            </span>
          </div>
        </div>

        <div class="form-actions">
          <label class="privacy-checkbox">
            <input
              v-model="formData.privacy"
              type="checkbox"
              required
              class="checkbox-input"
            />
            <span class="checkbox-custom"></span>
            <span class="privacy-text">
              {{ t('forms.contact.privacy') }}
              <a href="/privacy" class="privacy-link">
                {{ t('forms.contact.privacyLink') }}
              </a>
            </span>
          </label>

          <button
            type="submit"
            class="submit-btn neumorphic-button"
            :disabled="isSubmitting"
          >
            <span v-if="!isSubmitting">
              {{ t('forms.contact.send') }}
            </span>
            <span v-else class="loading-text">
              {{ t('forms.contact.sending') }}
            </span>
          </button>
        </div>
      </form>

      <!-- Success/Error Messages -->
      <div v-if="submitStatus" class="status-message" :class="submitStatus.type">
        <div class="status-icon">
          {{ submitStatus.type === 'success' ? '✓' : '✗' }}
        </div>
        <div class="status-content">
          <h4 class="status-title">
            {{ submitStatus.type === 'success' ? t('forms.contact.success') : t('forms.contact.error') }}
          </h4>
          <p class="status-text">{{ submitStatus.message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTranslation } from '@/composables/useI18n'

const { t } = useI18n()
const { formatEmail } = useTranslation()

// Form data
const formData = reactive({
  name: '',
  email: '',
  company: '',
  budget: '',
  message: '',
  privacy: false
})

// Form state
const isSubmitting = ref(false)
const submitStatus = ref<{ type: 'success' | 'error'; message: string } | null>(null)

// Validation errors
const errors = reactive({
  name: '',
  email: '',
  message: ''
})

// Validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validateForm = (): boolean => {
  let isValid = true

  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  // Name validation
  if (!formData.name.trim()) {
    errors.name = t('forms.validation.required')
    isValid = false
  } else if (formData.name.trim().length < 2) {
    errors.name = t('forms.validation.minLength', { count: 2 })
    isValid = false
  }

  // Email validation
  if (!formData.email.trim()) {
    errors.email = t('forms.validation.required')
    isValid = false
  } else if (!validateEmail(formData.email)) {
    errors.email = t('forms.validation.email')
    isValid = false
  }

  // Message validation
  if (!formData.message.trim()) {
    errors.message = t('forms.validation.required')
    isValid = false
  } else if (formData.message.trim().length < 10) {
    errors.message = t('forms.validation.minLength', { count: 10 })
    isValid = false
  }

  return isValid
}

// Event handlers
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true
  submitStatus.value = null

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Success handling
    submitStatus.value = {
      type: 'success',
      message: t('forms.contact.success')
    }

    // Reset form
    Object.assign(formData, {
      name: '',
      email: '',
      company: '',
      budget: '',
      message: '',
      privacy: false
    })

  } catch (error) {
    console.error('Error submitting form:', error)
    submitStatus.value = {
      type: 'error',
      message: t('forms.contact.error')
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped lang="scss">
.neumorphic-contact-form {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-8);
}

.form-container {
  background: var(--glass-light);
  border-radius: var(--border-radius-2xl);
  padding: var(--space-12);
  backdrop-filter: blur(20px);
  box-shadow: var(--shadow-glass);
}

.form-header {
  text-align: center;
  margin-bottom: var(--space-12);

  .form-title {
    font-size: var(--font-size-3xl);
    font-weight: 800;
    color: var(--bright-sun);
    margin-bottom: var(--space-4);
  }

  .form-subtitle {
    font-size: var(--font-size-lg);
    color: var(--slate-gray);
    line-height: 1.6;
  }
}

.contact-form {
  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-8);
    margin-bottom: var(--space-8);

    .full-width {
      grid-column: 1 / -1;
    }

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: var(--space-6);
    }
  }

  .form-group {
    position: relative;
  }

  .form-label {
    display: block;
    color: var(--bright-sun);
    font-weight: 600;
    margin-bottom: var(--space-2);
    font-size: var(--font-size-base);
  }

  .form-input,
  .form-select,
  .form-textarea {
    width: 100%;
    padding: var(--space-4);
    background: var(--glass-medium);
    border: 1px solid var(--glass-heavy);
    border-radius: var(--border-radius-lg);
    color: var(--slate-gray);
    font-size: var(--font-size-base);
    transition: all 0.3s ease;
    box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.1),
                inset -2px -2px 4px rgba(255, 255, 255, 0.05);

    &:focus {
      outline: none;
      border-color: var(--bright-sun);
      background: var(--glass-light);
      box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.1),
                  inset -2px -2px 4px rgba(255, 255, 255, 0.05),
                  0 0 0 3px rgba(255, 201, 64, 0.1);
    }

    &::placeholder {
      color: var(--slate-gray);
      opacity: 0.7;
    }
  }

  .form-textarea {
    resize: vertical;
    min-height: 120px;
  }

  .help-text {
    display: block;
    color: var(--slate-gray);
    font-size: var(--font-size-sm);
    margin-top: var(--space-1);
    font-style: italic;
  }

  .error-message {
    display: block;
    color: var(--crimson);
    font-size: var(--font-size-sm);
    margin-top: var(--space-1);
    font-weight: 500;
  }
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  align-items: center;
}

.privacy-checkbox {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  cursor: pointer;
  max-width: 500px;

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
    background: var(--glass-medium);
    box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.1),
                inset -1px -1px 2px rgba(255, 255, 255, 0.05);
  }

  .checkbox-input:checked + .checkbox-custom {
    background: var(--bright-sun);
    box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.2);

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
  min-width: 200px;
  padding: var(--space-4) var(--space-8);
  background: linear-gradient(135deg, var(--bright-sun), var(--bright-sun-light));
  color: var(--ebony-clay);
  border: none;
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-lg);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.2),
              -4px -4px 8px rgba(255, 255, 255, 0.1);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.25),
                -6px -6px 12px rgba(255, 255, 255, 0.15);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.2),
                inset -2px -2px 4px rgba(255, 255, 255, 0.05);
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

.status-message {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  padding: var(--space-6);
  border-radius: var(--border-radius-lg);
  margin-top: var(--space-8);

  &.success {
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.3);
  }

  &.error {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
  }

  .status-icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: var(--font-size-sm);
    flex-shrink: 0;
    margin-top: 2px;

    .success & {
      background: var(--emerald);
      color: white;
    }

    .error & {
      background: var(--crimson);
      color: white;
    }
  }

  .status-content {
    flex: 1;

    .status-title {
      font-size: var(--font-size-lg);
      font-weight: 700;
      margin-bottom: var(--space-2);

      .success & {
        color: var(--emerald);
      }

      .error & {
        color: var(--crimson);
      }
    }

    .status-text {
      color: var(--slate-gray);
      line-height: 1.5;
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

// Responsive design
@media (max-width: 768px) {
  .neumorphic-contact-form {
    padding: var(--space-4);
  }

  .form-container {
    padding: var(--space-8);
  }

  .form-header .form-title {
    font-size: var(--font-size-2xl);
  }

  .submit-btn {
    width: 100%;
    max-width: 300px;
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .form-input,
  .form-select,
  .form-textarea,
  .submit-btn,
  .checkbox-custom {
    transition: none;
  }

  .submit-btn:hover {
    transform: none;
  }
}

// High contrast mode
@media (prefers-contrast: high) {
  .form-input,
  .form-select,
  .form-textarea {
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
