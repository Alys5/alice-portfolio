import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'

// Mappa dei ruoli localizzati per lingua
const rolesByLocale = {
  it: [
    'AI Specialist',
    'UI Designer',
    'UI Developer',
    'Design Thinking',
    'Digitalizzazione',
    'Frontend Developer',
    'Gatti',
  ],
  en: [
    'AI Specialist',
    'UI Designer',
    'UI Developer',
    'Design Thinking',
    'Digitalization',
    'Frontend Developer',
    'Cats',
  ],
}

/**
 * Store principale globale (tema, lingua, ruoli)
 * - Gestisce dark/light mode e persistenza
 * - Gestisce lingua attiva e ruoli localizzati
 */
export const useMainStore = defineStore('main', () => {
  // Stato tema: 'light' o 'dark', persistito in localStorage
  const theme = ref<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
  )

  // Stato lingua: 'it' o 'en', persistito in localStorage
  const locale = ref<'it' | 'en'>((localStorage.getItem('locale') as 'it' | 'en') || 'it')
  // Ruoli localizzati in base alla lingua
  const roles = computed(() => rolesByLocale[locale.value])

  /**
   * Cambia il tema (dark/light) e aggiorna localStorage e DOM
   */
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', theme.value)
    document.documentElement.classList.toggle('dark', theme.value === 'dark')
  }

  /**
   * Cambia la lingua attiva e aggiorna localStorage
   * @param newLocale 'it' | 'en'
   */
  function setLocale(newLocale: 'it' | 'en') {
    locale.value = newLocale
    localStorage.setItem('locale', newLocale)
  }

  // Sync tema su caricamento
  if (theme.value === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }

  // Watch per cambiamenti di tema (persistenza e DOM)
  watch(theme, (val) => {
    document.documentElement.classList.toggle('dark', val === 'dark')
    localStorage.setItem('theme', val)
  })

  return { theme, toggleTheme, locale, setLocale, roles }
})
