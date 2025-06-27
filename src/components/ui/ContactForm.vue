<template>
  <form class="contact-form" @submit.prevent="onSubmit" novalidate>
    <div class="form-group">
      <label :for="idName">{{ $t('contact.form.name') }}</label>
      <input
        :id="idName"
        type="text"
        v-model="form.name"
        :aria-describedby="errors.name ? idNameError : undefined"
        :aria-invalid="!!errors.name"
        autocomplete="name"
        required
      />
      <span v-if="errors.name" :id="idNameError" class="form-error" role="alert">{{
        errors.name
      }}</span>
    </div>
    <div class="form-group">
      <label :for="idEmail">{{ $t('contact.form.email') }}</label>
      <input
        :id="idEmail"
        type="email"
        v-model="form.email"
        :aria-describedby="errors.email ? idEmailError : undefined"
        :aria-invalid="!!errors.email"
        autocomplete="email"
        required
      />
      <span v-if="errors.email" :id="idEmailError" class="form-error" role="alert">{{
        errors.email
      }}</span>
    </div>
    <div class="form-group">
      <label :for="idMessage">{{ $t('contact.form.message') }}</label>
      <textarea
        :id="idMessage"
        v-model="form.message"
        :aria-describedby="errors.message ? idMessageError : undefined"
        :aria-invalid="!!errors.message"
        required
        rows="5"
      ></textarea>
      <span v-if="errors.message" :id="idMessageError" class="form-error" role="alert">{{
        errors.message
      }}</span>
    </div>
    <button type="submit" :disabled="loading">
      <span v-if="loading">{{ $t('contact.form.loading') }}</span>
      <span v-else>{{ $t('contact.form.submit') }}</span>
    </button>

    <!-- Live region per annunci di stato -->
    <div aria-live="polite" aria-atomic="true" class="sr-only" :aria-label="liveAnnouncement">
      {{ liveAnnouncement }}
    </div>

    <!-- Messaggi visibili -->
    <p v-if="successMessage" class="form-success" aria-live="polite">{{ successMessage }}</p>
    <p v-if="errorMessage" class="form-error" aria-live="assertive">{{ errorMessage }}</p>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAccessibilityAnnouncements } from '../../composables/useAccessibilityAnnouncements'

const { t } = useI18n()
const { announceToScreenReader, announceError } = useAccessibilityAnnouncements()

const form = ref({
  name: '',
  email: '',
  message: '',
})

const errors = ref({
  name: '',
  email: '',
  message: '',
})

const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const liveAnnouncement = ref('')

const idName = 'contact-name'
const idEmail = 'contact-email'
const idMessage = 'contact-message'
const idNameError = 'contact-name-error'
const idEmailError = 'contact-name-error'
const idMessageError = 'contact-message-error'

function validate() {
  errors.value = { name: '', email: '', message: '' }
  let valid = true
  let errorCount = 0

  // Nome obbligatorio, almeno 2 caratteri
  if (!form.value.name.trim()) {
    errors.value.name = t('contact.form.validation.nameRequired')
    valid = false
    errorCount++
  } else if (form.value.name.trim().length < 2) {
    errors.value.name = t('contact.form.validation.nameMinLength')
    valid = false
    errorCount++
  }
  // Email obbligatoria e valida
  if (!form.value.email.trim()) {
    errors.value.email = t('contact.form.validation.emailRequired')
    valid = false
    errorCount++
  } else if (!/^\S+@\S+\.\S+$/.test(form.value.email)) {
    errors.value.email = t('contact.form.validation.emailInvalid')
    valid = false
    errorCount++
  }
  // Messaggio obbligatorio, almeno 10 caratteri
  if (!form.value.message.trim()) {
    errors.value.message = t('contact.form.validation.messageRequired')
    valid = false
    errorCount++
  } else if (form.value.message.trim().length < 10) {
    errors.value.message = t('contact.form.validation.messageMinLength')
    valid = false
    errorCount++
  }

  // Annuncia errori di validazione
  if (!valid) {
    const errorText =
      errorCount === 1
        ? t('contact.form.validation.singleError')
        : t('contact.form.validation.multipleErrors', { count: errorCount })
    announceError(errorText)
  }

  return valid
}

async function onSubmit() {
  successMessage.value = ''
  errorMessage.value = ''
  liveAnnouncement.value = ''

  if (!validate()) {
    // Focus sul primo errore
    setTimeout(() => {
      const firstError = document.querySelector('.form-error')
      if (firstError) {
        ;(firstError.previousElementSibling as HTMLElement)?.focus()
      }
    }, 10)
    return
  }

  loading.value = true
  liveAnnouncement.value = t('contact.form.status.sending')
  announceToScreenReader(t('contact.form.status.sending'))

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: 'YOUR_WEB3FORMS_ACCESS_KEY',
        name: form.value.name,
        email: form.value.email,
        message: form.value.message,
      }),
    })
    const data = await response.json()
    if (data.success) {
      successMessage.value = t('contact.form.success')
      liveAnnouncement.value = t('contact.form.status.success')
      announceToScreenReader(t('contact.form.status.success'))
      form.value = { name: '', email: '', message: '' }
    } else {
      errorMessage.value = t('contact.form.error')
      liveAnnouncement.value = t('contact.form.status.error')
      announceError(t('contact.form.status.error'))
    }
  } catch {
    errorMessage.value = t('contact.form.error')
    liveAnnouncement.value = t('contact.form.status.error')
    announceError(t('contact.form.status.error'))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.contact-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.2em;
}
input,
textarea {
  padding: 0.7em 1em;
  border-radius: 1em;
  border: 1px solid var(--color-light-gray);
  background: var(--color-white);
  box-shadow: var(--shadow-soft);
  font-size: 1rem;
  resize: none;
  transition: border-color 0.2s;
}
input:focus,
textarea:focus {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
  border-color: var(--color-focus);
}
.form-error {
  color: var(--color-danger);
  font-size: 0.95em;
  margin-top: 0.1em;
}
.form-success {
  color: var(--color-success-fallback);
  font-size: 1em;
  margin-top: 0.5em;
}
button[type='submit'] {
  background: var(--color-primary);
  color: var(--color-secondary);
  border: none;
  border-radius: 2em;
  font-size: 1.1rem;
  font-weight: 700;
  padding: 0.7em 2em;
  box-shadow: var(--shadow-soft);
  cursor: pointer;
  transition:
    box-shadow 0.2s,
    transform 0.2s;
}
button[type='submit']:hover:not(:disabled) {
  box-shadow: var(--shadow-medium);
  transform: scale(1.04);
}
button[disabled] {
  opacity: 0.7;
  cursor: not-allowed;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
@media (prefers-reduced-motion: reduce) {
  * {
    transition-duration: 0.01ms !important;
  }
}
</style>
