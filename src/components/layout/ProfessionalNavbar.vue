<template>
  <nav
    class="professional-navbar"
    :class="{ 'navbar--scrolled': isScrolled, 'navbar--mobile-open': isMobileOpen }"
    role="navigation"
    aria-label="Main navigation"
  >
    <div class="navbar-container">
      <!-- Logo/Brand -->
      <div class="navbar-brand">
        <router-link
          to="/"
          class="brand-link"
          :aria-label="t('navigation.logo')"
        >
          <div class="brand-logo">
            <span class="logo-text">AM</span>
          </div>
          <span class="brand-name">{{ t('navigation.logo') }}</span>
        </router-link>
      </div>

      <!-- Desktop Navigation -->
      <div class="navbar-menu desktop-menu" role="menubar">
        <router-link
          v-for="item in navigationItems"
          :key="item.path"
          :to="item.path"
          class="nav-link"
          :class="{ 'nav-link--active': currentRoute === item.path }"
          role="menuitem"
          :aria-current="currentRoute === item.path ? 'page' : undefined"
        >
          <span class="nav-text">{{ item.label }}</span>
          <span class="nav-indicator"></span>
        </router-link>
      </div>

      <!-- Action Buttons -->
      <div class="navbar-actions">
        <!-- Theme Toggle -->
        <button
          class="action-button theme-toggle"
          @click="toggleTheme"
          :aria-label="isDark ? t('common.theme.activateLightMode') : t('common.theme.activateDarkMode')"
          type="button"
        >
          <span class="icon" :class="{ 'icon--sun': !isDark, 'icon--moon': isDark }">
            {{ isDark ? '☀️' : '🌙' }}
          </span>
        </button>

        <!-- Language Selector -->
        <div class="language-selector">
          <button
            class="action-button language-toggle"
            @click="toggleLanguageMenu"
            :aria-expanded="isLanguageMenuOpen"
            :aria-label="t('common.language.current')"
            type="button"
          >
            <span class="current-lang">{{ currentLanguage.toUpperCase() }}</span>
            <span class="dropdown-arrow" :class="{ 'arrow--open': isLanguageMenuOpen }">▼</span>
          </button>

          <Transition name="dropdown">
            <div
              v-if="isLanguageMenuOpen"
              class="language-dropdown"
              role="menu"
            >
              <button
                v-for="lang in availableLanguages"
                :key="lang.code"
                class="language-option"
                :class="{ 'language-option--active': currentLanguage === lang.code }"
                @click="changeLanguage(lang.code)"
                role="menuitem"
                type="button"
              >
                {{ lang.name }}
              </button>
            </div>
          </Transition>
        </div>

        <!-- Mobile Menu Toggle -->
        <button
          class="action-button mobile-toggle"
          @click="toggleMobileMenu"
          :aria-expanded="isMobileOpen"
          :aria-label="isMobileOpen ? t('common.navigation.closeMenu') : t('common.navigation.openMenu')"
          type="button"
        >
          <span class="hamburger" :class="{ 'hamburger--open': isMobileOpen }">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          </span>
        </button>
      </div>
    </div>

    <!-- Mobile Navigation Overlay -->
    <Transition name="mobile-overlay">
      <div
        v-if="isMobileOpen"
        class="mobile-overlay"
        @click="closeMobileMenu"
        role="presentation"
      >
        <div class="mobile-menu" @click.stop>
          <div class="mobile-menu-header">
            <h3 class="mobile-menu-title">{{ t('common.navigation.mainNavigation') }}</h3>
            <button
              class="mobile-close-button"
              @click="closeMobileMenu"
              :aria-label="t('common.navigation.closeMenu')"
              type="button"
            >
              <span class="close-icon">×</span>
            </button>
          </div>

          <div class="mobile-menu-content">
            <router-link
              v-for="item in navigationItems"
              :key="item.path"
              :to="item.path"
              class="mobile-nav-link"
              :class="{ 'mobile-nav-link--active': currentRoute === item.path }"
              @click="closeMobileMenu"
            >
              <span class="mobile-nav-text">{{ item.label }}</span>
              <span class="mobile-nav-arrow">→</span>
            </router-link>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTheme } from '@/composables/useTheme'

