/**
 * Error Tracking Utility
 * Configurazione per Sentry e gestione errori centralizzata
 */

interface ErrorContext {
  component?: string
  action?: string
  userId?: string
  route?: string
}

interface ErrorInfo {
  message: string
  stack?: string
  context?: ErrorContext
  severity?: 'low' | 'medium' | 'high' | 'critical'
}

class ErrorTracker {
  private isInitialized = false
  private isDevelopment = import.meta.env.DEV

  /**
   * Inizializza il tracking degli errori
   */
  init() {
    if (this.isInitialized) return

    // In development, logga solo in console
    if (this.isDevelopment) {
      console.info('[ErrorTracker] Inizializzato in modalità development')
      this.isInitialized = true
      return
    }

    // In production, configura Sentry
    this.initSentry()
    this.isInitialized = true
  }

  /**
   * Inizializza Sentry
   */
  private initSentry() {
    // TODO: Configurare Sentry DSN
    // import * as Sentry from '@sentry/vue'
    // Sentry.init({
    //   app,
    //   dsn: import.meta.env.VITE_SENTRY_DSN,
    //   environment: import.meta.env.MODE,
    //   integrations: [
    //     Sentry.browserTracingIntegration(),
    //     Sentry.replayIntegration(),
    //   ],
    //   tracesSampleRate: 1.0,
    //   replaysSessionSampleRate: 0.1,
    //   replaysOnErrorSampleRate: 1.0,
    // })
  }

  /**
   * Traccia un errore
   */
  captureError(error: Error | string, context?: ErrorContext) {
    const errorInfo: ErrorInfo = {
      message: typeof error === 'string' ? error : error.message,
      stack: error instanceof Error ? error.stack : undefined,
      context,
      severity: 'medium',
    }

    if (this.isDevelopment) {
      console.error('[ErrorTracker]', errorInfo)
      return
    }

    // In production, invia a Sentry
    // Sentry.captureException(error, {
    //   tags: context,
    //   extra: errorInfo,
    // })
  }

  /**
   * Traccia un messaggio informativo
   */
  captureMessage(message: string, context?: ErrorContext) {
    if (this.isDevelopment) {
      console.info('[ErrorTracker]', message, context)
      return
    }

    // Sentry.captureMessage(message, {
    //   level: 'info',
    //   tags: context,
    // })
  }

  /**
   * Imposta il contesto utente
   */
  setUser(userId: string, userInfo?: Record<string, unknown>) {
    if (this.isDevelopment) {
      console.info('[ErrorTracker] User context:', { userId, userInfo })
      return
    }

    // Sentry.setUser({
    //   id: userId,
    //   ...userInfo,
    // })
  }

  /**
   * Imposta il contesto del tag
   */
  setTag(key: string, value: string) {
    if (this.isDevelopment) {
      console.info('[ErrorTracker] Tag:', { key, value })
      return
    }

    // Sentry.setTag(key, value)
  }

  /**
   * Imposta il contesto extra
   */
  setExtra(key: string, value: unknown) {
    if (this.isDevelopment) {
      console.info('[ErrorTracker] Extra:', { key, value })
      return
    }

    // Sentry.setExtra(key, value)
  }
}

// Istanza singleton
export const errorTracker = new ErrorTracker()

/**
 * Composable per il tracking degli errori
 */
export function useErrorTracking() {
  const trackError = (error: Error | string, context?: ErrorContext) => {
    errorTracker.captureError(error, context)
  }

  const trackMessage = (message: string, context?: ErrorContext) => {
    errorTracker.captureMessage(message, context)
  }

  const setUserContext = (userId: string, userInfo?: Record<string, unknown>) => {
    errorTracker.setUser(userId, userInfo)
  }

  return {
    trackError,
    trackMessage,
    setUserContext,
  }
}

/**
 * Error Boundary per componenti Vue
 */
export function createErrorBoundary() {
  return {
    error: null as Error | null,
    errorInfo: null as Record<string, unknown> | null,

    captureError(error: Error, errorInfo: Record<string, unknown>) {
      this.error = error
      this.errorInfo = errorInfo

      errorTracker.captureError(error, {
        component: errorInfo?.componentName as string,
        action: 'render',
      })
    },

    reset() {
      this.error = null
      this.errorInfo = null
    },
  }
}

// Inizializza automaticamente
errorTracker.init()
