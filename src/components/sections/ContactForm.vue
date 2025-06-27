<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import useCursor from '@/composables/useCursor'

// INTERFACCIA CONTACT FIELD
export interface ContactField {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'textarea'
  placeholder?: string
  rules?: {
    required?: boolean
    minLength?: number
    pattern?: RegExp
  }
}

// TYPES
interface Grecaptcha {
  ready: (callback: () => void) => void
  execute: (siteKey: string, options: { action: string }) => Promise<string>
}

declare global {
  interface Window {
    grecaptcha?: Grecaptcha
  }
}

// PROPS
const props = withDefaults(defineProps<{
  fields: ContactField[]
  submitEndpoint: string
  successMessage?: string
  errorMessage?: string
  recaptchaKey?: string
  contentType?: 'form-data' | 'json'
}>(), {
  successMessage: 'Messaggio inviato!',
  errorMessage: 'Qualcosa è andato storto',
  contentType: 'json'
})

// EMITS
const emit = defineEmits<{
  (e: 'sent', data: Record<string, string>): void
  (e: 'error', error: Error): void
  (e: 'validation-change', isValid: boolean): void
}>()

// CURSOR
const { addMagnetic, removeMagnetic } = useCursor()

// FORM STATE
const formData = ref<Record<string, string>>({})
const fieldErrors = ref<Record<string, string[]>>({})
const isSubmitting = ref(false)
const isSubmitted = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')
const formRef = ref<HTMLFormElement | null>(null)

// INITIALIZE FORM DATA
onMounted(() => {
  props.fields.forEach(field => {
    formData.value[field.name] = ''
  })
})

// VALIDATION
const validateField = (field: ContactField, value: string): string[] => {
  const errors: string[] = []
  const { rules } = field

  if (!rules) return errors

  // Required validation
  if (rules.required && (!value || value.trim() === '')) {
    errors.push(`${field.label} è obbligatorio`)
  }

  // Min length validation
  if (rules.minLength && value && value.length < rules.minLength) {
    errors.push(`${field.label} deve essere di almeno ${rules.minLength} caratteri`)
  }

  // Pattern validation
  if (rules.pattern && value && !rules.pattern.test(value)) {
    errors.push(`${field.label} non è nel formato corretto`)
  }

  // Email validation
  if (field.type === 'email' && value) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(value)) {
      errors.push('Inserisci un indirizzo email valido')
    }
  }

  // Phone validation
  if (field.type === 'tel' && value) {
    const phonePattern = /^[\+]?[0-9\s\-\(\)]{8,}$/
    if (!phonePattern.test(value)) {
      errors.push('Inserisci un numero di telefono valido')
    }
  }

  return errors
}

const validateForm = (): boolean => {
  const newErrors: Record<string, string[]> = {}
  let isValid = true

  props.fields.forEach(field => {
    const fieldErrors = validateField(field, formData.value[field.name])
    if (fieldErrors.length > 0) {
      newErrors[field.name] = fieldErrors
      isValid = false
    }
  })

  fieldErrors.value = newErrors
  emit('validation-change', isValid)
  return isValid
}

// FIELD HANDLERS
const onFieldInput = (field: ContactField) => {
  const errors = validateField(field, formData.value[field.name])
  if (errors.length > 0) {
    fieldErrors.value[field.name] = errors
  } else {
    delete fieldErrors.value[field.name]
  }
  emit('validation-change', Object.keys(fieldErrors.value).length === 0)
}

const onFieldBlur = (field: ContactField) => {
  onFieldInput(field)
}

// RECAPTCHA
const loadRecaptcha = async (): Promise<string | null> => {
  if (!props.recaptchaKey) return null

  return new Promise((resolve) => {
    if (window.grecaptcha) {
      window.grecaptcha.ready(() => {
        window.grecaptcha!.execute(props.recaptchaKey!, { action: 'contact_form' })
          .then((token: string) => resolve(token))
          .catch(() => resolve(null))
      })
    } else {
      resolve(null)
    }
  })
}

// SUBMIT
const submitTimeout = ref<number | null>(null)