// Composables
const { t, locale } = useI18n()
const { isDark, toggleTheme } = useTheme()
const route = useRoute()

// Reactive state
const isScrolled = ref(false)
const isMobileOpen = ref(false)
const isLanguageMenuOpen = ref(false)

// Navigation items
const navigationItems = [
  { path: '/', label: t('navigation.home') },
  { path: '/about', label: t('navigation.about') },
  { path: '/services', label: t('navigation.services') },
  { path: '/portfolio', label: t('navigation.portfolio') },
  { path: '/experience', label: t('navigation.experience') },
  { path: '/contact', label: t('navigation.contact') }
]

// Language options
const availableLanguages = [
  { code: 'it', name: 'Italiano' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' }
]

// Computed properties
const currentRoute = computed(() => route.path)
const currentLanguage = computed(() => locale.value)

// Methods
const toggleMobileMenu = () => {
  isMobileOpen.value = !isMobileOpen.value
  if (isMobileOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMobileMenu = () => {
  isMobileOpen.value = false
  document.body.style.overflow = ''
}

const toggleLanguageMenu = () => {
  isLanguageMenuOpen.value = !isLanguageMenuOpen.value
}

const changeLanguage = (langCode: string) => {
  locale.value = langCode
  isLanguageMenuOpen.value = false
}

// Scroll handling
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

// Click outside language menu
const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  if (!target.closest('.language-selector')) {
    isLanguageMenuOpen.value = false
  }
}

// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
  document.body.style.overflow = ''
})

// Watch for route changes to close mobile menu
watch(() => route.path, () => {
  if (isMobileOpen.value) {
    closeMobileMenu()
  }
})
</script>

<style lang="scss" scoped>
.professional-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: var(--glass-ultra-light);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--glass-light);
  transition: all var(--duration-normal) var(--easing-standard);

  &.navbar--scrolled {
    background: var(--glass-medium);
    box-shadow: var(--shadow-lg);
  }
}

.navbar-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--space-4) var(--space-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
}

.navbar-brand {
  .brand-link {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    text-decoration: none;
    color: var(--bright-sun);
    font-weight: 700;
    font-size: var(--font-size-lg);

    &:hover {
      color: var(--emerald);
    }
  }

  .brand-logo {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, var(--bright-sun), var(--emerald));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow-glow);

    .logo-text {
      font-size: 1.2rem;
      font-weight: 800;
      color: var(--charcoal);
    }
  }

  .brand-name {
    @media (max-width: 768px) {
      display: none;
    }
  }
}

.desktop-menu {
  display: flex;
  align-items: center;
  gap: var(--space-8);

  @media (max-width: 1024px) {
    display: none;
  }
}

.nav-link {
  position: relative;
  color: var(--slate-gray);
  text-decoration: none;
  font-weight: 500;
  font-size: var(--font-size-sm);
  padding: var(--space-2) var(--space-3);
  border-radius: 0.5rem;
  transition: all var(--duration-normal) var(--easing-standard);

  &:hover {
    color: var(--bright-sun);
    background: var(--glass-light);
  }

  &.nav-link--active {
    color: var(--bright-sun);
    background: var(--glass-medium);

    .nav-indicator {
      opacity: 1;
      transform: scaleX(1);
    }
  }

  .nav-indicator {
    position: absolute;
    bottom: -2px;
    left: 50%;
    width: 20px;
    height: 2px;
    background: var(--bright-sun);
    border-radius: 1px;
    transform: translateX(-50%) scaleX(0);
    opacity: 0;
    transition: all var(--duration-normal) var(--easing-standard);
  }
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.action-button {
  background: var(--glass-light);
  border: 1px solid var(--glass-medium);
  border-radius: 0.5rem;
  padding: var(--space-2) var(--space-3);
  color: var(--bright-sun);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--duration-normal) var(--easing-standard);

  &:hover {
    background: var(--glass-medium);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  &:focus-visible {
    outline: 2px solid var(--bright-sun);
    outline-offset: 2px;
  }
}

.theme-toggle {
  .icon {
    font-size: 1.1rem;
    transition: transform var(--duration-normal) var(--easing-standard);
  }

  &:hover .icon {
    transform: rotate(180deg);
  }
}

.language-selector {
  position: relative;
}

.language-toggle {
  display: flex;
  align-items: center;
  gap: var(--space-1);

  .current-lang {
    font-weight: 600;
  }

  .dropdown-arrow {
    font-size: 0.8rem;
    transition: transform var(--duration-normal) var(--easing-standard);

    &.arrow--open {
      transform: rotate(180deg);
    }
  }
}

.language-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: var(--space-2);
  background: var(--glass-medium);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-light);
  border-radius: 0.5rem;
  padding: var(--space-2);
  box-shadow: var(--shadow-lg);
  min-width: 120px;
  z-index: 1001;
}

