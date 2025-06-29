<template>
  <form
    class="contact-form"
    @submit.prevent="handleSubmit"
    novalidate
  >
    <h3 class="form-title">{{ t('contact.form.title') }}</h3>

    <!-- Nome -->
    <div class="form-group">
      <label for="name" class="form-label">
        {{ t('contact.form.name.label') }} *
      </label>
      <input
        id="name"
        v-model="formData.name"
        type="text"
        :placeholder="t('contact.form.name.placeholder')"
        class="form-input"
        :class="{ 'is-invalid': errors.name }"
        :aria-describedby="errors.name ? 'name-error' : undefined"
        required
      />
      <div
        v-if="errors.name"
        id="name-error"
        class="error-message"
        role="alert"
      >
        {{ errors.name }}
      </div>
    </div>

    <!-- Email -->
    <div class="form-group">
      <label for="email" class="form-label">
        {{ t('contact.form.email.label') }} *
      </label>
      <input
        id="email"
        v-model="formData.email"
        type="email"
        :placeholder="t('contact.form.email.placeholder')"
        class="form-input"
        :class="{ 'is-invalid': errors.email }"
        :aria-describedby="errors.email ? 'email-error' : undefined"
        required
      />
      <div
        v-if="errors.email"
        id="email-error"
        class="error-message"
        role="alert"
      >
        {{ errors.email }}
      </div>
    </div>

    <!-- Oggetto -->
    <div class="form-group">
      <label for="subject" class="form-label">
        {{ t('contact.form.subject.label') }} *
      </label>
      <select
        id="subject"
        v-model="formData.subject"
        class="form-select"
        :class="{ 'is-invalid': errors.subject }"
        :aria-describedby="errors.subject ? 'subject-error' : undefined"
        required
      >
        <option value="">{{ t('contact.form.subject.placeholder') }}</option>
        <option value="project">{{ t('contact.form.subject.options.project') }}</option>
        <option value="consulting">{{ t('contact.form.subject.options.consulting') }}</option>
        <option value="collaboration">{{ t('contact.form.subject.options.collaboration') }}</option>
        <option value="other">{{ t('contact.form.subject.options.other') }}</option>
      </select>
      <div
        v-if="errors.subject"
        id="subject-error"
        class="error-message"
        role="alert"
      >
        {{ errors.subject }}
      </div>
    </div>

    <!-- Messaggio -->
    <div class="form-group">
      <label for="message" class="form-label">
        {{ t('contact.form.message.label') }} *
      </label>
      <textarea
        id="message"
        v-model="formData.message"
        :placeholder="t('contact.form.message.placeholder')"
        rows="5"
        class="form-textarea"
        :class="{ 'is-invalid': errors.message }"
        :aria-describedby="errors.message ? 'message-error' : undefined"
        required
      ></textarea>
      <div
        v-if="errors.message"
        id="message-error"
        class="error-message"
        role="alert"
      >
        {{ errors.message }}
      </div>
    </div>

    <!-- Privacy -->
    <div class="form-group">
      <label class="checkbox-label">
        <input
          v-model="formData.privacy"
          type="checkbox"
          class="checkbox-input"
          :class="{ 'is-invalid': errors.privacy }"
          required
        />
        <span class="checkbox-text">
          {{ t('contact.form.privacy.text') }}
          <a
            href="/privacy"
            target="_blank"
            class="privacy-link"
          >
            {{ t('contact.form.privacy.link') }}
          </a>
        </span>
      </label>
      <div
        v-if="errors.privacy"
        class="error-message"
        role="alert"
      >
        {{ errors.privacy }}
      </div>
    </div>

    <!-- Submit button -->
    <button
      type="submit"
      class="btn btn-primary"
      :disabled="isSubmitting"
      :aria-label="isSubmitting ? t('contact.form.submitting') : t('contact.form.submit')"
    >
      <span v-if="isSubmitting" class="loading-spinner"></span>
      <span class="btn-text">
        {{ isSubmitting ? t('contact.form.submitting') : t('contact.form.submit') }}
      </span>
    </button>

    <!-- Success message -->
    <div
      v-if="isSuccess"
      class="success-message"
      role="alert"
    >
      {{ t('contact.form.success') }}
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'

// Types
interface FormData {
  name: string
  email: string
  subject: string
  message: string
  privacy: boolean
}

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
  privacy?: string
}

// Emits
const emit = defineEmits<{
  'submit': [formData: FormData]
}>()

// Composables
const { t } = useI18n()

// Reactive state
const formData = reactive<FormData>({
  name: '',
  email: '',
  subject: '',
  message: '',
  privacy: false
})

