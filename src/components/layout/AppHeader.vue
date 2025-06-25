<template>
  <!-- Header principale con logo, navigation e azioni (tema, lingua) -->
  <header class="app-header">
    <div class="logo">
      <RouterLink to="/">AM</RouterLink>
    </div>
    <Navigation />
    <div class="header-actions">
      <!-- Toggle dark/light mode -->
      <button
        class="theme-toggle"
        @click="toggleTheme"
        :aria-label="isDark ? 'Attiva light mode' : 'Attiva dark mode'"
      >
        <span :class="['theme-icon', { rotate: isDark }]">
          <!-- Icona sole/luna animata -->
          <svg v-if="isDark" width="24" height="24" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="5" fill="#ffc940" />
            <path
              d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
              stroke="#ffc940"
              stroke-width="2"
            />
          </svg>
          <svg v-else width="24" height="24" viewBox="0 0 24 24">
            <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" fill="#29353f" />
          </svg>
        </span>
      </button>
      <!-- Switcher lingua con bandierine -->
      <div class="lang-switcher-flags" role="group" aria-label="Selettore lingua">
        <button
          v-for="lang in languages"
          :key="lang.code"
          :class="['lang-flag', { active: locale === lang.code }]"
          @click="changeLang(lang.code as Locale)"
          :aria-label="lang.aria"
        >
          <span class="flag-icon">{{ lang.flag }}</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// Importa RouterLink per navigazione SPA
import { RouterLink } from 'vue-router'
// Importa Navigation (menu responsive)
import Navigation from './Navigation.vue'
// Importa store globale per tema e lingua
import { useMainStore } from '@/stores/main'
// Importa i18n per gestione lingua
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import type { Locale } from '@/stores/main'

// Store globale per tema e lingua
const mainStore = useMainStore()
// Accesso alla lingua attiva di vue-i18n
const { locale: i18nLocale } = useI18n()
// Computed per stato dark mode
const isDark = computed(() => mainStore.theme === 'dark')
// Funzione per toggle dark/light mode
/**
 * Attiva/disattiva la dark mode
 */
const toggleTheme = () => mainStore.toggleTheme()

// Lingue supportate (scalabile: aggiungi qui nuove lingue)
const languages = [
  { code: 'it', label: 'IT', flag: '🇮🇹', aria: 'Cambia lingua: Italiano' },
  { code: 'en', label: 'EN', flag: '🇬🇧', aria: 'Change language: English' },
  { code: 'es', label: 'ES', flag: '🇪🇸', aria: 'Cambiar idioma: Español' },
]
// Lingua attiva
const locale = computed(() => mainStore.locale)

/**
 * Cambia la lingua globale (store + i18n)
 * @param lang 'it' | 'en' | 'es'
 */
function changeLang(lang: Locale) {
  mainStore.setLocale(lang)
  i18nLocale.value = lang
}
</script>

<!--
  Stili organizzati per:
  - .app-header: wrapper header
  - .logo: logo/link home
  - .header-actions: toggle tema e switcher lingua
  - Responsive e animazione icona tema
-->

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md) var(--space-lg);
  background: var(--color-white);
  color: var(--color-text);
  box-shadow: var(--shadow-soft);
}
.logo a {
  font-family: var(--font-primary);
  font-weight: 700;
  font-size: 1.5rem;
  color: var(--color-text);
  text-decoration: none;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}
.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  margin-left: var(--space-md);
  transition: transform 0.3s;
}
.theme-icon {
  display: flex;
  align-items: center;
  transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}
.theme-icon.rotate {
  transform: rotate(180deg) scale(1.1);
}
.lang-switcher-flags {
  display: flex;
  gap: 0.3em;
  margin-left: var(--space-sm);
}
.lang-flag {
  background: var(--color-white);
  border: none;
  border-radius: 50%;
  width: 2.2em;
  height: 2.2em;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25em;
  box-shadow: var(--shadow-soft);
  margin: 0 0.1em;
  cursor: pointer;
  transition:
    box-shadow 0.25s cubic-bezier(0.68, -0.55, 0.27, 1.55),
    transform 0.18s cubic-bezier(0.68, -0.55, 0.27, 1.55),
    background 0.18s;
  outline: none;
  position: relative;
}
.lang-flag.active {
  background: var(--color-accent-1);
  color: var(--color-white);
  box-shadow:
    0 4px 24px 0 rgba(32, 72, 180, 0.18),
    var(--shadow-medium);
  transform: scale(1.13) rotate(-8deg);
  z-index: 2;
}
.lang-flag:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
.lang-flag:hover:not(.active) {
  background: var(--color-light-gray);
  transform: scale(1.07);
  box-shadow: var(--shadow-medium);
}
.flag-icon {
  display: block;
  font-size: 1.2em;
  filter: drop-shadow(0 1px 2px rgba(41, 53, 63, 0.08));
  transition: filter 0.2s;
}
</style>
