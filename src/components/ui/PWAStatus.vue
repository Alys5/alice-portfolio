<template>
  <div class="pwa-status" v-if="state.isSupported">
    <!-- Stato generale PWA -->
    <div class="pwa-status__header">
      <h3 class="pwa-status__title">
        <span class="pwa-status__icon">📱</span>
        Stato PWA
      </h3>
      <div class="pwa-status__version" v-if="state.version">v{{ state.version }}</div>
    </div>

    <!-- Indicatori di stato -->
    <div class="pwa-status__indicators">
      <div
        class="pwa-status__indicator"
        :class="{ 'pwa-status__indicator--active': state.isRegistered }"
      >
        <span class="pwa-status__indicator-icon">
          {{ state.isRegistered ? '✅' : '⏳' }}
        </span>
        <span class="pwa-status__indicator-text">
          {{ state.isRegistered ? 'Registrato' : 'Registrazione...' }}
        </span>
      </div>

      <div
        class="pwa-status__indicator"
        :class="{ 'pwa-status__indicator--active': state.isInstalled }"
      >
        <span class="pwa-status__indicator-icon">
          {{ state.isInstalled ? '✅' : '⏳' }}
        </span>
        <span class="pwa-status__indicator-text">
          {{ state.isInstalled ? 'Installato' : 'Installazione...' }}
        </span>
      </div>

      <div
        class="pwa-status__indicator"
        :class="{ 'pwa-status__indicator--active': state.isControlling }"
      >
        <span class="pwa-status__indicator-icon">
          {{ state.isControlling ? '✅' : '⏳' }}
        </span>
        <span class="pwa-status__indicator-text">
          {{ state.isControlling ? 'Attivo' : 'Attivazione...' }}
        </span>
      </div>
    </div>

    <!-- Aggiornamento disponibile -->
    <div v-if="state.isUpdateAvailable" class="pwa-status__update">
      <div class="pwa-status__update-message">
        <span class="pwa-status__update-icon">🔄</span>
        <span>Aggiornamento disponibile</span>
      </div>
      <button @click="installUpdate" class="pwa-status__update-button" :disabled="isUpdating">
        {{ isUpdating ? 'Aggiornamento...' : 'Aggiorna' }}
      </button>
    </div>

    <!-- Informazioni cache -->
    <div v-if="Object.keys(state.cacheInfo).length > 0" class="pwa-status__cache">
      <h4 class="pwa-status__cache-title">Cache</h4>
      <div class="pwa-status__cache-items">
        <div v-for="(count, name) in state.cacheInfo" :key="name" class="pwa-status__cache-item">
          <span class="pwa-status__cache-name">{{ name }}</span>
          <span class="pwa-status__cache-count">{{ count }} elementi</span>
        </div>
      </div>
    </div>

    <!-- Azioni -->
    <div class="pwa-status__actions">
      <button @click="refreshCacheInfo" class="pwa-status__action-button" :disabled="isRefreshing">
        {{ isRefreshing ? 'Aggiornamento...' : 'Aggiorna Cache Info' }}
      </button>

      <button @click="checkForUpdates" class="pwa-status__action-button" :disabled="isChecking">
        {{ isChecking ? 'Controllo...' : 'Controlla Aggiornamenti' }}
      </button>
    </div>

    <!-- Debug info (solo in sviluppo) -->
    <details v-if="isDev" class="pwa-status__debug">
      <summary>Debug Info</summary>
      <pre class="pwa-status__debug-content">{{ debugInfo }}</pre>
    </details>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useServiceWorker } from '@/composables/useServiceWorker'

const {
  state,
  installUpdate: installUpdateSW,
  getCacheInfo,
  updateServiceWorker,
} = useServiceWorker()

const isUpdating = ref(false)
const isRefreshing = ref(false)
const isChecking = ref(false)

const isDev = computed(() => import.meta.env.DEV)

const debugInfo = computed(() => ({
  state: state.value,
  userAgent: navigator.userAgent,
  onLine: navigator.onLine,
  connection:
    (navigator as Navigator & { connection?: { effectiveType?: string } }).connection
      ?.effectiveType || 'unknown',
}))

/**
 * Installa l'aggiornamento del service worker
 */