const errors = reactive<FormErrors>({})
const isSubmitting = ref(false)
const isSuccess = ref(false)

// Validation functions
const validateName = (name: string): string | undefined => {
  if (!name.trim()) {
    return t('contact.form.validation.name.required')
  }
  if (name.trim().length < 2) {
    return t('contact.form.validation.name.minLength')
  }
  return undefined
}

const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) {
    return t('contact.form.validation.email.required')
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return t('contact.form.validation.email.invalid')
  }
  return undefined
}

const validateSubject = (subject: string): string | undefined => {
  if (!subject) {
    return t('contact.form.validation.subject.required')
  }
  return undefined
}

const validateMessage = (message: string): string | undefined => {
  if (!message.trim()) {
    return t('contact.form.validation.message.required')
  }
  if (message.trim().length < 10) {
    return t('contact.form.validation.message.minLength')
  }
  return undefined
}

const validatePrivacy = (privacy: boolean): string | undefined => {
  if (!privacy) {
    return t('contact.form.validation.privacy.required')
  }
  return undefined
}

const validateForm = (): boolean => {
  // Clear previous errors
  Object.keys(errors).forEach(key => {
    delete errors[key as keyof FormErrors]
  })

  // Validate each field
  const nameError = validateName(formData.name)
  const emailError = validateEmail(formData.email)
  const subjectError = validateSubject(formData.subject)
  const messageError = validateMessage(formData.message)
  const privacyError = validatePrivacy(formData.privacy)

  if (nameError) errors.name = nameError
  if (emailError) errors.email = emailError
  if (subjectError) errors.subject = subjectError
  if (messageError) errors.message = messageError
  if (privacyError) errors.privacy = privacyError

  return Object.keys(errors).length === 0
}

// Event handlers
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true
  isSuccess.value = false

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    emit('submit', { ...formData })
    isSuccess.value = true

    // Reset form
    Object.assign(formData, {
      name: '',
      email: '',
      subject: '',
      message: '',
      privacy: false
    })
  } catch (error) {
    console.error('Form submission error:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped lang="scss">
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--bright-sun);
  margin-bottom: 1rem;
  line-height: 1.3;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.4;
}

.form-input,
.form-select,
.form-textarea {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: var(--bright-sun);
    box-shadow: 0 0 0 3px rgba(255, 201, 64, 0.1);
  }

  &.is-invalid {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
}

.form-select {
  cursor: pointer;

  option {
    background: var(--ebony-clay);
    color: rgba(255, 255, 255, 0.9);
  }
}

.error-message {
  font-size: 0.875rem;
  color: #ef4444;
  margin-top: 0.25rem;
  line-height: 1.4;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  margin-top: 0.125rem;
  flex-shrink: 0;
  cursor: pointer;

  &.is-invalid {
    accent-color: #ef4444;
  }
}

.checkbox-text {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
}

.privacy-link {
  color: var(--bright-sun);
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #ffd166;
    text-decoration: underline;
  }
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 201, 64, 0.4);
  }

  &:not(:disabled):active {
    transform: translateY(0);
  }
}

.btn-primary {
  background: var(--bright-sun);
  color: var(--ebony-clay);

  &:not(:disabled):hover {
    background: #ffd166;
  }
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.success-message {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 8px;
  padding: 1rem;
  color: #22c55e;
  font-size: 0.875rem;
  text-align: center;
  line-height: 1.5;
}

// Responsive design
@media (max-width: 768px) {
  .contact-form {
    gap: 1rem;
  }

  .form-title {
    font-size: 1.25rem;
  }

  .form-input,
  .form-select,
  .form-textarea {
    padding: 0.625rem 0.875rem;
    font-size: 0.875rem;
  }

  .form-textarea {
    min-height: 100px;
  }

  .btn {
    padding: 0.875rem 1.5rem;
    font-size: 0.875rem;
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .form-input,
  .form-select,
  .form-textarea {
    transition: none;
  }

  .btn {
    transition: none;

    &:not(:disabled):hover {
      transform: none;
    }
  }

  .loading-spinner {
    animation: none;
  }

  .privacy-link {
    transition: none;
  }
}

// High contrast mode
@media (prefers-contrast: high) {
  .form-input,
  .form-select,
  .form-textarea {
    border-width: 2px;

    &:focus {
      border-width: 3px;
    }

    &.is-invalid {
      border-width: 3px;
    }
  }

  .btn-primary {
    border: 2px solid var(--ebony-clay);
  }

  .checkbox-input {
    border-width: 2px;
  }
}
</style>
