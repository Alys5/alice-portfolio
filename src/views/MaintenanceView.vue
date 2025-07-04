<template>
  <div class="maintenance-page">
    <!-- Skip Links per accessibilità -->
    <div class="skip-links">
      <a href="#main-content" class="skip-link">Salta al contenuto principale</a>
      <a href="#contact-form" class="skip-link">Salta al form di contatto</a>
    </div>

    <!-- Header con animazione -->
    <header class="maintenance-header">
      <div class="container">
        <h1 class="logo-text">Alice Mandelli</h1>
        <p class="logo-subtitle">UI Developer & Designer</p>
      </div>
    </header>

    <!-- Contenuto principale -->
    <main id="main-content" class="maintenance-content">
      <div class="container">
        <!-- Sezione messaggio di manutenzione -->
        <section class="maintenance-message">
          <div class="glass-card">
            <h2>Sito in Manutenzione</h2>
            <p>Stiamo lavorando per migliorare il tuo portfolio! Il sito è temporaneamente in manutenzione.</p>
            <div class="status">
              <span class="status-dot"></span>
              <span>Tempo stimato: 2-3 ore</span>
            </div>
          </div>
        </section>

        <!-- Sezione form di contatto -->
        <section id="contact-form" class="contact-section">
          <div class="glass-card">
            <h3>Richiedi un Preventivo</h3>
            <p>Contattami per richieste di preventivo o progetti. Ti risponderò entro 24 ore!</p>

            <form @submit.prevent="handleSubmit" class="contact-form">
              <div class="form-group">
                <label for="name">Nome completo *</label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  required
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <label for="email">Email *</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <label for="message">Messaggio *</label>
                <textarea
                  id="message"
                  v-model="form.message"
                  required
                  rows="5"
                  class="form-input"
                ></textarea>
              </div>

              <button type="submit" :disabled="isSubmitting" class="submit-button">
                {{ isSubmitting ? 'Invio...' : 'Invia Richiesta' }}
              </button>
            </form>
          </div>
        </section>

        <!-- Sezione informazioni aggiuntive -->
        <section class="info-section">
          <div class="info-grid">
            <div class="info-card glass-card">
              <div class="info-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 16V12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path d="M12 8H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
              <h4>Disponibilità Immediata</h4>
              <p>Disponibile per nuovi progetti e collaborazioni. Tempo di risposta garantito entro 24 ore.</p>
            </div>

            <div class="info-card glass-card">
              <div class="info-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h4>Comunicazione Diretta</h4>
              <p>Lavoro direttamente con i clienti senza intermediari per garantire la massima qualità e trasparenza.</p>
            </div>

            <div class="info-card glass-card">
              <div class="info-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <h4>Qualità Garantita</h4>
              <p>Ogni progetto viene realizzato seguendo le best practice più moderne e standard di qualità elevati.</p>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- Footer -->
    <footer class="maintenance-footer">
      <div class="container">
        <p>&copy; {{ new Date().getFullYear() }} Alice Mandelli. Tutti i diritti riservati.</p>
      </div>
    </footer>

    <!-- Live region per screen reader -->
    <div aria-live="polite" aria-atomic="true" class="sr-only">
      {{ announcement }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// Reactive data
const isSubmitting = ref(false)
const announcement = ref('')

const form = reactive({
  name: '',
  email: '',
  message: ''
})

// Methods
const handleSubmit = async () => {
  isSubmitting.value = true
  announcement.value = 'Invio richiesta in corso...'

  try {
    await new Promise(resolve => setTimeout(resolve, 2000))

    Object.assign(form, {
      name: '',
      email: '',
      message: ''
    })

    announcement.value = 'Richiesta inviata con successo! Ti risponderemo entro 24 ore.'

    // Log per analytics
    if (window.gtag) {
      window.gtag('event', 'form_submit', {
        event_category: 'maintenance_contact',
        event_label: 'maintenance_page'
      })
    }

  } catch (error) {
    announcement.value = 'Errore nell\'invio. Riprova.'
    console.error('Errore invio form:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped lang="scss">
.maintenance-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--charcoal) 0%, var(--ebony-clay) 100%);
  color: var(--bright-sun);
  font-family: var(--font-family-sans);
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

// Skip Links
.skip-links {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1000;
}

.skip-link {
  background: var(--bright-sun);
  color: var(--ebony-clay);
  padding: 0.5rem 1rem;
  position: absolute;
  left: -999px;
  top: 0;
  transition: left 0.2s;
  text-decoration: none;
  font-weight: 600;
  border-radius: var(--radius-sm);

  &:focus {
    left: 0;
  }
}

// Header
.maintenance-header {
  padding: var(--space-16) 0;
  text-align: center;
}

.logo-text {
  font-size: var(--font-size-hero);
  font-weight: 800;
  background: linear-gradient(135deg, var(--bright-sun), var(--emerald));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.logo-subtitle {
  font-size: var(--font-size-lg);
  color: var(--picton-blue);
  margin-top: var(--space-2);
}

// Main Content
.maintenance-content {
  padding: var(--space-20) 0;
}

.glass-card {
  background: var(--glass-light);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-medium);
  border-radius: var(--radius-xl);
  padding: var(--space-12);
  margin-bottom: var(--space-12);
  text-align: center;
}

.glass-card h2 {
  font-size: var(--font-size-3xl);
  margin-bottom: var(--space-6);
  color: var(--bright-sun);
}

.glass-card h3 {
  font-size: var(--font-size-2xl);
  margin-bottom: var(--space-4);
  color: var(--bright-sun);
}

.glass-card p {
  font-size: var(--font-size-lg);
  line-height: 1.6;
  margin-bottom: var(--space-8);
  color: var(--slate-gray);
}

.status {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-6);
  background: var(--glass-light);
  border-radius: var(--radius-full);
  border: 1px solid var(--glass-medium);
}

.status-dot {
  width: 12px;
  height: 12px;
  background: var(--emerald);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

// Contact Section
.contact-section {
  margin-bottom: var(--space-20);
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  max-width: 500px;
  margin: 0 auto;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  text-align: left;
}

.form-group label {
  font-weight: 600;
  color: var(--bright-sun);
}

.form-input {
  padding: var(--space-4);
  background: var(--glass-light);
  border: 1px solid var(--glass-medium);
  border-radius: var(--radius-lg);
  color: var(--bright-sun);
  font-size: var(--font-size-base);
  backdrop-filter: blur(10px);

  &:focus {
    outline: none;
    border-color: var(--bright-sun);
    box-shadow: 0 0 0 3px var(--bright-sun-alpha);
  }
}

.submit-button {
  margin-top: var(--space-6);
  padding: var(--space-4) var(--space-8);
  background: linear-gradient(135deg, var(--persian-blue), var(--picton-blue));
  border: none;
  border-radius: var(--radius-lg);
  color: white;
  font-size: var(--font-size-lg);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--duration-normal) var(--easing-standard);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-xl);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

// Info Section
.info-section {
  margin-bottom: var(--space-20);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-8);
  max-width: 1000px;
  margin: 0 auto;
}

