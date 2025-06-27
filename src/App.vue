<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter, RouterView } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import useCursor from '@/composables/useCursor'
import CustomCursor from '@/components/ui/CustomCursor.vue'

// Loading state
const isAppLoading = ref(true)
const isRouteLoading = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const showError = ref(false)
const errorMessage = ref('')
const skipLinkRef = ref<HTMLAnchorElement | null>(null)

// Theme management
const { isDark, toggleTheme } = useTheme()
const themeClass = ref('light-theme')
watch(isDark, (val) => {
  themeClass.value = val ? 'dark-theme' : 'light-theme'
  document.documentElement.classList.toggle('dark-theme', val)
  document.documentElement.classList.toggle('light-theme', !val)
  // Aggiorna meta theme-color
  const meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement
  if (meta) meta.content = val ? '#29353f' : '#ffc940'
})

// Cursor management
const { isVisible: cursorVisible } = useCursor()

// Router loading/progress
const router = useRouter()
let routeTimeout: number | null = null
router.beforeEach((to, from, next) => {
  isRouteLoading.value = true
  next()
})
router.afterEach(() => {
  if (routeTimeout) clearTimeout(routeTimeout)
  routeTimeout = window.setTimeout(() => {
    isRouteLoading.value = false
  }, 400)
})

// Initial loading animation
onMounted(() => {
  setTimeout(() => {
    isAppLoading.value = false
    nextTick(() => {
      if (skipLinkRef.value) skipLinkRef.value.focus()
    })
  }, 1200)
  // Keyboard shortcuts
  window.addEventListener('keydown', onKeydown)
  // Responsive updates
  window.addEventListener('resize', onResize)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', onResize)
})
function onKeydown(e: KeyboardEvent) {
  if (e.ctrlKey && e.key.toLowerCase() === 'd') {
    toggleTheme()
    showToastMessage(isDark.value ? 'Dark mode attivata' : 'Light mode attivata')
  }
  if (e.key === 'Tab' && skipLinkRef.value) {
    skipLinkRef.value.classList.add('skip-link--visible')
    setTimeout(() => skipLinkRef.value?.classList.remove('skip-link--visible'), 2000)
  }
}
function onResize() {
  // Responsive logic, e.g. update safe area, container padding
}
function showToastMessage(msg: string) {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => (showToast.value = false), 2200)
}
</script>

<template>
  <div id="app" :class="themeClass">
    <!-- Skip to content link -->
    <a href="#main-content" class="skip-link" ref="skipLinkRef">Salta al contenuto principale</a>

    <!-- Brand Loading Screen -->
    <transition name="fade">
      <div v-if="isAppLoading" class="app-loading" aria-busy="true" aria-label="Caricamento portfolio Alice Mandelli">
        <div class="brand-logo">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="30" stroke="#ffc940" stroke-width="4" fill="#48a9f8" />
            <text x="32" y="40" text-anchor="middle" font-size="2.2rem" font-family="Inter, sans-serif" fill="#29353f" font-weight="800">A</text>
          </svg>
        </div>
        <div class="brand-loader">
          <span class="loader-dot" v-for="n in 3" :key="n" />
        </div>
      </div>
    </transition>

    <!-- Custom Cursor (desktop only) -->
    <CustomCursor v-if="cursorVisible" />

    <!-- Toast/Notification -->
    <transition name="toast-fade">
      <div v-if="showToast" class="toast" role="status" aria-live="polite">{{ toastMessage }}</div>
    </transition>

    <!-- Error Boundary -->
    <transition name="fade">
      <div v-if="showError" class="error-boundary" role="alert">{{ errorMessage }}</div>
    </transition>

    <!-- Progress Bar per route loading -->
    <transition name="progress-fade">
      <div v-if="isRouteLoading" class="progress-bar" />
    </transition>

    <!-- Main App Container -->
    <div class="app-container" :class="{ 'loading': isRouteLoading }">
      <transition name="page-fade" mode="out-in">
        <RouterView v-slot="{ Component, route }">
          <Suspense>
            <template #default>
              <component :is="Component" :key="route.fullPath" />
            </template>
            <template #fallback>
              <div class="skeleton-screen" aria-busy="true">Caricamento...</div>
            </template>
          </Suspense>
        </RouterView>
      </transition>
    </div>

    <!-- ARIA live region per annunci dinamici -->
    <div aria-live="polite" aria-atomic="true" class="sr-only" id="live-region"></div>
  </div>
