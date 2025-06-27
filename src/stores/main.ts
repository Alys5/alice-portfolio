import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

// Tipi per le lingue supportate
export type Locale = 'it' | 'en' | 'es'

// Ruoli per lingua (semplificati per il portfolio)
const rolesByLocale: Record<Locale, string[]> = {
  it: [
    'UI Developer',
    'AI Strategist',
    'UX Designer',
    'Frontend Developer',
    'Design Systems Specialist',
  ],
  en: [
    'UI Developer',
    'AI Strategist',
    'UX Designer',
    'Frontend Developer',
    'Design Systems Specialist',
  ],
  es: [
    'UI Developer',
    'AI Strategist',
    'UX Designer',
    'Frontend Developer',
    'Design Systems Specialist',
  ],
}

/**
 * Store principale globale (tema, lingua, ruoli)
 * - Gestisce dark/light mode e persistenza
 * - Gestisce lingua attiva e ruoli localizzati
 */
export const useMainStore = defineStore('main', () => {
  // State
  const theme = ref<'light' | 'dark'>('light')
  const locale = ref<Locale>('it')
  const isLoading = ref(false)

  // Composables
  const { locale: i18nLocale } = useI18n()

  // Computed
  const roles = computed(() => rolesByLocale[locale.value])

  // Actions
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme.value)
    // Save to localStorage
    localStorage.setItem('theme', theme.value)
  }

  const setLocale = (newLocale: Locale) => {
    locale.value = newLocale
    i18nLocale.value = newLocale
    // Save to localStorage
    localStorage.setItem('locale', newLocale)
    // Update document lang attribute
    document.documentElement.setAttribute('lang', newLocale)
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  // Initialize from localStorage
  const initializeStore = () => {
    // Load theme
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark'
    if (savedTheme) {
      theme.value = savedTheme
      document.documentElement.setAttribute('data-theme', savedTheme)
    }

    // Load locale
    const savedLocale = localStorage.getItem('locale') as Locale
    if (savedLocale && ['it', 'en', 'es'].includes(savedLocale)) {
      locale.value = savedLocale
      i18nLocale.value = savedLocale
      document.documentElement.setAttribute('lang', savedLocale)
    }
  }

  // Initialize on store creation
  initializeStore()

  return {
    // State
    theme,
    locale,
    isLoading,

    // Computed
    roles,

    // Actions
    toggleTheme,
    setLocale,
    setLoading,
    initializeStore,
  }
})