const submitForm = async () => {
  if (isSubmitting.value || !validateForm()) return

  isSubmitting.value = true

  try {
    // Debounced submit
    if (submitTimeout.value) clearTimeout(submitTimeout.value)

    submitTimeout.value = window.setTimeout(async () => {
      // Get reCAPTCHA token if enabled
      const recaptchaToken = await loadRecaptcha()

      let headers: HeadersInit | undefined
      let body: BodyInit

      if (props.contentType === 'json') {
        // JSON payload
        headers = { 'Content-Type': 'application/json' }
        body = JSON.stringify({ ...formData.value, recaptchaToken })
      } else {
        // FormData payload
        const formDataPayload = new FormData()
        Object.entries(formData.value).forEach(([key, value]) => {
          formDataPayload.append(key, value)
        })
        if (recaptchaToken) {
          formDataPayload.append('recaptchaToken', recaptchaToken)
        }
        body = formDataPayload
      }

      // Submit request
      const response = await fetch(props.submitEndpoint, {
        method: 'POST',
        headers,
        body
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      // Success
      isSubmitted.value = true
      showToastMessage(props.successMessage, 'success')
      emit('sent', formData.value)

      // Reset form
      props.fields.forEach(field => {
        formData.value[field.name] = ''
      })
      fieldErrors.value = {}

    }, 300)

  } catch (error) {
    console.error('Form submission error:', error)
    showToastMessage(props.errorMessage, 'error')
    emit('error', error as Error)
  } finally {
    isSubmitting.value = false
  }
}

// TOAST
const showToastMessage = (message: string, type: 'success' | 'error') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true

  // Auto-hide after 4 seconds
  setTimeout(() => {
    showToast.value = false
  }, 4000)
}

// ANIMATIONS
const animateForm = () => {
  if (!formRef.value) return

  gsap.fromTo(formRef.value,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.1
    }
  )
}

const animateFieldFocus = (element: HTMLElement) => {
  gsap.to(element, {
    scale: 1.02,
    boxShadow: '0 0 20px rgba(72, 169, 248, 0.3)',
    duration: 0.3,
    ease: 'power2.out'
  })
}

const animateFieldBlur = (element: HTMLElement) => {
  gsap.to(element, {
    scale: 1,
    boxShadow: '0 0 0 rgba(72, 169, 248, 0)',
    duration: 0.3,
    ease: 'power2.out'
  })
}

const animateButton = (element: HTMLElement) => {
  gsap.to(element, {
    scale: 1.05,
    duration: 0.2,
    ease: 'elastic.out(1, 0.3)',
    yoyo: true,
    repeat: 1
  })
}

// CLEANUP
onUnmounted(() => {
  if (submitTimeout.value) clearTimeout(submitTimeout.value)
  gsap.killTweensOf(formRef.value)
})

// INITIALIZE
onMounted(() => {
  animateForm()
})
</script>

