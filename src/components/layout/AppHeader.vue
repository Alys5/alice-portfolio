<template>
  <!-- Skip link per accessibilità -->
  <a href="#main-content" class="skip-link" tabindex="0">{{ t('accessibility.skipToMain') }}</a>
  <!-- Header principale con landmark e aria -->
  <header
    class="app-header"
    :class="{ 'app-header--scrolled': isScrolled }"
    role="banner"
    :aria-label="$t('ui.navigation.main')"
  >
    <div class="header-container">
      <!-- Logo/Brand -->
      <router-link
        to="/"
        class="header-brand"
        :aria-label="`${$t('hero.title')} - ${$t('nav.home')}`"
      >
        <span class="brand-text">Alice Mandelli</span>
      </router-link>

      <!-- Navigation -->
      <NavBar />

      <!-- Header Actions -->
      <div class="header-actions">
        <!-- Language Selector -->
        <div class="language-selector">
          <button
            @click="toggleLanguageMenu"
            class="language-button"
            :aria-expanded="showLanguageMenu"
            :aria-label="t('ui.language.selector')"
            data-testid="lang-switcher"
          >
            <span class="current-locale">{{ currentLocaleLabel }}</span>
            <svg
              class="language-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </button>

          <Transition name="dropdown">
            <ul v-if="showLanguageMenu" class="language-menu" role="menu">
              <li v-for="lang in availableLanguages" :key="lang.code" class="language-item">
                <button
                  @click="changeLanguage(lang.code)"
                  class="language-option"
                  :class="{ 'language-option--active': lang.code === locale }"
                  role="menuitem"
                  :data-testid="`lang-${lang.code}`"
                >
                  {{ lang.label }}
                </button>
              </li>
            </ul>
          </Transition>
        </div>

        <!-- Theme Toggle -->
        <button
          @click="toggleTheme"
          class="theme-toggle"
          :aria-label="theme === 'light' ? t('ui.theme.light') : t('ui.theme.dark')"
        >
          <svg
            v-if="theme === 'light'"
            class="theme-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z"
            />
          </svg>
          <svg
            v-else
            class="theme-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <circle cx="12" cy="12" r="5" />
            <path
              d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42m12.72-12.72l1.42-1.42"
            />
          </svg>
        </button>

        <!-- Mobile Menu Toggle -->
        <button
          @click="toggleMobileMenu"
          class="mobile-menu-toggle"
          :aria-expanded="showMobileMenu"
          :aria-label="t('ui.navigation.mobile')"
        >
          <span class="hamburger-line" :class="{ 'hamburger-line--active': showMobileMenu }"></span>
          <span class="hamburger-line" :class="{ 'hamburger-line--active': showMobileMenu }"></span>
          <span class="hamburger-line" :class="{ 'hamburger-line--active': showMobileMenu }"></span>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition name="mobile-menu">
      <nav
        v-if="showMobileMenu"
        class="mobile-nav"
        role="navigation"
        :aria-label="t('ui.navigation.mobile')"
      >
        <ul class="mobile-nav-list">
          <li v-for="item in navItems" :key="item.path" class="mobile-nav-item">
            <router-link
              :to="item.path"
              class="mobile-nav-link"
              :class="{ 'mobile-nav-link--active': $route.path === item.path }"
              @click="closeMobileMenu"
            >
              {{ item.label }}
            </router-link>
          </li>
        </ul>
      </nav>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMainStore } from '@/stores/main'
import NavBar from './NavBar.vue'

// Composables
const { t } = useI18n()
const store = useMainStore()

// State
const isScrolled = ref(false)
const showLanguageMenu = ref(false)
const showMobileMenu = ref(false)

// Computed
const theme = computed(() => store.theme)
const locale = computed(() => store.locale)

const navItems = computed(() => [
  { path: '/', label: t('nav.home') },
  { path: '/about', label: t('nav.about') },
  { path: '/services', label: t('nav.services') },
  { path: '/portfolio', label: t('nav.portfolio') },
  { path: '/experience', label: t('nav.experience') },
  { path: '/contact', label: t('nav.contact') },
])

const availableLanguages = computed(() => [
  { code: 'it', label: t('ui.language.italian') },
  { code: 'en', label: t('ui.language.english') },
  { code: 'es', label: t('ui.language.spanish') },
])

const currentLocaleLabel = computed(() => {
  const lang = availableLanguages.value.find((l) => l.code === locale.value)
  return lang?.label || 'IT'
})