async function installUpdate() {
  isUpdating.value = true
  try {
    await installUpdateSW()
    // Ricarica la pagina dopo l'aggiornamento
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  } catch (error) {
    console.error("Errore durante l'aggiornamento:", error)
  } finally {
    isUpdating.value = false
  }
}

/**
 * Aggiorna le informazioni sulla cache
 */
async function refreshCacheInfo() {
  isRefreshing.value = true
  try {
    await getCacheInfo()
  } catch (error) {
    console.error("Errore durante l'aggiornamento cache info:", error)
  } finally {
    isRefreshing.value = false
  }
}

/**
 * Controlla se ci sono aggiornamenti disponibili
 */
async function checkForUpdates() {
  isChecking.value = true
  try {
    await updateServiceWorker()
  } catch (error) {
    console.error('Errore durante il controllo aggiornamenti:', error)
  } finally {
    isChecking.value = false
  }
}

// Aggiorna le informazioni sulla cache al mount
onMounted(() => {
  setTimeout(() => {
    refreshCacheInfo()
  }, 2000) // Aspetta che il service worker sia pronto
})
</script>

<style scoped lang="scss">
.pwa-status {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  font-size: var(--text-sm);

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-md);
  }

  &__title {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-size: var(--text-lg);
    font-weight: 600;
    margin: 0;
  }

  &__icon {
    font-size: var(--text-xl);
  }

  &__version {
    font-size: var(--text-xs);
    color: var(--color-text-secondary);
    background: var(--color-surface-variant);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-sm);
  }

  &__indicators {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-lg);
  }

  &__indicator {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm);
    border-radius: var(--radius-sm);
    background: var(--color-surface-variant);
    transition: all var(--duration-sm) var(--easing-standard);

    &--active {
      background: var(--color-primary-container);
      color: var(--color-on-primary-container);
    }
  }

  &__indicator-icon {
    font-size: var(--text-lg);
  }

  &__indicator-text {
    font-weight: 500;
  }

  &__update {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--color-warning-container);
    color: var(--color-on-warning-container);
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    margin-bottom: var(--spacing-lg);
  }

  &__update-message {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-weight: 500;
  }

  &__update-icon {
    font-size: var(--text-lg);
  }

  &__update-button {
    background: var(--color-warning);
    color: var(--color-on-warning);
    border: none;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-sm);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--duration-sm) var(--easing-standard);

    &:hover:not(:disabled) {
      background: var(--color-warning-dark);
      transform: translateY(-1px);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &__cache {
    margin-bottom: var(--spacing-lg);
  }

  &__cache-title {
    font-size: var(--text-md);
    font-weight: 600;
    margin: 0 0 var(--spacing-sm) 0;
  }

  &__cache-items {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  &__cache-item {
    display: flex;
    justify-content: space-between;
    padding: var(--spacing-xs) var(--spacing-sm);
    background: var(--color-surface-variant);
    border-radius: var(--radius-sm);
    font-size: var(--text-xs);
  }

  &__cache-name {
    font-weight: 500;
  }

  &__cache-count {
    color: var(--color-text-secondary);
  }

  &__actions {
    display: flex;
    gap: var(--spacing-sm);
    flex-wrap: wrap;
  }

  &__action-button {
    background: var(--color-primary);
    color: var(--color-on-primary);
    border: none;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-sm);
    font-size: var(--text-sm);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--duration-sm) var(--easing-standard);

    &:hover:not(:disabled) {
      background: var(--color-primary-dark);
      transform: translateY(-1px);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &__debug {
    margin-top: var(--spacing-lg);
    padding-top: var(--spacing-lg);
    border-top: 1px solid var(--color-border);

    summary {
      cursor: pointer;
      font-weight: 500;
      color: var(--color-text-secondary);
    }
  }

  &__debug-content {
    margin-top: var(--spacing-sm);
    padding: var(--spacing-sm);
    background: var(--color-surface-variant);
    border-radius: var(--radius-sm);
    font-size: var(--text-xs);
    overflow-x: auto;
    white-space: pre-wrap;
  }
}

// Responsive
@media (max-width: 768px) {
  .pwa-status {
    padding: var(--spacing-md);

    &__update {
      flex-direction: column;
      gap: var(--spacing-sm);
      text-align: center;
    }

    &__actions {
      flex-direction: column;
    }
  }
}
</style>
