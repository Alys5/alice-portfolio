import { ref, onMounted, watch, readonly } from 'vue'
import { useDebounceFn } from '@vueuse/core'

export interface UserPreferences {
  reducedMotion: boolean
  highContrast: boolean
  lowLight: boolean
  fontSize: 'small' | 'medium' | 'large'
  colorScheme: 'light' | 'dark' | 'auto'
  soundEnabled: boolean
}

/**
 * Composable per gestire le preferenze utente e accessibilità
 * Implementa WCAG 2.2+ compliance e supporto per preferenze del sistema
 *
 * @returns Oggetto con stato reattivo, metodi per aggiornare/toggle/reset preferenze, e helper per accessibilità
 */
export function useUserPreferences() {
  const preferences = ref<UserPreferences>({
    reducedMotion: false,
    highContrast: false,
    lowLight: false,
    fontSize: 'medium',
    colorScheme: 'auto',
    soundEnabled: true,
  })

  const isInitialized = ref(false)

  /**
   * Carica le preferenze dal localStorage
   */
  const loadPreferences = () => {
    try {
      const stored = localStorage.getItem('user-preferences')
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<UserPreferences>
        preferences.value = { ...preferences.value, ...parsed }
      }
    } catch (error) {
      console.warn('Failed to load user preferences:', error)
    }
  }

  /**
   * Salva le preferenze nel localStorage
   */
  const savePreferences = () => {
    try {
      localStorage.setItem('user-preferences', JSON.stringify(preferences.value))
    } catch (error) {
      console.warn('Failed to save user preferences:', error)
    }
  }

  /**
   * Rileva le preferenze del sistema
   */
  const detectSystemPreferences = () => {
    // Reduced motion
    preferences.value.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // High contrast
    preferences.value.highContrast = window.matchMedia('(prefers-contrast: high)').matches

    // Color scheme
    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)')
    if (preferences.value.colorScheme === 'auto') {
      applyColorScheme(colorSchemeQuery.matches ? 'dark' : 'light')
    }

    // Listen for changes
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)')

    reducedMotionQuery.addEventListener('change', (e) => {
      preferences.value.reducedMotion = e.matches
      applyReducedMotion(e.matches)
    })

    highContrastQuery.addEventListener('change', (e) => {
      preferences.value.highContrast = e.matches
      applyHighContrast(e.matches)
    })

    colorSchemeQuery.addEventListener('change', (e) => {
      if (preferences.value.colorScheme === 'auto') {
        applyColorScheme(e.matches ? 'dark' : 'light')
      }
    })
  }

  /**
   * Applica reduced motion
   */
  const applyReducedMotion = (enabled: boolean) => {
    const root = document.documentElement
    if (enabled) {
      root.style.setProperty('--micro-duration', '0.01ms')
      root.style.setProperty('--micro-duration-slow', '0.01ms')
      root.style.setProperty('--ufo-animation-duration', '0.01ms')
    } else {
      root.style.removeProperty('--micro-duration')
      root.style.removeProperty('--micro-duration-slow')
      root.style.removeProperty('--ufo-animation-duration')
    }
  }

  /**
   * Applica high contrast
   */
  const applyHighContrast = (enabled: boolean) => {
    const root = document.documentElement
    if (enabled) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }
  }

  /**
   * Applica low light mode
   */
  const applyLowLight = (enabled: boolean) => {
    const root = document.documentElement
    if (enabled) {
      root.classList.add('low-light')
    } else {
      root.classList.remove('low-light')
    }
  }

  /**
   * Applica color scheme
   */
  const applyColorScheme = (scheme: 'light' | 'dark') => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(scheme)
  }

  /**
   * Applica font size
   */
  const applyFontSize = (size: UserPreferences['fontSize']) => {
    const root = document.documentElement
    const sizes = {
      small: '14px',
      medium: '16px',
      large: '18px',
    }
    root.style.fontSize = sizes[size]
  }

  /**
   * Aggiorna una preferenza
   */
  const updatePreference = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    preferences.value[key] = value

    // Applica immediatamente
    switch (key) {
      case 'reducedMotion':
        applyReducedMotion(value as boolean)
        break
      case 'highContrast':
        applyHighContrast(value as boolean)
        break
      case 'lowLight':
        applyLowLight(value as boolean)
        break
      case 'colorScheme':
        if (value !== 'auto') {
          applyColorScheme(value as 'light' | 'dark')
        }
        break
      case 'fontSize':
        applyFontSize(value as UserPreferences['fontSize'])
        break
    }
  }

  /**
   * Reset alle preferenze di default
   */
  const resetPreferences = () => {
    preferences.value = {
      reducedMotion: false,
      highContrast: false,
      lowLight: false,
      fontSize: 'medium',
      colorScheme: 'auto',
      soundEnabled: true,
    }

    // Rimuovi tutte le classi applicate
    const root = document.documentElement
    root.classList.remove('high-contrast', 'low-light', 'light', 'dark')
    root.style.removeProperty('font-size')

    // Rileva di nuovo le preferenze del sistema
    detectSystemPreferences()
  }

  /**
   * Toggle per una preferenza booleana
   */
  const togglePreference = (
    key: 'reducedMotion' | 'highContrast' | 'lowLight' | 'soundEnabled',
  ) => {
    const newValue = !preferences.value[key]
    updatePreference(key, newValue)
  }

  /**
   * Annuncia cambiamenti per screen reader
   */
  const announceChange = (message: string) => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'polite')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message

    document.body.appendChild(announcement)

    // Rimuovi dopo l'annuncio
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }

  // Watch per salvare automaticamente le preferenze con debounce
  const debouncedSave = useDebounceFn(savePreferences, 1000)
  watch(preferences, debouncedSave, { deep: true })

  onMounted(() => {
    loadPreferences()
    detectSystemPreferences()

    // Applica le preferenze iniziali
    applyReducedMotion(preferences.value.reducedMotion)
    applyHighContrast(preferences.value.highContrast)
    applyLowLight(preferences.value.lowLight)
    applyFontSize(preferences.value.fontSize)

    if (preferences.value.colorScheme !== 'auto') {
      applyColorScheme(preferences.value.colorScheme)
    }

    isInitialized.value = true
  })

  return {
    // State
    preferences: readonly(preferences),
    isInitialized: readonly(isInitialized),

    // Methods
    updatePreference,
    togglePreference,
    resetPreferences,
    announceChange,

    // Computed helpers
    isReducedMotion: () => preferences.value.reducedMotion,
    isHighContrast: () => preferences.value.highContrast,
    isLowLight: () => preferences.value.lowLight,
    getFontSize: () => preferences.value.fontSize,
    getColorScheme: () => preferences.value.colorScheme,
    isSoundEnabled: () => preferences.value.soundEnabled,
  }
}