.info-card {
  padding: var(--space-8);
  text-align: center;
  transition: transform var(--duration-normal) var(--easing-standard);

  &:hover {
    transform: translateY(-4px);
  }

  h4 {
    font-size: var(--font-size-lg);
    font-weight: 600;
    margin-bottom: var(--space-4);
    color: var(--bright-sun);
  }

  p {
    color: var(--slate-gray);
    line-height: 1.6;
  }
}

.info-icon {
  margin-bottom: var(--space-4);
  color: var(--picton-blue);

  svg {
    filter: drop-shadow(0 0 8px var(--picton-blue-alpha));
  }
}

// Footer
.maintenance-footer {
  padding: var(--space-12) 0;
  border-top: 1px solid var(--glass-medium);
  background: var(--glass-ultra-light);
  text-align: center;
}

// Animations
@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

// Screen reader only
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

// Responsive
@media (max-width: 768px) {
  .container {
    padding: 0 var(--space-4);
  }

  .logo-text {
    font-size: var(--font-size-3xl);
  }

  .glass-card {
    padding: var(--space-8);
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .animate-fluid-fade,
  .animate-magnetic,
  .spinner,
  .status-dot {
    animation: none !important;
  }

  .submit-button:hover {
    transform: none !important;
  }
}

// High contrast mode
@media (prefers-contrast: high) {
  .neumorphic-input {
    border-width: 2px;
  }

  .checkbox-custom {
    border-width: 3px;
  }
}
</style>
