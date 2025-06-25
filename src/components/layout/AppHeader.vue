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
      <!-- Switcher lingua IT/EN -->
      <div class="lang-switcher">
        <button
          v-for="lang in langs"
          :key="lang"
          :class="['lang-btn', { active: locale === lang }]"
          @click="changeLang(lang as 'it' | 'en')"
          :aria-label="lang === 'it' ? 'Cambia lingua: Italiano' : 'Change language: English'"
        >
          {{ lang.toUpperCase() }}
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

// Lingue supportate
const langs = ['it', 'en']
// Lingua attiva
const locale = computed(() => mainStore.locale)

/**
 * Cambia la lingua globale (store + i18n)
 * @param lang 'it' | 'en'
 */
function changeLang(lang: 'it' | 'en') {
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
.lang-switcher {
  display: flex;
  gap: 0.2em;
  margin-left: var(--space-sm);
}
.lang-btn {
  background: none;
  border: none;
  color: var(--color-text);
  font-weight: 600;
  font-size: 1rem;
  padding: 0.2em 0.7em;
  border-radius: 1em;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
}
.lang-btn.active {
  background: var(--color-accent-1);
  color: var(--color-white);
}
.lang-btn:hover:not(.active) {
  background: var(--color-light-gray);
}
</style>
