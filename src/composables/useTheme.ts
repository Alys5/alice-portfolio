import { ref, watch, onMounted, readonly } from 'vue'
import { useLocalStorage } from '@vueuse/core'

export type Theme = 'light' | 'dark' | 'auto'

export interface ThemeConfig {
  current: Theme
  system: 'light' | 'dark'
  isDark: boolean
  isTransitioning: boolean
}

/**
 * @component
 * @name useTheme
 * @desc Composable per gestire il cambio di tema con animazioni fluide e supporto per prefers-color-scheme
 * @example
 * const { currentTheme, isDark, toggleTheme } = useTheme()
 *
 * // Cambia tema
 * toggleTheme()
 *
 * // Imposta tema specifico
 * setTheme('dark')
 * @example
 * // Reattivo al tema
 * const themeIcon = computed(() =>
 *   isDark.value ? 'moon' : 'sun'
 * )
 */
export function useTheme() {
  // State
  const currentTheme = useLocalStorage<Theme>('alice-theme', 'auto')
  const systemTheme = ref<'light' | 'dark'>('light')
  const isTransitioning = ref(false)

  // Computed
  const isDark = ref(false)
  const themeConfig = ref<ThemeConfig>({
    current: currentTheme.value,
    system: systemTheme.value,
    isDark: isDark.value,
    isTransitioning: isTransitioning.value,
  })

  /**
   * Applica il tema al documento
   */
  const applyTheme = (theme: Theme) => {
    const root = document.documentElement
    const body = document.body

    // Determina se il tema è scuro
    let shouldBeDark = false

    if (theme === 'auto') {
      shouldBeDark = systemTheme.value === 'dark'
    } else {
      shouldBeDark = theme === 'dark'
    }

    // Aggiungi classe di transizione
    isTransitioning.value = true
    body.classList.add('theme-transitioning')

    // Applica il tema
    if (shouldBeDark) {
      root.setAttribute('data-theme', 'dark')
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.setAttribute('data-theme', 'light')
      root.classList.add('light')
      root.classList.remove('dark')
    }

    // Aggiorna lo stato
    isDark.value = shouldBeDark
    currentTheme.value = theme
    themeConfig.value = {
      current: theme,
      system: systemTheme.value,
      isDark: shouldBeDark,
      isTransitioning: isTransitioning.value,
    }

    // Rimuovi la classe di transizione dopo l'animazione
    setTimeout(() => {
      isTransitioning.value = false
      body.classList.remove('theme-transitioning')
    }, 300) // Durata della transizione CSS
  }

  /**
   * Cambia il tema
   */
  const toggleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'auto']
    const currentIndex = themes.indexOf(currentTheme.value)
    const nextIndex = (currentIndex + 1) % themes.length
    const nextTheme = themes[nextIndex]

    applyTheme(nextTheme)
  }

  /**
   * Imposta un tema specifico
   */
  const setTheme = (theme: Theme) => {
    applyTheme(theme)
  }

  /**
   * Rileva il tema del sistema
   */
  const detectSystemTheme = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    systemTheme.value = mediaQuery.matches ? 'dark' : 'light'

    // Se il tema è impostato su 'auto', riapplica
    if (currentTheme.value === 'auto') {
      applyTheme('auto')
    }
  }

  /**
   * Ottiene l'icona del tema corrente
   */
  const getThemeIcon = () => {
    switch (currentTheme.value) {
      case 'light':
        return 'sun'
      case 'dark':
        return 'moon'
      case 'auto':
        return systemTheme.value === 'dark' ? 'moon' : 'sun'
      default:
        return 'sun'
    }
  }

  /**
   * Ottiene il testo del tema corrente
   */
  const getThemeText = () => {
    switch (currentTheme.value) {
      case 'light':
        return 'Tema chiaro'
      case 'dark':
        return 'Tema scuro'
      case 'auto':
        return `Automatico (${systemTheme.value === 'dark' ? 'Scuro' : 'Chiaro'})`
      default:
        return 'Tema'
    }
  }

  /**
   * Ottiene l'aria-label per l'accessibilità
   */
  const getThemeAriaLabel = () => {
    const icon = getThemeIcon()
    const text = getThemeText()

    return `${text}. Clicca per cambiare tema.`
  }

  // Lifecycle
  onMounted(() => {
    // Rileva il tema del sistema
    detectSystemTheme()

    // Applica il tema iniziale
    applyTheme(currentTheme.value)

    // Ascolta i cambiamenti del tema del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', detectSystemTheme)

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', detectSystemTheme)
    }
  })

  // Watchers
  watch(currentTheme, (newTheme) => {
    applyTheme(newTheme)
  })

  return {
    // State
    currentTheme: readonly(currentTheme),
    systemTheme: readonly(systemTheme),
    isDark: readonly(isDark),
    isTransitioning: readonly(isTransitioning),
    themeConfig: readonly(themeConfig),

    // Methods
    toggleTheme,
    setTheme,
    getThemeIcon,
    getThemeText,
    getThemeAriaLabel,
  }
}