.language-option {
  display: block;
  width: 100%;
  padding: var(--space-2) var(--space-3);
  background: none;
  border: none;
  color: var(--slate-gray);
  font-size: var(--font-size-sm);
  text-align: left;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: all var(--duration-fast) var(--easing-standard);

  &:hover {
    background: var(--glass-light);
    color: var(--bright-sun);
  }

  &.language-option--active {
    background: var(--bright-sun);
    color: var(--charcoal);
    font-weight: 600;
  }
}

.mobile-toggle {
  display: none;

  @media (max-width: 1024px) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    padding: 0;
  }
}

.hamburger {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 20px;
  height: 16px;

  .hamburger-line {
    width: 100%;
    height: 2px;
    background: var(--bright-sun);
    border-radius: 1px;
    transition: all var(--duration-normal) var(--easing-standard);
  }

  &.hamburger--open {
    .hamburger-line {
      &:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
      }

      &:nth-child(2) {
        opacity: 0;
      }

      &:nth-child(3) {
        transform: rotate(-45deg) translate(5px, -5px);
      }
    }
  }
}

.mobile-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  z-index: 999;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;

  @media (min-width: 1025px) {
    display: none;
  }
}

.mobile-menu {
  width: 100%;
  max-width: 320px;
  height: 100vh;
  background: var(--glass-heavy);
  backdrop-filter: blur(30px);
  border-left: 1px solid var(--glass-medium);
  padding: var(--space-6);
  overflow-y: auto;
}

.mobile-menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-8);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--glass-light);

  .mobile-menu-title {
    color: var(--bright-sun);
    font-size: var(--font-size-lg);
    font-weight: 600;
  }

  .mobile-close-button {
    background: none;
    border: none;
    color: var(--bright-sun);
    font-size: 1.5rem;
    cursor: pointer;
    padding: var(--space-1);
    border-radius: 0.25rem;
    transition: all var(--duration-fast) var(--easing-standard);

    &:hover {
      background: var(--glass-light);
    }
  }
}

.mobile-menu-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-3);
  color: var(--slate-gray);
  text-decoration: none;
  border-radius: 0.5rem;
  transition: all var(--duration-normal) var(--easing-standard);

  &:hover {
    background: var(--glass-light);
    color: var(--bright-sun);
  }

  &.mobile-nav-link--active {
    background: var(--bright-sun);
    color: var(--charcoal);
    font-weight: 600;
  }

  .mobile-nav-text {
    font-size: var(--font-size-base);
    font-weight: 500;
  }

  .mobile-nav-arrow {
    font-size: 1.2rem;
    opacity: 0.7;
  }
}

// Transitions
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all var(--duration-normal) var(--easing-standard);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.mobile-overlay-enter-active,
.mobile-overlay-leave-active {
  transition: all var(--duration-normal) var(--easing-standard);
}

.mobile-overlay-enter-from,
.mobile-overlay-leave-to {
  opacity: 0;
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .professional-navbar,
  .nav-link,
  .action-button,
  .hamburger,
  .mobile-nav-link {
    transition: none;
  }

  .hamburger-line {
    transition: none;
  }

  .icon {
    transition: none;
  }
}

// High contrast mode
@media (prefers-contrast: high) {
  .professional-navbar {
    border-bottom-width: 2px;
  }

  .action-button {
    border-width: 2px;
  }

  .nav-link--active {
    border: 2px solid var(--bright-sun);
  }
}
</style>