// Methods
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const toggleTheme = () => {
  store.toggleTheme()
}

const toggleLanguageMenu = () => {
  showLanguageMenu.value = !showLanguageMenu.value
}

const changeLanguage = (langCode: string) => {
  store.setLocale(langCode as 'it' | 'en' | 'es')
  showLanguageMenu.value = false
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

// Close language menu when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.language-selector')) {
    showLanguageMenu.value = false
  }
}

// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<!--
  Stili organizzati per:
  - .app-header: wrapper header
  - .logo: logo/link home
  - .header-actions: toggle tema e switcher lingua
  - Responsive e animazione icona tema
-->

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-header);
  background: var(--color-header-bg);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--color-border-subtle);
  transition: all var(--transition-duration-smooth) var(--easing-kinetic);

  &--scrolled {
    background: var(--color-header-bg-scrolled);
    box-shadow: var(--shadow-header);
  }
}

.header-container {
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-lg);
}

.header-brand {
  text-decoration: none;
  color: var(--color-text-primary);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-lg);
  transition: color var(--transition-duration-fast) var(--easing-out);

  &:hover {
    color: var(--color-primary);
  }
}

.header-nav {
  display: none;

  @media (min-width: 768px) {
    display: block;
  }
}

.nav-list {
  display: flex;
  gap: var(--spacing-lg);
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link {
  text-decoration: none;
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-duration-fast) var(--easing-out);
  position: relative;

  &:hover {
    color: var(--color-text-primary);
    background: var(--color-surface-hover);
  }

  &--active {
    color: var(--color-primary);
    background: var(--color-primary-bg);

    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 2px;
      background: var(--color-primary);
      border-radius: 1px;
    }
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.language-selector {
  position: relative;
}

.language-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-duration-fast) var(--easing-out);

  &:hover {
    background: var(--color-surface-hover);
    border-color: var(--color-primary);
  }
}

.language-icon {
  transition: transform var(--transition-duration-fast) var(--easing-out);
}

.language-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: var(--spacing-xs);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-dropdown);
  list-style: none;
  padding: var(--spacing-xs);
  min-width: 120px;
  z-index: var(--z-dropdown);
}

.language-option {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  background: none;
  border: none;
  text-align: left;
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  border-radius: var(--border-radius-sm);
  transition: all var(--transition-duration-fast) var(--easing-out);

  &:hover {
    background: var(--color-surface-hover);
  }

  &--active {
    background: var(--color-primary-bg);
    color: var(--color-primary);
    font-weight: var(--font-weight-medium);
  }
}

.theme-toggle {
  padding: var(--spacing-sm);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all var(--transition-duration-fast) var(--easing-out);

  &:hover {
    background: var(--color-surface-hover);
    border-color: var(--color-primary);
  }
}

.theme-icon {
  display: block;
}

.mobile-menu-toggle {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--spacing-sm);
  background: none;
  border: none;
  cursor: pointer;

  @media (min-width: 768px) {
    display: none;
  }
}

.hamburger-line {
  width: 20px;
  height: 2px;
  background: var(--color-text-primary);
  transition: all var(--transition-duration-fast) var(--easing-out);

  &--active {
    &:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }

    &:nth-child(2) {
      opacity: 0;
    }

    &:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -6px);
    }
  }
}

.mobile-nav {
  background: var(--color-surface);
  border-top: 1px solid var(--color-border-subtle);
  padding: var(--spacing-lg);

  @media (min-width: 768px) {
    display: none;
  }
}

.mobile-nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.mobile-nav-link {
  display: block;
  text-decoration: none;
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-duration-fast) var(--easing-out);

  &:hover {
    background: var(--color-surface-hover);
  }

  &--active {
    background: var(--color-primary-bg);
    color: var(--color-primary);
  }
}

// Transitions
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all var(--transition-duration-fast) var(--easing-out);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all var(--transition-duration-fast) var(--easing-out);
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

// High contrast mode
@media (prefers-contrast: high) {
  .app-header {
    border-bottom-width: 2px;
  }

  .nav-link--active::after {
    height: 3px;
  }
}

// Reduced motion
@media (prefers-reduced-motion: reduce) {
  .app-header,
  .nav-link,
  .language-button,
  .theme-toggle,
  .hamburger-line {
    transition: none;
  }

  .dropdown-enter-active,
  .dropdown-leave-active,
  .mobile-menu-enter-active,
  .mobile-menu-leave-active {
    transition: none;
  }
}
</style>