</template>

<style lang="scss">
#app {
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, var(--persian-blue), var(--picton-blue));
  position: relative;
  overflow-x: hidden;
  transition: background 0.3s cubic-bezier(0.4,0,0.2,1);
}
.app-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: env(safe-area-inset-top, 2rem) 1rem env(safe-area-inset-bottom, 2rem) 1rem;
  @media (min-width: 768px) {
    padding: env(safe-area-inset-top, 2rem) 2rem env(safe-area-inset-bottom, 2rem) 2rem;
  }
}
.skip-link {
  position: absolute;
  left: -999px;
  top: 0;
  background: var(--bright-sun);
  color: var(--ebony-clay);
  padding: 0.7rem 1.5rem;
  z-index: 2000;
  border-radius: 0 0 8px 8px;
  font-weight: 700;
  font-size: 1.1rem;
  transition: left 0.2s;
  &:focus, &.skip-link--visible {
    left: 0;
  }
}
.app-loading {
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, var(--persian-blue), var(--picton-blue));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  .brand-logo {
    margin-bottom: 2rem;
    svg { display: block; }
  }
  .brand-loader {
    display: flex;
    gap: 0.7rem;
    .loader-dot {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--bright-sun);
      animation: loader-bounce 1.2s infinite alternate;
      &:nth-child(2) { animation-delay: 0.2s; }
      &:nth-child(3) { animation-delay: 0.4s; }
    }
  }
}
@keyframes loader-bounce {
  0% { transform: translateY(0); opacity: 0.7; }
  100% { transform: translateY(-18px); opacity: 1; }
}
.toast {
  position: fixed;
  top: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--bright-sun);
  color: var(--ebony-clay);
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1rem;
  box-shadow: 0 4px 24px 0 var(--bright-sun-alpha);
  z-index: 4000;
  opacity: 0.98;
}
.error-boundary {
  position: fixed;
  top: 4.5rem;
  left: 50%;
  transform: translateX(-50%);
  background: #ff4d4f;
  color: #fff;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1rem;
  box-shadow: 0 4px 24px 0 #ff4d4f44;
  z-index: 4000;
  opacity: 0.98;
}
.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 4px;
  background: linear-gradient(90deg, var(--bright-sun), var(--picton-blue));
  z-index: 3000;
  animation: progress-bar 0.8s linear infinite alternate;
}
@keyframes progress-bar {
  0% { background-position: 0 0; }
  100% { background-position: 100vw 0; }
}
.skeleton-screen {
  min-height: 40vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--persian-blue);
  font-size: 1.3rem;
  font-weight: 600;
  background: linear-gradient(90deg, var(--bright-sun-alpha), var(--picton-blue-alpha));
  animation: skeleton-shimmer 1.2s linear infinite alternate;
}
@keyframes skeleton-shimmer {
  0% { background-position: 0 0; }
  100% { background-position: 100vw 0; }
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  border: 0;
}
// Transitions
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s cubic-bezier(0.4,0,0.2,1); }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.fade-enter-to, .fade-leave-from { opacity: 1; }
.toast-fade-enter-active, .toast-fade-leave-active { transition: opacity 0.3s; }
.toast-fade-enter-from, .toast-fade-leave-to { opacity: 0; }
.toast-fade-enter-to, .toast-fade-leave-from { opacity: 1; }
.progress-fade-enter-active, .progress-fade-leave-active { transition: opacity 0.3s; }
.progress-fade-enter-from, .progress-fade-leave-to { opacity: 0; }
.progress-fade-enter-to, .progress-fade-leave-from { opacity: 1; }
.page-fade-enter-active, .page-fade-leave-active { transition: opacity 0.3s cubic-bezier(0.4,0,0.2,1); }
.page-fade-enter-from, .page-fade-leave-to { opacity: 0; }
.page-fade-enter-to, .page-fade-leave-from { opacity: 1; }
</style>

