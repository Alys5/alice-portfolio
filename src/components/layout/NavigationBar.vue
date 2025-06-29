<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { useRoute } from 'vue-router'
import { useTranslation } from '@/composables/useI18n'

// i18n
const { navigation, common, accessibility } = useTranslation()

const links = [
  { label: navigation.home(), to: '#home' },
  { label: navigation.portfolio(), to: '#portfolio' },
  { label: navigation.about(), to: '#about' },
  { label: navigation.contact(), to: '#contact' },
]

const isMobile = ref(false)
const menuOpen = ref(false)
const navRef = ref<HTMLElement | null>(null)
const drawerRef = ref<HTMLElement | null>(null)
const hamburgerRef = ref<HTMLElement | null>(null)
const focusTrapEls = ref<HTMLElement[]>([])

const { isDark, toggleTheme } = useTheme()
const route = useRoute()

function updateIsMobile() {
  isMobile.value = window.innerWidth < 1024
}

function handleResize() {
  updateIsMobile()
  if (!isMobile.value) menuOpen.value = false
}

function openMenu() {
  menuOpen.value = true
  nextTick(() => {
    trapFocus()
    if (drawerRef.value) drawerRef.value.focus()
  })
}
function closeMenu() {
  menuOpen.value = false
}

function trapFocus() {
  if (!drawerRef.value) return
  focusTrapEls.value = Array.from(drawerRef.value.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')) as HTMLElement[]
  if (focusTrapEls.value.length) focusTrapEls.value[0].focus()
}
function onDrawerKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeMenu()
  if (e.key === 'Tab' && focusTrapEls.value.length) {
    const idx = focusTrapEls.value.indexOf(document.activeElement as HTMLElement)
    if (e.shiftKey && idx === 0) {
      e.preventDefault()
      focusTrapEls.value[focusTrapEls.value.length - 1].focus()
    } else if (!e.shiftKey && idx === focusTrapEls.value.length - 1) {
      e.preventDefault()
      focusTrapEls.value[0].focus()
    }
  }
}

function scrollToSection(to: string) {
  const el = document.querySelector(to)
  if (el) {
    const navHeight = isMobile.value ? 60 : 80
    const y = el.getBoundingClientRect().top + window.scrollY - navHeight
    window.scrollTo({ top: y, behavior: 'smooth' })
    closeMenu()
  }
}

onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <nav
    class="nav-bar"
    ref="navRef"
    :aria-label="accessibility.mainNavigation()"
    :class="{ 'dark': isDark }"
  >
    <div class="nav-inner">
      <div class="nav-logo" tabindex="0" :aria-label="accessibility.logoLabel()">
        <span class="logo-text">{{ navigation.logo() }}</span>
      </div>
      <ul v-if="!isMobile" class="nav-links" role="menubar">
        <li v-for="link in links" :key="link.to" role="none">
          <a
            :href="link.to"
            class="nav-link"
            :class="{ active: route.hash === link.to }"
            @click.prevent="scrollToSection(link.to)"
            role="menuitem"
            tabindex="0"
            >{{ link.label }}
            <span class="nav-underline" />
          </a>
        </li>
      </ul>
      <button
        class="theme-toggle"
        :aria-label="isDark ? common.theme.lightMode() : common.theme.darkMode()"
        @click="toggleTheme"
      >
        <span class="icon-moon" :class="{ rotate: isDark }" aria-hidden="true" />
        <span class="icon-sun" :class="{ rotate: !isDark }" aria-hidden="true" />
      </button>
      <button
        v-if="isMobile"
        class="hamburger"
        :aria-label="menuOpen ? accessibility.closeMenu() : accessibility.openMenu()"
        :aria-expanded="menuOpen"
        :aria-controls="'nav-drawer'"
        @click="menuOpen ? closeMenu() : openMenu()"
        ref="hamburgerRef"
      >
        <span :class="{ 'bar': true, 'open': menuOpen }" />
        <span :class="{ 'bar': true, 'open': menuOpen }" />
        <span :class="{ 'bar': true, 'open': menuOpen }" />
      </button>
    </div>
    <transition name="drawer-slide">
      <aside
        v-if="isMobile && menuOpen"
        class="nav-drawer"
        id="nav-drawer"
        ref="drawerRef"
        tabindex="-1"
        role="dialog"
        aria-modal="true"
        @keydown="onDrawerKeydown"
      >
        <ul class="drawer-links" role="menu">
          <li v-for="link in links" :key="link.to" role="none">
            <a
              :href="link.to"
              class="drawer-link"
              :class="{ active: route.hash === link.to }"
              @click.prevent="scrollToSection(link.to)"
              role="menuitem"
              tabindex="0"
              >{{ link.label }}
              <span class="nav-underline" />
            </a>
          </li>
        </ul>
      </aside>
    </transition>
  </nav>
</template>

