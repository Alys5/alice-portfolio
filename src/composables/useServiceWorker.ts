/**
 * Composable per gestione Service Worker e PWA
 * - Registrazione automatica del service worker
 * - Comunicazione client-server worker
 * - Monitoraggio stato PWA e cache
 * - Gestione aggiornamenti e installazione
 */

import { ref, onMounted, onUnmounted, readonly } from 'vue'

interface ServiceWorkerState {
  isSupported: boolean
  isRegistered: boolean
  isInstalled: boolean
  isControlling: boolean
  isUpdateAvailable: boolean
  version: string | null
  cacheInfo: Record<string, number>
}

interface ServiceWorkerMessage {
  type: string
  data?: unknown
}

export function useServiceWorker() {
  const state = ref<ServiceWorkerState>({
    isSupported: false,
    isRegistered: false,
    isInstalled: false,
    isControlling: false,
    isUpdateAvailable: false,
    version: null,
    cacheInfo: {},
  })

  const registration = ref<ServiceWorkerRegistration | null>(null)
  const messageChannel = ref<MessageChannel | null>(null)

  /**
   * Registra il service worker
   */
  async function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      console.warn('⚠️ Service Worker non supportato')
      state.value.isSupported = false
      return false
    }

    try {
      state.value.isSupported = true

      registration.value = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none', // Disabilita cache del service worker
      })

      console.log('✅ Service Worker registrato:', registration.value)
      state.value.isRegistered = true

      // Monitora lo stato del service worker
      monitorServiceWorkerState()

      // Inizializza comunicazione
      initializeMessageChannel()

      return true
    } catch (error) {
      console.error('❌ Errore registrazione Service Worker:', error)
      state.value.isRegistered = false
      return false
    }
  }

  /**
   * Monitora lo stato del service worker
   */
  function monitorServiceWorkerState() {
    if (!registration.value) return

    // Monitora installazione
    registration.value.addEventListener('updatefound', () => {
      console.log('🔄 Aggiornamento Service Worker trovato')
      state.value.isUpdateAvailable = true
    })

    // Monitora attivazione
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('🎯 Nuovo Service Worker attivo')
      state.value.isControlling = true
      state.value.isInstalled = true
    })

    // Monitora stato iniziale
    if (registration.value.active) {
      state.value.isControlling = true
      state.value.isInstalled = true
    }

    // Monitora aggiornamenti
    registration.value.addEventListener('updatefound', () => {
      const newWorker = registration.value!.installing
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            state.value.isUpdateAvailable = true
            console.log('🔄 Nuovo Service Worker installato, aggiornamento disponibile')
          }
        })
      }
    })
  }

  /**
   * Inizializza il canale di comunicazione con il service worker
   */
  function initializeMessageChannel() {
    if (!registration.value?.active) return

    messageChannel.value = new MessageChannel()

    messageChannel.value.port1.onmessage = (event) => {
      const { type, data } = event.data as ServiceWorkerMessage

      switch (type) {
        case 'VERSION_INFO':
          state.value.version = data as string
          break
        case 'CACHE_INFO':
          state.value.cacheInfo = data as Record<string, number>
          break
      }
    }

    // Richiedi informazioni iniziali
    requestServiceWorkerInfo()
  }

  /**
   * Richiede informazioni al service worker
   */
  function requestServiceWorkerInfo() {
    if (!registration.value?.active || !messageChannel.value) return

    registration.value.active.postMessage({ type: 'GET_VERSION' }, [messageChannel.value.port2])
  }

  /**
   * Richiede informazioni sulla cache
   */
  async function getCacheInfo() {
    if (!registration.value?.active || !messageChannel.value) return

    return new Promise((resolve) => {
      const port = new MessageChannel()

      port.port1.onmessage = (event) => {
        resolve(event.data)
      }

      registration.value!.active!.postMessage({ type: 'GET_CACHE_INFO' }, [port.port2])
    })
  }

  /**
   * Cachea manualmente una URL
   */
  async function cacheUrl(url: string, cacheName?: string) {
    if (!registration.value?.active) return

    registration.value.active.postMessage({
      type: 'CACHE_URL',
      data: { url, cacheName },
    })
  }

  /**
   * Elimina una cache specifica
   */
  async function deleteCache(cacheName: string) {
    if (!registration.value?.active) return

    registration.value.active.postMessage({
      type: 'DELETE_CACHE',
      data: { cacheName },
    })
  }

  /**
   * Forza l'aggiornamento del service worker
   */
  async function updateServiceWorker() {
    if (!registration.value) return

    try {
      await registration.value.update()
      console.log('🔄 Aggiornamento Service Worker richiesto')
    } catch (error) {
      console.error('❌ Errore aggiornamento Service Worker:', error)
    }
  }

  /**
   * Installa il nuovo service worker
   */
  async function installUpdate() {
    if (!registration.value?.waiting) return

    try {
      registration.value.waiting.postMessage({ type: 'SKIP_WAITING' })
      console.log('✅ Aggiornamento Service Worker installato')
      state.value.isUpdateAvailable = false
    } catch (error) {
      console.error('❌ Errore installazione aggiornamento:', error)
    }
  }

  /**
   * Registra per background sync
   */
  async function registerBackgroundSync(tag: string) {
    if (!registration.value || !('sync' in registration.value)) {
      console.warn('⚠️ Background Sync non supportato')
      return false
    }

    try {
      const syncRegistration = registration.value as ServiceWorkerRegistration & {
        sync: { register(tag: string): Promise<void> }
      }
      await syncRegistration.sync.register(tag)
      console.log('✅ Background Sync registrato:', tag)
      return true
    } catch (error) {
      console.error('❌ Errore registrazione Background Sync:', error)
      return false
    }
  }

  /**
   * Richiede permessi per notifiche push
   */
  async function requestNotificationPermission() {
    if (!('Notification' in window)) {
      console.warn('⚠️ Notifiche non supportate')
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission === 'denied') {
      console.warn('⚠️ Permessi notifiche negati')
      return false
    }

    try {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    } catch (error) {
      console.error('❌ Errore richiesta permessi notifiche:', error)
      return false
    }
  }

  /**
   * Sottoscrive per notifiche push
   */
  async function subscribeToPushNotifications() {
    if (!registration.value) return null

    try {
      const subscription = await registration.value.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY || ''),
      })

      console.log('✅ Sottoscrizione push notifiche:', subscription)
      return subscription
    } catch (error) {
      console.error('❌ Errore sottoscrizione push:', error)
      return null
    }
  }

  /**
   * Converte VAPID key da base64 a Uint8Array
   */
  function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  /**
   * Controlla se l'app è installabile
   */
  function checkInstallability() {
    return new Promise<boolean>((resolve) => {
      if (!registration.value) {
        resolve(false)
        return
      }

      const listener = (event: Event) => {
        event.preventDefault()
        resolve(true)
        registration.value?.removeEventListener('beforeinstallprompt', listener)
      }

      registration.value.addEventListener('beforeinstallprompt', listener)

      // Timeout dopo 1 secondo
      setTimeout(() => {
        resolve(false)
        registration.value?.removeEventListener('beforeinstallprompt', listener)
      }, 1000)
    })
  }

  /**
   * Pulisce le risorse
   */
  function cleanup() {
    if (messageChannel.value) {
      messageChannel.value.port1.close()
      messageChannel.value.port2.close()
      messageChannel.value = null
    }
  }

  // Auto-registrazione al mount
  onMounted(() => {
    registerServiceWorker()
  })

  // Cleanup al unmount
  onUnmounted(() => {
    cleanup()
  })

  return {
    // State
    state: readonly(state),
    registration: readonly(registration),

    // Methods
    registerServiceWorker,
    updateServiceWorker,
    installUpdate,
    getCacheInfo,
    cacheUrl,
    deleteCache,
    registerBackgroundSync,
    requestNotificationPermission,
    subscribeToPushNotifications,
    checkInstallability,
    cleanup,
  }
}
