<template>
  <!-- Skip link accessibile -->
  <div class="skip-links">
    <a href="#main-content" class="skip-link">{{ $t('accessibility.skipToMain') }}</a>
  </div>
  <nav
    class="navbar"
    :aria-label="$t('ui.navigation.main')"
    :class="{ 'navbar--scrolled': isScrolled }"
  >
    <div class="navbar__container">
      <!-- Logo/Brand -->
      <router-link
        to="/"
        class="navbar__brand"
        :aria-label="`${$t('hero.title')} - ${$t('nav.home')}`"
      >
        Alice Mandelli
      </router-link>

      <!-- Desktop menu -->
      <ul class="navbar__links" v-if="!isMobile">
        <li v-for="item in navItems" :key="item.path">
          <router-link
            :to="item.path"
            class="navbar__link"
            :aria-current="$route.path === item.path ? 'page' : undefined"
          >
            {{ item.label }}
          </router-link>
        </li>
      </ul>

      <!-- Theme Toggle e Mobile Controls -->
      <div class="navbar__controls">
        <!-- Theme Toggle -->
        <ThemeToggle class="navbar__theme-toggle" />

        <!-- Hamburger button (mobile) -->
        <button
          class="navbar__hamburger"
          :aria-expanded="mobileOpen"
          :aria-label="$t('ui.navigation.mobile')"
          @click="toggleMobileMenu"
          v-if="isMobile"
          :tabindex="0"
        >
          <span class="hamburger-line" :class="{ active: mobileOpen }"></span>
          <span class="hamburger-line" :class="{ active: mobileOpen }"></span>
          <span class="hamburger-line" :class="{ active: mobileOpen }"></span>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <transition name="navbar-mobile-fade">
      <div
        v-if="mobileOpen"
        class="navbar__mobile-menu"
        ref="mobileMenuRef"
        tabindex="-1"
        role="dialog"
        aria-modal="true"
        :aria-label="$t('ui.navigation.mobile')"
      >
        <ul class="navbar__mobile-links">
          <li v-for="item in navItems" :key="item.path">
            <router-link
              :to="item.path"
              class="navbar__mobile-link"
              @click="closeMobileMenu"
              :aria-current="$route.path === item.path ? 'page' : undefined"
            >
              {{ item.label }}
            </router-link>
          </li>
        </ul>
        <button
          class="navbar__close"
          @click="closeMobileMenu"
          :aria-label="$t('ui.navigation.close')"
        >
          &times;
        </button>
      </div>
    </transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useFocusTrap } from '@/composables/useFocusTrap'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'

const { t } = useI18n()

// Responsive breakpoint
const MOBILE_BREAKPOINT = 900
const isMobile = ref(window.innerWidth < MOBILE_BREAKPOINT)
const updateIsMobile = () => {
  isMobile.value = window.innerWidth < MOBILE_BREAKPOINT
}

onMounted(() => {
  window.addEventListener('resize', updateIsMobile)
})
onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile)
})

// Sticky on scroll
const isScrolled = ref(false)
const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Navigation items localizzati
const navItems = computed(() => [
  { path: '/', label: t('nav.home') },
  { path: '/blog', label: t('nav.blog') },
  { path: '/blog-editor', label: t('nav.blogEditor') },
  { path: '/portfolio', label: t('nav.portfolio') },
  { path: '/about', label: t('nav.about') },
  { path: '/services', label: t('nav.services') },
  { path: '/contact', label: t('nav.contact') },
])

// Mobile menu state & focus trap
const mobileOpen = ref(false)
const mobileMenuRef = ref<HTMLElement | null>(null)
const {
  /* enable, disable, */
} = useFocusTrap(mobileMenuRef, mobileOpen)

function toggleMobileMenu() {
  mobileOpen.value = !mobileOpen.value
}
function closeMobileMenu() {
  mobileOpen.value = false
}

// Chiudi menu su ESC o click fuori
function onKeydown(e: KeyboardEvent) {
  if (mobileOpen.value && e.key === 'Escape') closeMobileMenu()
}
function onClickOutside(e: MouseEvent) {
  if (mobileOpen.value && mobileMenuRef.value && !mobileMenuRef.value.contains(e.target as Node)) {
    closeMobileMenu()
  }
}
onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('mousedown', onClickOutside)
})
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('mousedown', onClickOutside)
})
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: var(--color-bg-primary);
  box-shadow: var(--shadow-sm);
  border-bottom: 1px solid var(--color-border-primary);
  transition: box-shadow 0.2s var(--ease-out-expo);
}
.navbar--scrolled {
  box-shadow: var(--shadow-md);
}
.navbar__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-2) var(--space-6);
}
.navbar__brand {
  font-weight: 700;
  font-size: 1.3rem;
  color: var(--color-text-primary);
  text-decoration: none;
  letter-spacing: 0.02em;
}
.navbar__links {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}
.navbar__link {
  color: var(--color-text-secondary);
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  position: relative;
  transition: color 0.2s var(--ease-out-expo);
}
.navbar__link:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
  border-radius: var(--radius-sm, 4px);
}
.navbar__link[aria-current='page'] {
  color: var(--color-text-primary);
  font-weight: 700;
}
/* Hamburger */
.navbar__hamburger {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  z-index: 1100;
}
.hamburger-line {
  width: 28px;
  height: 3px;
  background: var(--color-text-primary);
  border-radius: 2px;
  transition: all 0.3s var(--ease-out-expo);
}
.hamburger-line.active:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}
.hamburger-line.active:nth-child(2) {
  opacity: 0;
}
.hamburger-line.active:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}
/* Mobile menu */
.navbar__mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: var(--color-bg-primary);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1200;
  animation: navbar-mobile-fade-in 0.2s var(--ease-out-expo);
}
@keyframes navbar-mobile-fade-in {
  from {
    opacity: 0;
    transform: translateY(-16px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
.navbar__mobile-links {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--space-8) 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
}
.navbar__mobile-link {
  color: var(--color-text-secondary);
  font-size: 1.3rem;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s var(--ease-out-expo);
}
.navbar__mobile-link:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
  border-radius: var(--radius-sm, 4px);
}
.navbar__mobile-link[aria-current='page'] {
  color: var(--color-text-primary);
}
.navbar__close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: none;
  border: none;
  font-size: 2.5rem;
  color: var(--color-text-primary);
  cursor: pointer;
  line-height: 1;
}
.navbar__close:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
  border-radius: var(--radius-sm, 4px);
}
/* Responsive */
@media (max-width: 899px) {
  .navbar__links {
    display: none;
  }
  .navbar__hamburger {
    display: flex;
  }
  .navbar__controls {
    gap: 0.5rem;
  }
}
@media (min-width: 900px) {
  .navbar__hamburger {
    display: none;
  }
  .navbar__links {
    display: flex;
  }
  .navbar__controls {
    gap: 1rem;
  }
}
/* Skip link */
.skip-links {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2000;
}
.skip-link {
  position: absolute;
  left: -999px;
  top: 0;
  background: var(--color-bg-primary);
  color: var(--color-focus);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-sm);
  font-weight: 600;
  transition: left 0.2s var(--ease-out-expo);
  border: 1px solid var(--color-border-primary);
}
.skip-link:focus {
  left: 8px;
}

/* Controls container */
.navbar__controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Theme Toggle */
.navbar__theme-toggle {
  flex-shrink: 0;
}
</style>