<style scoped lang="scss">
.nav-bar {
  position: sticky;
  top: 0;
  left: 0;
  width: 100vw;
  height: 80px;
  z-index: 100;
  background: rgba(41, 53, 63, 0.9);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 4px 30px rgba(0,0,0,0.1);
  transition: background 0.3s, box-shadow 0.3s;
  &.dark {
    background: rgba(41, 53, 63, 0.98);
    box-shadow: 0 4px 30px rgba(32,72,180,0.12);
  }
}
.nav-inner {
  max-width: 1440px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
}
.nav-logo {
  font-size: 1.7rem;
  font-weight: 800;
  color: var(--bright-sun);
  letter-spacing: -0.01em;
  text-shadow: 0 0 10px var(--bright-sun);
  cursor: pointer;
  outline: none;
  display: flex;
  align-items: center;
}
.logo-text {
  font-family: inherit;
  font-weight: 800;
  color: var(--bright-sun);
  letter-spacing: -0.01em;
}
.nav-links {
  display: flex;
  gap: 2.2rem;
  list-style: none;
  align-items: center;
  margin: 0;
  padding: 0;
}
.nav-link {
  color: var(--picton-blue);
  font-size: 1.1rem;
  font-weight: 700;
  text-decoration: none;
  position: relative;
  padding: 0.2rem 0.5rem;
  transition: color 0.2s;
  outline: none;
  &:hover, &:focus-visible {
    color: var(--bright-sun);
    .nav-underline {
      width: 100%;
      background: var(--bright-sun);
      box-shadow: 0 0 8px 2px var(--bright-sun);
    }
  }
  &.active {
    color: var(--bright-sun);
    text-shadow: 0 0 8px var(--bright-sun);
    .nav-underline {
      width: 100%;
      background: var(--bright-sun);
      box-shadow: 0 0 16px 4px var(--bright-sun);
    }
  }
}
.nav-underline {
  display: block;
  position: absolute;
  left: 0;
  bottom: -2px;
  height: 3px;
  width: 0%;
  background: var(--picton-blue);
  border-radius: 2px;
  transition: width 0.28s cubic-bezier(0.25,0.46,0.45,0.94), background 0.2s;
  pointer-events: none;
}
.theme-toggle {
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  margin-left: 1.2rem;
  display: flex;
  align-items: center;
  position: relative;
  width: 44px;
  height: 44px;
  justify-content: center;
  transition: filter 0.2s;
  &:hover, &:focus-visible {
    filter: brightness(1.2);
  }
  .icon-moon, .icon-sun {
    width: 24px;
    height: 24px;
    display: block;
    transition: transform 0.5s cubic-bezier(0.68,-0.55,0.265,1.55);
  }
  .icon-moon {
    background: url('data:image/svg+xml;utf8,<svg fill="%23ffc940" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 0111.21 3a1 1 0 00-1.13 1.32A7 7 0 1019.68 13.92a1 1 0 001.32-1.13z"/></svg>') no-repeat center/contain;
    transform: rotate(0deg);
    &.rotate { transform: rotate(180deg); }
  }
  .icon-sun {
    background: url('data:image/svg+xml;utf8,<svg fill="%23ffc940" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="5"/><g><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></g></svg>') no-repeat center/contain;
    transform: rotate(0deg);
    &.rotate { transform: rotate(180deg); }
  }
}
.hamburger {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 44px;
  height: 44px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 120;
  .bar {
    width: 28px;
    height: 3.5px;
    background: var(--bright-sun);
    margin: 3px 0;
    border-radius: 2px;
    transition: all 0.32s cubic-bezier(0.25,0.46,0.45,0.94);
    &.open:nth-child(1) { transform: translateY(6px) rotate(45deg); }
    &.open:nth-child(2) { opacity: 0; }
    &.open:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }
  }
}
// Drawer
.nav-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 82vw;
  max-width: 340px;
  height: 100vh;
  background: rgba(41, 53, 63, 0.98);
  box-shadow: -8px 0 32px 0 rgba(32,72,180,0.12);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-left: 1px solid rgba(255,255,255,0.08);
  z-index: 200;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 2.5rem 1.5rem 1.5rem 1.5rem;
  outline: none;
  transition: transform 0.38s cubic-bezier(0.25,0.46,0.45,0.94);
}
.drawer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.drawer-link {
  color: var(--picton-blue);
  font-size: 1.3rem;
  font-weight: 700;
  text-decoration: none;
  position: relative;
  padding: 0.2rem 0.5rem;
  transition: color 0.2s;
  outline: none;
  &:hover, &:focus-visible {
    color: var(--bright-sun);
    .nav-underline {
      width: 100%;
      background: var(--bright-sun);
      box-shadow: 0 0 8px 2px var(--bright-sun);
    }
  }
  &.active {
    color: var(--bright-sun);
    text-shadow: 0 0 8px var(--bright-sun);
    .nav-underline {
      width: 100%;
      background: var(--bright-sun);
      box-shadow: 0 0 16px 4px var(--bright-sun);
    }
  }
}
// Drawer slide animation
.drawer-slide-enter-active, .drawer-slide-leave-active {
  transition: transform 0.38s cubic-bezier(0.25,0.46,0.45,0.94);
}
.drawer-slide-enter-from, .drawer-slide-leave-to {
  transform: translateX(100%);
}
.drawer-slide-enter-to, .drawer-slide-leave-from {
  transform: translateX(0);
}
// Responsive
@media (max-width: 1023px) {
  .nav-bar { height: 60px; }
  .nav-inner { padding: 0 1rem; }
  .nav-logo { font-size: 1.2rem; }
  .theme-toggle { width: 38px; height: 38px; }
  .hamburger { width: 38px; height: 38px; }
}
@media (max-width: 767px) {
  .nav-bar { height: 60px; }
  .nav-inner { padding: 0 0.5rem; }
  .nav-logo { font-size: 1rem; }
}
</style>