<template>
  <section class="contact-form-section">
    <!-- Screen reader announcements -->
    <div
      id="form-announcement"
      aria-live="polite"
      aria-atomic="true"
      class="sr-only"
    />

    <!-- Contact Form -->
    <form
      ref="formRef"
      class="contact-form glass-card"
      @submit.prevent="submitForm"
      novalidate
      aria-label="Modulo di contatto"
    >
      <div class="form-header">
        <h2 class="form-title">Contattami</h2>
        <p class="form-subtitle">Hai un progetto in mente? Parliamone!</p>
      </div>

      <div class="form-grid">
        <div
          v-for="field in fields"
          :key="field.name"
          class="form-field-wrapper"
          :class="{ 'has-error': fieldErrors[field.name]?.length }"
        >
          <label
            :for="field.name"
            class="field-label"
            :class="{ 'required': field.rules?.required }"
          >
            {{ field.label }}
            <span v-if="field.rules?.required" class="required-asterisk" aria-label="campo obbligatorio">*</span>
          </label>

          <!-- Text Input -->
          <input
            v-if="field.type === 'text' || field.type === 'email' || field.type === 'tel'"
            :id="field.name"
            :name="field.name"
            :type="field.type"
            :placeholder="field.placeholder"
            v-model="formData[field.name]"
            @input="onFieldInput(field)"
            @focus="animateFieldFocus($event.target as HTMLElement)"
            @blur="animateFieldBlur($event.target as HTMLElement); onFieldBlur(field)"
            :aria-required="field.rules?.required"
            :aria-invalid="fieldErrors[field.name]?.length > 0"
            :aria-describedby="fieldErrors[field.name]?.length ? `${field.name}-error` : undefined"
            class="form-input"
            :class="{ 'error': fieldErrors[field.name]?.length }"
          />

          <!-- Textarea -->
          <textarea
            v-else-if="field.type === 'textarea'"
            :id="field.name"
            :name="field.name"
            :placeholder="field.placeholder"
            v-model="formData[field.name]"
            @input="onFieldInput(field)"
            @focus="animateFieldFocus($event.target as HTMLElement)"
            @blur="animateFieldBlur($event.target as HTMLElement); onFieldBlur(field)"
            :aria-required="field.rules?.required"
            :aria-invalid="fieldErrors[field.name]?.length > 0"
            :aria-describedby="fieldErrors[field.name]?.length ? `${field.name}-error` : undefined"
            class="form-textarea"
            :class="{ 'error': fieldErrors[field.name]?.length }"
            rows="4"
          />

          <!-- Error Messages -->
          <div
            v-if="fieldErrors[field.name]?.length"
            :id="`${field.name}-error`"
            class="field-errors"
            role="alert"
            aria-live="polite"
          >
            <span
              v-for="error in fieldErrors[field.name]"
              :key="error"
              class="error-message"
            >
              {{ error }}
            </span>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="form-actions">
        <button
          type="submit"
          class="submit-btn"
          :disabled="isSubmitting || Object.keys(fieldErrors).length > 0"
          :aria-busy="isSubmitting"
          @mouseenter="addMagnetic($event.currentTarget as HTMLElement)"
          @mouseleave="removeMagnetic($event.currentTarget as HTMLElement)"
          @click="animateButton($event.currentTarget as HTMLElement)"
        >
          <span v-if="!isSubmitting" class="btn-text">Invia Messaggio</span>
          <span v-else class="btn-text">Invio in corso...</span>
          <div v-if="isSubmitting" class="loading-spinner" aria-hidden="true">
            <span class="spinner-dot" v-for="n in 3" :key="n" />
          </div>
        </button>
      </div>

      <!-- Success Message -->
      <div
        v-if="isSubmitted"
        class="success-message"
        role="status"
        aria-live="polite"
      >
        <svg class="success-icon" viewBox="0 0 24 24" fill="none">
          <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        </svg>
        <span>Messaggio inviato con successo!</span>
      </div>
    </form>

    <!-- Toast Notification -->
    <transition name="toast-fade">
      <div
        v-if="showToast"
        class="toast-notification"
        :class="toastType"
        role="alert"
        aria-live="assertive"
      >
        <div class="toast-content">
          <svg v-if="toastType === 'success'" class="toast-icon" viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          </svg>
          <svg v-else class="toast-icon" viewBox="0 0 24 24" fill="none">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" stroke-width="2"/>
            <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" stroke-width="2"/>
            <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span class="toast-message">{{ toastMessage }}</span>
        </div>
        <button
          class="toast-close"
          @click="showToast = false"
          aria-label="Chiudi notifica"
        >
          ×
        </button>
      </div>
    </transition>
  </section>
</template>

<style scoped lang="scss">
.contact-form-section {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 0;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  border: 0;
}

.contact-form {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: clamp(12px, 2vw, 24px);
  padding: 2.5rem;
  box-shadow: 0 8px 32px rgba(31,38,135,0.18);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--bright-sun-alpha), var(--persian-blue-alpha));
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  &:hover::before {
    opacity: 1;
  }
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-title {
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: 800;
  color: var(--persian-blue);
  margin-bottom: 0.5rem;
  letter-spacing: -0.01em;
}

