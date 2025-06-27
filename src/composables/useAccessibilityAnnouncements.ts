import { ref } from 'vue'

/**
 * Composable per annunci di accessibilità avanzati
 * Trend 2025: WCAG 2.2+ compliance e live regions
 */
export function useAccessibilityAnnouncements() {
  const liveRegion = ref('')

  /**
   * Annuncia un messaggio agli screen reader
   */
  const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    // Crea un elemento temporaneo per l'annuncio
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message

    document.body.appendChild(announcement)

    // Rimuovi dopo l'annuncio
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement)
      }
    }, 1000)
  }

  /**
   * Annuncia cambiamenti di stato
   */
  const announceStateChange = (element: HTMLElement, state: string) => {
    const label = element.getAttribute('aria-label') || element.textContent || 'Elemento'
    announceToScreenReader(`${label}: ${state}`)
  }

  /**
   * Annuncia navigazione
   */
  const announceNavigation = (pageName: string) => {
    announceToScreenReader(`Navigato a ${pageName}`)
  }

  /**
   * Annuncia caricamento
   */
  const announceLoading = (item: string) => {
    announceToScreenReader(`Caricamento ${item} in corso`)
  }

  /**
   * Annuncia completamento
   */
  const announceComplete = (item: string) => {
    announceToScreenReader(`${item} caricato completamente`)
  }

  /**
   * Annuncia errore
   */
  const announceError = (error: string) => {
    announceToScreenReader(`Errore: ${error}`, 'assertive')
  }

  return {
    liveRegion,
    announceToScreenReader,
    announceStateChange,
    announceNavigation,
    announceLoading,
    announceComplete,
    announceError,
  }
}