.form-subtitle {
  font-size: 1.1rem;
  color: var(--ebony-clay);
  opacity: 0.8;
  margin: 0;
}

.form-grid {
  display: grid;
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  // Full-width fields
  .form-field-wrapper:has(.form-textarea),
  .form-field-wrapper:last-child:nth-child(odd) {
    grid-column: 1 / -1;
  }
}

.form-field-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &.has-error {
    .form-input,
    .form-textarea {
      border-color: #ff4d4f;
      box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2);
    }
  }
}

.field-label {
  font-weight: 600;
  color: var(--ebony-clay);
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;

  &.required .required-asterisk {
    color: #ff4d4f;
    font-weight: 700;
  }
}

.form-input,
.form-textarea {
  background: rgba(255,255,255,0.15);
  border: 2px solid rgba(255,255,255,0.2);
  border-radius: clamp(8px, 1.5vw, 16px);
  padding: 0.8rem 1rem;
  font-size: 1rem;
  color: var(--ebony-clay);
  outline: none;
  transition: all 0.3s cubic-bezier(0.25,0.46,0.45,0.94);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  &::placeholder {
    color: var(--ebony-clay);
    opacity: 0.6;
  }

  &:focus {
    border-color: var(--bright-sun);
    box-shadow: 0 0 0 3px rgba(255, 201, 64, 0.2);
    background: rgba(255,255,255,0.2);
  }

  &.error {
    border-color: #ff4d4f;
    box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2);
  }
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
}

.field-errors {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.error-message {
  color: #ff4d4f;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.3rem;

  &::before {
    content: '⚠';
    font-size: 0.8rem;
  }
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.submit-btn {
  background: linear-gradient(135deg, var(--bright-sun), var(--persian-blue));
  color: var(--ebony-clay);
  border: none;
  border-radius: clamp(12px, 2vw, 20px);
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25,0.46,0.45,0.94);
  box-shadow: 0 4px 16px rgba(255, 201, 64, 0.3);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 0.8rem;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--persian-blue), var(--picton-blue));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(255, 201, 64, 0.4);

    &::before {
      opacity: 1;
    }

    .btn-text {
      color: #fff;
    }
  }

  &:focus-visible {
    outline: 2px solid var(--bright-sun);
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .btn-text {
    position: relative;
    z-index: 1;
    transition: color 0.3s ease;
  }
}

.loading-spinner {
  display: flex;
  gap: 0.3rem;
  position: relative;
  z-index: 1;

  .spinner-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    animation: spinner-bounce 1.2s infinite;

    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
}

@keyframes spinner-bounce {
  0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}

.success-message {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: rgba(82, 196, 26, 0.1);
  border: 1px solid rgba(82, 196, 26, 0.3);
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1.5rem;
  color: #52c41a;
  font-weight: 600;

  .success-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
}

.toast-notification {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1rem 1.5rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  display: flex;
  align-items: center;
  gap: 0.8rem;
  z-index: 1000;
  max-width: 90vw;
  width: max-content;

  &.success {
    border-left: 4px solid #52c41a;
    color: #52c41a;
  }

  &.error {
    border-left: 4px solid #ff4d4f;
    color: #ff4d4f;
  }

  .toast-content {
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }

  .toast-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  .toast-message {
    font-weight: 600;
    font-size: 1rem;
  }

  .toast-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s;
    margin-left: 0.5rem;

    &:hover {
      opacity: 1;
    }
  }
}

// Toast animations
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.25,0.46,0.45,0.94);
}

.toast-fade-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .contact-form,
  .form-input,
  .form-textarea,
  .submit-btn,
  .toast-notification {
    transition: none;
  }

  .submit-btn:hover {
    transform: none;
  }

  .loading-spinner .spinner-dot {
    animation: none;
  }
}

// Responsive
@media (max-width: 767px) {
  .contact-form {
    padding: 1.5rem;
    margin: 0 1rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .submit-btn {
    width: 100%;
    justify-content: center;
  }

  .toast-notification {
    bottom: 1rem;
    left: 1rem;
    right: 1rem;
    transform: none;
    width: auto;
  }
}
</style>
